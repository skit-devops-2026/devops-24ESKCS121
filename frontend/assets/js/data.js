window.STUDYSPHERE = {
    courses: [
        {
            id: "html", name: "HTML Fundamentals", tech: "HTML", difficulty: "Beginner",
            duration: "4 Hours", modules: 6, status: "completed", progress: 100,
            description: "Build a strong foundation in semantic HTML and accessible page structure.",
            skills: ["HTML5", "Semantics", "Accessibility"],
            lessons: [
                ["Introduction", "HTML gives every web page its structure. Learn how elements, attributes and document structure fit together.", "<h1>Hello StudySphere</h1>"],
                ["Text & Links", "Use headings, paragraphs, links and lists to organize information.", "<a href='#'>Explore StudySphere</a>"],
                ["Images & Media", "Add useful media with meaningful alternative text.", "<img src='image.jpg' alt='Course illustration'>"],
                ["Forms", "Build forms using labels, inputs and buttons.", "<label>Email <input type='email'></label>"],
                ["Semantic HTML", "Use semantic elements such as header, main, section and footer.", "<main><section>Content</section></main>"],
                ["Mini Project", "Combine the concepts into a small student profile page.", "<article><h2>Student Profile</h2></article>"]
            ]
        },
        {
            id: "css", name: "CSS Fundamentals", tech: "CSS", difficulty: "Beginner",
            duration: "6 Hours", modules: 7, status: "completed", progress: 100,
            description: "Learn styling, layout, responsive design and reusable visual patterns.",
            skills: ["CSS3", "Flexbox", "Grid", "Responsive"],
            lessons: [
                ["Selectors", "Selectors tell CSS which HTML elements should receive a style.", ".card { padding: 20px; }"],
                ["Box Model", "Understand content, padding, border and margin.", ".box { margin: 10px; padding: 20px; }"],
                ["Flexbox", "Use Flexbox for one-dimensional layouts.", ".nav { display:flex; gap:20px; }"],
                ["Grid", "CSS Grid is useful for structured two-dimensional layouts.", ".grid { display:grid; grid-template-columns:1fr 1fr; }"],
                ["Responsive Design", "Use media queries to adapt layouts to smaller screens.", "@media (max-width:600px){.card{width:100%;}}"],
                ["Components", "Create consistent cards, buttons and spacing rules.", ".btn { border-radius:8px; }"],
                ["Mini Project", "Build a responsive course landing section.", "section { max-width:1120px; margin:auto; }"]
            ]
        },
        {
            id: "js", name: "JavaScript Fundamentals", tech: "JavaScript", difficulty: "Intermediate",
            duration: "8 Hours", modules: 8, status: "in-progress", progress: 38,
            description: "Learn the JavaScript fundamentals needed to build interactive web applications.",
            skills: ["JavaScript", "DOM", "Events", "LocalStorage"],
            lessons: [
                ["Introduction", "JavaScript adds behavior and interaction to web pages.", "const course = 'JavaScript';"],
                ["Variables", "Use let and const to store values.", "const student = 'Student';\nlet progress = 38;"],
                ["Functions", "Functions package reusable logic into a named block of code.", "function add(a,b){ return a+b; }"],
                ["Arrays", "Arrays store ordered collections and provide useful methods.", "const courses = ['HTML','CSS','JavaScript'];"],
                ["Objects", "Objects group related information using key-value pairs.", "const user = { name:'Student', progress:38 };"],
                ["DOM", "The DOM lets JavaScript read and change page elements.", "document.querySelector('h1').textContent='Welcome';"],
                ["Events", "Events let an interface respond to user actions.", "button.addEventListener('click',()=>alert('Hello'));"],
                ["Mini Project", "Combine DOM, events and localStorage in a small tracker.", "localStorage.setItem('completed','true');"]
            ]
        },
        {
            id: "react", name: "React Fundamentals", tech: "React", difficulty: "Intermediate",
            duration: "12 Hours", modules: 10, status: "locked", progress: 0,
            description: "Learn components, props, state and modern React application structure.",
            skills: ["React", "Components", "Hooks"], lessons: []
        },
        {
            id: "node", name: "Node.js Fundamentals", tech: "Node.js", difficulty: "Intermediate",
            duration: "10 Hours", modules: 8, status: "locked", progress: 0,
            description: "Build server-side applications with Node.js and understand backend fundamentals.",
            skills: ["Node.js", "npm", "APIs"], lessons: []
        },
        {
            id: "mongodb", name: "MongoDB Fundamentals", tech: "MongoDB", difficulty: "Intermediate",
            duration: "8 Hours", modules: 7, status: "locked", progress: 0,
            description: "Learn document databases and the MongoDB data model.",
            skills: ["MongoDB", "CRUD", "Documents"], lessons: []
        }
    ],

    paths: [
        { id: "mern", name: "MERN Developer Path", difficulty: "Intermediate", duration: "10–12 Weeks", courses: ["html", "css", "js", "react", "node", "mongodb"] },
        { id: "frontend", name: "Frontend Developer Path", difficulty: "Beginner", duration: "7–9 Weeks", courses: ["html", "css", "js", "react"] },
        { id: "backend", name: "Backend Developer Path", difficulty: "Intermediate", duration: "6–8 Weeks", courses: ["js", "node", "mongodb"] },
        { id: "dsa", name: "DSA Path", difficulty: "Intermediate", duration: "8–10 Weeks", courses: [] }
    ],

    projects: [
        ["Portfolio Website", "Beginner", "HTML, CSS, JavaScript", "Responsive UI, DOM", "2–3 Days", "frontend"],
        ["Todo Application", "Beginner", "HTML, CSS, JavaScript", "DOM, Events, LocalStorage", "2–3 Days", "js"],
        ["Weather App", "Intermediate", "JavaScript, API", "Fetch, Async JS, UI states", "3–4 Days", "js"],
        ["Blog Application", "Intermediate", "HTML, CSS, JavaScript", "Forms, DOM, Data handling", "4–5 Days", "frontend"],
        ["Authentication System", "Intermediate", "JavaScript, Node.js", "Forms, Validation, APIs", "4–6 Days", "backend"],
        ["MERN Task Manager", "Advanced", "MongoDB, Express, React, Node.js", "CRUD, REST, Full Stack", "7–10 Days", "mern"],
        ["E-Commerce Application", "Advanced", "MERN Stack", "Architecture, CRUD, Auth", "10–14 Days", "mern"]
    ]
};
