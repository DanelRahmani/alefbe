import { describe, expect, it } from "vitest";
import { VERBS, verbById } from "@/content/verbs";
import { STYLES, acceptedAnswers, conjugate, englishOf, hasForm, lacks, personsOf, stylesOf, table, type Style, type Tense } from "@/lib/conjugate";
import { transliterateWithErrors } from "@/lib/translit";
import { ZWNJ } from "@/lib/persian/chars";

/** Golden rows: forms separated by spaces, "_" standing for the half-space, "+" for a space. */
const row = (s: string) => s.split(" ").map((f) => f.replace(/_/g, ZWNJ).replace(/\+/g, " "));

type Golden = Record<string, Record<Style, string>>;

// Every table below was written by hand from the references (Thackston;
// Mahootian; Stilo, Talattof and Clinton for the Tehrani forms), not from the
// engine. Spoken then written.

// ── The subjunctive: بِـ + present stem + ending. Persons 1s 2s 3s 1p 2p 3p.
const SUBJUNCTIVE: Golden = {
  budan: {
    spoken: "باشَم باشی باشه باشیم باشین باشَن",
    written: "باشَم باشی باشَد باشیم باشید باشَنْد",
  },
  raftan: {
    spoken: "بِرَم بِری بِره بِریم بِرین بِرَن",
    written: "بِرَوَم بِرَوی بِرَوَد بِرَویم بِرَوید بِرَوَنْد",
  },
  âmadan: {
    spoken: "بیام بیای بیاد بیاییم بیایین بیان",
    written: "بیایَم بیایی بیایَد بیاییم بیایید بیایَنْد",
  },
  kardan: {
    spoken: "بِکُنَم بِکُنی بِکُنه بِکُنیم بِکُنین بِکُنَن",
    written: "بِکُنَم بِکُنی بِکُنَد بِکُنیم بِکُنید بِکُنَنْد",
  },
  shodan: {
    spoken: "بِشَم بِشی بِشه بِشیم بِشین بِشَن",
    written: "بِشَوَم بِشَوی بِشَوَد بِشَویم بِشَوید بِشَوَنْد",
  },
  goftan: {
    spoken: "بِگَم بِگی بِگه بِگیم بِگین بِگَن",
    written: "بِگویَم بِگویی بِگویَد بِگوییم بِگویید بِگویَنْد",
  },
  dâdan: {
    spoken: "بِدَم بِدی بِده بِدیم بِدین بِدَن",
    written: "بِدَهَم بِدَهی بِدَهَد بِدَهیم بِدَهید بِدَهَنْد",
  },
  didan: {
    spoken: "بِبینَم بِبینی بِبینه بِبینیم بِبینین بِبینَن",
    written: "بِبینَم بِبینی بِبینَد بِبینیم بِبینید بِبینَنْد",
  },
  khâstan: {
    spoken: "بِخوام بِخوای بِخواد بِخواییم بِخوایین بِخوان",
    written: "بِخواهَم بِخواهی بِخواهَد بِخواهیم بِخواهید بِخواهَنْد",
  },
  dânestan: {
    spoken: "بِدونَم بِدونی بِدونه بِدونیم بِدونین بِدونَن",
    written: "بِدانَم بِدانی بِدانَد بِدانیم بِدانید بِدانَنْد",
  },
  tavânestan: {
    spoken: "بِتونَم بِتونی بِتونه بِتونیم بِتونین بِتونَن",
    written: "بِتَوانَم بِتَوانی بِتَوانَد بِتَوانیم بِتَوانید بِتَوانَنْد",
  },
  dâshtan: {
    spoken: "داشْته+باشَم داشْته+باشی داشْته+باشه داشْته+باشیم داشْته+باشین داشْته+باشَن",
    written: "داشْته+باشَم داشْته+باشی داشْته+باشَد داشْته+باشیم داشْته+باشید داشْته+باشَنْد",
  },
  khordan: {
    spoken: "بِخُورَم بِخُوری بِخُوره بِخُوریم بِخُورین بِخُورَن",
    written: "بِخُورَم بِخُوری بِخُورَد بِخُوریم بِخُورید بِخُورَنْد",
  },
  kharidan: {
    spoken: "بِخَرَم بِخَری بِخَره بِخَریم بِخَرین بِخَرَن",
    written: "بِخَرَم بِخَری بِخَرَد بِخَریم بِخَرید بِخَرَنْد",
  },
  neveshtan: {
    spoken: "بِنِویسَم بِنِویسی بِنِویسه بِنِویسیم بِنِویسین بِنِویسَن",
    written: "بِنِویسَم بِنِویسی بِنِویسَد بِنِویسیم بِنِویسید بِنِویسَنْد",
  },
  khândan: {
    spoken: "بِخونَم بِخونی بِخونه بِخونیم بِخونین بِخونَن",
    written: "بِخوانَم بِخوانی بِخوانَد بِخوانیم بِخوانید بِخوانَنْد",
  },
  gereftan: {
    spoken: "بِگیرَم بِگیری بِگیره بِگیریم بِگیرین بِگیرَن",
    written: "بِگیرَم بِگیری بِگیرَد بِگیریم بِگیرید بِگیرَنْد",
  },
  zadan: {
    spoken: "بِزَنَم بِزَنی بِزَنه بِزَنیم بِزَنین بِزَنَن",
    written: "بِزَنَم بِزَنی بِزَنَد بِزَنیم بِزَنید بِزَنَنْد",
  },
  âvardan: {
    spoken: "بیارَم بیاری بیاره بیاریم بیارین بیارَن",
    written: "بیاوَرَم بیاوَری بیاوَرَد بیاوَریم بیاوَرید بیاوَرَنْد",
  },
  gozâshtan: {
    spoken: "بِذارَم بِذاری بِذاره بِذاریم بِذارین بِذارَن",
    written: "بِگُذارَم بِگُذاری بِگُذارَد بِگُذاریم بِگُذارید بِگُذارَنْد",
  },
  porsidan: {
    spoken: "بِپُرْسَم بِپُرْسی بِپُرْسه بِپُرْسیم بِپُرْسین بِپُرْسَن",
    written: "بِپُرْسَم بِپُرْسی بِپُرْسَد بِپُرْسیم بِپُرْسید بِپُرْسَنْد",
  },
  fahmidan: {
    spoken: "بِفَهْمَم بِفَهْمی بِفَهْمه بِفَهْمیم بِفَهْمین بِفَهْمَن",
    written: "بِفَهْمَم بِفَهْمی بِفَهْمَد بِفَهْمیم بِفَهْمید بِفَهْمَنْد",
  },
  shenâkhtan: {
    spoken: "بِشِناسَم بِشِناسی بِشِناسه بِشِناسیم بِشِناسین بِشِناسَن",
    written: "بِشِناسَم بِشِناسی بِشِناسَد بِشِناسیم بِشِناسید بِشِناسَنْد",
  },
  // A compound with کردن usually drops بِـ.
  "kâr-kardan": {
    spoken: "کار+کُنَم کار+کُنی کار+کُنه کار+کُنیم کار+کُنین کار+کُنَن",
    written: "کار+کُنَم کار+کُنی کار+کُنَد کار+کُنیم کار+کُنید کار+کُنَنْد",
  },
  "harf-zadan": {
    spoken: "حَرْف+بِزَنَم حَرْف+بِزَنی حَرْف+بِزَنه حَرْف+بِزَنیم حَرْف+بِزَنین حَرْف+بِزَنَن",
    written: "حَرْف+بِزَنَم حَرْف+بِزَنی حَرْف+بِزَنَد حَرْف+بِزَنیم حَرْف+بِزَنید حَرْف+بِزَنَنْد",
  },
  "zendegi-kardan": {
    spoken: "زِنْدِگی+کُنَم زِنْدِگی+کُنی زِنْدِگی+کُنه زِنْدِگی+کُنیم زِنْدِگی+کُنین زِنْدِگی+کُنَن",
    written: "زِنْدِگی+کُنَم زِنْدِگی+کُنی زِنْدِگی+کُنَد زِنْدِگی+کُنیم زِنْدِگی+کُنید زِنْدِگی+کُنَنْد",
  },
};

