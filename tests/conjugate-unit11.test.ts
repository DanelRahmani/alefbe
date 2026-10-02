import { describe, expect, it } from "vitest";
import { VERBS, verbById } from "@/content/verbs";
import { STYLES, acceptedAnswers, conjugate, englishOf, hasForm, lacks, personEnOf, personsOf, pronounOf, table, type Person, type Style, type Tense } from "@/lib/conjugate";
import { transliterateWithErrors } from "@/lib/translit";
import { ZWNJ } from "@/lib/persian/chars";

/** Golden rows: forms separated by spaces, "_" standing for the half-space, "+" for a space. */
const row = (s: string) => s.split(" ").map((f) => f.replace(/_/g, ZWNJ).replace(/\+/g, " "));

type Golden = Record<string, Record<Style, string>>;

// Every table below was written by hand from the references (Thackston;
// Mahootian; Lazard; Stilo, Talattof and Clinton for the Tehrani forms), not
// from the engine. Spoken then written.

// ── The past perfect: the participle, then بودن in the simple past. Persons 1s 2s 3s 1p 2p 3p.
// بودن has none here (بوده بودَم is rare).
const PAST_PERFECT: Golden = {
  raftan: {
    spoken: "رَفْته+بودَم رَفْته+بودی رَفْته+بود رَفْته+بودیم رَفْته+بودین رَفْته+بودَن",
    written: "رَفْته+بودَم رَفْته+بودی رَفْته+بود رَفْته+بودیم رَفْته+بودید رَفْته+بودَنْد",
  },
  âmadan: {
    spoken: "اومَده+بودَم اومَده+بودی اومَده+بود اومَده+بودیم اومَده+بودین اومَده+بودَن",
    written: "آمَده+بودَم آمَده+بودی آمَده+بود آمَده+بودیم آمَده+بودید آمَده+بودَنْد",
  },
  kardan: {
    spoken: "کَرْده+بودَم کَرْده+بودی کَرْده+بود کَرْده+بودیم کَرْده+بودین کَرْده+بودَن",
    written: "کَرْده+بودَم کَرْده+بودی کَرْده+بود کَرْده+بودیم کَرْده+بودید کَرْده+بودَنْد",
  },
  shodan: {
    spoken: "شُده+بودَم شُده+بودی شُده+بود شُده+بودیم شُده+بودین شُده+بودَن",
    written: "شُده+بودَم شُده+بودی شُده+بود شُده+بودیم شُده+بودید شُده+بودَنْد",
  },
  goftan: {
    spoken: "گُفْته+بودَم گُفْته+بودی گُفْته+بود گُفْته+بودیم گُفْته+بودین گُفْته+بودَن",
    written: "گُفْته+بودَم گُفْته+بودی گُفْته+بود گُفْته+بودیم گُفْته+بودید گُفْته+بودَنْد",
  },
  dâdan: {
    spoken: "داده+بودَم داده+بودی داده+بود داده+بودیم داده+بودین داده+بودَن",
    written: "داده+بودَم داده+بودی داده+بود داده+بودیم داده+بودید داده+بودَنْد",
  },
  didan: {
    spoken: "دیده+بودَم دیده+بودی دیده+بود دیده+بودیم دیده+بودین دیده+بودَن",
    written: "دیده+بودَم دیده+بودی دیده+بود دیده+بودیم دیده+بودید دیده+بودَنْد",
  },
  khâstan: {
    spoken: "خواسْته+بودَم خواسْته+بودی خواسْته+بود خواسْته+بودیم خواسْته+بودین خواسْته+بودَن",
    written: "خواسْته+بودَم خواسْته+بودی خواسْته+بود خواسْته+بودیم خواسْته+بودید خواسْته+بودَنْد",
  },
  dânestan: {
    spoken: "دونِسْته+بودَم دونِسْته+بودی دونِسْته+بود دونِسْته+بودیم دونِسْته+بودین دونِسْته+بودَن",
    written: "دانِسْته+بودَم دانِسْته+بودی دانِسْته+بود دانِسْته+بودیم دانِسْته+بودید دانِسْته+بودَنْد",
  },
  tavânestan: {
    spoken: "تونِسْته+بودَم تونِسْته+بودی تونِسْته+بود تونِسْته+بودیم تونِسْته+بودین تونِسْته+بودَن",
    written: "تَوانِسْته+بودَم تَوانِسْته+بودی تَوانِسْته+بود تَوانِسْته+بودیم تَوانِسْته+بودید تَوانِسْته+بودَنْد",
  },
  dâshtan: {
    spoken: "داشْته+بودَم داشْته+بودی داشْته+بود داشْته+بودیم داشْته+بودین داشْته+بودَن",
    written: "داشْته+بودَم داشْته+بودی داشْته+بود داشْته+بودیم داشْته+بودید داشْته+بودَنْد",
  },
  khordan: {
    spoken: "خُورْده+بودَم خُورْده+بودی خُورْده+بود خُورْده+بودیم خُورْده+بودین خُورْده+بودَن",
    written: "خُورْده+بودَم خُورْده+بودی خُورْده+بود خُورْده+بودیم خُورْده+بودید خُورْده+بودَنْد",
  },
  kharidan: {
    spoken: "خَریده+بودَم خَریده+بودی خَریده+بود خَریده+بودیم خَریده+بودین خَریده+بودَن",
    written: "خَریده+بودَم خَریده+بودی خَریده+بود خَریده+بودیم خَریده+بودید خَریده+بودَنْد",
  },
  neveshtan: {
    spoken: "نِوِشْته+بودَم نِوِشْته+بودی نِوِشْته+بود نِوِشْته+بودیم نِوِشْته+بودین نِوِشْته+بودَن",
    written: "نِوِشْته+بودَم نِوِشْته+بودی نِوِشْته+بود نِوِشْته+بودیم نِوِشْته+بودید نِوِشْته+بودَنْد",
  },
  khândan: {
    spoken: "خونْده+بودَم خونْده+بودی خونْده+بود خونْده+بودیم خونْده+بودین خونْده+بودَن",
    written: "خوانْده+بودَم خوانْده+بودی خوانْده+بود خوانْده+بودیم خوانْده+بودید خوانْده+بودَنْد",
  },
  gereftan: {
    spoken: "گِرِفْته+بودَم گِرِفْته+بودی گِرِفْته+بود گِرِفْته+بودیم گِرِفْته+بودین گِرِفْته+بودَن",
    written: "گِرِفْته+بودَم گِرِفْته+بودی گِرِفْته+بود گِرِفْته+بودیم گِرِفْته+بودید گِرِفْته+بودَنْد",
  },
  zadan: {
    spoken: "زَده+بودَم زَده+بودی زَده+بود زَده+بودیم زَده+بودین زَده+بودَن",
    written: "زَده+بودَم زَده+بودی زَده+بود زَده+بودیم زَده+بودید زَده+بودَنْد",
  },
  âvardan: {
    spoken: "آوُرْده+بودَم آوُرْده+بودی آوُرْده+بود آوُرْده+بودیم آوُرْده+بودین آوُرْده+بودَن",
    written: "آوَرْده+بودَم آوَرْده+بودی آوَرْده+بود آوَرْده+بودیم آوَرْده+بودید آوَرْده+بودَنْد",
  },
  gozâshtan: {
    spoken: "گُذاشْته+بودَم گُذاشْته+بودی گُذاشْته+بود گُذاشْته+بودیم گُذاشْته+بودین گُذاشْته+بودَن",
    written: "گُذاشْته+بودَم گُذاشْته+بودی گُذاشْته+بود گُذاشْته+بودیم گُذاشْته+بودید گُذاشْته+بودَنْد",
  },
  porsidan: {
    spoken: "پُرْسیده+بودَم پُرْسیده+بودی پُرْسیده+بود پُرْسیده+بودیم پُرْسیده+بودین پُرْسیده+بودَن",
    written: "پُرْسیده+بودَم پُرْسیده+بودی پُرْسیده+بود پُرْسیده+بودیم پُرْسیده+بودید پُرْسیده+بودَنْد",
  },
  fahmidan: {
    spoken: "فَهْمیده+بودَم فَهْمیده+بودی فَهْمیده+بود فَهْمیده+بودیم فَهْمیده+بودین فَهْمیده+بودَن",
    written: "فَهْمیده+بودَم فَهْمیده+بودی فَهْمیده+بود فَهْمیده+بودیم فَهْمیده+بودید فَهْمیده+بودَنْد",
  },
  shenâkhtan: {
    spoken: "شِناخْته+بودَم شِناخْته+بودی شِناخْته+بود شِناخْته+بودیم شِناخْته+بودین شِناخْته+بودَن",
    written: "شِناخْته+بودَم شِناخْته+بودی شِناخْته+بود شِناخْته+بودیم شِناخْته+بودید شِناخْته+بودَنْد",
  },
  "kâr-kardan": {
    spoken: "کار+کَرْده+بودَم کار+کَرْده+بودی کار+کَرْده+بود کار+کَرْده+بودیم کار+کَرْده+بودین کار+کَرْده+بودَن",
    written: "کار+کَرْده+بودَم کار+کَرْده+بودی کار+کَرْده+بود کار+کَرْده+بودیم کار+کَرْده+بودید کار+کَرْده+بودَنْد",
  },
  "harf-zadan": {
    spoken: "حَرْف+زَده+بودَم حَرْف+زَده+بودی حَرْف+زَده+بود حَرْف+زَده+بودیم حَرْف+زَده+بودین حَرْف+زَده+بودَن",
    written: "حَرْف+زَده+بودَم حَرْف+زَده+بودی حَرْف+زَده+بود حَرْف+زَده+بودیم حَرْف+زَده+بودید حَرْف+زَده+بودَنْد",
  },
  "zendegi-kardan": {
    spoken: "زِنْدِگی+کَرْده+بودَم زِنْدِگی+کَرْده+بودی زِنْدِگی+کَرْده+بود زِنْدِگی+کَرْده+بودیم زِنْدِگی+کَرْده+بودین زِنْدِگی+کَرْده+بودَن",
    written: "زِنْدِگی+کَرْده+بودَم زِنْدِگی+کَرْده+بودی زِنْدِگی+کَرْده+بود زِنْدِگی+کَرْده+بودیم زِنْدِگی+کَرْده+بودید زِنْدِگی+کَرْده+بودَنْد",
  },
};

