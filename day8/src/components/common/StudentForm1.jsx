import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherApi, jsonRequest } from '../../data/sampleapi';

function StudentForm1() {

  const navigate = useNavigate();

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    year: ''
  });

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Handle input changes
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  // Handle form submission
  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setSaving(true);

    try {
      await teacherApi(
        '',
        jsonRequest('POST', {
          name: formData.name.trim(),
          email: formData.email.trim(),
          department: formData.department.trim(),
          year: formData.year
        })
      );

      navigate('/students', {
        state: {
          message: 'Student added successfully.'
        }
      });

    } catch (requestError) {
      setError(requestError.message);

    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="form-container">

      <h2>Student Registration</h2>

      {error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}

      <form onSubmit={handleSubmit}>

        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </div>

        <div>
          <label>Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Enter department"
            required
          />
        </div>

        <div>
          <label>Year</label>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
          >
            <option value="">Select Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Add Student'}
        </button>

      </form>

    </div>
  );
}

export default StudentForm1;
