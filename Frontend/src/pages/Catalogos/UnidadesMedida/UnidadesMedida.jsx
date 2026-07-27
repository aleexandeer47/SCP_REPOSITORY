import CrudPage from '../../../components/CrudPage/CrudPage'
import { unitsMeasurementService } from '../../../services/unitsMeasurementService'

const EMPTY_FORM = { nombre: '', abreviatura: '' }

export default function UnidadesMedida() {
  return (
    <CrudPage
      title="Unidades de medida"
      service={unitsMeasurementService}
      searchPlaceholder="Buscar"
      matches={(item, q) => item.nombre.toLowerCase().includes(q) || item.abreviatura?.toLowerCase().includes(q)}
      columns={[
        { key: 'codigo', label: 'Código', width: 90, render: (_row, index) => index + 1 },
        { key: 'nombre', label: 'Nombre de la unidad de medida' },
        { key: 'abreviatura', label: 'Abreviatura', width: 120 },
      ]}
      emptyForm={EMPTY_FORM}
      toFormState={(item) => ({ nombre: item.nombre, abreviatura: item.abreviatura || '' })}
      toPayload={(form) => ({ nombre: form.nombre.trim(), abreviatura: form.abreviatura.trim() })}
      validate={(form) => {
        const errors = {}
        if (!form.nombre.trim()) errors.nombre = 'El nombre es obligatorio.'
        else if (form.nombre.trim().length < 2) errors.nombre = 'Mínimo 2 caracteres.'
        if (form.abreviatura.trim().length > 5) errors.abreviatura = 'Máximo 5 caracteres.'
        return errors
      }}
      renderFields={({ form, setField, errors }) => (
        <div className="field-row">
          <label className="field">
            <span className="field-label">Nombre de la unidad</span>
            <input
              type="text"
              placeholder="Ej: Kilogramo"
              value={form.nombre}
              onChange={setField('nombre')}
              className={errors.nombre ? 'has-error' : ''}
            />
            {errors.nombre && <span className="field-error">{errors.nombre}</span>}
          </label>
          <label className="field">
            <span className="field-label">Abreviatura</span>
            <input
              type="text"
              maxLength={5}
              placeholder="Ej: kg"
              value={form.abreviatura}
              onChange={setField('abreviatura')}
              className={errors.abreviatura ? 'has-error' : ''}
            />
            {errors.abreviatura && <span className="field-error">{errors.abreviatura}</span>}
          </label>
        </div>
      )}
      deleteMessage={(item) => `¿Eliminar la unidad "${item.nombre}"?`}
    />
  )
}
