// Share preview image (Facebook, WhatsApp, X, Google Discover), generated at build time
import { ImageResponse } from 'next/og'
import { SITE_NAME, SITE_TAGLINE } from '../lib/site'

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80,
          backgroundColor: '#07103a',
          backgroundImage: 'linear-gradient(135deg, #1d3b9e 0%, #07103a 55%, #4a1a0a 100%)',
          color: '#fff', fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ width: 120, height: 120, borderRadius: 30, background: 'linear-gradient(135deg,#1d3b9e,#07103a)', border: '3px solid rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 70 }}>⚽</div>
          <div style={{ display: 'flex', fontSize: 96, fontWeight: 800, fontStyle: 'italic' }}>
            <span>Live</span>
            <span style={{ color: '#ffb020' }}>Sports</span>
          </div>
        </div>
        <div style={{ fontSize: 44, marginTop: 36, color: '#dbe4f5' }}>{SITE_TAGLINE}</div>
        <div style={{ display: 'flex', gap: 18, marginTop: 44 }}>
          {['Football', 'Cricket', 'NBA', 'NHL', 'NFL', 'UFC'].map((s) => (
            <div key={s} style={{ padding: '12px 26px', borderRadius: 999, background: 'rgba(255,255,255,.1)', border: '2px solid rgba(255,255,255,.18)', fontSize: 30 }}>{s}</div>
          ))}
        </div>
      </div>
    ),
    size,
  )
}
