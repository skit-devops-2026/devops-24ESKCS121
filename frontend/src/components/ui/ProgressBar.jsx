import React from "react";

export function ProgressBar({ value = 0, label = "Progress", className = "" }) {
  const safeValue = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <div
      className={`h-2 overflow-hidden rounded-full bg-slate-200 ${className}`.trim()}
      role="progressbar"
      aria-label={label}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={safeValue}
    >
      <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${safeValue}%` }} />
    </div>
  );
}
