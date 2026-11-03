
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { Eye, Pencil, Trash2, Plus, X } from "lucide-react";

import DataTable from "../components/common/DataTable";
import FormField from "../components/common/FormField";
import { departments } from "../data/options";
import { teacherSchema } from "../components/common/validation";
import {
  addTeacher,
  deleteTeacher,
  fetchTeachers,
  updateTeacher,
} from "../features/teachers/teacherSlice";

const blank = {
  name: "",
  email: "",
  department: "",
  subject: "",
};

export default function TeachersPage() {
  const dispatch = useDispatch();

  const { items, status, error } = useSelector(
    (s) => s.teachers
  );

  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(teacherSchema),
    defaultValues: blank,
  });

  useEffect(() => {
    if (status === "idle") dispatch(fetchTeachers());
  }, [dispatch, status]);

  const open = (mode, row = null) => {
    setSelected(row);
    setModal(mode);

    reset(
      row
        ? {
            name: row.name,
            email: row.email,
            department: row.department,
            subject: row.subject,
          }
        : blank
    );
  };

  const close = () => {
    setModal(null);
    setSelected(null);
    reset(blank);
  };

  const submit = async (values) => {
    const result = selected
      ? await dispatch(updateTeacher({ id: selected.id, ...values }))
      : await dispatch(addTeacher(values));

    if ((selected ? updateTeacher : addTeacher).fulfilled.match(result)) {
      close();
    }
  };

  const remove = (row) => {
    if (window.confirm(`Delete ${row.name}?`)) {
      dispatch(deleteTeacher(row.id));
    }
  };

  const columns = [
    { key: "name", label: "Teacher Name" },
    { key: "email", label: "Email" },
    {
      key: "department",
      label: "Department",
      render: (r) => <span className="dept-tag">{r.department}</span>,
    },
    { key: "subject", label: "Subject" },
  ];

  const toolbarExtra = (
    <button
      className="btn btn-primary add-teacher-btn"
      onClick={() => open("add")}
    >
      <Plus size={15} /> Add Teacher
    </button>
  );

  const actions = (row) => (
    <>
      <button
        className="icon-action"
        title="View"
        onClick={() => open("view", row)}
      >
        <Eye size={15} /> View
      </button>

      <button
        className="icon-action"
        title="Edit"
        onClick={() => open("edit", row)}
      >
        <Pencil size={15} /> Edit
      </button>

      <button
        className="icon-action danger"
        title="Delete"
        onClick={() => remove(row)}
      >
        <Trash2 size={15} /> Delete
      </button>
    </>
  );

  return (
    <>
      <div className="page-title-row">
        <div>
          <span className="eyebrow">TEACHER MANAGEMENT</span>

          <h1>Manage Teachers</h1>

          <p>
            View, edit, and remove teacher records. Keep track of
            departments and subjects.
          </p>
        </div>

        <div className="total-card">
          <span className="teacher-icon">♟</span>

          <div>
            <small>Total Teachers</small>
            <strong>{items.length}</strong>
          </div>
        </div>
      </div>

      <DataTable
        title="Teacher Directory"
        subtitle="Search and manage teacher details."
        rows={items}
        columns={columns}
        searchKeys={["name", "email", "department", "subject"]}
        searchPlaceholder="Search by name, email or department..."
        filters={[
          {
            key: "department",
            label: "Department",
            options: departments,
          },
        ]}
        actions={actions}
        toolbarExtra={toolbarExtra}
      />

      {status === "loading" && (
        <p className="loading-note">Loading teacher directory…</p>
      )}

      {error && (
        <p className="field-error page-error">{error}</p>
      )}

      {modal && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <section className="modal panel">
            <div className="modal-heading">
              <div>
                <span className="eyebrow">TEACHER RECORD</span>

                <h2>
                  {modal === "view"
                    ? "Teacher Details"
                    : selected
                    ? "Edit Teacher"
                    : "Add New Teacher"}
                </h2>
              </div>

              <button className="close-btn" onClick={close}>
                <X />
              </button>
            </div>

            {modal === "view" ? (
              <div className="detail-list">
                {columns.map((c) => (
                  <div key={c.key}>
                    <span>{c.label}</span>
                    <strong>{selected?.[c.key]}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit(submit)} noValidate>
                <FormField
                  label="Teacher Name"
                  error={errors.name}
                >
                  <input
                    {...register("name")}
                    placeholder="Enter teacher name"
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
                  label="Subject"
                  error={errors.subject}
                >
                  <input
                    {...register("subject")}
                    placeholder="Enter subject"
                  />
                </FormField>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={close}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : selected
                      ? "Save Changes"
                      : "Add Teacher"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
}
