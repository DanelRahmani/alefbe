import { dictionaryData } from "@/content/static-data";

// The dictionary page's full word list, prerendered as a static JSON file (fetched by lib/static-data.ts).
export const dynamic = "force-static";

export function GET() {
  return Response.json(dictionaryData());
}