// The negative puts نَـ in place of بِـ. By hand where that is not a plain swap.
const SUBJUNCTIVE_NEG: Golden = {
  budan: {
    spoken: "نَباشَم نَباشی نَباشه نَباشیم نَباشین نَباشَن",
    written: "نَباشَم نَباشی نَباشَد نَباشیم نَباشید نَباشَنْد",
  },
  âmadan: {
    spoken: "نَیام نَیای نَیاد نَیاییم نَیایین نَیان",
    written: "نَیایَم نَیایی نَیایَد نَیاییم نَیایید نَیایَنْد",
  },
  dâshtan: {
    spoken: "نَداشْته+باشَم نَداشْته+باشی نَداشْته+باشه نَداشْته+باشیم نَداشْته+باشین نَداشْته+باشَن",
    written: "نَداشْته+باشَم نَداشْته+باشی نَداشْته+باشَد نَداشْته+باشیم نَداشْته+باشید نَداشْته+باشَنْد",
  },
  âvardan: {
    spoken: "نَیارَم نَیاری نَیاره نَیاریم نَیارین نَیارَن",
    written: "نَیاوَرَم نَیاوَری نَیاوَرَد نَیاوَریم نَیاوَرید نَیاوَرَنْد",
  },
  "kâr-kardan": {
    spoken: "کار+نَکُنَم کار+نَکُنی کار+نَکُنه کار+نَکُنیم کار+نَکُنین کار+نَکُنَن",
    written: "کار+نَکُنَم کار+نَکُنی کار+نَکُنَد کار+نَکُنیم کار+نَکُنید کار+نَکُنَنْد",
  },
  "harf-zadan": {
    spoken: "حَرْف+نَزَنَم حَرْف+نَزَنی حَرْف+نَزَنه حَرْف+نَزَنیم حَرْف+نَزَنین حَرْف+نَزَنَن",
    written: "حَرْف+نَزَنَم حَرْف+نَزَنی حَرْف+نَزَنَد حَرْف+نَزَنیم حَرْف+نَزَنید حَرْف+نَزَنَنْد",
  },
  "zendegi-kardan": {
    spoken: "زِنْدِگی+نَکُنَم زِنْدِگی+نَکُنی زِنْدِگی+نَکُنه زِنْدِگی+نَکُنیم زِنْدِگی+نَکُنین زِنْدِگی+نَکُنَن",
    written: "زِنْدِگی+نَکُنَم زِنْدِگی+نَکُنی زِنْدِگی+نَکُنَد زِنْدِگی+نَکُنیم زِنْدِگی+نَکُنید زِنْدِگی+نَکُنَنْد",
  },
};

