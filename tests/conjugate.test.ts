import { describe, expect, it } from "vitest";
import { VERBS, verbById } from "@/content/verbs";
import { PERSONS, STYLES, TENSES, acceptedAnswers, allForms, conjugate, endsInVowel, englishOf, lacks, table, unmarked, type Style } from "@/lib/conjugate";
import { parseMarkup, splitScript } from "@/lib/markup";
import { checkReadable } from "@/lib/persian/syllables";
import { transliterateWithErrors } from "@/lib/translit";
import { ZWNJ } from "@/lib/persian/chars";

/** Golden rows: six forms separated by spaces, "_" standing for the half-space, "+" for a space. */
const row = (s: string) => s.split(" ").map((f) => f.replace(/_/g, ZWNJ).replace(/\+/g, " "));

// Written by hand from the references, not from the engine: the present,
// affirmative, spoken (Tehrani) then written, persons 1s 2s 3s 1p 2p 3p.
// The past tenses are in tests/conjugate-past.test.ts.

/** The verbs with a present in the engine: all but بودن (lesson 4.2 teaches its present). */
const PRESENT_VERBS = VERBS.filter((v) => !lacks(v, "present", false, VERBS));
const GOLDEN: Record<string, Record<Style, string>> = {
  raftan: {
    spoken: "می_رَم می_ری می_ره می_ریم می_رین می_رَن",
    written: "می_رَوَم می_رَوی می_رَوَد می_رَویم می_رَوید می_رَوَنْد",
  },
  âmadan: {
    spoken: "میام میای میاد میاییم میایین میان",
    written: "می_آیَم می_آیی می_آیَد می_آییم می_آیید می_آیَنْد",
  },
  kardan: {
    spoken: "می_کُنَم می_کُنی می_کُنه می_کُنیم می_کُنین می_کُنَن",
    written: "می_کُنَم می_کُنی می_کُنَد می_کُنیم می_کُنید می_کُنَنْد",
  },
  shodan: {
    spoken: "می_شَم می_شی می_شه می_شیم می_شین می_شَن",
    written: "می_شَوَم می_شَوی می_شَوَد می_شَویم می_شَوید می_شَوَنْد",
  },
  goftan: {
    spoken: "می_گَم می_گی می_گه می_گیم می_گین می_گَن",
    written: "می_گویَم می_گویی می_گویَد می_گوییم می_گویید می_گویَنْد",
  },
  dâdan: {
    spoken: "می_دَم می_دی می_ده می_دیم می_دین می_دَن",
    written: "می_دَهَم می_دَهی می_دَهَد می_دَهیم می_دَهید می_دَهَنْد",
  },
  didan: {
    spoken: "می_بینَم می_بینی می_بینه می_بینیم می_بینین می_بینَن",
    written: "می_بینَم می_بینی می_بینَد می_بینیم می_بینید می_بینَنْد",
  },
  khâstan: {
    spoken: "می_خوام می_خوای می_خواد می_خواییم می_خوایین می_خوان",
    written: "می_خواهَم می_خواهی می_خواهَد می_خواهیم می_خواهید می_خواهَنْد",
  },
  dânestan: {
    spoken: "می_دونَم می_دونی می_دونه می_دونیم می_دونین می_دونَن",
    written: "می_دانَم می_دانی می_دانَد می_دانیم می_دانید می_دانَنْد",
  },
  tavânestan: {
    spoken: "می_تونَم می_تونی می_تونه می_تونیم می_تونین می_تونَن",
    written: "می_تَوانَم می_تَوانی می_تَوانَد می_تَوانیم می_تَوانید می_تَوانَنْد",
  },
  dâshtan: {
    spoken: "دارَم داری داره داریم دارین دارَن",
    written: "دارَم داری دارَد داریم دارید دارَنْد",
  },
  khordan: {
    spoken: "می_خُورَم می_خُوری می_خُوره می_خُوریم می_خُورین می_خُورَن",
    written: "می_خُورَم می_خُوری می_خُورَد می_خُوریم می_خُورید می_خُورَنْد",
  },
  kharidan: {
    spoken: "می_خَرَم می_خَری می_خَره می_خَریم می_خَرین می_خَرَن",
    written: "می_خَرَم می_خَری می_خَرَد می_خَریم می_خَرید می_خَرَنْد",
  },
  neveshtan: {
    spoken: "می_نِویسَم می_نِویسی می_نِویسه می_نِویسیم می_نِویسین می_نِویسَن",
    written: "می_نِویسَم می_نِویسی می_نِویسَد می_نِویسیم می_نِویسید می_نِویسَنْد",
  },
  khândan: {
    spoken: "می_خونَم می_خونی می_خونه می_خونیم می_خونین می_خونَن",
    written: "می_خوانَم می_خوانی می_خوانَد می_خوانیم می_خوانید می_خوانَنْد",
  },
  gereftan: {
    spoken: "می_گیرَم می_گیری می_گیره می_گیریم می_گیرین می_گیرَن",
    written: "می_گیرَم می_گیری می_گیرَد می_گیریم می_گیرید می_گیرَنْد",
  },
  zadan: {
    spoken: "می_زَنَم می_زَنی می_زَنه می_زَنیم می_زَنین می_زَنَن",
    written: "می_زَنَم می_زَنی می_زَنَد می_زَنیم می_زَنید می_زَنَنْد",
  },
  âvardan: {
    spoken: "میارَم میاری میاره میاریم میارین میارَن",
    written: "می_آوَرَم می_آوَری می_آوَرَد می_آوَریم می_آوَرید می_آوَرَنْد",
  },
  gozâshtan: {
    spoken: "می_ذارَم می_ذاری می_ذاره می_ذاریم می_ذارین می_ذارَن",
    written: "می_گُذارَم می_گُذاری می_گُذارَد می_گُذاریم می_گُذارید می_گُذارَنْد",
  },
  porsidan: {
    spoken: "می_پُرْسَم می_پُرْسی می_پُرْسه می_پُرْسیم می_پُرْسین می_پُرْسَن",
    written: "می_پُرْسَم می_پُرْسی می_پُرْسَد می_پُرْسیم می_پُرْسید می_پُرْسَنْد",
  },
  fahmidan: {
    spoken: "می_فَهْمَم می_فَهْمی می_فَهْمه می_فَهْمیم می_فَهْمین می_فَهْمَن",
    written: "می_فَهْمَم می_فَهْمی می_فَهْمَد می_فَهْمیم می_فَهْمید می_فَهْمَنْد",
  },
  shenâkhtan: {
    spoken: "می_شِناسَم می_شِناسی می_شِناسه می_شِناسیم می_شِناسین می_شِناسَن",
    written: "می_شِناسَم می_شِناسی می_شِناسَد می_شِناسیم می_شِناسید می_شِناسَنْد",
  },
  "kâr-kardan": {
    spoken: "کار+می_کُنَم کار+می_کُنی کار+می_کُنه کار+می_کُنیم کار+می_کُنین کار+می_کُنَن",
    written: "کار+می_کُنَم کار+می_کُنی کار+می_کُنَد کار+می_کُنیم کار+می_کُنید کار+می_کُنَنْد",
  },
  "harf-zadan": {
    spoken: "حَرْف+می_زَنَم حَرْف+می_زَنی حَرْف+می_زَنه حَرْف+می_زَنیم حَرْف+می_زَنین حَرْف+می_زَنَن",
    written: "حَرْف+می_زَنَم حَرْف+می_زَنی حَرْف+می_زَنَد حَرْف+می_زَنیم حَرْف+می_زَنید حَرْف+می_زَنَنْد",
  },
  "zendegi-kardan": {
    spoken: "زِنْدِگی+می_کُنَم زِنْدِگی+می_کُنی زِنْدِگی+می_کُنه زِنْدِگی+می_کُنیم زِنْدِگی+می_کُنین زِنْدِگی+می_کُنَن",
    written: "زِنْدِگی+می_کُنَم زِنْدِگی+می_کُنی زِنْدِگی+می_کُنَد زِنْدِگی+می_کُنیم زِنْدِگی+می_کُنید زِنْدِگی+می_کُنَنْد",
  },
};

