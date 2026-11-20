import { SITE_DESCRIPTION, SITE_NAME } from '../lib/site'

// Lets people "Add to Home Screen" / install the site like an app
export default function manifest() {
  return {
    name: `${SITE_NAME} — Live scores & highlights`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#07103a',
    theme_color: '#07103a',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  }
}
