import { useMemo, useState } from 'react'
import { useCrudList } from '../../hooks/useCrudList'
import { useCollection } from '../../hooks/useCollection'
import { unitPricesService } from '../../services/unitPricesService'
import { materialCategoriesService } from '../../services/materialCategoriesService'
import { materialsEquipmentService } from '../../services/materialsEquipmentService'
import { unitsMeasurementService } from '../../services/unitsMeasurementService'
import CatalogToolbar from '../../components/CatalogToolbar/CatalogToolbar'
import DataTable from '../../components/DataTable/DataTable'
import Pagination from '../../components/Pagination/Pagination'
import Modal from '../../components/Modal/Modal'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import { AlertIcon } from '../../components/icons'
import './IngresoDePrecios.css'

const EMPTY_FORM = { codigo_cm: '', codigo_m: '', codigo_u: '', presentacion: '', precio_unitario: '' }

function money(value) {
  return `$${Number(value ?? 0).toFixed(2)}`
}

export default function IngresoDePrecios() {
  const crud = useCrudList({
    service: unitPricesService,
    matches: (item, q) => item.codigo_m?.descripcion?.toLowerCase().includes(q),
  })
  const { items: categories } = useCollection(materialCategoriesService)
  const { items: materials } = useCollection(materialsEquipmentService)
  const { items: units } = useCollection(unitsMeasurementService)

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const editing = crud.modal?.item ?? null

  const availableMaterials = useMemo(
    () => materials.filter((m) => (m.codigo_cm?._id ?? m.codigo_cm) === form.codigo_cm),
    [materials, form.codigo_cm],
  )

  const precioTotal = useMemo(() => {
    const precioUnitario = Number(form.precio_unitario)
    const presentacion = Number(form.presentacion)
    if (!precioUnitario || !presentacion) return null
    return precioUnitario * presentacion
  }, [form.precio_unitario, form.presentacion])

  function setField(key) {
    return (event) => {
      const value = event.target.value
      setForm((f) => {
        const next = { ...f, [key]: value }
        if (key === 'codigo_cm') next.codigo_m = ''
        return next
      })
      setErrors((e) => (e[key] ? { ...e, [key]: '' } : e))
    }
  }

  function openCreate() {
    setForm(EMPTY_FORM)
    setErrors({})
    crud.setError('')
    crud.setModal({ mode: 'create' })
  }

  function openEdit(item) {
    setForm({
      codigo_cm: item.codigo_m?.codigo_cm?._id ?? item.codigo_m?.codigo_cm ?? '',
      codigo_m: item.codigo_m?._id ?? item.codigo_m ?? '',
      codigo_u: item.codigo_u?._id ?? item.codigo_u ?? '',
      presentacion: item.presentacion,
      precio_unitario: item.precio_unitario,
    })
    setErrors({})
    crud.setError('')
    crud.setModal({ mode: 'edit', item })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    if (!form.codigo_cm) nextErrors.codigo_cm = 'Selecciona un catálogo.'
    if (!form.codigo_m) nextErrors.codigo_m = 'Selecciona un producto.'
    if (!form.codigo_u) nextErrors.codigo_u = 'Selecciona una unidad de medida.'
    if (!form.presentacion || Number(form.presentacion) <= 0) nextErrors.presentacion = 'Ingresa una presentación válida.'
    if (!form.precio_unitario || Number(form.precio_unitario) <= 0) nextErrors.precio_unitario = 'Ingresa un precio unitario válido.'
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const payload = {
      precio: Math.round(precioTotal * 100) / 100,
      presentacion: Number(form.presentacion),
      precio_unitario: Number(form.precio_unitario),
      codigo_m: form.codigo_m,
      codigo_u: form.codigo_u,
    }
    await crud.handleSave(payload, editing?._id)
  }

  return (
    <div className="crud-page card">
      <div className="crud-page-header">
        <h1>Ingreso de precios</h1>
      </div>

      <div className="crud-page-body">
        {crud.loadError && (
          <p className="crud-form-alert" role="alert" style={{ marginBottom: 14 }}>
            <AlertIcon className="crud-form-alert-icon" />
            {crud.loadError}
            <button type="button" className="crud-retry-btn" onClick={crud.reload}>
              Reintentar
            </button>
          </p>
        )}

        <CatalogToolbar search={crud.search} onSearchChange={crud.setSearch} searchPlaceholder="Buscar por material" onAdd={openCreate} />

        <DataTable
          columns={[
            { key: 'codigo', label: 'Código', width: 90, render: (_row, index) => index + 1 },
            { key: 'material', label: 'Material', render: (row) => row.codigo_m?.descripcion ?? '—' },
            { key: 'unidad', label: 'Unidad', width: 110, render: (row) => row.codigo_u?.abreviatura || row.codigo_u?.nombre || '—' },
            { key: 'presentacion', label: 'Presentación', width: 120 },
            { key: 'precio_unitario', label: 'Precio unitario', width: 130, render: (row) => money(row.precio_unitario) },
            { key: 'precio', label: 'Precio total', width: 110, render: (row) => money(row.precio) },
          ]}
          rows={crud.pageItems}
          rowKey={(row) => row._id}
          onEdit={openEdit}
          onDelete={(row) => {
            crud.setError('')
            crud.setDeleteTarget(row)
          }}
          loading={crud.loading}
        />

        <Pagination page={crud.page} pageCount={crud.pageCount} total={crud.total} pageSize={crud.pageSize} onPageChange={crud.setPage} />
      </div>

      {crud.modal && (
        <Modal
          title={editing ? 'Editar precio' : 'Ingreso de precios'}
          onClose={() => crud.setModal(null)}
          footer={
            <>
              <button type="button" className="btn btn-secondary" onClick={() => crud.setModal(null)}>
                Cancelar
              </button>
              <button type="submit" form="price-form" className="btn btn-primary" disabled={crud.saving}>
                {crud.saving ? 'Guardando…' : 'Aceptar'}
              </button>
            </>
          }
        >
          <form id="price-form" className="crud-form" onSubmit={handleSubmit} noValidate>
            {crud.error && (
              <p className="crud-form-alert" role="alert">
                <AlertIcon className="crud-form-alert-icon" />
                {crud.error}
              </p>
            )}

            <label className="field">
              <span className="field-label">Seleccione el catálogo</span>
              <select value={form.codigo_cm} onChange={setField('codigo_cm')} className={errors.codigo_cm ? 'has-error' : ''}>
                <option value="">Selecciona un catálogo</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.descripcion}
                  </option>
                ))}
              </select>
              {errors.codigo_cm && <span className="field-error">{errors.codigo_cm}</span>}
            </label>

            <label className="field">
              <span className="field-label">Seleccione el producto</span>
              <select value={form.codigo_m} onChange={setField('codigo_m')} disabled={!form.codigo_cm} className={errors.codigo_m ? 'has-error' : ''}>
                <option value="">{form.codigo_cm ? 'Selecciona un producto' : 'Primero elige un catálogo'}</option>
                {availableMaterials.map((mat) => (
                  <option key={mat._id} value={mat._id}>
                    {mat.descripcion}
                  </option>
                ))}
              </select>
              {errors.codigo_m && <span className="field-error">{errors.codigo_m}</span>}
            </label>

            <div className="field-row">
              <label className="field">
                <span className="field-label">Unidad de medida</span>
                <select value={form.codigo_u} onChange={setField('codigo_u')} className={errors.codigo_u ? 'has-error' : ''}>
                  <option value="">Selecciona una unidad</option>
                  {units.map((unit) => (
                    <option key={unit._id} value={unit._id}>
                      {unit.nombre} ({unit.abreviatura})
                    </option>
                  ))}
                </select>
                {errors.codigo_u && <span className="field-error">{errors.codigo_u}</span>}
              </label>

              <label className="field">
                <span className="field-label">Presentación</span>
                <input type="number" min="0" step="0.01" placeholder="0" value={form.presentacion} onChange={setField('presentacion')} className={errors.presentacion ? 'has-error' : ''} />
                {errors.presentacion && <span className="field-error">{errors.presentacion}</span>}
              </label>
            </div>

            <div className="field-row">
              <label className="field">
                <span className="field-label">Precio unitario</span>
                <span className="field-suffix">
                  <span className="field-suffix-label">$</span>
                  <input type="number" min="0" step="0.01" value={form.precio_unitario} onChange={setField('precio_unitario')} />
                </span>
                {errors.precio_unitario && <span className="field-error">{errors.precio_unitario}</span>}
              </label>

              <label className="field">
                <span className="field-label">Precio total</span>
                <span className="field-suffix field-suffix--readonly">
                  <span className="field-suffix-label">$</span>
                  <input type="text" readOnly value={precioTotal !== null ? precioTotal.toFixed(2) : ''} placeholder="Se calcula automáticamente" />
                </span>
              </label>
            </div>
          </form>
        </Modal>
      )}

      {crud.deleteTarget && (
        <ConfirmDialog
          message={`¿Eliminar el precio de "${crud.deleteTarget.codigo_m?.descripcion}"?`}
          error={crud.error}
          onCancel={() => {
            crud.setError('')
            crud.setDeleteTarget(null)
          }}
          onConfirm={crud.handleDelete}
          loading={crud.saving}
        />
      )}
    </div>
  )
}
