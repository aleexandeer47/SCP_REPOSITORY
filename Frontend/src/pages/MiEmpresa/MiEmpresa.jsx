import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { companyService } from '../../services/companyService'
import { AlertIcon, CheckCircleIcon, UsersIcon } from '../../components/icons'

const NIT_REGEX = /^\d{4}-\d{6}-\d{3}-\d$/

export default function MiEmpresa() {
  const [form, setForm] = useState({ nombre: '', nit: '' })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [errors, setErrors] = useState({})
  const [saveError, setSaveError] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  function load() {
    setLoading(true)
    setLoadError('')
    companyService
      .getMine()
      .then((company) => setForm({ nombre: company.nombre, nit: company.nit }))
      .catch((err) => setLoadError(err.message || 'No se pudo cargar la información de la empresa.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  function setField(key) {
    return (event) => {
      setForm((f) => ({ ...f, [key]: event.target.value }))
      setErrors((e) => (e[key] ? { ...e, [key]: '' } : e))
      setSaved(false)
    }
  }

  function validate() {
    const next = {}
    if (!form.nombre.trim()) next.nombre = 'El nombre de la empresa es obligatorio.'
    else if (form.nombre.trim().length < 2) next.nombre = 'Mínimo 2 caracteres.'
    if (!form.nit.trim()) next.nit = 'El NIT es obligatorio.'
    else if (!NIT_REGEX.test(form.nit.trim())) next.nit = 'Formato inválido. Usa 0000-000000-000-0.'
    return next
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setSaving(true)
    setSaveError('')
    try {
      const updated = await companyService.updateMine({ nombre: form.nombre.trim(), nit: form.nit.trim() })
      setForm({ nombre: updated.nombre, nit: updated.nit })
      setSaved(true)
    } catch (err) {
      setSaveError(err.message || 'No se pudo guardar la información de la empresa.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="crud-page card">
      <div className="crud-page-header">
        <h1>Mi empresa</h1>
        <Link className="crud-link" to="/usuarios">
          <UsersIcon /> Ver usuarios
        </Link>
      </div>

      <div className="crud-page-body">
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
          <form className="crud-form" style={{ maxWidth: 420 }} onSubmit={handleSubmit} noValidate>
            {saveError && (
              <p className="crud-form-alert" role="alert">
                <AlertIcon className="crud-form-alert-icon" />
                {saveError}
              </p>
            )}

            <label className="field">
              <span className="field-label">Nombre de la empresa</span>
              <input
                type="text"
                maxLength={70}
                placeholder="Ej: Wendy's"
                value={form.nombre}
                onChange={setField('nombre')}
                disabled={loading}
                className={errors.nombre ? 'has-error' : ''}
              />
              {errors.nombre && <span className="field-error">{errors.nombre}</span>}
            </label>

            <label className="field">
              <span className="field-label">NIT de la empresa</span>
              <input
                type="text"
                maxLength={17}
                placeholder="0614-000000-000-0"
                value={form.nit}
                onChange={setField('nit')}
                disabled={loading}
                className={errors.nit ? 'has-error' : ''}
              />
              {errors.nit && <span className="field-error">{errors.nit}</span>}
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button type="submit" className="btn btn-primary" disabled={loading || saving}>
                {saving ? 'Guardando…' : 'Guardar cambios'}
              </button>
              {saved && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--success, #2e7d32)' }}>
                  <CheckCircleIcon /> Guardado
                </span>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
