export const STORAGE_KEYS = { auth: "studySphereAuth", user: "studySphereUser", progress: "studySphereProgress" };
export function readUser() { try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || "null"); } catch { return null; } }
export function readProgress() { try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.progress) || "{}"); } catch { return {}; } }
export function isAuthenticated() { return localStorage.getItem(STORAGE_KEYS.auth) === "true"; }
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
