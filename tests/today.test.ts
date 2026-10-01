import { describe, expect, it } from "vitest";
import { PERSIAN_MONTHS } from "@/content/calendar";
import { emptyActivity, record } from "@/lib/activity";
import { DRILL_GROUPS, drillCandidates } from "@/lib/drill";
import { normalizeFa } from "@/lib/persian/normalize";
import { DAY, emptyDeck, schedule, type DeckState } from "@/lib/srs";
import { goalProgress, iranianDate, pickForDay, reviewHref, reviewsDue } from "@/lib/today";
import { emptyVerbsData, verbGroups } from "@/lib/verb-drill";
import { emptyVocabData } from "@/lib/vocab";

const NOW = new Date(2026, 8, 30, 12).getTime();

function deckWith(ids: string[], due: number, unlocked = 1): DeckState {
  const cards = Object.fromEntries(ids.map((id) => [id, { ...schedule(undefined, true, 0), due }]));
  return { ...emptyDeck(), unlocked, cards };
}

describe("drillCandidates", () => {
  it("gives a letter deck its open groups", () => {
    expect(drillCandidates("sound", {})).toEqual(DRILL_GROUPS[0]);
    expect(drillCandidates("letter", { letter: { cards: {}, unlocked: 2 } })).toEqual([...DRILL_GROUPS[0], ...DRILL_GROUPS[1]]);
  });
  it("gives the word decks the words spelt with letters open in letter → sound", () => {
    const few = drillCandidates("read", {});
    const more = drillCandidates("read", { sound: { cards: {}, unlocked: 8 } });
    expect(more.length).toBeGreaterThan(few.length);
    expect(drillCandidates("spell", { sound: { cards: {}, unlocked: 8 } })).toEqual(more);
  });
});

describe("reviewsDue", () => {
  it("counts due cards across decks and names the fullest", () => {
    const g = DRILL_GROUPS[0];
    const r = reviewsDue({ sound: deckWith(g.slice(0, 2), NOW - 1), letter: deckWith(g.slice(0, 4), NOW - 1) }, NOW);
    expect(r.byMode).toEqual({ sound: 2, letter: 4, read: 0, spell: 0 });
    expect(r.total).toBe(6);
    expect(r.top).toBe("letter");
  });
  it("ignores new cards and cards not yet due", () => {
    const r = reviewsDue({ sound: deckWith(DRILL_GROUPS[0], NOW + DAY) }, NOW);
    expect(r.total).toBe(0);
    expect(r.top).toBeNull();
  });
  it("counts conjugation-trainer items and links there when they lead", () => {
    const verbs = { ...emptyVerbsData(), decks: { present: deckWith(verbGroups("present")[0].slice(0, 3), NOW - 1) } };
    const r = reviewsDue({ sound: deckWith(DRILL_GROUPS[0].slice(0, 2), NOW - 1) }, NOW, verbs);
    expect(r.verbs).toBe(3);
    expect(r.total).toBe(5);
    expect(r.top).toBe("verbs");
    expect(reviewHref(r.top!)).toBe("/verbs");
    expect(reviewHref("letter")).toBe("/practice/drill/letter");
  });
  it("counts vocabulary cards, skips words that left the course, and links there when they lead", () => {
    const vocab = { data: { ...emptyVocabData(), deck: deckWith(["کِتاب", "خانه", "gone"], NOW - 1) }, known: new Set(["کِتاب", "خانه"]) };
    const r = reviewsDue({ sound: deckWith(DRILL_GROUPS[0].slice(0, 1), NOW - 1) }, NOW, emptyVerbsData(), vocab);
    expect(r.vocab).toBe(2);
    expect(r.total).toBe(3);
    expect(r.top).toBe("vocab");
    expect(reviewHref("vocab")).toBe("/vocab");
    expect(reviewsDue({}, NOW).vocab).toBe(0);
  });
  it("counts cloze cards and links there when they lead", () => {
    const cloze = { deck: deckWith(["past/simple-past#a", "past/simple-past#b", "nouns/ezafe#c"], NOW - 1) };
    const r = reviewsDue({ sound: deckWith(DRILL_GROUPS[0].slice(0, 1), NOW - 1) }, NOW, emptyVerbsData(), undefined, { cloze });
    expect(r.cloze).toBe(3);
    expect(r.total).toBe(4);
    expect(r.top).toBe("cloze");
    expect(reviewHref("cloze")).toBe("/practice/cloze");
    expect(reviewsDue({}, NOW).cloze).toBe(0);
  });
  it("counts the spoken and written drill in both directions, and links there when it leads", () => {
    const convert = { dir: "to-written" as const, decks: { "to-written": deckWith(["a#1", "b#2"], NOW - 1), "to-spoken": deckWith(["a#1"], NOW - 1) } };
    const r = reviewsDue({}, NOW, emptyVerbsData(), undefined, { convert });
    expect(r.convert).toBe(3);
    expect(r.top).toBe("convert");
    expect(reviewHref("convert")).toBe("/practice/convert");
  });
  it("ignores verb items outside the open groups", () => {
    const verbs = { ...emptyVerbsData(), decks: { present: deckWith(verbGroups("present")[1], NOW - 1) } };
    expect(reviewsDue({}, NOW, verbs).verbs).toBe(0);
  });
  it("ignores cards of groups that are no longer candidates", () => {
    // A card from group 2 while only group 1 is open (e.g. after an import).
    const r = reviewsDue({ sound: deckWith(DRILL_GROUPS[1], NOW - 1, 1) }, NOW);
    expect(r.total).toBe(0);
  });
});

