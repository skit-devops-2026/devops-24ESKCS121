function RoleSelection({ onSelectRole }) {
  const roles = ["Student", "Teacher", "Admin"];

  return (
    <section>
      <h2>Choose your role</h2>

      {roles.map((role) => (
        <button key={role} onClick={() => onSelectRole(role)}>
          {role}
        </button>
      ))}
    </section>
  );
}

export default RoleSelection;
