import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const button = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-amber-400";

export function PublicLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const sectionLink = (section) => pathname === "/" ? `#${section}` : `/#${section}`;
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="text-xl font-black text-slate-900">
            Study<span className="text-amber-500">Sphere</span>
          </Link>
          <button className="rounded p-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="public-navigation" aria-label={open ? "Close public navigation" : "Open public navigation"} type="button">{open ? <X /> : <Menu />}</button>
          <nav id="public-navigation" aria-label="Public navigation" className={`${open ? "flex" : "hidden"} absolute left-0 top-[65px] z-10 w-full flex-col gap-2 border-b border-slate-200 bg-white p-5 text-sm font-semibold text-slate-600 md:static md:flex md:w-auto md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0`}>
            <Link onClick={() => setOpen(false)} className="rounded px-1 py-1 focus:outline-none focus:ring-2 focus:ring-amber-400" to="/">Home</Link>
            <a onClick={() => setOpen(false)} className="rounded px-1 py-1 focus:outline-none focus:ring-2 focus:ring-amber-400" href={sectionLink("about")}>About</a>
            <a onClick={() => setOpen(false)} className="rounded px-1 py-1 focus:outline-none focus:ring-2 focus:ring-amber-400" href={sectionLink("roles")}>Roles</a>
            <a onClick={() => setOpen(false)} className="rounded px-1 py-1 focus:outline-none focus:ring-2 focus:ring-amber-400" href={sectionLink("get-started")}>Get started</a>
          </nav>
          <div className="flex gap-2">
            <Link to="/login" className={`${button} border border-slate-300 text-slate-700`}>Login</Link>
            <Link to="/register" className={`${button} bg-amber-400 text-slate-950`}>Get started</Link>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
