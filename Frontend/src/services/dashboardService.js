// Aggregates the Inicio/Dashboard summary from real, already-company-scoped
// endpoints — there's no dedicated /api/dashboard on the backend, so this
// just fetches a few lists in parallel and derives everything client-side.
import { partidasService } from './partidasService'
import { materialsEquipmentService } from './materialsEquipmentService'
import { adminUsersService } from './adminUsersService'
import { unitCostsService, computeLineValue } from './unitCostsService'
import { formatRelativeTime } from '../utils/relativeTime'

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

function startOfWeek(date) {
  const d = new Date(date)
  const day = (d.getDay() + 6) % 7 // Monday = 0
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - day)
  return d
}

function buildWeeklyChart(unitCosts) {
  const now = new Date()
  const thisWeekStart = startOfWeek(now)
  // Last 4 weeks including the current one, oldest first.
  const weekStarts = [3, 2, 1, 0].map((n) => new Date(thisWeekStart.getTime() - n * WEEK_MS))

  const totals = weekStarts.map(() => 0)
  for (const item of unitCosts) {
    const created = new Date(item.createdAt)
    for (let i = weekStarts.length - 1; i >= 0; i--) {
      if (created >= weekStarts[i]) {
        totals[i] += computeLineValue(item)
        break
      }
    }
  }

  const formatDate = (d) => d.toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const rangeEnd = new Date(weekStarts[3].getTime() + WEEK_MS - 1)

  return {
    dateRangeLabel: `${formatDate(weekStarts[0])} - ${formatDate(rangeEnd)}`,
    data: totals.map((value, i) => ({ label: `Semana ${i + 1}`, value: Math.round(value * 100) / 100 })),
  }
}

export async function getDashboardSummary() {
  const [partidas, materiales, usuarios, unitCosts] = await Promise.all([
    partidasService.list(),
    materialsEquipmentService.list(),
    adminUsersService.list(),
    unitCostsService.list(),
  ])

  const recentPartidas = [...partidas]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4)
    .map((p) => ({
      id: p._id,
      primary: p.nombre_actividad,
      secondary: p.unidad_medida ? `Unidad: ${p.unidad_medida}` : undefined,
      time: formatRelativeTime(p.createdAt),
      href: `/catalogos/partidas/${p._id}/costos-unitarios`,
    }))

  const lastPartida = recentPartidas[0]

  return {
    counts: {
      partidas: partidas.length,
      materiales: materiales.length,
      usuarios: usuarios.length,
    },
    lastPartida,
    recentPartidas,
    monthlyChart: buildWeeklyChart(unitCosts),
  }
}
