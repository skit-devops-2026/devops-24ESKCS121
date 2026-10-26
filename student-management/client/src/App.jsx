import { useEffect, useState } from "react";
import "./App.css";
import RoleSelection from "./components/RoleSelection";

function App() {
  const [role, setRole] = useState("");
  const [apiMessage, setApiMessage] = useState("Connecting to backend...");
  const [apiStatus, setApiStatus] = useState("loading");

  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend request failed");
        }

        return response.json();
      })
      .then((data) => {
        setApiMessage(data.message);
        setApiStatus("success");
      })
      .catch(() => {
        setApiMessage("Backend connection failed. Is the server running?");
        setApiStatus("error");
      });
  }, []);

  return (
    <div>
      <h1>Student Management System</h1>
      <p>Welcome to our college portal.</p>

      <RoleSelection onSelectRole={setRole} />

      {role && <h2>Welcome, {role}!</h2>}

      <hr />

      <h2>Backend Connection</h2>
      <p role="status">{apiMessage}</p>

      {apiStatus === "success" && <p>API connected successfully!</p>}
    </div>
  );
}

export default App;
