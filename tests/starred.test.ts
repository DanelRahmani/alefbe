import { describe, expect, it } from "vitest";
import { CSV_HEADERS, faIn, starKey, starredCsv, starredList, toggleStar, type Starred } from "@/lib/starred";

const book = { fa: "{کِتاب}", en: "book", source: "Dictionary", href: "/dictionary?q=کِتاب" };
const hi = { fa: "حالِت چِطُوره؟", written: "حالَت چِطُور اَسْت؟", en: "How are *you*?", source: "Lesson 3.7", href: "/learn/spelling/punctuation" };

describe("starred items", () => {
  it("keys by the Persian without markup, so a word starred twice is one item", () => {
    expect(starKey("{کِتاب}")).toBe("کِتاب");
    let s: Starred = toggleStar({}, book, 1);
    expect(Object.keys(s)).toEqual(["کِتاب"]);
    s = toggleStar(s, { ...book, fa: "کِتاب" }, 2);
    expect(s).toEqual({});
  });

  it("lists items in the order they were starred", () => {
    const s = toggleStar(toggleStar({}, hi, 5), book, 9);
    expect(starredList(s).map((i) => i.source)).toEqual(["Lesson 3.7", "Dictionary"]);
  });

  it("shows the Persian in each vowel mode", () => {
    expect(faIn("{کِتاب}", "all")).toBe("کِتاب");
    expect(faIn("{کِتاب}", "none")).toBe("کتاب");
    // The pish that only marks an o-spelling و is never shown.
    expect(faIn("تُو", "all")).toBe("تو");
  });

  it("exports CSV with a BOM, a header row, quoted cells and CRLF", () => {
    const csv = starredCsv(toggleStar(toggleStar({}, hi, 1), book, 2));
    expect(csv.charCodeAt(0)).toBe(0xfeff);
    const lines = csv.slice(1).trimEnd().split("\r\n");
    expect(lines[0]).toBe(CSV_HEADERS.map((h) => `"${h}"`).join(","));
    // The o-spelling pish (چِطُوره) is authoring-only, so the export drops it like the display does.
    expect(lines[1]).toBe('"حالِت چِطوره؟","حالت چطوره؟","hâlet chetore?","حالَت چِطور اَسْت؟","How are you?","Lesson 3.7"');
    expect(lines[2]).toBe('"کِتاب","کتاب","ketâb","","book","Dictionary"');
  });

  it("doubles quotes inside a cell", () => {
    const csv = starredCsv(toggleStar({}, { ...book, en: 'the "book"' }, 1));
    expect(csv).toContain('"the ""book"""');
  });
});
