
import {
  Users,
  GraduationCap,
  Award,
  BookOpen,
} from "lucide-react";

const icons = {
  students: Users,
  teachers: GraduationCap,
  performers: Award,
  departments: BookOpen,
};

export default function StatCard({
  label,
  value,
  type,
  caption,
}) {
  const Icon = icons[type] || Users;

  return (
    <div className="stat-card">
      <span className="stat-icon">
        <Icon size={21} />
      </span>

      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <small>{caption}</small>
      </div>
    </div>
  );
}
