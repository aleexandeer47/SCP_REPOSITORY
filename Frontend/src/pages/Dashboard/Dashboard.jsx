import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getDashboardSummary } from '../../services/dashboardService'
import StatCard from '../../components/StatCard/StatCard'
import RecentBudgetsCard from '../../components/RecentBudgetsCard/RecentBudgetsCard'
import BudgetsChart from '../../components/BudgetsChart/BudgetsChart'
import { AlertIcon, CatalogIcon, ChartBarIcon, UsersIcon } from '../../components/icons'
import './Dashboard.css'

export default function Dashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      setSummary(await getDashboardSummary())
    } catch (err) {
      setLoadError(err.message || 'No se pudo cargar el resumen.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="dashboard-page">
      <header className="dashboard-banner">
        <h1>Bienvenida{user?.usuario ? `, ${user.usuario}` : ''}!</h1>
        {user?.codigo_e?.nombre && <p className="dashboard-banner-company">{user.codigo_e.nombre}</p>}
      </header>

      {loadError && (
        <p className="crud-form-alert" role="alert">
          <AlertIcon className="crud-form-alert-icon" />
          {loadError}
          <button type="button" className="crud-retry-btn" onClick={load}>
            Reintentar
          </button>
        </p>
      )}

      {!loadError && (
        <div className="dashboard-grid">
          <div className="dashboard-grid-main">
            <div className="dashboard-stats">
              <StatCard icon={ChartBarIcon} eyebrow="Partidas registradas" title={loading ? '…' : summary?.counts.partidas ?? 0} />
              <StatCard icon={CatalogIcon} eyebrow="Materiales en catálogo" title={loading ? '…' : summary?.counts.materiales ?? 0} />
              <StatCard icon={UsersIcon} eyebrow="Usuarios de tu empresa" title={loading ? '…' : summary?.counts.usuarios ?? 0} />
            </div>

            <div className="card">
              {!loading && summary && (
                <BudgetsChart title="Costos del mes" data={summary.monthlyChart.data} dateRangeLabel={summary.monthlyChart.dateRangeLabel} />
              )}
            </div>
          </div>

          <RecentBudgetsCard
            title="Partidas recientes"
            items={loading ? [] : summary?.recentPartidas ?? []}
            emptyMessage={loading ? 'Cargando…' : 'Todavía no has creado ninguna partida.'}
            viewAllHref="/catalogos/partidas"
            viewAllLabel="Ver todas las partidas"
          />
        </div>
      )}
    </div>
  )
}
