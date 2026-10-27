import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, GraduationCap } from "lucide-react";

const API_URL = "http://localhost:5000/api/auth";

function AuthForm({ mode, role, onBack, onSuccess }) {
  const isRegister = mode === "register";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    college: "",
    mobile: "",
    email: "",
    username: "",
    password: "",
    academicYear: "",
    department: "",
    designation: "",
  });

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const endpoint = isRegister ? "/register" : "/login";

      const payload = isRegister
        ? {
            name: form.name.trim(),
            college: form.college.trim(),
            mobile: form.mobile.trim(),
            email: form.email.trim(),
            username: form.username.trim(),
            password: form.password,
            role,
            ...(role === "Student"
              ? { academicYear: form.academicYear }
              : {
                  department: form.department.trim(),
                  designation: form.designation.trim(),
                }),
          }
        : {
            username: form.username.trim(),
            password: form.password,
          };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "The request could not be completed.");
      }

      if (isRegister && role === "Teacher") {
        setMessage(
          data.message ||
            "Registration submitted. Please wait for Admin approval.",
        );
        return;
      }

      if (data.token && data.user) {
        onSuccess(data);
      } else {
        setMessage(data.message || "Request completed successfully.");
      }
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to connect to the server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <button className="auth-back-button" type="button" onClick={onBack}>
        <ArrowLeft size={17} />
        Back to home
      </button>

      <div className="auth-card">
        <div className="auth-brand-icon">
          <GraduationCap size={28} />
        </div>

        <p className="eyebrow">STUDYSPHERE ACCOUNT</p>

        <h1>{isRegister ? `${role} registration` : `${role} login`}</h1>

        <p className="auth-description">
          {isRegister
            ? "Enter your details to create your account."
            : "Sign in with your registered username and password."}
        </p>

        {error && (
          <p className="auth-alert error" role="alert">
            {error}
          </p>
        )}

        {message && (
          <p className="auth-alert success" role="status">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={updateField}
                autoComplete="name"
                required
              />

              <label htmlFor="college">College name</label>
              <input
                id="college"
                name="college"
                value={form.college}
                onChange={updateField}
                required
              />

              <label htmlFor="mobile">Mobile number</label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                value={form.mobile}
                onChange={updateField}
                autoComplete="tel"
                required
              />

              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                autoComplete="email"
                required
              />
            </>
          )}

          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={updateField}
            autoComplete="username"
            required
          />

          {isRegister && role === "Student" && (
            <>
              <label htmlFor="academicYear">Academic year</label>
              <input
                id="academicYear"
                name="academicYear"
                value={form.academicYear}
                onChange={updateField}
                placeholder="e.g. 2nd Year"
                required
              />
            </>
          )}

          {isRegister && role === "Teacher" && (
            <>
              <label htmlFor="department">Department</label>
              <input
                id="department"
                name="department"
                value={form.department}
                onChange={updateField}
                placeholder="e.g. Computer Science"
                required
              />

              <label htmlFor="designation">Designation</label>
              <input
                id="designation"
                name="designation"
                value={form.designation}
                onChange={updateField}
                placeholder="e.g. Assistant Professor"
                required
              />
            </>
          )}

          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={updateField}
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength={isRegister ? 8 : undefined}
              required
            />

            <button
              className="password-toggle"
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            className="auth-submit-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create account"
                : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AuthForm;
