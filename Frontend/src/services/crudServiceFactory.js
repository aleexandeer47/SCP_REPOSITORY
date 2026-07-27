// Builds an in-memory mock CRUD service that mirrors the shape of the real
// SCP REST endpoints (list/get/create/update/remove over a Mongo _id).
// `populate` mimics Mongoose's `.populate()` — it resolves ref-id fields to
// their full nested object on read, the same way the real API responses do,
// so page components never have to change when the mock is swapped for fetch.

let idCounter = 1000
function nextId() {
  idCounter += 1
  return `mock_${idCounter}`
}

function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function createCrudService({ seed = [], populate } = {}) {
  let items = seed.map((item) => ({ _id: item._id || nextId(), ...item }))

  function resolveOne(item) {
    return populate ? populate(item) : item
  }

  return {
    // Synchronous escape hatch for other mock services that need to resolve
    // a ref field against this collection's current data (see populate()).
    raw: () => items,

    async list() {
      await delay()
      return items.map(resolveOne)
    },

    async get(id) {
      await delay()
      const item = items.find((i) => i._id === id)
      return item ? resolveOne(item) : null
    },

    async create(payload) {
      await delay()
      const created = { _id: nextId(), createdAt: new Date().toISOString(), ...payload }
      items = [created, ...items]
      return resolveOne(created)
    },

    async update(id, payload) {
      await delay()
      items = items.map((item) => (item._id === id ? { ...item, ...payload } : item))
      const updated = items.find((item) => item._id === id)
      if (!updated) throw new Error('Registro no encontrado.')
      return resolveOne(updated)
    },

    async remove(id) {
      await delay()
      items = items.filter((item) => item._id !== id)
    },
  }
}
