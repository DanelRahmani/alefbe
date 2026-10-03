import { LESSON_QUIZZES } from "@/content/static-data";

// The lesson quizzes, for the mistake notebook, prerendered as a static JSON file (fetched by lib/static-data.ts).
export const dynamic = "force-static";

export function GET() {
  return Response.json(LESSON_QUIZZES);
}
