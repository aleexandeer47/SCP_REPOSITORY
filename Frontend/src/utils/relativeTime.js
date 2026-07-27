const UNITS = [
  { limit: 60, divisor: 1, unit: 'segundo' },
  { limit: 3600, divisor: 60, unit: 'minuto' },
  { limit: 86400, divisor: 3600, unit: 'hora' },
  { limit: 2592000, divisor: 86400, unit: 'día' },
  { limit: 31536000, divisor: 2592000, unit: 'mes' },
  { limit: Infinity, divisor: 31536000, unit: 'año' },
]

// "Hace 2 horas", "Hace 3 días" — used anywhere we show how recent a record is.
export function formatRelativeTime(dateInput) {
  if (!dateInput) return ''
  const date = new Date(dateInput)
  if (Number.isNaN(date.getTime())) return ''

  const seconds = Math.max(0, (Date.now() - date.getTime()) / 1000)
  if (seconds < 30) return 'Hace un momento'

  const { divisor, unit } = UNITS.find((u) => seconds < u.limit)
  const value = Math.floor(seconds / divisor)
  const plural = value === 1 ? unit : `${unit}s`
  return `Hace ${value} ${plural}`
}
