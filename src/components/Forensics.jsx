import { skills, sceneTools, projects } from '../data/caseData'
import { SceneTape, SectionHead } from './Shared'
import { scrollToId } from '../hooks/useMotion'

export default function Forensics({ filter, onFilter, onOpen }) {
  const pick = (t) => onFilter(filter === t ? null : t)
  const linked = filter ? projects.filter((p) => p.stack.some((s) => s.toLowerCase() === filter.toLowerCase())) : []

  return (
    <section id="forensics" className="section" data-glitch aria-labelledby="forensics-title">
      <SceneTape text="FORENSICS LAB · AUTHORISED PERSONNEL" />
      <div className="wrap" style={{ paddingTop: 100 }}>
        <SectionHead no="03 · FORENSICS" title="Tools of the trade" kicker="Every skill is bagged and tagged. Pick one to trace which cases it turned up in." />
        <span id="forensics-title" className="sr-only">Skills</span>

        <div className="bags">
          {skills.map((b) => {
            const active = b.items.some((i) => i === filter)
            return (
              <div key={b.name} className={`bag reveal ${active ? 'is-active' : ''}`}>
                <div className="bag__seal" aria-hidden="true">EVIDENCE · SEALED</div>
                <div className="bag__body">
                  <span className="bag__tag">{b.tag}</span>
                  <span className="bag__name">{b.name}</span>
                  <div className="bag__items">
                    {b.items.map((i) => (
                      <button key={i} type="button" className={`item-btn ${filter === i ? 'is-active' : ''}`} aria-pressed={filter === i} onClick={() => pick(i)} data-cursor="TRACE">
                        {i}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="forensics__scene reveal">
          <span className="label">Also recovered at the scene</span>
          <div className="bag__items">
            {sceneTools.map((t) => (
              <button key={t} type="button" className={`item-btn ${filter === t ? 'is-active' : ''}`} aria-pressed={filter === t} onClick={() => pick(t)} data-cursor="TRACE">
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="paper forensics__report reveal" role="status" aria-live="polite">
          {filter ? (
            <>
              <span>
                <b>LAB REPORT:</b> <i>{filter}</i> found in {linked.length ? linked.map((p) => p.caseNo).join(', ') : 'no closed cases yet'}.
              </span>
              <span style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {linked.map((p) => (
                  <button key={p.id} type="button" className="btn btn--ink" onClick={() => onOpen(p.id)}>{p.caseNo}</button>
                ))}
                <button type="button" className="btn btn--red" onClick={() => scrollToId('evidence')}>Trace on board ↑</button>
              </span>
            </>
          ) : (
            <span><b>LAB REPORT:</b> awaiting a sample — select any tool above.</span>
          )}
        </div>
      </div>
    </section>
  )
}
