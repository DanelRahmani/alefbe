import { describe, expect, it } from "vitest";
import { VERBS, verbById } from "@/content/verbs";
import { STYLES, acceptedAnswers, conjugate, englishOf, lacks, table, type Style, type Tense } from "@/lib/conjugate";
import { transliterateWithErrors } from "@/lib/translit";
import { ZWNJ } from "@/lib/persian/chars";

/** Golden rows: six forms separated by spaces, "_" standing for the half-space, "+" for a space. */
const row = (s: string) => s.split(" ").map((f) => f.replace(/_/g, ZWNJ).replace(/\+/g, " "));

type Golden = Record<string, Record<Style, string>>;

// Every table below was written by hand from the references (Thackston;
// Mahootian; Stilo, Talattof and Clinton for the Tehrani forms), not from the
// engine. Persons 1s 2s 3s 1p 2p 3p, spoken then written.

// ── Simple past: past stem + ending; he/she has no ending.
const PAST: Golden = {
  budan: {
    spoken: "بودَم بودی بود بودیم بودین بودَن",
    written: "بودَم بودی بود بودیم بودید بودَنْد",
  },
  raftan: {
    spoken: "رَفْتَم رَفْتی رَفْت رَفْتیم رَفْتین رَفْتَن",
    written: "رَفْتَم رَفْتی رَفْت رَفْتیم رَفْتید رَفْتَنْد",
  },
  âmadan: {
    spoken: "اومَدَم اومَدی اومَد اومَدیم اومَدین اومَدَن",
    written: "آمَدَم آمَدی آمَد آمَدیم آمَدید آمَدَنْد",
  },
  kardan: {
    spoken: "کَرْدَم کَرْدی کَرْد کَرْدیم کَرْدین کَرْدَن",
    written: "کَرْدَم کَرْدی کَرْد کَرْدیم کَرْدید کَرْدَنْد",
  },
  shodan: {
    spoken: "شُدَم شُدی شُد شُدیم شُدین شُدَن",
    written: "شُدَم شُدی شُد شُدیم شُدید شُدَنْد",
  },
  goftan: {
    spoken: "گُفْتَم گُفْتی گُفْت گُفْتیم گُفْتین گُفْتَن",
    written: "گُفْتَم گُفْتی گُفْت گُفْتیم گُفْتید گُفْتَنْد",
  },
  dâdan: {
    spoken: "دادَم دادی داد دادیم دادین دادَن",
    written: "دادَم دادی داد دادیم دادید دادَنْد",
  },
  didan: {
    spoken: "دیدَم دیدی دید دیدیم دیدین دیدَن",
    written: "دیدَم دیدی دید دیدیم دیدید دیدَنْد",
  },
  khâstan: {
    spoken: "خواسْتَم خواسْتی خواسْت خواسْتیم خواسْتین خواسْتَن",
    written: "خواسْتَم خواسْتی خواسْت خواسْتیم خواسْتید خواسْتَنْد",
  },
  dânestan: {
    spoken: "دونِسْتَم دونِسْتی دونِسْت دونِسْتیم دونِسْتین دونِسْتَن",
    written: "دانِسْتَم دانِسْتی دانِسْت دانِسْتیم دانِسْتید دانِسْتَنْد",
  },
  tavânestan: {
    spoken: "تونِسْتَم تونِسْتی تونِسْت تونِسْتیم تونِسْتین تونِسْتَن",
    written: "تَوانِسْتَم تَوانِسْتی تَوانِسْت تَوانِسْتیم تَوانِسْتید تَوانِسْتَنْد",
  },
  dâshtan: {
    spoken: "داشْتَم داشْتی داشْت داشْتیم داشْتین داشْتَن",
    written: "داشْتَم داشْتی داشْت داشْتیم داشْتید داشْتَنْد",
  },
  khordan: {
    spoken: "خُورْدَم خُورْدی خُورْد خُورْدیم خُورْدین خُورْدَن",
    written: "خُورْدَم خُورْدی خُورْد خُورْدیم خُورْدید خُورْدَنْد",
  },
  kharidan: {
    spoken: "خَریدَم خَریدی خَرید خَریدیم خَریدین خَریدَن",
    written: "خَریدَم خَریدی خَرید خَریدیم خَریدید خَریدَنْد",
  },
  neveshtan: {
    spoken: "نِوِشْتَم نِوِشْتی نِوِشْت نِوِشْتیم نِوِشْتین نِوِشْتَن",
    written: "نِوِشْتَم نِوِشْتی نِوِشْت نِوِشْتیم نِوِشْتید نِوِشْتَنْد",
  },
  khândan: {
    spoken: "خونْدَم خونْدی خونْد خونْدیم خونْدین خونْدَن",
    written: "خوانْدَم خوانْدی خوانْد خوانْدیم خوانْدید خوانْدَنْد",
  },
  gereftan: {
    spoken: "گِرِفْتَم گِرِفْتی گِرِفْت گِرِفْتیم گِرِفْتین گِرِفْتَن",
    written: "گِرِفْتَم گِرِفْتی گِرِفْت گِرِفْتیم گِرِفْتید گِرِفْتَنْد",
  },
  zadan: {
    spoken: "زَدَم زَدی زَد زَدیم زَدین زَدَن",
    written: "زَدَم زَدی زَد زَدیم زَدید زَدَنْد",
  },
  âvardan: {
    spoken: "آوُرْدَم آوُرْدی آوُرْد آوُرْدیم آوُرْدین آوُرْدَن",
    written: "آوَرْدَم آوَرْدی آوَرْد آوَرْدیم آوَرْدید آوَرْدَنْد",
  },
  gozâshtan: {
    spoken: "گُذاشْتَم گُذاشْتی گُذاشْت گُذاشْتیم گُذاشْتین گُذاشْتَن",
    written: "گُذاشْتَم گُذاشْتی گُذاشْت گُذاشْتیم گُذاشْتید گُذاشْتَنْد",
  },
  porsidan: {
    spoken: "پُرْسیدَم پُرْسیدی پُرْسید پُرْسیدیم پُرْسیدین پُرْسیدَن",
    written: "پُرْسیدَم پُرْسیدی پُرْسید پُرْسیدیم پُرْسیدید پُرْسیدَنْد",
  },
  fahmidan: {
    spoken: "فَهْمیدَم فَهْمیدی فَهْمید فَهْمیدیم فَهْمیدین فَهْمیدَن",
    written: "فَهْمیدَم فَهْمیدی فَهْمید فَهْمیدیم فَهْمیدید فَهْمیدَنْد",
  },
  shenâkhtan: {
    spoken: "شِناخْتَم شِناخْتی شِناخْت شِناخْتیم شِناخْتین شِناخْتَن",
    written: "شِناخْتَم شِناخْتی شِناخْت شِناخْتیم شِناخْتید شِناخْتَنْد",
  },
  "kâr-kardan": {
    spoken: "کار+کَرْدَم کار+کَرْدی کار+کَرْد کار+کَرْدیم کار+کَرْدین کار+کَرْدَن",
    written: "کار+کَرْدَم کار+کَرْدی کار+کَرْد کار+کَرْدیم کار+کَرْدید کار+کَرْدَنْد",
  },
  "harf-zadan": {
    spoken: "حَرْف+زَدَم حَرْف+زَدی حَرْف+زَد حَرْف+زَدیم حَرْف+زَدین حَرْف+زَدَن",
    written: "حَرْف+زَدَم حَرْف+زَدی حَرْف+زَد حَرْف+زَدیم حَرْف+زَدید حَرْف+زَدَنْد",
  },
  "zendegi-kardan": {
    spoken: "زِنْدِگی+کَرْدَم زِنْدِگی+کَرْدی زِنْدِگی+کَرْد زِنْدِگی+کَرْدیم زِنْدِگی+کَرْدین زِنْدِگی+کَرْدَن",
    written: "زِنْدِگی+کَرْدَم زِنْدِگی+کَرْدی زِنْدِگی+کَرْد زِنْدِگی+کَرْدیم زِنْدِگی+کَرْدید زِنْدِگی+کَرْدَنْد",
  },
};

