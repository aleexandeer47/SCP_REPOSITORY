import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import './Modal.css'

export default function Modal({ title, onClose, children, footer, width }) {
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return createPortal(
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel" style={width ? { maxWidth: width } : undefined} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
