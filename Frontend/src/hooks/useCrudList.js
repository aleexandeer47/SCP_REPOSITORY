import { useCallback, useEffect, useMemo, useState } from 'react'

const DEFAULT_PAGE_SIZE = 8

export function useCrudList({ service, matches, filterFn, pageSize = DEFAULT_PAGE_SIZE }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null) // { mode: 'create' | 'edit', item? }
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const data = await service.list()
      setItems(data)
    } catch (err) {
      setLoadError(err.message || 'No se pudieron cargar los datos.')
    } finally {
      setLoading(false)
    }
  }, [service])

  useEffect(() => {
    reload()
  }, [reload])

  useEffect(() => {
    setPage(1)
  }, [search])

  const scoped = useMemo(() => (filterFn ? items.filter(filterFn) : items), [items, filterFn])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return scoped
    return scoped.filter((item) => matches(item, q))
  }, [scoped, search, matches])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  async function handleSave(payload, id) {
    setSaving(true)
    setError('')
    try {
      if (id) await service.update(id, payload)
      else await service.create(payload)
      await reload()
      setModal(null)
    } catch (err) {
      setError(err.message || 'No se pudo guardar el registro.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setSaving(true)
    setError('')
    try {
      await service.remove(deleteTarget._id)
      await reload()
      setDeleteTarget(null)
    } catch (err) {
      // Leave the dialog open so the error is visible next to the button
      // the user just clicked, instead of vanishing with nowhere to show it.
      setError(err.message || 'No se pudo eliminar el registro.')
    } finally {
      setSaving(false)
    }
  }

  return {
    items,
    loading,
    loadError,
    search,
    setSearch,
    page,
    setPage,
    pageCount,
    pageItems,
    total: filtered.length,
    pageSize,
    modal,
    setModal,
    deleteTarget,
    setDeleteTarget,
    saving,
    error,
    setError,
    handleSave,
    handleDelete,
    reload,
  }
}
