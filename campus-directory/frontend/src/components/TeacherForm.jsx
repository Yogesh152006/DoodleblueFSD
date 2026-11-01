import React, { useState, useEffect } from 'react';
import { teacherApi } from '../services/api';
import { IconClose, IconAlertCircle, IconCheck } from './Icons';

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Data Science & AI',
  'Biotechnology',
  'Mathematics',
  'Physics'
];

const GENDERS = ['Male', 'Female', 'Other'];

function generateTeacherId() {
  const randomNum = Math.floor(2000 + Math.random() * 8000);
  return `TCH-${randomNum}`;
}

function TeacherForm({ isOpen, onClose, initialData = null, onSuccess }) {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState({
    id: '',
    teacherId: '',
    name: '',
    email: '',
    phone: '',
    gender: 'Female',
    department: '',
    subject: '',
    qualification: '',
    experience: '',
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
          teacherId: initialData.teacherId || initialData.id,
          name: initialData.name || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          gender: initialData.gender || 'Female',
          department: initialData.department || '',
          subject: initialData.subject || '',
          qualification: initialData.qualification || '',
          experience: initialData.experience !== undefined ? String(initialData.experience) : '',
          address: initialData.address || ''
        });
      } else {
        const generatedId = generateTeacherId();
        setFormData({
          id: generatedId,
          teacherId: generatedId,
          name: '',
          email: '',
          phone: '',
          gender: 'Female',
          department: '',
          subject: '',
          qualification: '',
          experience: '',
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

    if (!formData.department.trim()) {
      errors.department = 'Department is required';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!formData.qualification.trim()) {
      errors.qualification = 'Qualification is required (e.g. M.Tech, Ph.D.)';
    }

    if (formData.experience === '' || formData.experience === undefined) {
      errors.experience = 'Years of experience is required';
    } else {
      const expNum = Number(formData.experience);
      if (isNaN(expNum) || expNum < 0 || !Number.isInteger(expNum)) {
        errors.experience = 'Experience must be a positive integer (e.g. 5)';
      }
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
      teacherId: formData.teacherId,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      gender: formData.gender,
      department: formData.department.trim(),
      subject: formData.subject.trim(),
      qualification: formData.qualification.trim(),
      experience: String(Number(formData.experience)),
      address: formData.address.trim(),
      updatedAt: new Date().toISOString()
    };

    if (!isEdit) {
      payload.createdAt = new Date().toISOString();
    }

    try {
      if (isEdit) {
        await teacherApi.update(formData.id, payload);
        onSuccess('Teacher record updated successfully.');
      } else {
        await teacherApi.create(payload);
        onSuccess('Teacher record added successfully.');
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
            <h2 className="modal-title">{isEdit ? 'Edit Teacher' : 'Add New Teacher'}</h2>
            <span className="modal-subtitle">
              {isEdit ? `Updating profile for ${formData.teacherId}` : 'Complete the faculty registration form below'}
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
              {/* Teacher ID (Auto-generated) */}
              <div className="form-group">
                <label className="form-label" htmlFor="teacherId">
                  Teacher ID <span className="form-hint">(Auto-generated)</span>
                </label>
                <input
                  id="teacherId"
                  name="teacherId"
                  type="text"
                  className="form-input"
                  value={formData.teacherId}
                  readOnly
                  disabled
                />
              </div>

              {/* Full Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="teacherName">
                  Full Name <span className="required-asterisk">*</span>
                </label>
                <input
                  id="teacherName"
                  name="name"
                  type="text"
                  placeholder="e.g. Dr. Sarah Mitchell"
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
                <label className="form-label" htmlFor="teacherEmail">
                  Email Address <span className="required-asterisk">*</span>
                </label>
                <input
                  id="teacherEmail"
                  name="email"
                  type="email"
                  placeholder="sarah.mitchell@campus.edu"
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
                <label className="form-label" htmlFor="teacherPhone">
                  Phone Number <span className="required-asterisk">*</span>
                </label>
                <input
                  id="teacherPhone"
                  name="phone"
                  type="tel"
                  placeholder="e.g. 9876501234"
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
                <label className="form-label" htmlFor="teacherGender">
                  Gender <span className="required-asterisk">*</span>
                </label>
                <select
                  id="teacherGender"
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

              {/* Department */}
              <div className="form-group">
                <label className="form-label" htmlFor="teacherDepartment">
                  Department <span className="required-asterisk">*</span>
                </label>
                <select
                  id="teacherDepartment"
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

              {/* Subject */}
              <div className="form-group">
                <label className="form-label" htmlFor="teacherSubject">
                  Specialization / Subject <span className="required-asterisk">*</span>
                </label>
                <input
                  id="teacherSubject"
                  name="subject"
                  type="text"
                  placeholder="e.g. Distributed Systems & Cloud"
                  className={`form-input ${fieldErrors.subject ? 'has-error' : ''}`}
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={saving}
                />
                {fieldErrors.subject && (
                  <span className="form-error-text">
                    <IconAlertCircle size={14} /> {fieldErrors.subject}
                  </span>
                )}
              </div>

              {/* Qualification */}
              <div className="form-group">
                <label className="form-label" htmlFor="teacherQualification">
                  Qualification <span className="required-asterisk">*</span>
                </label>
                <input
                  id="teacherQualification"
                  name="qualification"
                  type="text"
                  placeholder="e.g. Ph.D. in Computer Science"
                  className={`form-input ${fieldErrors.qualification ? 'has-error' : ''}`}
                  value={formData.qualification}
                  onChange={handleChange}
                  disabled={saving}
                />
                {fieldErrors.qualification && (
                  <span className="form-error-text">
                    <IconAlertCircle size={14} /> {fieldErrors.qualification}
                  </span>
                )}
              </div>

              {/* Experience */}
              <div className="form-group">
                <label className="form-label" htmlFor="teacherExperience">
                  Experience (Years) <span className="required-asterisk">*</span>
                </label>
                <input
                  id="teacherExperience"
                  name="experience"
                  type="number"
                  min="0"
                  max="60"
                  step="1"
                  placeholder="e.g. 8"
                  className={`form-input ${fieldErrors.experience ? 'has-error' : ''}`}
                  value={formData.experience}
                  onChange={handleChange}
                  disabled={saving}
                />
                {fieldErrors.experience && (
                  <span className="form-error-text">
                    <IconAlertCircle size={14} /> {fieldErrors.experience}
                  </span>
                )}
              </div>

              {/* Address */}
              <div className="form-group col-span-2">
                <label className="form-label" htmlFor="teacherAddress">
                  Address <span className="required-asterisk">*</span>
                </label>
                <textarea
                  id="teacherAddress"
                  name="address"
                  rows="3"
                  placeholder="Enter residential or campus office address..."
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
                  <span>{isEdit ? 'Update Teacher' : 'Add Teacher'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TeacherForm;

