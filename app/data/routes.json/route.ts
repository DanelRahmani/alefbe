import { ALL_PAGES } from "@/content/routes";

// Every page of the site, for the 375 px sweep (scripts/sweep-375.js).
export const dynamic = "force-static";

export function GET() {
  return Response.json([...ALL_PAGES].sort());
}
