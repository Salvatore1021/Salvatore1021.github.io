import { useRef, useState } from 'react'
import { subject, education, courses } from '../data/caseData'
import { SceneTape, SectionHead } from './Shared'

function Redacted({ children, href, label }) {
  const [open, setOpen] = useState(false)
  if (open && href) {
    return (
      <a className="redact is-open" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
        {children}
      </a>
    )
  }
  return (
    <button type="button" className="redact" onClick={() => setOpen(true)} aria-label={`Reveal ${label}`} data-cursor="REVEAL">
      {children}
    </button>
  )
}

function Silhouette() {
  return (
    <svg className="idcard__silhouette" viewBox="0 0 150 200" aria-hidden="true">
      <rect width="150" height="200" fill="#2a2f35" />
      <circle cx="75" cy="72" r="34" fill="#4a525b" />
      <path d="M18 200c4-48 28-72 57-72s53 24 57 72z" fill="#4a525b" />
    </svg>
  )
}

function IdCard() {
  const [photoOk, setPhotoOk] = useState(true)
  const c = subject.contacts
  return (
    <article className="idcard paper reveal" aria-label="Subject identification card">
      <div className="idcard__photo">
        <div className="idcard__marks" aria-hidden="true">6'<br />5'10<br />5'8<br />5'6<br />5'4<br />5'2<br />5'0</div>
        {photoOk ? <img src={subject.photo} alt={`Photo of ${subject.name}`} onError={() => setPhotoOk(false)} /> : <Silhouette />}
        <span className="idcard__board">#{subject.caseNo}</span>
      </div>
      <div className="idcard__body">
        <h3 className="idcard__name">{subject.name}</h3>
        <div className="idcard__row"><b>ROLL NO.</b><span>{subject.caseNo}</span></div>
        <div className="idcard__row"><b>PROGRAM</b><span>{subject.role}</span></div>
        <div className="idcard__row"><b>BASE</b><span>{subject.institute}</span></div>
        <div className="idcard__row"><b>EMAIL</b><Redacted href={`mailto:${c.email}`} label="email">{c.email}</Redacted></div>
        <div className="idcard__row"><b>ALT</b><Redacted href={`mailto:${c.altEmail}`} label="alternate email">{c.altEmail}</Redacted></div>
        <div className="idcard__row"><b>PHONE</b><Redacted href={`tel:${c.phone.replace(/[^+\d]/g, '')}`} label="phone">{c.phone}</Redacted></div>
        <div className="idcard__row"><b>LINKEDIN</b><Redacted href={c.linkedin} label="LinkedIn">/in/daksh-bhutani1512</Redacted></div>
        <span className="idcard__known">Known for: shipping tested code under hackathon deadlines.</span>
        <span className="idcard__hint">Hover the card or tap a black bar to un-redact.</span>
      </div>
    </article>
  )
}

function BackgroundCheck() {
  return (
    <div className="bgcheck reveal">
      <div className="bgcheck__tab">BACKGROUND CHECK · EDU</div>
      <div className="bgcheck__folder">
        <div className="bgcheck__sheet">
          <div className="bgcheck__head"><span>FORM BG-04 · ACADEMIC HISTORY</span><span>REF {subject.caseNo}</span></div>
          <div className="bgcheck__rows">
            {education.map((e) => (
              <div key={e.record} style={{ display: 'contents' }}>
                <span><b>{e.record}</b><br />{e.institution} · {e.year}</span>
                <span className={`bgcheck__score ${e.highlight ? 'is-circled' : ''}`}>
                  {e.score}{e.unit === '%' ? '%' : ''}{e.unit !== '%' && <small style={{ fontSize: 11, display: 'block', textAlign: 'center' }}>{e.unit}</small>}
                </span>
              </div>
            ))}
          </div>
          <div className="bgcheck__courses">
            <b>TRAINING RECORD (KEY COURSES)</b>
            {Object.entries(courses).map(([k, list]) => (
              <span key={k}><b>{k}:</b> {list.join(' · ')}</span>
            ))}
          </div>
          <span className="stamp stamp--blue bgcheck__verified">VERIFIED</span>
        </div>
      </div>
    </div>
  )
}

function FieldNote() {
  const ref = useRef(null)
  const [lit, setLit] = useState(false)
  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--x', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--y', `${e.clientY - r.top}px`)
  }
  return (
    <div
      className={`fieldnote reveal ${lit ? 'is-lit' : ''}`}
      ref={ref}
      onPointerMove={move}
      onClick={() => setLit((l) => !l)}
      data-cursor="TORCH"
      role="group"
      aria-label="Field note recovered from the subject's desk"
    >
      <div className="fieldnote__content">
        <span style={{ fontWeight: 700, fontSize: 14 }}>FIELD NOTE — RECOVERED FROM SUBJECT'S DESK</span>
        <span className="fieldnote__big">B.Tech, Data Science &amp; AI · IIT Guwahati</span>
        <span className="fieldnote__scrawl">Note to self: keep building. Ship more, talk less.</span>
      </div>
      <div className="fieldnote__dark" aria-hidden="true" />
      <span className="fieldnote__hint">{lit ? 'CLICK TO DIM' : 'MOVE THE TORCH · CLICK FOR LIGHTS'}</span>
    </div>
  )
}

export default function Subject() {
  return (
    <section id="subject" className="section" data-glitch aria-labelledby="subject-title">
      <SceneTape text="SUBJECT PROFILE · CONFIDENTIAL" />
      <div className="wrap" style={{ paddingTop: 100 }}>
        <SectionHead no="01 · SUBJECT" title="Who is this?" kicker="Identification, background check and one note we found under the desk lamp." />
        <span id="subject-title" className="sr-only">Subject profile and education</span>
        <div className="subject__grid">
          <IdCard />
          <BackgroundCheck />
          <FieldNote />
        </div>
      </div>
    </section>
  )
}
