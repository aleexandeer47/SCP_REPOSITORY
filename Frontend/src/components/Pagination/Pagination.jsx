import { ArrowLeftIcon, ArrowRightIcon } from '../icons'
import './Pagination.css'

export default function Pagination({ page, pageCount, total, pageSize, onPageChange }) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="pagination">
      <p className="pagination-summary">
        Registros: {from}-{to} de {total}
      </p>
      <div className="pagination-controls">
        <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Página anterior">
          <ArrowLeftIcon />
        </button>
        <span className="pagination-current">
          Página {page} de {Math.max(pageCount, 1)}
        </span>
        <button type="button" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)} aria-label="Página siguiente">
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  )
}
