// The common words beyond the lessons: batches from the subtitle frequency
// list (a–d2, roughly in frequency order) and the hand-picked places,
// languages and everyday basics (e). See ./types.ts.

import { BATCH_A } from "./a";
import { BATCH_B } from "./b";
import { BATCH_C } from "./c";
import { BATCH_D1 } from "./d1";
import { BATCH_D2 } from "./d2";
import { BATCH_E } from "./e";
import type { CommonWord } from "./types";

export type { CommonWord } from "./types";

export const COMMON_WORDS: CommonWord[] = [...BATCH_A, ...BATCH_B, ...BATCH_C, ...BATCH_D1, ...BATCH_D2, ...BATCH_E];