// The negative puts نَـ on the participle; these are not a plain نَـ in front.
const NEGATIVE_PARTICIPLE: Record<string, Partial<Record<Style, [string, string]>>> = {
  // A ی bridges نَـ and آ: نَیامَده, نَیاوَرْده; spoken نَیومَده, نَیاوُرْده.
  âmadan: { spoken: ["اومَده", "نَیومَده"], written: ["آمَده", "نَیامَده"] },
  âvardan: { spoken: ["آوُرْده", "نَیاوُرْده"], written: ["آوَرْده", "نَیاوَرْده"] },
  // Spoken گذاشتن drops گُـ after a prefix, as in نَذاشْتَم.
  gozâshtan: { spoken: ["گُذاشْته", "نَذاشْته"] },
};

// ── The past subjunctive: the participle, then بودن in the subjunctive.
// Each verb's participle, by hand; the rows of باشَم are below. داشتن has
// none of its own: its present subjunctive, داشْته باشَم, serves.
const PARTICIPLE: Record<string, Record<Style, string>> = {
  budan: { spoken: "بوده", written: "بوده" },
  raftan: { spoken: "رَفْته", written: "رَفْته" },
  âmadan: { spoken: "اومَده", written: "آمَده" },
  kardan: { spoken: "کَرْده", written: "کَرْده" },
  shodan: { spoken: "شُده", written: "شُده" },
  goftan: { spoken: "گُفْته", written: "گُفْته" },
  dâdan: { spoken: "داده", written: "داده" },
  didan: { spoken: "دیده", written: "دیده" },
  khâstan: { spoken: "خواسْته", written: "خواسْته" },
  dânestan: { spoken: "دونِسْته", written: "دانِسْته" },
  tavânestan: { spoken: "تونِسْته", written: "تَوانِسْته" },
  khordan: { spoken: "خُورْده", written: "خُورْده" },
  kharidan: { spoken: "خَریده", written: "خَریده" },
  neveshtan: { spoken: "نِوِشْته", written: "نِوِشْته" },
  khândan: { spoken: "خونْده", written: "خوانْده" },
  gereftan: { spoken: "گِرِفْته", written: "گِرِفْته" },
  zadan: { spoken: "زَده", written: "زَده" },
  âvardan: { spoken: "آوُرْده", written: "آوَرْده" },
  gozâshtan: { spoken: "گُذاشْته", written: "گُذاشْته" },
  porsidan: { spoken: "پُرْسیده", written: "پُرْسیده" },
  fahmidan: { spoken: "فَهْمیده", written: "فَهْمیده" },
  shenâkhtan: { spoken: "شِناخْته", written: "شِناخْته" },
  "kâr-kardan": { spoken: "کار+کَرْده", written: "کار+کَرْده" },
  "harf-zadan": { spoken: "حَرْف+زَده", written: "حَرْف+زَده" },
  "zendegi-kardan": { spoken: "زِنْدِگی+کَرْده", written: "زِنْدِگی+کَرْده" },
};
const BASHAM: Record<Style, string> = {
  spoken: "باشَم باشی باشه باشیم باشین باشَن",
  written: "باشَم باشی باشَد باشیم باشید باشَنْد",
};
// Whole rows for a few, typed out.
const PAST_SUBJUNCTIVE_ROWS: Golden = {
  raftan: {
    spoken: "رَفْته+باشَم رَفْته+باشی رَفْته+باشه رَفْته+باشیم رَفْته+باشین رَفْته+باشَن",
    written: "رَفْته+باشَم رَفْته+باشی رَفْته+باشَد رَفْته+باشیم رَفْته+باشید رَفْته+باشَنْد",
  },
  âmadan: {
    spoken: "اومَده+باشَم اومَده+باشی اومَده+باشه اومَده+باشیم اومَده+باشین اومَده+باشَن",
    written: "آمَده+باشَم آمَده+باشی آمَده+باشَد آمَده+باشیم آمَده+باشید آمَده+باشَنْد",
  },
  budan: {
    spoken: "بوده+باشَم بوده+باشی بوده+باشه بوده+باشیم بوده+باشین بوده+باشَن",
    written: "بوده+باشَم بوده+باشی بوده+باشَد بوده+باشیم بوده+باشید بوده+باشَنْد",
  },
  "kâr-kardan": {
    spoken: "کار+کَرْده+باشَم کار+کَرْده+باشی کار+کَرْده+باشه کار+کَرْده+باشیم کار+کَرْده+باشین کار+کَرْده+باشَن",
    written: "کار+کَرْده+باشَم کار+کَرْده+باشی کار+کَرْده+باشَد کار+کَرْده+باشیم کار+کَرْده+باشید کار+کَرْده+باشَنْد",
  },
};

