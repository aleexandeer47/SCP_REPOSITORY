import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  BuildingIcon,
  CatalogIcon,
  ChartBarIcon,
  ChevronDownIcon,
  DocumentIcon,
  FolderIcon,
  HomeIcon,
  LayersIcon,
  LogoutIcon,
  PriceTagIcon,
  UsersIcon,
} from '../icons'
import './Sidebar.css'

const CATALOG_ITEMS = [
  { to: '/catalogos/categoria-materiales', label: 'Categoría de materiales', icon: LayersIcon },
  { to: '/catalogos/unidades-medida', label: 'Unidades de medida', icon: DocumentIcon },
  { to: '/catalogos/materiales', label: 'Materiales', icon: CatalogIcon },
  { to: '/catalogos/partidas', label: 'Partidas', icon: ChartBarIcon },
  { to: '/catalogos/proyectos', label: 'Proyectos', icon: FolderIcon },
  { to: '/catalogos/categorias-mo', label: 'Categorías de mano de obra', icon: UsersIcon },
]

const NAV_ITEMS = [
  { to: '/', label: 'Inicio', icon: HomeIcon, end: true },
  { group: 'Catálogos', icon: CatalogIcon, basePath: '/catalogos', items: CATALOG_ITEMS },
  { to: '/ingreso-de-precios', label: 'Ingreso de precios', icon: PriceTagIcon },
  { to: '/costos-indirectos', label: 'Costos indirectos', icon: LayersIcon },
  { to: '/mi-empresa', label: 'Mi empresa', icon: BuildingIcon },
  { to: '/usuarios', label: 'Usuarios', icon: UsersIcon },
]

export default function Sidebar({ isOpen, onNavigate }) {
  const { logout } = useAuth()
  const location = useLocation()
  const [openGroup, setOpenGroup] = useState(location.pathname.startsWith('/catalogos') ? 'Catálogos' : null)

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">SCP</span>
        <p className="sidebar-brand-tagline">Sistema de costos y presupuestos</p>
      </div>

      <nav className="sidebar-nav" aria-label="Navegación principal">
        {NAV_ITEMS.map((item) => {
          if (item.group) {
            const isOpenGroup = openGroup === item.group
            const isGroupActive = location.pathname.startsWith(item.basePath)
            const GroupIcon = item.icon

            return (
              <div key={item.group} className="sidebar-group">
                <button
                  type="button"
                  className={`sidebar-link sidebar-group-toggle ${isGroupActive ? 'sidebar-link--active-group' : ''}`}
                  onClick={() => setOpenGroup(isOpenGroup ? null : item.group)}
                  aria-expanded={isOpenGroup}
                >
                  <GroupIcon className="sidebar-link-icon" />
                  <span>{item.group}</span>
                  <ChevronDownIcon className={`sidebar-group-chevron ${isOpenGroup ? 'sidebar-group-chevron--open' : ''}`} />
                </button>

                {isOpenGroup && (
                  <div className="sidebar-subnav">
                    {item.items.map(({ to, label, icon: Icon }) => (
                      <NavLink
                        key={to}
                        to={to}
                        onClick={onNavigate}
                        className={({ isActive }) => `sidebar-link sidebar-sublink ${isActive ? 'sidebar-link--active' : ''}`}
                      >
                        <Icon className="sidebar-link-icon" />
                        <span>{label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`}
            >
              <Icon className="sidebar-link-icon" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <button type="button" className="sidebar-logout" onClick={logout}>
        <LogoutIcon className="sidebar-link-icon" />
        Cerrar sesión
      </button>
    </aside>
  )
}
