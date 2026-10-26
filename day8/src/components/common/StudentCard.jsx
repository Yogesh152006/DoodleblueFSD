function StudentCard({ student, onEdit, onDelete }) {
  // Props provide this reusable card with one record and its parent actions.
  const initials = student.name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <article className="student-card">
      <div className="student-avatar" aria-hidden="true">{initials}</div>
      <div className="student-info">
        <h3>{student.name}</h3>
        <a className="student-email" href={`mailto:${student.email}`}>
          {student.email}
        </a>
        <div className="student-meta">
          <span className="meta-tag">{student.course}</span>
          <span className="meta-tag">Year {student.year}</span>
        </div>
      </div>
      <div className="student-actions">
        <button
          className="icon-button"
          type="button"
          onClick={() => onEdit(student)}
          // aria-label={`Edit ${student.name}`}
        >
          Edit
        </button>
        <button
          className="icon-button delete"
          type="button"
          onClick={() => onDelete(student.id)}
          // aria-label={`Delete ${student.name}`}
        >
          Delete
        </button>
      </div>
    </article>
  )
}

export default StudentCard