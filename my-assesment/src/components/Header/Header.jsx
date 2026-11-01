
import { NavLink } from "react-router-dom";
import { GraduationCap, UserRound } from "lucide-react";

export default function Header() {
  return (
    <header className="site-header">
      <div className="brand">
        <span className="brand-mark">
          <GraduationCap size={20} />
        </span>

        <span>CAMPUS DIRECTORY</span>
      </div>

      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/students">Students</NavLink>
        <NavLink to="/teachers">Teachers</NavLink>
      </nav>

      <UserRound className="header-user" size={20} />
    </header>
  );
}
