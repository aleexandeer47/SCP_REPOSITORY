import { Link } from 'react-router-dom'
import CrudPage from '../../../components/CrudPage/CrudPage'
import { useCollection } from '../../../hooks/useCollection'
import { partidasService } from '../../../services/partidasService'
import { unitsMeasurementService } from '../../../services/unitsMeasurementService'
import { ChevronRightIcon, DocumentIcon } from '../../../components/icons'

const EMPTY_FORM = { nombre_actividad: '', unidad_medida: '', cantidad_analizada: '' }

export default function Partidas() {
  const { items: units } = useCollection(unitsMeasurementService)

  return (
    <CrudPage
      title="Partidas"
      service={partidasService}
      searchPlaceholder="Buscar"
      matches={(item, q) => item.nombre_actividad.toLowerCase().includes(q)}
      columns={[
        { key: 'codigo', label: 'Código', width: 90, render: (_row, index) => index + 1 },
        { key: 'nombre_actividad', label: 'Descripción de partida' },
        { key: 'unidad_medida', label: 'Unidad de medida', width: 140 },
        { key: 'cantidad_analizada', label: 'Cantidad analizada', width: 150, render: (row) => row.cantidad_analizada ?? '—' },
        {
          key: 'costos-unitarios',
          label: '',
          width: 250,
          render: (row) => (
            <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Link className="crud-link" to={`/catalogos/partidas/${row._id}/costos-unitarios`}>
                Costos unitarios <ChevronRightIcon />
              </Link>
              <Link className="crud-link" to={`/reportes/costo-unitario/${row._id}`}>
                <DocumentIcon /> PDF
              </Link>
            </span>
          ),
        },
      ]}
      emptyForm={EMPTY_FORM}
      toFormState={(item) => ({
        nombre_actividad: item.nombre_actividad,
        unidad_medida: item.unidad_medida,
        cantidad_analizada: item.cantidad_analizada ?? '',
      })}
      toPayload={(form) => ({
        nombre_actividad: form.nombre_actividad.trim(),
        unidad_medida: form.unidad_medida,
        cantidad_analizada: form.cantidad_analizada === '' ? undefined : Number(form.cantidad_analizada),
      })}
      validate={(form) => {
        const errors = {}
        if (!form.nombre_actividad.trim()) errors.nombre_actividad = 'La descripción de la partida es obligatoria.'
        else if (form.nombre_actividad.trim().length < 2) errors.nombre_actividad = 'Mínimo 2 caracteres.'
        if (!form.unidad_medida) errors.unidad_medida = 'Selecciona una unidad de medida.'
        return errors
      }}
      renderFields={({ form, setField, errors }) => (
        <>
          <label className="field">
            <span className="field-label">Descripción de partida</span>
            <input
              type="text"
              placeholder="Ej: Excavación de zanjas"
              value={form.nombre_actividad}
              onChange={setField('nombre_actividad')}
              className={errors.nombre_actividad ? 'has-error' : ''}
            />
            {errors.nombre_actividad && <span className="field-error">{errors.nombre_actividad}</span>}
          </label>
          <div className="field-row">
            <label className="field">
              <span className="field-label">Unidad de medida</span>
              <select value={form.unidad_medida} onChange={setField('unidad_medida')} className={errors.unidad_medida ? 'has-error' : ''}>
                <option value="">Selecciona una unidad</option>
                {units.map((unit) => (
                  <option key={unit._id} value={unit.abreviatura || unit.nombre}>
                    {unit.nombre} ({unit.abreviatura})
                  </option>
                ))}
              </select>
              {errors.unidad_medida && <span className="field-error">{errors.unidad_medida}</span>}
            </label>
            <label className="field">
              <span className="field-label">Cantidad analizada</span>
              <input type="number" min="0" step="0.01" placeholder="0" value={form.cantidad_analizada} onChange={setField('cantidad_analizada')} />
            </label>
          </div>
        </>
      )}
      deleteMessage={(item) => `¿Eliminar la partida "${item.nombre_actividad}"? También se perderán sus costos unitarios.`}
    />
  )
}
