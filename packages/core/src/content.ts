// Single source of truth for site copy. Every version imports from here, so a change to the
// content doc (New Website <> Skyfall AI, tab "Skyfall Front Page") is made once.
// Copy is verbatim from that doc, including its typos, until the team signs off edits.

// Founder portraits: AI-generated studio shots from the founders' photos (round 1, option A,
// approved by Ankit 2026-10-09), pending founder consent.
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

// ---------------------------------------------------------------------------------------------
// SKY-001 launch page. Copy is verbatim from the content doc tab "SKY PAGE" (captured 2026-10-12),
// including its typos and its "SKY 00-1" spelling, until the team signs off edits.
// ---------------------------------------------------------------------------------------------
export const sky001 = {
  // Technical report, partnerships and the launch video have no link targets in the doc yet.
  nav: [
    { label: 'Technical report', href: '#' },
    { label: 'Blog', href: 'https://temple-greene-saves-theorem.trycloudflare.com/' },
    { label: 'Partnerships', href: '#' },
  ],
  news: {
    // Date is from the content owner's Loom ("most likely"), not from the doc.
    date: 'October 19, 2026',
    label: 'Skyfall News',
    title: 'Skyfall AI announces SKY 00-1, a Latent World Model',
    cta: { label: 'Read more', href: 'https://temple-greene-saves-theorem.trycloudflare.com/' },
  },
  hero: {
    title: 'First World Model for the Engineered World',
    lede: 'Accelerating innovations in the physical economy with world models by building the foundation layer that powers enterprises.',
    note: 'Our first stop is Design Engineering.',
  },
  intro: {
    before: 'Introducing SKY-001, ',
    emphasis: 'Intelligence for general engineering',
    statement: 'The First World Model for the Engineered World; AI moving beyond language into latent space',
    waitlist: { title: 'Get Early Access', body: 'Join the waitlist now for early access.', cta: { label: 'Join the waitlist', href: '#waitlist' } },
    video: { label: 'Watch Launch Video', href: '#' },
  },
  contrarian: {
    title: 'We’re taking a contrarian approach to research',
    points: [
      {
        title: 'Not a plug-in',
        body: 'Large language models excel at conversation, and a wave of wrappers now points them at every industry. But, engineering design isn’t a language problem. It’s a sequential decision problem that requires a model that can reason about geometry and truly understand the latent space.',
      },
      {
        title: 'First Model that can Dream',
        body: 'We built a new type of world model with a new architecture for the non-molithic era. SKY 00-1 is designed for the next generation of AI that can ‘dream’ anything in the physical world. We believe we cannot build something that we can’t dream about. SKY 00-1 is a general engineer that can dream from product concept to factory',
      },
      {
        title: 'One Model, Many Domains',
        body: 'As a latent world model, SKY 00-1 learns how physical systems are designed, built and run, in any domain. From engineering to operations, the possibilities are endless.',
      },
    ],
  },
  pareto: {
    title: 'Designing a New Pareto Frontier with World Models',
    body: 'We are pushing the boundaries of what’s possible in physical design with world modeling not just in one category but two.',
  },
  moment: {
    eyebrow: 'Defining Moment in History',
    before: 'Frontier Accuracy at ',
    emphasis: '1/150th',
    after: ' the cost of LLMs',
    body: 'Our world model beats GPT-6 Astra because LLMs are autoregressive in nature and not designed for visual reasoning. Our approach is undoubtedly the best path for scale compared to LLMs and a game changer for the AI industry.',
    versus: 'World Models vs. LLMs',
  },
  stages: {
    title: 'How Sky-001 beats Prompt-Based Methods Step-By-Step',
    items: [
      {
        key: 'explore',
        label: 'Stage 1',
        title: 'Parallel Explorations Through World Modeling',
        body: 'Our model converts a 2D sketch or text prompt into several rough 3D assets at once. This lets you instantly explore different visual directions and pick the best foundation before diving into details.',
      },
      {
        key: 'decompose',
        label: 'Stage 2',
        title: 'Recursive Diffusion-Based 3D Decomposition',
        body: 'Once selected, it breaks down the high-level designs into smaller, individual parts, from large structural pieces all the way down to tiny screws and fasteners. By working layer by layer, our model keeps complex designs organized and easy to build, excelling in long horizon planning.',
      },
      {
        key: 'sketch',
        label: 'Stage 3',
        title: 'Multi-step 2d to 3D Latent Action World Model',
        body: 'It brings each part to life by recreating how a real designer works step-by-step. It starts by drawing precise 2D sketches stroke-by-stroke, then stretches, cuts, or shapes those sketches into finished 3D objects.',
      },
      {
        key: 'construct',
        label: 'Stage 4',
        title: '3D Construction World Model',
        body: 'Finally, it assembles all the parts, layer by layer again, in hierarchical order into a complete 3D assembly that you can visualize immediately in standard CAD software',
      },
    ],
  },
  why: {
    title: 'Why do the World Models excel here?',
    // "Latent space -" is unfinished in the doc, so it has no note.
    items: [
      { title: 'Cause & effect', note: '' },
      { title: 'Physics', note: 'understand geometry' },
      { title: 'Latent space', note: '' },
      { title: 'Long horizon planning', note: 'hierarchical decomposition' },
    ],
  },
  next: {
    title: 'Reinventing the physical economy with world models',
    body: 'Today, SKY 00-1 is a hierarchical visual world model that plans and designs the assembly of engineered objects. By pairing it with a vision-language-action (VLA) agent in the next phase, we transition from plan generation to physical execution. Beyond manufacturing, SKY 00-1 is designed to become the underlying blueprint for complex physical design, spanning PCB design, Aerospace engineering, Energy and Power systems, Protein folding, Molecule design, Computer Use Agents, Enterprise Software and beyond.',
    domains: ['PCB design', 'Aerospace engineering', 'Energy and Power systems', 'Protein folding', 'Molecule design', 'Computer Use Agents', 'Enterprise Software'],
    closing: 'Wherever structure, constraints, and sequence matter, SKY 00-1 plans and powers the build.',
  },
  // Names are placeholders in the doc ("Haoye, Zichen, Mike (TBD)", "Pavan et. al").
  team: {
    title: 'The team behind SKY 00-1',
    groups: [
      { label: 'Core contributors', names: 'Haoye, Zichen, Mike (TBD)' },
      { label: 'Full team', names: 'Pavan et. al' },
      { label: 'Leadership', names: 'Sumit, Kaheer, Sam' },
    ],
  },
  // The doc's answers are writer's notes, not final copy; they are shown as written.
  faq: {
    title: 'What you might be wondering',
    items: [
      { q: 'What are SKY models and SKY-001?', a: 'Foundation world models' },
      { q: 'How is SKY related to autonomous businesses?', a: '' },
      { q: 'Is SKY-001 just another LLM-foundation model?', a: 'No, explain difference' },
      {
        q: 'Why are World Models better for physical object design?',
        a: 'Better at long-term planning. Actually understands the world + simulation. Better for real automation due to little to zero human input. Needs different type of AI.',
      },
      { q: 'Can SKY-001 build a physical object?', a: 'Not yet, eventually we will have a VLA agent' },
      { q: 'How do I get access to Sky-001?', a: 'Join waitlist to be the first to hear when it goes public' },
      { q: 'What is Sky-001 good at?', a: 'Great for designing complex objects that require long term planning' },
      { q: 'What else can we design with SKY-001?', a: 'Applies to numerous sectors: robotics, drug discovery, PCB design, BIM etc..' },
      { q: 'I have further questions. How to contact the team?', a: 'team email E.G. hello@sky001.ai' },
    ],
  },
} as const