// The negative, by hand, where it is not simply نِ in front of می.
const GOLDEN_NEG: Record<string, Record<Style, string>> = {
  âmadan: {
    spoken: "نِمیام نِمیای نِمیاد نِمیاییم نِمیایین نِمیان",
    written: "نِمی_آیَم نِمی_آیی نِمی_آیَد نِمی_آییم نِمی_آیید نِمی_آیَنْد",
  },
  dâshtan: {
    spoken: "نَدارَم نَداری نَداره نَداریم نَدارین نَدارَن",
    written: "نَدارَم نَداری نَدارَد نَداریم نَدارید نَدارَنْد",
  },
  âvardan: {
    spoken: "نِمیارَم نِمیاری نِمیاره نِمیاریم نِمیارین نِمیارَن",
    written: "نِمی_آوَرَم نِمی_آوَری نِمی_آوَرَد نِمی_آوَریم نِمی_آوَرید نِمی_آوَرَنْد",
  },
  "harf-zadan": {
    spoken: "حَرْف+نِمی_زَنَم حَرْف+نِمی_زَنی حَرْف+نِمی_زَنه حَرْف+نِمی_زَنیم حَرْف+نِمی_زَنین حَرْف+نِمی_زَنَن",
    written: "حَرْف+نِمی_زَنَم حَرْف+نِمی_زَنی حَرْف+نِمی_زَنَد حَرْف+نِمی_زَنیم حَرْف+نِمی_زَنید حَرْف+نِمی_زَنَنْد",
  },
};

