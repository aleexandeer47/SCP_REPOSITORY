import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Sidebar/Sidebar'
import './DashboardLayout.css'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="dashboard-shell">
      <Sidebar isOpen={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <button
          type="button"
          className="dashboard-scrim"
          aria-label="Cerrar menú"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="dashboard-main">
        <button
          type="button"
          className="dashboard-menu-toggle"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          <span />
          <span />
          <span />
        </button>

        <Outlet />
      </div>
    </div>
  )
}
