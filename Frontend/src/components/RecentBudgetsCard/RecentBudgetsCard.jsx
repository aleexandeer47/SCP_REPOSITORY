import { Link } from 'react-router-dom'
import './RecentBudgetsCard.css'

export default function RecentBudgetsCard({ title, items, emptyMessage, viewAllHref, viewAllLabel = 'Ver todas' }) {
  return (
    <aside className="recent-card">
      <h3 className="recent-card-title">{title}</h3>

      {items.length === 0 ? (
        <p className="recent-empty">{emptyMessage}</p>
      ) : (
        <ol className="recent-list">
          {items.map((item, index) => (
            <li key={item.id} className="recent-item">
              <span className="recent-item-index">{index + 1}.</span>
              <div className="recent-item-body">
                {item.href ? (
                  <Link to={item.href} className="recent-item-primary">
                    {item.primary}
                  </Link>
                ) : (
                  <p className="recent-item-primary">{item.primary}</p>
                )}
                {item.secondary && <p className="recent-item-detail">{item.secondary}</p>}
                <p className="recent-item-time">{item.time}</p>
              </div>
            </li>
          ))}
        </ol>
      )}

      {viewAllHref && (
        <Link className="recent-card-link" to={viewAllHref}>
          {viewAllLabel}
        </Link>
      )}
    </aside>
  )
}
