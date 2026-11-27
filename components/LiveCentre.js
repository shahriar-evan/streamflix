'use client'
// Live match centre for cricket matches without a free stream:
// score, batters at the crease, current bowler, recent balls and ball-by-ball commentary.
import { useEffect, useRef, useState } from 'react'

const REFRESH = 20 * 1000

export default function LiveCentre({ match, fallback = null }) {
  const [d, setD] = useState(null)
  const [ago, setAgo] = useState(0)
  const balls = useRef(null)
  // Keep the newest ball in view
  useEffect(() => { const el = balls.current; if (el) el.scrollLeft = el.scrollWidth }, [d])

  useEffect(() => {
    let alive = true
    let at = 0
    const load = () =>
      fetch(`/api/live?id=${encodeURIComponent(match.id)}`)
        .then((r) => r.json())
        .then((x) => { if (alive && x) { setD(x); at = Date.now(); setAgo(0) } })
        .catch(() => {})
    load()
    const t = setInterval(load, REFRESH)
    const c = setInterval(() => at && setAgo(Math.round((Date.now() - at) / 1000)), 1000)
    return () => { alive = false; clearInterval(t); clearInterval(c) }
  }, [match.id])

  if (!d) return <div className="lc lc-loading"><span className="spinner" /><span>Loading live match centre…</span></div>
  if (!d.available) return fallback

  const s = d.score
  const need = s.target ? s.target - s.runs : 0
  const ballsLeft = s.limit ? Math.max(0, Math.round(s.limit * 6 - (Math.floor(s.overs) * 6 + Math.round((s.overs % 1) * 10)))) : 0

  return (
    <div className="lc">
      <div className="lc-head">
        <span className="lc-live"><i />{match.status === 'live' ? 'LIVE' : 'MATCH CENTRE'}</span>
        <span className="lc-upd">Ball by ball · updated {ago < 5 ? 'just now' : `${ago}s ago`}</span>
      </div>

      <div className="lc-score">
        <div>
          <span className="lc-team">{d.batting} <small>{d.innings}</small></span>
          <b className="lc-runs">{s.runs}/{s.wkts}</b>
          <span className="lc-overs">({s.overs}{s.limit ? `/${s.limit}` : ''} ov)</span>
        </div>
        <div className="lc-rates">
          {s.rr != null && <span>CRR <b>{Number(s.rr).toFixed(2)}</b></span>}
          {s.target > 0 && <span>Target <b>{s.target}</b></span>}
          {s.target > 0 && need > 0 && <span className="lc-need">Need {need} from {ballsLeft} balls</span>}
        </div>
      </div>

      <div className="lc-recent">
        <span className="lc-lbl">Recent</span>
        <div className="lc-balls" ref={balls}>
          {d.recent.map((b, i) => {
            const newOver = i > 0 && Math.floor(b.over) !== Math.floor(d.recent[i - 1].over)
            return (
              <span key={i} className="lc-ballwrap">
                {newOver && <span className="lc-sep" />}
                <span className={`lc-ball ${b.k}`}>{b.l}</span>
              </span>
            )
          })}
        </div>
      </div>

      <div className="lc-grid">
        <table className="lc-table">
          <thead><tr><th>Batter</th><th>R</th><th>B</th><th>4s</th><th>6s</th><th>SR</th></tr></thead>
          <tbody>
            {d.batters.map((b, i) => (
              <tr key={b.name}>
                <td>{b.name}{i === 0 && <span className="lc-star">*</span>}</td>
                <td><b>{b.runs}</b></td><td>{b.balls}</td><td>{b.fours}</td><td>{b.sixes}</td>
                <td>{b.balls ? ((b.runs / b.balls) * 100).toFixed(1) : '0.0'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {d.bowler && (
          <table className="lc-table">
            <thead><tr><th>Bowler</th><th>O</th><th>M</th><th>R</th><th>W</th><th>Econ</th></tr></thead>
            <tbody>
              <tr>
                <td>{d.bowler.name}</td><td>{d.bowler.overs}</td><td>{d.bowler.maidens}</td><td>{d.bowler.runs}</td>
                <td><b>{d.bowler.wkts}</b></td>
                <td>{d.bowler.overs ? (d.bowler.runs / (Math.floor(d.bowler.overs) + ((d.bowler.overs % 1) * 10) / 6)).toFixed(2) : '0.00'}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      <div className="lc-comm">
        <span className="lc-lbl">Commentary</span>
        {d.commentary.map((c, i) => (
          <div key={i} className="lc-line">
            <span className="lc-ov">{c.over}</span>
            <span className={`lc-ball sm ${c.k}`}>{c.l}</span>
            <div>
              <b>{c.text}</b>
              {c.more && <p>{c.more}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
