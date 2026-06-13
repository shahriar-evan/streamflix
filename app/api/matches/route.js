export async function GET() {
  try {
    const allEvents = []

    // Live events - multiple sports
    const sportMap = {
      'soccer': 'football',
      'cricket': 'cricket',
      'basketball': 'basketball',
      'tennis': 'tennis',
      'baseball': 'baseball',
      'ice_hockey': 'hockey',
      'mma': 'mma',
      'motorsport': 'motorsport'
    }

    for (const [sport, cat] of Object.entries(sportMap)) {
      try {
        const res = await fetch(
          `https://www.thesportsdb.com/api/v1/json/3/eventsnow.php?s=${sport}`,
          { next: { revalidate: 60 } }
        )
        const data = await res.json()
        if (data?.events) {
          data.events.forEach(e => {
            allEvents.push({
              id: e.idEvent,
              cat,
              tournament: e.strLeague || cat,
              teams: {
                home: { name: e.strHomeTeam, badge: e.strHomeTeamBadge || '' },
                away: { name: e.strAwayTeam, badge: e.strAwayTeamBadge || '' }
              },
              score: { home: e.intHomeScore ?? '', away: e.intAwayScore ?? '' },
              status: 'live',
              date: e.dateEvent,
              startTime: e.strTime,
              hot: cat === 'football' || cat === 'cricket',
              elapsed: e.strProgress || null,
            })
          })
        }
      } catch(e) {}
    }

    // Upcoming FIFA World Cup matches
    try {
      const res = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328`,
        { next: { revalidate: 300 } }
      )
      const data = await res.json()
      if (data?.events) {
        data.events.slice(0, 8).forEach(e => {
          allEvents.push({
            id: 'wc-' + e.idEvent,
            cat: 'football',
            tournament: 'FIFA WORLD CUP 2026',
            teams: {
              home: { name: e.strHomeTeam, badge: e.strHomeTeamBadge || '' },
              away: { name: e.strAwayTeam, badge: e.strAwayTeamBadge || '' }
            },
            score: { home: '', away: '' },
            status: 'upcoming',
            date: e.dateEvent,
            startTime: e.strTime,
            hot: true,
          })
        })
      }
    } catch(e) {}

    // Upcoming cricket
    try {
      const res = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4794`,
        { next: { revalidate: 300 } }
      )
      const data = await res.json()
      if (data?.events) {
        data.events.slice(0, 5).forEach(e => {
          allEvents.push({
            id: 'cr-' + e.idEvent,
            cat: 'cricket',
            tournament: e.strLeague || 'Cricket',
            teams: {
              home: { name: e.strHomeTeam, badge: '' },
              away: { name: e.strAwayTeam, badge: '' }
            },
            score: { home: '', away: '' },
            status: 'upcoming',
            date: e.dateEvent,
            startTime: e.strTime,
            hot: false,
          })
        })
      }
    } catch(e) {}

    return Response.json(allEvents)
  } catch(e) {
    return Response.json([])
  }
}