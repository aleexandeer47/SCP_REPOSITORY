import CrudPage from '../../../components/CrudPage/CrudPage'
import { materialCategoriesService } from '../../../services/materialCategoriesService'

const EMPTY_FORM = { descripcion: '' }

export default function CategoriaMateriales() {
  return (
    <CrudPage
      title="Categoría de materiales"
      service={materialCategoriesService}
      searchPlaceholder="Buscar"
      matches={(item, q) => item.descripcion.toLowerCase().includes(q)}
      columns={[
        { key: 'codigo', label: 'Código', width: 90, render: (_row, index) => index + 1 },
        { key: 'descripcion', label: 'Descripción de categoría' },
      ]}
      emptyForm={EMPTY_FORM}
      toFormState={(item) => ({ descripcion: item.descripcion })}
      toPayload={(form) => ({ descripcion: form.descripcion.trim() })}
      validate={(form) => {
        const errors = {}
        if (!form.descripcion.trim()) errors.descripcion = 'La descripción es obligatoria.'
        else if (form.descripcion.trim().length < 2) errors.descripcion = 'Mínimo 2 caracteres.'
        else if (form.descripcion.trim().length > 15) errors.descripcion = 'Máximo 15 caracteres.'
        return errors
      }}
      renderFields={({ form, setField, errors }) => (
        <label className="field">
          <span className="field-label">Descripción de categoría</span>
          <input
            type="text"
            maxLength={15}
            placeholder="Ej: Lácteos"
            value={form.descripcion}
            onChange={setField('descripcion')}
            className={errors.descripcion ? 'has-error' : ''}
          />
          {errors.descripcion && <span className="field-error">{errors.descripcion}</span>}
        </label>
      )}
      deleteMessage={(item) => `¿Eliminar la categoría "${item.descripcion}"? Los materiales que la usan quedarán sin categoría.`}
    />
  )
}
