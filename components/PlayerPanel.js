'use client'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import { qualityLabel, resultFor } from '../lib/streams'
import { AD_SECONDS, MIDROLL_MINUTES, usePlan } from '../lib/plan'
import { AdBreak } from './Ads'
import Icon from './Icon'

export const goPro = () => window.dispatchEvent(new CustomEvent('ls:gopro'))

const VideoPlayer = dynamic(() => import('./VideoPlayer'), { ssr: false })

// Video + checking/offline overlays + server pills. Shared by Watch and TV Mode.
export default function PlayerPanel({ player, adKey }) {
  const { channel, server, url, status, progress, notice, onFail, pickServer, retry } = player
  const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0
  const { pro } = usePlan()
  const [ad, setAd] = useState(null) // null | 'pre' | 'mid'
  const watched = useRef(0)

  // Pre-roll: free users see one ad when they open a match / start TV Mode (not on every channel switch)
  useEffect(() => {
    watched.current = 0
    setAd(adKey && !pro ? 'pre' : null)
  }, [adKey]) // eslint-disable-line react-hooks/exhaustive-deps

  // Going Pro removes any ad immediately
  useEffect(() => { if (pro) setAd(null) }, [pro])

  // Mid-roll: count watching time; every MIDROLL_MINUTES show another ad break
  useEffect(() => {
    if (pro || ad || status !== 'playing') return
    const t = setInterval(() => {
      watched.current += 1
      if (watched.current >= MIDROLL_MINUTES * 60) {
        watched.current = 0
        setAd('mid')
      }
    }, 1000)
    return () => clearInterval(t)
  }, [pro, ad, status])

  const adDone = useCallback(() => setAd(null), [])
  // During the pre-roll the stream is checked but not started; during a mid-roll it is muted and covered
  const playUrl = ad === 'pre' ? null : url

  return (
    <div className="ppanel">
      <div className="ppanel-video">
        <VideoPlayer url={playUrl} onStreamFail={onFail} muted={ad === 'mid'} />

        {ad && <AdBreak kind={ad} seconds={AD_SECONDS} onDone={adDone} onGoPro={goPro} />}

        {status === 'checking' && !ad && (
          <div className="poverlay">
            <span className="spinner" />
            <b>Finding the best stream…</b>
            <span>Checking which servers work and their quality</span>
            <div className="pbar"><i style={{ width: `${Math.max(pct, 6)}%` }} /></div>
          </div>
        )}

        {status === 'offline' && !ad && (
          <div className="poverlay">
            <Icon name="signal" size={34} />
            <b>No working stream right now</b>
            <span>Every server for these channels was checked. Try again in a minute.</span>
            <button className="btn" onClick={retry}><Icon name="refresh" size={16} />Check again</button>
          </div>
        )}

        {status === 'playing' && server && !ad && (
          <div className="pbadge">
            <span className="live-dot" />
            {channel?.name}
            {server.height > 0 && <em>{server.height}p</em>}
          </div>
        )}

        {notice && !ad && <div className="ptoast"><Icon name="refresh" size={15} />{notice}</div>}
      </div>

      {channel && (
        <div className="servers">
          <span className="servers-label">Servers</span>
          <div className="servers-row">
            {channel.servers.map((s, i) => {
              const r = resultFor(s.url)
              const off = r && !r.ok
              return (
                <button key={i} className={`chip srv ${server?.url === s.url ? 'on' : ''} ${off ? 'off' : ''}`} onClick={() => pickServer(s)}
                  title={off ? 'Not responding' : r?.ok ? 'Working' : 'Not checked yet'}>
                  <span className={`sdot ${r ? (r.ok ? 'ok' : 'bad') : ''}`} />
                  {s.label}
                  {r?.ok && r.height > 0 && <em>{qualityLabel(r.height)}</em>}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
