import { describe, expect, it } from "vitest";
import { checkReadable } from "@/lib/persian/syllables";

describe("checkReadable: fully marked words pass", () => {
  it.each([
    "کِتاب",
    "دوسْت",
    "پَرْوانه",
    "نَوروز",
    "ایسْتْگاه",
    "خانه‌اَم",
    "خونه‌ش",
    "کِتاب‌ها",
    "روزْها",
    "آب",
    "بیا",
  ])("%s", (w) => {
    expect(checkReadable(w)).toEqual([]);
  });
});

describe("checkReadable: missing marks fail", () => {
  it("a word-initial consonant with no vowel", () => {
    expect(checkReadable("کتاب")).not.toEqual([]);
  });
  it("a syllable-final consonant without sukun", () => {
    expect(checkReadable("دوست")).not.toEqual([]);
  });
  it("an unmarked word that would read as vowel + vowel", () => {
    expect(checkReadable("پروانه")).not.toEqual([]);
  });
  it("two vowels in a row", () => {
    expect(checkReadable("بوا")).not.toEqual([]);
  });
  it("spelling errors from the transliteration engine", () => {
    expect(checkReadable("است")).not.toEqual([]);
  });
});
