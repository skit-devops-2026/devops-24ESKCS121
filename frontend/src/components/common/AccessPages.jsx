import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { ROUTES } from "../../app/routes";
import { isAuthenticated, readUser, teacherStatus, userRole } from "../../lib/storage";

const action = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-amber-400";

function AccessPage({ eyebrow, title, message, children }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#10233f] px-5">
      <section className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">{title}</h1>
        <p className="mt-3 leading-7 text-slate-600">{message}</p>
        {children}
      </section>
    </main>
  );
}

export function TeacherApplicationStatus() {
  const navigate = useNavigate();
  const user = readUser();
  const status = teacherStatus(user);
  const logout = () => { localStorage.setItem(STORAGE_KEYS.auth, "false"); navigate(ROUTES.home); };
  return (
    <AccessPage
      eyebrow="Teacher application"
      title={status === "approved" ? "Teacher access approved" : "Application awaiting approval"}
      message={status === "approved" ? "Your demo teacher account is approved. Teaching tools will be connected in a later workspace phase." : "Teacher registration does not grant teaching access immediately. An admin must review and approve your application."}
    >
      <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm font-bold text-amber-900">Status: {status[0].toUpperCase() + status.slice(1)}</div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className={`${action} bg-[#10233f] text-white`} to={ROUTES.home}>Explore StudySphere</Link>
        <button className={`${action} border border-slate-300 text-slate-700`} onClick={logout} type="button"><LogOut size={16} /> Log out</button>
      </div>
    </AccessPage>
  );
}

export function AccessDenied({ requiredRole = "student" }) {
  const role = userRole();
  return <AccessPage eyebrow="Access restricted" title="This workspace is not available" message={`This demo account is signed in as ${role}. The requested area requires ${requiredRole} access. Backend authorization will be required in production.`}><Link className={`${action} mt-6 bg-[#10233f] text-white`} to={role === "student" ? ROUTES.dashboard : ROUTES.home}>Continue</Link></AccessPage>;
}

export function isDemoUserAllowed(requiredRole) {
  if (!isAuthenticated()) return false;
  return userRole() === requiredRole;
}
