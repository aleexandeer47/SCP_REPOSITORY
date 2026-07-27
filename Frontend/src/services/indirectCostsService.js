// GET/POST/PUT/DELETE /api/costos-indirectos — IndirectCosts: { precio, codigo_m }.
// codigo_e is assigned server-side from the logged-in admin's company.
import { createRestService } from './api'

export const indirectCostsService = createRestService('/costos-indirectos')
