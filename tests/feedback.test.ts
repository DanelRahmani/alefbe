import { describe, expect, it } from "vitest";
import { hintText, toneOf } from "@/lib/feedback";

describe("feedback", () => {
  it("gives right, near and wrong their tones", () => {
    expect(toneOf({ ok: true })).toBe("right");
    expect(toneOf({ ok: false, near: true })).toBe("near");
    expect(toneOf({ ok: false })).toBe("wrong");
  });
  it("drops a near miss's leading Nearly, as the verdict line says it", () => {
    expect(hintText("Nearly: the letters are right.", "near")).toBe("The letters are right.");
    expect(hintText("Nearly: the letters are right.", "wrong")).toBe("Nearly: the letters are right.");
    expect(hintText("Same sound, other letter: ص not س.", "near")).toBe("Same sound, other letter: ص not س.");
  });
});
