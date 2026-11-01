
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowRight,
  Users,
  GraduationCap,
  BookOpen,
  Sparkles,
} from "lucide-react";

import { fetchStudents } from "../features/students/studentSlice";
import { fetchTeachers } from "../features/teachers/teacherSlice";
import StatCard from "../components/common/StatCard";

export default function HomePage() {
  const dispatch = useDispatch();

  const students = useSelector((s) => s.students.items);
  const teachers = useSelector((s) => s.teachers.items);

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchTeachers());
  }, [dispatch]);

  const top = [...students]
    .sort((a, b) => b.cgpa - a.cgpa)
    .slice(0, 4);

  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">CAMPUS OVERVIEW</span>

          <h1>
            One place to manage
            <br />
            <em>your campus community.</em>
          </h1>

          <p>
            Explore student performance, maintain teacher records and keep
            your academic directory organized.
          </p>

          <div className="hero-actions">
            <Link className="btn btn-primary" to="/students">
              Explore Students <ArrowRight size={16} />
            </Link>

            <Link className="btn btn-outline" to="/teachers">
              Manage Teachers
            </Link>
          </div>
        </div>

        <div className="hero-art">
          <div className="art-circle">
            <GraduationCap size={90} />
          </div>

          <span className="art-tag">
            <Sparkles size={15} /> Campus at a glance
          </span>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard
          type="students"
          label="Total Students"
          value={students.length}
          caption="Registered learners"
        />

        <StatCard
          type="teachers"
          label="Total Teachers"
          value={teachers.length}
          caption="Faculty members"
        />

        <StatCard
          type="performers"
          label="Top Performers"
          value={students.filter((s) => s.cgpa >= 8).length}
          caption="CGPA 8.0 and above"
        />

        <StatCard
          type="departments"
          label="Departments"
          value={
            new Set([
              ...students.map((s) => s.department),
              ...teachers.map((t) => t.department),
            ]).size
          }
          caption="Across campus"
        />
      </section>

      <section className="panel home-bottom">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ACADEMIC HIGHLIGHTS</span>

            <h2>Top student performers</h2>

            <p>Students with the strongest CGPA scores.</p>
          </div>

          <Link to="/students" className="text-link">
            View directory <ArrowRight size={15} />
          </Link>
        </div>

        <div className="performer-grid">
          {top.map((s, i) => (
            <article className="performer-card" key={s.id}>
              <div className="avatar">
                {s.fullName
                  .split(" ")
                  .map((x) => x[0])
                  .slice(0, 2)
                  .join("")}
              </div>

              <div>
                <strong>{s.fullName}</strong>

                <small>
                  {s.department} · {s.year}
                </small>

                <span className="cgpa">
                  CGPA&nbsp; {s.cgpa.toFixed(1)}
                </span>
              </div>

              <b>0{i + 1}</b>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
