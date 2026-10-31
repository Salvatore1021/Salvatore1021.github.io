import { useEffect, useRef, useState } from 'react'

/** Ring cursor that eases after the pointer and grows with a label over evidence. */
export default function Cursor() {
  const el = useRef(null)
  const [label, setLabel] = useState('')
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, raf
    const move = (e) => {
      x = e.clientX
      y = e.clientY
      const t = e.target.closest?.('[data-cursor], a, button')
      el.current?.classList.toggle('is-hover', !!t)
      setLabel(t ? t.getAttribute('data-cursor') || '' : '')
    }
    const loop = () => {
      cx += (x - cx) * 0.2
      cy += (y - cy) * 0.2
      if (el.current) el.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    addEventListener('pointermove', move)
    raf = requestAnimationFrame(loop)
    return () => {
      removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <div className="cursor" ref={el} aria-hidden="true">
      <div className="cursor__ring">
        <span className="cursor__label">{label}</span>
      </div>
    </div>
  )
}
