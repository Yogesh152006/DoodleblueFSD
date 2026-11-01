import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { teacherApi } from '../services/api';
import Loading from '../components/Loading';
import TeacherForm from '../components/TeacherForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { 
  IconBriefcase, 
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
  IconAward,
  IconClock,
  IconBuilding,
  IconBook
} from '../components/Icons';
import '../styles/Students.css';
import '../styles/Teachers.css';

function TeachersPage() {
  const location = useLocation();

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(location.state?.message || null);

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [viewingTeacher, setViewingTeacher] = useState(null);
  const [deletingTeacher, setDeletingTeacher] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function fetchTeachers() {
    setLoading(true);
    setError(null);
    try {
      const data = await teacherApi.getAll();
      setTeachers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load teachers from JSON Server.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTeachers();
    if (location.state?.message) {
      setNotification(location.state.message);
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleFormSuccess(message) {
    setNotification(message);
    fetchTeachers();
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  }

  async function handleDeleteConfirm() {
    if (!deletingTeacher) return;
    setIsDeleting(true);
    try {
      await teacherApi.delete(deletingTeacher.id);
      setDeletingTeacher(null);
      setNotification(`Teacher ${deletingTeacher.name} (${deletingTeacher.teacherId || deletingTeacher.id}) was successfully deleted.`);
      await fetchTeachers();
    } catch (err) {
      setError(`Failed to delete teacher: ${err.message}`);
    } finally {
      setIsDeleting(false);
      setTimeout(() => setNotification(null), 4000);
    }
  }

  // Derive unique departments from existing records
  const departmentOptions = useMemo(() => {
    const set = new Set();
    teachers.forEach((t) => {
      if (t.department && t.department.trim()) set.add(t.department.trim());
    });
    return Array.from(set).sort();
  }, [teachers]);

  // Filter and search
  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const matchesSearch =
        !searchTerm.trim() ||
        (teacher.name && teacher.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (teacher.teacherId && teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (teacher.id && String(teacher.id).toLowerCase().includes(searchTerm.toLowerCase())) ||
        (teacher.email && teacher.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (teacher.subject && teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDept = !departmentFilter || teacher.department === departmentFilter;

      return matchesSearch && matchesDept;
    });
  }, [teachers, searchTerm, departmentFilter]);

  function handleOpenAdd() {
    setEditingTeacher(null);
    setIsFormOpen(true);
  }

  function handleOpenEdit(teacher) {
    setEditingTeacher(teacher);
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

      {/* Error Alert Banner */}
      {error && (
        <div className="alert-banner error">
          <div className="alert-banner-content">
            <IconAlertCircle size={22} />
            <div>
              <strong>Error: </strong>
              <span>{error}</span>
            </div>
          </div>
          <button className="btn btn-secondary" onClick={fetchTeachers}>
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
            <span className="breadcrumb-current">Teachers</span>
          </div>
          <h1 className="page-title">Faculty Directory</h1>
          <p className="page-subtitle">Manage campus teachers, qualifications, subjects, and appointments</p>
        </div>

        <div className="page-actions">
          <button className="btn btn-secondary" onClick={fetchTeachers} title="Reload faculty data">
            <IconRefresh size={16} />
            <span>Refresh</span>
          </button>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <IconPlus size={18} />
            <span>Add Teacher</span>
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
            placeholder="Search by teacher name, ID, subject, or email..."
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

          {(searchTerm || departmentFilter) && (
            <button
              className="btn btn-secondary"
              style={{ padding: '8px 12px', fontSize: '0.82rem' }}
              onClick={() => {
                setSearchTerm('');
                setDepartmentFilter('');
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
          Showing <span className="highlight-count">{filteredTeachers.length}</span> of{' '}
          <span className="highlight-count">{teachers.length}</span> teachers
        </span>
        {departmentFilter && <span>Filtered by Department: <strong>{departmentFilter}</strong></span>}
      </div>

      {/* Main Table Card */}
      <div className="table-card">
        {loading ? (
          <Loading message="Fetching faculty records from JSON Server..." />
        ) : filteredTeachers.length === 0 ? (
          <div className="empty-state">
            <IconBriefcase size={40} className="empty-state-icon" />
            <p className="empty-state-title">
              {teachers.length === 0 ? 'No Teachers in Database' : 'No Teachers Match Your Criteria'}
            </p>
            <p className="empty-state-text">
              {teachers.length === 0
                ? 'Your faculty directory is currently empty. Click "Add Teacher" to add persistent records in JSON Server.'
                : 'Try adjusting your search query or clearing the selected department filter.'}
            </p>
            {teachers.length === 0 ? (
              <button className="btn btn-primary" onClick={handleOpenAdd} style={{ marginTop: '12px' }}>
                <IconPlus size={16} /> Add First Teacher
              </button>
            ) : (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSearchTerm('');
                  setDepartmentFilter('');
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
                  <th>Teacher ID</th>
                  <th>Faculty Name</th>
                  <th>Department</th>
                  <th>Specialization / Subject</th>
                  <th>Qualification</th>
                  <th>Experience</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>
                      <span className="teacher-id-badge">{teacher.teacherId || teacher.id}</span>
                    </td>
                    <td>
                      <div className="profile-cell">
                        <div className="cell-avatar teacher-avatar">
                          {teacher.name ? teacher.name.charAt(0).toUpperCase() : 'T'}
                        </div>
                        <div className="cell-info">
                          <span className="cell-name">{teacher.name}</span>
                          <span className="cell-sub">{teacher.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{teacher.department}</td>
                    <td>
                      <span className="subject-tag">
                        <IconBook size={14} />
                        {teacher.subject}
                      </span>
                    </td>
                    <td>
                      <span className="qualification-tag">{teacher.qualification}</span>
                    </td>
                    <td>
                      <span className="experience-badge">
                        <IconClock size={12} />
                        {teacher.experience} yrs
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          type="button"
                          className="btn-icon action-btn-view"
                          title="View Full Teacher Profile"
                          onClick={() => setViewingTeacher(teacher)}
                        >
                          <IconEye size={17} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon action-btn-edit"
                          title="Edit Teacher Record"
                          onClick={() => handleOpenEdit(teacher)}
                        >
                          <IconEdit size={17} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon action-btn-delete"
                          title="Delete Teacher Record"
                          onClick={() => setDeletingTeacher(teacher)}
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

      {/* Add / Edit Teacher Modal */}
      <TeacherForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingTeacher}
        onSuccess={handleFormSuccess}
      />

      {/* View Details Modal */}
      {viewingTeacher && (
        <div className="modal-overlay" onClick={() => setViewingTeacher(null)}>
          <div 
            className="modal-dialog" 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <div className="modal-title-group">
                <h2 className="modal-title">Teacher Profile</h2>
                <span className="modal-subtitle">Full faculty details and qualifications</span>
              </div>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setViewingTeacher(null)}
              >
                <IconClose size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-view-card">
                <div className="detail-view-header">
                  <div className="detail-large-avatar" style={{ background: 'linear-gradient(135deg, #0d9488, #14b8a6)' }}>
                    {viewingTeacher.name ? viewingTeacher.name.charAt(0).toUpperCase() : 'T'}
                  </div>
                  <div className="detail-header-info">
                    <h3 className="detail-name">{viewingTeacher.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="teacher-id-badge">{viewingTeacher.teacherId || viewingTeacher.id}</span>
                      <span className="experience-badge">{viewingTeacher.experience} yrs exp</span>
                      <span className="badge badge-slate">{viewingTeacher.gender}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Email Address</span>
                    <span className="detail-value">
                      <IconMail size={16} style={{ color: '#0d9488' }} />
                      {viewingTeacher.email}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Phone Number</span>
                    <span className="detail-value">
                      <IconPhone size={16} style={{ color: '#0d9488' }} />
                      {viewingTeacher.phone}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Department</span>
                    <span className="detail-value">
                      <IconBuilding size={16} style={{ color: '#0d9488' }} />
                      {viewingTeacher.department}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Specialization Subject</span>
                    <span className="detail-value">
                      <IconBook size={16} style={{ color: '#0d9488' }} />
                      {viewingTeacher.subject}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Academic Qualification</span>
                    <span className="detail-value">
                      <IconAward size={16} style={{ color: '#0d9488' }} />
                      {viewingTeacher.qualification}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Experience</span>
                    <span className="detail-value">
                      <IconClock size={16} style={{ color: '#0d9488' }} />
                      {viewingTeacher.experience} Years
                    </span>
                  </div>

                  <div className="detail-item" style={{ gridColumn: 'span 2' }}>
                    <span className="detail-label">Campus / Office Address</span>
                    <span className="detail-value">
                      <IconMapPin size={16} style={{ color: '#0d9488', flexShrink: 0 }} />
                      {viewingTeacher.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setViewingTeacher(null)}
              >
                Close
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => {
                  const toEdit = viewingTeacher;
                  setViewingTeacher(null);
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
        isOpen={Boolean(deletingTeacher)}
        title="Delete Teacher Record"
        message="Are you sure you want to permanently delete this faculty record from JSON Server?"
        itemDetails={
          deletingTeacher && (
            <div>
              <strong>{deletingTeacher.name}</strong> ({deletingTeacher.teacherId || deletingTeacher.id})<br />
              <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                {deletingTeacher.department} &bull; {deletingTeacher.subject}
              </span>
            </div>
          )
        }
        confirmText="Confirm Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingTeacher(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default TeachersPage;