// ── The imperative: to تو, then to شما. Every row by hand, do and don't.
const IMPERATIVE: Golden = {
  budan: { spoken: "باش باشین", written: "باش باشید" },
  raftan: { spoken: "بُرُو بِرین", written: "بُرُو بِرَوید" },
  âmadan: { spoken: "بیا بیایین", written: "بیا بیایید" },
  kardan: { spoken: "بِکُن بِکُنین", written: "بِکُن بِکُنید" },
  shodan: { spoken: "بِشُو بِشین", written: "بِشَو بِشَوید" },
  goftan: { spoken: "بِگو بِگین", written: "بِگو بِگویید" },
  dâdan: { spoken: "بِده بِدین", written: "بِدِهْ بِدَهید" },
  didan: { spoken: "بِبین بِبینین", written: "بِبین بِبینید" },
  dânestan: { spoken: "بِدون بِدونین", written: "بِدان بِدانید" },
  dâshtan: { spoken: "داشْته+باش داشْته+باشین", written: "داشْته+باش داشْته+باشید" },
  khordan: { spoken: "بِخُور بِخُورین", written: "بِخُور بِخُورید" },
  kharidan: { spoken: "بِخَر بِخَرین", written: "بِخَر بِخَرید" },
  neveshtan: { spoken: "بِنِویس بِنِویسین", written: "بِنِویس بِنِویسید" },
  khândan: { spoken: "بِخون بِخونین", written: "بِخوان بِخوانید" },
  gereftan: { spoken: "بِگیر بِگیرین", written: "بِگیر بِگیرید" },
  zadan: { spoken: "بِزَن بِزَنین", written: "بِزَن بِزَنید" },
  âvardan: { spoken: "بیار بیارین", written: "بیاوَر بیاوَرید" },
  gozâshtan: { spoken: "بِذار بِذارین", written: "بِگُذار بِگُذارید" },
  porsidan: { spoken: "بِپُرْس بِپُرْسین", written: "بِپُرْس بِپُرْسید" },
  fahmidan: { spoken: "بِفَهْم بِفَهْمین", written: "بِفَهْم بِفَهْمید" },
  shenâkhtan: { spoken: "بِشِناس بِشِناسین", written: "بِشِناس بِشِناسید" },
  "kâr-kardan": { spoken: "کار+کُن کار+کُنین", written: "کار+کُن کار+کُنید" },
  "harf-zadan": { spoken: "حَرْف+بِزَن حَرْف+بِزَنین", written: "حَرْف+بِزَن حَرْف+بِزَنید" },
  "zendegi-kardan": { spoken: "زِنْدِگی+کُن زِنْدِگی+کُنین", written: "زِنْدِگی+کُن زِنْدِگی+کُنید" },
};

