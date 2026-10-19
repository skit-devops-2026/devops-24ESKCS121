
import { beforeEach, describe, expect, it } from "vitest";
import {
    isAuthenticated,
    readProgress,
    readUser,
    saveProgress,
    STORAGE_KEYS,
} from "../src/lib/storage";

function createMemoryStorage() {
    const values = new Map();

    return {
        getItem: (key) => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, String(value)),
        removeItem: (key) => values.delete(key),
        clear: () => values.clear(),
    };
}

beforeEach(() => {
    globalThis.localStorage = createMemoryStorage();
});

describe("StudySphere authentication and user storage", () => {
    it("returns false when the user is not authenticated", () => {
        expect(isAuthenticated()).toBe(false);
    });

    it("returns true when the authentication key is true", () => {
        localStorage.setItem(STORAGE_KEYS.auth, "true");
        expect(isAuthenticated()).toBe(true);
    });

    it("reads stored user data", () => {
        const user = {
            name: "Student",
            email: "student@example.com",
        };

        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
        expect(readUser()).toEqual(user);
    });

    it("returns null when user data is missing or invalid", () => {
        expect(readUser()).toBeNull();

        localStorage.setItem(STORAGE_KEYS.user, "{invalid json");
        expect(readUser()).toBeNull();
    });
});

describe("StudySphere progress storage", () => {
    it("returns an empty object when progress is missing", () => {
        expect(readProgress()).toEqual({});
    });

    it("reads stored progress", () => {
        const progress = {
            html: { progress: 50, status: "in-progress", completed: 3 },
        };

        localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress));
        expect(readProgress()).toEqual(progress);
    });

    it("saves course progress and calculates its percentage", () => {
        const progress = saveProgress("html", 2, 4);

        expect(progress.html).toEqual({
            progress: 50,
            status: "in-progress",
            completed: 2,
        });

        expect(readProgress()).toEqual(progress);
    });

    it("marks a course completed at 100 percent", () => {
        const progress = saveProgress("html", 4, 4);

        expect(progress.html).toEqual({
            progress: 100,
            status: "completed",
            completed: 4,
        });
    });

    it("preserves the existing localStorage keys", () => {
        expect(STORAGE_KEYS.auth).toBe("studySphereAuth");
        expect(STORAGE_KEYS.user).toBe("studySphereUser");
        expect(STORAGE_KEYS.progress).toBe("studySphereProgress");
    });
});
