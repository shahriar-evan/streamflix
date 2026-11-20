'use client'
import { useEffect, useState } from 'react'
import { usePlan, PRO_PRICE } from '../lib/plan'
import Icon from './Icon'
import { BrandMark } from './Brand'

// Placeholder creatives. Replace the inside of <AdBanner> / <AdBreak> with your ad network
// (e.g. Google AdSense for banners, Google IMA for video ads) once you have an account.
const CREATIVES = [
  { title: 'Watch without ads', body: `Go Pro for $${PRO_PRICE}/week — no banners, no breaks.`, cta: 'Go Pro', pro: true, bg: 'linear-gradient(135deg,#1d3b9e,#7c1d6f)' },
  { title: 'Advertise on LiveSports', body: 'Reach sports fans during live matches.', cta: 'Learn more', bg: 'linear-gradient(135deg,#0f766e,#1e3a8a)' },
  { title: 'Never miss a goal', body: 'Pro starts streams instantly — skip the wait.', cta: 'Go Pro', pro: true, bg: 'linear-gradient(135deg,#b45309,#9f1239)' },
]

export function AdBanner({ onGoPro, index = 0, slim = false }) {
  const { pro } = usePlan()
  if (pro) return null
  const c = CREATIVES[index % CREATIVES.length]
  return (
    <div className={`adbanner ${slim ? 'slim' : ''}`} style={{ background: c.bg }}>
      <span className="ad-tag">Ad</span>
      <BrandMark size={slim ? 34 : 46} />
      <div className="ad-text">
        <b>{c.title}</b>
        <span>{c.body}</span>
      </div>
      <button className="ad-cta" onClick={c.pro ? onGoPro : undefined}>{c.cta}</button>
    </div>
  )
}

// Full-player ad break with a countdown (pre-roll and mid-roll)
export function AdBreak({ kind, seconds, onDone, onGoPro }) {
  const [left, setLeft] = useState(seconds)
  useEffect(() => {
    setLeft(seconds)
    const t = setInterval(() => setLeft((s) => (s <= 1 ? 0 : s - 1)), 1000)
    return () => clearInterval(t)
  }, [seconds, kind])
  useEffect(() => { if (left === 0) onDone() }, [left, onDone])

  const c = CREATIVES[kind === 'mid' ? 2 : 0]
  return (
    <div className="adbreak" style={{ background: c.bg }}>
      <div className="adbreak-top">
        <span className="ad-tag">Ad</span>
        <span className="adbreak-count">{kind === 'mid' ? 'Match continues in' : 'Your stream starts in'} <b>{left}s</b></span>
      </div>
      <div className="adbreak-body">
        <BrandMark size={72} />
        <b>{c.title}</b>
        <span>{c.body}</span>
        <button className="btn btn-gold" onClick={onGoPro}><Icon name="star" size={16} fill />Remove ads — ${PRO_PRICE}/week</button>
      </div>
      <div className="adbreak-bar"><i style={{ width: `${((seconds - left) / seconds) * 100}%` }} /></div>
    </div>
  )
}
