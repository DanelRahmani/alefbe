import { VOCAB_CARDS } from "@/content/static-data";

// The vocabulary deck's cards, prerendered as a static JSON file (fetched by lib/static-data.ts).
export const dynamic = "force-static";

export function GET() {
  return Response.json(VOCAB_CARDS);
}
