export function formatDate(ts) {
  if (!ts) return ''
  try { return new Date(ts).toLocaleString() } catch { return String(ts) }
}

export function uid(prefix='id') {
  return `${prefix}_${Math.random().toString(36).slice(2,9)}`
}
