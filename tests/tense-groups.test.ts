import { describe, expect, it } from "vitest";
import { TENSES } from "@/lib/conjugate";
import { TENSE_GROUPS } from "@/lib/tense-groups";

describe("tense groups", () => {
  it("put every tense in exactly one group", () => {
    const ids = TENSE_GROUPS.flatMap((g) => g.tenses.map((t) => t.id));
    expect([...ids].sort()).toEqual(TENSES.map((t) => t.id).sort());
  });
  it("keep the course order within each group", () => {
    for (const g of TENSE_GROUPS) {
      const at = g.tenses.map((t) => TENSES.indexOf(t));
      expect(at).toEqual([...at].sort((a, b) => a - b));
    }
  });
});
