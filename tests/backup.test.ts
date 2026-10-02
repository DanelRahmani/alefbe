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
  it("includes the conjugation trainer, and restores it", () => {
    expect(BACKUP_KEYS).toContain("alefbe2:verbs");
    const deck = JSON.stringify({ v: 1, data: { decks: { present: { cards: { "raftan:present": { box: 2, due: 0, reps: 1, lapses: 0 } }, unlocked: 1 } }, ask: "both" } });
    const from = fakeStorage({ "alefbe2:verbs": deck });
    const to = fakeStorage();
    applyBackup(parseBackup(JSON.stringify(makeBackup(from.read, NOW))), to.read, to.write);
    expect(to.map.get("alefbe2:verbs")).toBe(deck);
  });
  it("includes the vocabulary deck, and restores it", () => {
    expect(BACKUP_KEYS).toContain("alefbe2:vocab");
    const deck = JSON.stringify({ v: 1, data: { deck: { cards: { "کِتاب": { box: 3, due: 0, reps: 2, lapses: 0 } }, unlocked: 1 }, sound: true } });
    const from = fakeStorage({ "alefbe2:vocab": deck });
    const to = fakeStorage();
    applyBackup(parseBackup(JSON.stringify(makeBackup(from.read, NOW))), to.read, to.write);
    expect(to.map.get("alefbe2:vocab")).toBe(deck);
  });
  it("includes cloze practice, and restores it", () => {
    expect(BACKUP_KEYS).toContain("alefbe2:cloze");
    const deck = JSON.stringify({ v: 1, data: { deck: { cards: { "past/simple-past#abc": { box: 2, due: 0, reps: 1, lapses: 0 } }, unlocked: 1 } } });
    const from = fakeStorage({ "alefbe2:cloze": deck });
    const to = fakeStorage();
    applyBackup(parseBackup(JSON.stringify(makeBackup(from.read, NOW))), to.read, to.write);
    expect(to.map.get("alefbe2:cloze")).toBe(deck);
  });
  it("includes the spoken and written drill, and restores it", () => {
    expect(BACKUP_KEYS).toContain("alefbe2:convert");
    const deck = JSON.stringify({ v: 1, data: { decks: { "to-written": { cards: { "past/simple-past#abc": { box: 2, due: 0, reps: 1, lapses: 0 } }, unlocked: 1 }, "to-spoken": { cards: {}, unlocked: 1 } }, dir: "to-spoken" } });
    const from = fakeStorage({ "alefbe2:convert": deck });
    const to = fakeStorage();
    applyBackup(parseBackup(JSON.stringify(makeBackup(from.read, NOW))), to.read, to.write);
    expect(to.map.get("alefbe2:convert")).toBe(deck);
  });
  it("includes the last placement check, and restores it", () => {
    expect(BACKUP_KEYS).toContain("alefbe2:placement");
    const last = JSON.stringify({ v: 1, data: { last: { at: 1759000000000, answers: { "alphabet/lam-to-vav#2": true, "spelling/half-space#0": false } } } });
    const from = fakeStorage({ "alefbe2:placement": last });
    const to = fakeStorage();
    applyBackup(parseBackup(JSON.stringify(makeBackup(from.read, NOW))), to.read, to.write);
    expect(to.map.get("alefbe2:placement")).toBe(last);
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
    expect(p).toMatchObject({ kind: "legacy", data: { learned: [0, 1, 2] }, exported: "2026-03-01T00:00:00Z" });
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
  it("carries an old export's quiz, tracing and stats across", () => {
    const to = fakeStorage();
    const old = {
      version: 2,
      learned: [0],
      quiz: { tot: 12, cor: 9 },
      prog: { "1": { comp: [1, 0, 0] } },
      stats: { sessions: { "1": 2 }, forms: { "0": 2 }, days: ["2026-02-01"] },
    };
    applyBackup(parseBackup(JSON.stringify(old)), to.read, to.write);
    expect(JSON.parse(to.map.get("alefbe2:trace")!)).toEqual({ v: 2, data: { "ب:isolated:guided": 70 } });
    const act = JSON.parse(to.map.get("alefbe2:activity")!).data;
    expect(act.legacyQuiz).toEqual([9, 12]);
    expect(act.traced).toEqual({ ب: 2 });
    expect(act.days).toEqual({ "2026-02-01": { trace: 1 } });
  });
});

describe("applyBackup: tracing scores in the older format", () => {
  it("upgrades them before adding the old app's passes", () => {
    const to = fakeStorage({ "alefbe2:trace": JSON.stringify({ v: 1, data: { "ب:isolated": 92 } }) });
    applyBackup(parseBackup(JSON.stringify({ version: 2, learned: [], prog: { "3": { comp: [1, 0, 0] } } })), to.read, to.write);
    expect(JSON.parse(to.map.get("alefbe2:trace")!)).toEqual({ v: 2, data: { "ب:isolated:guided": 92, "ت:isolated:guided": 70 } });
  });
});