// The negative past where it is not simply نَ in front of the verb: a ی
// bridges to a stem that starts with a vowel.
const PAST_NEG: Golden = {
  âmadan: {
    spoken: "نَیومَدَم نَیومَدی نَیومَد نَیومَدیم نَیومَدین نَیومَدَن",
    written: "نَیامَدَم نَیامَدی نَیامَد نَیامَدیم نَیامَدید نَیامَدَنْد",
  },
  âvardan: {
    spoken: "نَیاوُرْدَم نَیاوُرْدی نَیاوُرْد نَیاوُرْدیم نَیاوُرْدین نَیاوُرْدَن",
    written: "نَیاوَرْدَم نَیاوَرْدی نَیاوَرْد نَیاوَرْدیم نَیاوَرْدید نَیاوَرْدَنْد",
  },
  // After a prefix, speech drops the گُـ: nazâshtam.
  gozâshtan: {
    spoken: "نَذاشْتَم نَذاشْتی نَذاشْت نَذاشْتیم نَذاشْتین نَذاشْتَن",
    written: "نَگُذاشْتَم نَگُذاشْتی نَگُذاشْت نَگُذاشْتیم نَگُذاشْتید نَگُذاشْتَنْد",
  },
  "harf-zadan": {
    spoken: "حَرْف+نَزَدَم حَرْف+نَزَدی حَرْف+نَزَد حَرْف+نَزَدیم حَرْف+نَزَدین حَرْف+نَزَدَن",
    written: "حَرْف+نَزَدَم حَرْف+نَزَدی حَرْف+نَزَد حَرْف+نَزَدیم حَرْف+نَزَدید حَرْف+نَزَدَنْد",
  },
};

// ── Present perfect. Written: the participle + the short "to be", اَسْت apart.
// Spoken: said raftám, raftí, rafté …; only he/she differs in letters from the
// simple past.
const PERFECT: Golden = {
  budan: {
    spoken: "بودَم بودی بوده بودیم بودین بودَن",
    written: "بوده_اَم بوده_ای بوده+اَسْت بوده_ایم بوده_اید بوده_اَنْد",
  },
  raftan: {
    spoken: "رَفْتَم رَفْتی رَفْته رَفْتیم رَفْتین رَفْتَن",
    written: "رَفْته_اَم رَفْته_ای رَفْته+اَسْت رَفْته_ایم رَفْته_اید رَفْته_اَنْد",
  },
  âmadan: {
    spoken: "اومَدَم اومَدی اومَده اومَدیم اومَدین اومَدَن",
    written: "آمَده_اَم آمَده_ای آمَده+اَسْت آمَده_ایم آمَده_اید آمَده_اَنْد",
  },
  kardan: {
    spoken: "کَرْدَم کَرْدی کَرْده کَرْدیم کَرْدین کَرْدَن",
    written: "کَرْده_اَم کَرْده_ای کَرْده+اَسْت کَرْده_ایم کَرْده_اید کَرْده_اَنْد",
  },
  shodan: {
    spoken: "شُدَم شُدی شُده شُدیم شُدین شُدَن",
    written: "شُده_اَم شُده_ای شُده+اَسْت شُده_ایم شُده_اید شُده_اَنْد",
  },
  goftan: {
    spoken: "گُفْتَم گُفْتی گُفْته گُفْتیم گُفْتین گُفْتَن",
    written: "گُفْته_اَم گُفْته_ای گُفْته+اَسْت گُفْته_ایم گُفْته_اید گُفْته_اَنْد",
  },
  dâdan: {
    spoken: "دادَم دادی داده دادیم دادین دادَن",
    written: "داده_اَم داده_ای داده+اَسْت داده_ایم داده_اید داده_اَنْد",
  },
  didan: {
    spoken: "دیدَم دیدی دیده دیدیم دیدین دیدَن",
    written: "دیده_اَم دیده_ای دیده+اَسْت دیده_ایم دیده_اید دیده_اَنْد",
  },
  khâstan: {
    spoken: "خواسْتَم خواسْتی خواسْته خواسْتیم خواسْتین خواسْتَن",
    written: "خواسْته_اَم خواسْته_ای خواسْته+اَسْت خواسْته_ایم خواسْته_اید خواسْته_اَنْد",
  },
  dânestan: {
    spoken: "دونِسْتَم دونِسْتی دونِسْته دونِسْتیم دونِسْتین دونِسْتَن",
    written: "دانِسْته_اَم دانِسْته_ای دانِسْته+اَسْت دانِسْته_ایم دانِسْته_اید دانِسْته_اَنْد",
  },
  tavânestan: {
    spoken: "تونِسْتَم تونِسْتی تونِسْته تونِسْتیم تونِسْتین تونِسْتَن",
    written: "تَوانِسْته_اَم تَوانِسْته_ای تَوانِسْته+اَسْت تَوانِسْته_ایم تَوانِسْته_اید تَوانِسْته_اَنْد",
  },
  dâshtan: {
    spoken: "داشْتَم داشْتی داشْته داشْتیم داشْتین داشْتَن",
    written: "داشْته_اَم داشْته_ای داشْته+اَسْت داشْته_ایم داشْته_اید داشْته_اَنْد",
  },
  khordan: {
    spoken: "خُورْدَم خُورْدی خُورْده خُورْدیم خُورْدین خُورْدَن",
    written: "خُورْده_اَم خُورْده_ای خُورْده+اَسْت خُورْده_ایم خُورْده_اید خُورْده_اَنْد",
  },
  kharidan: {
    spoken: "خَریدَم خَریدی خَریده خَریدیم خَریدین خَریدَن",
    written: "خَریده_اَم خَریده_ای خَریده+اَسْت خَریده_ایم خَریده_اید خَریده_اَنْد",
  },
  neveshtan: {
    spoken: "نِوِشْتَم نِوِشْتی نِوِشْته نِوِشْتیم نِوِشْتین نِوِشْتَن",
    written: "نِوِشْته_اَم نِوِشْته_ای نِوِشْته+اَسْت نِوِشْته_ایم نِوِشْته_اید نِوِشْته_اَنْد",
  },
  khândan: {
    spoken: "خونْدَم خونْدی خونْده خونْدیم خونْدین خونْدَن",
    written: "خوانْده_اَم خوانْده_ای خوانْده+اَسْت خوانْده_ایم خوانْده_اید خوانْده_اَنْد",
  },
  gereftan: {
    spoken: "گِرِفْتَم گِرِفْتی گِرِفْته گِرِفْتیم گِرِفْتین گِرِفْتَن",
    written: "گِرِفْته_اَم گِرِفْته_ای گِرِفْته+اَسْت گِرِفْته_ایم گِرِفْته_اید گِرِفْته_اَنْد",
  },
  zadan: {
    spoken: "زَدَم زَدی زَده زَدیم زَدین زَدَن",
    written: "زَده_اَم زَده_ای زَده+اَسْت زَده_ایم زَده_اید زَده_اَنْد",
  },
  âvardan: {
    spoken: "آوُرْدَم آوُرْدی آوُرْده آوُرْدیم آوُرْدین آوُرْدَن",
    written: "آوَرْده_اَم آوَرْده_ای آوَرْده+اَسْت آوَرْده_ایم آوَرْده_اید آوَرْده_اَنْد",
  },
  gozâshtan: {
    spoken: "گُذاشْتَم گُذاشْتی گُذاشْته گُذاشْتیم گُذاشْتین گُذاشْتَن",
    written: "گُذاشْته_اَم گُذاشْته_ای گُذاشْته+اَسْت گُذاشْته_ایم گُذاشْته_اید گُذاشْته_اَنْد",
  },
  porsidan: {
    spoken: "پُرْسیدَم پُرْسیدی پُرْسیده پُرْسیدیم پُرْسیدین پُرْسیدَن",
    written: "پُرْسیده_اَم پُرْسیده_ای پُرْسیده+اَسْت پُرْسیده_ایم پُرْسیده_اید پُرْسیده_اَنْد",
  },
  fahmidan: {
    spoken: "فَهْمیدَم فَهْمیدی فَهْمیده فَهْمیدیم فَهْمیدین فَهْمیدَن",
    written: "فَهْمیده_اَم فَهْمیده_ای فَهْمیده+اَسْت فَهْمیده_ایم فَهْمیده_اید فَهْمیده_اَنْد",
  },
  shenâkhtan: {
    spoken: "شِناخْتَم شِناخْتی شِناخْته شِناخْتیم شِناخْتین شِناخْتَن",
    written: "شِناخْته_اَم شِناخْته_ای شِناخْته+اَسْت شِناخْته_ایم شِناخْته_اید شِناخْته_اَنْد",
  },
  "kâr-kardan": {
    spoken: "کار+کَرْدَم کار+کَرْدی کار+کَرْده کار+کَرْدیم کار+کَرْدین کار+کَرْدَن",
    written: "کار+کَرْده_اَم کار+کَرْده_ای کار+کَرْده+اَسْت کار+کَرْده_ایم کار+کَرْده_اید کار+کَرْده_اَنْد",
  },
  "harf-zadan": {
    spoken: "حَرْف+زَدَم حَرْف+زَدی حَرْف+زَده حَرْف+زَدیم حَرْف+زَدین حَرْف+زَدَن",
    written: "حَرْف+زَده_اَم حَرْف+زَده_ای حَرْف+زَده+اَسْت حَرْف+زَده_ایم حَرْف+زَده_اید حَرْف+زَده_اَنْد",
  },
  "zendegi-kardan": {
    spoken: "زِنْدِگی+کَرْدَم زِنْدِگی+کَرْدی زِنْدِگی+کَرْده زِنْدِگی+کَرْدیم زِنْدِگی+کَرْدین زِنْدِگی+کَرْدَن",
    written: "زِنْدِگی+کَرْده_اَم زِنْدِگی+کَرْده_ای زِنْدِگی+کَرْده+اَسْت زِنْدِگی+کَرْده_ایم زِنْدِگی+کَرْده_اید زِنْدِگی+کَرْده_اَنْد",
  },
};

