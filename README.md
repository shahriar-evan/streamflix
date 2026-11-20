# LiveSports

Live scores, fixtures, highlights and TV — Next.js 14 (App Router).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Settings (Vercel → Project → Settings → Environment Variables)

| Variable | Example | What it does |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://livesports.example.com` | Your real domain. Used for canonical URL, sitemap, share previews. |
| `GOOGLE_SITE_VERIFICATION` | `abc123...` | The `content` value from Google Search Console's “HTML tag” verification. |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-1234567890123456` | Turns on real Google AdSense banners and publishes `/ads.txt`. Empty = placeholder ads. |
| `NEXT_PUBLIC_ADSENSE_SLOT_BANNER` | `1234567890` | Optional AdSense ad-unit id for the banners. |

Redeploy after changing any of these.

## SEO pieces

- Home page is server-rendered (match names/scores in the HTML) and rebuilt every 60s
- `app/layout.js` — title, description, Open Graph/Twitter cards, verification
- `app/page.js` — schema.org `SportsEvent` structured data
- `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, `/opengraph-image`, `/ads.txt`

## Monetisation

- `lib/plan.js` — Free/Pro rules (ad length, mid-roll interval, price). Pro is a demo switch until a payment provider (e.g. Stripe) is connected.
- `components/Ads.js` — banners (AdSense when configured) and the 15s ad breaks (placeholder; real video ads need Google Ad Manager + IMA).
