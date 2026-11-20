// Site-wide settings. Set these in Vercel → Project → Settings → Environment Variables.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://streamflix-orpin.vercel.app').replace(/\/$/, '')
export const SITE_NAME = 'LiveSports'
export const SITE_TAGLINE = 'Live scores, fixtures, highlights & TV'
export const SITE_DESCRIPTION =
  'Follow live football, cricket, NBA, NHL, NFL and UFC — live scores, today’s fixtures, results and match highlights, updated every 30 seconds.'

// Google AdSense publisher id, e.g. "ca-pub-1234567890123456" (empty = placeholder ads)
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || ''
// Optional AdSense ad-unit slot ids
export const ADSENSE_SLOT_BANNER = process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER || ''
// Google Search Console HTML-tag verification code (the content="..." value)
export const GOOGLE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION || ''
