import './AuthShell.css'

export default function AuthShell({ children, wide }) {
  return (
    <div className="login-screen">
      <div className="login-backdrop">
        <div className="login-backdrop-panel login-backdrop-panel--light" />
        <div className="login-backdrop-panel login-backdrop-panel--dark" />
      </div>

      <div className={`login-card ${wide ? 'login-card--wide' : ''}`}>
        <div className="login-brand">
          <span className="login-brand-mark">SCP</span>
          <p className="login-brand-tagline">Sistema de costos y presupuestos</p>
        </div>

        {children}
      </div>
    </div>
  )
}
