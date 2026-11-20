'use client'
import { useState } from 'react'
import { PLANS, PRO_PRICE, activatePro, cancelPro, usePlan } from '../lib/plan'
import Icon from './Icon'

export default function Pricing() {
  const plan = usePlan()
  const [checkout, setCheckout] = useState(false)

  return (
    <div className="pricing">
      <div className="pricing-head">
        <h2>Choose your plan</h2>
        <p>Every match and channel is free. Go Pro to watch without ads.</p>
      </div>

      <div className="plans">
        {PLANS.map((p) => {
          const current = (p.id === 'pro') === plan.pro
          return (
            <div key={p.id} className={`plan ${p.id === 'pro' ? 'plan-pro' : ''} ${current ? 'current' : ''}`}>
              {p.id === 'pro' && <span className="plan-ribbon">Best value</span>}
              <div className="plan-name">{p.id === 'pro' && <Icon name="star" size={18} fill />}{p.name}</div>
              <div className="plan-price">
                {p.price === 0 ? <b>$0</b> : <b>${p.price}</b>}
                <span>/{p.period}</span>
              </div>
              <p className="plan-tag">{p.tagline}</p>
              <ul>
                {p.features.map((f) => (
                  <li key={f.text} className={f.on ? 'on' : 'off'}>
                    <span className="fi">{f.on ? '✓' : '•'}</span>{f.text}
                  </li>
                ))}
              </ul>
              {p.id === 'free' ? (
                <button className="btn plan-btn" disabled={!plan.pro} onClick={cancelPro}>
                  {plan.pro ? 'Switch to Free' : 'Your current plan'}
                </button>
              ) : plan.pro ? (
                <button className="btn plan-btn btn-gold" disabled>
                  <Icon name="star" size={16} fill />Pro active · renews {new Date(plan.until).toLocaleDateString()}
                </button>
              ) : (
                <button className="btn plan-btn btn-gold" onClick={() => setCheckout(true)}>
                  Go Pro — ${PRO_PRICE}/week
                </button>
              )}
            </div>
          )
        })}
      </div>

      <p className="pricing-foot">Prices in USD. Pro renews weekly; cancel anytime.</p>

      {checkout && (
        <div className="modal-wrap" onClick={() => setCheckout(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="icon-btn modal-x" onClick={() => setCheckout(false)} aria-label="Close"><Icon name="x" size={20} /></button>
            <div className="modal-title"><Icon name="star" size={20} fill />LiveSports Pro</div>
            <div className="modal-price"><b>${PRO_PRICE}</b><span>/week</span></div>
            <ul className="modal-list">
              <li>✓ No banner ads</li>
              <li>✓ No ads before or during streams</li>
              <li>✓ Cancel anytime</li>
            </ul>
            <div className="demo-note">
              <Icon name="info" size={16} />
              <span>Card payments aren&apos;t connected yet. This button turns on Pro on this device for testing — no charge.</span>
            </div>
            <button className="btn btn-gold plan-btn" onClick={() => { activatePro(); setCheckout(false) }}>
              Activate Pro (demo)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