// ---------------------------------------------------------------------------------------------
// Benchmarks. Every number is copied from the research team's "Model efficiency comparison"
// deck (28 Sep 2026) and its source notes. Never round, estimate or add to these here.
// ---------------------------------------------------------------------------------------------
export const benchmarks = {
  source: 'Skyfall AI model efficiency comparison, 28 Sep 2026',
  /** 3D Construction World Model, 20 evaluation cases. `iou` is null where no case succeeded. */
  cad: {
    title: '3D Construction World Model',
    cases: '20 evaluation cases',
    rows: [
      { model: '3D Construction WM', ours: true, success: '20/20', iou: 79.7, seconds: 3.9, cost: 0.005 },
      { model: 'GPT-6 Astra', ours: false, success: '20/20', iou: 79.1, seconds: 199, cost: 0.75 },
      { model: 'Opus 5.5', ours: false, success: '20/20', iou: 69.4, seconds: 110, cost: 0.31 },
      { model: 'Gemini 3.8 Flash', ours: false, success: '17/20', iou: 54.7, seconds: 112, cost: 0.08 },
      { model: 'Qwen 3.8 Max', ours: false, success: '16/20', iou: 34.4, seconds: 764, cost: 0.3 },
      { model: 'Kimi K3', ours: false, success: '8/20', iou: 9.5, seconds: 439, cost: 0.13 },
      { model: 'Grok 4.7', ours: false, success: '0/20', iou: null, seconds: 1250, cost: 0.59 },
    ],
    notes: [
      'Our row takes the best value per metric across our model variants.',
      'Compute pricing: one NVIDIA B300 at $7/hour. Per-sample costs are shown as reported.',
      'IoU: overlap with the reference (%).',
    ],
  },
  /** BIM Construction World Model, 20 evaluation cases. Time only: cost and IoU are not yet confirmed at source. */
  bim: {
    title: 'BIM Construction World Model',
    cases: '20 evaluation cases',
    rows: [
      { model: 'BIM Construction WM', ours: true, seconds: 4.5 },
      { model: 'GPT-6 Astra', ours: false, seconds: 144.4 },
      { model: 'Opus 5.5', ours: false, seconds: 113.1 },
      { model: 'Kimi K3', ours: false, seconds: 114.0 },
      { model: 'Qwen 3.8 Max', ours: false, seconds: 254.5 },
      { model: 'Gemini 3.8 Flash', ours: false, seconds: 345.4 },
      { model: 'Grok 4.7', ours: false, seconds: 592.3 },
    ],
    notes: ['Our time is with all steps refined.'],
  },
  /** Headline comparisons against GPT-6 Astra. */
  headline: [
    { value: '51×', label: 'faster', detail: '3D Construction · 3.9 s vs 199 s' },
    { value: '150×', label: 'lower cost', detail: '3D Construction · $0.005 vs $0.75' },
    { value: '32×', label: 'faster', detail: 'BIM Construction · 4.5 s vs 144.4 s' },
  ],
} as const

