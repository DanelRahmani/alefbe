import { practiceCards } from "@/content/static-data";

// The practice hub's deck counts, prerendered as a static JSON file (fetched by lib/static-data.ts).
export const dynamic = "force-static";

export function GET() {
  return Response.json(practiceCards());
}
