import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { partidasService } from '../../../services/partidasService'
import { unitCostsService, computeLineValue, sumLineValues, round2, CATEGORIES } from '../../../services/unitCostsService'
import { AlertIcon, ArrowLeftIcon } from '../../../components/icons'
import './CostoUnitarioReporte.css'

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`
}

function formatDate(value) {
  if (!value) return '—'
  const [year, month, day] = value.split('-')
  if (!year || !month || !day) return value
  return `${day}/${month}/${year}`
}

export default function CostoUnitarioReporte() {
  const { partidaId } = useParams()
  const [partida, setPartida] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // partidasService.get() already populates codigo_proyecto and codigo_e
  // (Backend/src/controller/partidasController.js), so the project/company
  // info rides along on the partida itself — no need for extra requests.
  const load = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const foundPartida = await partidasService.get(partidaId)
      setPartida(foundPartida)

      const all = await unitCostsService.list()
      setItems(all.filter((i) => i.codigo_p === partidaId))
    } catch (err) {
      setLoadError(err.message || 'No se pudo cargar el desglose de costo unitario.')
    } finally {
      setLoading(false)
    }
  }, [partidaId])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return <p className="report-loading">Cargando desglose…</p>
  }

  if (loadError) {
    return (
      <div className="report-screen">
        <div className="report-toolbar no-print">
          <Link className="crud-back-link" to={`/catalogos/partidas/${partidaId}/costos-unitarios`}>
            <ArrowLeftIcon /> Volver
          </Link>
        </div>
        <p className="crud-form-alert" role="alert" style={{ maxWidth: 900, margin: '0 auto' }}>
          <AlertIcon className="crud-form-alert-icon" />
          {loadError}
          <button type="button" className="crud-retry-btn" onClick={load}>
            Reintentar
          </button>
        </p>
      </div>
    )
  }

  if (!partida) {
    return <p className="report-loading">Partida no encontrada.</p>
  }

  const project = partida.codigo_proyecto
  const company = partida.codigo_e

  const equipo = items.filter((i) => i.categoria === CATEGORIES.EQUIPO)
  const materiales = items.filter((i) => i.categoria === CATEGORIES.MATERIAL)
  const manoObra = items.filter((i) => i.categoria === CATEGORIES.MANO_OBRA)

  const totalEquipo = round2(sumLineValues(equipo))
  const totalMateriales = round2(sumLineValues(materiales))
  const subTotalManoObra = round2(sumLineValues(manoObra))
  const prestacionesPct = Number(partida.prestaciones_pct) || 0
  const prestacionesValor = round2(subTotalManoObra * (prestacionesPct / 100))
  const totalManoObra = round2(subTotalManoObra + prestacionesValor)
  const totalCostoUnitario = totalEquipo + totalMateriales + totalManoObra
  const shortCode = partida._id.slice(-6).toUpperCase()

  return (
    <div className="report-screen">
      <div className="report-toolbar no-print">
        <Link className="crud-back-link" to={`/catalogos/partidas/${partidaId}/costos-unitarios`}>
          <ArrowLeftIcon /> Volver
        </Link>
        <button type="button" className="btn btn-primary" onClick={() => window.print()}>
          Imprimir / Descargar PDF
        </button>
      </div>

      <div className="report-sheet">
        <h1 className="report-title">DESGLOSE DE COSTO UNITARIO</h1>

        <table className="report-info-table">
          <tbody>
            <tr>
              <th>Nombre del Proyecto</th>
              <th>Nombre de la Empresa</th>
            </tr>
            <tr>
              <td>{project?.nombre_proyecto || '—'}</td>
              <td>{company?.nombre || '—'}</td>
            </tr>
          </tbody>
        </table>

        <table className="report-info-table">
          <tbody>
            <tr>
              <th style={{ width: '14%' }}>Fecha</th>
              <th>Nombre de la Actividad</th>
              <th style={{ width: '18%' }}>Código de Partida</th>
            </tr>
            <tr>
              <td rowSpan={2}>{formatDate(partida.fecha)}</td>
              <td className="report-activity-name">{partida.nombre_actividad}</td>
              <td rowSpan={2}>{shortCode}</td>
            </tr>
            <tr>
              <td>
                <table className="report-subgrid">
                  <tbody>
                    <tr>
                      <th>Unidad</th>
                      <th>Cantidad Analizada</th>
                      <th>Producción / Día</th>
                    </tr>
                    <tr>
                      <td>{partida.unidad_medida}</td>
                      <td>{partida.cantidad_analizada ?? '—'}</td>
                      <td>{Number(partida.produccion_xdia || 0).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        <p className="report-section-title">HERRAMIENTAS Y EQUIPO</p>
        <table className="report-line-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre del Equipo</th>
              <th>Unidad</th>
              <th>*Cantidad</th>
              <th>Rendimiento</th>
              <th>Valor Hora</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {equipo.map((item) => (
              <tr key={item._id}>
                <td>{(item.codigo_m?._id ?? '').slice(-6).toUpperCase()}</td>
                <td>{item.codigo_m?.descripcion}</td>
                <td>{item.unidad}</td>
                <td>{Number(item.cantidad).toFixed(2)}</td>
                <td>{Number(item.rendimiento).toFixed(2)}</td>
                <td>{money(item.tarifa)}</td>
                <td>{money(computeLineValue(item))}</td>
              </tr>
            ))}
            <tr className="report-total-row">
              <td colSpan={6}>Total Equipo y Herramientas</td>
              <td>{money(totalEquipo)}</td>
            </tr>
          </tbody>
        </table>

        <p className="report-section-title">MATERIALES</p>
        <table className="report-line-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Unidad</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {materiales.map((item) => (
              <tr key={item._id}>
                <td>{(item.codigo_m?._id ?? '').slice(-6).toUpperCase()}</td>
                <td>{item.codigo_m?.descripcion}</td>
                <td>{item.unidad}</td>
                <td>{Number(item.cantidad).toFixed(2)}</td>
                <td>{money(item.tarifa)}</td>
                <td>{money(computeLineValue(item))}</td>
              </tr>
            ))}
            <tr className="report-total-row">
              <td colSpan={5}>Total Materiales</td>
              <td>{money(totalMateriales)}</td>
            </tr>
          </tbody>
        </table>

        <p className="report-section-title">MANO DE OBRA</p>
        <table className="report-line-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Unidad</th>
              <th>Cantidad</th>
              <th>Rendimiento</th>
              <th>Salario/Hora</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {manoObra.map((item) => (
              <tr key={item._id}>
                <td>{(item.codigo_cat?._id ?? '').slice(-6).toUpperCase()}</td>
                <td>{item.codigo_cat?.descripcion}</td>
                <td>{item.unidad}</td>
                <td>{Number(item.cantidad).toFixed(2)}</td>
                <td>{Number(item.rendimiento).toFixed(2)}</td>
                <td>{money(item.tarifa)}</td>
                <td>{money(computeLineValue(item))}</td>
              </tr>
            ))}
            <tr className="report-subtotal-row">
              <td colSpan={6}>Sub-Total</td>
              <td>{money(subTotalManoObra)}</td>
            </tr>
            <tr>
              <td colSpan={5}>Prestaciones</td>
              <td>{prestacionesPct}%</td>
              <td></td>
            </tr>
            <tr className="report-total-row">
              <td colSpan={6}>Total Mano de Obra ( Sub Total + Prestaciones )</td>
              <td>{money(totalManoObra)}</td>
            </tr>
          </tbody>
        </table>

        <table className="report-line-table report-final-table">
          <tbody>
            <tr className="report-total-row">
              <td>Total Costo Unitario ( Materiales + Mano de Obra + Equipo )</td>
              <td>{money(totalCostoUnitario)}</td>
            </tr>
          </tbody>
        </table>

        <div className="report-final-box">
          <span>Costo Unitario</span>
          <strong>{money(totalCostoUnitario)}</strong>
        </div>

        <div className="report-notes">
          <p>*Cantidad = (HE / HL).</p>
          <p>HE: Horas que el equipo empleará en producción / día.</p>
          <p>HL: Horas laborales establecidas por la empresa para la jornada diaria.</p>
        </div>
      </div>
    </div>
  )
}
