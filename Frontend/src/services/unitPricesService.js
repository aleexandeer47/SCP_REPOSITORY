// GET/POST/PUT/DELETE /api/precios-unitarios — UnitPrices: { precio, presentacion,
// precio_unitario, codigo_m, codigo_u }. codigo_e is assigned server-side.
import { createRestService } from './api'

export const unitPricesService = createRestService('/precios-unitarios')
