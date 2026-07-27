import { useState } from 'react'
import { useCrudList } from '../../hooks/useCrudList'
import CatalogToolbar from '../CatalogToolbar/CatalogToolbar'
import DataTable from '../DataTable/DataTable'
import Pagination from '../Pagination/Pagination'
import Modal from '../Modal/Modal'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import { AlertIcon } from '../icons'
import './CrudPage.css'

export default function CrudPage({
  title,
  headerExtra,
  service,
  columns,
  searchPlaceholder = 'Buscar',
  matches,
  filterFn,
  emptyForm,
  toFormState,
  toPayload,
  validate,
  renderFields,
  modalWidth,
  addLabel = 'Agregar',
  deleteMessage,
  toolbarExtra,
  hideAdd,
}) {
  const crud = useCrudList({ service, matches, filterFn })
  const [fieldErrors, setFieldErrors] = useState({})

  const editing = crud.modal?.item ?? null
  const [form, setForm] = useState(emptyForm)

  function openCreate() {
    setForm(emptyForm)
    setFieldErrors({})
    crud.setError('')
    crud.setModal({ mode: 'create' })
  }

  function openEdit(item) {
    setForm(toFormState(item))
    setFieldErrors({})
    crud.setError('')
    crud.setModal({ mode: 'edit', item })
  }

  function setField(key) {
    return (event) => {
      const value = event?.target ? event.target.value : event
      setForm((f) => ({ ...f, [key]: value }))
      setFieldErrors((e) => (e[key] ? { ...e, [key]: '' } : e))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const errors = validate ? validate(form, { isEditing: Boolean(editing) }) : {}
    if (errors && Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    await crud.handleSave(toPayload(form), editing?._id)
  }

  return (
    <div className="crud-page card">
      <div className="crud-page-header">
        <h1>{title}</h1>
        {headerExtra}
      </div>

      <div className="crud-page-body">
        {crud.loadError && (
          <p className="crud-form-alert" role="alert" style={{ marginBottom: 14 }}>
            <AlertIcon className="crud-form-alert-icon" />
            {crud.loadError}
            <button type="button" className="crud-retry-btn" onClick={crud.reload}>
              Reintentar
            </button>
          </p>
        )}

        <CatalogToolbar
          search={crud.search}
          onSearchChange={crud.setSearch}
          searchPlaceholder={searchPlaceholder}
          onAdd={hideAdd ? undefined : openCreate}
          addLabel={addLabel}
          extra={toolbarExtra}
        />

        <DataTable
          columns={columns}
          rows={crud.pageItems}
          rowKey={(row) => row._id}
          onEdit={openEdit}
          onDelete={(row) => {
            crud.setError('')
            crud.setDeleteTarget(row)
          }}
          loading={crud.loading}
        />

        <Pagination page={crud.page} pageCount={crud.pageCount} total={crud.total} pageSize={crud.pageSize} onPageChange={crud.setPage} />
      </div>

      {crud.modal && (
        <Modal
          title={editing ? `Editar ${title.toLowerCase()}` : `Agregar ${title.toLowerCase()}`}
          onClose={() => crud.setModal(null)}
          width={modalWidth}
          footer={
            <>
              <button type="button" className="btn btn-secondary" onClick={() => crud.setModal(null)}>
                Cancelar
              </button>
              <button type="submit" form="crud-page-form" className="btn btn-primary" disabled={crud.saving}>
                {crud.saving ? 'Guardando…' : 'Guardar'}
              </button>
            </>
          }
        >
          <form id="crud-page-form" className="crud-form" onSubmit={handleSubmit} noValidate>
            {crud.error && (
              <p className="crud-form-alert" role="alert">
                <AlertIcon className="crud-form-alert-icon" />
                {crud.error}
              </p>
            )}
            {renderFields({ form, setField, errors: fieldErrors, isEditing: Boolean(editing), editingItem: editing })}
          </form>
        </Modal>
      )}

      {crud.deleteTarget && (
        <ConfirmDialog
          message={deleteMessage ? deleteMessage(crud.deleteTarget) : '¿Seguro que quieres eliminar este registro? Esta acción no se puede deshacer.'}
          error={crud.error}
          onCancel={() => {
            crud.setError('')
            crud.setDeleteTarget(null)
          }}
          onConfirm={crud.handleDelete}
          loading={crud.saving}
        />
      )}
    </div>
  )
}
