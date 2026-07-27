import { Link } from 'react-router-dom'
import CrudPage from '../../components/CrudPage/CrudPage'
import { adminUsersService } from '../../services/adminUsersService'
import { useAuth } from '../../context/AuthContext'
import { ArrowLeftIcon } from '../../components/icons'

const EMPTY_FORM = { usuario: '', email: '', contrasena: '' }

export default function Usuarios() {
  const { user } = useAuth()

  return (
    <CrudPage
      title={`Usuarios${user?.codigo_e?.nombre ? ` — ${user.codigo_e.nombre}` : ''}`}
      headerExtra={
        <Link className="crud-back-link" to="/mi-empresa">
          <ArrowLeftIcon /> Volver a mi empresa
        </Link>
      }
      service={adminUsersService}
      searchPlaceholder="Buscar por usuario o correo"
      matches={(item, q) => item.usuario.toLowerCase().includes(q) || item.email.toLowerCase().includes(q)}
      columns={[
        { key: 'usuario', label: 'Usuario' },
        { key: 'email', label: 'Correo electrónico' },
      ]}
      emptyForm={EMPTY_FORM}
      toFormState={(item) => ({ usuario: item.usuario, email: item.email, contrasena: '' })}
      toPayload={(form) => {
        const payload = { usuario: form.usuario.trim(), email: form.email.trim().toLowerCase() }
        if (form.contrasena) payload.contrasena = form.contrasena
        return payload
      }}
      validate={(form, { isEditing } = {}) => {
        const errors = {}
        if (!form.usuario.trim() || form.usuario.trim().length < 3) errors.usuario = 'Mínimo 3 caracteres.'
        if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Correo inválido.'
        if (!isEditing && (!form.contrasena || form.contrasena.length < 6)) errors.contrasena = 'Mínimo 6 caracteres.'
        else if (form.contrasena && form.contrasena.length < 6) errors.contrasena = 'Mínimo 6 caracteres.'
        return errors
      }}
      renderFields={({ form, setField, errors, isEditing }) => (
        <>
          <label className="field">
            <span className="field-label">Usuario</span>
            <input
              type="text"
              placeholder="Ej: katia"
              value={form.usuario}
              onChange={setField('usuario')}
              className={errors.usuario ? 'has-error' : ''}
            />
            {errors.usuario && <span className="field-error">{errors.usuario}</span>}
          </label>

          <label className="field">
            <span className="field-label">Correo electrónico</span>
            <input
              type="email"
              placeholder="correo@empresa.com"
              value={form.email}
              onChange={setField('email')}
              className={errors.email ? 'has-error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>

          <label className="field">
            <span className="field-label">{isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña'}</span>
            <input
              type="password"
              placeholder={isEditing ? 'Dejar en blanco para no cambiarla' : 'Mínimo 6 caracteres'}
              value={form.contrasena}
              onChange={setField('contrasena')}
              className={errors.contrasena ? 'has-error' : ''}
            />
            {errors.contrasena && <span className="field-error">{errors.contrasena}</span>}
          </label>
        </>
      )}
      deleteMessage={(item) => `¿Eliminar al usuario "${item.usuario}"?`}
    />
  )
}
