import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCollection } from '../../../hooks/useCollection'
import { partidasService } from '../../../services/partidasService'
import { unitCostsService, computeLineValue, sumLineValues, round2, CATEGORIES } from '../../../services/unitCostsService'
import { materialsEquipmentService } from '../../../services/materialsEquipmentService'
import { laborCategoriesService } from '../../../services/laborCategoriesService'
import { unitPricesService } from '../../../services/unitPricesService'
import { projectService } from '../../../services/projectService'
import { unitsMeasurementService } from '../../../services/unitsMeasurementService'
import Modal from '../../../components/Modal/Modal'
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog'
import { AlertIcon, ArrowLeftIcon, PencilIcon, PlusIcon, TrashIcon } from '../../../components/icons'
import './CostosUnitarios.css'

const SECTION_LABELS = {
  [CATEGORIES.EQUIPO]: 'Herramientas y equipo',
  [CATEGORIES.MATERIAL]: 'Materiales',
  [CATEGORIES.MANO_OBRA]: 'Mano de obra',
}

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`
}

const EMPTY_FORM = {
  codigo_m: '',
  codigo_pu: '',
  codigo_cat: '',
  unidad: '',
  cantidad: '',
  rendimiento: '',
  tarifa: '',
  he: '',
  hl: '',
}

export default function CostosUnitarios() {
  const { partidaId } = useParams()
  const navigate = useNavigate()

  const [partida, setPartida] = useState(null)
  const [generalForm, setGeneralForm] = useState({ codigo_proyecto: '', fecha: '', produccion_xdia: '', prestaciones_pct: '' })
  const [items, setItems] = useState([])
  const [loadingItems, setLoadingItems] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [generalError, setGeneralError] = useState('')

  const { items: materials } = useCollection(materialsEquipmentService)
  const { items: laborCategories } = useCollection(laborCategoriesService)
  const { items: unitPrices } = useCollection(unitPricesService)
  const { items: projects } = useCollection(projectService)
  const { items: units } = useCollection(unitsMeasurementService)

  // Every company defines its own Categoría de materiales however makes
  // sense for their industry (a bakery's "Repostería" category plays the
  // same role a construction company's "Herramientas" does) — so both
  // pickers offer the full materials catalog. Which section a line lands in
  // is decided by which "Agregar" button the user clicked, not by matching
  // a fixed category name.
  const loadPartida = useCallback(async () => {
    try {
      const found = await partidasService.get(partidaId)
      setPartida(found)
      setGeneralForm({
        codigo_proyecto: found?.codigo_proyecto?._id ?? found?.codigo_proyecto ?? '',
        fecha: found?.fecha || '',
        produccion_xdia: found?.produccion_xdia ?? '',
        prestaciones_pct: found?.prestaciones_pct ?? '',
      })
    } catch (err) {
      setLoadError(err.message || 'No se pudo cargar la partida.')
    }
  }, [partidaId])

  const reloadItems = useCallback(async () => {
    setLoadingItems(true)
    try {
      const all = await unitCostsService.list()
      setItems(all.filter((i) => i.codigo_p === partidaId))
    } catch (err) {
      setLoadError(err.message || 'No se pudieron cargar los costos unitarios.')
    } finally {
      setLoadingItems(false)
    }
  }, [partidaId])

  useEffect(() => {
    setLoadError('')
    loadPartida()
    reloadItems()
  }, [loadPartida, reloadItems])

  async function saveGeneralData(next) {
    const previous = generalForm
    setGeneralForm(next)
    setGeneralError('')
    try {
      // codigo_e is assigned server-side, so it's fine to omit here — only
      // the core fields plus the report-only extras need to be sent.
      const updated = await partidasService.update(partidaId, {
        nombre_actividad: partida.nombre_actividad,
        unidad_medida: partida.unidad_medida,
        cantidad_analizada: partida.cantidad_analizada,
        ...next,
      })
      setPartida(updated)
    } catch (err) {
      // The input already shows `next` optimistically — roll it back so the
      // field doesn't claim a value the backend never actually saved.
      setGeneralForm(previous)
      setGeneralError(err.message || 'No se pudieron guardar los datos generales.')
    }
  }

  const equipo = items.filter((i) => i.categoria === CATEGORIES.EQUIPO)
  const materiales = items.filter((i) => i.categoria === CATEGORIES.MATERIAL)
  const manoObra = items.filter((i) => i.categoria === CATEGORIES.MANO_OBRA)

  const totalEquipo = round2(sumLineValues(equipo))
  const totalMateriales = round2(sumLineValues(materiales))
  const subTotalManoObra = round2(sumLineValues(manoObra))
  const prestacionesPct = Number(generalForm.prestaciones_pct) || 0
  const totalManoObra = round2(subTotalManoObra * (1 + prestacionesPct / 100))
  const totalCostoUnitario = totalEquipo + totalMateriales + totalManoObra

  // ── Line item modal ──────────────────────────────────────────────────
  const [modal, setModal] = useState(null) // { categoria, item? }
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  function openCreate(categoria) {
    setForm({ ...EMPTY_FORM })
    setErrors({})
    setFormError('')
    setModal({ categoria })
  }

  function openEdit(item) {
    setForm({
      codigo_m: item.codigo_m?._id ?? item.codigo_m ?? '',
      codigo_pu: item.codigo_pu ?? '',
      codigo_cat: item.codigo_cat?._id ?? item.codigo_cat ?? '',
      unidad: item.unidad ?? '',
      cantidad: item.cantidad ?? '',
      rendimiento: item.rendimiento ?? '',
      tarifa: item.tarifa ?? '',
      he: '',
      hl: '',
    })
    setErrors({})
    setFormError('')
    setModal({ categoria: item.categoria, item })
  }

  function setField(key) {
    return (event) => {
      const value = event?.target ? event.target.value : event
      setForm((f) => {
        const next = { ...f, [key]: value }
        if (modal?.categoria === CATEGORIES.MATERIAL && key === 'codigo_pu') {
          const price = unitPrices.find((p) => p._id === value)
          if (price) {
            next.tarifa = price.precio_unitario
            next.unidad = price.codigo_u?.abreviatura || price.codigo_u?.nombre || ''
          }
        }
        if (modal?.categoria === CATEGORIES.MANO_OBRA && key === 'codigo_cat') {
          const cat = laborCategories.find((c) => c._id === value)
          if (cat) {
            next.tarifa = cat.precio
            next.unidad = cat.unidad
          }
        }
        if (key === 'he' || key === 'hl') {
          const he = Number(key === 'he' ? value : next.he)
          const hl = Number(key === 'hl' ? value : next.hl)
          if (he && hl > 0) {
            next.cantidad = (he / hl).toFixed(4)
          }
        }
        return next
      })
      setErrors((e) => (e[key] ? { ...e, [key]: '' } : e))
    }
  }

  const previewValue = computeLineValue({
    categoria: modal?.categoria,
    cantidad: form.cantidad,
    rendimiento: form.rendimiento,
    tarifa: form.tarifa,
  })

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    const categoria = modal.categoria
    if (categoria !== CATEGORIES.MANO_OBRA && !form.codigo_m) nextErrors.codigo_m = 'Selecciona un producto.'
    if (categoria === CATEGORIES.MATERIAL && !form.codigo_pu) nextErrors.codigo_pu = 'Selecciona un precio unitario.'
    if (categoria === CATEGORIES.MANO_OBRA && !form.codigo_cat) nextErrors.codigo_cat = 'Selecciona una categoría de mano de obra.'
    if (!form.cantidad || Number(form.cantidad) <= 0) nextErrors.cantidad = 'Ingresa una cantidad válida.'
    if (categoria !== CATEGORIES.MATERIAL && (!form.rendimiento || Number(form.rendimiento) <= 0)) nextErrors.rendimiento = 'Ingresa un rendimiento válido.'
    if (categoria === CATEGORIES.EQUIPO && (!form.tarifa || Number(form.tarifa) < 0)) nextErrors.tarifa = 'Ingresa un valor por hora.'
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setSaving(true)
    setFormError('')
    const payload = {
      codigo_p: partidaId,
      categoria,
      codigo_m: categoria === CATEGORIES.MANO_OBRA ? undefined : form.codigo_m,
      codigo_cat: categoria === CATEGORIES.MANO_OBRA ? form.codigo_cat : undefined,
      codigo_pu: categoria === CATEGORIES.MATERIAL ? form.codigo_pu : undefined,
      unidad: form.unidad,
      cantidad: Number(form.cantidad),
      rendimiento: categoria === CATEGORIES.MATERIAL ? undefined : Number(form.rendimiento),
      tarifa: Number(form.tarifa),
    }

    try {
      if (modal.item) await unitCostsService.update(modal.item._id, payload)
      else await unitCostsService.create(payload)
      await reloadItems()
      setModal(null)
    } catch (err) {
      setFormError(err.message || 'No se pudo guardar la línea.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setSaving(true)
    setDeleteError('')
    try {
      await unitCostsService.remove(deleteTarget._id)
      await reloadItems()
      setDeleteTarget(null)
    } catch (err) {
      setDeleteError(err.message || 'No se pudo eliminar la línea.')
    } finally {
      setSaving(false)
    }
  }

  function renderSection(categoria, sectionItems, extraColumns) {
    return (
      <div className="cu-section">
        <div className="cu-section-header">
          <h2>{SECTION_LABELS[categoria]}</h2>
          <button type="button" className="btn btn-secondary cu-add-btn" onClick={() => openCreate(categoria)}>
            <PlusIcon /> Agregar
          </button>
        </div>

        <div className="cu-table-wrap">
          <table className="cu-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Unidad</th>
                <th>Cantidad</th>
                {extraColumns}
                <th>Valor</th>
                <th className="cu-actions-head">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {!loadingItems && sectionItems.length === 0 && (
                <tr>
                  <td colSpan={5 + (extraColumns ? extraColumns.length : 0)} className="cu-empty">
                    Sin líneas todavía.
                  </td>
                </tr>
              )}
              {sectionItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.categoria === CATEGORIES.MANO_OBRA ? item.codigo_cat?.descripcion : item.codigo_m?.descripcion}</td>
                  <td>{item.unidad}</td>
                  <td>{item.cantidad}</td>
                  {item.categoria !== CATEGORIES.MATERIAL && <td>{item.rendimiento}</td>}
                  <td>{money(item.tarifa)}</td>
                  <td>{money(computeLineValue(item))}</td>
                  <td className="cu-actions">
                    <button type="button" className="data-table-icon-btn" onClick={() => openEdit(item)} aria-label="Editar">
                      <PencilIcon />
                    </button>
                    <button
                      type="button"
                      className="data-table-icon-btn data-table-icon-btn--danger"
                      onClick={() => {
                        setDeleteError('')
                        setDeleteTarget(item)
                      }}
                      aria-label="Eliminar"
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="cu-page">
      <div className="cu-header card">
        <Link className="crud-back-link" to="/catalogos/partidas">
          <ArrowLeftIcon /> Volver a partidas
        </Link>
        <h1>Costo unitario{partida ? ` — ${partida.nombre_actividad}` : ''}</h1>
        <p className="crud-page-subtitle">
          Unidad: {partida?.unidad_medida || '—'} · Cantidad analizada: {partida?.cantidad_analizada ?? '—'}
        </p>

        {loadError && (
          <p className="crud-form-alert" role="alert" style={{ marginTop: 14 }}>
            <AlertIcon className="crud-form-alert-icon" />
            {loadError}
            <button
              type="button"
              className="crud-retry-btn"
              onClick={() => {
                setLoadError('')
                loadPartida()
                reloadItems()
              }}
            >
              Reintentar
            </button>
          </p>
        )}

        {generalError && (
          <p className="crud-form-alert" role="alert" style={{ marginTop: 14 }}>
            <AlertIcon className="crud-form-alert-icon" />
            {generalError}
          </p>
        )}

        <div className="cu-general-form">
          <label className="field">
            <span className="field-label">Proyecto</span>
            <select value={generalForm.codigo_proyecto} onChange={(e) => saveGeneralData({ ...generalForm, codigo_proyecto: e.target.value })}>
              <option value="">Selecciona un proyecto</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.nombre_proyecto}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Fecha</span>
            <input type="date" value={generalForm.fecha} onChange={(e) => saveGeneralData({ ...generalForm, fecha: e.target.value })} />
          </label>
          <label className="field">
            <span className="field-label">Producción / día</span>
            <input type="number" min="0" step="0.01" value={generalForm.produccion_xdia} onChange={(e) => saveGeneralData({ ...generalForm, produccion_xdia: e.target.value })} />
          </label>
          <label className="field">
            <span className="field-label">Prestaciones (%)</span>
            <input type="number" min="0" step="0.01" value={generalForm.prestaciones_pct} onChange={(e) => saveGeneralData({ ...generalForm, prestaciones_pct: e.target.value })} />
          </label>
        </div>
      </div>

      {renderSection(CATEGORIES.EQUIPO, equipo, [<th key="rendimiento">Rendimiento</th>])}
      {renderSection(CATEGORIES.MATERIAL, materiales, null)}
      {renderSection(CATEGORIES.MANO_OBRA, manoObra, [<th key="rendimiento">Rendimiento</th>])}

      <div className="cu-totals card">
        <div className="cu-totals-row">
          <span>Total equipo y herramientas</span>
          <strong>{money(totalEquipo)}</strong>
        </div>
        <div className="cu-totals-row">
          <span>Total materiales</span>
          <strong>{money(totalMateriales)}</strong>
        </div>
        <div className="cu-totals-row">
          <span>Sub-total mano de obra</span>
          <strong>{money(subTotalManoObra)}</strong>
        </div>
        <div className="cu-totals-row cu-totals-row--muted">
          <span>Prestaciones ({prestacionesPct}%)</span>
          <strong>{money(totalManoObra - subTotalManoObra)}</strong>
        </div>
        <div className="cu-totals-row">
          <span>Total mano de obra</span>
          <strong>{money(totalManoObra)}</strong>
        </div>
        <div className="cu-totals-row cu-totals-row--final">
          <span>Costo unitario</span>
          <strong>{money(totalCostoUnitario)}</strong>
        </div>

        <button type="button" className="btn btn-primary cu-report-btn" onClick={() => navigate(`/reportes/costo-unitario/${partidaId}`)}>
          Ver / descargar desglose
        </button>
      </div>

      {modal && (
        <Modal
          title={`${modal.item ? 'Editar' : 'Agregar'} ${SECTION_LABELS[modal.categoria].toLowerCase()}`}
          onClose={() => setModal(null)}
          width="480px"
          footer={
            <>
              <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>
                Cancelar
              </button>
              <button type="submit" form="cu-line-form" className="btn btn-primary" disabled={saving}>
                {saving ? 'Guardando…' : 'Guardar'}
              </button>
            </>
          }
        >
          <form id="cu-line-form" className="crud-form" onSubmit={handleSubmit} noValidate>
            {formError && (
              <p className="crud-form-alert" role="alert">
                <AlertIcon className="crud-form-alert-icon" />
                {formError}
              </p>
            )}

            {modal.categoria === CATEGORIES.MATERIAL && (
              <>
                <label className="field">
                  <span className="field-label">Material</span>
                  <select value={form.codigo_m} onChange={setField('codigo_m')} className={errors.codigo_m ? 'has-error' : ''}>
                    <option value="">Selecciona un material</option>
                    {materials.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.descripcion}
                      </option>
                    ))}
                  </select>
                  {errors.codigo_m && <span className="field-error">{errors.codigo_m}</span>}
                </label>
                <label className="field">
                  <span className="field-label">Precio unitario</span>
                  <select value={form.codigo_pu} onChange={setField('codigo_pu')} disabled={!form.codigo_m} className={errors.codigo_pu ? 'has-error' : ''}>
                    <option value="">{form.codigo_m ? 'Selecciona un precio' : 'Elige un material primero'}</option>
                    {unitPrices
                      .filter((p) => (p.codigo_m?._id ?? p.codigo_m) === form.codigo_m)
                      .map((p) => (
                        <option key={p._id} value={p._id}>
                          {money(p.precio_unitario)} / {p.codigo_u?.abreviatura}
                        </option>
                      ))}
                  </select>
                  {errors.codigo_pu && <span className="field-error">{errors.codigo_pu}</span>}
                  {form.codigo_m && unitPrices.filter((p) => (p.codigo_m?._id ?? p.codigo_m) === form.codigo_m).length === 0 && (
                    <span className="field-hint">Este material no tiene precios en Ingreso de precios.</span>
                  )}
                </label>
              </>
            )}

            {modal.categoria === CATEGORIES.EQUIPO && (
              <>
                <label className="field">
                  <span className="field-label">Equipo / herramienta</span>
                  <select value={form.codigo_m} onChange={setField('codigo_m')} className={errors.codigo_m ? 'has-error' : ''}>
                    <option value="">Selecciona un equipo</option>
                    {materials.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.descripcion}
                      </option>
                    ))}
                  </select>
                  {errors.codigo_m && <span className="field-error">{errors.codigo_m}</span>}
                </label>
                <div className="field-row">
                  <label className="field">
                    <span className="field-label">Unidad</span>
                    <select value={form.unidad} onChange={setField('unidad')}>
                      <option value="">Selecciona una unidad</option>
                      {units.map((unit) => (
                        <option key={unit._id} value={unit.abreviatura || unit.nombre}>
                          {unit.nombre} ({unit.abreviatura})
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span className="field-label">Valor hora</span>
                    <span className="field-suffix">
                      <span className="field-suffix-label">$</span>
                      <input type="number" min="0" step="0.01" value={form.tarifa} onChange={setField('tarifa')} />
                    </span>
                    {errors.tarifa && <span className="field-error">{errors.tarifa}</span>}
                  </label>
                </div>
                <div className="cu-he-hl">
                  <span className="field-hint">Opcional: la cantidad se calcula sola como HE / HL al llenar ambos</span>
                  <div className="field-row">
                    <label className="field">
                      <span className="field-label">HE (horas equipo/día)</span>
                      <input type="number" min="0" step="0.01" value={form.he} onChange={setField('he')} />
                    </label>
                    <label className="field">
                      <span className="field-label">HL (horas jornada)</span>
                      <input type="number" min="0" step="0.01" value={form.hl} onChange={setField('hl')} />
                    </label>
                  </div>
                </div>
              </>
            )}

            {modal.categoria === CATEGORIES.MANO_OBRA && (
              <label className="field">
                <span className="field-label">Categoría de mano de obra</span>
                <select value={form.codigo_cat} onChange={setField('codigo_cat')} className={errors.codigo_cat ? 'has-error' : ''}>
                  <option value="">Selecciona una categoría</option>
                  {laborCategories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.descripcion} ({money(c.precio)}/{c.unidad})
                    </option>
                  ))}
                </select>
                {errors.codigo_cat && <span className="field-error">{errors.codigo_cat}</span>}
              </label>
            )}

            <div className="field-row">
              <label className="field">
                <span className="field-label">Cantidad</span>
                <input type="number" min="0" step="0.0001" value={form.cantidad} onChange={setField('cantidad')} className={errors.cantidad ? 'has-error' : ''} />
                {errors.cantidad && <span className="field-error">{errors.cantidad}</span>}
              </label>
              {modal.categoria !== CATEGORIES.MATERIAL && (
                <label className="field">
                  <span className="field-label">Rendimiento</span>
                  <input type="number" min="0" step="0.01" value={form.rendimiento} onChange={setField('rendimiento')} className={errors.rendimiento ? 'has-error' : ''} />
                  {errors.rendimiento && <span className="field-error">{errors.rendimiento}</span>}
                </label>
              )}
            </div>

            <label className="field">
              <span className="field-label">Valor calculado</span>
              <span className="field-suffix field-suffix--readonly">
                <span className="field-suffix-label">$</span>
                <input type="text" readOnly value={Number(previewValue || 0).toFixed(2)} />
              </span>
            </label>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message="¿Eliminar esta línea del desglose de costo unitario?"
          error={deleteError}
          onCancel={() => {
            setDeleteError('')
            setDeleteTarget(null)
          }}
          onConfirm={handleDelete}
          loading={saving}
        />
      )}
    </div>
  )
}
