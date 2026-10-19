import React from "react";

const variantClasses = {
  neutral: "bg-slate-100 text-slate-600",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
};

export function Badge({ variant = "neutral", className = "", children, ...props }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${variantClasses[variant] || variantClasses.neutral} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
}
