# Case File #250150012 — Daksh Bhutani

An interactive crime-investigation portfolio. The visitor is the detective: they open a 3D case folder on a lamp-lit desk, read the subject's file, trace red thread across an evidence board, and file a tip.

**Stack:** Vite · React 19 · React Three Fiber (Three.js) · @react-three/postprocessing · GSAP · Lenis

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the build
```

## Deploy (Vercel, free)

1. Push this folder to a GitHub repo.
2. On vercel.com → **Add New Project** → import the repo → Framework preset **Vite** → Deploy.

Netlify and GitHub Pages also work: the build is fully static and `base: './'` makes it work from any sub-path.

## Make it yours — 3 quick edits

| What | Where |
|---|---|
| Your photo (mugshot card) | `public/subject.jpg` (portrait, plain wall works best). A silhouette shows until it exists. |
| GitHub profile + repo links | `src/data/caseData.js` → `subject.contacts.github` and each project's `github` |
| Evidence photos/screenshots | `public/evidence/adobe-finale.jpg`, `case-01.jpg`, `case-02.jpg`, `case-03.jpg` — shown in black-and-white automatically |

## Adding content later

All content lives in **`src/data/caseData.js`**.

- **New project** → add an object to `projects` (copy an existing one). Set `board: { x, y, rot }` as percentages on the cork board, and add `[ 'your-id', 'case-01' ]` pairs to `threads` to connect it. It gets a pinned card, red thread, a full case-file drawer and skill tracing automatically.
- **New skill** → add it to a bag in `skills`. If a project's `stack` contains the same name, clicking it in Forensics lights that case on the board.
- **New position / achievement** → add to `positions` / `achievements`.
- **New section** → create a component in `src/components/`, add it to `App.jsx`, and add `{ id, no, label }` to `sections` so it gets a folder tab.

## Site map

| Tab | Section | What happens |
|---|---|---|
| 00 Intake | 3D desk scene | Fingerprint loader → scroll opens the case folder, camera dollies in |
| 01 Subject | ID card, background check, field note | Hover/tap to un-redact contacts; torch-reveal note |
| 02 Evidence | Cork board | Cards pin in, thread strings itself; click a case → full file drawer (Esc closes, ← → between cases) |
| 03 Forensics | Evidence bags | Pick a tool → matching cases glow on the board |
| 04 Associates | Surveillance web | Positions of responsibility, threaded to the subject |
| 05 Record | Rap sheet | Numbers count up, Runner-Up stamp slams down |
| 06 Tip Line | Contact | Tip form opens the visitor's mail app; direct lines + résumé PDF |

## Accessibility & performance

- **Quick Read** toggle (top right) turns off 3D, smooth scroll and glitch; it's on automatically for `prefers-reduced-motion`.
- No WebGL → a 2D folder replaces the 3D scene.
- The 3D scene is lazy-loaded in its own chunk; all 3D textures are painted on canvases at runtime (no model downloads).
- Text colour pairs meet WCAG AA (most AAA); every interactive element is a real button or link with visible cyan focus rings.

## Palette

`#111315` night desk · `#1B1F23` steel · `#ECE6DA` bone · `#9AA3AD` ash · `#EFE6D2` case paper · `#D9B77A` manila · `#9C6E45` cork · `#E5372E` red thread · `#F2C230` scene tape · `#3CC8BE` CRT cyan · `#2B4C8C` blue ink

Fonts: Anton (headlines) · Courier Prime (documents/body) · Stardos Stencil (stamps/labels) · Permanent Marker (detective notes)
