import { describe, expect, it } from "vitest";
import { transliterate, translitWord } from "@/lib/translit";

// Golden words: fully vowel-marked spelling → expected transliteration.
// Conventions (content/STYLE.md): zabar/zir/pish on every short vowel, sukun on
// every syllable-final consonant except a morpheme's last letter.
const GOLDEN: [string, string][] = [
  // basic consonants and vowels
  ["کِتاب", "ketâb"],
  ["سَلام", "salâm"],
  ["کُجا", "kojâ"],
  ["تِهْران", "tehrân"],
  ["شَهْر", "shahr"],
  ["مِهْمان", "mehmân"],
  ["سیب", "sib"],
  ["خُداحافِظ", "khodâhâfez"],
  ["وَرْزِش", "varzesh"],
  // morpheme-initial alef and âlef-madde
  ["آب", "âb"],
  ["آمَدَن", "âmadan"],
  ["ایران", "irân"],
  ["این", "in"],
  ["او", "u"],
  ["اُسْتاد", "ostâd"],
  ["اِسْتِکان", "estekân"],
  ["اَسْت", "ast"],
  // و and ی: consonant, vowel, diphthong
  ["هَوا", "havâ"],
  ["پَرْوانه", "parvâne"],
  ["دُنْیا", "donyâ"],
  ["دوسْت", "dust"],
  ["یوسُف", "yusof"],
  ["ویژه", "vizhe"],
  ["کَی", "key"],
  ["کی", "ki"],
  ["نَوروز", "nowruz"],
  ["نَو", "now"],
  ["دُوُم", "dovom"],
  ["پاییز", "pâyiz"],
  ["جایی", "jâyi"],
  ["آیا", "âyâ"],
  ["دانِشْجویی", "dâneshjuyi"],
  ["چای", "chây"],
  // the و that spells o, and the silent و after خ
  ["تُو", "to"],
  ["تو", "tu"],
  ["خُود", "khod"],
  ["اُتُوبوس", "otobus"],
  ["خواهَر", "khâhar"],
  ["خویش", "khish"],
  // long i before a vowel gets a y
  ["بیا", "biyâ"],
  ["هِدیه", "hediye"],
  ["هِدْیه", "hedye"],
  // final he: silent vowel vs consonant h
  ["خانه", "khâne"],
  ["خانِه", "khâne"],
  ["به", "be"],
  ["که", "ke"],
  ["چه", "che"],
  ["نَه", "na"],
  ["ماه", "mâh"],
  ["راه", "râh"],
  ["کوه", "kuh"],
  ["گاه", "gâh"],
  ["دَهْ", "dah"],
  ["دِهْ", "deh"],
  ["شَبیهْ", "shabih"],
  ["گِرِهْ", "gereh"],
  // eyn and hamze
  ["عَلی", "ali"],
  ["عِشْق", "eshq"],
  ["مَعْنی", "ma'ni"],
  ["بَعْد", "ba'd"],
  ["ساعَت", "sâ'at"],
  ["جُمْعه", "jom'e"],
  ["مَسْئَله", "mas'ale"],
  ["رَئیس", "ra'is"],
  ["مُؤْمِن", "mo'men"],
  ["سُؤال", "so'âl"],
  ["قُرْآن", "qor'ân"],
  // tashdid, tanvin, dagger alef
  ["بَچّه", "bachche"],
  ["اَوَّل", "avval"],
  ["مَثَلاً", "masalan"],
  ["حَتّیٰ", "hattâ"],
  ["موسیٰ", "musâ"],
  // hyphen where s/z/k/g meets h
  ["روزْها", "ruz-hâ"],
  ["اِسْهال", "es-hâl"],
  // ZWNJ morphemes
  ["کِتاب‌ها", "ketâbhâ"],
  ["می‌رَوَم", "miravam"],
  ["می‌خوام", "mikhâm"],
  ["می‌رِه", "mire"],
  ["بی‌کار", "bikâr"],
  ["خانه‌ای", "khâne-i"],
  ["خانه‌اَم", "khâne-am"],
  ["بِگو", "begu"],
  // ezafe
  ["کِتابِ", "ketâb-e"],
  ["راهِ", "râh-e"],
  ["خانهٔ", "khâne-ye"],
  ["خانه‌یِ", "khâne-ye"],
  ["صَنْدَلیِ", "sandali-ye"],
  ["دانِشْجویِ", "dâneshju-ye"],
  ["خُدایِ", "khodâ-ye"],
];

describe("translitWord: golden words", () => {
  it.each(GOLDEN)("%s → %s", (fa, expected) => {
    const r = translitWord(fa);
    expect(r.errors).toEqual([]);
    expect(r.text).toBe(expected);
  });
});

describe("translitWord: standalone و", () => {
  it("reads وَ as va", () => expect(translitWord("وَ").text).toBe("va"));
  it("reads وُ as o", () => expect(translitWord("وُ").text).toBe("o"));
  it("rejects a bare standalone و", () => expect(translitWord("و").errors).not.toEqual([]));
});

describe("translitWord: spelling errors it reports", () => {
  it("rejects a bare alef at the start of a morpheme", () => {
    expect(translitWord("است").errors).not.toEqual([]);
  });
  it("rejects a mark it cannot use (sukun on alef)", () => {
    expect(translitWord("کِتاْب").errors).not.toEqual([]);
  });
  it("rejects a kasra on a silent final he (the ezafe is ـهٔ)", () => {
    expect(translitWord("خانهِ").errors).not.toEqual([]);
  });
  it("rejects an ezafe kasra straight on a long vowel letter", () => {
    expect(translitWord("دانِشْجوِ").errors).not.toEqual([]);
  });
  it("rejects Arabic-style long i (kasra before ی)", () => {
    expect(translitWord("کِیف").errors).not.toEqual([]);
  });
  it("rejects Arabic-style long a (zabar before ا)", () => {
    expect(translitWord("کَتاب").errors).toEqual([]); // zabar on ک itself is fine
    expect(translitWord("کِتَاب").errors).not.toEqual([]);
  });
});

describe("transliterate: sentences", () => {
  it("joins words with spaces and keeps ezafe hyphens", () => {
    expect(transliterate("کِتابِ مَن")).toBe("ketâb-e man");
    expect(transliterate("خانهٔ مَن")).toBe("khâne-ye man");
    expect(transliterate("دانِشْجویِ خوب")).toBe("dâneshju-ye khub");
  });
  it("maps Persian punctuation", () => {
    expect(transliterate("سَلام، چِطُوری؟")).toBe("salâm, chetori?");
    expect(transliterate("«سَلام»")).toBe('"salâm"');
  });
  it("maps Persian digits", () => {
    expect(transliterate("۱۲۳")).toBe("123");
  });
  it("leaves no Arabic-script characters behind", () => {
    const out = transliterate("مَن کِتاب را خَریدَم.");
    expect(out).toBe("man ketâb râ kharidam.");
    expect(out).not.toMatch(/[؀-ۿ]/);
  });
});
