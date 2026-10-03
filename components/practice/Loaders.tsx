"use client";

// The trainers whose cards are large take them from /data/*.json after the
// first paint (lib/static-data.ts), so a page's HTML stays small. Until the
// file arrives the trainer's place holds a quiet panel.

import type { ReviewData } from "@/content/static-data";
import type { LessonQuiz } from "../MistakeNotebook";
import type { ClozeCard } from "@/lib/cloze";
import type { ConvertCard } from "@/lib/convert";
import { DATA_URL } from "@/lib/data-urls";
import { useStaticData } from "@/lib/static-data";
import type { VocabCard } from "@/lib/vocab";
import { ClozeTrainer } from "../cloze/ClozeTrainer";
import { ConvertTrainer } from "../convert/ConvertTrainer";
import { MistakeNotebook } from "../MistakeNotebook";
import { ReviewQueue } from "../review/ReviewQueue";
import { VocabTrainer } from "../vocab/VocabTrainer";

function Waiting({ failed }: { failed: boolean }) {
  return (
    <div className="ui panel trainer-card loading-card" role="status">
      {failed ? "The cards could not be loaded. Check the connection and reload the page." : "Loading the cards…"}
    </div>
  );
}

export function VocabTrainerLoader() {
  const { data, failed } = useStaticData<VocabCard[]>(DATA_URL.vocabCards);
  return data ? <VocabTrainer cards={data} /> : <Waiting failed={failed} />;
}

export function ClozeTrainerLoader() {
  const { data, failed } = useStaticData<ClozeCard[]>(DATA_URL.clozeCards);
  return data ? <ClozeTrainer cards={data} /> : <Waiting failed={failed} />;
}

export function ConvertTrainerLoader() {
  const { data, failed } = useStaticData<ConvertCard[]>(DATA_URL.convertCards);
  return data ? <ConvertTrainer cards={data} /> : <Waiting failed={failed} />;
}

export function ReviewQueueLoader() {
  const { data, failed } = useStaticData<ReviewData>(DATA_URL.review);
  return data ? <ReviewQueue {...data} /> : <Waiting failed={failed} />;
}

export function MistakeNotebookLoader() {
  const { data, failed } = useStaticData<Record<string, LessonQuiz>>(DATA_URL.lessonQuizzes);
  return data ? <MistakeNotebook lessons={data} /> : <Waiting failed={failed} />;
}
