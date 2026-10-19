import { beforeEach, describe, expect, it } from "vitest";
import { courses, paths } from "../src/data/courses";
import { authenticateUser, classroomsForUser, classroomsOwnedBy, createTeacherClassroom, decideTeacherApplication, joinClassroom, pathProgress, readEnrollments, readProgress, readTeacherApplications, saveProgress, saveUser, STORAGE_KEYS, submitTeacherApplication, teacherStatus, userRole } from "../src/lib/storage";

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

  describe("StudySphere demo roles", () => {
    it("keeps legacy users as students without changing their stored shape", () => {
      const legacyUser = { name: "Student", email: "student@example.com" };
      saveUser(legacyUser);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.user))).toEqual(legacyUser);
      expect(userRole()).toBe("student");
      expect(teacherStatus()).toBe("not_applicable");
    });

    it("recognizes pending teacher applications", () => {
      const teacher = { name: "Teacher", email: "teacher@example.com", role: "teacher", teacherStatus: "pending" };
      saveUser(teacher);
      expect(userRole()).toBe("teacher");
      expect(teacherStatus()).toBe("pending");
    });

    it("does not treat unknown roles as privileged roles", () => {
      saveUser({ name: "Unknown", role: "superuser" });
      expect(userRole()).toBe("student");
    });

    it("joins a classroom idempotently and returns it for the current student", () => {
      const user = { name: "Student", email: "student@example.com", role: "student" };
      saveUser(user);
      joinClassroom("react-foundations", user);
      joinClassroom("react-foundations", user);
      expect(readEnrollments()).toHaveLength(1);
      expect(classroomsForUser(user).map((classroom) => classroom.id)).toEqual(["react-foundations"]);
    });

    it("persists teacher applications and admin decisions", () => {
      const teacher = { name: "Teacher", email: "teacher@example.com", role: "teacher" };
      saveUser(teacher);
      const application = submitTeacherApplication(teacher, { qualifications: "Five years teaching" });
      expect(application.status).toBe("pending");
      expect(readTeacherApplications()).toHaveLength(1);
      expect(decideTeacherApplication(application.id, "approved").status).toBe("approved");
      expect(teacherStatus(teacher)).toBe("approved");
    });

    it("creates classrooms owned by the current teacher", () => {
      const teacher = { name: "Teacher", email: "teacher@example.com", role: "teacher", teacherStatus: "approved" };
      saveUser(teacher);
      const classroom = createTeacherClassroom({ title: "Testing Lab", subject: "Testing", description: "Practice tests", level: "Beginner", topics: "Vitest, DOM" }, teacher);
      expect(classroomsOwnedBy(teacher.email)).toEqual([classroom]);
    });

    it("migrates a legacy plaintext demo password after successful login", async () => {
      const legacyUser = { name: "Legacy", email: "legacy@example.com", password: "secret123" };
      saveUser(legacyUser);
      expect(await authenticateUser(legacyUser, "secret123")).toBe(true);
      const migrated = JSON.parse(localStorage.getItem(STORAGE_KEYS.user));
      expect(migrated.password).toBeUndefined();
      expect(migrated.passwordDigest).toMatch(/^[a-f0-9]{64}$/);
      expect(await authenticateUser(migrated, "wrong")).toBe(false);
    });
  });

  it("calculates path progress from saved course progress", () => {
    const progress = { html: { progress: 100 }, css: { progress: 100 }, js: { progress: 50 } };
    expect(pathProgress(paths[0], courses, progress)).toBe(42);
    expect(pathProgress(paths[3], courses, progress)).toBe(0);
  });
});
