import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthShell from '../../components/AuthShell/AuthShell'
import { AlertIcon, EyeIcon, EyeOffIcon, LockIcon, UserIcon } from '../../components/icons'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const redirectTo = location.state?.from?.pathname ?? '/'

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ username, password })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <h1 className="auth-title">Iniciar sesión</h1>
      <p className="auth-desc">Ingresa tus credenciales para continuar</p>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error && (
          <p className="auth-alert" role="alert">
            <AlertIcon className="auth-alert-icon" />
            {error}
          </p>
        )}

        <label className="auth-field" htmlFor="username">
          <span className="auth-field-label">Usuario</span>
          <span className="auth-field-control">
            <UserIcon className="auth-field-icon" />
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </span>
        </label>

        <label className="auth-field" htmlFor="password">
          <span className="auth-field-label">Contraseña</span>
          <span className="auth-field-control">
            <LockIcon className="auth-field-icon" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="auth-field-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </span>
        </label>

        <div className="auth-row-between">
          <label className="auth-remember">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Recordarme
          </label>
          <Link className="auth-link" to="/forgot-password">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>

      <p className="auth-switch">
        ¿Tu empresa no tiene cuenta? <Link className="auth-link" to="/register">Créala aquí</Link>
      </p>
    </AuthShell>
  )
}
