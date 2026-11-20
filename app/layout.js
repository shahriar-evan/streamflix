import { Inter, Rajdhani } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { ADSENSE_CLIENT, GOOGLE_VERIFICATION, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from '../lib/site'

const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-display', display: 'swap' })

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — ${SITE_TAGLINE}`, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'live scores', 'live football scores', 'cricket live score', 'NBA scores', 'NHL scores', 'NFL scores',
    'today matches', 'match fixtures', 'match highlights', 'Premier League', 'La Liga', 'Champions League',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title: `${SITE_NAME} — ${SITE_TAGLINE}`, description: SITE_DESCRIPTION },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  ...(GOOGLE_VERIFICATION && { verification: { google: GOOGLE_VERIFICATION } }),
  category: 'sports',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#07103a',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${rajdhani.variable}`}>
      <head>
        {/* Runs before the app bundle: remove any stale service worker + caches from older projects */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(!('serviceWorker' in navigator))return;navigator.serviceWorker.getRegistrations().then(function(rs){if(!rs.length)return;Promise.all(rs.map(function(r){return r.unregister()})).then(function(){return window.caches?caches.keys().then(function(k){return Promise.all(k.map(function(x){return caches.delete(x)}))}):0}).then(function(){if(!sessionStorage.getItem('sw_cleaned')){sessionStorage.setItem('sw_cleaned','1');location.reload()}})})}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        {children}
        {ADSENSE_CLIENT && (
          <Script
            id="adsense"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          />
        )}
      </body>
    </html>
  )
}
