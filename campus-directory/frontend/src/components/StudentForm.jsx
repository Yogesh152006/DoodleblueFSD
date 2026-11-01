import React, { useState, useEffect } from 'react';
import { studentApi } from '../services/api';
import { IconClose, IconAlertCircle, IconCheck } from './Icons';

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Data Science & AI',
  'Biotechnology'
];

const YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year'
];

const GENDERS = ['Male', 'Female', 'Other'];

function generateStudentId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `STU-${randomNum}`;
}

function StudentForm({ isOpen, onClose, initialData = null, onSuccess }) {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState({
    id: '',
    studentId: '',
    name: '',
    email: '',
    phone: '',
    gender: 'Male',
    dob: '',
    department: '',
    course: '',
    year: '1st Year',
    address: ''
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setFieldErrors({});
      if (initialData) {
        setFormData({
          id: initialData.id,
          studentId: initialData.studentId || initialData.id,
          name: initialData.name || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          gender: initialData.gender || 'Male',
          dob: initialData.dob || '',
          department: initialData.department || '',
          course: initialData.course || '',
          year: initialData.year || '1st Year',
          address: initialData.address || ''
        });
      } else {
        const generatedId = generateStudentId();
        setFormData({
          id: generatedId,
          studentId: generatedId,
          name: '',
          email: '',
          phone: '',
          gender: 'Male',
          dob: '',
          department: '',
          course: '',
          year: '1st Year',
          address: ''
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear specific field error on change
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }
  }

  function validate() {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s+\-()]{7,15}$/;

    if (!formData.name.trim()) {
      errors.name = 'Full Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Full Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid phone number (7-15 digits)';
    }

    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }

    if (!formData.dob) {
      errors.dob = 'Date of birth is required';
    }

    if (!formData.department.trim()) {
      errors.department = 'Department is required';
    }

    if (!formData.course.trim()) {
      errors.course = 'Course is required';
    }

    if (!formData.year) {
      errors.year = 'Year of study is required';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError('Please resolve the highlighted validation errors before submitting.');
      return;
    }

    setSaving(true);

    const payload = {
      id: formData.id,
      studentId: formData.studentId,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      gender: formData.gender,
      dob: formData.dob,
      department: formData.department.trim(),
      course: formData.course.trim(),
      year: formData.year,
      address: formData.address.trim(),
      updatedAt: new Date().toISOString()
    };

    if (!isEdit) {
      payload.createdAt = new Date().toISOString();
    }

    try {
      if (isEdit) {
        await studentApi.update(formData.id, payload);
        onSuccess('Student record updated successfully.');
      } else {
        await studentApi.create(payload);
        onSuccess('Student record added successfully.');
      }
      onClose();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={saving ? undefined : onClose}>
      <div 
        className="modal-dialog modal-dialog-large" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 className="modal-title">{isEdit ? 'Edit Student' : 'Add New Student'}</h2>
            <span className="modal-subtitle">
              {isEdit ? `Updating profile for ${formData.studentId}` : 'Complete the student registration form below'}
            </span>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            disabled={saving}
            aria-label="Close form"
          >
            <IconClose size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {error && (
              <div className="alert-banner error" style={{ marginBottom: '18px' }}>
                <div className="alert-banner-content">
                  <IconAlertCircle size={18} />
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="form-grid">
              {/* Student ID (Auto-generated) */}
              <div className="form-group">
                <label className="form-label" htmlFor="studentId">
                  Student ID <span className="form-hint">(Auto-generated)</span>
                </label>
                <input
                  id="studentId"
                  name="studentId"
                  type="text"
                  className="form-input"
                  value={formData.studentId}
                  readOnly
                  disabled
                />
              </div>

              {/* Full Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Full Name <span className="required-asterisk">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  className={`form-input ${fieldErrors.name ? 'has-error' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  disabled={saving}
                />
                {fieldErrors.name && (
                  <span className="form-error-text">
                    <IconAlertCircle size={14} /> {fieldErrors.name}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address <span className="required-asterisk">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="alex.johnson@campus.edu"
                  className={`form-input ${fieldErrors.email ? 'has-error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={saving}
                />
                {fieldErrors.email && (
                  <span className="form-error-text">
                    <IconAlertCircle size={14} /> {fieldErrors.email}
                  </span>
                )}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Phone Number <span className="required-asterisk">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="e.g. 9876543210"
                  className={`form-input ${fieldErrors.phone ? 'has-error' : ''}`}
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={saving}
                />
                {fieldErrors.phone && (
                  <span className="form-error-text">
                    <IconAlertCircle size={14} /> {fieldErrors.phone}
                  </span>
                )}
              </div>

              {/* Gender */}
              <div className="form-group">
                <label className="form-label" htmlFor="gender">
                  Gender <span className="required-asterisk">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  className={`form-select ${fieldErrors.gender ? 'has-error' : ''}`}
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={saving}
                >
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                {fieldErrors.gender && (
                  <span className="form-error-text">
                    <IconAlertCircle size={14} /> {fieldErrors.gender}
                  </span>
                )}
              </div>

              {/* Date of Birth */}
              <div className="form-group">
                <label className="form-label" htmlFor="dob">
                  Date of Birth <span className="required-asterisk">*</span>
                </label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  className={`form-input ${fieldErrors.dob ? 'has-error' : ''}`}
                  value={formData.dob}
                  onChange={handleChange}
                  disabled={saving}
                />
                {fieldErrors.dob && (
                  <span className="form-error-text">
                    <IconAlertCircle size={14} /> {fieldErrors.dob}
                  </span>
                )}
              </div>

              {/* Department */}
              <div className="form-group">
                <label className="form-label" htmlFor="department">
                  Department <span className="required-asterisk">*</span>
                </label>
                <select
                  id="department"
                  name="department"
                  className={`form-select ${fieldErrors.department ? 'has-error' : ''}`}
                  value={formData.department}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="">-- Select Department --</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {fieldErrors.department && (
                  <span className="form-error-text">
                    <IconAlertCircle size={14} /> {fieldErrors.department}
                  </span>
                )}
              </div>

              {/* Course */}
              <div className="form-group">
                <label className="form-label" htmlFor="course">
                  Course / Program <span className="required-asterisk">*</span>
                </label>
                <input
                  id="course"
                  name="course"
                  type="text"
                  placeholder="e.g. B.Tech Computer Science"
                  className={`form-input ${fieldErrors.course ? 'has-error' : ''}`}
                  value={formData.course}
                  onChange={handleChange}
                  disabled={saving}
                />
                {fieldErrors.course && (
                  <span className="form-error-text">
                    <IconAlertCircle size={14} /> {fieldErrors.course}
                  </span>
                )}
              </div>

              {/* Year of Study */}
              <div className="form-group">
                <label className="form-label" htmlFor="year">
                  Year of Study <span className="required-asterisk">*</span>
                </label>
                <select
                  id="year"
                  name="year"
                  className={`form-select ${fieldErrors.year ? 'has-error' : ''}`}
                  value={formData.year}
                  onChange={handleChange}
                  disabled={saving}
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                {fieldErrors.year && (
                  <span className="form-error-text">
                    <IconAlertCircle size={14} /> {fieldErrors.year}
                  </span>
                )}
              </div>

              {/* Address */}
              <div className="form-group col-span-2">
                <label className="form-label" htmlFor="address">
                  Address <span className="required-asterisk">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  placeholder="Enter full residential address..."
                  className={`form-textarea ${fieldErrors.address ? 'has-error' : ''}`}
                  value={formData.address}
                  onChange={handleChange}
                  disabled={saving}
                ></textarea>
                {fieldErrors.address && (
                  <span className="form-error-text">
                    <IconAlertCircle size={14} /> {fieldErrors.address}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="spinner spinner-sm" style={{ borderTopColor: '#ffffff' }}></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <IconCheck size={16} />
                  <span>{isEdit ? 'Update Student' : 'Add Student'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;

