import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { AppShell } from "../src/components/layout/AppShell";
import { PublicLayout } from "../src/components/layout/PublicLayout";

function renderWithRouter(element, entries = ["/"]) {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={entries}>{element}</MemoryRouter>,
  );
}

describe("shared layouts", () => {
  it("renders public navigation destinations", () => {
    const markup = renderWithRouter(
      <PublicLayout><main>Public content</main></PublicLayout>,
    );

    expect(markup).toContain("Public content");
    expect(markup).toContain('href="/login"');
    expect(markup).toContain('href="/register"');
    expect(markup).toContain('href="/"');
    expect(markup).toContain('href="#roles"');
    expect(markup).toContain('href="#get-started"');
    expect(markup).toContain('href="#about"');
    expect(markup).toContain('aria-label="Public navigation"');
  });

  it("renders authenticated navigation with the active route", () => {
    const markup = renderWithRouter(<AppShell />, ["/courses"]);

    expect(markup).toContain('href="/dashboard"');
    expect(markup).toContain('href="/courses"');
    expect(markup).toContain('href="/paths"');
    expect(markup).toContain('href="/projects"');
    expect(markup).toContain('href="/profile"');
    expect(markup).toContain("bg-white/15");
    expect(markup).toContain('aria-label="Authenticated navigation"');
  });

  it("includes an accessible mobile navigation control", () => {
    const markup = renderWithRouter(<AppShell />);

    expect(markup).toContain('aria-controls="authenticated-navigation"');
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain('aria-label="Open navigation"');
  });
});
