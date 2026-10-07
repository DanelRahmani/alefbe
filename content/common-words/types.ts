import type { Fa } from "@/content/types";
import type { Topic } from "@/content/topics";

/**
 * A dictionary word beyond the lessons, chosen from a frequency list of
 * Persian film subtitles (FrequencyWords by Hermit Dave, from OpenSubtitles
 * 2018, CC BY-SA 4.0), plus a hand-picked set of countries, cities and
 * languages. The list gave only bare, unmarked word forms; the marks, the
 * spoken form, the English and the topic are the course's own, reviewed like
 * a unit (content/STYLE.md).
 */
export interface CommonWord {
  /** The written form, fully vowel-marked. */
  fa: Fa;
  /** The Tehrani spoken form, when its spelling differs (خونه for خانه). */
  spoken?: Fa;
  en: string;
  topic: Topic;
}
