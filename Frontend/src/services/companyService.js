// GET/PUT /api/empresas/me — the backend always scopes this to the logged-in
// admin's own company (from the JWT), so there's no id to pass and no way to
// read or edit another company's data.
import { request } from './api'

export const companyService = {
  getMine: () => request('/empresas/me'),
  updateMine: (payload) => request('/empresas/me', { method: 'PUT', body: JSON.stringify(payload) }),
}
