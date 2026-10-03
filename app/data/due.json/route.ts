import { dueData } from "@/lib/due-data";

// What the home page and the practice hub count due cards with (lib/due.ts),
// prerendered as a static JSON file.
export const dynamic = "force-static";

export function GET() {
  return Response.json(dueData());
}
