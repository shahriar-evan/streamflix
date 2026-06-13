export async function GET() {
  try {
    const sports = ['soccer', 'cricket', 'basketball', 'tennis', 'boxing']
    const allEvents = []

    for (const sport of sports) {
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
              cat: sport === 'soccer' ? 'football' : sport,
              tournament: e.strLeague || sport,
              teams: {
                home: { name: e.strHomeTeam },
                away: { name: e.strAwayTeam }
              },
              score: {
                home: e.intHomeScore,
                away: e.intAwayScore
              },
              status: 'live',
              date: e.dateEvent,
              startTime: e.strTime,
            })
          })
        }
      } catch(e) {}
    }

    // Also try upcoming
    for (const sport of ['soccer', 'cricket']) {
      try {
        const res = await fetch(
          `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328`,
          { next: { revalidate: 300 } }
        )
        const data = await res.json()
        if (data?.events) {
          data.events.slice(0,5).forEach(e => {
            allEvents.push({
              id: e.idEvent,
              cat: 'football',
              tournament: e.strLeague || 'Football',
              teams: {
                home: { name: e.strHomeTeam },
                away: { name: e.strAwayTeam }
              },
              score: { home: '', away: '' },
              status: 'upcoming',
              date: e.dateEvent,
              startTime: e.strTime,
            })
          })
        }
      } catch(e) {}
      break
    }

    return Response.json(allEvents)
  } catch(e) {
    return Response.json([])
  }
}
