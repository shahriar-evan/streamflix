// Checks stream links: does the playlist load, do its video segments load, and what is the
// highest resolution. Body: { urls: ["/api/proxy?url=..."] } → { results: { [url]: { ok, height, ms } } }
export const dynamic = 'force-dynamic'

const TTL = 90 * 1000
const cache = globalThis.__probeCache || (globalThis.__probeCache = new Map())

const headersFor = (u) => {
  const o = new URL(u).origin
  return { 'User-Agent': 'Mozilla/5.0', Referer: o + '/', Origin: o, Accept: '*/*' }
}

async function get(u, opts = {}) {
  return fetch(u, { headers: { ...headersFor(u), ...(opts.headers || {}) }, signal: AbortSignal.timeout(opts.timeout || 6000), redirect: 'follow' })
}

const abs = (base, line) => (line.startsWith('http') ? line : new URL(line, base).toString())
const heightFromName = (u) => +(u.match(/(2160|1440|1080|720|576|540|480|360)p?/i)?.[1] || 0)

async function checkMedia(url, text) {
  // media playlist: first segment must respond
  const seg = text.split('\n').map((l) => l.trim()).find((l) => l && !l.startsWith('#'))
  if (!seg) return false
  const r = await get(abs(url, seg), { headers: { Range: 'bytes=0-2047' }, timeout: 6000 })
  if (r.ok || r.status === 206) { try { await r.body?.cancel() } catch {} return true }
  return false
}

async function probe(target) {
  const t0 = Date.now()
  try {
    const r = await get(target)
    if (!r.ok) return { ok: false }
    const finalUrl = r.url || target
    const text = (await r.text()).slice(0, 200000)
    if (!text.includes('#EXTM3U')) return { ok: false }

    if (text.includes('#EXT-X-STREAM-INF')) {
      // master playlist: pick the highest variant and verify it plays
      const lines = text.split('\n').map((l) => l.trim())
      const variants = []
      lines.forEach((l, i) => {
        if (!l.startsWith('#EXT-X-STREAM-INF')) return
        const h = +(l.match(/RESOLUTION=\d+x(\d+)/)?.[1] || 0)
        const bw = +(l.match(/BANDWIDTH=(\d+)/)?.[1] || 0)
        const next = lines.slice(i + 1).find((x) => x && !x.startsWith('#'))
        if (next) variants.push({ h, bw, url: abs(finalUrl, next) })
      })
      variants.sort((a, b) => b.h - a.h || b.bw - a.bw)
      for (const v of variants.slice(0, 2)) {
        try {
          const vr = await get(v.url)
          if (!vr.ok) continue
          const vt = (await vr.text()).slice(0, 200000)
          if (vt.includes('#EXTINF') && (await checkMedia(v.url, vt))) {
            return { ok: true, height: v.h || heightFromName(v.url), ms: Date.now() - t0 }
          }
        } catch {}
      }
      return { ok: false }
    }

    if (!text.includes('#EXTINF')) return { ok: false }
    const ok = await checkMedia(finalUrl, text)
    return ok ? { ok: true, height: heightFromName(target), ms: Date.now() - t0 } : { ok: false }
  } catch {
    return { ok: false }
  }
}

const targetOf = (u) => {
  try {
    if (u.startsWith('/api/proxy')) return new URL(u, 'http://x').searchParams.get('url')
    return u
  } catch { return null }
}

async function pool(items, n, fn) {
  const out = []
  let i = 0
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k]) }
  }))
  return out
}

export async function POST(req) {
  const { urls = [] } = await req.json().catch(() => ({}))
  const list = [...new Set(urls)].slice(0, 200)
  const results = {}
  await pool(list, 16, async (u) => {
    const t = targetOf(u)
    if (!t) return (results[u] = { ok: false })
    const hit = cache.get(t)
    if (hit && Date.now() - hit.at < TTL) return (results[u] = hit.r)
    const r = await probe(t)
    cache.set(t, { at: Date.now(), r })
    results[u] = r
  })
  return Response.json({ results }, { headers: { 'Cache-Control': 'no-store' } })
}
