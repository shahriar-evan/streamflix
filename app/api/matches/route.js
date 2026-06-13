export async function GET() {
  const allEvents = []

  // ── 1. LiveScore API (free tier) ──────────────────────────
  const sports = [
    { key: 'soccer',      cat: 'football' },
    { key: 'cricket',     cat: 'cricket' },
    { key: 'basketball',  cat: 'basketball' },
    { key: 'baseball',    cat: 'baseball' },
    { key: 'tennis',      cat: 'tennis' },
    { key: 'ice_hockey',  cat: 'hockey' },
    { key: 'mma',         cat: 'mma' },
    { key: 'motorsport',  cat: 'motorsport' },
  ]

  const FLAGS = {
    'Qatar':'🇶🇦','Switzerland':'🇨🇭','Brazil':'🇧🇷','Morocco':'🇲🇦',
    'Haiti':'🇭🇹','Scotland':'🏴󠁧󠁢󠁳󠁣󠁴󠁿','Australia':'🇦🇺','Türkiye':'🇹🇷','Turkey':'🇹🇷',
    'Germany':'🇩🇪','Curaçao':'🏝️','Netherlands':'🇳🇱','Japan':'🇯🇵',
    'Ivory Coast':'🇨🇮','Ecuador':'🇪🇨','Sweden':'🇸🇪','Tunisia':'🇹🇳',
    'England':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','France':'🇫🇷','Spain':'🇪🇸','Argentina':'🇦🇷',
    'USA':'🇺🇸','Portugal':'🇵🇹','Italy':'🇮🇹','Belgium':'🇧🇪',
    'Croatia':'🇭🇷','Mexico':'🇲🇽','South Africa':'🇿🇦','Canada':'🇨🇦',
    'Bangladesh':'🇧🇩','India':'🇮🇳','Pakistan':'🇵🇰','West Indies':'🏝️',
    'Afghanistan':'🇦🇫','Sri Lanka':'🇱🇰','New Zealand':'🇳🇿','WI':'🏝️',
    'WI-W':'🏝️','NZ-W':'🇳🇿','BAN-W':'🇧🇩','IND-W':'🇮🇳','PAK-W':'🇵🇰',
    'NED-W':'🇳🇱','AUS-W':'🇦🇺','SA-W':'🇿🇦',
    'South Korea':'🇰🇷','Czechia':'🇨🇿','Bosnia and Herzegovina':'🇧🇦',
    'Paraguay':'🇵🇾','Serbia':'🇷🇸','Ukraine':'🇺🇦','Poland':'🇵🇱',
    'Djokovic':'🇷🇸','Alcaraz':'🇪🇸','Swiatek':'🇵🇱','Sabalenka':'🇧🇾',
    'Verstappen':'🇳🇱','Hamilton':'🇬🇧',
  }
  const getFlag = (n) => FLAGS[n] || '🏳️'
  const hotTournaments = ['FIFA WORLD CUP','WORLD CUP','NBA FINALS','ICC','WIMBLEDON','STANLEY CUP','UFC','CHAMPIONS LEAGUE','PREMIER LEAGUE']
  const isHot = (t) => hotTournaments.some(h => t.toUpperCase().includes(h))

  // TheSportsDB — live now
  for (const { key, cat } of sports) {
    try {
      const res = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/eventsnow.php?s=${key}`,
        { next: { revalidate: 60 } }
      )
      const data = await res.json()
      if (data?.events) {
        for (const e of data.events) {
          allEvents.push({
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
            channels: cat === 'football' ? ['fifa_wc','dsports','tudn','fox_eng','bein_tr'] :
                      cat === 'cricket'  ? ['espn','dsports','bein'] :
                      cat === 'basketball' ? ['espn','tnt'] : ['espn'],
          })
        }
      }
    } catch(e) {}
  }

  // TheSportsDB — upcoming (multiple leagues)
  const upcomingLeagues = [
    { id: '4328', cat: 'football', hot: true },   // FIFA World Cup
    { id: '4794', cat: 'cricket',  hot: true },    // ICC Cricket
    { id: '4387', cat: 'basketball', hot: true },  // NBA
    { id: '4424', cat: 'baseball', hot: false },   // MLB
    { id: '4380', cat: 'tennis',  hot: true },     // ATP Tennis
    { id: '4406', cat: 'hockey',  hot: false },    // NHL
  ]

  for (const { id, cat, hot } of upcomingLeagues) {
    try {
      const res = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${id}`,
        { next: { revalidate: 300 } }
      )
      const data = await res.json()
      if (data?.events) {
        for (const e of data.events.slice(0, 6)) {
          // Skip if already in live
          if (allEvents.find(ev => ev.id === `live-${e.idEvent}`)) continue
          allEvents.push({
            id: `up-${e.idEvent}`,
            cat,
            tournament: e.strLeague || cat,
            team1: { name: e.strHomeTeam, flag: getFlag(e.strHomeTeam) },
            team2: { name: e.strAwayTeam, flag: getFlag(e.strAwayTeam) },
            scoreA: '', scoreB: '',
            status: 'upcoming',
            time: `${e.dateEvent} · ${e.strTime || 'TBA'}`,
            hot: hot || isHot(e.strLeague || ''),
            channels: cat === 'football' ? ['fifa_wc','dsports','tudn','fox_eng'] :
                      cat === 'cricket'  ? ['espn','dsports','bangla_fifa'] :
                      cat === 'basketball' ? ['espn','tnt'] : ['espn'],
          })
        }
      }
    } catch(e) {}
  }

  return Response.json(allEvents)
}