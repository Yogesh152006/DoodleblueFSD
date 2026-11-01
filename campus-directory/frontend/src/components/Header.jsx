import React from 'react';
import { Link } from 'react-router-dom';
import { IconGraduationCap, IconMenu } from './Icons';
import '../styles/Header.css';

function Header({ onToggleSidebar, isConnected = true }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          className="menu-toggle-btn" 
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <IconMenu size={22} />
        </button>

        <Link to="/" className="header-brand">
          <div className="brand-icon-wrapper">
            <IconGraduationCap size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-name">Campus Directory</span>
            <span className="brand-tagline">Academic Management System</span>
          </div>
        </Link>
      </div>

      <div className="header-right">
        <div className="system-status-pill">
          <span className={`status-dot ${isConnected ? '' : 'offline'}`}></span>
          <span>{isConnected ? 'JSON Server Live' : 'Server Disconnected'}</span>
        </div>

        <div className="header-divider"></div>

        <div className="user-profile">
          <div className="avatar-circle">
            AD
          </div>
          <div className="user-details">
            <span className="user-name">Administrator</span>
            <span className="user-role">Campus Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

