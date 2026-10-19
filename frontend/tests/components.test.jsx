import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Badge } from "../src/components/ui/Badge";
import { Button } from "../src/components/ui/Button";
import { Input } from "../src/components/ui/Input";
import { ProgressBar } from "../src/components/ui/ProgressBar";

describe("shared UI components", () => {
  it("renders a button and supports disabled behavior", () => {
    const markup = renderToStaticMarkup(<Button disabled>Save changes</Button>);

    expect(markup).toContain("Save changes");
    expect(markup).toContain('type="button"');
    expect(markup).toContain("disabled");
  });

  it("associates an input label and supports disabled behavior", () => {
    const markup = renderToStaticMarkup(
      <Input id="email" label="Email" type="email" disabled />,
    );

    expect(markup).toContain('for="email"');
    expect(markup).toContain('id="email"');
    expect(markup).toContain("Email");
    expect(markup).toContain("disabled");
  });

  it("renders badge text", () => {
    const markup = renderToStaticMarkup(<Badge variant="success">Approved</Badge>);

    expect(markup).toContain("Approved");
    expect(markup).toContain("bg-emerald-100");
  });

  it("exposes progress value through accessible semantics", () => {
    const markup = renderToStaticMarkup(<ProgressBar value={65} label="Course progress" />);

    expect(markup).toContain('role="progressbar"');
    expect(markup).toContain('aria-label="Course progress"');
    expect(markup).toContain('aria-valuenow="65"');
    expect(markup).toContain('style="width:65%"');
  });
});
