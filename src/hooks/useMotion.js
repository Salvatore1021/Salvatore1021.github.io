import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)
export { gsap, ScrollTrigger }

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

let lenisInstance = null
export const getLenis = () => lenisInstance

/** Smooth scroll wired into GSAP's ticker so ScrollTrigger stays in sync. */
export function useLenis(enabled) {
  useEffect(() => {
    if (!enabled) return
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true })
    lenisInstance = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisInstance = null
    }
  }, [enabled])
}

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  const lenis = getLenis()
  if (lenis) lenis.scrollTo(el, { offset: -10, duration: 1.4 })
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

/** Fires the full-screen glitch cut (and a chromatic spike in the 3D scene). */
export function fireGlitch() {
  window.dispatchEvent(new CustomEvent('casefile:glitch'))
}

/**
 * Builds a paused GSAP timeline inside a scoped context and plays it the first
 * time `ref` is ~30% on screen. IntersectionObserver is used instead of a
 * ScrollTrigger so it works no matter when layout settles.
 */
export function usePlayOnView(ref, build, deps, enabled = true) {
  useEffect(() => {
    if (!enabled || !ref.current) return
    let tl
    const ctx = gsap.context(() => {
      tl = gsap.timeline({ paused: true })
      build(tl)
    }, ref)
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          tl.play()
          io.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    io.observe(ref.current)
    return () => {
      io.disconnect()
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled])
}

export function useInView(ref, { once = true, threshold = 0.25 } = {}) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) setInView(false)
      },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, once, threshold])
  return inView
}
