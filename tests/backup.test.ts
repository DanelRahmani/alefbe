import { describe, expect, it } from "vitest";
import { BACKUP_KEYS, applyBackup, backupFileName, makeBackup, parseBackup } from "@/lib/backup";

function fakeStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    read: (k: string) => map.get(k) ?? null,
    write: (k: string, v: string) => void map.set(k, v),
    map,
  };
}

const NOW = new Date("2026-09-29T10:00:00Z");

describe("makeBackup", () => {
  it("collects every Alefbe store that has data", () => {
    const s = fakeStorage({
      "alefbe2:progress": JSON.stringify({ v: 1, data: { "prepositions/ra-specific-object": true } }),
      "alefbe2:trace": JSON.stringify({ v: 1, data: { "ب:isolated": 92 } }),
      unrelated: "x",
    });
    const b = makeBackup(s.read, NOW);
    expect(b.app).toBe("alefbe");
    expect(b.format).toBe(3);
    expect(b.exported).toBe(NOW.toISOString());
    expect(Object.keys(b.stores).sort()).toEqual(["alefbe2:progress", "alefbe2:trace"]);
    expect(BACKUP_KEYS).toContain("alefbe2:srs");
  });
  it("names the file by date", () => {
    expect(backupFileName(NOW)).toBe("alefbe-progress-2026-09-29.json");
  });
});

describe("parseBackup", () => {
  it("reads its own format back", () => {
    const s = fakeStorage({ "alefbe2:progress": JSON.stringify({ v: 1, data: { a: true } }) });
    const p = parseBackup(JSON.stringify(makeBackup(s.read, NOW)));
    expect(p.kind).toBe("alefbe");
  });
  it("recognises an export from the old Alefbe app", () => {
    const p = parseBackup(JSON.stringify({ version: 2, exported: "2026-03-01T00:00:00Z", learned: [0, 1, 2], quiz: {} }));
    expect(p).toMatchObject({ kind: "legacy", learned: [0, 1, 2], exported: "2026-03-01T00:00:00Z" });
  });
  it("rejects files that are not Alefbe backups", () => {
    expect(parseBackup("not json").kind).toBe("invalid");
    expect(parseBackup(JSON.stringify({ hello: 1 })).kind).toBe("invalid");
    expect(parseBackup(JSON.stringify({ app: "alefbe", format: 3, stores: { "evil:key": "{}" } })).kind).toBe("invalid");
  });
});

describe("applyBackup", () => {
  it("restores each store exactly", () => {
    const from = fakeStorage({
      "alefbe2:progress": JSON.stringify({ v: 1, data: { a: true } }),
      "alefbe2:srs": JSON.stringify({ v: 1, data: { decks: {} } }),
    });
    const to = fakeStorage({ "alefbe2:progress": JSON.stringify({ v: 1, data: {} }) });
    applyBackup(parseBackup(JSON.stringify(makeBackup(from.read, NOW))), to.read, to.write);
    expect(to.map.get("alefbe2:progress")).toBe(from.map.get("alefbe2:progress"));
    expect(to.map.get("alefbe2:srs")).toBe(from.map.get("alefbe2:srs"));
  });
  it("turns an old export's learned letters into open trainer groups", () => {
    const to = fakeStorage();
    applyBackup(parseBackup(JSON.stringify({ version: 2, learned: [0, 1, 2, 3, 4, 5, 6, 7, 8] })), to.read, to.write);
    const srs = JSON.parse(to.map.get("alefbe2:srs")!).data;
    expect(srs.decks.sound.unlocked).toBe(3);
    expect(srs.decks.letter.unlocked).toBe(3);
    expect(srs.legacyChecked).toBe(true);
  });
  it("never lowers groups already open when importing an old export", () => {
    const to = fakeStorage({
      "alefbe2:srs": JSON.stringify({ v: 1, data: { decks: { sound: { cards: { ا: { box: 3, due: 0, reps: 2, lapses: 0 } }, unlocked: 5 } } } }),
    });
    applyBackup(parseBackup(JSON.stringify({ version: 2, learned: [0, 1, 2, 3, 4] })), to.read, to.write);
    const srs = JSON.parse(to.map.get("alefbe2:srs")!).data;
    expect(srs.decks.sound.unlocked).toBe(5);
    expect(srs.decks.sound.cards["ا"].box).toBe(3);
  });
});
