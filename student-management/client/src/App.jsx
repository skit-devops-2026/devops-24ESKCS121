import { useEffect, useState } from "react";
import { BookOpen, GraduationCap } from "lucide-react";
import "./App.css";
import RoleSelection from "./components/RoleSelection";

function App() {
  const [apiStatus, setApiStatus] = useState("loading");
  const [registrationOpen, setRegistrationOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend request failed");
        }
        return response.json();
      })
      .then(() => setApiStatus("success"))
      .catch(() => setApiStatus("error"));
  }, []);

  return (
    <div className="portal">
      <header className="site-header">
        <div className="portal-container navbar">
          <a className="brand" href="/" aria-label="StudySphere home">
            <span className="brand-icon">
              <GraduationCap size={25} />
            </span>
            <span>StudySphere</span>
          </a>

          <button
            className="register-button"
            type="button"
            onClick={() => setRegistrationOpen(!registrationOpen)}
          >
            Register
          </button>
        </div>
      </header>

      <main className="landing-main">
        <section className="intro">
          <p className="eyebrow">STUDENT MANAGEMENT SYSTEM</p>
          <h1>Your college life, organised in one place.</h1>
          <p className="intro-description">
            StudySphere makes it easier to access academic records, manage
            student information, and support everyday college activities through
            one simple platform.
          </p>
        </section>

        <section className="access-section">
          <h2>How would you like to continue?</h2>
          <p className="section-description">
            Choose your role to access StudySphere.
          </p>

          <RoleSelection />
        </section>

        {registrationOpen && (
          <section
            className="registration-panel"
            aria-label="Registration options"
          >
            <div>
              <h2>Create an account</h2>
              <p className="section-description">
                Choose the type of account you want to register.
              </p>
            </div>

            <div className="registration-options">
              <button
                type="button"
                onClick={() => {
                  setRegistrationOpen(false);
                  window.dispatchEvent(
                    new CustomEvent("studysphere-register", {
                      detail: { role: "Student" },
                    }),
                  );
                }}
              >
                <GraduationCap size={20} />
                Student registration
              </button>

              <button
                type="button"
                onClick={() => {
                  setRegistrationOpen(false);
                  window.dispatchEvent(
                    new CustomEvent("studysphere-register", {
                      detail: { role: "Teacher" },
                    }),
                  );
                }}
              >
                <BookOpen size={20} />
                Teacher registration
              </button>
            </div>
          </section>
        )}

        <p className="backend-status" role="status">
          <span className={`status-dot ${apiStatus}`} />
          {apiStatus === "success"
            ? "System connected"
            : apiStatus === "error"
              ? "System connection unavailable"
              : "Checking system connection"}
        </p>
      </main>

      <footer className="site-footer">
        <div className="portal-container footer-content">
          <span>StudySphere</span>
          <span>Student Management System</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
