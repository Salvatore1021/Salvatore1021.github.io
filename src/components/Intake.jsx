import { lazy, Suspense, useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, scrollToId } from '../hooks/useMotion'
import { subject } from '../data/caseData'
import { Typewriter } from './Shared'

const DeskScene = lazy(() => import('../three/DeskScene'))

function Folder2D() {
  return (
    <div className="folder2d" aria-hidden="true">
      <div style={{ fontWeight: 700, fontSize: 13 }}>DEPARTMENT OF INVESTIGATIONS · IITG DIVISION</div>
      <div className="folder2d__no">CASE FILE<br />#{subject.caseNo}</div>
      <div className="folder2d__stamp">CLASSIFIED</div>
    </div>
  )
}

export default function Intake({ ready, quick, webgl }) {
  const section = useRef(null)
  const overlay = useRef(null)
  const progress = useRef(0)
  const show3D = webgl && !quick

  useEffect(() => {
    if (quick) return
    const st = ScrollTrigger.create({
      trigger: section.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress
        if (overlay.current) {
          const fade = 1 - Math.min(1, Math.max(0, (self.progress - 0.15) / 0.35))
          overlay.current.style.opacity = fade
          overlay.current.style.transform = `translateY(${(1 - fade) * -40}px)`
        }
      },
    })
    return () => st.kill()
  }, [quick])

  useEffect(() => {
    if (!ready || quick) return
    const tl = gsap.timeline({ delay: 0.15 })
    tl.from('.intake__classified', { opacity: 0, y: 12, duration: 0.5 })
      .from('.intake__title', { yPercent: 40, opacity: 0, duration: 1.1, ease: 'expo.out' }, '<0.1')
      .from('.intake__tagline, .intake__ctas', { opacity: 0, y: 20, stagger: 0.1, duration: 0.8, ease: 'expo.out' }, '-=0.6')
    return () => tl.kill()
  }, [ready, quick])

  return (
    <section id="intake" className="intake" ref={section} aria-label="Intake — case file cover">
      <div className="intake__sticky">
        <div className="intake__canvas" aria-hidden="true">
          {show3D ? (
            <Suspense fallback={<Folder2D />}>
              {ready && <DeskScene progress={progress} />}
            </Suspense>
          ) : (
            <Folder2D />
          )}
        </div>
        <div className="intake__vignette" aria-hidden="true" />
        <div className="intake__overlay" ref={overlay}>
          <div className="wrap">
            <span className="intake__classified">CLASSIFIED · CLEARANCE GRANTED</span>
            <h1 className="intake__title glitch" data-text={`Case File #${subject.caseNo}`}>
              Case File<br />#{subject.caseNo}
            </h1>
            <Typewriter
              className="intake__type"
              start={ready}
              text={`SUBJECT: ${subject.name.toUpperCase()} — ${subject.role.toUpperCase()}, IIT GUWAHATI`}
            />
            <p className="intake__tagline">{subject.tagline}</p>
            <div className="intake__ctas">
              <button type="button" className="btn btn--tape" onClick={() => scrollToId('subject')}>Open the file ↓</button>
              <button type="button" className="btn btn--ghost" onClick={() => scrollToId('evidence')}>Go to evidence</button>
              <a className="btn btn--ghost" href={subject.resume} download>Full dossier (PDF)</a>
            </div>
          </div>
        </div>
        {!quick && <span className="intake__hint" aria-hidden="true">SCROLL TO OPEN THE FOLDER</span>}
      </div>
    </section>
  )
}
