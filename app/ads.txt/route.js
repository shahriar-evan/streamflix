// /ads.txt — required by Google AdSense. Generated from NEXT_PUBLIC_ADSENSE_CLIENT.
import { ADSENSE_CLIENT } from '../../lib/site'

export const dynamic = 'force-static'

export function GET() {
  const pub = ADSENSE_CLIENT.replace(/^ca-/, '')
  const body = pub
    ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    : '# Add NEXT_PUBLIC_ADSENSE_CLIENT (ca-pub-...) to publish your AdSense ads.txt line\n'
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