// ── The passive: the participle, then شدن. Persons 3s 3p only.
// Present, then past; spoken then written.
const PASSIVE: Record<string, { now: Record<Style, string>; was: Record<Style, string> }> = {
  dâdan: {
    now: { spoken: "داده+می_شه داده+می_شَن", written: "داده+می_شَوَد داده+می_شَوَنْد" },
    was: { spoken: "داده+شُد داده+شُدَن", written: "داده+شُد داده+شُدَنْد" },
  },
  didan: {
    now: { spoken: "دیده+می_شه دیده+می_شَن", written: "دیده+می_شَوَد دیده+می_شَوَنْد" },
    was: { spoken: "دیده+شُد دیده+شُدَن", written: "دیده+شُد دیده+شُدَنْد" },
  },
  khordan: {
    now: { spoken: "خُورْده+می_شه خُورْده+می_شَن", written: "خُورْده+می_شَوَد خُورْده+می_شَوَنْد" },
    was: { spoken: "خُورْده+شُد خُورْده+شُدَن", written: "خُورْده+شُد خُورْده+شُدَنْد" },
  },
  kharidan: {
    now: { spoken: "خَریده+می_شه خَریده+می_شَن", written: "خَریده+می_شَوَد خَریده+می_شَوَنْد" },
    was: { spoken: "خَریده+شُد خَریده+شُدَن", written: "خَریده+شُد خَریده+شُدَنْد" },
  },
  neveshtan: {
    now: { spoken: "نِوِشْته+می_شه نِوِشْته+می_شَن", written: "نِوِشْته+می_شَوَد نِوِشْته+می_شَوَنْد" },
    was: { spoken: "نِوِشْته+شُد نِوِشْته+شُدَن", written: "نِوِشْته+شُد نِوِشْته+شُدَنْد" },
  },
  khândan: {
    now: { spoken: "خونْده+می_شه خونْده+می_شَن", written: "خوانْده+می_شَوَد خوانْده+می_شَوَنْد" },
    was: { spoken: "خونْده+شُد خونْده+شُدَن", written: "خوانْده+شُد خوانْده+شُدَنْد" },
  },
  gereftan: {
    now: { spoken: "گِرِفْته+می_شه گِرِفْته+می_شَن", written: "گِرِفْته+می_شَوَد گِرِفْته+می_شَوَنْد" },
    was: { spoken: "گِرِفْته+شُد گِرِفْته+شُدَن", written: "گِرِفْته+شُد گِرِفْته+شُدَنْد" },
  },
  zadan: {
    now: { spoken: "زَده+می_شه زَده+می_شَن", written: "زَده+می_شَوَد زَده+می_شَوَنْد" },
    was: { spoken: "زَده+شُد زَده+شُدَن", written: "زَده+شُد زَده+شُدَنْد" },
  },
  âvardan: {
    now: { spoken: "آوُرْده+می_شه آوُرْده+می_شَن", written: "آوَرْده+می_شَوَد آوَرْده+می_شَوَنْد" },
    was: { spoken: "آوُرْده+شُد آوُرْده+شُدَن", written: "آوَرْده+شُد آوَرْده+شُدَنْد" },
  },
  gozâshtan: {
    now: { spoken: "گُذاشْته+می_شه گُذاشْته+می_شَن", written: "گُذاشْته+می_شَوَد گُذاشْته+می_شَوَنْد" },
    was: { spoken: "گُذاشْته+شُد گُذاشْته+شُدَن", written: "گُذاشْته+شُد گُذاشْته+شُدَنْد" },
  },
  porsidan: {
    now: { spoken: "پُرْسیده+می_شه پُرْسیده+می_شَن", written: "پُرْسیده+می_شَوَد پُرْسیده+می_شَوَنْد" },
    was: { spoken: "پُرْسیده+شُد پُرْسیده+شُدَن", written: "پُرْسیده+شُد پُرْسیده+شُدَنْد" },
  },
  shenâkhtan: {
    now: { spoken: "شِناخْته+می_شه شِناخْته+می_شَن", written: "شِناخْته+می_شَوَد شِناخْته+می_شَوَنْد" },
    was: { spoken: "شِناخْته+شُد شِناخْته+شُدَن", written: "شِناخْته+شُد شِناخْته+شُدَنْد" },
  },
};

