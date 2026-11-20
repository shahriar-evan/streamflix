// One page per match: /match/<team-a>-vs-<team-b>-live-score--<id>
// Server-rendered with its own title, description and structured data, so each match can rank on Google.
import { notFound } from 'next/navigation'
import App from '../../../components/App'
import { getMatches } from '../../../lib/matches'
import { idFromSlug, matchPath } from '../../../lib/format'
import { sportOf } from '../../../lib/data'
import { SITE_NAME, SITE_URL } from '../../../lib/site'

export const revalidate = 60

async function load(slug) {
  let matches = []
  try { matches = await getMatches() } catch {}
  const id = idFromSlug(slug)
  return { matches, match: matches.find((m) => m.id === id) || null }
}

const nameOf = (m) => (m.team1 ? `${m.team1.name} vs ${m.team2.name}` : m.title)

const dateText = (iso) =>
  new Date(iso).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short' })

function describe(m) {
  const name = nameOf(m)
  const sport = sportOf(m.sport).label
  if (m.status === 'live') {
    const score = m.team1 && m.team1.score !== '' ? ` (${m.team1.score} - ${m.team2.score})` : ''
    return `${name}${score} live score and updates — ${m.league} ${sport}. Follow every goal and moment live on ${SITE_NAME}.`
  }
  if (m.status === 'finished') {
    const score = m.team1 && m.team1.score !== '' ? ` ${m.team1.score} - ${m.team2.score}` : ''
    return `${name}${score} — full-time result, ${m.league}. Score, match summary and highlights on ${SITE_NAME}.`
  }
  return `${name} — ${m.league} ${sport}, ${dateText(m.start)}. Kick-off time, live score and updates on ${SITE_NAME}.`
}

export async function generateMetadata({ params }) {
  const { match: m } = await load(params.slug)
  if (!m) return { title: 'Match not found', robots: { index: false } }
  const title = `${nameOf(m)} Live Score — ${m.league}`
  const description = describe(m)
  const url = matchPath(m)
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'article', url, title, description },
    twitter: { card: 'summary_large_image', title, description },
  }
}

const STATUS = {
  live: 'https://schema.org/EventScheduled',
  upcoming: 'https://schema.org/EventScheduled',
  finished: 'https://schema.org/EventCompleted',
}

function structuredData(m) {
  const url = `${SITE_URL}${matchPath(m)}`
  const event = {
    '@type': 'SportsEvent',
    name: nameOf(m),
    description: describe(m),
    startDate: m.start,
    eventStatus: STATUS[m.status],
    sport: sportOf(m.sport).label,
    url,
    superEvent: { '@type': 'SportsEvent', name: m.league },
    ...(m.team1 && {
      homeTeam: { '@type': 'SportsTeam', name: m.team1.name, ...(m.team1.logo && { logo: m.team1.logo }) },
      awayTeam: { '@type': 'SportsTeam', name: m.team2.name, ...(m.team2.logo && { logo: m.team2.logo }) },
      competitor: [
        { '@type': 'SportsTeam', name: m.team1.name },
        { '@type': 'SportsTeam', name: m.team2.name },
      ],
    }),
  }
  return {
    '@context': 'https://schema.org',
    '@graph': [
      event,
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: sportOf(m.sport).label, item: SITE_URL },
          { '@type': 'ListItem', position: 3, name: nameOf(m), item: url },
        ],
      },
    ],
  }
}

export default async function MatchPage({ params }) {
  const { matches, match } = await load(params.slug)
  if (!match) notFound()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(match)) }} />
      <h1 className="sr-only">{nameOf(match)} live score — {match.league}</h1>
      <App initialMatches={matches} initialMatchId={match.id} />
    </>
  )
}
