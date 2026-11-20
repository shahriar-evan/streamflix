// Live, upcoming and finished matches from ESPN's public scoreboards.
// (TheSportsDB's old free key "3" was permanently disabled.)
export const dynamic = 'force-dynamic'

const BASE = 'https://site.api.espn.com/apis/site/v2/sports'

// [espn sport, league slug, our sport key]
const LEAGUES = [
  ['soccer', 'eng.1', 'football'],
  ['soccer', 'esp.1', 'football'],
  ['soccer', 'ger.1', 'football'],
  ['soccer', 'ita.1', 'football'],
  ['soccer', 'fra.1', 'football'],
  ['soccer', 'por.1', 'football'],
  ['soccer', 'ned.1', 'football'],
  ['soccer', 'ksa.1', 'football'],
  ['soccer', 'usa.1', 'football'],
  ['soccer', 'uefa.champions', 'football'],
  ['soccer', 'uefa.europa', 'football'],
  ['soccer', 'uefa.nations', 'football'],
  ['soccer', 'fifa.friendly', 'football'],
  ['basketball', 'nba', 'basketball'],
  ['hockey', 'nhl', 'hockey'],
  ['football', 'nfl', 'amfootball'],
  ['mma', 'ufc', 'mma'],
  ['racing', 'f1', 'motorsport'],
]

const get = async (url) => {
  const r = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(8000) })
  if (!r.ok) throw new Error(String(r.status))
  return r.json()
}

const team = (x) => {
  const t = x.team || x.athlete || {}
  return {
    name: t.displayName || t.shortDisplayName || t.name || 'TBA',
    short: t.abbreviation || '',
    logo: t.logo || t.logos?.[0]?.href || t.flag?.href || '',
    score: x.score == null ? '' : String(x.score),
  }
}

function normalize(e, sport, league) {
  const st = e.status?.type || {}
  const status = st.state === 'in' ? 'live' : st.state === 'post' ? 'finished' : 'upcoming'
  const c = e.competitions?.[0] || {}
  const cs = c.competitors || []
  const pair = cs.length === 2 && cs.every((x) => x.team)
  let team1 = null, team2 = null
  if (pair) {
    const home = cs.find((x) => x.homeAway === 'home') || cs[0]
    const away = cs.find((x) => x.homeAway === 'away') || cs[1]
    team1 = team(home)
    team2 = team(away)
  }
  return {
    id: `${league.slug}-${e.id}`,
    sport,
    league: league.name,
    leagueSlug: league.slug,
    leagueLogo: league.logo,
    title: pair ? null : e.name || e.shortName || league.name,
    team1, team2,
    status,
    start: e.date,
    detail: st.shortDetail || st.detail || '',
    note: c.status?.summary || e.status?.summary || '',
  }
}

async function espnLeague([espnSport, slug, sport]) {
  try {
    const d = await get(`${BASE}/${espnSport}/${slug}/scoreboard`)
    const lg = d.leagues?.[0] || {}
    const league = {
      slug,
      name: lg.abbreviation && lg.abbreviation.length > 3 ? lg.abbreviation : lg.name || slug,
      logo: lg.logos?.[0]?.href || '',
    }
    return (d.events || []).map((e) => normalize(e, sport, league))
  } catch {
    return []
  }
}

async function cricket() {
  try {
    const d = await get('https://site.web.api.espn.com/apis/site/v2/sports/cricket/scorepanel')
    const out = []
    for (const g of d.scores || []) {
      const lg = g.leagues?.[0] || {}
      const league = { slug: `cricket.${lg.id || lg.abbreviation || ''}`, name: lg.name || 'Cricket', logo: lg.logos?.[0]?.href || '' }
      for (const e of g.events || []) out.push(normalize(e, 'cricket', league))
    }
    return out
  } catch {
    return []
  }
}

export async function GET() {
  const groups = await Promise.all([...LEAGUES.map(espnLeague), cricket()])
  const seen = new Set()
  const matches = groups.flat().filter((m) => !seen.has(m.id) && seen.add(m.id))
  matches.sort((a, b) => new Date(a.start) - new Date(b.start))
  return Response.json(
    { updated: Date.now(), matches },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
