import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { BookOpen, CircleUserRound, LayoutDashboard, LogOut, Menu, Rocket, Route as RouteIcon, X } from "lucide-react";
import { STORAGE_KEYS } from "../../lib/storage";
import { STUDENT_NAVIGATION } from "../../app/routes";

const icons = { Dashboard: LayoutDashboard, Courses: BookOpen, "Learning paths": RouteIcon, Projects: Rocket, Profile: CircleUserRound };

function Logo() {
  return (
    <Link to="/" className="text-xl font-black tracking-tight text-white">
      Study<span className="text-amber-400">Sphere</span>
    </Link>
  );
}

export function AppShell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const logout = () => {
    localStorage.setItem(STORAGE_KEYS.auth, "false");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#10233f] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Logo />
          <button
            className="rounded p-1 focus:outline-none focus:ring-2 focus:ring-amber-400 md:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="authenticated-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
            type="button"
          >
            {open ? <X /> : <Menu />}
          </button>
          <nav
            id="authenticated-navigation"
            aria-label="Authenticated navigation"
            className={`${open ? "flex" : "hidden"} absolute left-0 top-[65px] z-10 w-full flex-col gap-2 bg-[#10233f] p-5 md:static md:flex md:w-auto md:flex-row md:items-center md:p-0`}
          >
            {STUDENT_NAVIGATION.map(([to, label]) => {
              const Icon = icons[label];
              return (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `flex items-center gap-2 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ${isActive ? "bg-white/15 text-amber-300" : "text-slate-200"}`}
              >
                <Icon size={16} />
                {label}
              </NavLink>
              );
            })}
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded px-2 py-1 text-left text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
              type="button"
            >
              <LogOut size={16} />
              Logout
            </button>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