const IMPERATIVE_NEG: Golden = {
  budan: { spoken: "نَباش نَباشین", written: "نَباش نَباشید" },
  raftan: { spoken: "نَرُو نَرین", written: "نَرُو نَرَوید" },
  âmadan: { spoken: "نَیا نَیایین", written: "نَیا نَیایید" },
  kardan: { spoken: "نَکُن نَکُنین", written: "نَکُن نَکُنید" },
  shodan: { spoken: "نَشُو نَشین", written: "نَشَو نَشَوید" },
  goftan: { spoken: "نَگو نَگین", written: "نَگو نَگویید" },
  dâdan: { spoken: "نَده نَدین", written: "نَدِهْ نَدَهید" },
  didan: { spoken: "نَبین نَبینین", written: "نَبین نَبینید" },
  dâshtan: { spoken: "نَداشْته+باش نَداشْته+باشین", written: "نَداشْته+باش نَداشْته+باشید" },
  khordan: { spoken: "نَخُور نَخُورین", written: "نَخُور نَخُورید" },
  kharidan: { spoken: "نَخَر نَخَرین", written: "نَخَر نَخَرید" },
  neveshtan: { spoken: "نَنِویس نَنِویسین", written: "نَنِویس نَنِویسید" },
  khândan: { spoken: "نَخون نَخونین", written: "نَخوان نَخوانید" },
  gereftan: { spoken: "نَگیر نَگیرین", written: "نَگیر نَگیرید" },
  zadan: { spoken: "نَزَن نَزَنین", written: "نَزَن نَزَنید" },
  âvardan: { spoken: "نَیار نَیارین", written: "نَیاوَر نَیاوَرید" },
  gozâshtan: { spoken: "نَذار نَذارین", written: "نَگُذار نَگُذارید" },
  porsidan: { spoken: "نَپُرْس نَپُرْسین", written: "نَپُرْس نَپُرْسید" },
  "kâr-kardan": { spoken: "کار+نَکُن کار+نَکُنین", written: "کار+نَکُن کار+نَکُنید" },
  "harf-zadan": { spoken: "حَرْف+نَزَن حَرْف+نَزَنین", written: "حَرْف+نَزَن حَرْف+نَزَنید" },
  "zendegi-kardan": { spoken: "زِنْدِگی+نَکُن زِنْدِگی+نَکُنین", written: "زِنْدِگی+نَکُن زِنْدِگی+نَکُنید" },
};

