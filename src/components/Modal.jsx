import React from 'react'

export default function Modal({ open, onClose, children, title }) {
  if (!open) return null
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal">
        <div className="modal-header">
          <h3 id="modal-title">{title}</h3>
          <button aria-label="Close modal" className="btn-close" onClick={onClose}>Close X</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}


