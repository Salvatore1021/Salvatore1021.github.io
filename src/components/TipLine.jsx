import { useState } from 'react'
import { subject } from '../data/caseData'
import { SceneTape, SectionHead } from './Shared'

export default function TipLine() {
  const c = subject.contacts
  const [name, setName] = useState('')
  const [from, setFrom] = useState('')
  const [msg, setMsg] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const body = `${msg}\n\n— ${name}${from ? ` (${from})` : ''}`
    window.location.href = `mailto:${c.email}?subject=${encodeURIComponent(`Tip for case #${subject.caseNo} from ${name || 'an informant'}`)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  const lines = [
    { k: 'PRIMARY LINE', v: c.email, href: `mailto:${c.email}` },
    { k: 'BACKUP LINE', v: c.altEmail, href: `mailto:${c.altEmail}` },
    { k: 'PHONE', v: c.phone, href: `tel:${c.phone.replace(/[^+\d]/g, '')}` },
    { k: 'LINKEDIN', v: 'daksh-bhutani1512', href: c.linkedin },
    { k: 'GITHUB', v: 'Source code & repos', href: c.github },
  ]

  return (
    <section id="tipline" className="section" data-glitch aria-labelledby="tip-title">
      <SceneTape text="TIP LINE OPEN · 24 / 7" alt />
      <div className="wrap" style={{ paddingTop: 100 }}>
        <SectionHead no="06 · TIP LINE" title="Got a lead?" kicker="Internships, collaborations, hackathon teams — file a tip and the subject will respond." />
        <span id="tip-title" className="sr-only">Contact</span>
        <div className="tip__grid">
          <form className="paper tipform reveal" onSubmit={submit}>
            <h3>ANONYMOUS TIP FORM 7-B</h3>
            <label className="field">INFORMANT NAME<input required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
            <label className="field">ORGANISATION / EMAIL (OPTIONAL)<input value={from} onChange={(e) => setFrom(e.target.value)} /></label>
            <label className="field">STATEMENT<textarea required rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} /></label>
            <button className="btn btn--red" type="submit" style={{ alignSelf: 'flex-start' }}>File the tip</button>
            {sent && <span role="status" style={{ fontStyle: 'italic' }}>Your mail app should open with the tip ready to send.</span>}
          </form>
          <div className="tip__side reveal">
            {lines.map((l) => (
              <a key={l.k} className="tip__line" href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                <span>{l.k}</span>
                <b>{l.v}</b>
              </a>
            ))}
            <a className="btn btn--tape" href={subject.resume} download style={{ justifyContent: 'center' }}>Download full dossier (PDF)</a>
          </div>
        </div>
        <footer className="footer">
          <span>END OF FILE · #{subject.caseNo}</span>
          <span>© {new Date().getFullYear()} {subject.name}. Case status: open.</span>
        </footer>
      </div>
    </section>
  )
}
