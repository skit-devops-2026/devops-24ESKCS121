import { beforeEach, describe, expect, it } from "vitest";
import { courses, paths } from "../src/data/courses";
import { pathProgress, readProgress, saveProgress, STORAGE_KEYS } from "../src/lib/storage";

const memoryStorage = () => {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    clear: () => values.clear(),
  };
};

beforeEach(() => { globalThis.localStorage = memoryStorage(); });

describe("StudySphere progress storage", () => {
  it("preserves lesson progress using the legacy storage key", () => {
    const progress = saveProgress("js", 4, 8);
    expect(STORAGE_KEYS.progress).toBe("studySphereProgress");
    expect(progress.js).toEqual({ progress: 50, status: "in-progress", completed: 4 });
    expect(readProgress()).toEqual(progress);
  });

  it("calculates path progress from saved course progress", () => {
    const progress = { html: { progress: 100 }, css: { progress: 100 }, js: { progress: 50 } };
    expect(pathProgress(paths[0], courses, progress)).toBe(42);
    expect(pathProgress(paths[3], courses, progress)).toBe(0);
  });
});
