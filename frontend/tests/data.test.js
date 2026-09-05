const test = require("node:test");
const assert = require("node:assert");

global.window = {};

require("../assets/js/data.js");


const data = global.window.STUDYSPHERE;

test("STUDYSPHERE data object should exist", () => {
    assert.ok(data);
});

test("should contain 6 courses", () => {
    assert.strictEqual(data.courses.length, 6);
});

test("should contain expected course IDs", () => {
    const ids = data.courses.map(course => course.id);

    assert.deepStrictEqual(ids, [
        "html",
        "css",
        "js",
        "react",
        "node",
        "mongodb"
    ]);
});

test("HTML course should be completed with 100% progress", () => {
    const course = data.courses.find(course => course.id === "html");

    assert.strictEqual(course.status, "completed");
    assert.strictEqual(course.progress, 100);
});

test("JavaScript course should be in progress", () => {
    const course = data.courses.find(course => course.id === "js");

    assert.strictEqual(course.status, "in-progress");
    assert.strictEqual(course.progress, 38);
});

test("React course should be locked", () => {
    const course = data.courses.find(course => course.id === "react");

    assert.strictEqual(course.status, "locked");
    assert.strictEqual(course.progress, 0);
});

test("JavaScript course should contain 8 lessons", () => {
    const course = data.courses.find(course => course.id === "js");

    assert.strictEqual(course.lessons.length, 8);
});

test("MERN path should contain all 6 courses", () => {
    const path = data.paths.find(path => path.id === "mern");

    assert.strictEqual(path.courses.length, 6);

    assert.deepStrictEqual(path.courses, [
        "html",
        "css",
        "js",
        "react",
        "node",
        "mongodb"
    ]);
});

test("DSA path should currently contain no courses", () => {
    const path = data.paths.find(path => path.id === "dsa");

    assert.deepStrictEqual(path.courses, []);
});

test("should contain 7 projects", () => {
    assert.strictEqual(data.projects.length, 7);
});

test("MERN Task Manager project should require MERN path", () => {
    const project = data.projects.find(
        project => project[0] === "MERN Task Manager"
    );

    assert.strictEqual(project[1], "Advanced");
    assert.strictEqual(project[5], "mern");
});