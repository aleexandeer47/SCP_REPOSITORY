// GET/POST/PUT/DELETE /api/unidades-medida — UnitsMeasurement: { nombre, abreviatura }.
// codigo_e is assigned server-side from the logged-in admin's company.
import { createRestService } from './api'

export const unitsMeasurementService = createRestService('/unidades-medida')
