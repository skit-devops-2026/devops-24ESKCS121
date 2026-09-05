const test = require("node:test");
const assert = require("node:assert");

global.localStorage = {
    data: {},

    getItem(key) {
        return this.data[key] ?? null;
    },

    setItem(key, value) {
        this.data[key] = String(value);
    },

    removeItem(key) {
        delete this.data[key];
    },

    clear() {
        this.data = {};
    }
};

global.window = {
    STUDYSPHERE: {
        courses: [
            {
                id: "html",
                progress: 0,
                status: "locked",
                lessons: ["a", "b", "c", "d"]
            }
        ]
    }
};

global.document = {
    createElement() {
        return {
            className: "",
            textContent: "",
            appendChild() { },
            classList: {
                add() { },
                remove() { }
            }
        };
    },

    body: {
        dataset: {}
    }
};

global.requestAnimationFrame = () => { };
global.setTimeout = () => { };
global.addEventListener = () => { };
global.scrollTo = () => { };
global.scrollY = 0;

require("../assets/js/app.js");

const StudySphere = window.StudySphere;


// Authentication
test("auth returns false when user is not logged in", () => {
    localStorage.clear();

    assert.strictEqual(StudySphere.auth(), false);
});


test("auth returns true when user is logged in", () => {
    localStorage.setItem("studySphereAuth", "true");

    assert.strictEqual(StudySphere.auth(), true);
});


// User data
test("user returns stored user data", () => {
    const user = {
        name: "Dushyant",
        email: "student@example.com"
    };

    localStorage.setItem(
        "studySphereUser",
        JSON.stringify(user)
    );

    assert.deepStrictEqual(StudySphere.user(), user);
});


// Progress
test("progress returns empty object when no progress exists", () => {
    localStorage.clear();

    assert.deepStrictEqual(
        StudySphere.progress(),
        {}
    );
});


test("progress returns stored progress", () => {
    const progress = {
        html: {
            progress: 50,
            status: "in-progress"
        }
    };

    localStorage.setItem(
        "studySphereProgress",
        JSON.stringify(progress)
    );

    assert.deepStrictEqual(
        StudySphere.progress(),
        progress
    );
});


// HTML escaping
test("esc escapes dangerous HTML characters", () => {
    const result = StudySphere.esc(
        '<script>alert("xss")</script>'
    );

    assert.strictEqual(
        result,
        "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
    );
});


// Progress saving
test("saveProgress calculates course progress correctly", () => {
    localStorage.clear();

    const course = {
        id: "html",
        lessons: ["a", "b", "c", "d"]
    };

    StudySphere.saveProgress(course, 1);

    const saved = StudySphere.progress();

    assert.strictEqual(
        saved.html.progress,
        50
    );

    assert.strictEqual(
        saved.html.status,
        "in-progress"
    );

    assert.strictEqual(
        saved.html.completed,
        2
    );
});


test("saveProgress marks course completed at 100 percent", () => {
    localStorage.clear();

    const course = {
        id: "html",
        lessons: ["a", "b"]
    };

    StudySphere.saveProgress(course, 1);

    const saved = StudySphere.progress();

    assert.strictEqual(
        saved.html.progress,
        100
    );

    assert.strictEqual(
        saved.html.status,
        "completed"
    );
});