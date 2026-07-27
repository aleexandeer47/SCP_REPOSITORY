// Thin fetch wrapper around the real SCP backend (Backend/app.js mounts
// everything under /api/*). In dev, vite.config.js proxies /api to
// http://localhost:4000 so this stays same-origin and the httpOnly
// session cookie just works.

const BASE = '/api'

// Registered by AuthContext so a 401/403 from any request can clear the
// cached session (e.g. the cookie expired or was rejected server-side).
let onAuthInvalid = null
export function setAuthInvalidHandler(fn) {
  onAuthInvalid = fn
}

// Status codes below never carry a backend-authored JSON message — 502/503/504
// mean the request never reached the backend at all (it's down, or the Vite
// proxy in vite.config.js can't reach it), so `res.json()` gets an HTML error
// page or nothing. Anything else without a `message` is genuinely unexpected.
const GATEWAY_ERROR_MESSAGE = 'No se pudo conectar con el servidor. Verifica que esté encendido e inténtalo de nuevo.'

export async function request(path, options = {}) {
  const { skipAuthHandler, ...fetchOptions } = options

  // Guard against accidentally passing a path that already starts with
  // /api (every createRestService basePath must NOT include it) — silently
  // doubling up to /api/api/... produces a 404 that's easy to misread as a
  // backend routing problem instead of a frontend URL-building bug.
  const url = path.startsWith('/api/') ? path : `${BASE}${path}`

  let res
  try {
    res = await fetch(url, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...fetchOptions.headers },
      ...fetchOptions,
    })
  } catch {
    // fetch() itself only throws for network-level failures (offline, DNS,
    // connection refused before any HTTP response) — same underlying
    // problem as a 502/503/504, so it gets the same message.
    throw new Error(GATEWAY_ERROR_MESSAGE)
  }

  if (res.status === 204) return null

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if ((res.status === 401 || res.status === 403) && !skipAuthHandler) {
      onAuthInvalid?.()
    }
    if ([502, 503, 504].includes(res.status) && !data.message) {
      throw new Error(GATEWAY_ERROR_MESSAGE)
    }
    throw new Error(data.message || `No se pudo completar la solicitud (error ${res.status}).`)
  }
  return data
}

// Builds a { list, get, create, update, remove } service against a REST
// resource, matching the shape createCrudService (the old in-memory mock)
// used — so swapping a service file from mock to real API never touches
// the pages that consume it.
//
// `basePath` must NOT include the /api prefix — request() adds that itself
// (e.g. pass '/materiales-equipos', not '/api/materiales-equipos').
export function createRestService(basePath) {
  return {
    list: (query) => request(`${basePath}${query ? `?${new URLSearchParams(query)}` : ''}`),
    get: (id) => request(`${basePath}/${id}`),
    create: (payload) => request(basePath, { method: 'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => request(`${basePath}/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    remove: (id) => request(`${basePath}/${id}`, { method: 'DELETE' }),
  }
}