// Transliterations, checked against the pronunciation.
const GOLDEN_TRANSLIT: Record<string, Record<Style, string>> = {
  raftan: { spoken: "miram miri mire mirim mirin miran", written: "miravam miravi miravad miravim miravid miravand" },
  âmadan: { spoken: "miyâm miyây miyâd miyâyim miyâyin miyân", written: "mi-âyam mi-âyi mi-âyad mi-âyim mi-âyid mi-âyand" },
  goftan: { spoken: "migam migi mige migim migin migan", written: "miguyam miguyi miguyad miguyim miguyid miguyand" },
  dâdan: { spoken: "midam midi mide midim midin midan", written: "midaham midahi midahad midahim midahid midahand" },
  khâstan: { spoken: "mikhâm mikhây mikhâd mikhâyim mikhâyin mikhân", written: "mikhâham mikhâhi mikhâhad mikhâhim mikhâhid mikhâhand" },
  dânestan: { spoken: "midunam miduni midune midunim midunin midunan", written: "midânam midâni midânad midânim midânid midânand" },
  khordan: { spoken: "mikhoram mikhori mikhore mikhorim mikhorin mikhoran", written: "mikhoram mikhori mikhorad mikhorim mikhorid mikhorand" },
  âvardan: { spoken: "miyâram miyâri miyâre miyârim miyârin miyâran", written: "mi-âvaram mi-âvari mi-âvarad mi-âvarim mi-âvarid mi-âvarand" },
  gozâshtan: { spoken: "mizâram mizâri mizâre mizârim mizârin mizâran", written: "migozâram migozâri migozârad migozârim migozârid migozârand" },
};

describe("conjugate: golden tables", () => {
  it("has a golden table for every verb", () => {
    expect(Object.keys(GOLDEN).sort()).toEqual(PRESENT_VERBS.map((v) => v.id).sort());
  });

  describe.each(PRESENT_VERBS.map((v) => [v.id, v] as const))("%s", (id, v) => {
    it.each(STYLES)("present, %s", (style) => {
      expect(table(v, "present", style, false, VERBS)).toEqual(row(GOLDEN[id][style]));
    });
    it.each(STYLES)("present negative, %s", (style) => {
      const neg = table(v, "present", style, true, VERBS);
      if (GOLDEN_NEG[id]) expect(neg).toEqual(row(GOLDEN_NEG[id][style]));
      else expect(neg).toEqual(row(GOLDEN[id][style]).map((f) => f.replace(/(^| )می/, "$1نِمی")));
    });
  });

  it.each(Object.keys(GOLDEN_TRANSLIT))("%s transliterates as said", (id) => {
    const v = verbById.get(id)!;
    for (const style of STYLES) {
      const got = table(v, "present", style, false, VERBS).map((f) => transliterateWithErrors(f).text);
      expect(got.join(" ")).toBe(GOLDEN_TRANSLIT[id][style]);
    }
  });
});

