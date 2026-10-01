"use client";

import Link from "next/link";
import { useState } from "react";
import type { QuizQuestion } from "@/content/types";
import { checkAnswer, checkFa, checkTranslit, type Verdict } from "@/lib/answers";
import { checkDrill, modeInfo, wordById } from "@/lib/drill";
import { DIGITS, formOf, formsOf, letterByChar, type Form } from "@/lib/persian/letters";
import { CLEAR_AFTER, mistakeId, notebookList, type Mistake, type MistakeItem } from "@/lib/mistakes";
import { checkQuizTyped, quizTypeInfo } from "@/lib/quiz";
import { useStore } from "@/lib/storage";
import { drillUiStore, mistakesStore, noteResult } from "@/lib/stores";
import { DrillPrompt, DrillSolution } from "./drill/Drill";
import { VerbPrompt, VerbSolution } from "./verbs/VerbTrainer";
import { VERBS, verbById } from "@/content/verbs";
import { TENSES, hasForm, tenseInfo } from "@/lib/conjugate";
import { checkVerb, describeSpec, type VerbQuestion } from "@/lib/verb-drill";
import { checkVocab } from "@/lib/vocab";
import { VocabPrompt, VocabSolution } from "./vocab/VocabTrainer";
import { checkCloze } from "@/lib/cloze";
import { ClozePrompt, ClozeSolution } from "./cloze/ClozeTrainer";
import { PersianKeyboard } from "./drill/PersianKeyboard";
import { FaText } from "./FaText";
import { Rich } from "./Rich";

/** A lesson's quiz, for replaying its missed questions. */
export interface LessonQuiz {
  number: string;
  title: string;
  href: string;
  questions: QuizQuestion[];
}

/** One notebook item, ready to ask. */
interface Card {
  id: string;
  item: MistakeItem;
  prompt: React.ReactNode;
  /** What the answer is typed in. */
  lang: "fa" | "translit" | "en";
  check: (input: string) => Verdict;
  solution: React.ReactNode;
  from: { label: string; href: string };
}

const SESSION = 12;
const digitIds = new Set(DIGITS.map((d) => d.ch));
const pickForm = (forms: Form[]) => forms[Math.floor(Math.random() * forms.length)] ?? "isolated";

/** What the item is, in a few words, for the list. */
function describe(item: MistakeItem, lessons: Record<string, LessonQuiz>): { what: React.ReactNode; from: string } {
  switch (item.kind) {
    case "lesson": {
      const l = lessons[item.lesson];
      return { what: l ? <Rich text={l.questions[item.q]?.prompt ?? ""} translit={false} force="all" /> : "A lesson question", from: l ? `Lesson ${l.number}` : "A lesson" };
    }
    case "letter":
      return {
        what: (
          <>
            <span className="fa naskh text-xl">{item.ch}</span> · {quizTypeInfo(item.type).title}
          </>
        ),
        from: "Letter quiz and games",
      };
    case "drill":
      return {
        what: wordById.has(item.id) ? (
          <FaText text={wordById.get(item.id)!.fa} translit="none" force="all" />
        ) : (
          <span className="fa naskh text-xl">{item.id}</span>
        ),
        from: `Trainer: ${modeInfo(item.mode).title}`,
      };
    case "word":
      return {
        what: <FaText text={item.fa} translit="none" force="all" />,
        from: item.dir === "read" ? "Games: reading" : "Games: spelling",
      };
    case "verb": {
      const v = verbById.get(item.verb);
      return {
        what: v ? (
          <>
            <FaText text={v.inf} translit="none" force="all" /> · {TENSE_IDS.has(item.tense) ? `${tenseInfo(item.tense).title.toLowerCase()}, ` : ""}{describeSpec(item).replace(/^the /, "")}
          </>
        ) : (
          "A verb form"
        ),
        from: "Verb trainer",
      };
    }
    case "vocab":
      return {
        what: (
          <>
            <FaText text={item.fa} translit="none" force="all" /> · “{item.en}”
          </>
        ),
        from: "Vocabulary deck",
      };
    case "cloze":
      return {
        what: <Rich text={item.en} translit={false} />,
        from: `Cloze practice, lesson ${item.lesson.number}`,
      };
  }
}

