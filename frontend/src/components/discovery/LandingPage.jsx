import React from "react";
import { ArrowRight, BookOpen, ClipboardCheck, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { PublicLayout } from "../layout/PublicLayout";

const action = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-amber-400";

const roles = [
  {
    icon: GraduationCap,
    label: "For students",
    title: "Learn with a clear next step",
    text: "Join classrooms, follow lessons, and keep your progress visible from one calm workspace.",
    link: "/register",
    action: "Create student account",
    tone: "bg-[#10233f] text-white",
  },
  {
    icon: BookOpen,
    label: "For teachers",
    title: "Turn expertise into classrooms",
    text: "Apply as a teacher, share your experience, and build focused learning spaces after approval.",
    link: "/register",
    action: "Apply as a teacher",
    tone: "bg-white text-slate-900",
  },
  {
    icon: ShieldCheck,
    label: "For administrators",
    title: "Keep the learning space trusted",
    text: "Review teacher applications and keep demo platform activity organized in one admin workspace.",
    link: "/login",
    action: "Admin sign in",
    tone: "bg-white text-slate-900",
  },
];

export function LandingPage() {
  return (
    <PublicLayout>
      <main>
        <section className="overflow-hidden bg-[#10233f] text-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-28">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-white/10 px-3 py-1 text-xs font-bold text-amber-200">
                <Sparkles size={14} /> A simpler way to learn together
              </div>
              <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
                One learning space.
                <span className="block text-amber-400">Three clear paths.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                StudySphere brings students, teachers, and administrators into one focused experience built around useful progress.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register" className={`${action} bg-amber-400 text-slate-950 hover:bg-amber-300`}>Start learning <ArrowRight size={17} /></Link>
                <Link to="/login" className={`${action} border border-white/30 text-white hover:bg-white/10`}>Sign in</Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-300">
                <span className="flex items-center gap-2"><ClipboardCheck size={16} className="text-amber-300" /> Guided learning</span>
                <span className="flex items-center gap-2"><BookOpen size={16} className="text-amber-300" /> Focused classrooms</span>
                <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-amber-300" /> Reviewed teaching</span>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-3 shadow-2xl">
              <div className="rounded-2xl bg-white p-6 text-slate-900">
                <div className="flex items-center justify-between">
                  <div><p className="text-xs font-black uppercase tracking-widest text-amber-600">Your workspace</p><h2 className="mt-2 text-2xl font-black">Make progress feel simple.</h2></div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-700"><GraduationCap /></div>
                </div>
                <div className="mt-8 space-y-3">
                  {["Choose a learning goal", "Join the right classroom", "Keep your next step visible"].map((item, index) => <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4" key={item}><span className="grid h-8 w-8 place-items-center rounded-full bg-[#10233f] text-sm font-black text-amber-300">{index + 1}</span><span className="text-sm font-bold">{item}</span></div>)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="roles" className="mx-auto max-w-7xl px-5 py-20">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">Choose your path</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-black tracking-tight text-slate-900">Everything important starts with the right workspace.</h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {roles.map(({ icon: Icon, label, title, text, link, action: labelAction, tone }) => <Card className={`${tone} flex h-full flex-col p-6`} key={label}><div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-700"><Icon /></div><p className={`mt-6 text-xs font-black uppercase tracking-widest ${tone.includes("text-white") ? "text-amber-300" : "text-amber-600"}`}>{label}</p><h3 className="mt-3 text-2xl font-black">{title}</h3><p className={`mt-3 flex-1 text-sm leading-7 ${tone.includes("text-white") ? "text-slate-300" : "text-slate-600"}`}>{text}</p><Link className={`${action} mt-6 self-start ${tone.includes("text-white") ? "bg-amber-400 text-slate-950" : "border border-slate-300 text-slate-800"}`} to={link}>{labelAction} <ArrowRight size={16} /></Link></Card>)}
          </div>
        </section>

        <section id="about" className="bg-slate-100 px-5 py-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">How it works</p>
            <div className="mt-3 grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <h2 className="text-4xl font-black tracking-tight text-slate-900">Less noise. More direction.</h2>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">Use the public website to understand the platform, then move into the workspace designed for your role.</p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[["01", "Select a role", "Start as a student or submit a teacher application. Admin access stays restricted."], ["02", "Build momentum", "Use classrooms, lessons, notes, quizzes, assignments, and progress views in one place."], ["03", "Stay in control", "Approval, ownership, and demo data are kept separate so each workspace stays clear."]].map(([number, title, text]) => <Card key={title}><span className="text-3xl font-black text-amber-500">{number}</span><h3 className="mt-5 text-xl font-black">{title}</h3><p className="mt-2 leading-7 text-slate-600">{text}</p></Card>)}
            </div>
          </div>
        </section>

        <section id="get-started" className="bg-[#10233f] px-5 py-16 text-center text-white">
          <h2 className="text-3xl font-black">Ready to make learning more intentional?</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">Create your account and enter a workspace that keeps the next step easy to find.</p>
          <Link className={`${action} mt-7 bg-amber-400 text-slate-950 hover:bg-amber-300`} to="/register">Get started <ArrowRight size={17} /></Link>
        </section>
      </main>
      <footer className="bg-[#10233f] px-5 py-8 text-center text-sm text-slate-300">© 2026 StudySphere · Student project</footer>
    </PublicLayout>
  );
}
