import { PencilIcon, TrashIcon } from '../icons'
import './DataTable.css'

export default function DataTable({ columns, rows, rowKey, onEdit, onDelete, loading, emptyMessage = 'Sin registros todavía.' }) {
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={col.width ? { width: col.width } : undefined}>
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && <th className="data-table-actions-head">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <tr key={`skeleton-${i}`} className="data-table-skeleton-row">
                {columns.map((col) => (
                  <td key={col.key}>
                    <span className="data-table-skeleton" />
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td>
                    <span className="data-table-skeleton" style={{ width: 48 }} />
                  </td>
                )}
              </tr>
            ))}

          {!loading && rows.length === 0 && (
            <tr>
              <td className="data-table-empty" colSpan={columns.length + ((onEdit || onDelete) ? 1 : 0)}>
                {emptyMessage}
              </td>
            </tr>
          )}

          {!loading &&
            rows.map((row, index) => (
              <tr key={rowKey(row, index)}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render ? col.render(row, index) : row[col.key]}</td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="data-table-actions">
                    {onEdit && (
                      <button type="button" className="data-table-icon-btn" onClick={() => onEdit(row)} aria-label="Editar">
                        <PencilIcon />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        className="data-table-icon-btn data-table-icon-btn--danger"
                        onClick={() => onDelete(row)}
                        aria-label="Eliminar"
                      >
                        <TrashIcon />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
