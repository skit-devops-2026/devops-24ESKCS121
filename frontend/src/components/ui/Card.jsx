import React from "react";

export function Card({ as: Component = "section", className = "", children, ...props }) {
  return (
    <Component
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