// ── The future, written only: خواستن's present without می, then the past stem.
const FUTURE: Record<string, string> = {
  budan: "خواهَم+بود خواهی+بود خواهَد+بود خواهیم+بود خواهید+بود خواهَنْد+بود",
  raftan: "خواهَم+رَفْت خواهی+رَفْت خواهَد+رَفْت خواهیم+رَفْت خواهید+رَفْت خواهَنْد+رَفْت",
  âmadan: "خواهَم+آمَد خواهی+آمَد خواهَد+آمَد خواهیم+آمَد خواهید+آمَد خواهَنْد+آمَد",
  kardan: "خواهَم+کَرْد خواهی+کَرْد خواهَد+کَرْد خواهیم+کَرْد خواهید+کَرْد خواهَنْد+کَرْد",
  shodan: "خواهَم+شُد خواهی+شُد خواهَد+شُد خواهیم+شُد خواهید+شُد خواهَنْد+شُد",
  goftan: "خواهَم+گُفْت خواهی+گُفْت خواهَد+گُفْت خواهیم+گُفْت خواهید+گُفْت خواهَنْد+گُفْت",
  dâdan: "خواهَم+داد خواهی+داد خواهَد+داد خواهیم+داد خواهید+داد خواهَنْد+داد",
  didan: "خواهَم+دید خواهی+دید خواهَد+دید خواهیم+دید خواهید+دید خواهَنْد+دید",
  khâstan: "خواهَم+خواسْت خواهی+خواسْت خواهَد+خواسْت خواهیم+خواسْت خواهید+خواسْت خواهَنْد+خواسْت",
  dânestan: "خواهَم+دانِسْت خواهی+دانِسْت خواهَد+دانِسْت خواهیم+دانِسْت خواهید+دانِسْت خواهَنْد+دانِسْت",
  tavânestan: "خواهَم+تَوانِسْت خواهی+تَوانِسْت خواهَد+تَوانِسْت خواهیم+تَوانِسْت خواهید+تَوانِسْت خواهَنْد+تَوانِسْت",
  dâshtan: "خواهَم+داشْت خواهی+داشْت خواهَد+داشْت خواهیم+داشْت خواهید+داشْت خواهَنْد+داشْت",
  khordan: "خواهَم+خُورْد خواهی+خُورْد خواهَد+خُورْد خواهیم+خُورْد خواهید+خُورْد خواهَنْد+خُورْد",
  kharidan: "خواهَم+خَرید خواهی+خَرید خواهَد+خَرید خواهیم+خَرید خواهید+خَرید خواهَنْد+خَرید",
  neveshtan: "خواهَم+نِوِشْت خواهی+نِوِشْت خواهَد+نِوِشْت خواهیم+نِوِشْت خواهید+نِوِشْت خواهَنْد+نِوِشْت",
  khândan: "خواهَم+خوانْد خواهی+خوانْد خواهَد+خوانْد خواهیم+خوانْد خواهید+خوانْد خواهَنْد+خوانْد",
  gereftan: "خواهَم+گِرِفْت خواهی+گِرِفْت خواهَد+گِرِفْت خواهیم+گِرِفْت خواهید+گِرِفْت خواهَنْد+گِرِفْت",
  zadan: "خواهَم+زَد خواهی+زَد خواهَد+زَد خواهیم+زَد خواهید+زَد خواهَنْد+زَد",
  âvardan: "خواهَم+آوَرْد خواهی+آوَرْد خواهَد+آوَرْد خواهیم+آوَرْد خواهید+آوَرْد خواهَنْد+آوَرْد",
  gozâshtan: "خواهَم+گُذاشْت خواهی+گُذاشْت خواهَد+گُذاشْت خواهیم+گُذاشْت خواهید+گُذاشْت خواهَنْد+گُذاشْت",
  porsidan: "خواهَم+پُرْسید خواهی+پُرْسید خواهَد+پُرْسید خواهیم+پُرْسید خواهید+پُرْسید خواهَنْد+پُرْسید",
  fahmidan: "خواهَم+فَهْمید خواهی+فَهْمید خواهَد+فَهْمید خواهیم+فَهْمید خواهید+فَهْمید خواهَنْد+فَهْمید",
  shenâkhtan: "خواهَم+شِناخْت خواهی+شِناخْت خواهَد+شِناخْت خواهیم+شِناخْت خواهید+شِناخْت خواهَنْد+شِناخْت",
  "kâr-kardan": "کار+خواهَم+کَرْد کار+خواهی+کَرْد کار+خواهَد+کَرْد کار+خواهیم+کَرْد کار+خواهید+کَرْد کار+خواهَنْد+کَرْد",
  "harf-zadan": "حَرْف+خواهَم+زَد حَرْف+خواهی+زَد حَرْف+خواهَد+زَد حَرْف+خواهیم+زَد حَرْف+خواهید+زَد حَرْف+خواهَنْد+زَد",
  "zendegi-kardan":
    "زِنْدِگی+خواهَم+کَرْد زِنْدِگی+خواهی+کَرْد زِنْدِگی+خواهَد+کَرْد زِنْدِگی+خواهیم+کَرْد زِنْدِگی+خواهید+کَرْد زِنْدِگی+خواهَنْد+کَرْد",
};

const FUTURE_NEG: Record<string, string> = {
  raftan: "نَخواهَم+رَفْت نَخواهی+رَفْت نَخواهَد+رَفْت نَخواهیم+رَفْت نَخواهید+رَفْت نَخواهَنْد+رَفْت",
  "harf-zadan": "حَرْف+نَخواهَم+زَد حَرْف+نَخواهی+زَد حَرْف+نَخواهَد+زَد حَرْف+نَخواهیم+زَد حَرْف+نَخواهید+زَد حَرْف+نَخواهَنْد+زَد",
};