const PERFECT_NEG: Golden = {
  âmadan: {
    spoken: "نَیومَدَم نَیومَدی نَیومَده نَیومَدیم نَیومَدین نَیومَدَن",
    written: "نَیامَده_اَم نَیامَده_ای نَیامَده+اَسْت نَیامَده_ایم نَیامَده_اید نَیامَده_اَنْد",
  },
  âvardan: {
    spoken: "نَیاوُرْدَم نَیاوُرْدی نَیاوُرْده نَیاوُرْدیم نَیاوُرْدین نَیاوُرْدَن",
    written: "نَیاوَرْده_اَم نَیاوَرْده_ای نَیاوَرْده+اَسْت نَیاوَرْده_ایم نَیاوَرْده_اید نَیاوَرْده_اَنْد",
  },
  gozâshtan: {
    spoken: "نَذاشْتَم نَذاشْتی نَذاشْته نَذاشْتیم نَذاشْتین نَذاشْتَن",
    written: "نَگُذاشْته_اَم نَگُذاشْته_ای نَگُذاشْته+اَسْت نَگُذاشْته_ایم نَگُذاشْته_اید نَگُذاشْته_اَنْد",
  },
  "harf-zadan": {
    spoken: "حَرْف+نَزَدَم حَرْف+نَزَدی حَرْف+نَزَده حَرْف+نَزَدیم حَرْف+نَزَدین حَرْف+نَزَدَن",
    written: "حَرْف+نَزَده_اَم حَرْف+نَزَده_ای حَرْف+نَزَده+اَسْت حَرْف+نَزَده_ایم حَرْف+نَزَده_اید حَرْف+نَزَده_اَنْد",
  },
};

// ── Past continuous: می + the simple past. بودن and داشتن take no می and have none.
const IMPERFECT: Golden = {
  raftan: {
    spoken: "می_رَفْتَم می_رَفْتی می_رَفْت می_رَفْتیم می_رَفْتین می_رَفْتَن",
    written: "می_رَفْتَم می_رَفْتی می_رَفْت می_رَفْتیم می_رَفْتید می_رَفْتَنْد",
  },
  âmadan: {
    spoken: "میومَدَم میومَدی میومَد میومَدیم میومَدین میومَدَن",
    written: "می_آمَدَم می_آمَدی می_آمَد می_آمَدیم می_آمَدید می_آمَدَنْد",
  },
  kardan: {
    spoken: "می_کَرْدَم می_کَرْدی می_کَرْد می_کَرْدیم می_کَرْدین می_کَرْدَن",
    written: "می_کَرْدَم می_کَرْدی می_کَرْد می_کَرْدیم می_کَرْدید می_کَرْدَنْد",
  },
  shodan: {
    spoken: "می_شُدَم می_شُدی می_شُد می_شُدیم می_شُدین می_شُدَن",
    written: "می_شُدَم می_شُدی می_شُد می_شُدیم می_شُدید می_شُدَنْد",
  },
  goftan: {
    spoken: "می_گُفْتَم می_گُفْتی می_گُفْت می_گُفْتیم می_گُفْتین می_گُفْتَن",
    written: "می_گُفْتَم می_گُفْتی می_گُفْت می_گُفْتیم می_گُفْتید می_گُفْتَنْد",
  },
  dâdan: {
    spoken: "می_دادَم می_دادی می_داد می_دادیم می_دادین می_دادَن",
    written: "می_دادَم می_دادی می_داد می_دادیم می_دادید می_دادَنْد",
  },
  didan: {
    spoken: "می_دیدَم می_دیدی می_دید می_دیدیم می_دیدین می_دیدَن",
    written: "می_دیدَم می_دیدی می_دید می_دیدیم می_دیدید می_دیدَنْد",
  },
  khâstan: {
    spoken: "می_خواسْتَم می_خواسْتی می_خواسْت می_خواسْتیم می_خواسْتین می_خواسْتَن",
    written: "می_خواسْتَم می_خواسْتی می_خواسْت می_خواسْتیم می_خواسْتید می_خواسْتَنْد",
  },
  dânestan: {
    spoken: "می_دونِسْتَم می_دونِسْتی می_دونِسْت می_دونِسْتیم می_دونِسْتین می_دونِسْتَن",
    written: "می_دانِسْتَم می_دانِسْتی می_دانِسْت می_دانِسْتیم می_دانِسْتید می_دانِسْتَنْد",
  },
  tavânestan: {
    spoken: "می_تونِسْتَم می_تونِسْتی می_تونِسْت می_تونِسْتیم می_تونِسْتین می_تونِسْتَن",
    written: "می_تَوانِسْتَم می_تَوانِسْتی می_تَوانِسْت می_تَوانِسْتیم می_تَوانِسْتید می_تَوانِسْتَنْد",
  },
  khordan: {
    spoken: "می_خُورْدَم می_خُورْدی می_خُورْد می_خُورْدیم می_خُورْدین می_خُورْدَن",
    written: "می_خُورْدَم می_خُورْدی می_خُورْد می_خُورْدیم می_خُورْدید می_خُورْدَنْد",
  },
  kharidan: {
    spoken: "می_خَریدَم می_خَریدی می_خَرید می_خَریدیم می_خَریدین می_خَریدَن",
    written: "می_خَریدَم می_خَریدی می_خَرید می_خَریدیم می_خَریدید می_خَریدَنْد",
  },
  neveshtan: {
    spoken: "می_نِوِشْتَم می_نِوِشْتی می_نِوِشْت می_نِوِشْتیم می_نِوِشْتین می_نِوِشْتَن",
    written: "می_نِوِشْتَم می_نِوِشْتی می_نِوِشْت می_نِوِشْتیم می_نِوِشْتید می_نِوِشْتَنْد",
  },
  khândan: {
    spoken: "می_خونْدَم می_خونْدی می_خونْد می_خونْدیم می_خونْدین می_خونْدَن",
    written: "می_خوانْدَم می_خوانْدی می_خوانْد می_خوانْدیم می_خوانْدید می_خوانْدَنْد",
  },
  gereftan: {
    spoken: "می_گِرِفْتَم می_گِرِفْتی می_گِرِفْت می_گِرِفْتیم می_گِرِفْتین می_گِرِفْتَن",
    written: "می_گِرِفْتَم می_گِرِفْتی می_گِرِفْت می_گِرِفْتیم می_گِرِفْتید می_گِرِفْتَنْد",
  },
  zadan: {
    spoken: "می_زَدَم می_زَدی می_زَد می_زَدیم می_زَدین می_زَدَن",
    written: "می_زَدَم می_زَدی می_زَد می_زَدیم می_زَدید می_زَدَنْد",
  },
  âvardan: {
    spoken: "میاوُرْدَم میاوُرْدی میاوُرْد میاوُرْدیم میاوُرْدین میاوُرْدَن",
    written: "می_آوَرْدَم می_آوَرْدی می_آوَرْد می_آوَرْدیم می_آوَرْدید می_آوَرْدَنْد",
  },
  gozâshtan: {
    spoken: "می_ذاشْتَم می_ذاشْتی می_ذاشْت می_ذاشْتیم می_ذاشْتین می_ذاشْتَن",
    written: "می_گُذاشْتَم می_گُذاشْتی می_گُذاشْت می_گُذاشْتیم می_گُذاشْتید می_گُذاشْتَنْد",
  },
  porsidan: {
    spoken: "می_پُرْسیدَم می_پُرْسیدی می_پُرْسید می_پُرْسیدیم می_پُرْسیدین می_پُرْسیدَن",
    written: "می_پُرْسیدَم می_پُرْسیدی می_پُرْسید می_پُرْسیدیم می_پُرْسیدید می_پُرْسیدَنْد",
  },
  fahmidan: {
    spoken: "می_فَهْمیدَم می_فَهْمیدی می_فَهْمید می_فَهْمیدیم می_فَهْمیدین می_فَهْمیدَن",
    written: "می_فَهْمیدَم می_فَهْمیدی می_فَهْمید می_فَهْمیدیم می_فَهْمیدید می_فَهْمیدَنْد",
  },
  shenâkhtan: {
    spoken: "می_شِناخْتَم می_شِناخْتی می_شِناخْت می_شِناخْتیم می_شِناخْتین می_شِناخْتَن",
    written: "می_شِناخْتَم می_شِناخْتی می_شِناخْت می_شِناخْتیم می_شِناخْتید می_شِناخْتَنْد",
  },
  "kâr-kardan": {
    spoken: "کار+می_کَرْدَم کار+می_کَرْدی کار+می_کَرْد کار+می_کَرْدیم کار+می_کَرْدین کار+می_کَرْدَن",
    written: "کار+می_کَرْدَم کار+می_کَرْدی کار+می_کَرْد کار+می_کَرْدیم کار+می_کَرْدید کار+می_کَرْدَنْد",
  },
  "harf-zadan": {
    spoken: "حَرْف+می_زَدَم حَرْف+می_زَدی حَرْف+می_زَد حَرْف+می_زَدیم حَرْف+می_زَدین حَرْف+می_زَدَن",
    written: "حَرْف+می_زَدَم حَرْف+می_زَدی حَرْف+می_زَد حَرْف+می_زَدیم حَرْف+می_زَدید حَرْف+می_زَدَنْد",
  },
  "zendegi-kardan": {
    spoken: "زِنْدِگی+می_کَرْدَم زِنْدِگی+می_کَرْدی زِنْدِگی+می_کَرْد زِنْدِگی+می_کَرْدیم زِنْدِگی+می_کَرْدین زِنْدِگی+می_کَرْدَن",
    written: "زِنْدِگی+می_کَرْدَم زِنْدِگی+می_کَرْدی زِنْدِگی+می_کَرْد زِنْدِگی+می_کَرْدیم زِنْدِگی+می_کَرْدید زِنْدِگی+می_کَرْدَنْد",
  },
};

