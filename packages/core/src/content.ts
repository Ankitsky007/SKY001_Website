// Single source of truth for site copy. Every version imports from here, so a change to the
// content doc (New Website <> Skyfall AI, tab "Skyfall Front Page") is made once.
// Copy is verbatim from that doc, including its typos, until the team signs off edits.

// Founder portraits: AI-generated studio shots from the founders' photos (round 1, option A),
// pending Ankit's pick and founder consent.
import kaheerPhoto from './assets/team/kaheer-suleman.jpg'
import samPhoto from './assets/team/sam-pasupalak.jpg'
import sumitPhoto from './assets/team/sumit-pasupalak.jpg'

export const site = {
  name: 'Skyfall AI',
  tagline: 'Engineering World Models for the autonomous enterprise.',
  nav: [
    { label: 'Research', href: '#research' },
    { label: 'SKY-001', href: '#sky-001' },
    { label: 'Team', href: '#team' },
    { label: 'Careers', href: '#careers' },
    { label: 'Contact', href: '#contact' },
  ],
  social: [
    { label: 'X', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ],
  contactEmail: '[CONTACT EMAIL]',
  officeAddress: '[OFFICE ADDRESS]',
  legal: [
    { label: 'Privacy policy', href: '#' },
    { label: 'Terms of service', href: '#' },
  ],
  year: 2026,
} as const

export const hero = {
  title: 'Autonomous Business for the Post-Monolithic Era',
  lede: "We're enabling the future where an entire business can operate autonomously.",
  primaryCta: { label: 'Meet SKY-001', href: '#sky-001' },
  secondaryCta: { label: 'Read our research', href: '#research' },
} as const

/** The six enterprise functions the world model spans; used by every hero diagram. */
export const functions = ['Sales', 'Design', 'Engineering', 'Customer support', 'Finance', 'Operations'] as const

export const research = {
  mission: {
    before: 'Our mission is to build the foundation infrastructure for autonomous enterprise through ',
    emphasis: 'Engineering World Models.',
  },
  problem: {
    title: 'The problem with next-token prediction',
    paragraphs: [
      'Enterprise work is long horizon, constrained and always evolving. A single decision ripples through thousands of downstreams steps from design, engineering, finance, operations, customer service and sales.',
      'Autoregressive next-token prediction has been astonishingly successful for language. But an enterprise is a living system of parts, processes and decisions that is only partly observable and constantly changing, and next-token prediction does not transfer well here.',
      'Much of what a business knows is however never written down. Large language models are pretrained on internet corpora and depend on in-context conditions which cannot keep pace with a rapidly changing business, and burn vast numbers of tokens per decision.',
    ],
  },
  build: {
    title: 'AI for the Engineered World',
    lead: 'Skyfall AI is developing Engineering World Models that learns the latent space of an enterprise across core functions: sales, design, engineering, customer support, finance and operations.',
    rest: 'These advanced models can simulate cause-and-effect relationships between functions and plan over long horizons to accomplish highly complex tasks, subject to safety guardrails.',
    steps: [
      { key: 'learn', label: 'Learn', title: 'Learn the latent space', body: 'Learns the latent space of an enterprise across core functions.' },
      { key: 'simulate', label: 'Simulate', title: 'Simulate cause and effect', body: 'Simulates cause-and-effect relationships between functions.' },
      { key: 'plan', label: 'Plan', title: 'Plan over long horizons', body: 'Plans over long horizons to accomplish highly complex tasks.' },
      { key: 'guardrails', label: 'Guardrails', title: 'Stay inside guardrails', body: 'Subject to safety guardrails.' },
    ],
  },
  pareto: {
    title: 'A new Pareto frontier',
    body: 'By exploring far more of the solution space than any human team or language model can, they push enterprises onto a new Pareto frontier, where cost, speed, and quality no longer have to be traded against each other.',
    axes: ['Cost', 'Speed', 'Quality'],
  },
  matters: {
    statement: {
      before: 'With world models, AI systems can ',
      emphasis: '‘dream’',
      after: ' what a successful business requires, and then execute it.',
    },
    infrastructure: 'We are building the foundation infrastructure for the software that powers enterprises.',
    body: 'Skyfall AI will advance AI research and develop AI systems for the engineered world where long horizon planning, adaptability, and reliability really matter, especially for the industrial, healthcare, chemical, enterprise sectors and beyond.',
    sectors: ['Industrial', 'Healthcare', 'Chemical', 'Enterprise', 'And beyond'],
    qualities: ['Long horizon planning', 'Adaptability', 'Reliability'],
  },
} as const

// NOT YET CLEARED FOR PUBLIC USE: the Maluuba / Bengio / Sutton founder story is pending sign-off.
// Keep the repo and any preview deploys private until the team confirms it.
export const team = {
  title: 'Founding Team',
  story:
    'Founded by Maluuba co-founders Sam Pasupalak and Kaheer Suleman, together with Sumit Pasupalak, Skyfall AI is building AI that understands the physical world. Sam and Kaheer were early pioneers of deep learning. They built Maluuba with advisors Yoshua Bengio and Richard Sutton, and Microsoft acquired it and turned it into its research lab in Canada. Sumit previously co-founded Ubiq, a Y Combinator company.',
  founders: [
    { name: 'Sam Pasupalak', role: 'Co-founder · [Title]', note: 'Co-founded Maluuba', photo: samPhoto },
    { name: 'Kaheer Suleman', role: 'Co-founder · [Title]', note: 'Co-founded Maluuba', photo: kaheerPhoto },
    { name: 'Sumit Pasupalak', role: 'Co-founder · [Title]', note: 'Co-founded Ubiq (YC)', photo: sumitPhoto },
  ],
  experience:
    'Together, they bring more than 30 years of combined experience across business, product, and AI research, and they are now shaping the next era of AI.',
  researchTeam:
    'Skyfall AI has assembled a world class AI Research team of 25 engineers and researchers operating across three countries.',
  stats: [
    { value: '30+', label: 'Years of combined experience' },
    { value: '25', label: 'Engineers and researchers' },
    { value: '3', label: 'Countries' },
  ],
  experienceFrom: ['Maluuba', 'Microsoft', 'University of Waterloo', 'Y Combinator', 'Mila', 'Vector Institute'],
  careersCta: { label: 'Careers', href: '#careers' },
} as const

export const backers = {
  title: "We're grateful for the support of our investors and advisors",
  investors: ['Fidelity', 'Touring Capital', 'M13', 'Inovia Capital'],
  advisors: [
    { name: 'François Chollet', affiliations: ['Google', 'Keras', 'NDEA'], x: '#' },
    { name: 'Naveen Rao', affiliations: ['Intel', 'Databricks'], x: '#' },
  ],
} as const

export const sky001Cta = {
  eyebrow: 'Introducing SKY-001',
  title: 'First World Model for the Engineered World',
  primary: { label: 'Meet SKY-001', href: '#sky-001' },
  secondary: { label: 'Contact', href: '#contact' },
} as const
