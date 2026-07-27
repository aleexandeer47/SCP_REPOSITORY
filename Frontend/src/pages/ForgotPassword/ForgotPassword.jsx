import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as authService from '../../services/authService'
import AuthShell from '../../components/AuthShell/AuthShell'
import { AlertIcon, ArrowLeftIcon, CheckCircleIcon, MailIcon } from '../../components/icons'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!EMAIL_REGEX.test(email.trim())) {
      setError('Ingresa un correo electrónico válido.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await authService.requestPasswordReset(email.trim())
      setSent(true)
    } catch (err) {
      // The account-not-found case still surfaces (backend responds 404),
      // but anything else is shown as-is rather than silently "succeeding".
      if (err.message === 'Usuario no encontrado') {
        setSent(true)
      } else {
        setError(err.message || 'No se pudo enviar el correo.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthShell>
        <div className="auth-success">
          <div className="auth-success-icon">
            <CheckCircleIcon />
          </div>
          <h1 className="auth-title">Revisa tu correo</h1>
          <p className="auth-desc">
            Te enviamos un código a <strong>{email}</strong> para restablecer tu contraseña.
          </p>
          <button type="button" className="btn btn-primary auth-submit" onClick={() => navigate('/reset-password')}>
            Ingresar código
          </button>
        </div>

        <p className="auth-switch">
          <Link className="auth-back-link" to="/login">
            <ArrowLeftIcon className="auth-back-icon" /> Volver al inicio de sesión
          </Link>
        </p>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <h1 className="auth-title">Recuperar contraseña</h1>
      <p className="auth-desc">Ingresa tu correo y te enviaremos un código para restablecerla.</p>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error && (
          <p className="auth-alert" role="alert">
            <AlertIcon className="auth-alert-icon" />
            {error}
          </p>
        )}

        <label className="auth-field" htmlFor="email">
          <span className="auth-field-label">Correo electrónico</span>
          <span className="auth-field-control">
            <MailIcon className="auth-field-icon" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="correo@empresa.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
            />
          </span>
        </label>

        <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
          {loading ? 'Enviando…' : 'Enviar código'}
        </button>
      </form>

      <p className="auth-switch">
        <Link className="auth-back-link" to="/login">
          <ArrowLeftIcon className="auth-back-icon" /> Volver al inicio de sesión
        </Link>
      </p>
    </AuthShell>
  )
}