// The negative past continuous of the verbs whose می is not simply prefixed.
const IMPERFECT_NEG: Golden = {
  âmadan: {
    spoken: "نِمیومَدَم نِمیومَدی نِمیومَد نِمیومَدیم نِمیومَدین نِمیومَدَن",
    written: "نِمی_آمَدَم نِمی_آمَدی نِمی_آمَد نِمی_آمَدیم نِمی_آمَدید نِمی_آمَدَنْد",
  },
  âvardan: {
    spoken: "نِمیاوُرْدَم نِمیاوُرْدی نِمیاوُرْد نِمیاوُرْدیم نِمیاوُرْدین نِمیاوُرْدَن",
    written: "نِمی_آوَرْدَم نِمی_آوَرْدی نِمی_آوَرْد نِمی_آوَرْدیم نِمی_آوَرْدید نِمی_آوَرْدَنْد",
  },
  "harf-zadan": {
    spoken: "حَرْف+نِمی_زَدَم حَرْف+نِمی_زَدی حَرْف+نِمی_زَد حَرْف+نِمی_زَدیم حَرْف+نِمی_زَدین حَرْف+نِمی_زَدَن",
    written: "حَرْف+نِمی_زَدَم حَرْف+نِمی_زَدی حَرْف+نِمی_زَد حَرْف+نِمی_زَدیم حَرْف+نِمی_زَدید حَرْف+نِمی_زَدَنْد",
  },
};

