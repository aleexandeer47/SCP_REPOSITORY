// GET/POST/PUT/DELETE /api/partidas — Partidas: { nombre_actividad, unidad_medida,
// cantidad_analizada, codigo_proyecto, produccion_xdia, prestaciones_pct, fecha }.
// codigo_e is assigned server-side from the logged-in admin's company.
import { createRestService } from './api'

export const partidasService = createRestService('/partidas')
