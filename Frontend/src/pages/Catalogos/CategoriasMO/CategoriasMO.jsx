import CrudPage from '../../../components/CrudPage/CrudPage'
import { laborCategoriesService } from '../../../services/laborCategoriesService'

const EMPTY_FORM = { descripcion: '', unidad: '', precio: '' }

export default function CategoriasMO() {
  return (
    <CrudPage
      title="Categorías de mano de obra"
      service={laborCategoriesService}
      searchPlaceholder="Buscar"
      matches={(item, q) => item.descripcion.toLowerCase().includes(q)}
      columns={[
        { key: 'codigo', label: 'Código', width: 90, render: (_row, index) => index + 1 },
        { key: 'descripcion', label: 'Descripción' },
        { key: 'unidad', label: 'Unidad', width: 100 },
        { key: 'precio', label: 'Precio', width: 120, render: (row) => `$${Number(row.precio).toFixed(2)}` },
      ]}
      emptyForm={EMPTY_FORM}
      toFormState={(item) => ({ descripcion: item.descripcion, unidad: item.unidad, precio: item.precio })}
      toPayload={(form) => ({ descripcion: form.descripcion.trim(), unidad: form.unidad.trim(), precio: Number(form.precio) })}
      validate={(form) => {
        const errors = {}
        if (!form.descripcion.trim()) errors.descripcion = 'La descripción es obligatoria.'
        else if (form.descripcion.trim().length < 2) errors.descripcion = 'Mínimo 2 caracteres.'
        if (!form.unidad.trim()) errors.unidad = 'La unidad es obligatoria.'
        else if (form.unidad.trim().length < 2) errors.unidad = 'Mínimo 2 caracteres.'
        if (form.precio === '' || Number.isNaN(Number(form.precio)) || Number(form.precio) < 0) errors.precio = 'Ingresa un precio válido.'
        return errors
      }}
      renderFields={({ form, setField, errors }) => (
        <>
          <label className="field">
            <span className="field-label">Descripción</span>
            <input
              type="text"
              placeholder="Ej: Albañil"
              value={form.descripcion}
              onChange={setField('descripcion')}
              className={errors.descripcion ? 'has-error' : ''}
            />
            {errors.descripcion && <span className="field-error">{errors.descripcion}</span>}
          </label>
          <div className="field-row">
            <label className="field">
              <span className="field-label">Unidad</span>
              <input type="text" placeholder="Ej: día" value={form.unidad} onChange={setField('unidad')} className={errors.unidad ? 'has-error' : ''} />
              {errors.unidad && <span className="field-error">{errors.unidad}</span>}
            </label>
            <label className="field">
              <span className="field-label">Precio</span>
              <span className="field-suffix">
                <span className="field-suffix-label">$</span>
                <input type="number" min="0" step="0.01" value={form.precio} onChange={setField('precio')} />
              </span>
              {errors.precio && <span className="field-error">{errors.precio}</span>}
            </label>
          </div>
        </>
      )}
      deleteMessage={(item) => `¿Eliminar la categoría de mano de obra "${item.descripcion}"?`}
    />
  )
}
