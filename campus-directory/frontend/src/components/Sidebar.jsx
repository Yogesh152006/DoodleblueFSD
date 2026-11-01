import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  IconDashboard, 
  IconUsers, 
  IconBriefcase, 
  IconGraduationCap, 
  IconClose 
} from './Icons';
import '../styles/Sidebar.css';

function Sidebar({ isOpen, onClose, studentCount = 0, teacherCount = 0 }) {
  return (
    <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <NavLink to="/" className="sidebar-logo" onClick={onClose}>
          <IconGraduationCap size={24} />
          <span>EduCampus</span>
        </NavLink>
        <button 
          className="sidebar-close-btn" 
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <IconClose size={20} />
        </button>
      </div>

      <div className="sidebar-nav-container">
        <div className="nav-section">
          <span className="nav-section-title">Navigation</span>
          
          <NavLink 
            to="/" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
            end
          >
            <div className="sidebar-link-content">
              <IconDashboard size={19} />
              <span>Dashboard</span>
            </div>
          </NavLink>

          <NavLink 
            to="/students" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <div className="sidebar-link-content">
              <IconUsers size={19} />
              <span>Students</span>
            </div>
            {studentCount > 0 && (
              <span className="sidebar-badge">{studentCount}</span>
            )}
          </NavLink>

          <NavLink 
            to="/teachers" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <div className="sidebar-link-content">
              <IconBriefcase size={19} />
              <span>Teachers</span>
            </div>
            {teacherCount > 0 && (
              <span className="sidebar-badge">{teacherCount}</span>
            )}
          </NavLink>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-footer-card">
          <span className="system-tag">Single Source of Truth</span>
          <span className="system-desc">Persisted directly via JSON Server REST API</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

