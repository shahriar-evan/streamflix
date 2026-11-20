// Finished matches from the last 3 days that have highlight clips playable in the app
// (ESPN-hosted MP4s). Matches without playable clips are left out.
import { ESPN_BASE, LEAGUES, espnGet, espnTeam, leagueInfo, pool } from '../../../lib/leagues'

export const dynamic = 'force-dynamic'

const WINDOW_MS = 3 * 24 * 3600 * 1000
const FRESH_MS = 15 * 60 * 1000
const state = globalThis.__hl || (globalThis.__hl = { at: 0, data: null, running: null })

const ymd = (d) => d.toISOString().slice(0, 10).replace(/-/g, '')

function clipsFrom(summary) {
  return (summary.videos || [])
    .map((v) => {
      const src = v.links?.source?.HD?.href || v.links?.source?.href || v.links?.source?.full?.href
      if (!src || !/\.mp4(\?|$)/i.test(src)) return null
      return {
        id: String(v.id),
        title: v.headline || v.title || 'Highlight',
        duration: v.duration || 0,
        thumb: v.thumbnail || v.images?.[0]?.url || '',
        src,
      }
    })
    .filter(Boolean)
}

async function build() {
  const now = Date.now()
  const dates = [0, 1, 2, 3].map((n) => ymd(new Date(now - n * 86400000)))
  const jobs = LEAGUES.filter(([, , sport]) => sport !== 'motorsport').flatMap((lg) => dates.map((d) => [lg, d]))

  const finished = []
  await pool(jobs, 12, async ([[espnSport, slug, sport], date]) => {
    try {
      const d = await espnGet(`${ESPN_BASE}/${espnSport}/${slug}/scoreboard?dates=${date}`)
      const league = leagueInfo(d, slug)
      for (const e of d.events || []) {
        if (e.status?.type?.state !== 'post') continue
        if (now - new Date(e.date).getTime() > WINDOW_MS) continue
        const cs = e.competitions?.[0]?.competitors || []
        const pair = cs.length === 2 && cs.every((x) => x.team)
        const home = pair ? cs.find((x) => x.homeAway === 'home') || cs[0] : null
        const away = pair ? cs.find((x) => x.homeAway === 'away') || cs[1] : null
        finished.push({
          id: `${slug}-${e.id}`, eventId: e.id, espnSport, slug, sport,
          league: league.name, leagueSlug: slug, leagueLogo: league.logo,
          title: pair ? null : e.name, team1: home && espnTeam(home), team2: away && espnTeam(away),
          status: 'finished', start: e.date, detail: e.status?.type?.shortDetail || 'FT', note: '',
        })
      }
    } catch {}
  })

  const seen = new Set()
  const unique = finished.filter((m) => !seen.has(m.id) && seen.add(m.id))
  await pool(unique, 10, async (m) => {
    try {
      const s = await espnGet(`${ESPN_BASE}/${m.espnSport}/${m.slug}/summary?event=${m.eventId}`)
      m.clips = clipsFrom(s)
    } catch { m.clips = [] }
  })

  return unique
    .filter((m) => m.clips?.length)
    .map(({ espnSport, slug, eventId, ...m }) => m)
    .sort((a, b) => new Date(b.start) - new Date(a.start))
}

function refresh() {
  if (!state.running) {
    state.running = build()
      .then((data) => { state.data = data; state.at = Date.now() })
      .catch(() => {})
      .finally(() => { state.running = null })
  }
  return state.running
}

export async function GET() {
  if (!state.data) await refresh()
  else if (Date.now() - state.at > FRESH_MS) refresh() // serve current list, update in background
  // Drop anything older than 3 days even from a cached list
  const cutoff = Date.now() - WINDOW_MS
  const highlights = (state.data || []).filter((m) => new Date(m.start).getTime() >= cutoff)
  return Response.json({ updated: state.at, highlights }, { headers: { 'Cache-Control': 'no-store' } })
}
