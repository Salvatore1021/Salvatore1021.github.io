import { useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks/useMotion'

export function SceneTape({ text = 'CRIME SCENE · DO NOT CROSS', alt = false }) {
  const items = Array.from({ length: 8 }, (_, i) => (
    <span key={i} className="tape__item">{text}</span>
  ))
  return (
    <div className={`tape ${alt ? 'tape--alt' : ''}`} aria-hidden="true">
      <div className="tape__track">{items}{items}</div>
    </div>
  )
}

export function SectionHead({ no, title, kicker }) {
  return (
    <div className="section__head reveal">
      <span className="section__no">{no}</span>
      <h2 className="section__title glitch" data-text={title}>{title}</h2>
      {kicker && <p className="section__kicker">{kicker}</p>}
    </div>
  )
}

/** Types its text once it scrolls into view. */
export function Typewriter({ text, speed = 28, start = true, className, as: Tag = 'span' }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView || !start) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(text.length)
      return
    }
    let i = 0
    const id = setInterval(() => {
      i += 1
      setN(i)
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [inView, start, text, speed])
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, n)}</span>
      {n < text.length && <span className="caret" aria-hidden="true">▌</span>}
    </Tag>
  )
}

/** <img> that falls back to a labelled evidence placeholder until the file exists. */
export function EvidenceImage({ src, alt, label }) {
  const [ok, setOk] = useState(true)
  if (!src || !ok) return <span style={{ padding: 12 }}>[{label || alt}]</span>
  return <img src={src} alt={alt} loading="lazy" onError={() => setOk(false)} />
}