describe("goalProgress", () => {
  const now = new Date(NOW);
  it("counts today's activities against the goal", () => {
    let a = emptyActivity();
    a = record(a, { kind: "drill", count: 3 }, now);
    a = record(a, { kind: "lesson" }, now);
    a = record(a, { kind: "game", count: 9 }, new Date(NOW - DAY));
    expect(goalProgress(a, now, 10)).toEqual({ done: 4, goal: 10, met: false, fraction: 0.4 });
  });
  it("caps the ring at full once the goal is met", () => {
    const a = record(emptyActivity(), { kind: "trace", count: 12 }, now);
    expect(goalProgress(a, now, 5)).toMatchObject({ met: true, fraction: 1 });
  });
});

describe("pickForDay", () => {
  const list = Array.from({ length: 273 }, (_, i) => i);
  it("is stable through the day", () => {
    expect(pickForDay(list, new Date(2026, 8, 30, 0, 5))).toBe(pickForDay(list, new Date(2026, 8, 30, 23, 55)));
  });
  it("shows every item once before repeating", () => {
    const seen = new Set<number>();
    for (let d = 0; d < list.length; d++) seen.add(pickForDay(list, new Date(2026, 0, 1 + d))!);
    expect(seen.size).toBe(list.length);
  });
  it("jumps around the list rather than walking it", () => {
    const a = pickForDay(list, new Date(2026, 8, 30))!;
    const b = pickForDay(list, new Date(2026, 9, 1))!;
    expect(Math.abs(a - b)).toBeGreaterThan(20);
  });
  it("handles empty and tiny lists", () => {
    expect(pickForDay([], new Date())).toBeUndefined();
    expect(pickForDay(["x"], new Date())).toBe("x");
    expect(pickForDay([1, 2], new Date(2026, 0, 1))).not.toBe(pickForDay([1, 2], new Date(2026, 0, 2)));
  });
});

describe("iranianDate", () => {
  it("gives today in the Iranian calendar", () => {
    const d = iranianDate(new Date(2026, 8, 30, 12))!;
    expect(d).toMatchObject({ day: 8, month: 7, year: 1405, monthName: "Mehr", en: "8 Mehr 1405" });
    expect(d.fa).toBe("چهارشنبه ۸ مهر ۱۴۰۵");
  });
  it("starts the year at Nowruz", () => {
    expect(iranianDate(new Date(2026, 2, 21, 12))).toMatchObject({ day: 1, month: 1, year: 1405, monthName: "Farvardin" });
    expect(iranianDate(new Date(2026, 2, 20, 12))).toMatchObject({ day: 29, month: 12, year: 1404, monthName: "Esfand" });
  });
  it("capitalises â in month names", () => {
    expect(iranianDate(new Date(2026, 9, 23, 12))?.monthName).toBe("Âbân");
  });
  it("marks the same month names Intl writes", () => {
    for (let m = 0; m < 12; m++) {
      // The 15th of each Iranian month: Farvardin 15 is about 4 April.
      const date = new Date(2026, 3, 4 + Math.round(m * 30.4), 12);
      const d = iranianDate(date)!;
      const intl = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { month: "long" }).format(date);
      expect(normalizeFa(PERSIAN_MONTHS[d.month - 1])).toBe(intl);
    }
  });
});
