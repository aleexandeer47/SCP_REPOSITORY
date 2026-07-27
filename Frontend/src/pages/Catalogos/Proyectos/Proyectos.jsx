import CrudPage from '../../../components/CrudPage/CrudPage'
import { projectService } from '../../../services/projectService'

const EMPTY_FORM = { nombre_proyecto: '', direccion: '', cliente: '' }

export default function Proyectos() {
  return (
    <CrudPage
      title="Proyectos"
      service={projectService}
      searchPlaceholder="Buscar"
      matches={(item, q) => item.nombre_proyecto.toLowerCase().includes(q) || item.cliente?.toLowerCase().includes(q)}
      columns={[
        { key: 'codigo', label: 'Código', width: 90, render: (_row, index) => index + 1 },
        { key: 'nombre_proyecto', label: 'Nombre del proyecto' },
        { key: 'direccion', label: 'Dirección' },
        { key: 'cliente', label: 'Cliente', render: (row) => row.cliente || '—' },
      ]}
      emptyForm={EMPTY_FORM}
      toFormState={(item) => ({ nombre_proyecto: item.nombre_proyecto, direccion: item.direccion, cliente: item.cliente || '' })}
      toPayload={(form) => ({
        nombre_proyecto: form.nombre_proyecto.trim(),
        direccion: form.direccion.trim(),
        cliente: form.cliente.trim() || undefined,
      })}
      validate={(form) => {
        const errors = {}
        if (!form.nombre_proyecto.trim()) errors.nombre_proyecto = 'El nombre del proyecto es obligatorio.'
        else if (form.nombre_proyecto.trim().length < 2) errors.nombre_proyecto = 'Mínimo 2 caracteres.'
        if (!form.direccion.trim()) errors.direccion = 'La dirección es obligatoria.'
        else if (form.direccion.trim().length < 2) errors.direccion = 'Mínimo 2 caracteres.'
        if (form.cliente.trim() && form.cliente.trim().length < 2) errors.cliente = 'Mínimo 2 caracteres.'
        return errors
      }}
      renderFields={({ form, setField, errors }) => (
        <>
          <label className="field">
            <span className="field-label">Nombre del proyecto</span>
            <input
              type="text"
              placeholder="Ej: Remodelación sucursal centro"
              value={form.nombre_proyecto}
              onChange={setField('nombre_proyecto')}
              className={errors.nombre_proyecto ? 'has-error' : ''}
            />
            {errors.nombre_proyecto && <span className="field-error">{errors.nombre_proyecto}</span>}
          </label>
          <label className="field">
            <span className="field-label">Dirección</span>
            <input
              type="text"
              placeholder="Ej: Av. España, San Salvador"
              value={form.direccion}
              onChange={setField('direccion')}
              className={errors.direccion ? 'has-error' : ''}
            />
            {errors.direccion && <span className="field-error">{errors.direccion}</span>}
          </label>
          <label className="field">
            <span className="field-label">Cliente (opcional)</span>
            <input
              type="text"
              placeholder="Ej: Wendy's"
              value={form.cliente}
              onChange={setField('cliente')}
              className={errors.cliente ? 'has-error' : ''}
            />
            {errors.cliente && <span className="field-error">{errors.cliente}</span>}
          </label>
        </>
      )}
      deleteMessage={(item) => `¿Eliminar el proyecto "${item.nombre_proyecto}"?`}
    />
  )
}