const TENSE_IDS = new Set<string>(TENSES.map((t) => t.id));

/** A notebook verb item as a trainer question; null if the verb or the form is gone. */
function verbQuestion(item: Extract<MistakeItem, { kind: "verb" }>): VerbQuestion | null {
  const verb = verbById.get(item.verb);
  if (!verb || !TENSE_IDS.has(item.tense)) return null;
  const spec = { tense: item.tense, person: item.person, style: item.style, negative: item.negative };
  return hasForm(verb, spec, VERBS) ? { verb, spec } : null;
}

/** Turn a notebook item into a question; null if its source no longer exists. Uses randomness: call from events only. */
function cardOf(m: Mistake, lessons: Record<string, LessonQuiz>): Card | null {
  const { item } = m;
  const id = mistakeId(item);
  switch (item.kind) {
    case "lesson": {
      const l = lessons[item.lesson];
      const q = l?.questions[item.q];
      if (!l || !q) return null;
      return {
        id,
        item,
        prompt: <Rich text={q.prompt} translit={q.lang !== "translit"} force="all" />,
        lang: q.lang,
        check: (s) => checkAnswer(q.lang, s, q.answers),
        solution: (
          <>
            Answer: {q.lang === "fa" ? <FaText text={q.answers[0]} translit="none" /> : <strong>{q.answers[0]}</strong>}.{" "}
            <Rich text={q.explain} />
          </>
        ),
        from: { label: `Lesson ${l.number}`, href: l.href },
      };
    }
    case "letter": {
      const l = letterByChar.get(item.ch);
      if (!l) return null;
      const info = quizTypeInfo(item.type);
      const glyph = item.type === "letter-name" || item.type === "letter-sound" || item.type === "form-letter";
      const form = item.type === "form-letter" ? pickForm(formsOf(l).filter((f) => f !== "isolated")) : "isolated";
      const ask =
        item.type === "letter-name"
          ? "What is this letter called?"
          : item.type === "letter-sound"
            ? "What sound does it spell?"
            : item.type === "form-letter"
              ? `Which letter is this? Type it. (${form} form)`
              : "Which letter is it? Type it.";
      return {
        id,
        item,
        prompt: (
          <div className="drill-prompt">
            {glyph ? (
              <p className="drill-glyph naskh" lang="fa" dir="rtl">
                {formOf(l, form)}
              </p>
            ) : (
              <p className="drill-name">
                {l.name}
                {item.type === "sound-letter" && (
                  <>
                    {" "}
                    <span className="text-muted">·</span> {l.sounds[0]}
                  </>
                )}
              </p>
            )}
            <p className="ui drill-sub">{ask}</p>
          </div>
        ),
        lang: info.typed === "fa" ? "fa" : "translit",
        check: (s) => checkQuizTyped(item.type, l, s),
        solution: (
          <>
            <span className="fa text-2xl">{l.ch}</span> is <strong>{l.name}</strong>: <Rich text={l.hint} />.
          </>
        ),
        from: { label: "Letter quiz", href: "/practice/quiz" },
      };
    }
    case "drill": {
      const isLetter = item.mode === "sound" || item.mode === "letter";
      if (isLetter ? !letterByChar.has(item.id) && !digitIds.has(item.id) : !wordById.has(item.id)) return null;
      const l = letterByChar.get(item.id);
      const form = l ? pickForm(formsOf(l)) : "isolated";
      return {
        id,
        item,
        prompt: <DrillPrompt mode={item.mode} id={item.id} form={form} />,
        lang: modeInfo(item.mode).answer === "fa" ? "fa" : "translit",
        check: (s) => checkDrill(item.mode, item.id, s),
        solution: <DrillSolution mode={item.mode} id={item.id} />,
        from: { label: `Trainer: ${modeInfo(item.mode).title}`, href: `/practice/drill/${item.mode}` },
      };
    }
    case "word": {
      const read = item.dir === "read";
      return {
        id,
        item,
        prompt: read ? (
          <div className="drill-prompt">
            <p className="drill-word">
              <FaText text={item.fa} translit="none" force="all" />
            </p>
            <p className="ui drill-sub">type how it sounds</p>
          </div>
        ) : (
          <div className="drill-prompt">
            <p className="drill-name">{item.translit}</p>
            <p className="ui drill-sub">“{item.en}” · write it in Persian script</p>
          </div>
        ),
        lang: read ? "translit" : "fa",
        check: (s) => (read ? checkTranslit(s, [item.translit]) : checkFa(s, [item.fa])),
        solution: (
          <>
            <FaText text={item.fa} translit="none" force="all" className="text-2xl" /> <em>{item.translit}</em>, “{item.en}”.
          </>
        ),
        from: { label: "Games", href: "/practice#games" },
      };
    }
    case "verb": {
      const vq = verbQuestion(item);
      if (!vq) return null;
      return {
        id,
        item,
        prompt: <VerbPrompt q={vq} />,
        lang: "fa",
        check: (s) => checkVerb(vq, s),
        solution: <VerbSolution q={vq} />,
        from: { label: "Verb trainer", href: "/verbs" },
      };
    }
    case "vocab":
      return {
        id,
        item,
        prompt: <VocabPrompt card={item} />,
        lang: "fa",
        // Only this card: typing another word with the same English simply counts as wrong here.
        check: (s) => checkVocab(item, [], s),
        solution: <VocabSolution card={item} />,
        from: { label: "Vocabulary deck", href: "/vocab" },
      };
    case "cloze":
      return {
        id,
        item,
        prompt: <ClozePrompt card={item} />,
        lang: "fa",
        check: (s) => checkCloze(item, s),
        solution: <ClozeSolution card={item} />,
        from: { label: "Cloze practice", href: "/practice/cloze" },
      };
  }
}

