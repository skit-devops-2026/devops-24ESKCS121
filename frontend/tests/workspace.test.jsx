import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App";
import { AdminDashboard, StudentClassroomDetail, StudentDashboard, TeacherApplication } from "../src/components/workspace/WorkspacePages";

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

function render(element, route = "/") {
  return renderToStaticMarkup(<MemoryRouter initialEntries={[route]}>{element}</MemoryRouter>);
}

describe("role workspaces", () => {
  it("renders the student dashboard and an invalid classroom state", () => {
    localStorage.setItem("studySphereUser", JSON.stringify({ name: "Student", email: "student@example.com", role: "student" }));
    expect(render(<StudentDashboard />)).toContain("Enrolled classrooms");
    expect(render(<StudentClassroomDetail />, "/student/classrooms/missing")).toContain("Classroom not found");
  });

  it("renders teacher application and admin dashboard from shared storage", () => {
    const teacher = { name: "Teacher", email: "teacher@example.com", role: "teacher", teacherStatus: "pending" };
    localStorage.setItem("studySphereUser", JSON.stringify(teacher));
    expect(render(<TeacherApplication />)).toContain("Application status");
    localStorage.setItem("studySphereUser", JSON.stringify({ name: "Admin", email: "admin@example.com", role: "admin" }));
    expect(render(<AdminDashboard />)).toContain("Administration");
  });

  it("shows the student workspace only for an authenticated student route", () => {
    localStorage.setItem("studySphereAuth", "true");
    localStorage.setItem("studySphereUser", JSON.stringify({ name: "Student", email: "student@example.com" }));
    expect(render(<App />, "/student/dashboard")).toContain("Student workspace");
  });
});
