import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { studentApi, teacherApi } from '../services/api';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';
import StudentForm from '../components/StudentForm';
import TeacherForm from '../components/TeacherForm';
import { 
  IconUsers, 
  IconBriefcase, 
  IconBuilding, 
  IconBook, 
  IconPlus, 
  IconEye, 
  IconAlertCircle, 
  IconRefresh, 
  IconChevronRight 
} from '../components/Icons';
import '../styles/Dashboard.css';

function HomePage() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Quick Action Modal states
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  async function fetchDashboardData() {
    setLoading(true);
    setError(null);

    try {
      // Fetch concurrently from JSON Server using Native Fetch API
      const [studentsData, teachersData] = await Promise.all([
        studentApi.getAll(),
        teacherApi.getAll()
      ]);

      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setTeachers(Array.isArray(teachersData) ? teachersData : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data from server.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  function handleSuccess(message) {
    setNotification(message);
    fetchDashboardData();
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  }

  // Calculate dynamic dashboard stats
  const totalStudents = students.length;
  const totalTeachers = teachers.length;

  const totalDepartments = useMemo(() => {
    const depts = new Set();
    students.forEach((s) => {
      if (s.department && s.department.trim()) depts.add(s.department.trim());
    });
    teachers.forEach((t) => {
      if (t.department && t.department.trim()) depts.add(t.department.trim());
    });
    return depts.size;
  }, [students, teachers]);

  const totalCourses = useMemo(() => {
    const courses = new Set();
    students.forEach((s) => {
      if (s.course && s.course.trim()) courses.add(s.course.trim());
    });
    return courses.size;
  }, [students]);

  // Department distribution
  const departmentDistribution = useMemo(() => {
    const dist = {};
    students.forEach((s) => {
      const dept = s.department ? s.department.trim() : 'Unassigned';
      dist[dept] = (dist[dept] || 0) + 1;
    });

    return Object.entries(dist)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);
  }, [students, totalStudents]);

  // Recently added students (last 5)
  const recentStudents = useMemo(() => {
    return [...students]
      .reverse()
      .slice(0, 5);
  }, [students]);

  // Recently added teachers (last 5)
  const recentTeachers = useMemo(() => {
    return [...teachers]
      .reverse()
      .slice(0, 5);
  }, [teachers]);

  if (loading) {
    return <Loading message="Connecting to JSON Server and calculating dashboard metrics..." />;
  }

  return (
    <div className="dashboard-container">
      {/* Toast Notification */}
      {notification && (
        <div className="toast-container">
          <div className="toast toast-success">
            <span>{notification}</span>
            <button className="toast-close" onClick={() => setNotification(null)}>&times;</button>
          </div>
        </div>
      )}

      {/* Server Connection Error Alert */}
      {error && (
        <div className="alert-banner error">
          <div className="alert-banner-content">
            <IconAlertCircle size={22} />
            <div>
              <strong>Server Connection Error: </strong>
              <span>{error}</span>
            </div>
          </div>
          <button className="btn btn-secondary" onClick={fetchDashboardData}>
            <IconRefresh size={16} />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Page Title & Breadcrumb */}
      <div className="page-header">
        <div className="page-title-group">
          <div className="breadcrumb">
            <span>Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Dashboard</span>
          </div>
          <h1 className="page-title">Campus Overview</h1>
          <p className="page-subtitle">Real-time dynamic directory summary & fast management controls</p>
        </div>

        <div className="page-actions">
          <button className="btn btn-secondary" onClick={fetchDashboardData}>
            <IconRefresh size={16} />
            <span>Refresh Stats</span>
          </button>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={<IconUsers size={24} />}
          color="blue"
          helperText="Enrolled active students"
        />
        <StatCard
          title="Total Teachers"
          value={totalTeachers}
          icon={<IconBriefcase size={24} />}
          color="emerald"
          helperText="Appointed faculty members"
        />
        <StatCard
          title="Total Departments"
          value={totalDepartments}
          icon={<IconBuilding size={24} />}
          color="indigo"
          helperText="Across academic faculties"
        />
        <StatCard
          title="Total Courses"
          value={totalCourses}
          icon={<IconBook size={24} />}
          color="amber"
          helperText="Active degree programs"
        />
      </div>

      {/* Quick Actions Bar */}
      <div className="quick-actions-bar">
        <div className="quick-actions-header">
          <h2 className="quick-actions-title">Quick Actions</h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Direct management shortcuts</span>
        </div>
        <div className="quick-actions-grid">
          <button 
            type="button" 
            className="action-card" 
            onClick={() => setIsAddStudentOpen(true)}
          >
            <div className="action-card-icon">
              <IconPlus size={20} />
            </div>
            <div>
              <div>Add Student</div>
              <small style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Create student record</small>
            </div>
          </button>

          <button 
            type="button" 
            className="action-card" 
            onClick={() => setIsAddTeacherOpen(true)}
          >
            <div className="action-card-icon">
              <IconPlus size={20} />
            </div>
            <div>
              <div>Add Teacher</div>
              <small style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Create faculty record</small>
            </div>
          </button>

          <Link to="/students" className="action-card">
            <div className="action-card-icon">
              <IconEye size={20} />
            </div>
            <div>
              <div>View Students</div>
              <small style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Browse directory & CRUD</small>
            </div>
          </Link>

          <Link to="/teachers" className="action-card">
            <div className="action-card-icon">
              <IconEye size={20} />
            </div>
            <div>
              <div>View Teachers</div>
              <small style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Browse faculty directory</small>
            </div>
          </Link>
        </div>
      </div>

      {/* Dashboard Main Grid (Distribution & Recents) */}
      <div className="dashboard-main-grid">
        {/* Left Column: Student Department Distribution */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div className="card-title-group">
              <IconBuilding size={20} className="card-icon" />
              <h2 className="dashboard-card-title">Student Department Distribution</h2>
            </div>
            <span className="badge badge-blue">{departmentDistribution.length} Departments</span>
          </div>
          <div className="dashboard-card-body">
            {departmentDistribution.length === 0 ? (
              <div className="empty-state">
                <IconBuilding size={32} className="empty-state-icon" />
                <p className="empty-state-title">No Department Data</p>
                <p className="empty-state-text">Add students to view distribution metrics across departments.</p>
                <button className="btn btn-primary" onClick={() => setIsAddStudentOpen(true)} style={{ marginTop: '10px' }}>
                  <IconPlus size={16} /> Add First Student
                </button>
              </div>
            ) : (
              <div className="distribution-list">
                {departmentDistribution.map((item) => (
                  <div key={item.name} className="dist-item">
                    <div className="dist-info">
                      <span className="dist-name">{item.name}</span>
                      <span className="dist-count">{item.count} ({item.percentage}%)</span>
                    </div>
                    <div className="dist-bar-track">
                      <div 
                        className="dist-bar-fill" 
                        style={{ width: `${Math.max(item.percentage, 4)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recently Added Teachers */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div className="card-title-group">
              <IconBriefcase size={20} className="card-icon" />
              <h2 className="dashboard-card-title">Recently Added Teachers</h2>
            </div>
            <Link to="/teachers" className="dashboard-card-link">
              View all <IconChevronRight size={14} />
            </Link>
          </div>
          <div className="dashboard-card-body">
            {recentTeachers.length === 0 ? (
              <div className="empty-state">
                <IconBriefcase size={32} className="empty-state-icon" />
                <p className="empty-state-title">No Teachers Recorded</p>
                <p className="empty-state-text">Start by adding your first faculty member to the directory.</p>
                <button className="btn btn-primary" onClick={() => setIsAddTeacherOpen(true)} style={{ marginTop: '10px' }}>
                  <IconPlus size={16} /> Add Teacher
                </button>
              </div>
            ) : (
              <div className="mini-list">
                {recentTeachers.map((teacher) => (
                  <div key={teacher.id} className="mini-item">
                    <div className="mini-item-left">
                      <div className="mini-avatar" style={{ backgroundColor: '#f0fdfa', color: '#0f766e' }}>
                        {teacher.name ? teacher.name.charAt(0).toUpperCase() : 'T'}
                      </div>
                      <div className="mini-meta">
                        <span className="mini-name">{teacher.name}</span>
                        <span className="mini-sub">{teacher.subject || teacher.department}</span>
                      </div>
                    </div>
                    <span className="badge badge-slate">{teacher.teacherId || teacher.id}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recently Added Students Section */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <div className="card-title-group">
            <IconUsers size={20} className="card-icon" />
            <h2 className="dashboard-card-title">Recently Added Students</h2>
          </div>
          <Link to="/students" className="dashboard-card-link">
            View all students <IconChevronRight size={14} />
          </Link>
        </div>
        <div className="dashboard-card-body">
          {recentStudents.length === 0 ? (
            <div className="empty-state">
              <IconUsers size={32} className="empty-state-icon" />
              <p className="empty-state-title">No Students Recorded</p>
              <p className="empty-state-text">No student records exist yet in JSON Server. Click below to add one.</p>
              <button className="btn btn-primary" onClick={() => setIsAddStudentOpen(true)} style={{ marginTop: '10px' }}>
                <IconPlus size={16} /> Add Student
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="directory-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Full Name</th>
                    <th>Department</th>
                    <th>Course</th>
                    <th>Year of Study</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentStudents.map((student) => (
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
                      <td>
                        <Link to="/students" className="btn btn-secondary" style={{ padding: '5px 12px', fontSize: '0.8rem' }}>
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      <StudentForm
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* Add Teacher Modal */}
      <TeacherForm
        isOpen={isAddTeacherOpen}
        onClose={() => setIsAddTeacherOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default HomePage;