// Transliterations, checked against the pronunciation.
const TRANSLIT: { verb: string; tense: Tense; style: Style; negative?: boolean; says: string }[] = [
  { verb: "raftan", tense: "subjunctive", style: "spoken", says: "beram, beri, bere, berim, berin, beran" },
  { verb: "raftan", tense: "subjunctive", style: "written", says: "beravam, beravi, beravad, beravim, beravid, beravand" },
  { verb: "âmadan", tense: "subjunctive", style: "spoken", says: "biyâm, biyây, biyâd, biyâyim, biyâyin, biyân" },
  { verb: "âmadan", tense: "subjunctive", style: "written", says: "biyâyam, biyâyi, biyâyad, biyâyim, biyâyid, biyâyand" },
  { verb: "âmadan", tense: "subjunctive", style: "spoken", negative: true, says: "nayâm, nayây, nayâd, nayâyim, nayâyin, nayân" },
  { verb: "âvardan", tense: "subjunctive", style: "spoken", says: "biyâram, biyâri, biyâre, biyârim, biyârin, biyâran" },
  { verb: "âvardan", tense: "subjunctive", style: "written", negative: true, says: "nayâvaram, nayâvari, nayâvarad, nayâvarim, nayâvarid, nayâvarand" },
  { verb: "khâstan", tense: "subjunctive", style: "spoken", says: "bekhâm, bekhây, bekhâd, bekhâyim, bekhâyin, bekhân" },
  { verb: "dâshtan", tense: "subjunctive", style: "spoken", says: "dâshte bâsham, dâshte bâshi, dâshte bâshe, dâshte bâshim, dâshte bâshin, dâshte bâshan" },
  { verb: "khordan", tense: "subjunctive", style: "written", says: "bekhoram, bekhori, bekhorad, bekhorim, bekhorid, bekhorand" },
  { verb: "raftan", tense: "imperative", style: "spoken", says: "boro, berin" },
  { verb: "raftan", tense: "imperative", style: "written", negative: true, says: "naro, naravid" },
  { verb: "âmadan", tense: "imperative", style: "spoken", says: "biyâ, biyâyin" },
  { verb: "shodan", tense: "imperative", style: "spoken", says: "besho, beshin" },
  { verb: "shodan", tense: "imperative", style: "written", says: "beshow, beshavid" },
  { verb: "goftan", tense: "imperative", style: "spoken", says: "begu, begin" },
  { verb: "dâdan", tense: "imperative", style: "spoken", says: "bede, bedin" },
  { verb: "dâdan", tense: "imperative", style: "written", says: "bedeh, bedahid" },
  { verb: "gozâshtan", tense: "imperative", style: "spoken", negative: true, says: "nazâr, nazârin" },
  { verb: "kâr-kardan", tense: "imperative", style: "spoken", says: "kâr kon, kâr konin" },
  { verb: "raftan", tense: "future", style: "written", says: "khâham raft, khâhi raft, khâhad raft, khâhim raft, khâhid raft, khâhand raft" },
  { verb: "âmadan", tense: "future", style: "written", negative: true, says: "nakhâham âmad, nakhâhi âmad, nakhâhad âmad, nakhâhim âmad, nakhâhid âmad, nakhâhand âmad" },
];

const partWords = (id: string) => verbById.get(id)!.part?.split(" ").length ?? 0;
/** Change the verb word (after a compound's first part). */
const atVerb = (form: string, id: string, fn: (w: string) => string) =>
  form
    .split(" ")
    .map((w, i) => (i === partWords(id) ? fn(w) : w))
    .join(" ");

const NO_COMMAND = ["khâstan", "tavânestan"];
/** Nobody orders "don't know" or "don't understand"; نَفَهْم is an insult. */
const NO_NEG_COMMAND = ["dânestan", "fahmidan", "shenâkhtan"];

