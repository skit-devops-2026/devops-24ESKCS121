import React, { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Search, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { classrooms } from "../../data/classrooms";
import { teachers } from "../../data/teachers";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";

const buttonLink = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-amber-400";

function DiscoveryPage({ eyebrow, title, intro, children }) {
  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-black text-slate-900 md:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-slate-600">{intro}</p>
      {children}
    </main>
  );
}

function EmptyState({ message }) {
  return (
    <Card className="mt-6 text-center">
      <h2 className="text-xl font-black text-slate-900">No matches found</h2>
      <p className="mt-2 text-slate-600">{message}</p>
    </Card>
  );
}

export function filterTeachers(list, query, subject) {
  const normalizedQuery = query.trim().toLowerCase();
  return list.filter((teacher) => {
    const searchable = [teacher.name, teacher.headline, ...teacher.subjects].join(" ").toLowerCase();
    return (!normalizedQuery || searchable.includes(normalizedQuery))
      && (!subject || teacher.subjects.includes(subject));
  });
}

export function filterClassrooms(list, query, subject, teacherList = teachers) {
  const normalizedQuery = query.trim().toLowerCase();
  return list.filter((classroom) => {
    const teacher = teacherList.find((item) => item.id === classroom.teacherId);
    const searchable = [classroom.title, classroom.subject, classroom.description, classroom.teacherId, teacher?.name, ...classroom.topics].join(" ").toLowerCase();
    return (!normalizedQuery || searchable.includes(normalizedQuery))
      && (!subject || classroom.subject === subject);
  });
}

function TeacherCard({ teacher }) {
  return (
    <Card as="article" className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-[#10233f] text-lg font-black text-amber-300" aria-hidden="true">{teacher.avatar}</div>
        <Badge variant="success"><Star size={13} className="mr-1 fill-current" /> {teacher.rating}</Badge>
      </div>
      <h2 className="mt-5 text-xl font-black text-slate-900">{teacher.name}</h2>
      <p className="mt-2 text-sm font-semibold text-slate-600">{teacher.headline}</p>
      <div className="mt-4 flex flex-wrap gap-2">{teacher.subjects.map((subject) => <Badge key={subject}>{subject}</Badge>)}</div>
      <Link className={`${buttonLink} mt-6 w-full bg-[#10233f] text-white hover:bg-[#173d5d]`} to={`/teachers/${teacher.id}`}>View profile <ArrowRight size={16} /></Link>
    </Card>
  );
}

function ClassroomCard({ classroom, teacher }) {
  return (
    <Card as="article" className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <Badge variant="warning">{classroom.subject}</Badge>
        <span className="text-xs font-bold text-slate-500">{classroom.studentCount} learners</span>
      </div>
      <h2 className="mt-5 text-xl font-black text-slate-900">{classroom.title}</h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{classroom.description}</p>
      <p className="mt-4 text-sm font-bold text-slate-700">with {teacher?.name || "StudySphere teacher"}</p>
      <div className="mt-4 flex flex-wrap gap-2">{classroom.topics.map((topic) => <Badge key={topic}>{topic}</Badge>)}</div>
      <Link className={`${buttonLink} mt-6 w-full border border-slate-300 text-slate-700 hover:bg-slate-50`} to={`/classrooms/${classroom.id}`}>Explore classroom <ArrowRight size={16} /></Link>
    </Card>
  );
}

function FilterBar({ query, setQuery, subject, setSubject, subjects, placeholder }) {
  return (
    <div className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_auto]">
      <Input id="discovery-search" label="Search" placeholder={placeholder} value={query} onChange={(event) => setQuery(event.target.value)} />
      <label className="block text-sm font-bold" htmlFor="discovery-subject">
        Subject
        <select id="discovery-subject" className="input mt-2 min-w-44" value={subject} onChange={(event) => setSubject(event.target.value)}>
          <option value="">All subjects</option>
          {subjects.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
    </div>
  );
}

export function TeacherDirectory() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const subjects = [...new Set(teachers.flatMap((teacher) => teacher.subjects))].sort();
  const results = useMemo(() => filterTeachers(teachers, query, subject), [query, subject]);
  return <DiscoveryPage eyebrow="Learn from people" title="Find your next teacher" intro="Explore experienced educators and find a teaching style that matches the way you want to learn."><FilterBar query={query} setQuery={setQuery} subject={subject} setSubject={setSubject} subjects={subjects} placeholder="Search teachers, subjects, or topics" /><div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{results.map((teacher) => <TeacherCard key={teacher.id} teacher={teacher} />)}</div>{!results.length && <EmptyState message="Try a different teacher name, headline, or subject." />}</DiscoveryPage>;
}

