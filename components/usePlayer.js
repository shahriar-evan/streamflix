'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { check, markFailed, resultFor, score, subscribe } from '../lib/streams'

// Picks the best *working* stream (checked server-side), highest resolution first,
// and sticks with it. If it fails, moves on to the next best working stream —
// same channel first, then other channels in the list.
export default function usePlayer() {
  const [channel, setChannel] = useState(null)
  const [server, setServer] = useState(null) // { url, label }
  const [status, setStatus] = useState('idle') // idle | checking | playing | offline
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [notice, setNotice] = useState('')
  const [session, setSession] = useState(0)
  const [, force] = useState(0)
  const token = useRef(0)
  const list = useRef([]) // channels in play order
  const failed = useRef(new Set())
  const current = useRef(null)

  useEffect(() => subscribe(() => force((n) => n + 1)), [])

  const flash = (msg) => {
    setNotice(msg)
    setTimeout(() => setNotice((m) => (m === msg ? '' : m)), 5000)
  }

  const candidates = useCallback((preferId) => {
    const out = []
    list.current.forEach((ch, ci) => {
      ch.servers.forEach((s) => {
        const r = resultFor(s.url)
        if (r?.ok && !failed.current.has(s.url)) out.push({ ch, s, r, ci })
      })
    })
    out.sort((a, b) => {
      if (preferId) {
        const pa = a.ch.id === preferId ? 1 : 0
        const pb = b.ch.id === preferId ? 1 : 0
        if (pa !== pb) return pb - pa
      }
      return score(b.r) - score(a.r)
    })
    return out
  }, [])

  const playCandidate = (c, reason) => {
    current.current = { chId: c.ch.id, url: c.s.url }
    setChannel(c.ch)
    setServer({ url: c.s.url, label: c.s.label, height: c.r.height })
    setStatus('playing')
    if (reason) flash(reason)
  }

  // Start with a list of channels; `prefer` = the channel the user picked (kept if it works)
  const start = useCallback(async (channels, prefer = null) => {
    const my = ++token.current
    setSession(my)
    list.current = channels
    failed.current = new Set()
    current.current = null
    const first = prefer || channels[0]
    setChannel(first || null)
    setServer(null)
    setNotice('')
    if (!first) { setStatus('idle'); return }
    setStatus('checking')

    // Check in waves: the preferred channel + next few first, then the rest
    const ordered = [first, ...channels.filter((c) => c.id !== first.id)]
    const waves = [ordered.slice(0, 4), ordered.slice(4, 10), ordered.slice(10)].filter((w) => w.length)
    const total = ordered.reduce((n, c) => n + c.servers.length, 0)
    let done = 0
    setProgress({ done, total })

    for (const wave of waves) {
      const urls = wave.flatMap((c) => c.servers.map((s) => s.url))
      await check(urls)
      if (my !== token.current) return
      done += urls.length
      setProgress({ done, total })
      if (!prefer) {
        // Auto mode (match page): always move to the highest-resolution working stream,
        // upgrading as later checks find a better one.
        const best = candidates()[0]
        const cur = current.current
        const curH = cur ? resultFor(cur.url)?.height || 0 : -1
        if (best && (!cur || (best.r.height || 0) > curH)) {
          playCandidate(best, cur ? `Switched to ${best.ch.name} — ${best.r.height}p` : '')
        }
      } else if (!current.current) {
        const best = candidates(first.id)[0]
        if (best) {
          const switched = best.ch.id !== first.id
          playCandidate(best, switched ? `${first.name} is offline — switched to ${best.ch.name}` : '')
        }
      }
    }
    if (my === token.current && !current.current) setStatus('offline')
  }, [candidates])

  // The player reported the current stream failed → next best working one
  const onFail = useCallback(() => {
    const cur = current.current
    if (!cur) return
    failed.current.add(cur.url)
    markFailed(cur.url)
    const next = candidates(cur.chId)[0]
    if (next) {
      playCandidate(next, next.ch.id !== cur.chId ? `Stream dropped — switched to ${next.ch.name}` : 'Stream dropped — switched server')
    } else {
      current.current = null
      setServer(null)
      setStatus('offline')
    }
  }, [candidates])

  // Manual server choice: play exactly that server (optionally on another channel)
  const pickServer = useCallback((s, ch = channel) => {
    if (!ch) return
    token.current++ // stop any auto-upgrade still running
    failed.current.delete(s.url)
    current.current = { chId: ch.id, url: s.url }
    setChannel(ch)
    setServer({ url: s.url, label: s.label, height: resultFor(s.url)?.height || 0 })
    setStatus('playing')
  }, [channel])

  // Every server of every channel in play, best first: working (highest resolution),
  // then not checked yet, then offline.
  const options = list.current
    .flatMap((ch) => ch.servers.map((s) => ({ ch, s, r: resultFor(s.url) })))
    .sort((a, b) => {
      const rank = (o) => (o.r ? (o.r.ok ? 2 : 0) : 1)
      if (rank(a) !== rank(b)) return rank(b) - rank(a)
      return a.r?.ok && b.r?.ok ? score(b.r) - score(a.r) : 0
    })

  const retry = useCallback(() => start(list.current, channel), [start, channel])

  return {
    channel, server, status, progress, notice, session,
    url: status === 'playing' ? server?.url : null,
    options, start, onFail, pickServer, retry,
  }
}
