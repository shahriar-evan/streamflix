'use client'
import { useEffect, useState } from 'react'

// ── Plans & ad rules ────────────────────────────────────────────────────────
export const PRO_PRICE = 2.99
export const PRO_PERIOD_DAYS = 7
export const AD_SECONDS = 15 // pre-roll / mid-roll length
export const MIDROLL_MINUTES = 25 // another ad every 20–30 minutes of watching

export const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    tagline: 'Everything free, supported by ads',
    features: [
      { text: 'All live matches & 40+ TV channels', on: true },
      { text: 'Auto-picks the best working stream', on: true },
      { text: 'Highest available quality', on: true },
      { text: 'Banner ads in the app', on: false },
      { text: `${AD_SECONDS}s ad before each stream`, on: false },
      { text: `${AD_SECONDS}s ad every ${MIDROLL_MINUTES} minutes`, on: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: PRO_PRICE,
    period: 'week',
    tagline: 'Watch every match without ads',
    features: [
      { text: 'Everything in Free', on: true },
      { text: 'No banner ads', on: true },
      { text: 'No ads before streams — instant start', on: true },
      { text: 'No ads during matches', on: true },
      { text: 'Pro badge', on: true },
      { text: 'Cancel anytime', on: true },
    ],
  },
]

// ── Plan store (this device). Swap activatePro() for a real checkout later. ──
const KEY = 'ls_plan'
const listeners = new Set()
const read = () => {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (p?.tier === 'pro' && p.until > Date.now()) return p
  } catch {}
  return { tier: 'free' }
}
const write = (p) => {
  try { localStorage.setItem(KEY, JSON.stringify(p)) } catch {}
  listeners.forEach((fn) => fn(p))
}

export function activatePro() {
  write({ tier: 'pro', since: Date.now(), until: Date.now() + PRO_PERIOD_DAYS * 86400000 })
}
export function cancelPro() {
  write({ tier: 'free' })
}

export function usePlan() {
  const [plan, setPlan] = useState({ tier: 'free' })
  useEffect(() => {
    setPlan(read())
    const fn = (p) => setPlan(p.tier === 'pro' ? p : { tier: 'free' })
    listeners.add(fn)
    return () => listeners.delete(fn)
  }, [])
  return { ...plan, pro: plan.tier === 'pro' }
}
