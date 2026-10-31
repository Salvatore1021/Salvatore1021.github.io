import { useRef } from 'react'
import { achievements } from '../data/caseData'
import { SceneTape, SectionHead } from './Shared'
import { gsap, usePlayOnView } from '../hooks/useMotion'

export default function Record({ quick }) {
  const sheet = useRef(null)

  usePlayOnView(
    sheet,
    (tl) => {
      tl.from('.rap', { autoAlpha: 0, x: -30, stagger: 0.18, duration: 0.6, ease: 'expo.out' })
      gsap.utils.toArray('.rap__num', sheet.current).forEach((el) => {
        const end = Number(el.dataset.count)
        const obj = { v: end > 50 ? 0 : 99 } // small ranks count *down* to the winning number
        tl.to(obj, { v: end, duration: 1.4, ease: 'power3.out', onUpdate: () => (el.textContent = Math.round(obj.v).toLocaleString('en-IN')) }, 0.2)
      })
      tl.from('.rap__stamp', { scale: 3, autoAlpha: 0, rotate: -40, duration: 0.35, ease: 'power4.in' }, 1.2)
    },
    [],
    !quick
  )

  return (
    <section id="record" className="section" data-glitch aria-labelledby="record-title">
      <SceneTape text="PRIOR RECORD · ON FILE" />
      <div className="wrap" style={{ paddingTop: 100 }}>
        <SectionHead no="05 · RECORD" title="Prior record" kicker="The subject has been caught winning before." />
        <span id="record-title" className="sr-only">Achievements</span>
        <div className="paper rapsheet reveal" ref={sheet}>
          <div className="rapsheet__head">
            <h3>Rap sheet — {achievements.length} entries</h3>
            <span style={{ fontWeight: 700 }}>NO OUTSTANDING WARRANTS</span>
          </div>
          {achievements.map((a) => (
            <div className="rap" key={a.title}>
              <span className="rap__year">{a.year}</span>
              <div>
                <h4 className="rap__title">{a.title}</h4>
                <p className="rap__detail">{a.detail}</p>
              </div>
              <span className="rap__value" aria-label={`${a.prefix}${a.count}${a.suffix}`}>
                {a.prefix}<span className="rap__num" data-count={a.count}>{a.count.toLocaleString('en-IN')}</span>{a.suffix}
              </span>
              {a.stamp && <span className="stamp rap__stamp">NATIONAL RUNNER-UP</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