// ── The progressive: داشتن in the present, then the present; both take the ending.
// Verbs that name a state (be, have, want, know, can) have none, and it has no negative.
const PROGRESSIVE: Golden = {
  raftan: {
    spoken: "دارَم+می_رَم داری+می_ری داره+می_ره داریم+می_ریم دارین+می_رین دارَن+می_رَن",
    written: "دارَم+می_رَوَم داری+می_رَوی دارَد+می_رَوَد داریم+می_رَویم دارید+می_رَوید دارَنْد+می_رَوَنْد",
  },
  âmadan: {
    spoken: "دارَم+میام داری+میای داره+میاد داریم+میاییم دارین+میایین دارَن+میان",
    written: "دارَم+می_آیَم داری+می_آیی دارَد+می_آیَد داریم+می_آییم دارید+می_آیید دارَنْد+می_آیَنْد",
  },
  kardan: {
    spoken: "دارَم+می_کُنَم داری+می_کُنی داره+می_کُنه داریم+می_کُنیم دارین+می_کُنین دارَن+می_کُنَن",
    written: "دارَم+می_کُنَم داری+می_کُنی دارَد+می_کُنَد داریم+می_کُنیم دارید+می_کُنید دارَنْد+می_کُنَنْد",
  },
  shodan: {
    spoken: "دارَم+می_شَم داری+می_شی داره+می_شه داریم+می_شیم دارین+می_شین دارَن+می_شَن",
    written: "دارَم+می_شَوَم داری+می_شَوی دارَد+می_شَوَد داریم+می_شَویم دارید+می_شَوید دارَنْد+می_شَوَنْد",
  },
  goftan: {
    spoken: "دارَم+می_گَم داری+می_گی داره+می_گه داریم+می_گیم دارین+می_گین دارَن+می_گَن",
    written: "دارَم+می_گویَم داری+می_گویی دارَد+می_گویَد داریم+می_گوییم دارید+می_گویید دارَنْد+می_گویَنْد",
  },
  dâdan: {
    spoken: "دارَم+می_دَم داری+می_دی داره+می_ده داریم+می_دیم دارین+می_دین دارَن+می_دَن",
    written: "دارَم+می_دَهَم داری+می_دَهی دارَد+می_دَهَد داریم+می_دَهیم دارید+می_دَهید دارَنْد+می_دَهَنْد",
  },
  didan: {
    spoken: "دارَم+می_بینَم داری+می_بینی داره+می_بینه داریم+می_بینیم دارین+می_بینین دارَن+می_بینَن",
    written: "دارَم+می_بینَم داری+می_بینی دارَد+می_بینَد داریم+می_بینیم دارید+می_بینید دارَنْد+می_بینَنْد",
  },
  khordan: {
    spoken: "دارَم+می_خُورَم داری+می_خُوری داره+می_خُوره داریم+می_خُوریم دارین+می_خُورین دارَن+می_خُورَن",
    written: "دارَم+می_خُورَم داری+می_خُوری دارَد+می_خُورَد داریم+می_خُوریم دارید+می_خُورید دارَنْد+می_خُورَنْد",
  },
  kharidan: {
    spoken: "دارَم+می_خَرَم داری+می_خَری داره+می_خَره داریم+می_خَریم دارین+می_خَرین دارَن+می_خَرَن",
    written: "دارَم+می_خَرَم داری+می_خَری دارَد+می_خَرَد داریم+می_خَریم دارید+می_خَرید دارَنْد+می_خَرَنْد",
  },
  neveshtan: {
    spoken: "دارَم+می_نِویسَم داری+می_نِویسی داره+می_نِویسه داریم+می_نِویسیم دارین+می_نِویسین دارَن+می_نِویسَن",
    written: "دارَم+می_نِویسَم داری+می_نِویسی دارَد+می_نِویسَد داریم+می_نِویسیم دارید+می_نِویسید دارَنْد+می_نِویسَنْد",
  },
  khândan: {
    spoken: "دارَم+می_خونَم داری+می_خونی داره+می_خونه داریم+می_خونیم دارین+می_خونین دارَن+می_خونَن",
    written: "دارَم+می_خوانَم داری+می_خوانی دارَد+می_خوانَد داریم+می_خوانیم دارید+می_خوانید دارَنْد+می_خوانَنْد",
  },
  gereftan: {
    spoken: "دارَم+می_گیرَم داری+می_گیری داره+می_گیره داریم+می_گیریم دارین+می_گیرین دارَن+می_گیرَن",
    written: "دارَم+می_گیرَم داری+می_گیری دارَد+می_گیرَد داریم+می_گیریم دارید+می_گیرید دارَنْد+می_گیرَنْد",
  },
  zadan: {
    spoken: "دارَم+می_زَنَم داری+می_زَنی داره+می_زَنه داریم+می_زَنیم دارین+می_زَنین دارَن+می_زَنَن",
    written: "دارَم+می_زَنَم داری+می_زَنی دارَد+می_زَنَد داریم+می_زَنیم دارید+می_زَنید دارَنْد+می_زَنَنْد",
  },
  âvardan: {
    spoken: "دارَم+میارَم داری+میاری داره+میاره داریم+میاریم دارین+میارین دارَن+میارَن",
    written: "دارَم+می_آوَرَم داری+می_آوَری دارَد+می_آوَرَد داریم+می_آوَریم دارید+می_آوَرید دارَنْد+می_آوَرَنْد",
  },
  gozâshtan: {
    spoken: "دارَم+می_ذارَم داری+می_ذاری داره+می_ذاره داریم+می_ذاریم دارین+می_ذارین دارَن+می_ذارَن",
    written: "دارَم+می_گُذارَم داری+می_گُذاری دارَد+می_گُذارَد داریم+می_گُذاریم دارید+می_گُذارید دارَنْد+می_گُذارَنْد",
  },
  porsidan: {
    spoken: "دارَم+می_پُرْسَم داری+می_پُرْسی داره+می_پُرْسه داریم+می_پُرْسیم دارین+می_پُرْسین دارَن+می_پُرْسَن",
    written: "دارَم+می_پُرْسَم داری+می_پُرْسی دارَد+می_پُرْسَد داریم+می_پُرْسیم دارید+می_پُرْسید دارَنْد+می_پُرْسَنْد",
  },
  fahmidan: {
    spoken: "دارَم+می_فَهْمَم داری+می_فَهْمی داره+می_فَهْمه داریم+می_فَهْمیم دارین+می_فَهْمین دارَن+می_فَهْمَن",
    written: "دارَم+می_فَهْمَم داری+می_فَهْمی دارَد+می_فَهْمَد داریم+می_فَهْمیم دارید+می_فَهْمید دارَنْد+می_فَهْمَنْد",
  },
  "kâr-kardan": {
    spoken: "دارَم+کار+می_کُنَم داری+کار+می_کُنی داره+کار+می_کُنه داریم+کار+می_کُنیم دارین+کار+می_کُنین دارَن+کار+می_کُنَن",
    written: "دارَم+کار+می_کُنَم داری+کار+می_کُنی دارَد+کار+می_کُنَد داریم+کار+می_کُنیم دارید+کار+می_کُنید دارَنْد+کار+می_کُنَنْد",
  },
  "harf-zadan": {
    spoken: "دارَم+حَرْف+می_زَنَم داری+حَرْف+می_زَنی داره+حَرْف+می_زَنه داریم+حَرْف+می_زَنیم دارین+حَرْف+می_زَنین دارَن+حَرْف+می_زَنَن",
    written: "دارَم+حَرْف+می_زَنَم داری+حَرْف+می_زَنی دارَد+حَرْف+می_زَنَد داریم+حَرْف+می_زَنیم دارید+حَرْف+می_زَنید دارَنْد+حَرْف+می_زَنَنْد",
  },
  "zendegi-kardan": {
    spoken:
      "دارَم+زِنْدِگی+می_کُنَم داری+زِنْدِگی+می_کُنی داره+زِنْدِگی+می_کُنه داریم+زِنْدِگی+می_کُنیم دارین+زِنْدِگی+می_کُنین دارَن+زِنْدِگی+می_کُنَن",
    written:
      "دارَم+زِنْدِگی+می_کُنَم داری+زِنْدِگی+می_کُنی دارَد+زِنْدِگی+می_کُنَد داریم+زِنْدِگی+می_کُنیم دارید+زِنْدِگی+می_کُنید دارَنْد+زِنْدِگی+می_کُنَنْد",
  },
};