// ---------------------------------------------------------------------------------------------
// Showcase ("One image. Every part."). Model facts and captions are from the research team's
// showcase site; its captions are not in the content doc and still need the team's sign-off.
// ---------------------------------------------------------------------------------------------
export const showcase = {
  title: 'One image. Every part.',
  lede: 'From a single picture to a complete 3D model, split into a tree of parts and refined down to the last bolt.',
  explore: {
    eyebrow: 'Take it apart',
    title: 'From Images to Design Processes.',
    body: 'Every model on this page came out of the same automatic run.',
    cta: 'Explore in 3D',
  },
  disclaimer: 'Final-shot finishes are materials transferred onto the predicted parts; they are not predicted by the model.',
  models: [
    { id: 'jaguar', title: 'Jaguar E-Type Roadster', kind: 'Sports car', leaves: 103, nodes: 139, depth: 5 },
    { id: 'jet', title: 'Jet Engine', kind: 'Turbofan', leaves: 70, nodes: 96, depth: 5 },
    { id: 'arcmate', title: 'FANUC ArcMate 100iB', kind: 'Welding robot', leaves: 35, nodes: 55, depth: 4 },
    { id: 'tractor', title: 'Minitractor 4×4', kind: 'Compact tractor', leaves: 92, nodes: 130, depth: 5 },
  ],
} as const