/** No object, so no passive. */
const INTRANSITIVE = ["budan", "raftan", "âmadan", "shodan", "kâr-kardan", "harf-zadan", "zendegi-kardan"];
/** Take an object, but their passive is not drilled (each says why). */
const NO_PASSIVE = ["kardan", "goftan", "khâstan", "dânestan", "tavânestan", "dâshtan", "fahmidan"];

/** نَـ on the first word of the verb (after a compound's part), or the verb's own negative participle. */
function negativeRow(id: string, style: Style, forms: string[]): string[] {
  const own = NEGATIVE_PARTICIPLE[id]?.[style];
  const n = verbById.get(id)!.part?.split(" ").length ?? 0;
  return forms.map((f) => {
    if (own) return f.replace(own[0], own[1]);
    const w = f.split(" ");
    w[n] = "نَ" + w[n];
    return w.join(" ");
  });
}

const TRANSLIT: { verb: string; tense: Tense; style: Style; negative?: boolean; says: string }[] = [
  { verb: "raftan", tense: "past-perfect", style: "written", says: "rafte budam, rafte budi, rafte bud, rafte budim, rafte budid, rafte budand" },
  { verb: "âmadan", tense: "past-perfect", style: "spoken", says: "umade budam, umade budi, umade bud, umade budim, umade budin, umade budan" },
  { verb: "âmadan", tense: "past-perfect", style: "written", negative: true, says: "nayâmade budam, nayâmade budi, nayâmade bud, nayâmade budim, nayâmade budid, nayâmade budand" },
  { verb: "gozâshtan", tense: "past-perfect", style: "spoken", negative: true, says: "nazâshte budam, nazâshte budi, nazâshte bud, nazâshte budim, nazâshte budin, nazâshte budan" },
  { verb: "khândan", tense: "past-subjunctive", style: "spoken", says: "khunde bâsham, khunde bâshi, khunde bâshe, khunde bâshim, khunde bâshin, khunde bâshan" },
  { verb: "didan", tense: "past-subjunctive", style: "written", negative: true, says: "nadide bâsham, nadide bâshi, nadide bâshad, nadide bâshim, nadide bâshid, nadide bâshand" },
  { verb: "didan", tense: "passive", style: "written", says: "dide mishavad, dide mishavand" },
  { verb: "khordan", tense: "passive", style: "spoken", negative: true, says: "khorde nemishe, khorde nemishan" },
  { verb: "âvardan", tense: "past-passive", style: "spoken", says: "âvorde shod, âvorde shodan" },
  { verb: "neveshtan", tense: "past-passive", style: "written", negative: true, says: "neveshte nashod, neveshte nashodand" },
];

