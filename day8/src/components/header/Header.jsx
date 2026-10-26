function Header({ studentCount }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="brand" href="#page-title" aria-label="Student Services home">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>STUDENT SERVICES</span>
        </a>
        <span className="topbar-note">
          {studentCount} {studentCount === 1 ? 'record' : 'records'} in directory
        </span>
      </div>
    </header>
  )
}

export default Header