// ── The past progressive: داشتن in the past, then the past continuous.
const PAST_PROGRESSIVE: Golden = {
  raftan: {
    spoken: "داشْتَم+می_رَفْتَم داشْتی+می_رَفْتی داشْت+می_رَفْت داشْتیم+می_رَفْتیم داشْتین+می_رَفْتین داشْتَن+می_رَفْتَن",
    written: "داشْتَم+می_رَفْتَم داشْتی+می_رَفْتی داشْت+می_رَفْت داشْتیم+می_رَفْتیم داشْتید+می_رَفْتید داشْتَنْد+می_رَفْتَنْد",
  },
  âmadan: {
    spoken: "داشْتَم+میومَدَم داشْتی+میومَدی داشْت+میومَد داشْتیم+میومَدیم داشْتین+میومَدین داشْتَن+میومَدَن",
    written: "داشْتَم+می_آمَدَم داشْتی+می_آمَدی داشْت+می_آمَد داشْتیم+می_آمَدیم داشْتید+می_آمَدید داشْتَنْد+می_آمَدَنْد",
  },
  kardan: {
    spoken: "داشْتَم+می_کَرْدَم داشْتی+می_کَرْدی داشْت+می_کَرْد داشْتیم+می_کَرْدیم داشْتین+می_کَرْدین داشْتَن+می_کَرْدَن",
    written: "داشْتَم+می_کَرْدَم داشْتی+می_کَرْدی داشْت+می_کَرْد داشْتیم+می_کَرْدیم داشْتید+می_کَرْدید داشْتَنْد+می_کَرْدَنْد",
  },
  shodan: {
    spoken: "داشْتَم+می_شُدَم داشْتی+می_شُدی داشْت+می_شُد داشْتیم+می_شُدیم داشْتین+می_شُدین داشْتَن+می_شُدَن",
    written: "داشْتَم+می_شُدَم داشْتی+می_شُدی داشْت+می_شُد داشْتیم+می_شُدیم داشْتید+می_شُدید داشْتَنْد+می_شُدَنْد",
  },
  goftan: {
    spoken: "داشْتَم+می_گُفْتَم داشْتی+می_گُفْتی داشْت+می_گُفْت داشْتیم+می_گُفْتیم داشْتین+می_گُفْتین داشْتَن+می_گُفْتَن",
    written: "داشْتَم+می_گُفْتَم داشْتی+می_گُفْتی داشْت+می_گُفْت داشْتیم+می_گُفْتیم داشْتید+می_گُفْتید داشْتَنْد+می_گُفْتَنْد",
  },
  dâdan: {
    spoken: "داشْتَم+می_دادَم داشْتی+می_دادی داشْت+می_داد داشْتیم+می_دادیم داشْتین+می_دادین داشْتَن+می_دادَن",
    written: "داشْتَم+می_دادَم داشْتی+می_دادی داشْت+می_داد داشْتیم+می_دادیم داشْتید+می_دادید داشْتَنْد+می_دادَنْد",
  },
  didan: {
    spoken: "داشْتَم+می_دیدَم داشْتی+می_دیدی داشْت+می_دید داشْتیم+می_دیدیم داشْتین+می_دیدین داشْتَن+می_دیدَن",
    written: "داشْتَم+می_دیدَم داشْتی+می_دیدی داشْت+می_دید داشْتیم+می_دیدیم داشْتید+می_دیدید داشْتَنْد+می_دیدَنْد",
  },
  khordan: {
    spoken: "داشْتَم+می_خُورْدَم داشْتی+می_خُورْدی داشْت+می_خُورْد داشْتیم+می_خُورْدیم داشْتین+می_خُورْدین داشْتَن+می_خُورْدَن",
    written: "داشْتَم+می_خُورْدَم داشْتی+می_خُورْدی داشْت+می_خُورْد داشْتیم+می_خُورْدیم داشْتید+می_خُورْدید داشْتَنْد+می_خُورْدَنْد",
  },
  kharidan: {
    spoken: "داشْتَم+می_خَریدَم داشْتی+می_خَریدی داشْت+می_خَرید داشْتیم+می_خَریدیم داشْتین+می_خَریدین داشْتَن+می_خَریدَن",
    written: "داشْتَم+می_خَریدَم داشْتی+می_خَریدی داشْت+می_خَرید داشْتیم+می_خَریدیم داشْتید+می_خَریدید داشْتَنْد+می_خَریدَنْد",
  },
  neveshtan: {
    spoken: "داشْتَم+می_نِوِشْتَم داشْتی+می_نِوِشْتی داشْت+می_نِوِشْت داشْتیم+می_نِوِشْتیم داشْتین+می_نِوِشْتین داشْتَن+می_نِوِشْتَن",
    written: "داشْتَم+می_نِوِشْتَم داشْتی+می_نِوِشْتی داشْت+می_نِوِشْت داشْتیم+می_نِوِشْتیم داشْتید+می_نِوِشْتید داشْتَنْد+می_نِوِشْتَنْد",
  },
  khândan: {
    spoken: "داشْتَم+می_خونْدَم داشْتی+می_خونْدی داشْت+می_خونْد داشْتیم+می_خونْدیم داشْتین+می_خونْدین داشْتَن+می_خونْدَن",
    written: "داشْتَم+می_خوانْدَم داشْتی+می_خوانْدی داشْت+می_خوانْد داشْتیم+می_خوانْدیم داشْتید+می_خوانْدید داشْتَنْد+می_خوانْدَنْد",
  },
  gereftan: {
    spoken: "داشْتَم+می_گِرِفْتَم داشْتی+می_گِرِفْتی داشْت+می_گِرِفْت داشْتیم+می_گِرِفْتیم داشْتین+می_گِرِفْتین داشْتَن+می_گِرِفْتَن",
    written: "داشْتَم+می_گِرِفْتَم داشْتی+می_گِرِفْتی داشْت+می_گِرِفْت داشْتیم+می_گِرِفْتیم داشْتید+می_گِرِفْتید داشْتَنْد+می_گِرِفْتَنْد",
  },
  zadan: {
    spoken: "داشْتَم+می_زَدَم داشْتی+می_زَدی داشْت+می_زَد داشْتیم+می_زَدیم داشْتین+می_زَدین داشْتَن+می_زَدَن",
    written: "داشْتَم+می_زَدَم داشْتی+می_زَدی داشْت+می_زَد داشْتیم+می_زَدیم داشْتید+می_زَدید داشْتَنْد+می_زَدَنْد",
  },
  âvardan: {
    spoken: "داشْتَم+میاوُرْدَم داشْتی+میاوُرْدی داشْت+میاوُرْد داشْتیم+میاوُرْدیم داشْتین+میاوُرْدین داشْتَن+میاوُرْدَن",
    written: "داشْتَم+می_آوَرْدَم داشْتی+می_آوَرْدی داشْت+می_آوَرْد داشْتیم+می_آوَرْدیم داشْتید+می_آوَرْدید داشْتَنْد+می_آوَرْدَنْد",
  },
  gozâshtan: {
    spoken: "داشْتَم+می_ذاشْتَم داشْتی+می_ذاشْتی داشْت+می_ذاشْت داشْتیم+می_ذاشْتیم داشْتین+می_ذاشْتین داشْتَن+می_ذاشْتَن",
    written: "داشْتَم+می_گُذاشْتَم داشْتی+می_گُذاشْتی داشْت+می_گُذاشْت داشْتیم+می_گُذاشْتیم داشْتید+می_گُذاشْتید داشْتَنْد+می_گُذاشْتَنْد",
  },
  porsidan: {
    spoken: "داشْتَم+می_پُرْسیدَم داشْتی+می_پُرْسیدی داشْت+می_پُرْسید داشْتیم+می_پُرْسیدیم داشْتین+می_پُرْسیدین داشْتَن+می_پُرْسیدَن",
    written: "داشْتَم+می_پُرْسیدَم داشْتی+می_پُرْسیدی داشْت+می_پُرْسید داشْتیم+می_پُرْسیدیم داشْتید+می_پُرْسیدید داشْتَنْد+می_پُرْسیدَنْد",
  },
  fahmidan: {
    spoken: "داشْتَم+می_فَهْمیدَم داشْتی+می_فَهْمیدی داشْت+می_فَهْمید داشْتیم+می_فَهْمیدیم داشْتین+می_فَهْمیدین داشْتَن+می_فَهْمیدَن",
    written: "داشْتَم+می_فَهْمیدَم داشْتی+می_فَهْمیدی داشْت+می_فَهْمید داشْتیم+می_فَهْمیدیم داشْتید+می_فَهْمیدید داشْتَنْد+می_فَهْمیدَنْد",
  },
  "kâr-kardan": {
    spoken:
      "داشْتَم+کار+می_کَرْدَم داشْتی+کار+می_کَرْدی داشْت+کار+می_کَرْد داشْتیم+کار+می_کَرْدیم داشْتین+کار+می_کَرْدین داشْتَن+کار+می_کَرْدَن",
    written:
      "داشْتَم+کار+می_کَرْدَم داشْتی+کار+می_کَرْدی داشْت+کار+می_کَرْد داشْتیم+کار+می_کَرْدیم داشْتید+کار+می_کَرْدید داشْتَنْد+کار+می_کَرْدَنْد",
  },
  "harf-zadan": {
    spoken:
      "داشْتَم+حَرْف+می_زَدَم داشْتی+حَرْف+می_زَدی داشْت+حَرْف+می_زَد داشْتیم+حَرْف+می_زَدیم داشْتین+حَرْف+می_زَدین داشْتَن+حَرْف+می_زَدَن",
    written:
      "داشْتَم+حَرْف+می_زَدَم داشْتی+حَرْف+می_زَدی داشْت+حَرْف+می_زَد داشْتیم+حَرْف+می_زَدیم داشْتید+حَرْف+می_زَدید داشْتَنْد+حَرْف+می_زَدَنْد",
  },
  "zendegi-kardan": {
    spoken:
      "داشْتَم+زِنْدِگی+می_کَرْدَم داشْتی+زِنْدِگی+می_کَرْدی داشْت+زِنْدِگی+می_کَرْد داشْتیم+زِنْدِگی+می_کَرْدیم داشْتین+زِنْدِگی+می_کَرْدین داشْتَن+زِنْدِگی+می_کَرْدَن",
    written:
      "داشْتَم+زِنْدِگی+می_کَرْدَم داشْتی+زِنْدِگی+می_کَرْدی داشْت+زِنْدِگی+می_کَرْد داشْتیم+زِنْدِگی+می_کَرْدیم داشْتید+زِنْدِگی+می_کَرْدید داشْتَنْد+زِنْدِگی+می_کَرْدَنْد",
  },
};

