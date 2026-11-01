import React, { useEffect } from 'react';
import { IconAlertCircle, IconTrash } from './Icons';

function ConfirmDialog({ 
  isOpen, 
  title = 'Confirm Deletion', 
  message, 
  itemDetails, 
  confirmText = 'Delete Record', 
  cancelText = 'Cancel', 
  onConfirm, 
  onCancel, 
  isDeleting = false 
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onCancel();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={isDeleting ? undefined : onCancel}>
      <div 
        className="modal-dialog modal-dialog-sm" 
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
      >
        <div className="modal-body">
          <div className="confirm-dialog-content">
            <div className="confirm-icon-box">
              <IconAlertCircle size={32} />
            </div>
            
            <h3 className="confirm-title">{title}</h3>
            
            <p className="confirm-message">
              {message || 'Are you sure you want to permanently delete this record? This action cannot be undone.'}
            </p>

            {itemDetails && (
              <div style={{
                backgroundColor: 'var(--bg-alt)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                width: '100%',
                fontSize: '0.88rem',
                border: '1px solid var(--border-color)',
                textAlign: 'left'
              }}>
                {itemDetails}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={isDeleting}
          >
            {cancelText}
          </button>
          
          <button 
            type="button" 
            className="btn btn-danger" 
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="spinner spinner-sm" style={{ borderTopColor: '#ffffff' }}></div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <IconTrash size={16} />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;

