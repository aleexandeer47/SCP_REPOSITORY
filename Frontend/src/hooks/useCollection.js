import { useEffect, useState } from 'react'

// Loads a full list once (for populating <select> options), independent of
// the paginated/searchable list a CrudPage manages via useCrudList.
export function useCollection(service) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError('')
    service
      .list()
      .then((data) => {
        if (alive) setItems(data)
      })
      .catch((err) => {
        if (alive) setError(err.message || 'No se pudieron cargar las opciones.')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [service])

  return { items, loading, error }
}
