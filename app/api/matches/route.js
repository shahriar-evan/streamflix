// Live, upcoming and finished matches (ESPN scoreboards). Logic lives in lib/matches.js.
import { getMatches } from '../../../lib/matches'

export const dynamic = 'force-dynamic'

export async function GET() {
  const matches = await getMatches()
  return Response.json({ updated: Date.now(), matches }, { headers: { 'Cache-Control': 'no-store' } })
}