export function TeacherDetail() {
  const { teacherId } = useParams();
  const teacher = teachers.find((item) => item.id === teacherId);
  if (!teacher) return <DiscoveryPage eyebrow="Teacher not found" title="We couldn't find that teacher" intro="The profile may have moved or the link may be incorrect."><Link className={`${buttonLink} mt-6 bg-[#10233f] text-white`} to="/teachers"><ArrowLeft size={16} /> Back to teachers</Link></DiscoveryPage>;
  const teacherClassrooms = classrooms.filter((classroom) => teacher.classroomIds.includes(classroom.id));
  return <DiscoveryPage eyebrow="Teacher profile" title={teacher.name} intro={teacher.headline}><div className="mt-8 grid gap-6 lg:grid-cols-[.8fr_1.2fr]"><Card><div className="grid h-20 w-20 place-items-center rounded-full bg-[#10233f] text-2xl font-black text-amber-300">{teacher.avatar}</div><div className="mt-5 flex items-center gap-2"><Badge variant="success"><Star size={13} className="mr-1 fill-current" /> {teacher.rating} rating</Badge></div><p className="mt-5 leading-7 text-slate-600">{teacher.bio}</p><p className="mt-5 text-sm font-bold text-slate-700">{teacher.experience}</p><Link className={`${buttonLink} mt-6 border border-slate-300 text-slate-700`} to="/teachers"><ArrowLeft size={16} /> All teachers</Link></Card><section><h2 className="text-2xl font-black text-slate-900">Classrooms by {teacher.name}</h2>{teacherClassrooms.length ? <div className="mt-4 grid gap-5 md:grid-cols-2">{teacherClassrooms.map((classroom) => <ClassroomCard key={classroom.id} classroom={classroom} teacher={teacher} />)}</div> : <EmptyState message="This teacher has no public classrooms yet." />}</section></div></DiscoveryPage>;
}

export function ClassroomDirectory() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const subjects = [...new Set(classrooms.map((classroom) => classroom.subject))].sort();
  const results = useMemo(() => filterClassrooms(classrooms, query, subject), [query, subject]);
  return <DiscoveryPage eyebrow="Learn together" title="Discover classrooms" intro="Browse focused learning spaces led by StudySphere teachers and find a classroom for your next step."><FilterBar query={query} setQuery={setQuery} subject={subject} setSubject={setSubject} subjects={subjects} placeholder="Search classrooms, teachers, or topics" /><div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{results.map((classroom) => <ClassroomCard key={classroom.id} classroom={classroom} teacher={teachers.find((teacher) => teacher.id === classroom.teacherId)} />)}</div>{!results.length && <EmptyState message="Try a different classroom title, teacher, subject, or topic." />}</DiscoveryPage>;
}

export function ClassroomDetail() {
  const { classroomId } = useParams();
  const classroom = classrooms.find((item) => item.id === classroomId);
  if (!classroom) return <DiscoveryPage eyebrow="Classroom not found" title="We couldn't find that classroom" intro="The classroom may have moved or the link may be incorrect."><Link className={`${buttonLink} mt-6 bg-[#10233f] text-white`} to="/classrooms"><ArrowLeft size={16} /> Back to classrooms</Link></DiscoveryPage>;
  const teacher = teachers.find((item) => item.id === classroom.teacherId);
  return <DiscoveryPage eyebrow={classroom.subject} title={classroom.title} intro={classroom.description}><Card className="mt-8 max-w-3xl"><div className="flex flex-wrap items-center gap-2"><Badge variant="warning">{classroom.level}</Badge><span className="text-sm font-bold text-slate-500">{classroom.studentCount} learners</span></div><h2 className="mt-6 text-xl font-black text-slate-900">Led by <Link className="text-[#10233f] underline decoration-amber-400 decoration-2 underline-offset-4" to={`/teachers/${teacher?.id}`}>{teacher?.name || "StudySphere teacher"}</Link></h2><div className="mt-5 flex flex-wrap gap-2">{classroom.topics.map((topic) => <Badge key={topic}>{topic}</Badge>)}</div><p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">This is a public preview. Classroom joining and learning materials will be connected in a later stage.</p><Link className={`${buttonLink} mt-6 border border-slate-300 text-slate-700`} to="/classrooms"><ArrowLeft size={16} /> All classrooms</Link></Card></DiscoveryPage>;
}
