import React from 'react';

function StatCard({ title, value, icon, color = 'blue', helperText }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-content">
        <span className="stat-label">{title}</span>
        <span className="stat-value">{value}</span>
        {helperText && <span className="stat-helper">{helperText}</span>}
      </div>
      <div className="stat-icon-wrapper">
        {icon}
      </div>
    </div>
  );
}

export default StatCard;

