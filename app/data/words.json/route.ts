import { dayWords } from "@/content/static-data";

// The words for the word of the day, prerendered as a static JSON file (fetched by lib/static-data.ts).
export const dynamic = "force-static";

export function GET() {
  return Response.json(dayWords());
}
