import { useCallback, useEffect, useState } from 'react'
import { useLenis, prefersReducedMotion, hasWebGL, gsap, ScrollTrigger, fireGlitch } from './hooks/useMotion'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import GlitchCut from './components/GlitchCut'
import Intake from './components/Intake'
import Subject from './components/Subject'
import EvidenceBoard from './components/EvidenceBoard'
import CaseDrawer from './components/CaseDrawer'
import Forensics from './components/Forensics'
import Associates from './components/Associates'
import Record from './components/Record'
import TipLine from './components/TipLine'
import { projects } from './data/caseData'

export default function App() {
  const reduced = prefersReducedMotion()
  const [loaded, setLoaded] = useState(false)
  const [quick, setQuick] = useState(reduced)
  const [webgl] = useState(() => hasWebGL())
  const [openCase, setOpenCase] = useState(null) // project id
  const [filter, setFilter] = useState(null) // tool name

  useLenis(loaded && !quick)

  useEffect(() => {
    document.body.classList.toggle('is-loading', !loaded)
    document.documentElement.classList.toggle('is-quick', quick)
  }, [loaded, quick])

  // Section reveal animations + glitch cut between sections
  useEffect(() => {
    if (!loaded) return
    if (quick) return
    // IntersectionObserver drives reveals + glitch cuts: robust to late layout shifts
    const revealIO = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return
        gsap.to(e.target, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', clearProps: 'transform' })
        revealIO.unobserve(e.target)
      }),
      { rootMargin: '0px 0px -10% 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => revealIO.observe(el))
    const glitchIO = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && fireGlitch()),
      { rootMargin: '-45% 0px -54% 0px' }
    )
    document.querySelectorAll('section[data-glitch]').forEach((el) => glitchIO.observe(el))
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    refresh()
    return () => {
      revealIO.disconnect()
      glitchIO.disconnect()
      window.removeEventListener('load', refresh)
      gsap.set('.reveal', { clearProps: 'opacity,transform' })
    }
  }, [loaded, quick])

  const openProject = useCallback((id) => setOpenCase(id), [])
  const project = projects.find((p) => p.id === openCase) || null

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <div className="grain" aria-hidden="true" />
      {!quick && <Cursor />}
      {!quick && <GlitchCut />}
      <Nav quick={quick} onToggleQuick={() => setQuick((q) => !q)} />
      <main>
        <Intake ready={loaded} quick={quick} webgl={webgl} />
        <Subject />
        <EvidenceBoard filter={filter} onOpen={openProject} quick={quick} onClearFilter={() => setFilter(null)} />
        <Forensics filter={filter} onFilter={setFilter} onOpen={openProject} />
        <Associates quick={quick} />
        <Record quick={quick} />
        <TipLine />
      </main>
      <CaseDrawer project={project} onClose={() => setOpenCase(null)} onNavigate={openProject} />
    </>
  )
}