// Transliterations, checked against the pronunciation.
const TRANSLIT: { verb: string; tense: Tense; style: Style; negative?: boolean; says: string }[] = [
  { verb: "budan", tense: "past", style: "spoken", says: "budam budi bud budim budin budan" },
  { verb: "raftan", tense: "past", style: "written", says: "raftam rafti raft raftim raftid raftand" },
  { verb: "raftan", tense: "past", style: "written", negative: true, says: "naraftam narafti naraft naraftim naraftid naraftand" },
  { verb: "âmadan", tense: "past", style: "spoken", says: "umadam umadi umad umadim umadin umadan" },
  { verb: "âmadan", tense: "past", style: "spoken", negative: true, says: "nayumadam nayumadi nayumad nayumadim nayumadin nayumadan" },
  { verb: "âmadan", tense: "past", style: "written", negative: true, says: "nayâmadam nayâmadi nayâmad nayâmadim nayâmadid nayâmadand" },
  { verb: "khordan", tense: "past", style: "spoken", says: "khordam khordi khord khordim khordin khordan" },
  { verb: "khândan", tense: "past", style: "spoken", says: "khundam khundi khund khundim khundin khundan" },
  { verb: "dânestan", tense: "past", style: "spoken", says: "dunestam dunesti dunest dunestim dunestin dunestan" },
  { verb: "tavânestan", tense: "past", style: "spoken", says: "tunestam tunesti tunest tunestim tunestin tunestan" },
  { verb: "âvardan", tense: "past", style: "spoken", says: "âvordam âvordi âvord âvordim âvordin âvordan" },
  { verb: "âvardan", tense: "past", style: "written", negative: true, says: "nayâvardam nayâvardi nayâvard nayâvardim nayâvardid nayâvardand" },
  { verb: "raftan", tense: "perfect", style: "written", says: "rafte-am rafte-i rafte ast rafte-im rafte-id rafte-and" },
  { verb: "raftan", tense: "perfect", style: "spoken", says: "raftam rafti rafte raftim raftin raftan" },
  { verb: "âmadan", tense: "perfect", style: "written", negative: true, says: "nayâmade-am nayâmade-i nayâmade ast nayâmade-im nayâmade-id nayâmade-and" },
  { verb: "raftan", tense: "imperfect", style: "written", says: "miraftam mirafti miraft miraftim miraftid miraftand" },
  { verb: "âmadan", tense: "imperfect", style: "spoken", says: "miyumadam miyumadi miyumad miyumadim miyumadin miyumadan" },
  { verb: "âmadan", tense: "imperfect", style: "spoken", negative: true, says: "nemiyumadam nemiyumadi nemiyumad nemiyumadim nemiyumadin nemiyumadan" },
  { verb: "gozâshtan", tense: "past", style: "spoken", says: "gozâshtam gozâshti gozâsht gozâshtim gozâshtin gozâshtan" },
  { verb: "gozâshtan", tense: "past", style: "spoken", negative: true, says: "nazâshtam nazâshti nazâsht nazâshtim nazâshtin nazâshtan" },
  { verb: "gozâshtan", tense: "imperfect", style: "spoken", says: "mizâshtam mizâshti mizâsht mizâshtim mizâshtin mizâshtan" },
  { verb: "âmadan", tense: "imperfect", style: "written", says: "mi-âmadam mi-âmadi mi-âmad mi-âmadim mi-âmadid mi-âmadand" },
  { verb: "âvardan", tense: "imperfect", style: "spoken", says: "miyâvordam miyâvordi miyâvord miyâvordim miyâvordin miyâvordan" },
  { verb: "raftan", tense: "progressive", style: "spoken", says: "dâram miram, dâri miri, dâre mire, dârim mirim, dârin mirin, dâran miran" },
  { verb: "kâr-kardan", tense: "past-progressive", style: "written", says: "dâshtam kâr mikardam, dâshti kâr mikardi, dâsht kâr mikard, dâshtim kâr mikardim, dâshtid kâr mikardid, dâshtand kâr mikardand" },
];

const partWords = (id: string) => verbById.get(id)!.part?.split(" ").length ?? 0;
/** نَ on the verb word (after a compound's first part). */
const negated = (form: string, at: number) =>
  form
    .split(" ")
    .map((w, i) => (i === at ? "نَ" + w : w))
    .join(" ");

const LACK = {
  present: ["budan"],
  imperfect: ["budan", "dâshtan"],
  progressive: ["budan", "khâstan", "dânestan", "tavânestan", "dâshtan", "shenâkhtan"],
};

describe("conjugate: golden tables of the past tenses", () => {
  const cases: [Tense, Golden, string[]][] = [
    ["past", PAST, []],
    ["perfect", PERFECT, []],
    ["imperfect", IMPERFECT, LACK.imperfect],
    ["progressive", PROGRESSIVE, LACK.progressive],
    ["past-progressive", PAST_PROGRESSIVE, LACK.progressive],
  ];

  it.each(cases)("%s: a golden table for every verb that has the tense", (_tense, golden, lacking) => {
    expect(Object.keys(golden).sort()).toEqual(
      VERBS.map((v) => v.id)
        .filter((id) => !lacking.includes(id))
        .sort(),
    );
  });

  describe.each(cases)("%s", (tense, golden, lacking) => {
    it.each(VERBS.map((v) => v.id))("%s", (id) => {
      const v = verbById.get(id)!;
      if (lacking.includes(id)) {
        expect(lacks(v, tense, false, VERBS)).toBeTruthy();
        expect(() => conjugate(v, { tense, person: "1s", style: "spoken", negative: false }, VERBS)).toThrow();
        return;
      }
      expect(lacks(v, tense, false, VERBS)).toBeNull();
      for (const style of STYLES) expect(table(v, tense, style, false, VERBS), style).toEqual(row(golden[id][style]));
    });
  });

  describe.each([
    ["past", PAST, PAST_NEG],
    ["perfect", PERFECT, PERFECT_NEG],
  ] as [Tense, Golden, Golden][])("%s, negative", (tense, golden, byHand) => {
    it.each(VERBS.map((v) => v.id))("%s", (id) => {
      const v = verbById.get(id)!;
      for (const style of STYLES) {
        const want = byHand[id] ? row(byHand[id][style]) : row(golden[id][style]).map((f) => negated(f, partWords(id)));
        expect(table(v, tense, style, true, VERBS), style).toEqual(want);
      }
    });
  });

  describe("imperfect, negative", () => {
    it.each(Object.keys(IMPERFECT))("%s", (id) => {
      const v = verbById.get(id)!;
      for (const style of STYLES) {
        const want = IMPERFECT_NEG[id] ? row(IMPERFECT_NEG[id][style]) : row(IMPERFECT[id][style]).map((f) => f.replace(/(^| )می/, "$1نِمی"));
        expect(table(v, "imperfect", style, true, VERBS), style).toEqual(want);
      }
    });
  });

  it("the progressive has no negative", () => {
    for (const tense of ["progressive", "past-progressive"] as const)
      for (const v of VERBS) {
        expect(lacks(v, tense, true, VERBS), v.id).toBeTruthy();
        expect(() => table(v, tense, "spoken", true, VERBS)).toThrow();
      }
  });

  it("only بودن lacks the present", () => {
    expect(VERBS.filter((v) => lacks(v, "present", false, VERBS)).map((v) => v.id)).toEqual(LACK.present);
  });

  it.each(TRANSLIT)("$verb $tense $style transliterates as said", ({ verb, tense, style, negative, says }) => {
    const got = table(verbById.get(verb)!, tense, style, negative ?? false, VERBS).map((f) => transliterateWithErrors(f).text);
    expect(got.join(says.includes(",") ? ", " : " ")).toBe(says);
  });
});