describe("conjugate: the subjunctive", () => {
  it("has a golden table for every verb", () => {
    expect(Object.keys(SUBJUNCTIVE).sort()).toEqual(VERBS.map((v) => v.id).sort());
  });

  it.each(VERBS.map((v) => v.id))("%s", (id) => {
    const v = verbById.get(id)!;
    for (const style of STYLES) expect(table(v, "subjunctive", style, false, VERBS), style).toEqual(row(SUBJUNCTIVE[id][style]));
  });

  it.each(VERBS.map((v) => v.id))("%s, negative", (id) => {
    const v = verbById.get(id)!;
    for (const style of STYLES) {
      // نَـ takes the place of بِـ.
      const want = SUBJUNCTIVE_NEG[id]
        ? row(SUBJUNCTIVE_NEG[id][style])
        : row(SUBJUNCTIVE[id][style]).map((f) => atVerb(f, id, (w) => w.replace(/^بِ/, "نَ")));
      expect(table(v, "subjunctive", style, true, VERBS), style).toEqual(want);
    }
  });
});

describe("conjugate: the imperative", () => {
  it("is for تو and شما only", () => {
    expect(personsOf("imperative")).toEqual(["2s", "2p"]);
    expect(personsOf("subjunctive")).toHaveLength(6);
    const go = verbById.get("raftan")!;
    expect(hasForm(go, { tense: "imperative", person: "1s", style: "spoken", negative: false }, VERBS)).toBe(false);
    expect(() => conjugate(go, { tense: "imperative", person: "3p", style: "spoken", negative: false }, VERBS)).toThrow();
  });

  it("has golden rows for every verb that can be a command", () => {
    const ids = VERBS.map((v) => v.id)
      .filter((id) => !NO_COMMAND.includes(id))
      .sort();
    expect(Object.keys(IMPERATIVE).sort()).toEqual(ids);
    expect(Object.keys(IMPERATIVE_NEG).sort()).toEqual(ids.filter((id) => !NO_NEG_COMMAND.includes(id)));
  });

  it.each(VERBS.map((v) => v.id))("%s", (id) => {
    const v = verbById.get(id)!;
    if (NO_COMMAND.includes(id)) {
      expect(lacks(v, "imperative", false, VERBS)).toBeTruthy();
      expect(() => table(v, "imperative", "spoken", false, VERBS)).toThrow();
      return;
    }
    for (const style of STYLES) {
      expect(table(v, "imperative", style, false, VERBS), style).toEqual(row(IMPERATIVE[id][style]));
      if (NO_NEG_COMMAND.includes(id)) {
        expect(lacks(v, "imperative", true, VERBS)).toBeTruthy();
        expect(() => table(v, "imperative", style, true, VERBS)).toThrow();
      } else expect(table(v, "imperative", style, true, VERBS), `${style} negative`).toEqual(row(IMPERATIVE_NEG[id][style]));
    }
  });
});

describe("conjugate: the future", () => {
  it("is written only", () => {
    expect(stylesOf("future")).toEqual(["written"]);
    expect(stylesOf("subjunctive")).toEqual(STYLES);
    const go = verbById.get("raftan")!;
    expect(hasForm(go, { tense: "future", person: "1s", style: "spoken", negative: false }, VERBS)).toBe(false);
    expect(() => table(go, "future", "spoken", false, VERBS)).toThrow();
  });

  it("has a golden table for every verb", () => {
    expect(Object.keys(FUTURE).sort()).toEqual(VERBS.map((v) => v.id).sort());
  });

  it.each(VERBS.map((v) => v.id))("%s", (id) => {
    const v = verbById.get(id)!;
    expect(table(v, "future", "written", false, VERBS)).toEqual(row(FUTURE[id]));
    // The negative: نَـ on خواستن.
    const want = FUTURE_NEG[id] ? row(FUTURE_NEG[id]) : row(FUTURE[id]).map((f) => atVerb(f, id, (w) => "نَ" + w));
    expect(table(v, "future", "written", true, VERBS)).toEqual(want);
  });
});

