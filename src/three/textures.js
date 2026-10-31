import * as THREE from 'three'
import { subject, projects, achievements } from '../data/caseData'

// All 3D surfaces are painted on canvases at runtime — no image downloads needed.

function make(w, h, draw) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')
  draw(g, w, h)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

function grain(g, w, h, amount = 0.06, n = 9000) {
  for (let i = 0; i < n; i++) {
    g.fillStyle = Math.random() > 0.5 ? `rgba(0,0,0,${amount})` : `rgba(255,255,255,${amount * 0.6})`
    g.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5)
  }
}

export function woodTexture() {
  const t = make(1024, 1024, (g, w, h) => {
    g.fillStyle = '#21160f'
    g.fillRect(0, 0, w, h)
    for (let y = 0; y < h; y += 2) {
      const v = Math.sin(y * 0.045) * 0.5 + Math.sin(y * 0.013 + 2) * 0.5
      g.fillStyle = `rgba(${70 + v * 20},${45 + v * 12},${28 + v * 8},${0.35 + Math.random() * 0.2})`
      g.fillRect(0, y, w, 2)
    }
    for (let i = 0; i < 60; i++) {
      g.strokeStyle = `rgba(10,6,3,${0.15 + Math.random() * 0.2})`
      g.lineWidth = 1 + Math.random() * 2
      g.beginPath()
      const y = Math.random() * h
      g.moveTo(0, y)
      g.bezierCurveTo(w * 0.3, y + 10 * Math.random(), w * 0.6, y - 12, w, y + 6)
      g.stroke()
    }
    // a coffee ring, because every detective has one
    g.strokeStyle = 'rgba(90,50,20,.35)'
    g.lineWidth = 8
    g.beginPath()
    g.arc(w * 0.78, h * 0.3, 70, 0.2, Math.PI * 1.85)
    g.stroke()
    grain(g, w, h, 0.05)
  })
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(2, 2)
  return t
}

export function coverTexture() {
  return make(1024, 740, (g, w, h) => {
    g.fillStyle = '#d9b77a'
    g.fillRect(0, 0, w, h)
    grain(g, w, h, 0.05, 14000)
    g.fillStyle = '#1c1b19'
    g.font = '700 30px "Courier Prime", monospace'
    g.fillText('DEPARTMENT OF INVESTIGATIONS · IIT GUWAHATI DIVISION', 60, 80)
    g.fillRect(60, 96, w - 120, 3)
    g.font = '120px "Anton", Impact, sans-serif'
    g.fillText('CASE FILE', 60, 250)
    g.font = '86px "Anton", Impact, sans-serif'
    g.fillText(`#${subject.caseNo}`, 60, 350)
    g.font = '700 34px "Courier Prime", monospace'
    g.fillText(`SUBJECT: ${subject.name.toUpperCase()}`, 60, 440)
    g.fillText('STATUS: OPEN — ACTIVELY RECRUITING', 60, 490)
    // stamp
    g.save()
    g.translate(w - 300, h - 150)
    g.rotate(-0.22)
    g.strokeStyle = 'rgba(179,36,30,.9)'
    g.lineWidth = 8
    g.strokeRect(-210, -60, 420, 120)
    g.lineWidth = 3
    g.strokeRect(-198, -48, 396, 96)
    g.fillStyle = 'rgba(179,36,30,.9)'
    g.font = '700 70px "Stardos Stencil", "Anton", sans-serif'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText('CLASSIFIED', 0, 4)
    g.restore()
  })
}

export function plainManila() {
  return make(256, 256, (g, w, h) => {
    g.fillStyle = '#cfae72'
    g.fillRect(0, 0, w, h)
    grain(g, w, h, 0.05, 3000)
  })
}

export function dossierTexture() {
  return make(820, 1060, (g, w, h) => {
    g.fillStyle = '#efe6d2'
    g.fillRect(0, 0, w, h)
    grain(g, w, h, 0.03, 6000)
    g.fillStyle = '#1c1b19'
    g.font = '700 30px "Courier Prime", monospace'
    g.fillText('SUBJECT PROFILE', 50, 70)
    g.fillRect(50, 84, w - 100, 3)
    g.font = '24px "Courier Prime", monospace'
    const lines = [
      `NAME ........ ${subject.name}`,
      `PROGRAM ..... B.Tech, DS & AI`,
      `INSTITUTE ... IIT Guwahati`,
      '',
      'KNOWN ACTIVITY:',
      ...projects.map((p) => `- ${p.title}`),
      '',
      'PRIOR RECORD:',
      ...achievements.map((a) => `- ${a.count != null ? `${a.prefix}${a.count} ` : ''}${a.title}`.slice(0, 44)),
    ]
    lines.forEach((l, i) => g.fillText(l, 50, 140 + i * 40))
    // mugshot box
    g.strokeStyle = '#1c1b19'
    g.lineWidth = 2
    g.strokeRect(w - 250, 120, 190, 230)
    g.fillStyle = '#2a2f35'
    g.fillRect(w - 244, 126, 178, 218)
    g.fillStyle = '#4a525b'
    g.beginPath()
    g.arc(w - 155, 205, 42, 0, Math.PI * 2)
    g.fill()
    g.fillRect(w - 215, 260, 120, 84)
    // redaction bars
    g.fillStyle = '#1c1b19'
    g.fillRect(50, h - 190, 420, 26)
    g.fillRect(50, h - 145, 300, 26)
    g.fillRect(50, h - 100, 380, 26)
  })
}

export function polaroidTexture(caption, seed = 1) {
  return make(512, 620, (g, w, h) => {
    g.fillStyle = '#f7f2e8'
    g.fillRect(0, 0, w, h)
    const ph = h - 130
    const grd = g.createLinearGradient(0, 0, w, ph)
    grd.addColorStop(0, '#3a4048')
    grd.addColorStop(1, '#16191c')
    g.fillStyle = grd
    g.fillRect(28, 28, w - 56, ph - 28)
    // abstract "surveillance" shapes
    g.fillStyle = 'rgba(200,205,210,.18)'
    for (let i = 0; i < 6; i++) {
      const x = 60 + ((seed * 97 + i * 61) % (w - 160))
      g.fillRect(x, 120 + i * 18, 40 + ((seed + i) % 4) * 30, ph - 200 - i * 30)
    }
    g.fillStyle = 'rgba(236,230,218,.55)'
    g.beginPath()
    g.arc(w / 2, ph * 0.45, 46, 0, Math.PI * 2)
    g.fill()
    g.fillRect(w / 2 - 70, ph * 0.45 + 52, 140, 160)
    grain(g, w, h, 0.07, 9000)
    g.fillStyle = '#1c1b19'
    g.font = '36px "Permanent Marker", cursive'
    g.fillText(caption, 36, h - 46)
  })
}

export function stickyTexture(text) {
  return make(400, 400, (g, w, h) => {
    g.fillStyle = '#f2e27a'
    g.fillRect(0, 0, w, h)
    grain(g, w, h, 0.03, 2000)
    g.fillStyle = '#1c1b19'
    g.font = '40px "Permanent Marker", cursive'
    const words = text.split(' ')
    let line = ''
    let y = 80
    words.forEach((word) => {
      const test = line + word + ' '
      if (g.measureText(test).width > w - 60) {
        g.fillText(line, 30, y)
        line = word + ' '
        y += 54
      } else line = test
    })
    g.fillText(line, 30, y)
  })
}
