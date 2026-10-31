import { useEffect, useRef, useState } from 'react'
import { gsap } from '../hooks/useMotion'

export function Fingerprint({ color = 'var(--cyan)', size = 90 }) {
  return (
    <svg width={size} height={size * 1.22} viewBox="0 0 90 110" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M45 10c-20 0-32 15-32 34v20" />
      <path d="M45 20c-14 0-23 11-23 25v28" />
      <path d="M45 30c-8 0-14 7-14 16v36" />
      <path d="M45 40c-3 0-5 3-5 7v48" />
      <path d="M45 10c20 0 32 15 32 34v28" />
      <path d="M45 20c14 0 23 11 23 25v40" />
      <path d="M45 30c8 0 14 7 14 16v46" />
      <path d="M50 47v52" />
    </svg>
  )
}

const STEPS = ['VERIFYING CLEARANCE', 'DECRYPTING CASE FILE', 'PINNING EVIDENCE', 'ACCESS GRANTED']

export default function Loader({ onDone }) {
  const [pct, setPct] = useState(0)
  const root = useRef(null)
  const done = useRef(false)

  const finish = () => {
    if (done.current) return
    done.current = true
    gsap.to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'expo.inOut', onComplete: onDone })
  }

  useEffect(() => {
    let raf
    const start = performance.now()
    const minTime = 2200
    let fontsReady = false
    ;(document.fonts?.ready || Promise.resolve()).then(() => (fontsReady = true))
    const loop = (t) => {
      const p = Math.min(1, (t - start) / minTime)
      const target = fontsReady ? p : Math.min(p, 0.9)
      setPct(Math.round(target * 100))
      if (target >= 1) setTimeout(finish, 450)
      else raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    const hard = setTimeout(finish, 6000) // never trap a visitor behind the loader
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(hard)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const step = STEPS[Math.min(STEPS.length - 1, Math.floor(pct / 34))]

  return (
    <div className="loader" ref={root} onClick={finish} role="status" aria-live="polite" style={{ clipPath: 'inset(0 0 0 0)' }}>
      <div className="loader__inner">
        <div className="loader__scan">
          <Fingerprint />
          <div className="loader__beam" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="loader__pct">{pct}%</span>
          <span className={pct >= 100 ? 'loader__granted' : 'loader__status'}>
            {step}
            {pct < 100 && <span className="caret">_</span>}
          </span>
          <span className="loader__file">CASE FILE #250150012 · click to skip</span>
        </div>
      </div>
    </div>
  )
}