describe("conjugate: Unit 8 forms as said and as glossed", () => {
  it.each(TRANSLIT)("$verb $tense $style transliterates as said", ({ verb, tense, style, negative, says }) => {
    const got = table(verbById.get(verb)!, tense, style, negative ?? false, VERBS).map((f) => transliterateWithErrors(f).text);
    expect(got.join(", ")).toBe(says);
  });

  const en = (id: string, tense: Tense, person: "1s" | "2s" | "3s" | "2p", negative = false) =>
    englishOf(verbById.get(id)!, { tense, person, style: "written", negative });

  it("glosses the subjunctive", () => {
    expect(en("raftan", "subjunctive", "1s")).toBe("that I go");
    expect(en("raftan", "subjunctive", "3s", true)).toBe("that he/she doesn't go");
    expect(en("raftan", "subjunctive", "1s", true)).toBe("that I don't go");
    expect(englishOf(verbById.get("raftan")!, { tense: "subjunctive", person: "1p", style: "spoken", negative: false })).toBe("that we go / let's go");
    expect(en("budan", "subjunctive", "3s")).toBe("that he/she be");
    expect(en("budan", "subjunctive", "3s", true)).toBe("that he/she isn't");
    expect(en("tavânestan", "subjunctive", "1s")).toBe("that I be able to");
    expect(en("tavânestan", "subjunctive", "1s", true)).toBe("that I am not able to");
    expect(en("dânestan", "subjunctive", "1s")).toBe("that I know (a fact)");
  });
  it("glosses the imperative with no subject", () => {
    expect(en("raftan", "imperative", "2s")).toBe("go!");
    expect(en("raftan", "imperative", "2p", true)).toBe("don't go!");
    expect(en("budan", "imperative", "2s")).toBe("be!");
    expect(en("shenâkhtan", "imperative", "2s")).toBe("get to know (a person)!");
    expect(en("dânestan", "imperative", "2s")).toBe("know (a fact)!");
  });
  it("glosses the future", () => {
    expect(en("raftan", "future", "1s")).toBe("I will go");
    expect(en("raftan", "future", "3s", true)).toBe("he/she won't go");
    expect(en("tavânestan", "future", "1s")).toBe("I will be able to");
    expect(en("budan", "future", "1s")).toBe("I will be");
  });
  it("tells every verb apart in English", () => {
    for (const tense of ["subjunctive", "imperative", "future"] as const) {
      const prompts = VERBS.filter((v) => !lacks(v, tense, false, VERBS)).map((v) => englishOf(v, { tense, person: "2s", style: "written", negative: false }));
      expect(new Set(prompts).size, tense).toBe(prompts.length);
    }
  });
});

describe("conjugate: accepted answers in Unit 8's forms", () => {
  const spec = { style: "spoken" as const, negative: false };
  it("takes کار بِکُنَم for a compound that drops بِـ", () => {
    const work = verbById.get("kâr-kardan")!;
    const a = acceptedAnswers(work, { ...spec, tense: "subjunctive", person: "1s" }, VERBS);
    expect(a.answers[0]).toBe("کار کنم");
    expect(a.variants).toEqual(["کار بکنم"]);
    expect(acceptedAnswers(work, { ...spec, tense: "imperative", person: "2s" }, VERBS).variants).toEqual(["کار بکن"]);
    // The spellings of speech combine with it: کار کنید, کار بکنین, کار بکنید.
    expect(acceptedAnswers(work, { ...spec, tense: "imperative", person: "2p" }, VERBS).variants).toEqual(["کار کنید", "کار بکنین", "کار بکنید"]);
    expect(acceptedAnswers(work, { ...spec, tense: "subjunctive", person: "1s", negative: true }, VERBS).variants).toEqual([]);
  });
  it("takes the usual chat spellings of the spoken endings", () => {
    const come = verbById.get("âmadan")!;
    const go = verbById.get("raftan")!;
    expect(acceptedAnswers(come, { ...spec, tense: "subjunctive", person: "1p" }, VERBS).variants).toEqual(["بیایم"]);
    expect(acceptedAnswers(come, { ...spec, tense: "imperative", person: "2p" }, VERBS).variants).toEqual(["بیاین", "بیایید"]);
    expect(acceptedAnswers(go, { ...spec, tense: "imperative", person: "2p" }, VERBS).variants).toEqual(["برید"]);
    expect(acceptedAnswers(go, { ...spec, tense: "imperative", person: "2s" }, VERBS).variants).toEqual([]);
  });
  it("has no spelling variants in the written future", () => {
    const go = verbById.get("raftan")!;
    const a = acceptedAnswers(go, { tense: "future", person: "3p", style: "written", negative: false }, VERBS);
    expect(a.answers).toEqual(row("خواهند+رفت آن_ها+خواهند+رفت"));
    expect(a.variants).toEqual([]);
  });
});
