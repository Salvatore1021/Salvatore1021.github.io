import { useLayoutEffect, useRef, useState } from 'react'
import { positions, subject } from '../data/caseData'
import { SceneTape, SectionHead } from './Shared'
import { usePlayOnView } from '../hooks/useMotion'

// Where each tag sits on the web (percent of the board). Extend for more positions.
const SPOTS = [
  { left: '4%', top: '8%', rot: -4 },
  { left: '64%', top: '10%', rot: 3 },
  { left: '36%', top: '70%', rot: -2 },
  { left: '6%', top: '64%', rot: 2 },
  { left: '66%', top: '62%', rot: -3 },
]

export default function Associates({ quick }) {
  const web = useRef(null)
  const center = useRef(null)
  const tags = useRef([])
  const [paths, setPaths] = useState([])

  useLayoutEffect(() => {
    const measure = () => {
      const w = web.current
      if (!w || getComputedStyle(w).position !== 'relative' || w.offsetHeight < 400) return setPaths([])
      const wr = w.getBoundingClientRect()
      const c = center.current.getBoundingClientRect()
      const cx = c.left + c.width / 2 - wr.left
      const cy = c.top + c.height / 2 - wr.top
      setPaths(
        tags.current.filter(Boolean).map((t) => {
          const r = t.querySelector('.idtag__hole').getBoundingClientRect()
          const x = r.left + r.width / 2 - wr.left
          const y = r.top + r.height / 2 - wr.top
          const dist = Math.hypot(x - cx, y - cy)
          return `M ${cx} ${cy} Q ${(cx + x) / 2} ${(cy + y) / 2 + dist * 0.15} ${x} ${y}`
        })
      )
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(web.current)
    return () => ro.disconnect()
  }, [])

  usePlayOnView(
    web,
    (tl) => {
      tl.from('.web__center', { scale: 0, duration: 0.6, ease: 'back.out(2)' })
        .from('.idtag', { autoAlpha: 0, y: -50, stagger: 0.12, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.2')
        .fromTo('.web svg path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, stagger: 0.1 }, '-=0.3')
    },
    [paths.length > 0],
    !quick && paths.length > 0
  )

  const initials = subject.name.split(' ').map((n) => n[0]).join('')

  return (
    <section id="associates" className="section" data-glitch aria-labelledby="associates-title">
      <SceneTape text="KNOWN ASSOCIATIONS · UNDER SURVEILLANCE" alt />
      <div className="wrap" style={{ paddingTop: 100 }}>
        <SectionHead no="04 · ASSOCIATES" title="Known associations" kicker="Organisations the subject has been seen running, organising and representing." />
        <span id="associates-title" className="sr-only">Positions of responsibility</span>
        <div className="web reveal" ref={web}>
          <svg aria-hidden="true">
            {paths.map((d, i) => <path key={i} d={d} pathLength="1" strokeDasharray="1" />)}
          </svg>
          <div className="web__center" ref={center} aria-hidden="true">
            <span>{initials}<small>SUBJECT</small></span>
          </div>
          {positions.map((p, i) => {
            const s = SPOTS[i % SPOTS.length]
            return (
              <article key={p.role} ref={(el) => (tags.current[i] = el)} className="idtag" style={{ left: s.left, top: s.top, transform: `rotate(${s.rot}deg)` }}>
                <div className="idtag__hole" aria-hidden="true" />
                <h3 className="idtag__role">{p.role}</h3>
                <div className="idtag__org">{p.org}</div>
                <div className="idtag__dates">{p.from} → {p.to}</div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
