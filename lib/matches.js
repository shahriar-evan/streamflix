// Live, upcoming and finished matches from ESPN's public scoreboards (server-side).
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
    const d = await espnGet(`${ESPN_BASE}/${espnSport}/${slug}/scoreboard`)
    const league = leagueInfo(d, slug)
    return (d.events || []).map((e) => normalize(e, sport, league))
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
      for (const e of g.events || []) out.push(normalize(e, 'cricket', league))
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
