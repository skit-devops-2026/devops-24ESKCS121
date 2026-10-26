import { ArrowRight, BookOpen, GraduationCap, ShieldCheck } from "lucide-react";

const roles = [
  {
    name: "Student",
    description: "Access your academic records and student services.",
    icon: GraduationCap,
  },
  {
    name: "Teacher",
    description: "Manage student information and academic records.",
    icon: BookOpen,
  },
  {
    name: "Admin",
    description: "Manage accounts and college administration.",
    icon: ShieldCheck,
  },
];

function RoleSelection({ onSelectRole }) {
  return (
    <div className="role-grid">
      {roles.map(({ name, description, icon: Icon }) => (
        <button
          className="role-card"
          key={name}
          type="button"
          onClick={() => onSelectRole?.(name)}
        >
          <span className="role-card-icon">
            <Icon size={26} strokeWidth={1.7} aria-hidden="true" />
          </span>

          <span className="role-card-title">{name}</span>

          <span className="role-card-description">{description}</span>

          <span className="role-card-action">
            Continue
            <ArrowRight size={16} aria-hidden="true" />
          </span>
        </button>
      ))}
    </div>
  );
}

export default RoleSelection;
