import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { STORAGE_KEYS } from "../../lib/storage";

const workspaceIcons = {
  student: "Student workspace",
  teacher: "Teacher workspace",
  admin: "Admin workspace",
};

export function WorkspaceLayout({ role, navigation }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const logout = () => {
    localStorage.setItem(STORAGE_KEYS.auth, "false");
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#10233f] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div>
            <Link to="/" className="text-xl font-black tracking-tight">Study<span className="text-amber-400">Sphere</span></Link>
            <p className="text-xs text-slate-300">{workspaceIcons[role]}</p>
          </div>
          <button className="rounded p-1 focus:outline-none focus:ring-2 focus:ring-amber-400 md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={`${role}-workspace-navigation`} aria-label={open ? "Close navigation" : "Open navigation"} type="button">
            {open ? <X /> : <Menu />}
          </button>
          <nav id={`${role}-workspace-navigation`} aria-label={`${role} workspace navigation`} className={`${open ? "flex" : "hidden"} absolute left-0 top-[68px] z-20 w-full flex-col gap-2 bg-[#10233f] p-5 md:static md:flex md:w-auto md:flex-row md:items-center md:p-0`}>
            {navigation.map(([to, label]) => (
              <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `rounded px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 ${isActive ? "bg-white/15 text-amber-300" : "text-slate-200"}`}>{label}</NavLink>
            ))}
            <button className="flex items-center gap-2 rounded px-3 py-2 text-left text-sm font-bold text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400" onClick={logout} type="button"><LogOut size={16} /> Logout</button>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}

export function WorkspacePage({ eyebrow, title, children }) {
  return <main className="mx-auto max-w-7xl px-5 py-10"><p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">{eyebrow}</p><h1 className="mt-2 text-3xl font-black text-slate-900">{title}</h1>{children}</main>;
}
