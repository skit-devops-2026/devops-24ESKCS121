import React from "react";

const baseClasses = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses = {
  primary: "bg-[#10233f] text-white hover:bg-[#173d5d]",
  accent: "bg-amber-400 text-slate-950 hover:bg-amber-300",
  secondary: "border border-slate-300 text-slate-700 hover:bg-slate-50",
  ghost: "text-slate-700 hover:bg-slate-100",
};

export function Button({ variant = "primary", className = "", type = "button", children, ...props }) {
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
