import { useState } from "react";
import "./App.css";

function App() {
  const [role, setRole] = useState("");

  return (
    <div>
      <h1>Student Management System</h1>
      <p>Welcome to our college portal.</p>

      <h2>Choose your role</h2>

      <button onClick={() => setRole("Student")}>Student</button>

      <button onClick={() => setRole("Teacher")}>Teacher</button>

      <button onClick={() => setRole("Admin")}>Admin</button>

      {role && <h2>Welcome, {role}!</h2>}
    </div>
  );
}

export default App;