function Review({ cards, onEnd }: { cards: Card[]; onEnd: () => void }) {
  const nb = useStore(mistakesStore);
  const ui = useStore(drillUiStore);
  const [at, setAt] = useState(0);
  const [input, setInput] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const card = cards[at];

  if (!card) {
    const right = results.filter(Boolean).length;
    const cleared = cards.filter((c) => !nb[c.id]).length;
    return (
      <div className="ui drill-panel" role="status">
        <p className="text-lg font-medium">
          {right} of {cards.length} right.
        </p>
        <p className="mt-1">
          {cleared === 0
            ? "Nothing cleared yet: an item leaves after two right answers in a row."
            : `${cleared} ${cleared === 1 ? "item has" : "items have"} left the notebook.`}
        </p>
        <button type="button" className="drill-btn mt-4" onClick={onEnd} autoFocus>
          Back to the notebook
        </button>
      </div>
    );
  }

  const fa = card.lang === "fa";
  const standing = nb[card.id];
  const next = () => {
    setAt(at + 1);
    setInput("");
    setVerdict(null);
  };
  const submit = () => {
    if (verdict) return next();
    if (!input.trim()) return;
    const v = card.check(input);
    setVerdict(v);
    setResults((r) => [...r, v.ok]);
    noteResult(card.item, v.ok);
  };

  return (
    <div className="drill">
      <div className="ui session-head">
        <span>
          {at + 1} of {cards.length} · {results.filter(Boolean).length} right
        </span>
        <div className="session-bar" aria-hidden="true">
          <span style={{ width: `${(100 * at) / cards.length}%` }} />
        </div>
        <button type="button" className="text-sm underline underline-offset-4" onClick={onEnd}>
          End
        </button>
      </div>
      <div className="drill-card">
        {card.item.kind === "lesson" ? <div className="drill-prompt has-fa text-lg">{card.prompt}</div> : card.prompt}
        <p className="ui mt-1 text-center text-xs text-muted">
          From{" "}
          <Link href={card.from.href} className="underline underline-offset-4">
            {card.from.label}
          </Link>
        </p>
        <form
          key={at}
          className="mt-4"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <label htmlFor="review-input" className="sr-only">
            Your answer
          </label>
          <div className="flex gap-2">
            <input
              id="review-input"
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              readOnly={!!verdict}
              dir={fa ? "rtl" : "ltr"}
              lang={fa ? "fa" : card.lang === "translit" ? "fa-Latn" : "en"}
              inputMode={fa && ui.keyboard ? "none" : "text"}
              className={fa ? "quiz-input fa" : "quiz-input"}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <button type="submit" className="ui quiz-check">
              {verdict ? "Next" : "Check"}
            </button>
          </div>
          {fa && (
            <div className="mt-3">
              <button
                type="button"
                className="ui text-sm text-muted underline underline-offset-4"
                onClick={() => drillUiStore.set((u) => ({ ...u, keyboard: !u.keyboard }))}
                aria-expanded={ui.keyboard}
              >
                {ui.keyboard ? "Hide the Persian keyboard" : "Show the Persian keyboard"}
              </button>
              {ui.keyboard && (
                <PersianKeyboard onInsert={(t) => !verdict && setInput((v) => v + t)} onBackspace={() => !verdict && setInput((v) => v.slice(0, -1))} />
              )}
            </div>
          )}
        </form>
        <div role="status" className="ui mt-3">
          {verdict && (
            <div className={`quiz-fb ${verdict.ok ? "quiz-ok" : "quiz-no"}`}>
              <p className="font-medium">{verdict.ok ? "Correct." : "Not quite."}</p>
              {verdict.note && <p>{verdict.note}</p>}
              {verdict.hint && <p>{verdict.hint}</p>}
              <p className="has-fa">{card.solution}</p>
              <p className="text-sm">
                {!standing
                  ? "Cleared from the notebook."
                  : verdict.ok
                    ? `${standing.streak} of ${CLEAR_AFTER} right in a row.`
                    : "It stays in the notebook."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function MistakeNotebook({ lessons }: { lessons: Record<string, LessonQuiz> }) {
  const nb = useStore(mistakesStore);
  const [cards, setCards] = useState<Card[] | null>(null);
  const list = notebookList(nb);

  const start = () => {
    const made = list.map((m) => cardOf(m, lessons)).filter((c): c is Card => c !== null);
    setCards(made.slice(0, SESSION));
  };
  const remove = (id: string) =>
    mistakesStore.set((n) => {
      const next = { ...n };
      delete next[id];
      return next;
    });

  if (cards) return <Review cards={cards} onEnd={() => setCards(null)} />;

  if (list.length === 0) {
    return (
      <div className="ui empty-state">
        <p className="font-medium">Nothing to review.</p>
        <p className="mt-1 text-sm text-muted">
          Wrong answers from lesson quizzes, the trainers, the letter quiz and the games land here, and leave after two right
          answers in a row.
        </p>
        <Link href="/practice" className="chip mt-3 inline-block">
          Go to practice
        </Link>
      </div>
    );
  }

  return (
    <div className="ui">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="drill-btn" onClick={start}>
          Review {Math.min(list.length, SESSION)} {list.length === 1 ? "mistake" : "mistakes"}
        </button>
        <span className="text-sm text-muted">
          {list.length} in the notebook{list.length > SESSION ? `; the ${SESSION} most recent first` : ""}.
        </span>
      </div>
      <ul className="notebook">
        {list.map((m) => {
          const id = mistakeId(m.item);
          const d = describe(m.item, lessons);
          return (
            <li key={id} className="notebook-row">
              <span className="notebook-what has-fa">{d.what}</span>
              <span className="notebook-meta">
                {d.from} · missed {m.misses === 1 ? "once" : `${m.misses} times`}
                {m.streak > 0 && ` · ${m.streak} of ${CLEAR_AFTER} right`}
              </span>
              <button type="button" className="notebook-remove" onClick={() => remove(id)} aria-label="Remove from the notebook">
                ✕
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
