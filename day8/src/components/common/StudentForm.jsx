import { useState } from 'react'

const emptyForm = {
  name: '',
  email: '',
  course: '',
  year: '1',
}

function StudentForm({ studentToEdit, onSave, onCancel }) {
  // Controlled inputs keep the visible form values in React state.
  const [formValues, setFormValues] = useState(() =>
    studentToEdit
      ? {
          name: studentToEdit.name,
          email: studentToEdit.email,
          course: studentToEdit.course,
          year: studentToEdit.year,
        }
      : emptyForm,
  )
//lazy initial state initialization.
  function handleChange(event) {
    const { name, value } = event.target
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    // Prevent the browser reload so React can update the list in place.
    event.preventDefault()
    onSave({
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      course: formValues.course.trim(),
      year: formValues.year,
    })
    setFormValues(emptyForm)
  }

  function handleCancel() {
    setFormValues(emptyForm)
    onCancel()
  }

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <p className="form-kicker">RECORD DETAILS</p>
      <h2>{studentToEdit ? 'Edit student' : 'Add a student'}</h2>
      <p className="form-intro">
        {studentToEdit
          ? 'Update the information below.'
          : 'Enter the student’s information below.'}
      </p>

      <div className="form-fields">
        <label className="form-field" htmlFor="student-name">
          Full name
          <input
            id="student-name"
            name="name"
            type="text"
            value={formValues.name}
            onChange={handleChange}
            placeholder="e.g. Jordan Lee"
            // autoComplete="name"
            required
            minLength={2}
          />
        </label>
        <label className="form-field" htmlFor="student-email">
          Email address
          <input
            id="student-email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="jordan@example.edu"
            // autoComplete="email"
            required
          />
        </label>
        <label className="form-field" htmlFor="student-course">
          Course
          <input
            id="student-course"
            name="course"
            type="text"
            value={formValues.course}
            onChange={handleChange}
            placeholder="e.g. Computer Science"
            required
          />
        </label>
        <label className="form-field" htmlFor="student-year">
          Year of study
          <select
            id="student-year"
            name="year"
            value={formValues.year}
            onChange={handleChange}
            required
          >
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
            <option value="5">Year 5+</option>
          </select>
        </label>
      </div>

      <div className="form-actions">
        <button className="primary-button" type="submit">
          {studentToEdit ? 'Save changes' : 'Add student'}
        </button>
        {studentToEdit && (
          <button className="secondary-button" type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default StudentForm