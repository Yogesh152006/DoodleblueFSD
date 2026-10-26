import { useState } from 'react';
import StudentCard from '../components/common/StudentCard.jsx'
import StudentForm from '../components/common/StudentForm.jsx'
import Header from "../components/header/Header.jsx";
import Footer from "../components/footer/Footer.jsx";

import initialStudents from '../data/students.js'

function StudentManagementPage() {
  // State holds the current records; updating it tells React to render again.
  const [students, setStudents] = useState(initialStudents)
  const [studentBeingEdited, setStudentBeingEdited] = useState(null)

  function handleSaveStudent(studentDetails) {
    if (studentBeingEdited) {
      setStudents((currentStudents) =>
        currentStudents.map((student) =>
          student.id === studentBeingEdited.id
            ? { ...student, ...studentDetails }
            : student,
        ),
      )
      setStudentBeingEdited(null)
      return
    }

    const newStudent = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      ...studentDetails,
    }
    setStudents((currentStudents) => [...currentStudents, newStudent])
  }

  function handleEditStudent(student) {
    setStudentBeingEdited(student)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEdit() {
    setStudentBeingEdited(null)
  }

  function handleDeleteStudent(studentId) {
    setStudents((currentStudents) =>
      currentStudents.filter((student) => student.id !== studentId),
    )

    if (studentBeingEdited?.id === studentId) {
      setStudentBeingEdited(null)
    }
  }

  return (
    <div className="portal">
      <Header studentCount={students.length} />

      <main className="portal-main">
        <section className="page-intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">ACADEMIC SERVICES / DIRECTORY</p>
            <h1 id="page-title">Student Management Portal</h1>
            <p className="page-description">
              Keep student records organized and up to date.
            </p>
          </div>
          <div className="total-badge" aria-live="polite">
            <span className="total-number">{students.length}</span>
            <span>{students.length === 1 ? 'student' : 'students'}</span>
          </div>
        </section>

        <div className="portal-layout">
          <section className="directory" aria-labelledby="directory-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">DIRECTORY</p>
                <h2 id="directory-title">Student records</h2>
              </div>
              <span className="record-count">{students.length} total</span>
            </div>

            {students.length === 0 ? (
              <div className="empty-state" role="status">
                <span className="empty-mark" aria-hidden="true">+</span>
                <h3>No student records yet</h3>
                <p>Add a student using the form to start your directory.</p>
              </div>
            ) : (
              <div className="student-list">
                {students.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    onEdit={handleEditStudent}
                    onDelete={handleDeleteStudent}
                  />
                ))}
              </div>
            )}
          </section>

          <aside className="form-column">
            {/* Callback props let the child form ask this page to change its data. */}
            <StudentForm
              key={studentBeingEdited?.id ?? 'new-student'}
              studentToEdit={studentBeingEdited}
              onSave={handleSaveStudent}
              onCancel={handleCancelEdit}
            />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default StudentManagementPage

