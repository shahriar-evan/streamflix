'use client'
// Client-side cache of stream checks (/api/probe). Shared by every screen.

const TTL = 4 * 60 * 1000
const CHUNK = 18
const cache = new Map() // url -> { ok, height, ms, at }
const inflight = new Map() // url -> Promise
const listeners = new Set()

const emit = () => listeners.forEach((fn) => fn())
export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

const fresh = (u) => {
  const c = cache.get(u)
  return c && Date.now() - c.at < TTL
}

export const resultFor = (url) => (fresh(url) ? cache.get(url) : null)

export function markFailed(url) {
  cache.set(url, { ok: false, height: 0, ms: 0, at: Date.now() })
  emit()
}

function requestChunk(urls) {
  const p = fetch('/api/probe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls }),
  })
    .then((r) => r.json())
    .then((d) => {
      const now = Date.now()
      for (const u of urls) cache.set(u, { ...(d.results?.[u] || { ok: false }), at: now })
    })
    .catch(() => {})
    .finally(() => {
      urls.forEach((u) => inflight.delete(u))
      emit()
    })
  urls.forEach((u) => inflight.set(u, p))
  return p
}

// Check urls (skipping fresh/in-flight ones). Resolves when all of them have a result.
export async function check(urls) {
  const need = [...new Set(urls)].filter((u) => !fresh(u) && !inflight.has(u))
  for (let i = 0; i < need.length; i += CHUNK) requestChunk(need.slice(i, i + CHUNK))
  await Promise.all(urls.map((u) => inflight.get(u)).filter(Boolean))
  return urls.map((u) => resultFor(u) || { ok: false })
}

// Rank: highest resolution first (unknown counts as ~480p), then fastest response
export const score = (r) => (r.height || 480) * 10 - Math.min(r.ms || 0, 9000) / 10

// Channel summary for badges: 'ok' | 'off' | 'unknown', plus best height
export function channelStatus(ch) {
  let best = null
  let unknown = false
  for (const s of ch.servers) {
    const r = resultFor(s.url)
    if (!r) { unknown = true; continue }
    if (r.ok && (!best || score(r) > score(best))) best = r
  }
  if (best) return { state: 'ok', height: best.height }
  return { state: unknown ? 'unknown' : 'off', height: 0 }
}

export const qualityLabel = (h) => (h >= 2160 ? '4K' : h >= 1080 ? 'FHD' : h >= 720 ? 'HD' : h ? `${h}p` : '')
