// Server-rendered home: Google receives real match names, scores and times in the HTML,
// then the interactive app takes over in the browser.
import App from '../components/App'
import { getMatches } from '../lib/matches'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../lib/site'

export const revalidate = 60 // rebuild the HTML at most once a minute

const STATUS = {
  live: 'https://schema.org/EventScheduled',
  upcoming: 'https://schema.org/EventScheduled',
  finished: 'https://schema.org/EventCompleted',
}

function structuredData(matches) {
  const events = matches
    .filter((m) => m.team1 && m.status !== 'finished')
    .slice(0, 40)
    .map((m) => ({
      '@type': 'SportsEvent',
      name: `${m.team1.name} vs ${m.team2.name}`,
      description: `${m.league} — ${m.team1.name} vs ${m.team2.name}`,
      startDate: m.start,
      eventStatus: STATUS[m.status],
      sport: m.sport,
      homeTeam: { '@type': 'SportsTeam', name: m.team1.name, ...(m.team1.logo && { logo: m.team1.logo }) },
      awayTeam: { '@type': 'SportsTeam', name: m.team2.name, ...(m.team2.logo && { logo: m.team2.logo }) },
      superEvent: { '@type': 'SportsEvent', name: m.league },
      url: SITE_URL,
    }))
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL, description: SITE_DESCRIPTION },
      { '@type': 'ItemList', name: 'Live and upcoming matches', itemListElement: events.map((e, i) => ({ '@type': 'ListItem', position: i + 1, item: e })) },
    ],
  }
}

export default async function Page() {
  let matches = []
  try { matches = await getMatches() } catch {}
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(matches)) }} />
      <h1 className="sr-only">{SITE_NAME} — live scores, fixtures, results and highlights for football, cricket, NBA, NHL, NFL and UFC</h1>
      <App initialMatches={matches} />
    </>
  )
}
