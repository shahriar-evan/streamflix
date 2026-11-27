// Ball-by-ball live data for a cricket match (ESPN play-by-play).
// GET /api/live?id=cricket.<leagueId>-<eventId>
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const BASE = 'https://site.web.api.espn.com/apis/site/v2/sports/cricket'
const cache = new Map() // id -> { at, data }
const TTL = 15 * 1000

async function get(url) {
  const r = await fetch(url, { cache: 'no-store', headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!r.ok) throw new Error(`ESPN ${r.status}`)
  return r.json()
}

function ballLabel(it) {
  const t = (it.playType?.description || '').toLowerCase()
  const v = it.scoreValue ?? 0
  if (it.dismissal?.dismissal || t === 'out') return { l: 'W', k: 'w' }
  if (t.includes('wide')) return { l: v > 1 ? `${v}wd` : 'wd', k: 'x' }
  if (t.includes('no ball')) return { l: v > 1 ? `${v}nb` : 'nb', k: 'x' }
  if (t === 'six' || v === 6) return { l: '6', k: 's' }
  if (t === 'four' || v === 4) return { l: '4', k: 'f' }
  if (t.includes('bye')) return { l: `${v}b`, k: 'x' }
  return { l: String(v || '•'), k: v ? 'r' : 'd' }
}

const bat = (b) => b?.athlete && { name: b.athlete.displayName, runs: b.totalRuns ?? 0, balls: b.faced ?? 0, fours: b.fours ?? 0, sixes: b.sixes ?? 0 }
const bowl = (b) => b?.athlete && { name: b.athlete.displayName, overs: b.overs ?? 0, runs: b.conceded ?? 0, wkts: b.wickets ?? 0, maidens: b.maidens ?? 0 }

async function load(league, event) {
  const url = (p) => `${BASE}/${league}/playbyplay?event=${event}${p ? `&page=${p}` : ''}`
  const first = (await get(url())).commentary || {}
  const pages = first.pageCount || 1
  let items = first.items || []
  if (pages > 1) {
    const [a, b] = await Promise.all([get(url(pages)), pages > 2 ? get(url(pages - 1)) : Promise.resolve(null)])
    items = [...(b?.commentary?.items || (pages === 2 ? first.items : [])), ...(a.commentary?.items || [])]
  }
  items = items.filter((x) => x.over).sort((x, y) => (x.sequence || 0) - (y.sequence || 0))
  const last = items[items.length - 1]
  if (!last) return { available: false }

  const inn = last.innings || {}
  const striker = last.batsman?.athlete?.id && !last.dismissal?.dismissal ? last.batsman : null
  return {
    available: true,
    batting: last.team?.displayName || '',
    innings: last.periodText || '',
    score: { runs: inn.runs ?? 0, wkts: inn.wickets ?? 0, overs: last.over?.overs ?? 0, limit: inn.ballLimit ? inn.ballLimit / 6 : null, rr: inn.runRate ?? null, target: inn.target || 0 },
    batters: [bat(striker), bat(last.otherBatsman)].filter(Boolean),
    bowler: bowl(last.bowler),
    recent: items.slice(-18).map((it) => ({ over: it.over.actual, ...ballLabel(it) })),
    commentary: items.slice(-12).reverse().map((it) => ({
      over: it.over.actual,
      text: it.shortText || '',
      more: (it.text || '').replace(/<[^>]+>/g, '').slice(0, 280),
      ...ballLabel(it),
    })),
  }
}

export async function GET(req) {
  const id = new URL(req.url).searchParams.get('id') || ''
  const m = id.match(/^cricket\.(\d+)-(\d+)$/)
  if (!m) return NextResponse.json({ available: false }, { status: 400 })
  const hit = cache.get(id)
  if (hit && Date.now() - hit.at < TTL) return NextResponse.json(hit.data)
  try {
    const data = await load(m[1], m[2])
    cache.set(id, { at: Date.now(), data })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(hit?.data || { available: false })
  }
}
