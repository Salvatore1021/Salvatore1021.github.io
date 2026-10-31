// ─────────────────────────────────────────────────────────────
//  CASE DATA — every piece of content on the site lives here.
//  Add a project  → push one object into `projects` (it gets a
//  card, a pin, threads and a full case file automatically).
//  Add a section  → see README.md.
// ─────────────────────────────────────────────────────────────

export const subject = {
  name: 'Daksh Bhutani',
  caseNo: '250150012',
  role: 'B.Tech · Data Science & Artificial Intelligence',
  institute: 'Indian Institute of Technology, Guwahati',
  tagline: '“We are what we repeatedly do. Excellence, then, is not an act, but a habit.” — Will Durant',
  photo: 'subject.jpg', // drop your photo in /public/subject.jpg (silhouette shown until then)
  resume: 'Daksh_Bhutani_Resume.pdf',
  contacts: {
    email: 'd.bhutani@iitg.ac.in',
    altEmail: 'dakshb120@gmail.com',
    phone: '+91-9310551449',
    linkedin: 'https://linkedin.com/in/daksh-bhutani1512',
    github: 'https://github.com/', // ← put your GitHub profile URL here
  },
}

export const education = [
  { record: 'B.Tech (Major), Data Science & AI', institution: 'IIT Guwahati', score: '8.74', unit: 'CGPA', year: '2025 – present', highlight: true },
  { record: 'Senior Secondary (XII)', institution: 'CBSE Board', score: '91.8', unit: '%', year: '2025' },
  { record: 'Secondary (X)', institution: 'CBSE Board', score: '94.6', unit: '%', year: '2023' },
]

export const courses = {
  Mathematics: ['Linear Algebra', 'Calculus', 'Probability & Random Processes', 'Differential Equations', 'Statistics for Data Science'],
  'Computer Science': ['Data Structures & Algorithms', 'Discrete Mathematics', 'Introduction to Computing'],
}

export const projects = [
  {
    id: 'case-01',
    caseNo: 'CASE #01',
    date: 'OCT 2026',
    title: 'Brand AI-Readiness Audit',
    subtitle: 'Agent Skill Marketplace',
    venue: 'Adobe University Hackathon 2026 — National Runner-Up',
    stamp: 'RUNNER-UP',
    summary: 'Audits any website for AI-assistant discoverability and engagement, returning one schema-valid JSON report.',
    metrics: [
      { value: '22', label: 'deterministic checks' },
      { value: '~13 s', label: 'to audit a live site' },
      { value: '266', label: 'domains screened' },
      { value: '99', label: 'unit tests' },
    ],
    facts: [
      'Built an Agent Skill Marketplace (4 skills, 22 deterministic checks) auditing any website for AI-assistant discoverability and engagement into one schema-valid JSON report.',
      'Engineered a robots-aware, GET-only BFS crawler sharing one time/page budget across 3 detector skills, with sitemap-driven template sampling and per-redirect robots checks; audits a live site in ~13 s.',
      'Calibrated severities on field research across 5 AI assistants and a 266-domain access screen (bans on all 5 citation-critical crawlers: 0/150 cited vs 3/65 ignored), refuting 4 hypotheses via matched cohorts.',
      "Audited the tool's own 47 reports to find and fix 6 harness defects (e.g. an apex-to-www split shrinking a 1,050-page site to 6 pages); validated by 99 unit tests and 49 offline verification checks.",
    ],
    stack: ['Python', 'BFS Crawler', 'JSON Schema', 'Unit Tests'],
    github: '', // ← repo URL
    image: 'evidence/case-01.jpg',
    board: { x: 34, y: 11, rot: 2 },
  },
  {
    id: 'case-02',
    caseNo: 'CASE #02',
    date: 'SEPT 2026',
    title: 'FarePlay',
    subtitle: 'National Airfare Price Index',
    venue: 'Smart India Hackathon 2026 — MoSPI Problem Statement',
    stamp: 'SOLVED',
    summary: 'A compliant airfare scraping pipeline feeding CPI-grade price indices, served on a live dashboard.',
    metrics: [
      { value: '100', label: 'scrape tasks / day' },
      { value: '91.7%', label: 'cells de-biased' },
      { value: '4', label: 'index formulas' },
      { value: '148', label: 'unit tests' },
    ],
    facts: [
      'Built a Scrapy + Playwright pipeline over 20 routes × 5 advance-purchase windows (100 tasks/day) behind a compliance gateway (robots.txt, ToS, rate limits), stored in PostgreSQL.',
      'Implemented four CPI-grade index formulas (Carli, Jevons, Törnqvist, GEKS); switching to geometric means removed an upward bias present in 91.7% of multi-quote cells (up to 11.3%).',
      'Served it via FastAPI and a Chart.js dashboard with APScheduler daily runs; covered by 148 unit tests.',
    ],
    stack: ['Python', 'Scrapy', 'Playwright', 'PostgreSQL', 'FastAPI', 'Chart.js', 'APScheduler'],
    github: '',
    image: 'evidence/case-02.jpg',
    board: { x: 66, y: 50, rot: -3 },
  },
  {
    id: 'case-03',
    caseNo: 'CASE #03',
    date: 'MAR 2026',
    title: 'SkillDeck',
    subtitle: 'AI-Driven Skill Analyzer',
    venue: 'Rhapsody 4.0 Hackathon, IISc Bangalore',
    stamp: 'CLOSED',
    summary: 'Reads a CV, finds the skill gaps that matter most, and builds a dependency-aware learning roadmap.',
    metrics: [
      { value: 'PDF/DOCX', label: 'CV parsing' },
      { value: 'LLM', label: 'OpenAI + local' },
      { value: 'Kahn', label: 'topological roadmaps' },
    ],
    facts: [
      'Built a FastAPI backend integrating OpenAI and local LLMs to concurrently extract, parse and normalize candidate competencies from PDF/DOCX files against a custom JSON skill taxonomy.',
      'Engineered a gap-scoring engine that ranks skill deficits by mandatory weighting, gap magnitude and required proficiency, so the most critical gaps are addressed first.',
      "Implemented a dependency-aware pathway engine using NetworkX and Kahn's Algorithm to generate topologically sorted, phase-grouped learning roadmaps from a curated course catalog.",
    ],
    stack: ['Python', 'FastAPI', 'OpenAI', 'Local LLMs', 'NetworkX'],
    github: '',
    image: 'evidence/case-03.jpg',
    board: { x: 22, y: 60, rot: -1.5 },
  },
]

