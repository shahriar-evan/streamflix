// Live, upcoming and finished matches from ESPN's public scoreboards (server-side).
import { teamFlag } from './flags'
import { ESPN_BASE, LEAGUES, espnGet, espnTeam, leagueInfo } from './leagues'

function normalize(e, sport, league) {
  const st = e.status?.type || {}
  const status = st.state === 'in' ? 'live' : st.state === 'post' ? 'finished' : 'upcoming'
  const c = e.competitions?.[0] || {}
  const cs = c.competitors || []
  const pair = cs.length === 2 && cs.every((x) => x.team)
  let team1 = null, team2 = null
  if (pair) {
    team1 = espnTeam(cs.find((x) => x.homeAway === 'home') || cs[0])
    team2 = espnTeam(cs.find((x) => x.homeAway === 'away') || cs[1])
    // Backup logo (country flag) for when the team image is missing or fails to load
    for (const t of [team1, team2]) {
      const flag = teamFlag(t.name, league.name)
      if (!t.logo) t.logo = flag
      else if (flag && sport === 'cricket') t.alt = flag
    }
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

// ESPN keeps some events "in progress" when nobody is actually playing:
// multi-day cricket at Stumps, or feeds that stopped updating. Those are dropped.
const H = 3600 * 1000
const MAX_LIVE = { t20: 5 * H, short: 10 * H, other: 6 * H }

function reallyLive(e, sport, now = Date.now()) {
  const st = e.status?.type || {}
  if (st.state !== 'in') return true
  const age = now - new Date(e.date).getTime()
  if (sport !== 'cricket') return age < MAX_LIVE.other
  const desc = `${st.description || ''} ${st.detail || ''}`.toLowerCase()
  if (/stumps|abandon|no play|delayed|postponed/.test(desc)) return false
  if (!e.status?.period && age > 2 * H) return false // never got going: stale feed
  const cls = (e.competitions?.[0]?.class?.generalClassCard || '').toLowerCase()
  if (/t20|twenty20|hundred|t10/.test(cls)) return age < MAX_LIVE.t20
  if (/list a|od|one-day|odi/.test(cls)) return age < MAX_LIVE.short
  return true
}

async function espnLeague([espnSport, slug, sport]) {
  try {
    const d = await espnGet(`${ESPN_BASE}/${espnSport}/${slug}/scoreboard`)
    const league = leagueInfo(d, slug)
    return (d.events || []).filter((e) => reallyLive(e, sport)).map((e) => normalize(e, sport, league))
  } catch {
    return []
  }
}

async function cricket() {
  try {
    const d = await espnGet('https://site.web.api.espn.com/apis/site/v2/sports/cricket/scorepanel')
    const out = []
    for (const g of d.scores || []) {
      const lg = g.leagues?.[0] || {}
      const league = { slug: `cricket.${lg.id || lg.abbreviation || ''}`, name: lg.name || 'Cricket', logo: lg.logos?.[0]?.href || '' }
      for (const e of g.events || []) if (reallyLive(e, 'cricket')) out.push(normalize(e, 'cricket', league))
    }
    return out
  } catch {
    return []
  }
}

export async function getMatches() {
  const groups = await Promise.all([...LEAGUES.map(espnLeague), cricket()])
  const seen = new Set()
  const matches = groups.flat().filter((m) => !seen.has(m.id) && seen.add(m.id))
  matches.sort((a, b) => new Date(a.start) - new Date(b.start))
  return matches
}
