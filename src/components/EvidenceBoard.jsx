import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { projects, boardExtras, threads } from '../data/caseData'
import { SceneTape, SectionHead, EvidenceImage } from './Shared'
import { usePlayOnView } from '../hooks/useMotion'

const matches = (p, tool) => !!tool && p.stack.some((s) => s.toLowerCase() === tool.toLowerCase())

export default function EvidenceBoard({ filter, onOpen, quick, onClearFilter }) {
  const board = useRef(null)
  const items = useRef({})
  const [paths, setPaths] = useState([])

  const measure = useCallback(() => {
    const b = board.current
    if (!b || getComputedStyle(b).aspectRatio === 'auto') return setPaths([])
    const br = b.getBoundingClientRect()
    const pinOf = (id) => {
      const el = items.current[id]
      if (!el) return null
      const pin = el.querySelector('.pin')
      const r = (pin || el).getBoundingClientRect()
      return { x: r.left + r.width / 2 - br.left, y: r.top + r.height / 2 - br.top }
    }
    setPaths(
      threads
        .map(([a, z]) => {
          const p1 = pinOf(a)
          const p2 = pinOf(z)
          if (!p1 || !p2) return null
          const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y)
          const mx = (p1.x + p2.x) / 2
          const my = (p1.y + p2.y) / 2 + dist * 0.14 // gravity sag
          return { a, z, d: `M ${p1.x} ${p1.y} Q ${mx} ${my} ${p2.x} ${p2.y}` }
        })
        .filter(Boolean)
    )
  }, [])

  useLayoutEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(board.current)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [measure])

  // pin cards in, then string the thread when the board scrolls into view
  usePlayOnView(
    board,
    (tl) => {
      tl.from('.board__item', { y: -80, autoAlpha: 0, duration: 0.7, stagger: 0.12, ease: 'back.out(1.6)' })
        .fromTo('.board__threads path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, stagger: 0.12, ease: 'power2.inOut' }, '-=0.3')
    },
    [paths.length > 0],
    !quick && paths.length > 0
  )

  const matchedIds = new Set(projects.filter((p) => matches(p, filter)).map((p) => p.id))
  const pathClass = (t) => {
    if (!filter) return ''
    return matchedIds.has(t.a) || matchedIds.has(t.z) ? 'is-hot' : 'is-cold'
  }
  const place = (bd) => ({ left: `${bd.x}%`, top: `${bd.y}%`, transform: `rotate(${bd.rot}deg)` })

  return (
    <section id="evidence" className="section" data-glitch aria-labelledby="evidence-title">
      <SceneTape text="EVIDENCE · HANDLE WITH CARE" alt />
      <div className="wrap" style={{ paddingTop: 100 }}>
        <SectionHead no="02 · EVIDENCE BOARD" title="The cases" kicker="Three closed cases, one pattern. Click any case card to open its full file." />
        <span id="evidence-title" className="sr-only">Projects</span>

        <div className="board reveal" ref={board}>
          <svg className="board__threads" aria-hidden="true">
            {paths.map((t) => (
              <path key={t.a + t.z} d={t.d} pathLength="1" strokeDasharray="1" className={pathClass(t)} />
            ))}
          </svg>

          {boardExtras.map((x) => (
            <div key={x.id} ref={(el) => (items.current[x.id] = el)} className={`board__item ${x.type === 'photo' ? 'polaroid' : 'sticky'}`} style={place(x.board)}>
              <span className="pin" aria-hidden="true" />
              {x.type === 'photo' ? (
                <>
                  <div className="polaroid__img"><EvidenceImage src={x.image} alt={x.caption} label="PHOTO · add public/evidence/adobe-finale.jpg" /></div>
                  <div className="polaroid__cap">{x.caption}</div>
                </>
              ) : (
                x.text
              )}
            </div>
          ))}

          {projects.map((p) => {
            const state = filter ? (matchedIds.has(p.id) ? 'is-match' : 'is-dim') : ''
            return (
              <button
                key={p.id}
                type="button"
                ref={(el) => (items.current[p.id] = el)}
                className={`board__item casecard ${state}`}
                style={place(p.board)}
                onClick={() => onOpen(p.id)}
                data-cursor="OPEN FILE"
                aria-label={`${p.caseNo}: ${p.title} — open case file`}
              >
                <span className="pin" aria-hidden="true" />
                <span className="casecard__top"><span>{p.caseNo}</span><span>{p.date}</span></span>
                <span className="casecard__title">{p.title}</span>
                <span className="casecard__sub">{p.subtitle} · {p.venue.split(' — ')[0]}</span>
                <span className="casecard__open">OPEN FILE →</span>
              </button>
            )
          })}
        </div>

        <div className="board__legend">
          <span>Red thread = shared methods. Cards are clickable; Esc closes a file.</span>
          {filter && (
            <span className="board__filter" role="status">
              Tracing <b>{filter}</b>: {matchedIds.size} case{matchedIds.size === 1 ? '' : 's'} linked
              <button type="button" onClick={onClearFilter}>clear</button>
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
