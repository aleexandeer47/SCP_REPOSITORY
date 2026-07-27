// GET/POST/PUT/DELETE /api/costos-unitarios — one line of a Partida's
// "Desglose de Costo Unitario" (categoria: equipo | material | mano_obra).
// codigo_e is assigned server-side; pass { codigo_p } to list() to scope to
// one partida (matches Backend/src/controller/unitCostsController.js's
// ?codigo_p= query filter).
import { createRestService } from './api'

export const CATEGORIES = {
  EQUIPO: 'equipo',
  MATERIAL: 'material',
  MANO_OBRA: 'mano_obra',
}

export const unitCostsService = createRestService('/costos-unitarios')

// Materiales: Cantidad x Precio Unitario.
// Equipo / Mano de obra: (Cantidad / Rendimiento) x Valor Hora (o Salario/Hora).
export function computeLineValue({ categoria, cantidad, rendimiento, tarifa }) {
  const qty = Number(cantidad) || 0
  const rate = Number(tarifa) || 0
  if (categoria === CATEGORIES.MATERIAL) {
    return qty * rate
  }
  const yieldFactor = Number(rendimiento) || 1
  return (qty / yieldFactor) * rate
}

export function sumLineValues(items) {
  return items.reduce((sum, item) => sum + computeLineValue(item), 0)
}

// The reference document rounds each displayed subtotal to cents before
// carrying it into the next step (e.g. Sub-Total mano de obra is rounded
// before Prestaciones% is applied to it) rather than rounding only once at
// the very end — match that or the final total drifts by a cent.
export function round2(value) {
  return Math.round((Number(value) || 0) * 100) / 100
}
