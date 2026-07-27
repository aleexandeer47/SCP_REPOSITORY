import Modal from '../Modal/Modal'
import { AlertIcon } from '../icons'

export default function ConfirmDialog({ title = 'Confirmar eliminación', message, error, onCancel, onConfirm, loading }) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      width="380px"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Eliminando…' : 'Eliminar'}
          </button>
        </>
      }
    >
      <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{message}</p>
      {error && (
        <p className="crud-form-alert" role="alert" style={{ marginTop: 12 }}>
          <AlertIcon className="crud-form-alert-icon" />
          {error}
        </p>
      )}
    </Modal>
  )
}
