import { CONVERT_CARDS } from "@/content/static-data";

// The spoken ↔ written cards, prerendered as a static JSON file (fetched by lib/static-data.ts).
export const dynamic = "force-static";

export function GET() {
  return Response.json(CONVERT_CARDS);
}
