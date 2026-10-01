import { describe, expect, it } from "vitest";
import { CLEAR_AFTER, NOTEBOOK_MAX, mistakeId, noteAnswer, notebookList, type MistakeItem, type Notebook } from "@/lib/mistakes";

const be: MistakeItem = { kind: "letter", type: "letter-name", ch: "ب" };
const q: MistakeItem = { kind: "lesson", lesson: "sounds/stress", q: 1 };

describe("mistake notebook", () => {
  it("ids are stable and distinct per item", () => {
    expect(mistakeId(be)).toBe("letter:letter-name:ب");
    expect(mistakeId(q)).toBe("lesson:sounds/stress:1");
    expect(mistakeId({ kind: "drill", mode: "read", id: "ketab" })).toBe("drill:read:ketab");
    expect(mistakeId({ kind: "verb", verb: "raftan", tense: "present", person: "1p", style: "spoken", negative: true })).toBe("verb:raftan:present:1p:spoken:neg");
    expect(mistakeId({ kind: "vocab", id: "کِتاب", fa: "کِتاب", en: "book" })).toBe("vocab:کِتاب");
    const cloze: MistakeItem = { kind: "cloze", id: "past/simple-past#abc", fa: "x", en: "y", parts: [], gaps: [], answer: "z", lesson: { number: "7.1", href: "/learn/past/simple-past" } };
    expect(mistakeId(cloze)).toBe("cloze:past/simple-past#abc");
  });

  it("a miss enters the notebook; a right answer on an unknown item changes nothing", () => {
    const empty: Notebook = {};
    expect(noteAnswer(empty, be, true, 1)).toBe(empty);
    const nb = noteAnswer(empty, be, false, 1);
    expect(nb[mistakeId(be)]).toEqual({ item: be, at: 1, misses: 1, streak: 0 });
  });

  it(`clears after ${CLEAR_AFTER} right answers in a row, and a miss resets the run`, () => {
    let nb = noteAnswer({}, be, false, 1);
    nb = noteAnswer(nb, be, true, 2);
    expect(nb[mistakeId(be)].streak).toBe(1);
    nb = noteAnswer(nb, be, false, 3);
    expect(nb[mistakeId(be)]).toMatchObject({ streak: 0, misses: 2, at: 3 });
    nb = noteAnswer(nb, be, true, 4);
    nb = noteAnswer(nb, be, true, 5);
    expect(nb[mistakeId(be)]).toBeUndefined();
  });

  it("lists the most recent miss first", () => {
    let nb = noteAnswer({}, be, false, 1);
    nb = noteAnswer(nb, q, false, 2);
    expect(notebookList(nb).map((m) => m.item)).toEqual([q, be]);
  });

  it(`keeps at most ${NOTEBOOK_MAX} items, dropping the oldest`, () => {
    let nb: Notebook = {};
    for (let i = 0; i <= NOTEBOOK_MAX; i++) nb = noteAnswer(nb, { kind: "drill", mode: "read", id: `w${i}` }, false, i);
    expect(Object.keys(nb)).toHaveLength(NOTEBOOK_MAX);
    expect(nb["drill:read:w0"]).toBeUndefined();
    expect(nb[`drill:read:w${NOTEBOOK_MAX}`]).toBeDefined();
  });
});
