
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { UserPlus, Users } from "lucide-react";

import DataTable from "../components/common/DataTable";
import FormField from "../components/common/FormField";
import { departments, years } from "../data/options";
import { studentSchema } from "../components/common/validation";
import {
  addStudent,
  fetchStudents,
} from "../features/students/studentSlice";

export default function StudentsPage() {
  const dispatch = useDispatch();

  const { items, status, error } = useSelector(
    (s) => s.students
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(studentSchema),
    defaultValues: {
      fullName: "",
      email: "",
      department: "",
      year: "",
      cgpa: "",
    },
  });

  useEffect(() => {
    if (status === "idle") dispatch(fetchStudents());
  }, [dispatch, status]);

  const submit = async (values) => {
    const result = await dispatch(
      addStudent({
        ...values,
        cgpa: Number(values.cgpa),
      })
    );

    if (addStudent.fulfilled.match(result)) reset();
  };

  const columns = [
    { key: "fullName", label: "Student" },
    { key: "email", label: "Email" },
    { key: "department", label: "Department" },
    { key: "year", label: "Year" },
    {
      key: "cgpa",
      label: "CGPA",
      render: (r) => (
        <span className="cgpa">{r.cgpa.toFixed(1)}</span>
      ),
    },
  ];

  const toolbarExtra = (
    <button
      className="btn btn-primary add-teacher-btn"
      onClick={() => {
        document
          .getElementById("student-name-input")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

        document
          .getElementById("student-name-input")
          ?.focus();
      }}
    >
      <UserPlus size={15} /> Add Student
    </button>
  );

  return (
    <>
      <div className="page-title-row">
        <div>
          <span className="eyebrow">STUDENT DIRECTORY</span>

          <h1>Find, manage and know your students.</h1>

          <p>
            Search, filter, sort and add student records.
            Explore the complete directory.
          </p>
        </div>

        <div className="total-card">
          <Users size={24} />

          <div>
            <small>Total Students</small>
            <strong>{items.length}</strong>
          </div>
        </div>
      </div>

      <div className="student-layout">
        <aside className="panel add-panel">
          <div className="form-title">
            <UserPlus size={22} />

            <div>
              <h2>Add a New Student</h2>
              <p>
                Enter student details to add them to the directory.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(submit)} noValidate>
            <FormField
              label="Full Name"
              error={errors.fullName}
            >
              <input
                id="student-name-input"
                {...register("fullName")}
                placeholder="Enter student name"
              />
            </FormField>

            <FormField
              label="Email Address"
              error={errors.email}
            >
              <input
                type="email"
                {...register("email")}
                placeholder="Enter email address"
              />
            </FormField>

            <FormField
              label="Department"
              error={errors.department}
            >
              <select {...register("department")}>
                <option value="">Select department</option>

                {departments.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Year of Study"
              error={errors.year}
            >
              <select {...register("year")}>
                <option value="">Select year</option>

                {years.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </FormField>

            <FormField
              label="CGPA"
              error={errors.cgpa}
            >
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                {...register("cgpa")}
                placeholder="Enter CGPA (e.g. 8.5)"
              />
            </FormField>

            {error && <p className="field-error">{error}</p>}

            <button
              className="btn btn-primary full-width"
              disabled={isSubmitting}
            >
              <UserPlus size={16} />
              {isSubmitting ? "Adding..." : "Add Student"}
            </button>
          </form>
        </aside>

        <DataTable
          title="All Students"
          subtitle="Search, filter and sort student records."
          rows={items}
          columns={columns}
          searchKeys={[
            "fullName",
            "email",
            "department",
            "year",
          ]}
          searchPlaceholder="Search by name or email..."
          filters={[
            {
              key: "department",
              label: "Department",
              options: departments,
            },
            {
              key: "year",
              label: "Year",
              options: years,
            },
          ]}
          toolbarExtra={toolbarExtra}
        />
      </div>

      {status === "loading" && (
        <p className="loading-note">
          Loading student directory…
        </p>
      )}
      {status === "failed" && (
        <p className="field-error page-error">{error}</p>
      )}
    </>
  );
}
