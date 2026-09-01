if (StudySphere.auth()) {
    StudySphere.sync();

    const u = StudySphere.user() || { name: "Student" };

    const active =
        STUDYSPHERE.courses.find(c => c.status === "in-progress") ||
        STUDYSPHERE.courses[2];

    const next = STUDYSPHERE.courses.find(c => c.status === "locked");

    document.getElementById("app").innerHTML =
        StudySphere.studentNav("dashboard") +
        `
        <main class="page">
            <div class="container">

                <div class="welcome">
                    <p>StudySphere Student Area</p>

                    <h1>
                        Welcome back,
                        ${StudySphere.esc(u.name || "Student")}!
                    </h1>

                    <p>
                        Keep moving through your learning path.
                        Your next step is ready.
                    </p>

                    <div class="metrics">
                        <div class="metric">
                            Overall Progress
                            <strong>${active.progress}%</strong>
                        </div>

                        <div class="metric">
                            Current Path
                            <strong>MERN</strong>
                        </div>

                        <div class="metric">
                            Current Course
                            <strong>${active.name}</strong>
                        </div>
                    </div>
                </div>

                <div class="dashboard-grid dashboard-section">

                    <section class="info-card">
                        <h2 style="color:var(--navy)">
                            Continue Learning
                        </h2>

                        <p class="muted">
                            ${active.name}
                        </p>

                        <div
                            class="progress"
                            style="margin:15px 0"
                        >
                            <span style="width:${active.progress}%"></span>
                        </div>

                        <div class="course-footer">
                            <span>
                                ${active.progress}% complete
                            </span>

                            <a
                                class="btn btn-primary btn-small"
                                href="learning.html?course=${active.id}"
                            >
                                Continue Learning
                            </a>
                        </div>
                    </section>

                    <section class="info-card">
                        <h2 style="color:var(--navy)">
                            Next Recommended
                        </h2>

                        <h3>
                            ${next ? next.name : "All courses available"}
                        </h3>

                        <p class="muted">
                            ${next
            ? "Locked until the current course is completed."
            : "Keep exploring your learning paths."
        }
                        </p>
                    </section>

                </div>

                <div class="two dashboard-section">

                    <section class="info-card">
                        <h2 style="color:var(--navy)">
                            Learning Progress
                        </h2>

                        <div class="list">

                            <div class="list-row">
                                <span>Completed courses</span>
                                <strong>
                                    ${STUDYSPHERE.courses.filter(
            c => c.status === "completed"
        ).length
        }
                                </strong>
                            </div>

                            <div class="list-row">
                                <span>Courses in progress</span>
                                <strong>
                                    ${STUDYSPHERE.courses.filter(
            c => c.status === "in-progress"
        ).length
        }
                                </strong>
                            </div>

                            <div class="list-row">
                                <span>Locked courses</span>
                                <strong>
                                    ${STUDYSPHERE.courses.filter(
            c => c.status === "locked"
        ).length
        }
                                </strong>
                            </div>

                        </div>
                    </section>

                    <section class="info-card">
                        <h2 style="color:var(--navy)">
                            Recent Activity
                        </h2>

                        <div class="list">

                            <div class="list-row">
                                <span>
                                    Completed HTML Fundamentals
                                </span>
                                <span class="muted">
                                    Recent
                                </span>
                            </div>

                            <div class="list-row">
                                <span>
                                    Started CSS Fundamentals
                                </span>
                                <span class="muted">
                                    Recent
                                </span>
                            </div>

                            <div class="list-row">
                                <span>
                                    Completed CSS Module 4
                                </span>
                                <span class="muted">
                                    Recent
                                </span>
                            </div>

                        </div>
                    </section>

                </div>

                <section class="info-card dashboard-section">

                    <div class="course-footer">
                        <h2 style="color:var(--navy)">
                            My Learning Paths
                        </h2>

                        <a
                            class="btn btn-outline btn-small"
                            href="learning-paths.html"
                        >
                            View all
                        </a>
                    </div>

                    <div
                        class="course-grid"
                        style="margin-top:18px"
                    >
                        ${STUDYSPHERE.paths
            .slice(0, 3)
            .map(
                p => `
                                <article class="course-card">
                                    <h3>${p.name}</h3>

                                    <p>
                                        ${p.difficulty}
                                        · ${p.courses.length} courses
                                        · ${p.duration}
                                    </p>

                                    <a
                                        class="btn btn-primary btn-small"
                                        style="margin-top:14px"
                                        href="path-details.html?path=${p.id}"
                                    >
                                        Open Path
                                    </a>
                                </article>
                            `
            )
            .join("")}
                    </div>

                </section>

            </div>
        </main>
        `;
}
