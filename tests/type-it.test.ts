import { describe, expect, it } from "vitest";
import { TYPE_ITEMS } from "@/content/type-it";
import { checkCopy, spacingIssues, typeRound, type TypeItem } from "@/lib/games";
import { ARABIC_SCRIPT, ZWNJ } from "@/lib/persian/chars";
import { normalizeFa } from "@/lib/persian/normalize";

const MI_KHARAM = `می${ZWNJ}خَرَم.`;

describe("checkCopy", () => {
  it("accepts the text as shown, with or without vowel marks and punctuation", () => {
    expect(checkCopy(`می${ZWNJ}خرم`, MI_KHARAM)).toEqual({ ok: true });
    expect(checkCopy(MI_KHARAM, MI_KHARAM)).toEqual({ ok: true });
  });
  it("accepts Arabic ي and ك silently", () => {
    expect(checkCopy("كتاب‌ها", `کِتاب${ZWNJ}ها`).ok).toBe(true);
    expect(checkCopy("خوبي", "خوبی").ok).toBe(true);
  });
  it("names a half-space typed as a space, or left out", () => {
    expect(checkCopy("می خرم", MI_KHARAM)).toEqual({ ok: false, hint: "Half-space between می and خرم (you typed a space)." });
    expect(checkCopy("میخرم", MI_KHARAM).hint).toBe("Half-space between می and خرم (you typed nothing).");
  });
  it("names a half-space where a space belongs, and a stray gap", () => {
    const target = `مَن نان می${ZWNJ}خَرَم.`;
    expect(checkCopy(`من${ZWNJ}نان می${ZWNJ}خرم`, target).hint).toBe("Space between من and نان (you typed a half-space).");
    expect(checkCopy("کتا ب", "کِتاب").hint).toBe("No gap between کتا and ب (you typed a space).");
  });
  it("points out a same-sound letter", () => {
    expect(checkCopy("ساعت", "صاعَت").hint).toMatch(/Same sound, other letter/);
  });
  it("wants the spelling shown, not a variant", () => {
    expect(checkCopy("بلیط", "بِلیت")).toEqual({ ok: false, hint: "That spelling is also seen, but copy the one shown." });
  });
});

describe("spacingIssues", () => {
  it("is null when the letters differ", () => {
    expect(spacingIssues("من", "تو")).toBeNull();
  });
});

describe("typeRound", () => {
  const items: TypeItem[] = [
    ...Array.from({ length: 6 }, (_, i) => ({ fa: `می${ZWNJ}رَوَم${i}`, en: "", translit: "" })),
    ...Array.from({ length: 6 }, (_, i) => ({ fa: `مَن${i}`, en: "", translit: "" })),
  ];
  it("gives half the items a half-space", () => {
    const r = typeRound(items, 8, Math.random);
    expect(r).toHaveLength(8);
    expect(r.filter((x) => x.fa.includes(ZWNJ))).toHaveLength(4);
    expect(new Set(r.map((x) => x.fa)).size).toBe(8);
  });
  it("fills up from the other kind when one runs short", () => {
    const r = typeRound(items.slice(0, 7), 8, Math.random);
    expect(r).toHaveLength(7);
  });
});

describe("the Type it items", () => {
  it("are plenty, and many carry a half-space", () => {
    expect(TYPE_ITEMS.length).toBeGreaterThan(100);
    expect(TYPE_ITEMS.filter((x) => x.fa.includes(ZWNJ)).length).toBeGreaterThan(30);
  });
  it("are plain Persian with a clean reading and a meaning", () => {
    for (const it of TYPE_ITEMS) {
      expect(it.fa, it.fa).not.toMatch(/[{}*[\]|]/);
      expect(normalizeFa(it.fa).length, it.fa).toBeGreaterThan(0);
      expect(it.en.length, it.fa).toBeGreaterThan(0);
      expect(ARABIC_SCRIPT.test(it.translit), it.translit).toBe(false);
    }
  });
  it("are each correct when typed exactly as shown", () => {
    for (const it of TYPE_ITEMS) expect(checkCopy(it.fa, it.fa).ok, it.fa).toBe(true);
  });
});
