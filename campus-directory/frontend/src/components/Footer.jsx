import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-left">
        <span>&copy; {currentYear} Campus Directory Management System. All rights reserved.</span>
      </div>
      <div className="footer-right">
        <span>React 18 &bull; Fetch API &bull; JSON Server &bull; Port 3000</span>
      </div>
    </footer>
  );
}

export default Footer;

