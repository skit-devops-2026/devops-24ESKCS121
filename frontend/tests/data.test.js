
import { describe, expect, it } from "vitest";
import { courses, paths, projects } from "../src/data/courses";

describe("StudySphere course data", () => {
    it("should contain 6 courses", () => {
        expect(courses).toHaveLength(6);
    });

    it("should contain the expected course IDs", () => {
        expect(courses.map((course) => course.id)).toEqual([
            "html",
            "css",
            "js",
            "react",
            "node",
            "mongodb",
        ]);
    });

    it("should contain 8 JavaScript lessons", () => {
        const course = courses.find((course) => course.id === "js");

        expect(course).toBeDefined();
        expect(course.lessons).toHaveLength(8);
    });

    it("should define the MERN path with all 6 courses", () => {
        const path = paths.find((path) => path.id === "mern");

        expect(path).toBeDefined();
        expect(path.courses).toEqual([
            "html",
            "css",
            "js",
            "react",
            "node",
            "mongodb",
        ]);
    });

    it("should define the DSA path with no courses", () => {
        const path = paths.find((path) => path.id === "dsa");

        expect(path).toBeDefined();
        expect(path.courses).toEqual([]);
    });

    it("should contain 7 projects", () => {
        expect(projects).toHaveLength(7);
    });

    it("should define the MERN Task Manager project correctly", () => {
        const project = projects.find(
            (project) => project[0] === "MERN Task Manager"
        );

        expect(project).toBeDefined();
        expect(project[1]).toBe("Advanced");
        expect(project[5]).toBe("mern");
    });
});
