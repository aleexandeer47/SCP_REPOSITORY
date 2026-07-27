import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as authService from '../../services/authService'
import AuthShell from '../../components/AuthShell/AuthShell'
import { usePasswordStrength } from '../../hooks/usePasswordStrength'
import {
  AlertIcon,
  BuildingIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from '../../components/icons'

const EMPTY_FORM = { companyName: '', nit: '', username: '', email: '', password: '', confirmPassword: '' }
const NIT_REGEX = /^\d{4}-\d{6}-\d{3}-\d$/

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const strength = usePasswordStrength(form.password)

  function setField(key) {
    return (event) => {
      setForm((f) => ({ ...f, [key]: event.target.value }))
      setErrors((e) => (e[key] ? { ...e, [key]: '' } : e))
      setFormError('')
    }
  }

  function validate() {
    const next = {}
    if (!form.companyName.trim()) next.companyName = 'El nombre de la empresa es obligatorio.'
    else if (form.companyName.trim().length < 2) next.companyName = 'Mínimo 2 caracteres.'
    if (!form.nit.trim()) next.nit = 'El NIT es obligatorio.'
    else if (!NIT_REGEX.test(form.nit.trim())) next.nit = 'Formato inválido. Usa 0000-000000-000-0.'
    if (!form.username.trim()) next.username = 'El usuario es obligatorio.'
    else if (form.username.trim().length < 3) next.username = 'Mínimo 3 caracteres.'
    if (!form.email.trim()) next.email = 'El correo es obligatorio.'
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Correo inválido.'
    if (form.password.length < 6) next.password = 'Mínimo 6 caracteres.'
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Las contraseñas no coinciden.'
    return next
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setLoading(true)
    setFormError('')
    try {
      await authService.registerCompany(form)
      navigate('/login', { replace: true })
    } catch (err) {
      setFormError(err.message || 'No se pudo crear la empresa.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell wide>
      <h1 className="auth-title">Crea tu empresa</h1>
      <p className="auth-desc">Registra tu empresa y tu cuenta de administrador para empezar</p>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {formError && (
          <p className="auth-alert" role="alert">
            <AlertIcon className="auth-alert-icon" />
            {formError}
          </p>
        )}

        <div className="auth-row">
          <label className="auth-field" htmlFor="companyName">
            <span className="auth-field-label">Nombre de la empresa</span>
            <span className={`auth-field-control ${errors.companyName ? 'auth-field-control--error' : ''}`}>
              <BuildingIcon className="auth-field-icon" />
              <input id="companyName" type="text" placeholder="Ej: Constructora Morales" value={form.companyName} onChange={setField('companyName')} />
            </span>
            {errors.companyName && <span className="auth-field-error">{errors.companyName}</span>}
          </label>

          <label className="auth-field" htmlFor="nit">
            <span className="auth-field-label">NIT</span>
            <span className={`auth-field-control ${errors.nit ? 'auth-field-control--error' : ''}`}>
              <BuildingIcon className="auth-field-icon" />
              <input id="nit" type="text" maxLength={17} placeholder="0614-000000-000-0" value={form.nit} onChange={setField('nit')} />
            </span>
            {errors.nit && <span className="auth-field-error">{errors.nit}</span>}
          </label>
        </div>

        <label className="auth-field" htmlFor="username">
          <span className="auth-field-label">Usuario</span>
          <span className={`auth-field-control ${errors.username ? 'auth-field-control--error' : ''}`}>
            <UserIcon className="auth-field-icon" />
            <input id="username" type="text" autoComplete="username" placeholder="Elige un usuario" value={form.username} onChange={setField('username')} />
          </span>
          {errors.username && <span className="auth-field-error">{errors.username}</span>}
        </label>

        <label className="auth-field" htmlFor="email">
          <span className="auth-field-label">Correo electrónico</span>
          <span className={`auth-field-control ${errors.email ? 'auth-field-control--error' : ''}`}>
            <MailIcon className="auth-field-icon" />
            <input id="email" type="email" autoComplete="email" placeholder="correo@empresa.com" value={form.email} onChange={setField('email')} />
          </span>
          {errors.email && <span className="auth-field-error">{errors.email}</span>}
        </label>

        <label className="auth-field" htmlFor="password">
          <span className="auth-field-label">Contraseña</span>
          <span className={`auth-field-control ${errors.password ? 'auth-field-control--error' : ''}`}>
            <LockIcon className="auth-field-icon" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={setField('password')}
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
          {errors.password && <span className="auth-field-error">{errors.password}</span>}
        </label>

        <label className="auth-field" htmlFor="confirmPassword">
          <span className="auth-field-label">Confirmar contraseña</span>
          <span className={`auth-field-control ${errors.confirmPassword ? 'auth-field-control--error' : ''}`}>
            <LockIcon className="auth-field-icon" />
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Repite la contraseña"
              value={form.confirmPassword}
              onChange={setField('confirmPassword')}
            />
          </span>
          {errors.confirmPassword && <span className="auth-field-error">{errors.confirmPassword}</span>}
        </label>

        <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
          {loading ? 'Creando empresa…' : 'Crear empresa'}
        </button>
      </form>

      <p className="auth-switch">
        ¿Ya tienes cuenta? <Link className="auth-link" to="/login">Inicia sesión</Link>
      </p>
    </AuthShell>
  )
}
