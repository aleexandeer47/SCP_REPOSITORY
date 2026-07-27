import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as authService from '../../services/authService'
import AuthShell from '../../components/AuthShell/AuthShell'
import { usePasswordStrength } from '../../hooks/usePasswordStrength'
import {
  AlertIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeOffIcon,
  KeyIcon,
  LockIcon,
} from '../../components/icons'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [code, setCode] = useState('')
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const strength = usePasswordStrength(form.password)

  async function handleVerifyCode(event) {
    event.preventDefault()
    if (!code.trim()) {
      setError('Ingresa el código.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await authService.verifyResetCode(code)
      setStep(2)
    } catch (err) {
      setError(err.message || 'Código inválido o expirado.')
    } finally {
      setLoading(false)
    }
  }

  async function handleReset(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authService.resetPassword({ newPassword: form.password, confirmPassword: form.confirmPassword })
      setDone(true)
    } catch (err) {
      setError(err.message || 'No se pudo restablecer la contraseña.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <AuthShell>
        <div className="auth-success">
          <div className="auth-success-icon">
            <CheckCircleIcon />
          </div>
          <h1 className="auth-title">¡Listo!</h1>
          <p className="auth-desc">Tu contraseña se restableció correctamente.</p>
          <button type="button" className="btn btn-primary auth-submit" onClick={() => navigate('/login')}>
            Ir al inicio de sesión
          </button>
        </div>
      </AuthShell>
    )
  }

  if (step === 1) {
    return (
      <AuthShell>
        <h1 className="auth-title">Ingresa el código</h1>
        <p className="auth-desc">Revisa tu correo y escribe el código de recuperación que te enviamos.</p>

        <form className="auth-form" onSubmit={handleVerifyCode} noValidate>
          {error && (
            <p className="auth-alert" role="alert">
              <AlertIcon className="auth-alert-icon" />
              {error}
            </p>
          )}

          <label className="auth-field" htmlFor="code">
            <span className="auth-field-label">Código de recuperación</span>
            <span className="auth-field-control">
              <KeyIcon className="auth-field-icon" />
              <input
                id="code"
                type="text"
                autoComplete="one-time-code"
                placeholder="Ej: a1b2c3"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  setError('')
                }}
              />
            </span>
          </label>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Verificando…' : 'Verificar código'}
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

  return (
    <AuthShell>
      <h1 className="auth-title">Nueva contraseña</h1>
      <p className="auth-desc">Elige una contraseña segura para tu cuenta.</p>

      <form className="auth-form" onSubmit={handleReset} noValidate>
        {error && (
          <p className="auth-alert" role="alert">
            <AlertIcon className="auth-alert-icon" />
            {error}
          </p>
        )}

        <label className="auth-field" htmlFor="new-password">
          <span className="auth-field-label">Nueva contraseña</span>
          <span className="auth-field-control">
            <LockIcon className="auth-field-icon" />
            <input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={(e) => {
                setForm((f) => ({ ...f, password: e.target.value }))
                setError('')
              }}
            />
            <button type="button" className="auth-field-toggle" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </span>
          {form.password && (
            <span className="auth-strength">
              <span className="auth-strength-track">
                <span className="auth-strength-fill" style={{ width: `${strength.score * 25}%`, background: strength.color }} />
              </span>
              <span className="auth-strength-label" style={{ color: strength.color }}>{strength.label}</span>
            </span>
          )}
        </label>

        <label className="auth-field" htmlFor="confirm-password">
          <span className="auth-field-label">Confirmar contraseña</span>
          <span className="auth-field-control">
            <LockIcon className="auth-field-icon" />
            <input
              id="confirm-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Repite la contraseña"
              value={form.confirmPassword}
              onChange={(e) => {
                setForm((f) => ({ ...f, confirmPassword: e.target.value }))
                setError('')
              }}
            />
          </span>
        </label>

        <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
          {loading ? 'Restableciendo…' : 'Restablecer contraseña'}
        </button>
      </form>
    </AuthShell>
  )
}
