import { describe, expect, it } from "vitest";
import { rgba } from "@/lib/color";

describe("rgba", () => {
  it("reads hex colours, long and short", () => {
    expect(rgba("#1f4aa8", 0.5)).toBe("rgba(31, 74, 168, 0.5)");
    expect(rgba("#fff", 1)).toBe("rgba(255, 255, 255, 1)");
  });
  it("reads a computed rgb() colour, as the theme tokens resolve to", () => {
    expect(rgba("rgb(236, 230, 214)", 0.55)).toBe("rgba(236, 230, 214, 0.55)");
    expect(rgba("rgb(236 230 214 / 0.5)", 0.9)).toBe("rgba(236, 230, 214, 0.9)");
  });
});
