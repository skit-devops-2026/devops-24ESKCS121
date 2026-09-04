(function () {
    const S = window.STUDYSPHERE;
    const progressKey = "studySphereProgress";
    function auth() { return localStorage.getItem("studySphereAuth") === "true" }
    function user() { return JSON.parse(localStorage.getItem("studySphereUser") || "null") }
    function progress() { return JSON.parse(localStorage.getItem(progressKey) || "{}") }
    function sync() {
        const p = progress();
        S.courses.forEach(c => {
            if (p[c.id]) {
                c.progress = p[c.id].progress;
                c.status = p[c.id].status;
            }
        });
    }
    function esc(v) { return String(v).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m])) }
    function toast(text) {
        const t = document.createElement("div"); t.className = "toast"; t.textContent = text; document.body.appendChild(t);
        requestAnimationFrame(() => t.classList.add("show"));
        setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 250) }, 2200);
    }
    function guard() {
        if (!auth()) { window.location.href = "login.html"; return false }
        return true;
    }
    function saveProgress(course, index) {
        const total = course.lessons.length || course.modules;
        const completed = index + 1;
        const pct = Math.round(completed / total * 100);
        const p = progress();
        p[course.id] = { progress: pct, status: pct >= 100 ? "completed" : "in-progress", completed };
        localStorage.setItem(progressKey, JSON.stringify(p));
        sync();
    }
    function pathPct(path) {
        if (!path.courses.length) return 0;
        sync();
        return Math.round(path.courses.map(id => S.courses.find(c => c.id === id)?.progress || 0).reduce((a, b) => a + b, 0) / path.courses.length);
    }
    function publicNav() {
        return `<nav class="public-nav" id="publicNav"><div class="container nav-inner">
<a class="logo" href="index.html">Study<span>Sphere</span></a>
<button class="menu-toggle" onclick="document.getElementById('publicNav').classList.toggle('open')">☰</button>
<div class="nav-links"><a href="index.html">Home</a><a href="index.html#about">About</a><a href="index.html#contact">Contact</a></div>
<div class="nav-actions"><a class="btn btn-outline btn-small" href="login.html">Login</a><a class="btn btn-gold btn-small" href="register.html">Get Started</a></div>
</div></nav>`;
    }
    function studentNav(active) {
        return `<header class="student-header" id="studentHeader"><div class="container student-inner">
<a class="logo" style="color:white" href="dashboard.html">Study<span>Sphere</span></a>
<button class="menu-toggle" style="color:white" onclick="document.getElementById('studentHeader').classList.toggle('open')">☰</button>
<nav class="student-links">
<a class="${active === "dashboard" ? "active" : ""}" href="dashboard.html">Dashboard</a>
<a class="${active === "courses" ? "active" : ""}" href="courses.html">Courses</a>
<a class="${active === "paths" ? "active" : ""}" href="learning-paths.html">Learning Paths</a>
<a class="${active === "learning" ? "active" : ""}" href="my-learning.html">My Learning</a>
<a class="${active === "projects" ? "active" : ""}" href="projects.html">Projects</a>
<a class="${active === "profile" ? "active" : ""} profile-link" href="profile.html">Profile</a>
<a href="#" onclick="logout();return false">Logout</a>
</nav></div></header>`;
    }
    function logout() { localStorage.setItem("studySphereAuth", "false"); window.location.href = "index.html" }
    window.logout = logout; window.toast = toast;

    function backTop() {
        const b = document.createElement("button"); b.className = "back-top"; b.textContent = "↑"; b.title = "Back to top";
        b.onclick = () => scrollTo({ top: 0, behavior: "smooth" }); document.body.appendChild(b);
        addEventListener("scroll", () => b.classList.toggle("show", scrollY > 500));
    }
    function footer() {
        return `<footer><div class="container footer-flex"><div><div class="logo footer-logo">Study<span>Sphere</span></div><p>Structured learning, visible progress and a clear next step.</p></div><p>© 2026 StudySphere · Student project</p></div></footer>`;
    }

    window.StudySphere = { S, auth, user, progress, sync, esc, toast, guard, saveProgress, pathPct, publicNav, studentNav, footer, backTop };

    addEventListener("DOMContentLoaded", () => {
        if (document.body.dataset.protected === "true" && !guard()) return;
        sync();
        backTop();
    });
})();
