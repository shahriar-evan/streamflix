export const dynamic = 'force-dynamic' // no cache — always fresh
export const revalidate = 0

const FLAGS = {
  'Qatar':'🇶🇦','Switzerland':'🇨🇭','Brazil':'🇧🇷','Morocco':'🇲🇦',
  'Haiti':'🇭🇹','Scotland':'🏴󠁧󠁢󠁳󠁣󠁴󠁿','Australia':'🇦🇺','Türkiye':'🇹🇷','Turkey':'🇹🇷',
  'Germany':'🇩🇪','Netherlands':'🇳🇱','Japan':'🇯🇵','Curaçao':'🏝️',
  'Ivory Coast':'🇨🇮','Ecuador':'🇪🇨','Sweden':'🇸🇪','Tunisia':'🇹🇳',
  'England':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','France':'🇫🇷','Spain':'🇪🇸','Argentina':'🇦🇷',
  'USA':'🇺🇸','Portugal':'🇵🇹','Italy':'🇮🇹','Belgium':'🇧🇪','Croatia':'🇭🇷',
  'Mexico':'🇲🇽','South Africa':'🇿🇦','Canada':'🇨🇦','Bangladesh':'🇧🇩',
  'India':'🇮🇳','Pakistan':'🇵🇰','West Indies':'🏝️','Afghanistan':'🇦🇫',
  'Sri Lanka':'🇱🇰','New Zealand':'🇳🇿','WI':'🏝️','WI-W':'🏝️','NZ-W':'🇳🇿',
  'BAN-W':'🇧🇩','IND-W':'🇮🇳','PAK-W':'🇵🇰','NED-W':'🇳🇱','AUS-W':'🇦🇺',
  'South Korea':'🇰🇷','Czechia':'🇨🇿','Serbia':'🇷🇸','Poland':'🇵🇱',
  'Bosnia and Herzegovina':'🇧🇦','Paraguay':'🇵🇾','UAE':'🇦🇪',
}
const getFlag = (n='') => {
  for (const [k,v] of Object.entries(FLAGS))
    if (n.toLowerCase().includes(k.toLowerCase())) return v
  return '🏳️'
}
const HOT_KW = ['FIFA WORLD CUP','WORLD CUP','NBA FINALS','ICC','WIMBLEDON','STANLEY CUP','UFC','CHAMPIONS LEAGUE','PREMIER LEAGUE','BANGLADESH','INDIA']
const isHot = (t='') => HOT_KW.some(h => t.toUpperCase().includes(h))

const CHANNELS = {
  football:   ['fifa_wc','dsports','tudn','bein_tr','fox_eng','wctv','m6','telemundo','caze','espn'],
  cricket:    ['fancode','tsports','bangla_fifa','star1','star2','willow','sony1','sony2','sony3','espn','dsports','tensports'],
  basketball: ['espn','tnt','nbatv','fs1'],
  baseball:   ['espn2','espn'],
  tennis:     ['eurosport','dazn'],
  hockey:     ['espn','tnt'],
  mma:        ['espn','dazn','dazncombat'],
  motorsport: ['f1tv','dazn','redbull','eurosport'],
}

function parse(e, cat, status) {
  const h = e.strHomeTeam||'', a = e.strAwayTeam||''
  if (!h||!a||h==='Home'||a==='Away'||h==='TBA'||a==='TBA') return null
  return {
    id: `${status}-${e.idEvent}`,
    cat, status,
    tournament: e.strLeague||cat,
    team1: {name:h, flag:getFlag(h)},
    team2: {name:a, flag:getFlag(a)},
    scoreA: e.intHomeScore??'',
    scoreB: e.intAwayScore??'',
    time: status==='live'?'LIVE':`${e.dateEvent||''} · ${(e.strTime||'TBA').slice(0,5)}`,
    hot: isHot(e.strLeague||'') || isHot(h) || isHot(a),
    channels: CHANNELS[cat]||['espn'],
  }
}

const SPORTS = [
  {key:'soccer',cat:'football'},{key:'cricket',cat:'cricket'},
  {key:'basketball',cat:'basketball'},{key:'baseball',cat:'baseball'},
  {key:'tennis',cat:'tennis'},{key:'ice_hockey',cat:'hockey'},
  {key:'mma',cat:'mma'},{key:'motorsport',cat:'motorsport'},
]
const LEAGUES = [
  {id:'4328',cat:'football'},{id:'4794',cat:'cricket'},{id:'4450',cat:'cricket'},
  {id:'4387',cat:'basketball'},{id:'4424',cat:'baseball'},{id:'4380',cat:'tennis'},{id:'4406',cat:'hockey'},
]

export async function GET() {
  const events=[], seen=new Set()
  const add = e => e && !seen.has(e.id) && (seen.add(e.id), events.push(e))

  // Always fetch fresh — no cache headers
  const fetchFresh = (url) => fetch(url, {
    cache: 'no-store',
    signal: AbortSignal.timeout(6000),
    headers: { 'Cache-Control': 'no-cache' }
  })

  await Promise.all([
    // Live now
    ...SPORTS.map(async ({key,cat}) => {
      try {
        const r = await fetchFresh(`https://www.thesportsdb.com/api/v1/json/3/eventsnow.php?s=${key}&t=${Date.now()}`)
        const d = await r.json()
        ;(d?.events||[]).forEach(e => add(parse(e,cat,'live')))
      } catch {}
    }),
    // Upcoming
    ...LEAGUES.map(async ({id,cat}) => {
      try {
        const r = await fetchFresh(`https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${id}&t=${Date.now()}`)
        const d = await r.json()
        ;(d?.events||[]).slice(0,8).forEach(e => add(parse(e,cat,'upcoming')))
      } catch {}
    }),
  ])

  return Response.json(events, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
    }
  })
}