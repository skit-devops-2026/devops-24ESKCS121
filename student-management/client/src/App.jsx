import { useEffect, useState } from "react";
import { BookOpen, GraduationCap, LogOut } from "lucide-react";
import "./App.css";
import RoleSelection from "./components/RoleSelection";
import AuthForm from "./components/AuthForm";

function App() {
  const [apiStatus, setApiStatus] = useState("loading");
  const [authPage, setAuthPage] = useState(null);
  const [session, setSession] = useState(() => {
    try {
      const token = localStorage.getItem("studySphereToken");
      const user = localStorage.getItem("studySphereUser");

      return token && user ? { token, user: JSON.parse(user) } : null;
    } catch {
      return null;
    }
  });

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

  function openLogin(role) {
    setAuthPage({ mode: "login", role });
  }

  function openRegistration(role = null) {
    setAuthPage({ mode: "register", role });
  }

  function handleAuthSuccess(data) {
    localStorage.setItem("studySphereToken", data.token);
    localStorage.setItem("studySphereUser", JSON.stringify(data.user));
    setSession({ token: data.token, user: data.user });
    setAuthPage(null);
  }

  function handleLogout() {
    localStorage.removeItem("studySphereToken");
    localStorage.removeItem("studySphereUser");
    setSession(null);
    setAuthPage(null);
  }

  function goHome() {
    setAuthPage(null);
  }

  return (
    <div className="portal">
      <header className="site-header">
        <div className="portal-container navbar">
          <button
            className="brand brand-button"
            type="button"
            onClick={goHome}
            aria-label="StudySphere home"
          >
            <span className="brand-icon">
              <GraduationCap size={25} />
            </span>
            <span>StudySphere</span>
          </button>

          {session ? (
            <button
              className="register-button"
              type="button"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Sign out
            </button>
          ) : (
            <button
              className="register-button"
              type="button"
              onClick={() => openRegistration()}
            >
              Register
            </button>
          )}
        </div>
      </header>

      <main className="landing-main">
        {session ? (
          <section className="signed-in-panel">
            <div className="auth-brand-icon">
              <GraduationCap size={28} />
            </div>
            <p className="eyebrow">STUDYSPHERE ACCOUNT</p>
            <h1>Welcome, {session.user.name}!</h1>
            <p className="intro-description">
              You are signed in as {session.user.role}.
            </p>

            {session.user.role === "Teacher" &&
              session.user.approvalStatus === "pending" && (
                <p className="auth-alert success">
                  Your account is awaiting Admin approval.
                </p>
              )}
          </section>
        ) : authPage?.mode === "register" && !authPage.role ? (
          <section className="registration-page">
            <button className="auth-back-button" type="button" onClick={goHome}>
              ← Back to home
            </button>

            <div className="registration-panel">
              <div className="auth-brand-icon">
                <GraduationCap size={28} />
              </div>

              <p className="eyebrow">JOIN STUDYSPHERE</p>
              <h1>Create your account</h1>
              <p className="section-description">
                Select the type of account you want to create.
              </p>

              <div className="registration-options">
                <button
                  type="button"
                  onClick={() => openRegistration("Student")}
                >
                  <GraduationCap size={24} />
                  <span>
                    <strong>Register as Student</strong>
                    <small>
                      Create your student account and access your academic
                      information.
                    </small>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => openRegistration("Teacher")}
                >
                  <BookOpen size={24} />
                  <span>
                    <strong>Register as Teacher</strong>
                    <small>
                      Create a teacher account. Admin approval is required.
                    </small>
                  </span>
                </button>
              </div>
            </div>
          </section>
        ) : authPage ? (
          <AuthForm
            mode={authPage.mode}
            role={authPage.role}
            onBack={() => {
              if (authPage.mode === "register") {
                openRegistration();
              } else {
                goHome();
              }
            }}
            onSuccess={handleAuthSuccess}
          />
        ) : (
          <>
            <section className="intro">
              <p className="eyebrow">STUDENT MANAGEMENT SYSTEM</p>
              <h1>Your college life, organised in one place.</h1>
              <p className="intro-description">
                StudySphere makes it easier to access academic records, manage
                student information, and support everyday college activities
                through one simple platform.
              </p>
            </section>

            <section className="access-section">
              <h2>How would you like to continue?</h2>
              <p className="section-description">
                Choose your role to access StudySphere.
              </p>

              <RoleSelection onSelectRole={openLogin} />
            </section>
          </>
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
