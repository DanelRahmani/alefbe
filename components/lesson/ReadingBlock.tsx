// A reading text (Unit 14): a sign, a menu, chat messages, a headline, a story
// or verse, drawn as that thing in CSS. Server-rendered; the marks switch and
// the line reveals are client islands (ReadingShell).

import type { ReadingLine, ReadingStyle } from "@/content/types";
import { parseMarkup, translitOf } from "@/lib/markup";
import { FaText } from "../FaText";
import { Rich } from "../Rich";
import { ReadingShell, RevealLine } from "./ReadingShell";

const LABELS: Record<ReadingStyle, string> = {
  sign: "A sign",
  menu: "A menu",
  chat: "Chat messages",
  headline: "A news headline",
  story: "A story",
  poem: "Verse",
};

function Reveal({ l }: { l: ReadingLine }) {
  const tr = translitOf(parseMarkup(l.fa));
  return (
    <>
      <span lang="fa-Latn" className="reading-tr">
        {tr}
        {l.price && ` · ${translitOf(parseMarkup(l.price))}`}
      </span>
      <span className="reading-en">
        <Rich text={l.en} translit={false} />
      </span>
    </>
  );
}

export function ReadingBlock({ style, title, lines, note }: { style: ReadingStyle; title?: string; lines: ReadingLine[]; note?: string }) {
  return (
    <ReadingShell
      style={style}
      label={`${LABELS[style]}: tap a word for its reading and meaning, or show a line`}
      title={title ? <Rich text={title} /> : undefined}
      note={note ? <Rich text={note} /> : undefined}
    >
      {lines.map((l, i) => {
        const side = style === "chat" ? (l.mine ? "chat-mine" : "chat-theirs") : undefined;
        const cls = [side, l.para && "reading-para"].filter(Boolean).join(" ") || undefined;
        return (
          <RevealLine key={i} n={i + 1} className={cls} reveal={<Reveal l={l} />}>
            {style === "chat" && l.who && <span className="ui reading-who">{l.who}</span>}
            <span className="reading-fa">
              <FaText text={l.fa} translit="none" />
              {l.price && (
                <>
                  <span className="reading-leader" aria-hidden="true" />
                  <FaText text={l.price} translit="none" className="reading-price" />
                </>
              )}
            </span>
          </RevealLine>
        );
      })}
    </ReadingShell>
  );
}