describe("conjugate: the past perfect", () => {
  it("has a golden table for every verb but بودن", () => {
    expect(Object.keys(PAST_PERFECT).sort()).toEqual(VERBS.map((v) => v.id).filter((id) => id !== "budan").sort());
    const be = verbById.get("budan")!;
    expect(lacks(be, "past-perfect", false, VERBS)).toBeTruthy();
    expect(() => table(be, "past-perfect", "written", false, VERBS)).toThrow();
  });

  it.each(Object.keys(PAST_PERFECT))("%s", (id) => {
    const v = verbById.get(id)!;
    for (const style of STYLES) {
      expect(table(v, "past-perfect", style, false, VERBS), style).toEqual(row(PAST_PERFECT[id][style]));
      expect(table(v, "past-perfect", style, true, VERBS), `${style} negative`).toEqual(negativeRow(id, style, row(PAST_PERFECT[id][style])));
    }
  });
});

describe("conjugate: the past subjunctive", () => {
  it("has a participle for every verb but داشتن", () => {
    expect(Object.keys(PARTICIPLE).sort()).toEqual(VERBS.map((v) => v.id).filter((id) => id !== "dâshtan").sort());
    const have = verbById.get("dâshtan")!;
    expect(lacks(have, "past-subjunctive", false, VERBS)).toBeTruthy();
    expect(() => table(have, "past-subjunctive", "spoken", false, VERBS)).toThrow();
  });

  it.each(Object.keys(PARTICIPLE))("%s", (id) => {
    const v = verbById.get(id)!;
    for (const style of STYLES) {
      const [part] = row(PARTICIPLE[id][style]);
      const want = row(BASHAM[style]).map((b) => `${part} ${b}`);
      expect(table(v, "past-subjunctive", style, false, VERBS), style).toEqual(want);
      expect(table(v, "past-subjunctive", style, true, VERBS), `${style} negative`).toEqual(negativeRow(id, style, want));
    }
  });

  it.each(Object.keys(PAST_SUBJUNCTIVE_ROWS))("%s, typed out whole", (id) => {
    for (const style of STYLES) expect(table(verbById.get(id)!, "past-subjunctive", style, false, VERBS), style).toEqual(row(PAST_SUBJUNCTIVE_ROWS[id][style]));
  });
});

