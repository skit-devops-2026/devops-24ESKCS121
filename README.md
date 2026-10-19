# StudySphere

> Replace every angle-bracket placeholder below. The hygiene check in CI will
> fail until you do.

## Author

| Roll No.   | Name                    | GitHub username |
| ---------- | ----------------------- | --------------- |
| 24ESKCS121 | Dushyant Singh Sisodiya | Dushyantcoder07 |

## About

StudySphere is a full-stack Learning Management System (LMS) built on the MERN stack (MongoDB, Express.js, React, Node.js). The platform provides a modern, scalable ecosystem designed to streamline online education for students, instructors, and administrators.

## Tech stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Not implemented yet (authentication and progress are simulated with browser localStorage)
- Database: Not implemented yet

## Running locally

```bash
make install
make run
```

The frontend is served from `frontend/`. Use `npm run build` for a production
build and `npm test` for the focused unit tests. Authentication and progress
are intentionally simulated with browser localStorage because this project
does not yet have a backend.

## Live URL

[StudySphere — Live Website](https://studysphere-3vxu.onrender.com)

## Health endpoint

`GET /health` returns the running commit SHA. See `Makefile` and the milestone
sheet for why this is required.