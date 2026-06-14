export const revalidate = 60 // refresh every 60s

const FLAGS = {
  'Qatar':'🇶🇦','Switzerland':'🇨🇭','Brazil':'🇧🇷','Morocco':'🇲🇦',
  'Haiti':'🇭🇹','Scotland':'🏴󠁧󠁢󠁳󠁣󠁴󠁿','Australia':'🇦🇺','Türkiye':'🇹🇷','Turkey':'🇹🇷',
  'Germany':'🇩🇪','Curaçao':'🏝️','Netherlands':'🇳🇱','Japan':'🇯🇵',
  'Ivory Coast':'🇨🇮','Ecuador':'🇪🇨','Sweden':'🇸🇪','Tunisia':'🇹🇳',
  'England':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','France':'🇫🇷','Spain':'🇪🇸','Argentina':'🇦🇷',
  'USA':'🇺🇸','Portugal':'🇵🇹','Italy':'🇮🇹','Belgium':'🇧🇪',
  'Croatia':'🇭🇷','Mexico':'🇲🇽','South Africa':'🇿🇦','Canada':'🇨🇦',
  'Bangladesh':'🇧🇩','India':'🇮🇳','Pakistan':'🇵🇰','West Indies':'🏝️',
  'Afghanistan':'🇦🇫','Sri Lanka':'🇱🇰','New Zealand':'🇳🇿',
  'WI':'🏝️','WI-W':'🏝️','NZ-W':'🇳🇿','BAN-W':'🇧🇩','IND-W':'🇮🇳',
  'PAK-W':'🇵🇰','NED-W':'🇳🇱','AUS-W':'🇦🇺','SA-W':'🇿🇦',
  'South Korea':'🇰🇷','Czechia':'🇨🇿','Serbia':'🇷🇸','Poland':'🇵🇱',
  'Bosnia and Herzegovina':'🇧🇦','Paraguay':'🇵🇾','Curaçao':'🏝️',
}

const getFlag = (n) => {
  if (!n) return '🏳️'
  for (const [k, v] of Object.entries(FLAGS)) {
    if (n.toLowerCase().includes(k.toLowerCase())) return v
  }
  return '🏳️'
}

const HOT = ['FIFA WORLD CUP','WORLD CUP','NBA','ICC','WIMBLEDON','STANLEY CUP','UFC','CHAMPIONS LEAGUE','PREMIER LEAGUE','BANGLADESH']
const isHot = (t='') => HOT.some(h => t.toUpperCase().includes(h))

const CHANNELS = {
  football:    ['fifa_wc','dsports','tudn','bein_tr','fox_eng','wctv','m6','telemundo','caze','espn'],
  cricket:     ['tsports','bangla_fifa','star1','star2','willow','sony1','sony2','sony3','espn','dsports','tensports','cricketgold'],
  basketball:  ['espn','tnt','nbatv','fs1'],
  baseball:    ['espn2','espn'],
  tennis:      ['eurosport','dazn'],
  hockey:      ['espn','tnt'],
  mma:         ['espn','dazn','dazncombat','tnt'],
  motorsport:  ['f1tv','dazn','redbull','eurosport'],
}

const SPORTS = [
  { key: 'soccer',     cat: 'football' },
  { key: 'cricket',    cat: 'cricket' },
  { key: 'basketball', cat: 'basketball' },
  { key: 'baseball',   cat: 'baseball' },
  { key: 'tennis',     cat: 'tennis' },
  { key: 'ice_hockey', cat: 'hockey' },
  { key: 'mma',        cat: 'mma' },
  { key: 'motorsport', cat: 'motorsport' },
]

const UPCOMING_LEAGUES = [
  { id: '4328', cat: 'football' },   // FIFA World Cup 2026
  { id: '4794', cat: 'cricket' },    // ICC
  { id: '4450', cat: 'cricket' },    // ICC Women's T20
  { id: '4387', cat: 'basketball' }, // NBA
  { id: '4424', cat: 'baseball' },   // MLB
  { id: '4380', cat: 'tennis' },     // ATP
  { id: '4406', cat: 'hockey' },     // NHL
]

export async function GET() {
  const events = []
  const seen = new Set()

  const add = (e) => {
    if (!seen.has(e.id) && e.team1?.name && e.team2?.name &&
        e.team1.name !== 'Home' && e.team2.name !== 'Away') {
      seen.add(e.id)
      events.push(e)
    }
  }

  // 1. Live matches — all sports
  await Promise.all(SPORTS.map(async ({ key, cat }) => {
    try {
      const res = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/eventsnow.php?s=${key}`,
        { next: { revalidate: 60 }, signal: AbortSignal.timeout(5000) }
      )
      const data = await res.json()
      ;(data?.events || []).forEach(e => add({
        id: `live-${e.idEvent}`,
        cat,
        tournament: e.strLeague || cat,
        team1: { name: e.strHomeTeam, flag: getFlag(e.strHomeTeam) },
        team2: { name: e.strAwayTeam, flag: getFlag(e.strAwayTeam) },
        scoreA: e.intHomeScore ?? '',
        scoreB: e.intAwayScore ?? '',
        status: 'live',
        time: 'LIVE',
        hot: isHot(e.strLeague || ''),
        channels: CHANNELS[cat] || ['espn'],
      }))
    } catch {}
  }))

  // 2. Upcoming matches
  await Promise.all(UPCOMING_LEAGUES.map(async ({ id, cat }) => {
    try {
      const res = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${id}`,
        { next: { revalidate: 300 }, signal: AbortSignal.timeout(5000) }
      )
      const data = await res.json()
      ;(data?.events || []).slice(0, 8).forEach(e => add({
        id: `up-${e.idEvent}`,
        cat,
        tournament: e.strLeague || cat,
        team1: { name: e.strHomeTeam, flag: getFlag(e.strHomeTeam) },
        team2: { name: e.strAwayTeam, flag: getFlag(e.strAwayTeam) },
        scoreA: '', scoreB: '',
        status: 'upcoming',
        time: `${e.dateEvent} · ${(e.strTime||'TBA').slice(0,5)}`,
        hot: isHot(e.strLeague || ''),
        channels: CHANNELS[cat] || ['espn'],
      }))
    } catch {}
  }))

  return Response.json(events)
}