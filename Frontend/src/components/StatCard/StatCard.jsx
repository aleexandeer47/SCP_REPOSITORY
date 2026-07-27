import './StatCard.css'

export default function StatCard({ icon: Icon, eyebrow, title, meta }) {
  return (
    <article className="stat-card card">
      <div className="stat-card-icon">
        <Icon />
      </div>
      <div className="stat-card-body">
        <p className="stat-card-eyebrow">{eyebrow}</p>
        <p className="stat-card-title">{title}</p>
        {meta && <p className="stat-card-meta">{meta}</p>}
      </div>
    </article>
  )
}
