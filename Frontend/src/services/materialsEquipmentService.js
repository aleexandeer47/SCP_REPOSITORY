// GET/POST/PUT/DELETE /api/materiales-equipos — MaterialsEquipment: { descripcion, codigo_cm }.
// codigo_e is assigned server-side from the logged-in admin's company.
import { createRestService } from './api'

export const materialsEquipmentService = createRestService('/materiales-equipos')
