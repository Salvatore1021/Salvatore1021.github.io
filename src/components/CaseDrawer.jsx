import { useEffect, useRef } from 'react'
import { projects } from '../data/caseData'
import { EvidenceImage } from './Shared'
import { getLenis } from '../hooks/useMotion'

export default function CaseDrawer({ project, onClose, onNavigate }) {
  const open = !!project
  const closeBtn = useRef(null)
  const lastFocus = useRef(null)
  const panel = useRef(null)

  useEffect(() => {
    const lenis = getLenis()
    if (open) {
      lastFocus.current = document.activeElement
      lenis?.stop()
      setTimeout(() => closeBtn.current?.focus(), 50)
      if (panel.current) panel.current.scrollTop = 0
    } else {
      lenis?.start()
      lastFocus.current?.focus?.()
    }
  }, [open, project?.id])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll('a[href], button')
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const idx = project ? projects.findIndex((p) => p.id === project.id) : -1
  const prev = idx > 0 ? projects[idx - 1] : null
  const next = idx >= 0 && idx < projects.length - 1 ? projects[idx + 1] : null

  return (
    <>
      <div className={`drawer-backdrop ${open ? 'is-open' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside
        ref={panel}
        className={`drawer ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-labelledby="drawer-title"
        data-lenis-prevent
        inert={!open}
      >
        <div className="drawer__clip" aria-hidden="true" />
        <button ref={closeBtn} className="drawer__close" type="button" onClick={onClose} aria-label="Close case file">×</button>
        {project && (
          <div className="drawer__inner">
            <div className="drawer__meta"><span>{project.caseNo} · {project.date}</span><span>STATUS: CLOSED</span></div>
            <span className="stamp drawer__stamp">{project.stamp}</span>
            <h3 id="drawer-title" className="drawer__title">{project.title}</h3>
            <div style={{ fontWeight: 700 }}>{project.subtitle}</div>
            <div className="drawer__venue">{project.venue}</div>
            <p className="drawer__summary">{project.summary}</p>
            <div className="drawer__metrics">
              {project.metrics.map((m) => (
                <div className="metric" key={m.label}><b>{m.value}</b><span>{m.label}</span></div>
              ))}
            </div>
            <div className="label" style={{ color: 'var(--ink-2)' }}>Findings</div>
            <ul className="drawer__facts">
              {project.facts.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <div className="label" style={{ color: 'var(--ink-2)' }}>Tools recovered</div>
            <div className="chips">{project.stack.map((s) => <span className="chip" key={s}>{s}</span>)}</div>
            <div className="drawer__photo"><EvidenceImage src={project.image} alt={`${project.title} screenshot`} label={`SCREENSHOT · add public/${project.image}`} /></div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {project.github ? (
                <a className="btn btn--ink" href={project.github} target="_blank" rel="noreferrer">View source on GitHub</a>
              ) : (
                <span className="chip" style={{ padding: '10px 14px' }}>Source link coming soon</span>
              )}
            </div>
            <div className="drawer__nav">
              {prev ? <button type="button" className="btn btn--ghost" style={{ color: 'var(--ink)', boxShadow: 'inset 0 0 0 1.5px var(--ink)' }} onClick={() => onNavigate(prev.id)}>← {prev.caseNo}</button> : <span />}
              {next ? <button type="button" className="btn btn--ghost" style={{ color: 'var(--ink)', boxShadow: 'inset 0 0 0 1.5px var(--ink)' }} onClick={() => onNavigate(next.id)}>{next.caseNo} →</button> : <span />}
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
