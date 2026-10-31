import { useEffect, useRef } from 'react'
import { gsap } from '../hooks/useMotion'

/** A 350 ms RGB-slice "signal loss" overlay, fired between sections. */
export default function GlitchCut() {
  const root = useRef(null)
  useEffect(() => {
    let last = 0
    const run = () => {
      const now = performance.now()
      if (now - last < 900 || !root.current) return
      last = now
      const el = root.current
      const slices = el.querySelectorAll('span')
      el.classList.add('is-on')
      const tl = gsap.timeline({ onComplete: () => el.classList.remove('is-on') })
      slices.forEach((s) => {
        const top = Math.random() * 95
        gsap.set(s, { top: `${top}%`, height: `${2 + Math.random() * 7}%`, x: 0, opacity: 0.55 })
      })
      tl.to(slices, { x: () => gsap.utils.random(-60, 60), duration: 0.08, stagger: 0.015, ease: 'steps(2)' })
        .to(slices, { x: () => gsap.utils.random(-30, 30), duration: 0.08, ease: 'steps(2)' })
        .to(slices, { opacity: 0, duration: 0.12 })
      document.querySelectorAll('.section__title.glitch').forEach((t) => {
        t.classList.add('is-glitching')
        setTimeout(() => t.classList.remove('is-glitching'), 380)
      })
    }
    window.addEventListener('casefile:glitch', run)
    return () => window.removeEventListener('casefile:glitch', run)
  }, [])
  const colors = ['rgba(60,200,190,.5)', 'rgba(229,55,46,.5)', 'rgba(236,230,218,.25)', 'rgba(60,200,190,.4)', 'rgba(229,55,46,.4)', 'rgba(242,194,48,.3)']
  return (
    <div className="glitchcut" ref={root} aria-hidden="true">
      <div className="glitchcut__scan" />
      {colors.map((c, i) => (
        <span key={i} style={{ background: c }} />
      ))}
    </div>
  )
}
