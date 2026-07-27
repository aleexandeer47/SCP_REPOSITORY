import CrudPage from '../../../components/CrudPage/CrudPage'
import { useCollection } from '../../../hooks/useCollection'
import { materialsEquipmentService } from '../../../services/materialsEquipmentService'
import { materialCategoriesService } from '../../../services/materialCategoriesService'

const EMPTY_FORM = { descripcion: '', codigo_cm: '' }

export default function Materiales() {
  const { items: categories } = useCollection(materialCategoriesService)

  return (
    <CrudPage
      title="Materiales"
      service={materialsEquipmentService}
      searchPlaceholder="Buscar"
      matches={(item, q) => item.descripcion.toLowerCase().includes(q) || item.codigo_cm?.descripcion?.toLowerCase().includes(q)}
      columns={[
        { key: 'codigo', label: 'Código', width: 90, render: (_row, index) => index + 1 },
        { key: 'categoria', label: 'Categoría', render: (row) => row.codigo_cm?.descripcion ?? '—' },
        { key: 'descripcion', label: 'Material' },
      ]}
      emptyForm={EMPTY_FORM}
      toFormState={(item) => ({ descripcion: item.descripcion, codigo_cm: item.codigo_cm?._id ?? item.codigo_cm ?? '' })}
      toPayload={(form) => ({ descripcion: form.descripcion.trim(), codigo_cm: form.codigo_cm })}
      validate={(form) => {
        const errors = {}
        if (!form.descripcion.trim()) errors.descripcion = 'El nombre del material es obligatorio.'
        else if (form.descripcion.trim().length < 2) errors.descripcion = 'Mínimo 2 caracteres.'
        if (!form.codigo_cm) errors.codigo_cm = 'Selecciona una categoría.'
        return errors
      }}
      renderFields={({ form, setField, errors }) => (
        <>
          <label className="field">
            <span className="field-label">Categoría</span>
            <select value={form.codigo_cm} onChange={setField('codigo_cm')} className={errors.codigo_cm ? 'has-error' : ''}>
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.descripcion}
                </option>
              ))}
            </select>
            {errors.codigo_cm && <span className="field-error">{errors.codigo_cm}</span>}
          </label>
          <label className="field">
            <span className="field-label">Material</span>
            <input
              type="text"
              placeholder="Ej: Leche entera"
              value={form.descripcion}
              onChange={setField('descripcion')}
              className={errors.descripcion ? 'has-error' : ''}
            />
            {errors.descripcion && <span className="field-error">{errors.descripcion}</span>}
          </label>
        </>
      )}
      deleteMessage={(item) => `¿Eliminar el material "${item.descripcion}"?`}
    />
  )
}