// Extra items pinned on the board, and which items the red thread joins.
export const boardExtras = [
  { id: 'photo', type: 'photo', caption: 'Exhibit A — finale, Adobe HQ Noida', image: 'evidence/adobe-finale.jpg', board: { x: 4, y: 13, rot: -5 } },
  { id: 'note', type: 'note', text: 'All 3 cases: scrapers + data pipelines. Pattern?', board: { x: 74, y: 10, rot: 4 } },
]
export const threads = [
  ['photo', 'case-01'],
  ['case-01', 'case-02'],
  ['case-02', 'case-03'],
  ['case-03', 'case-01'],
  ['note', 'case-02'],
  ['photo', 'case-03'],
]

export const skills = [
  { tag: 'EXHIBIT L-1', name: 'Languages', items: ['Python', 'C/C++', 'R', 'SQL', 'JavaScript'] },
  { tag: 'EXHIBIT L-2', name: 'Data & ML', items: ['Pandas', 'NumPy', 'Scikit-Learn', 'Matplotlib'] },
  { tag: 'EXHIBIT L-3', name: 'Scraping & Web', items: ['Playwright', 'Scrapy', 'FastAPI'] },
]
// Tools that appear in the projects but not in the skills list above.
export const sceneTools = ['PostgreSQL', 'Chart.js', 'APScheduler', 'NetworkX', 'OpenAI', 'Local LLMs', 'JSON Schema', 'BFS Crawler']

export const positions = [
  { initials: 'CC', role: 'Deputy Coordinator', org: 'Coding Club, IIT Guwahati', from: 'SEPT 2026', to: 'PRESENT' },
  { initials: 'TN', role: 'Organiser, Web Operations', org: 'Techniche, IIT Guwahati', from: 'FEB 2025', to: 'PRESENT' },
  { initials: 'SAB', role: 'Branch Representative, DS & AI', org: "Students' Academic Board, IIT Guwahati", from: 'MAY 2025', to: 'PRESENT' },
]

export const achievements = [
  { year: '2026', title: 'National Runner-Up', detail: 'Adobe University Hackathon 2026, among 3,00,000+ participants; one of the top 8 teams invited to the finale at Adobe India HQ, Noida.', prefix: '#', count: 2, suffix: '', stamp: true },
  { year: '2026', title: 'Codeforces', detail: 'Max rating 1320; longest daily solving streak of 100+ days.', prefix: '', count: 1320, suffix: '' },
  { year: '2025', title: 'JEE Advanced — All India Rank', detail: 'AIR 973 among 0.18 million candidates.', prefix: 'AIR ', count: 973, suffix: '' },
]

export const sections = [
  { id: 'intake', no: '00', label: 'Intake' },
  { id: 'subject', no: '01', label: 'Subject' },
  { id: 'evidence', no: '02', label: 'Evidence' },
  { id: 'forensics', no: '03', label: 'Forensics' },
  { id: 'associates', no: '04', label: 'Associates' },
  { id: 'record', no: '05', label: 'Record' },
  { id: 'tipline', no: '06', label: 'Tip Line' },
]