describe("conjugate: the passive", () => {
  it("is for he/she/it and they only", () => {
    expect(personsOf("passive")).toEqual(["3s", "3p"]);
    expect(personsOf("past-passive")).toEqual(["3s", "3p"]);
    const see = verbById.get("didan")!;
    expect(hasForm(see, { tense: "passive", person: "1s", style: "written", negative: false }, VERBS)).toBe(false);
    expect(() => conjugate(see, { tense: "past-passive", person: "2p", style: "spoken", negative: false }, VERBS)).toThrow();
  });

  it("has golden rows for every verb with a passive, and a reason for every other", () => {
    expect([...Object.keys(PASSIVE), ...INTRANSITIVE, ...NO_PASSIVE].sort()).toEqual(VERBS.map((v) => v.id).sort());
    for (const id of INTRANSITIVE) expect(lacks(verbById.get(id)!, "passive", false, VERBS), id).toBe("This verb takes no object, so it has no passive.");
    for (const id of NO_PASSIVE) {
      const why = lacks(verbById.get(id)!, "past-passive", false, VERBS);
      expect(why, id).toBeTruthy();
      expect(why, id).not.toBe("This verb takes no object, so it has no passive.");
    }
  });

  it.each(Object.keys(PASSIVE))("%s", (id) => {
    const v = verbById.get(id)!;
    for (const style of STYLES) {
      const now = row(PASSIVE[id].now[style]);
      const was = row(PASSIVE[id].was[style]);
      expect(table(v, "passive", style, false, VERBS), `${style} present`).toEqual(now);
      expect(table(v, "past-passive", style, false, VERBS), `${style} past`).toEqual(was);
      // The negative goes on شدن: نِمی‌شَوَد, نَشُد.
      expect(table(v, "passive", style, true, VERBS), `${style} present negative`).toEqual(now.map((f) => f.replace(" می", " نِمی")));
      expect(table(v, "past-passive", style, true, VERBS), `${style} past negative`).toEqual(was.map((f) => f.replace(" شُد", " نَشُد")));
    }
  });
});

