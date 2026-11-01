import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import StudentsPage from './pages/StudentsPage';
import TeachersPage from './pages/TeachersPage';
import { studentApi, teacherApi } from './services/api';
import './styles/App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Periodically or on route check counts and server status
  useEffect(() => {
    let isMounted = true;
    async function checkStatus() {
      try {
        const [students, teachers] = await Promise.all([
          studentApi.getAll(),
          teacherApi.getAll()
        ]);
        if (isMounted) {
          setIsConnected(true);
          setStudentCount(Array.isArray(students) ? students.length : 0);
          setTeacherCount(Array.isArray(teachers) ? teachers.length : 0);
        }
      } catch (err) {
        if (isMounted) {
          setIsConnected(false);
        }
      }
    }

    checkStatus();
    // Poll every 30 seconds for live badge updates
    const interval = setInterval(checkStatus, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [location.pathname]);

  return (
    <div className="app-container">
      {/* Mobile Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        studentCount={studentCount}
        teacherCount={teacherCount}
      />

      <div className="main-wrapper">
        {/* Top Header */}
        <Header 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          isConnected={isConnected}
        />

        {/* Dynamic Route Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            {/* Unknown routes redirect to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Bottom Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default App;

