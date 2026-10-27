function StudentDashboard({ user }) {
  return (
    <div className="student-dashboard">
      <h1>Welcome, {user.name}!</h1>
      <p>Welcome to your Student Dashboard.</p>

      <div className="student-dashboard-card">
        <h2>My Profile</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p>
          <strong>Academic Year:</strong>{" "}
          {user.academicYear || "Not available"}
        </p>
      </div>
    </div>
  );
}

export default StudentDashboard;