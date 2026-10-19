import { classrooms as seedClassrooms } from "../data/classrooms";

export const STORAGE_KEYS = {
  auth: "studySphereAuth",
  user: "studySphereUser",
  progress: "studySphereProgress",
  enrollments: "studySphereEnrollments",
  applications: "studySphereTeacherApplications",
  teacherClassrooms: "studySphereTeacherClassrooms",
};

function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

export function readUser() {
  const user = readJson(STORAGE_KEYS.user, null);
  return user && typeof user === "object" && !Array.isArray(user) ? user : null;
}
export function userRole(user = readUser()) { return user?.role === "teacher" || user?.role === "admin" ? user.role : "student"; }
export function teacherStatus(user = readUser()) {
  if (userRole(user) !== "teacher") return "not_applicable";
  return readTeacherApplications().find((application) => application.email === user.email)?.status || user?.teacherStatus || "pending";
}
export function saveUser(user) { return writeJson(STORAGE_KEYS.user, user); }
export async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
export async function authenticateUser(user, password) {
  if (!user) return false;
  if (user.passwordDigest) return user.passwordDigest === await hashPassword(password);
  if (user.password === password) {
    const migrated = { ...user, passwordDigest: await hashPassword(password) };
    delete migrated.password;
    saveUser(migrated);
    return true;
  }
  return false;
}
export function readProgress() {
  const progress = readJson(STORAGE_KEYS.progress, {});
  return progress && typeof progress === "object" && !Array.isArray(progress) ? progress : {};
}
export function isAuthenticated() { return localStorage.getItem(STORAGE_KEYS.auth) === "true"; }
export function readEnrollments() {
  const enrollments = readJson(STORAGE_KEYS.enrollments, []);
  return Array.isArray(enrollments) ? enrollments.filter((item) => item && item.classroomId && item.email) : [];
}
export function classroomsForUser(user = readUser()) {
  const email = user?.email;
  return seedClassrooms.filter((classroom) => readEnrollments().some((item) => item.email === email && item.classroomId === classroom.id));
}
export function isEnrolled(classroomId, user = readUser()) {
  return readEnrollments().some((item) => item.email === user?.email && item.classroomId === classroomId);
}
export function joinClassroom(classroomId, user = readUser()) {
  if (!user?.email || !seedClassrooms.some((classroom) => classroom.id === classroomId)) return readEnrollments();
  const enrollments = readEnrollments();
  if (!enrollments.some((item) => item.email === user.email && item.classroomId === classroomId)) {
    enrollments.push({ id: `${user.email}:${classroomId}`, email: user.email, classroomId });
  }
  return writeJson(STORAGE_KEYS.enrollments, enrollments);
}
export function readTeacherApplications() {
  const applications = readJson(STORAGE_KEYS.applications, []);
  return Array.isArray(applications) ? applications.filter((item) => item && item.email && item.id) : [];
}
export function submitTeacherApplication(user = readUser(), details = {}) {
  if (!user?.email) return null;
  const applications = readTeacherApplications();
  const existing = applications.find((application) => application.email === user.email);
  const application = {
    id: existing?.id || `application-${user.email}`,
    email: user.email,
    name: user.name || "",
    qualifications: String(details.qualifications || existing?.qualifications || "").trim(),
    status: existing?.status || "pending",
    submittedAt: existing?.submittedAt || new Date().toISOString(),
  };
  const next = existing ? applications.map((item) => item.id === application.id ? application : item) : [...applications, application];
  writeJson(STORAGE_KEYS.applications, next);
  saveUser({ ...user, role: "teacher", teacherStatus: application.status });
  return application;
}
export function decideTeacherApplication(applicationId, status) {
  if (!["approved", "rejected"].includes(status)) return null;
  const applications = readTeacherApplications();
  const application = applications.find((item) => item.id === applicationId);
  if (!application) return null;
  const updated = { ...application, status };
  writeJson(STORAGE_KEYS.applications, applications.map((item) => item.id === applicationId ? updated : item));
  const currentUser = readUser();
  if (currentUser?.email === application.email) saveUser({ ...currentUser, teacherStatus: status });
  return updated;
}
export function readTeacherClassrooms() {
  const records = readJson(STORAGE_KEYS.teacherClassrooms, []);
  return Array.isArray(records) ? records.filter((item) => item && item.id && item.teacherEmail) : [];
}
export function classroomsOwnedBy(email = readUser()?.email) {
  return readTeacherClassrooms().filter((classroom) => classroom.teacherEmail === email);
}
export function createTeacherClassroom(input, user = readUser()) {
  if (!user?.email || !input?.title?.trim()) return null;
  const classroom = {
    id: `teacher-${user.email}-${Date.now()}`,
    title: input.title.trim(),
    subject: input.subject.trim(),
    description: input.description.trim(),
    level: input.level.trim(),
    teacherEmail: user.email,
    studentCount: 0,
    topics: input.topics.split(",").map((topic) => topic.trim()).filter(Boolean),
  };
  writeJson(STORAGE_KEYS.teacherClassrooms, [...readTeacherClassrooms(), classroom]);
  return classroom;
}
export function provisionDemoAdmin(email = "admin.demo@studysphere.local") {
  if (!import.meta.env?.DEV) return null;
  return saveUser({ name: "Demo Administrator", email, role: "admin" });
}
export function saveProgress(courseId, completed, total) {
  const progress = readProgress();
  const percentage = total ? Math.round((completed / total) * 100) : 0;
  progress[courseId] = { progress: percentage, status: percentage >= 100 ? "completed" : "in-progress", completed };
  localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress));
  return progress;
}
export function pathProgress(path, courseList, progress = readProgress()) {
  if (!path.courses.length) return 0;
  return Math.round(path.courses.reduce((sum, id) => {
    const course = courseList.find((item) => item.id === id);
    const defaultProgress = id === "html" || id === "css" ? 100 : id === "js" ? 38 : 0;
    return sum + (progress[id]?.progress ?? course?.defaultProgress ?? defaultProgress);
  }, 0) / path.courses.length);
}