describe("conjugate: Unit 11 forms as said and as glossed", () => {
  it.each(TRANSLIT)("$verb $tense $style transliterates as said", ({ verb, tense, style, negative, says }) => {
    const got = table(verbById.get(verb)!, tense, style, negative ?? false, VERBS).map((f) => transliterateWithErrors(f).text);
    expect(got.join(", ")).toBe(says);
  });

  const en = (id: string, tense: Tense, person: Person, negative = false) => englishOf(verbById.get(id)!, { tense, person, style: "written", negative });

  it("glosses the past perfect", () => {
    expect(en("raftan", "past-perfect", "1s")).toBe("I had gone");
    expect(en("didan", "past-perfect", "3p", true)).toBe("they hadn't seen");
    expect(en("tavânestan", "past-perfect", "1s")).toBe("I had been able to (do it)");
  });
  it("glosses the past subjunctive", () => {
    expect(en("raftan", "past-subjunctive", "1s")).toBe("that I have gone");
    expect(en("raftan", "past-subjunctive", "3s", true)).toBe("that he/she hasn't gone");
    expect(en("budan", "past-subjunctive", "2p")).toBe("that you (plural or polite) have been");
    expect(en("dânestan", "past-subjunctive", "1s")).toBe("that I have known (a fact)");
    expect(en("tavânestan", "past-subjunctive", "1s", true)).toBe("that I haven't been able to (do it)");
  });
  it("glosses the passive", () => {
    expect(en("didan", "passive", "3s")).toBe("he/she/it is seen");
    expect(en("didan", "passive", "3p", true)).toBe("they aren't seen");
    expect(en("didan", "past-passive", "3s")).toBe("he/she/it was seen");
    // A state's past is an event: شِناخْته شُد, was recognised; the present is is known.
    expect(en("shenâkhtan", "past-passive", "3s")).toBe("he/she/it was recognised");
    expect(en("shenâkhtan", "passive", "3p")).toBe("they are known");
    expect(en("neveshtan", "past-passive", "3p", true)).toBe("they weren't written");
  });
  it("tells every verb apart in English", () => {
    for (const tense of ["past-perfect", "past-subjunctive", "passive", "past-passive"] as const) {
      const person = tense.includes("passive") ? "3s" : "2s";
      const prompts = VERBS.filter((v) => !lacks(v, tense, false, VERBS)).map((v) => englishOf(v, { tense, person, style: "written", negative: false }));
      expect(new Set(prompts).size, tense).toBe(prompts.length);
    }
  });
});

