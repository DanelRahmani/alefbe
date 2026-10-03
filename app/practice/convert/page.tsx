import type { Metadata } from "next";
import Link from "next/link";
import { ConvertTrainerLoader } from "@/components/practice/Loaders";

export const metadata: Metadata = {
  title: "Spoken and written",
  description: "Turn the lines of every Alefbe lesson you have done from Tehrani speech into written Persian, or back, with spaced repetition.",
};

export default function ConvertPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="ui breadcrumb">
        <Link href="/practice">Practice</Link>
        <span aria-hidden="true"> / </span>
        <span>Spoken and written</span>
      </nav>
      <h1 className="page-title mt-2">Spoken and written</h1>
      <p className="page-lede">
        Each review shows a lesson line as Tehranis say it; you type it as it is written. Switch the direction to go from writing
        to speech. Vowel marks and punctuation don&apos;t count; a half-space does. A lesson&apos;s lines join when you mark the
        lesson done, and each direction keeps its own schedule.
      </p>
      <div className="mt-6">
        <ConvertTrainerLoader />
      </div>
    </>
  );
}
