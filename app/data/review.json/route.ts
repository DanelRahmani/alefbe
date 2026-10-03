import { reviewData } from "@/content/static-data";

// The review queue's cards, prerendered as a static JSON file (fetched by lib/static-data.ts).
export const dynamic = "force-static";

export function GET() {
  return Response.json(reviewData());
}
