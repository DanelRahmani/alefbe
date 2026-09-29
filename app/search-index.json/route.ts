import { SEARCH_INDEX } from "@/content/search-index";

// The search palette's index, prerendered as a static JSON file.
export const dynamic = "force-static";

export function GET() {
  return Response.json(SEARCH_INDEX);
}
