import type { Metadata } from "next";
import { ProgressPanel } from "@/components/ProgressPanel";
import { ALL_LESSONS } from "@/content/units";

export const metadata: Metadata = {
  title: "Your progress",
  description: "See your progress, download a backup, or restore one on another device.",
};

export default function ProgressPage() {
  return (
    <>
      <section className="page-head">
        <p className="ui eyebrow">Progress</p>
        <h1 className="page-title">Your progress</h1>
      </section>
      <ProgressPanel totalLessons={ALL_LESSONS.length} />
    </>
  );
}
