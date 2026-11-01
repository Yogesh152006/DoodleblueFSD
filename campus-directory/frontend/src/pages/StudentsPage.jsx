import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { studentApi } from '../services/api';
import Loading from '../components/Loading';
import StudentForm from '../components/StudentForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { 
  IconUsers, 
  IconPlus, 
  IconSearch, 
  IconFilter, 
  IconEye, 
  IconEdit, 
  IconTrash, 
  IconRefresh, 
  IconAlertCircle, 
  IconClose,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconGraduationCap,
  IconBuilding,
  IconBook
} from '../components/Icons';
import '../styles/Students.css';

function StudentsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(location.state?.message || null);

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function fetchStudents() {
    setLoading(true);
    setError(null);
    try {
      const data = await studentApi.getAll();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load students from JSON Server.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
    // Check if navigated with state message
    if (location.state?.message) {
      setNotification(location.state.message);
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleFormSuccess(message) {
    setNotification(message);
    fetchStudents();
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  }

  async function handleDeleteConfirm() {
    if (!deletingStudent) return;
    setIsDeleting(true);
    try {
      await studentApi.delete(deletingStudent.id);
      setDeletingStudent(null);
      setNotification(`Student ${deletingStudent.name} (${deletingStudent.studentId || deletingStudent.id}) was successfully deleted.`);
      await fetchStudents();
    } catch (err) {
      setError(`Failed to delete student: ${err.message}`);
    } finally {
      setIsDeleting(false);
      setTimeout(() => setNotification(null), 4000);
    }
  }

  // Derive unique departments from existing records
  const departmentOptions = useMemo(() => {
    const set = new Set();
    students.forEach((s) => {
      if (s.department && s.department.trim()) set.add(s.department.trim());
    });
    return Array.from(set).sort();
  }, [students]);

  // Filter and search computation
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        !searchTerm.trim() ||
        (student.name && student.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.studentId && student.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.id && String(student.id).toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.course && student.course.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDept = !departmentFilter || student.department === departmentFilter;
      const matchesYear = !yearFilter || student.year === yearFilter;

      return matchesSearch && matchesDept && matchesYear;
    });
  }, [students, searchTerm, departmentFilter, yearFilter]);

  function handleOpenAdd() {
    setEditingStudent(null);
    setIsFormOpen(true);
  }

  function handleOpenEdit(student) {
    setEditingStudent(student);
    setIsFormOpen(true);
  }

  return (
    <div className="directory-page-container">
      {/* Toast Notification */}
      {notification && (
        <div className="toast-container">
          <div className="toast toast-success">
            <span>{notification}</span>
            <button className="toast-close" onClick={() => setNotification(null)}>&times;</button>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="alert-banner error">
          <div className="alert-banner-content">
            <IconAlertCircle size={22} />
            <div>
              <strong>Error: </strong>
              <span>{error}</span>
            </div>
          </div>
          <button className="btn btn-secondary" onClick={fetchStudents}>
            <IconRefresh size={16} />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <div className="breadcrumb">
            <span>Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Students</span>
          </div>
          <h1 className="page-title">Student Directory</h1>
          <p className="page-subtitle">Manage all student profiles, enrollments, and academic details</p>
        </div>

        <div className="page-actions">
          <button className="btn btn-secondary" onClick={fetchStudents} title="Reload student data">
            <IconRefresh size={16} />
            <span>Refresh</span>
          </button>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <IconPlus size={18} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-toolbar">
        <div className="search-input-wrapper">
          <IconSearch size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, student ID, course or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconFilter size={16} style={{ color: 'var(--muted)' }} />
            <select
              className="select-filter"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {departmentOptions.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <select
            className="select-filter"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="">All Years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>

          {(searchTerm || departmentFilter || yearFilter) && (
            <button
              className="btn btn-secondary"
              style={{ padding: '8px 12px', fontSize: '0.82rem' }}
              onClick={() => {
                setSearchTerm('');
                setDepartmentFilter('');
                setYearFilter('');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <span>
          Showing <span className="highlight-count">{filteredStudents.length}</span> of{' '}
          <span className="highlight-count">{students.length}</span> students
        </span>
        {departmentFilter && <span>Filtered by Department: <strong>{departmentFilter}</strong></span>}
      </div>

      {/* Main Table Card */}
      <div className="table-card">
        {loading ? (
          <Loading message="Fetching student records from JSON Server..." />
        ) : filteredStudents.length === 0 ? (
          <div className="empty-state">
            <IconUsers size={40} className="empty-state-icon" />
            <p className="empty-state-title">
              {students.length === 0 ? 'No Students in Database' : 'No Students Match Your Criteria'}
            </p>
            <p className="empty-state-text">
              {students.length === 0
                ? 'Your directory is currently empty. Click "Add Student" to create persistent records in JSON Server.'
                : 'Try adjusting your search terms or clearing the selected department/year filters.'}
            </p>
            {students.length === 0 ? (
              <button className="btn btn-primary" onClick={handleOpenAdd} style={{ marginTop: '12px' }}>
                <IconPlus size={16} /> Add First Student
              </button>
            ) : (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSearchTerm('');
                  setDepartmentFilter('');
                  setYearFilter('');
                }}
                style={{ marginTop: '12px' }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="directory-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Info</th>
                  <th>Department</th>
                  <th>Course</th>
                  <th>Year</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <span className="student-id-badge">{student.studentId || student.id}</span>
                    </td>
                    <td>
                      <div className="profile-cell">
                        <div className="cell-avatar">
                          {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div className="cell-info">
                          <span className="cell-name">{student.name}</span>
                          <span className="cell-sub">{student.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{student.department}</td>
                    <td>{student.course}</td>
                    <td>
                      <span className="badge badge-blue">{student.year}</span>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{student.phone}</td>
                    <td>
                      <div className="actions-cell">
                        <button
                          type="button"
                          className="btn-icon action-btn-view"
                          title="View Full Student Details"
                          onClick={() => setViewingStudent(student)}
                        >
                          <IconEye size={17} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon action-btn-edit"
                          title="Edit Student Record"
                          onClick={() => handleOpenEdit(student)}
                        >
                          <IconEdit size={17} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon action-btn-delete"
                          title="Delete Student Record"
                          onClick={() => setDeletingStudent(student)}
                        >
                          <IconTrash size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Student Modal */}
      <StudentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingStudent}
        onSuccess={handleFormSuccess}
      />

      {/* View Details Modal */}
      {viewingStudent && (
        <div className="modal-overlay" onClick={() => setViewingStudent(null)}>
          <div 
            className="modal-dialog" 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <div className="modal-title-group">
                <h2 className="modal-title">Student Profile</h2>
                <span className="modal-subtitle">Full academic & personal details</span>
              </div>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setViewingStudent(null)}
              >
                <IconClose size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-view-card">
                <div className="detail-view-header">
                  <div className="detail-large-avatar">
                    {viewingStudent.name ? viewingStudent.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div className="detail-header-info">
                    <h3 className="detail-name">{viewingStudent.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="student-id-badge">{viewingStudent.studentId || viewingStudent.id}</span>
                      <span className="badge badge-blue">{viewingStudent.year}</span>
                      <span className="badge badge-slate">{viewingStudent.gender}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Email Address</span>
                    <span className="detail-value">
                      <IconMail size={16} style={{ color: 'var(--primary)' }} />
                      {viewingStudent.email}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Phone Number</span>
                    <span className="detail-value">
                      <IconPhone size={16} style={{ color: 'var(--primary)' }} />
                      {viewingStudent.phone}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Department</span>
                    <span className="detail-value">
                      <IconBuilding size={16} style={{ color: 'var(--primary)' }} />
                      {viewingStudent.department}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Degree Course</span>
                    <span className="detail-value">
                      <IconBook size={16} style={{ color: 'var(--primary)' }} />
                      {viewingStudent.course}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Date of Birth</span>
                    <span className="detail-value">
                      <IconCalendar size={16} style={{ color: 'var(--primary)' }} />
                      {viewingStudent.dob || 'Not provided'}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Year of Study</span>
                    <span className="detail-value">
                      <IconGraduationCap size={16} style={{ color: 'var(--primary)' }} />
                      {viewingStudent.year}
                    </span>
                  </div>

                  <div className="detail-item" style={{ gridColumn: 'span 2' }}>
                    <span className="detail-label">Residential Address</span>
                    <span className="detail-value">
                      <IconMapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                      {viewingStudent.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setViewingStudent(null)}
              >
                Close
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => {
                  const toEdit = viewingStudent;
                  setViewingStudent(null);
                  handleOpenEdit(toEdit);
                }}
              >
                <IconEdit size={16} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingStudent)}
        title="Delete Student Record"
        message="Are you sure you want to permanently delete this student record from JSON Server?"
        itemDetails={
          deletingStudent && (
            <div>
              <strong>{deletingStudent.name}</strong> ({deletingStudent.studentId || deletingStudent.id})<br />
              <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                {deletingStudent.department} &bull; {deletingStudent.course}
              </span>
            </div>
          )
        }
        confirmText="Confirm Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingStudent(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default StudentsPage;

