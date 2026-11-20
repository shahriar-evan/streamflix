const pad = (n) => String(n).padStart(2, '0')

export function formatTime(iso) {
  const d = new Date(iso)
  if (isNaN(d)) return ''
  let h = d.getHours()
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${pad(h)}:${pad(d.getMinutes())} ${ampm}`
}

export function formatDate(iso) {
  const d = new Date(iso)
  if (isNaN(d)) return ''
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

export function dayLabel(iso) {
  const d = new Date(iso)
  const today = new Date()
  const diff = Math.round((new Date(d.toDateString()) - new Date(today.toDateString())) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  return formatDate(iso)
}

// Matches "near now": live, starting within 8h, or finished within the last 8h
export function isRecent(m, now = Date.now()) {
  if (m.status === 'live') return true
  const t = new Date(m.start).getTime()
  const H = 3600 * 1000
  if (m.status === 'upcoming') return t - now < 8 * H
  return now - t < 10 * H
}

const PALETTE = ['#e50914', '#2563eb', '#16a34a', '#f97316', '#7c3aed', '#0891b2', '#db2777', '#ca8a04']
export function colorFor(text = '') {
  let h = 0
  for (const c of text) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return PALETTE[h % PALETTE.length]
}

export function initials(name = '') {
  const w = name.replace(/[^\p{L}\p{N} ]/gu, '').trim().split(/\s+/).filter(Boolean)
  if (!w.length) return '?'
  return (w.length === 1 ? w[0].slice(0, 2) : w[0][0] + w[1][0]).toUpperCase()
}