describe("conjugate: every form is course-quality Persian", () => {
  const forms = allForms(VERBS);
  it("makes every form a verb has (tense × 2 styles × 2 polarities × 6 persons)", () => {
    // 26 verbs. Present: 25 (not بودن). Past and perfect: all 26. Past continuous: 24
    // (not بودن, داشتن). The two progressives: 20 each, and no negative.
    expect(VERBS.length).toBe(26);
    const unit7 = 25 * 24 + 26 * 24 + 26 * 24 + 24 * 24 + 20 * 12 + 20 * 12;
    // Subjunctive: all 26. Imperative: 24 (not خواستن, توانستن), two persons. Future: all 26, written only.
    // Three of those 24 have no negative command (دانستن, شناختن, فهمیدن).
    const unit8 = 26 * 24 + (24 + 21) * 2 * 2 + 26 * 12;
    // Past perfect: 25 (not بودن). Past subjunctive: 25 (not داشتن). The two passives: the 12 verbs
    // that take an object and are drilled in it, two persons each.
    const unit11 = 25 * 24 + 25 * 24 + 12 * 2 * 2 * 2 * 2;
    expect(forms.length).toBe(unit7 + unit8 + unit11);
  });
  it("names the tenses in readable Persian, and explains a missing form in readable Persian", () => {
    const problems: string[] = [];
    const check = (fa: string) => {
      problems.push(...transliterateWithErrors(fa).errors);
      for (const w of fa.split(/[ ،.:()؟]+/).filter(Boolean)) problems.push(...checkReadable(w));
    };
    for (const t of TENSES) check(t.titleFa);
    expect(new Set(TENSES.map((t) => t.title)).size).toBe(TENSES.length);
    expect(TENSES.every((t) => t.says.length > 2)).toBe(true);
    const reasons = new Set<string>();
    for (const v of VERBS) for (const t of TENSES) for (const neg of [false, true]) reasons.add(lacks(v, t.id, neg, VERBS) ?? "");
    reasons.delete("");
    // Unit 11 added ten: the past perfect of بودن, the past subjunctive of داشتن, "no object", and seven noPassive reasons.
    expect(reasons.size).toBe(17);
    const notes = TENSES.flatMap((t) => (t.note ? [t.note] : []));
    for (const r of [...reasons, ...notes]) for (const tok of parseMarkup(r)) if (tok.kind === "text") for (const part of splitScript(tok.text)) if (part.fa) check(part.s);
    expect(problems).toEqual([]);
  });
  it("every form is readable and transliterates without errors", () => {
    const problems: string[] = [];
    for (const f of forms) {
      problems.push(...transliterateWithErrors(f).errors);
      for (const w of f.split(" ")) problems.push(...checkReadable(w));
    }
    expect(problems).toEqual([]);
  });
  it("infinitives and past stems are readable", () => {
    const problems: string[] = [];
    for (const v of VERBS)
      for (const s of [v.inf, v.past, v.spoken?.past].filter(Boolean) as string[])
        for (const w of s.split(" ")) problems.push(...checkReadable(w), ...transliterateWithErrors(w).errors);
    expect(problems).toEqual([]);
  });
  it("puts a half-space after every می / نمی that speech does not run into a vowel (میام, میومَدَم)", () => {
    // Words that only start with می- letters are not the prefix: a compound's میز would be, none is here.
    const bad = forms.filter((f) => /(^| )(نِ)?می[^‌او]/.test(f));
    expect(bad).toEqual([]);
  });
  it("ids are unique, and compounds name a real light verb and share its stems", () => {
    expect(new Set(VERBS.map((v) => v.id)).size).toBe(VERBS.length);
    for (const v of VERBS.filter((x) => x.light)) {
      const light = verbById.get(v.light!)!;
      expect(light, v.id).toBeDefined();
      expect([v.past, v.present]).toEqual([light.past, light.present]);
      expect(v.inf).toBe(`${v.part} ${light.inf}`);
    }
  });
});