describe("conjugate: English for the past tenses", () => {
  const go = verbById.get("raftan")!;
  const be = verbById.get("budan")!;
  const can = verbById.get("tavânestan")!;
  const know = verbById.get("dânestan")!;
  const en = (v: typeof go, tense: Tense, person: "1s" | "2s" | "3s" | "1p" | "3p", negative = false) =>
    englishOf(v, { tense, person, style: "spoken", negative });

  it("glosses the simple past", () => {
    expect(en(go, "past", "1s")).toBe("I went");
    expect(en(go, "past", "3s", true)).toBe("he/she didn't go");
    expect(en(be, "past", "1s")).toBe("I was");
    expect(en(be, "past", "1p")).toBe("we were");
    expect(en(be, "past", "3p", true)).toBe("they weren't");
  });
  it("glosses the simple past of a state as the event it is", () => {
    expect(en(know, "past", "1s")).toBe("I found out (a fact)");
    expect(en(know, "past", "1s", true)).toBe("I didn't find out (a fact)");
    expect(en(can, "past", "1s")).toBe("I managed to");
    expect(en(can, "past", "3s", true)).toBe("he/she didn't manage to");
    expect(en(verbById.get("shenâkhtan")!, "past", "1s")).toBe("I recognised (a person)");
    expect(en(verbById.get("khâstan")!, "past", "1s")).toBe("I wanted (at that moment)");
    // To have is a state with no event reading to teach: plain "had".
    expect(en(verbById.get("dâshtan")!, "past", "1s")).toBe("I had");
  });
  it("names the tense where the English past looks like the present", () => {
    expect(en(verbById.get("gozâshtan")!, "past", "1s")).toBe("I put (past)");
    expect(en(verbById.get("khândan")!, "past", "1s")).toBe("I read (past)");
    expect(en(verbById.get("zadan")!, "past", "1s", true)).toBe("I didn't hit");
  });
  it("glosses the present perfect", () => {
    expect(en(go, "perfect", "1s")).toBe("I have gone");
    expect(en(go, "perfect", "3s", true)).toBe("he/she hasn't gone");
    expect(en(be, "perfect", "3s")).toBe("he/she has been");
    expect(en(can, "perfect", "1p")).toBe("we have been able to");
  });
  it("glosses the past continuous both ways, and a state as the plain English past", () => {
    expect(en(go, "imperfect", "1s")).toBe("I was going / used to go");
    expect(en(go, "imperfect", "2s", true)).toBe("you weren't going / didn't use to go");
    expect(en(know, "imperfect", "1s")).toBe("I knew (a fact)");
    expect(en(know, "imperfect", "1s", true)).toBe("I didn't know (a fact)");
    expect(en(can, "imperfect", "1s")).toBe("I could");
    expect(en(can, "imperfect", "1s", true)).toBe("I couldn't");
    expect(en(verbById.get("khâstan")!, "imperfect", "1p")).toBe("we wanted");
  });
  it("glosses the progressive", () => {
    expect(en(go, "progressive", "1s")).toBe("I am going (right now)");
    expect(en(go, "progressive", "3s")).toBe("he/she is going (right now)");
    expect(en(go, "past-progressive", "3p")).toBe("they were going (right then)");
    expect(en(verbById.get("fahmidan")!, "progressive", "1s")).toBe("I am starting to understand (right now)");
    expect(en(verbById.get("didan")!, "past-progressive", "1s")).toBe("I was watching (right then)");
    expect(en(verbById.get("didan")!, "imperfect", "1s")).toBe("I was seeing / used to see");
  });
});

describe("conjugate: accepted answers in the past tenses", () => {
  const go = verbById.get("raftan")!;
  const come = verbById.get("âmadan")!;
  const bring = verbById.get("âvardan")!;
  const talk = verbById.get("harf-zadan")!;

  it("takes the written spelling for the spoken perfect, with a note", () => {
    const a = acceptedAnswers(go, { tense: "perfect", person: "1s", style: "spoken", negative: false }, VERBS);
    expect(a.answers).toEqual(row("رفتم من+رفتم"));
    expect(a.variants).toEqual(row("رفته_ام رفته_م"));
    const he = acceptedAnswers(go, { tense: "perfect", person: "3s", style: "spoken", negative: false }, VERBS);
    expect(he.answers[0]).toBe("رفته");
    expect(he.variants).toEqual(row("رفته+است"));
    const came = acceptedAnswers(come, { tense: "perfect", person: "1p", style: "spoken", negative: true }, VERBS);
    expect(came.answers[0]).toBe("نیومدیم");
    expect(came.variants).toEqual(row("نیامده_ایم نیومده_ایم نیومده_یم"));
    expect(acceptedAnswers(go, { tense: "perfect", person: "3p", style: "spoken", negative: false }, VERBS).variants).toEqual(row("رفته_اند رفته_ن"));
  });

  it("takes the written perfect without است", () => {
    const a = acceptedAnswers(go, { tense: "perfect", person: "3s", style: "written", negative: false }, VERBS);
    expect(a.answers).toEqual(row("رفته+است او+رفته+است"));
    expect(a.variants).toEqual(["رفته"]);
    expect(acceptedAnswers(talk, { tense: "perfect", person: "3s", style: "written", negative: true }, VERBS).variants).toEqual(row("حرف+نزده"));
  });

  it("takes the other ways speech types می before a vowel", () => {
    const spec = { tense: "imperfect" as const, person: "1s" as const, style: "spoken" as const, negative: false };
    expect(acceptedAnswers(come, spec, VERBS).answers[0]).toBe("میومدم");
    expect(acceptedAnswers(come, spec, VERBS).variants).toEqual(row("می_اومدم"));
    expect(acceptedAnswers(come, { ...spec, negative: true }, VERBS).variants).toEqual(row("نمی_اومدم"));
    expect(acceptedAnswers(bring, spec, VERBS).answers[0]).toBe("میاوردم");
    expect(acceptedAnswers(bring, spec, VERBS).variants).toEqual(row("می_آوردم"));
    expect(acceptedAnswers(come, { ...spec, tense: "past-progressive" }, VERBS).variants).toEqual(row("داشتم+می_اومدم"));
    expect(acceptedAnswers(come, { ...spec, tense: "progressive" }, VERBS).variants).toEqual(row("دارم+می_آم"));
  });

  it("takes both spoken stems of گذاشتن: short after a prefix, full without", () => {
    const put = verbById.get("gozâshtan")!;
    const spec = { person: "1s" as const, style: "spoken" as const };
    const v = (tense: Tense, negative: boolean) => acceptedAnswers(put, { ...spec, tense, negative }, VERBS);
    expect(v("past", false).answers[0]).toBe("گذاشتم");
    expect(v("past", false).variants).toEqual(["ذاشتم"]);
    expect(v("past", true).answers[0]).toBe("نذاشتم");
    expect(v("past", true).variants).toEqual(["نگذاشتم"]);
    expect(v("imperfect", false).answers[0]).toBe(row("می_ذاشتم")[0]);
    expect(v("imperfect", false).variants).toEqual(row("می_گذاشتم"));
    expect(v("past-progressive", false).variants).toEqual(row("داشتم+می_گذاشتم"));
    expect(v("present", false).variants).toEqual([]);
    // In writing there is one stem.
    expect(acceptedAnswers(put, { tense: "past", person: "1s", style: "written", negative: true }, VERBS).variants).toEqual([]);
  });

  it("takes -id for the spoken -in, on the verb words only", () => {
    const spec = { person: "2p" as const, style: "spoken" as const, negative: false };
    expect(acceptedAnswers(go, { ...spec, tense: "past" }, VERBS).variants).toEqual(["رفتید"]);
    expect(acceptedAnswers(go, { ...spec, tense: "progressive" }, VERBS).variants).toEqual(row("دارید+می_رید"));
    expect(acceptedAnswers(talk, { ...spec, tense: "past-progressive" }, VERBS).variants).toEqual(row("داشتید+حرف+می_زدید"));
  });

  it("tells every verb apart in English, in every tense", () => {
    for (const tense of ["past", "perfect", "imperfect", "progressive", "past-progressive"] as const) {
      const prompts = VERBS.filter((v) => !lacks(v, tense, false, VERBS)).map((v) => englishOf(v, { tense, person: "1s", style: "spoken", negative: false }));
      expect(new Set(prompts).size, tense).toBe(prompts.length);
    }
  });
});
