const LABELS = ['', 'Muy débil', 'Débil', 'Media', 'Fuerte']
const COLORS = ['', '#c94b4b', '#d97b3d', '#c9a53d', '#2f8f7a']

export function usePasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' }

  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  return { score, label: LABELS[score], color: COLORS[score] }
}
