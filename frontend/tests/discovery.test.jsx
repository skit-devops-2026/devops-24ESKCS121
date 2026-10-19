import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { classrooms } from "../src/data/classrooms";
import { teachers } from "../src/data/teachers";
import { ClassroomDetail, ClassroomDirectory, TeacherDetail, TeacherDirectory, filterClassrooms, filterTeachers } from "../src/components/discovery/DiscoveryPages";
import { LandingPage } from "../src/components/discovery/LandingPage";

function renderPage(element, route = "/") {
  return renderToStaticMarkup(<MemoryRouter initialEntries={[route]}>{element}</MemoryRouter>);
}

function renderRoute(path, element, route) {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[route]}>
      <Routes><Route path={path} element={element} /></Routes>
    </MemoryRouter>,
  );
}

describe("public discovery experience", () => {
  it("renders the three role pathways without discovery sections", () => {
    const markup = renderPage(<LandingPage />);
    expect(markup).toContain("For students");
    expect(markup).toContain("For teachers");
    expect(markup).toContain("For administrators");
    expect(markup).not.toContain("Featured educators");
    expect(markup).not.toContain("Featured classrooms");
  });

  it("renders teacher directory and filters by subject and search text", () => {
    const markup = renderPage(<TeacherDirectory />);
    expect(markup).toContain("Find your next teacher");
    expect(markup).toContain("Aisha Khan");
    expect(filterTeachers(teachers, "react", "")).toHaveLength(1);
    expect(filterTeachers(teachers, "", "CSS")).toHaveLength(1);
    expect(filterTeachers(teachers, "does-not-exist", "")).toHaveLength(0);
  });

  it("renders teacher detail and an invalid teacher state", () => {
    expect(renderRoute("/teachers/:teacherId", <TeacherDetail />, "/teachers/aisha-khan")).toContain("Classrooms by Aisha Khan");
    expect(renderRoute("/teachers/:teacherId", <TeacherDetail />, "/teachers/missing")).toContain("Teacher not found");
  });

  it("renders classroom directory and filters by subject, teacher, and topic", () => {
    const markup = renderPage(<ClassroomDirectory />);
    expect(markup).toContain("Discover classrooms");
    expect(markup).toContain("React Foundations");
    expect(filterClassrooms(classrooms, "Aisha", "")).toHaveLength(2);
    expect(filterClassrooms(classrooms, "", "CSS")).toHaveLength(1);
    expect(filterClassrooms(classrooms, "indexes", "")).toHaveLength(1);
  });

  it("renders classroom detail with a relational teacher link and invalid state", () => {
    const markup = renderRoute("/classrooms/:classroomId", <ClassroomDetail />, "/classrooms/react-foundations");
    expect(markup).toContain("Led by");
    expect(markup).toContain('href="/teachers/aisha-khan"');
    expect(renderRoute("/classrooms/:classroomId", <ClassroomDetail />, "/classrooms/missing")).toContain("Classroom not found");
  });
});