describe("conjugate: helpers", () => {
  it("knows which stems end in a vowel", () => {
    expect(["گو", "آ", "خوا"].map(endsInVowel)).toEqual([true, true, true]);
    expect(["رَو", "شَو", "دَه", "خواه", "کُن"].map(endsInVowel)).toEqual([false, false, false, false, false]);
  });

  it("builds single forms", () => {
    const go = verbById.get("raftan")!;
    expect(conjugate(go, { tense: "present", person: "1p", style: "spoken", negative: true }, VERBS)).toBe(row("نِمی_ریم")[0]);
  });

  it("glosses in English", () => {
    const go = verbById.get("raftan")!;
    const can = verbById.get("tavânestan")!;
    const spec = { tense: "present" as const, style: "spoken" as const };
    expect(englishOf(go, { ...spec, person: "1s", negative: false })).toBe("I go");
    expect(englishOf(go, { ...spec, person: "3s", negative: false })).toBe("he/she goes");
    expect(englishOf(go, { ...spec, person: "3s", negative: true })).toBe("he/she doesn't go");
    expect(englishOf(go, { ...spec, person: "1p", negative: true })).toBe("we don't go");
    expect(englishOf(can, { ...spec, person: "3s", negative: false })).toBe("he/she can");
    expect(englishOf(can, { ...spec, person: "1s", negative: true })).toBe("I can't");
  });

  it("accepts the form with or without its pronoun, unmarked", () => {
    const go = verbById.get("raftan")!;
    const a = acceptedAnswers(go, { tense: "present", person: "3p", style: "spoken", negative: false }, VERBS);
    expect(a.answers).toEqual(row("می_رن اونا+می_رن"));
    expect(a.variants).toEqual([]);
    const w = acceptedAnswers(go, { tense: "present", person: "3p", style: "written", negative: false }, VERBS);
    expect(w.answers).toEqual(row("می_روند آن_ها+می_روند"));
  });

  it("also accepts the spelled-out می‌آم for spoken میام", () => {
    const come = verbById.get("âmadan")!;
    const a = acceptedAnswers(come, { tense: "present", person: "1s", style: "spoken", negative: true }, VERBS);
    expect(a.answers[0]).toBe("نمیام");
    expect(a.variants).toEqual(row("نمی_آم"));
  });

  it("accepts common chat spellings of the spoken forms as variants", () => {
    const want = verbById.get("khâstan")!;
    const go = verbById.get("raftan")!;
    const spec = { tense: "present" as const, style: "spoken" as const, negative: false };
    expect(acceptedAnswers(want, { ...spec, person: "1p" }, VERBS).variants).toEqual(row("می_خوایم"));
    expect(acceptedAnswers(want, { ...spec, person: "2p" }, VERBS).variants).toEqual(row("می_خواین می_خوایید"));
    expect(acceptedAnswers(go, { ...spec, person: "2p" }, VERBS).variants).toEqual(row("می_رید"));
    expect(acceptedAnswers(go, { ...spec, person: "2p", style: "written" }, VERBS).variants).toEqual([]);
  });

  it("tells apart verbs with the same English", () => {
    const spec = { tense: "present" as const, style: "spoken" as const, person: "1s" as const, negative: false };
    expect(englishOf(verbById.get("dânestan")!, spec)).toBe("I know (a fact)");
    expect(englishOf(verbById.get("shenâkhtan")!, spec)).toBe("I know (a person)");
    const prompts = PRESENT_VERBS.map((v) => englishOf(v, spec));
    expect(new Set(prompts).size).toBe(prompts.length);
  });

  it("strips marks for the typed form", () => {
    expect(unmarked(row("می_رَوَنْد")[0])).toBe(row("می_روند")[0]);
  });

  it("covers every person", () => {
    expect(PERSONS).toHaveLength(6);
  });
});
