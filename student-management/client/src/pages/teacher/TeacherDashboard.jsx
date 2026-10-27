
function TeacherDashboard({ user }) {
  return (
    <div className="teacher-dashboard">
      <p className="eyebrow">TEACHER PORTAL</p>

      <h1>Welcome, {user.name}!</h1>

      <p>
        Manage your academic activities through StudySphere.
      </p>

      <div className="teacher-dashboard-card">
        <h2>My Profile</h2>

        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p>
          <strong>Account Status:</strong>{" "}
          {user.approvalStatus || "Not available"}
        </p>
      </div>

      <div className="teacher-dashboard-card">
        <h2>Student Management</h2>
        <p>Student management features are coming next.</p>
      </div>
    </div>
  );
}

export default TeacherDashboard;
