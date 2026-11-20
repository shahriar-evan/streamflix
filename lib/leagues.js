// ESPN leagues used for matches and highlights: [espn sport, league slug, our sport key]
export const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports'

export const LEAGUES = [
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

export const espnGet = async (url, timeout = 8000) => {
  // Cached for 30s: pages render instantly and scores are never more than ~30s old
  const r = await fetch(url, { next: { revalidate: 30 }, signal: AbortSignal.timeout(timeout) })
  if (!r.ok) throw new Error(String(r.status))
  return r.json()
}

export const espnTeam = (x) => {
  const t = x.team || x.athlete || {}
  return {
    name: t.displayName || t.shortDisplayName || t.name || 'TBA',
    short: t.abbreviation || '',
    logo: t.logo || t.logos?.[0]?.href || t.flag?.href || '',
    score: x.score == null ? '' : String(x.score),
  }
}

export const leagueInfo = (d, slug) => {
  const lg = d.leagues?.[0] || {}
  return {
    slug,
    name: lg.abbreviation && lg.abbreviation.length > 3 ? lg.abbreviation : lg.name || slug,
    logo: lg.logos?.[0]?.href || '',
  }
}

export async function pool(items, n, fn) {
  const out = []
  let i = 0
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k]) }
  }))
  return out
}
