import CrudPage from '../../components/CrudPage/CrudPage'
import { useCollection } from '../../hooks/useCollection'
import { indirectCostsService } from '../../services/indirectCostsService'
import { materialsEquipmentService } from '../../services/materialsEquipmentService'

const EMPTY_FORM = { codigo_m: '', precio: '' }

function money(value) {
  return `$${Number(value ?? 0).toFixed(2)}`
}

export default function CostosIndirectos() {
  const { items: materials } = useCollection(materialsEquipmentService)

  return (
    <CrudPage
      title="Costos indirectos"
      service={indirectCostsService}
      searchPlaceholder="Buscar por nombre o código de producto"
      matches={(item, q) => item.codigo_m?.descripcion?.toLowerCase().includes(q)}
      columns={[
        { key: 'codigo', label: 'Código del producto', width: 130, render: (_row, index) => index + 1 },
        { key: 'nombre', label: 'Nombre', render: (row) => row.codigo_m?.descripcion ?? '—' },
        { key: 'precio', label: 'Precio', width: 120, render: (row) => money(row.precio) },
      ]}
      emptyForm={EMPTY_FORM}
      toFormState={(item) => ({ codigo_m: item.codigo_m?._id ?? item.codigo_m ?? '', precio: item.precio })}
      toPayload={(form) => ({ codigo_m: form.codigo_m, precio: Number(form.precio) })}
      validate={(form) => {
        const errors = {}
        if (!form.codigo_m) errors.codigo_m = 'Selecciona un producto.'
        if (form.precio === '' || Number.isNaN(Number(form.precio)) || Number(form.precio) < 0) errors.precio = 'Ingresa un precio válido.'
        return errors
      }}
      renderFields={({ form, setField, errors, isEditing, editingItem }) => (
        <>
          <label className="field">
            <span className="field-label">Código del producto</span>
            <input type="text" readOnly disabled value={isEditing ? (editingItem._id.slice(-6).toUpperCase()) : 'Se asigna al guardar'} />
          </label>

          <label className="field">
            <span className="field-label">Nombre del producto</span>
            {isEditing ? (
              <input type="text" readOnly disabled value={editingItem.codigo_m?.descripcion ?? ''} />
            ) : (
              <select value={form.codigo_m} onChange={setField('codigo_m')} className={errors.codigo_m ? 'has-error' : ''}>
                <option value="">Selecciona un producto</option>
                {materials.map((mat) => (
                  <option key={mat._id} value={mat._id}>
                    {mat.descripcion}
                  </option>
                ))}
              </select>
            )}
            {errors.codigo_m && <span className="field-error">{errors.codigo_m}</span>}
          </label>

          <div className="field-row">
            <label className="field">
              <span className="field-label">Nuevo precio</span>
              <span className="field-suffix">
                <span className="field-suffix-label">$</span>
                <input type="number" min="0" step="0.01" value={form.precio} onChange={setField('precio')} />
              </span>
              {errors.precio && <span className="field-error">{errors.precio}</span>}
            </label>
            <label className="field">
              <span className="field-label">Precio actual</span>
              <span className="field-suffix field-suffix--readonly">
                <span className="field-suffix-label">$</span>
                <input type="text" readOnly value={isEditing ? Number(editingItem.precio).toFixed(2) : '—'} />
              </span>
            </label>
          </div>
        </>
      )}
      deleteMessage={(item) => `¿Eliminar el costo indirecto de "${item.codigo_m?.descripcion}"?`}
    />
  )
}