describe("conjugate: accepted answers in Unit 11's forms", () => {
  it("takes the written -id for the spoken -in, as elsewhere", () => {
    const go = verbById.get("raftan")!;
    const a = acceptedAnswers(go, { tense: "past-perfect", person: "2p", style: "spoken", negative: false }, VERBS);
    expect(a.answers).toEqual(row("رفته+بودین شما+رفته+بودین"));
    expect(a.variants).toEqual(row("رفته+بودید"));
  });
  it("takes both stems of spoken گذاشتن", () => {
    const put = verbById.get("gozâshtan")!;
    const spec = { tense: "past-perfect" as const, person: "1s" as const, style: "spoken" as const };
    expect(acceptedAnswers(put, { ...spec, negative: true }, VERBS).variants).toEqual(row("نگذاشته+بودم"));
    expect(acceptedAnswers(put, { ...spec, negative: false }, VERBS).variants).toEqual(row("ذاشته+بودم"));
  });
  it("takes a thing's pronoun in the passive, and has no variants in writing", () => {
    const see = verbById.get("didan")!;
    const a = acceptedAnswers(see, { tense: "passive", person: "3s", style: "written", negative: false }, VERBS);
    expect(a.answers).toEqual(row("دیده+می_شود آن+دیده+می_شود این+دیده+می_شود"));
    expect(a.variants).toEqual([]);
    expect(acceptedAnswers(see, { tense: "past-passive", person: "3p", style: "spoken", negative: false }, VERBS).answers).toEqual(
      row("دیده+شدن اونا+دیده+شدن اینا+دیده+شدن"),
    );
    expect(pronounOf("passive", "3s", "spoken")).toBe("اون");
    expect(pronounOf("past", "3s", "written")).toBe("او");
    expect(personEnOf("passive", "3s")).toBe("it");
  });
  it("takes the short stem of spoken گذاشتن in the passive, negative or not", () => {
    const put = verbById.get("gozâshtan")!;
    const spec = { tense: "passive" as const, person: "3s" as const, style: "spoken" as const };
    expect(acceptedAnswers(put, { ...spec, negative: false }, VERBS).variants).toEqual(row("ذاشته+می_شه"));
    expect(acceptedAnswers(put, { ...spec, negative: true }, VERBS).variants).toEqual(row("ذاشته+نمی_شه"));
  });
});
