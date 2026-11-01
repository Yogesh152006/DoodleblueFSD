import React from 'react';

function Loading({ message = 'Loading data from JSON Server...', size = 'default' }) {
  if (size === 'small') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <div className="spinner spinner-sm"></div>
        {message && <span>{message}</span>}
      </div>
    );
  }

  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">{message}</p>
    </div>
  );
}

export default Loading;

