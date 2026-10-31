import { useEffect, useState } from 'react'
import { sections } from '../data/caseData'
import { scrollToId } from '../hooks/useMotion'

export default function Nav({ quick, onToggleQuick }) {
  const [active, setActive] = useState('intake')
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const line = window.innerHeight * 0.4
      let current = sections[0].id
      sections.forEach((s) => {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= line) current = s.id
      })
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = sections[sections.length - 1].id
      setActive(current)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const go = (e, id) => {
    e.preventDefault()
    setMenu(false)
    scrollToId(id)
  }

  return (
    <header className="nav">
      <a className="nav__brand" href="#intake" onClick={(e) => go(e, 'intake')}>FILE #250150012</a>
      <nav className="nav__tabs" aria-label="Case file sections">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className={`nav__tab ${active === s.id ? 'is-active' : ''}`} aria-current={active === s.id ? 'true' : undefined} onClick={(e) => go(e, s.id)}>
            {s.no} {s.label}
          </a>
        ))}
      </nav>
      <div className="nav__tools">
        <button className="toggle" type="button" aria-pressed={quick} onClick={onToggleQuick} title="Turns off 3D, smooth scroll and glitch effects">
          {quick ? 'FULL FILE' : 'QUICK READ'}
        </button>
        <button className="toggle nav__menu-btn" type="button" aria-expanded={menu} aria-controls="nav-drawer" onClick={() => setMenu((m) => !m)}>
          OPEN FILE {menu ? '▴' : '▾'}
        </button>
      </div>
      <div className="nav__drawer" id="nav-drawer" hidden={!menu}>
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'is-active' : ''} onClick={(e) => go(e, s.id)}>
            {s.no} · {s.label}
          </a>
        ))}
      </div>
    </header>
  )
}
