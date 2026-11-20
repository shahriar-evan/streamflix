import { getMatches } from '../lib/matches'
import { matchPath } from '../lib/format'
import { SITE_URL } from '../lib/site'

export const revalidate = 600 // refresh the sitemap every 10 minutes

export default async function sitemap() {
  let matches = []
  try { matches = await getMatches() } catch {}
  const now = new Date()
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'always', priority: 1 },
    ...matches.map((m) => ({
      url: `${SITE_URL}${matchPath(m)}`,
      lastModified: now,
      changeFrequency: m.status === 'finished' ? 'daily' : 'hourly',
      priority: m.status === 'live' ? 0.9 : m.status === 'upcoming' ? 0.8 : 0.6,
    })),
  ]
}
