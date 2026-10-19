import React from "react";

export function Input({ id, label, error, className = "", ...props }) {
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <label className="block text-sm font-bold" htmlFor={id}>
      {label}
      <input
        id={id}
        className={`input ${className}`.trim()}
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && (
        <span id={describedBy} className="mt-1 block text-xs font-semibold text-red-700" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}
