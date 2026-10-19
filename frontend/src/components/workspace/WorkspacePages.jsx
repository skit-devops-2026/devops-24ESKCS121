import React, { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { classrooms as seedClassrooms } from "../../data/classrooms";
import { teachers } from "../../data/teachers";
import { courses } from "../../data/courses";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { ProgressBar } from "../ui/ProgressBar";
import { WorkspacePage } from "../layout/WorkspaceLayout";
import { classroomsForUser, classroomsOwnedBy, createTeacherClassroom, decideTeacherApplication, isEnrolled, joinClassroom, readTeacherApplications, readTeacherClassrooms, readUser, submitTeacherApplication, teacherStatus } from "../../lib/storage";

const action = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-amber-400";
const allClassrooms = () => [...seedClassrooms, ...readTeacherClassrooms()];
const teacherFor = (classroom) => teachers.find((teacher) => teacher.id === classroom?.teacherId);

function EmptyState({ title, message, actionLabel, actionTo }) {
  return <Card className="mt-8 p-8 text-center"><h2 className="text-xl font-black">{title}</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">{message}</p>{actionLabel && <Link className={`${action} mt-5 bg-amber-400 text-slate-950`} to={actionTo}>{actionLabel}</Link>}</Card>;
}

function ClassroomCard({ classroom, joined = false, onJoin }) {
  const teacher = teacherFor(classroom);
  return <Card as="article" className="flex flex-col p-5"><div className="flex items-start justify-between gap-3"><Badge>{classroom.subject}</Badge>{joined && <Badge variant="success">Joined</Badge>}</div><h2 className="mt-4 text-xl font-black">{classroom.title}</h2><p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{classroom.description}</p><p className="mt-4 text-sm font-bold text-slate-500">{teacher?.name || "Teacher workspace"} · {classroom.level}</p>{onJoin ? <Button className="mt-5 w-full" variant={joined ? "secondary" : "accent"} disabled={joined} onClick={() => onJoin(classroom.id)}>{joined ? "Already joined" : "Join classroom"}</Button> : <Link className={`${action} mt-5 bg-[#10233f] text-white`} to={`/student/classrooms/${classroom.id}`}>Open classroom <ArrowRight size={15}/></Link>}</Card>;
}

export function StudentDashboard() {
  const user = readUser();
  const joined = classroomsForUser(user);
  const progress = courses.filter((course) => course.id === "js" || course.id === "html").length;
  return <WorkspacePage eyebrow="Student workspace" title={`Welcome back, ${user?.name || "Student"}`}><p className="mt-2 text-slate-600">Your classrooms, learning queue and progress in one place.</p><div className="mt-8 grid gap-4 md:grid-cols-3"><Card className="bg-[#10233f] p-5 text-white"><p className="text-sm text-slate-300">My classrooms</p><strong className="mt-2 block text-3xl text-amber-300">{joined.length}</strong></Card><Card className="p-5"><p className="text-sm text-slate-500">Courses in your path</p><strong className="mt-2 block text-3xl">{progress}</strong></Card><Card className="p-5"><p className="text-sm text-slate-500">Demo progress</p><strong className="mt-2 block text-3xl">38%</strong></Card></div><h2 className="mt-10 text-2xl font-black">Enrolled classrooms</h2>{joined.length ? <div className="mt-5 grid gap-5 md:grid-cols-2">{joined.map((classroom) => <ClassroomCard key={classroom.id} classroom={classroom} joined />)}</div> : <EmptyState title="Your classroom list is empty" message="Join a classroom to keep teacher-led learning close to your dashboard." actionLabel="Discover classrooms" actionTo="/student/classrooms" />}</WorkspacePage>;
}

export function StudentClassrooms() {
  const user = readUser();
  const [query, setQuery] = useState("");
  const [joinedIds, setJoinedIds] = useState(() => classroomsForUser(user).map((classroom) => classroom.id));
  const visible = useMemo(() => allClassrooms().filter((classroom) => `${classroom.title} ${classroom.subject} ${classroom.description}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const join = (classroomId) => { joinClassroom(classroomId, user); setJoinedIds(classroomsForUser(user).map((classroom) => classroom.id)); };
  return <WorkspacePage eyebrow="Student workspace" title="Discover classrooms"><div className="mt-6 max-w-xl"><Input id="student-classroom-search" label="Search classrooms" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, subject or description" /></div>{visible.length ? <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visible.map((classroom) => <ClassroomCard key={classroom.id} classroom={classroom} joined={joinedIds.includes(classroom.id)} onJoin={join} />)}</div> : <EmptyState title="No classrooms found" message="Try a different classroom or subject search." />}</WorkspacePage>;
}

export function StudentClassroomDetail() {
  const { classroomId } = useParams();
  const classroom = allClassrooms().find((item) => item.id === classroomId);
  const user = readUser();
  const [joined, setJoined] = useState(() => isEnrolled(classroomId, user));
  if (!classroom) return <WorkspacePage eyebrow="Not found" title="Classroom not found"><Link className={`${action} mt-6 bg-amber-400 text-slate-950`} to="/student/classrooms">Back to classrooms</Link></WorkspacePage>;
  const teacher = teacherFor(classroom);
  return <WorkspacePage eyebrow={classroom.subject} title={classroom.title}><p className="mt-3 max-w-2xl leading-7 text-slate-600">{classroom.description}</p><div className="mt-6 flex flex-wrap items-center gap-3"><Badge>{classroom.level}</Badge><span className="text-sm font-bold text-slate-500">{classroom.studentCount} learners</span>{teacher && <Link className="font-bold text-[#10233f] underline" to={`/teachers/${teacher.id}`}>Led by {teacher.name}</Link>}</div><div className="mt-8 flex flex-wrap gap-3"><Button variant={joined ? "secondary" : "accent"} disabled={joined} onClick={() => { joinClassroom(classroom.id, user); setJoined(true); }}>{joined ? "Already joined" : "Join classroom"}</Button></div><section className="mt-10"><h2 className="text-2xl font-black">Learning resources</h2><div className="mt-5 grid gap-4 md:grid-cols-2">{[["Lessons", "Follow guided modules and practice concepts."], ["Notes", "Review concise notes prepared for this classroom."], ["Videos", "Watch topic walkthroughs when available."], ["Quizzes and assignments", "Check understanding and apply what you learn."]].map(([title, text]) => <Card className="p-5" key={title}><h3 className="font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></Card>)}</div></section></WorkspacePage>;
}

export function StudentLearning() {
  return <WorkspacePage eyebrow="Student workspace" title="Learning queue"><p className="mt-2 text-slate-600">Continue the existing StudySphere curriculum without losing your saved lesson progress.</p><div className="mt-8 grid gap-5 md:grid-cols-2">{courses.slice(0, 4).map((course) => <Card className="p-5" key={course.id}><Badge>{course.tech}</Badge><h2 className="mt-4 text-xl font-black">{course.name}</h2><p className="mt-2 text-sm text-slate-600">{course.description}</p><ProgressBar value={course.id === "js" ? 38 : course.id === "html" ? 100 : 0} /><Link className="mt-4 inline-block font-bold text-[#10233f]" to={`/learn/${course.id}`}>Open course <ArrowRight className="inline" size={15}/></Link></Card>)}</div></WorkspacePage>;
}

export function StudentProgress() {
  return <WorkspacePage eyebrow="Student workspace" title="Progress"><p className="mt-2 text-slate-600">Your existing course progress remains stored under the original progress key.</p><div className="mt-8 grid gap-5 md:grid-cols-2">{courses.map((course) => <Card className="p-5" key={course.id}><div className="flex justify-between"><h2 className="font-black">{course.name}</h2><span className="text-sm font-bold text-slate-500">{course.id === "html" || course.id === "css" ? 100 : course.id === "js" ? 38 : 0}%</span></div><ProgressBar value={course.id === "html" || course.id === "css" ? 100 : course.id === "js" ? 38 : 0} /></Card>)}</div></WorkspacePage>;
}

export function StudentProfile() {
  const user = readUser() || {};
  return <WorkspacePage eyebrow="Student workspace" title="Profile"><Card className="mt-8 max-w-xl p-6"><h2 className="text-xl font-black">{user.name || "Student"}</h2><p className="mt-2 text-slate-600">{user.email || "No email stored"}</p><p className="mt-5 text-sm leading-6 text-slate-500">Profile editing remains available at the original <Link className="font-bold underline" to="/profile">profile page</Link>.</p></Card></WorkspacePage>;
}

export function TeacherApplication() {
  const user = readUser();
  const [qualifications, setQualifications] = useState(() => readTeacherApplications().find((item) => item.email === user?.email)?.qualifications || "");
  const [saved, setSaved] = useState(false);
  const status = teacherStatus(user);
  return <WorkspacePage eyebrow="Teacher workspace" title="Teacher application"><Card className="mt-8 max-w-2xl p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-black">Application status</h2><p className="mt-1 text-sm text-slate-600">Your application is stored locally for this demo.</p></div><Badge variant={status === "approved" ? "success" : status === "rejected" ? "danger" : "warning"}>{status}</Badge></div><form className="mt-6 space-y-4" onSubmit={(event) => { event.preventDefault(); submitTeacherApplication(user, { qualifications }); setSaved(true); }}><label className="block text-sm font-bold" htmlFor="qualifications">Qualifications and teaching experience<textarea id="qualifications" className="input min-h-32" required value={qualifications} onChange={(event) => setQualifications(event.target.value)} /></label>{saved && <p className="text-sm font-bold text-emerald-700" role="status">Application saved locally.</p>}<Button type="submit" variant="accent">Save application</Button></form>{status !== "approved" && <p className="mt-5 text-sm leading-6 text-slate-500">Pending and rejected applications cannot create teaching classrooms. An admin decision is required.</p>}</Card></WorkspacePage>;
}

function TeacherApproved({ children }) {
  return teacherStatus() === "approved" ? children : <Navigate to="/teacher/application" replace />;
}

export function TeacherDashboard() {
  const owned = classroomsOwnedBy();
  return <TeacherApproved><WorkspacePage eyebrow="Teacher workspace" title="Teaching dashboard"><div className="mt-8 grid gap-4 md:grid-cols-3"><Card className="p-5"><p className="text-sm text-slate-500">Owned classrooms</p><strong className="mt-2 block text-3xl">{owned.length}</strong></Card><Card className="p-5"><p className="text-sm text-slate-500">Learners</p><strong className="mt-2 block text-3xl">{owned.reduce((sum, classroom) => sum + classroom.studentCount, 0)}</strong></Card><Card className="p-5"><p className="text-sm text-slate-500">Storage mode</p><strong className="mt-2 block text-lg">Local demo</strong></Card></div><p className="mt-8 max-w-2xl text-sm leading-6 text-slate-600">This workspace stores classroom metadata in your browser only. No files or content are uploaded to a server.</p></WorkspacePage></TeacherApproved>;
}

export function TeacherClassrooms() {
  const owned = classroomsOwnedBy();
  return <TeacherApproved><WorkspacePage eyebrow="Teacher workspace" title="My classrooms"><div className="mt-6"><Link className={`${action} bg-amber-400 text-slate-950`} to="/teacher/classrooms/new">Create classroom</Link></div>{owned.length ? <div className="mt-8 grid gap-5 md:grid-cols-2">{owned.map((classroom) => <ClassroomCard key={classroom.id} classroom={classroom} />)}</div> : <EmptyState title="No owned classrooms yet" message="Create your first classroom after your application is approved." actionLabel="Create classroom" actionTo="/teacher/classrooms/new" />}</WorkspacePage></TeacherApproved>;
}

export function NewTeacherClassroom() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", subject: "", description: "", level: "Beginner", topics: "" });
  const [error, setError] = useState("");
  return <TeacherApproved><WorkspacePage eyebrow="Teacher workspace" title="Create classroom"><Card className="mt-8 max-w-2xl p-6"><form className="space-y-4" onSubmit={(event) => { event.preventDefault(); if (!form.title.trim() || !form.subject.trim() || !form.description.trim() || !form.topics.trim()) return setError("Complete every field before creating the classroom."); const classroom = createTeacherClassroom(form); if (!classroom) return setError("The classroom could not be created."); navigate("/teacher/classrooms"); }}><Input id="teacher-title" label="Classroom title" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /><Input id="teacher-subject" label="Subject" required value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} /><label className="block text-sm font-bold" htmlFor="teacher-description">Description<textarea id="teacher-description" className="input min-h-28" required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label><Input id="teacher-level" label="Level" required value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value })} /><Input id="teacher-topics" label="Topics (comma separated)" required value={form.topics} onChange={(event) => setForm({ ...form, topics: event.target.value })} />{error && <p className="text-sm font-bold text-red-700" role="alert">{error}</p>}<Button type="submit" variant="accent">Create classroom</Button></form></Card></WorkspacePage></TeacherApproved>;
}

export function TeacherClassroomDetail() {
  const classroom = classroomsOwnedBy().find((item) => item.id === useParams().classroomId);
  if (!classroom) return <TeacherApproved><WorkspacePage eyebrow="Not found" title="Classroom not found"><Link className={`${action} mt-6 bg-amber-400 text-slate-950`} to="/teacher/classrooms">Back to classrooms</Link></WorkspacePage></TeacherApproved>;
  return <TeacherApproved><WorkspacePage eyebrow="Teacher workspace" title={classroom.title}><p className="mt-3 text-slate-600">{classroom.description}</p><div className="mt-6 flex flex-wrap gap-2">{classroom.topics.map((topic) => <Badge key={topic}>{topic}</Badge>)}</div><Card className="mt-8 p-6"><h2 className="text-xl font-black">Classroom content</h2><p className="mt-2 text-sm leading-6 text-slate-600">Notes, videos, quizzes and assignments can be connected to a backend in a later phase. This demo currently stores classroom metadata only.</p></Card></WorkspacePage></TeacherApproved>;
}

export function TeacherStudents() {
  return <TeacherApproved><WorkspacePage eyebrow="Teacher workspace" title="Students"><EmptyState title="No student roster yet" message="Enrollment records are available to the student demo flow. Server-backed student management is not implemented." /></WorkspacePage></TeacherApproved>;
}

export function TeacherProfile() {
  const user = readUser();
  return <WorkspacePage eyebrow="Teacher workspace" title="Profile"><Card className="mt-8 max-w-xl p-6"><h2 className="text-xl font-black">{user?.name}</h2><p className="mt-2 text-slate-600">{user?.email}</p><p className="mt-5 text-sm text-slate-500">Role: teacher · Application: {teacherStatus(user)}</p></Card></WorkspacePage>;
}

export function AdminDashboard() {
  const applications = readTeacherApplications();
  return <WorkspacePage eyebrow="Admin workspace" title="Administration"><div className="mt-8 grid gap-4 md:grid-cols-3"><Card className="p-5"><p className="text-sm text-slate-500">Pending applications</p><strong className="mt-2 block text-3xl">{applications.filter((item) => item.status === "pending").length}</strong></Card><Card className="p-5"><p className="text-sm text-slate-500">Applications reviewed</p><strong className="mt-2 block text-3xl">{applications.filter((item) => item.status !== "pending").length}</strong></Card><Card className="p-5"><p className="text-sm text-slate-500">Mode</p><strong className="mt-2 block text-lg">Development demo</strong></Card></div><p className="mt-8 text-sm leading-6 text-slate-600">Admin access is provisioned only through the isolated development helper, never public registration. Production authorization must be enforced by a backend.</p></WorkspacePage>;
}

export function AdminApplications() {
  const [applications, setApplications] = useState(readTeacherApplications());
  const decide = (id, status) => { decideTeacherApplication(id, status); setApplications(readTeacherApplications()); };
  return <WorkspacePage eyebrow="Admin workspace" title="Teacher applications"><div className="mt-8 space-y-4">{applications.length ? applications.map((application) => <Card className="p-5" key={application.id}><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-black">{application.name}</h2><p className="text-sm text-slate-500">{application.email}</p></div><Badge variant={application.status === "approved" ? "success" : application.status === "rejected" ? "danger" : "warning"}>{application.status}</Badge></div><p className="mt-4 text-sm leading-6 text-slate-600">{application.qualifications || "No qualifications provided."}</p>{application.status === "pending" && <div className="mt-5 flex gap-3"><Button variant="accent" onClick={() => decide(application.id, "approved")}>Approve</Button><Button variant="secondary" onClick={() => decide(application.id, "rejected")}>Reject</Button></div>}</Card>) : <EmptyState title="No applications" message="Teacher applications will appear here after submission." />}</div></WorkspacePage>;
}

export function AdminUsers() {
  const applications = readTeacherApplications();
  return <WorkspacePage eyebrow="Admin workspace" title="Users"><Card className="mt-8 p-6"><h2 className="text-xl font-black">Known demo users</h2>{applications.length ? applications.map((application) => <div className="mt-4 flex justify-between border-b border-slate-100 pb-3 text-sm" key={application.id}><span>{application.name} · {application.email}</span><Badge>{application.status}</Badge></div>) : <p className="mt-3 text-sm text-slate-600">No teacher users are stored yet.</p>}</Card></WorkspacePage>;
}

export function AdminClassrooms() {
  const owned = readTeacherClassrooms();
  return <WorkspacePage eyebrow="Admin workspace" title="Classrooms"><Card className="mt-8 p-6"><h2 className="text-xl font-black">Teacher-created classrooms</h2>{owned.length ? owned.map((classroom) => <div className="mt-4 border-b border-slate-100 pb-3" key={classroom.id}><p className="font-bold">{classroom.title}</p><p className="text-sm text-slate-500">{classroom.subject} · owner {classroom.teacherEmail}</p></div>) : <p className="mt-3 text-sm text-slate-600">No teacher-created classrooms are stored yet.</p>}</Card></WorkspacePage>;
}
