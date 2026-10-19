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
    { label: 'X', href: 'https://x.com/skyfallai' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/skyfallai/posts/' },
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
    /** Small chapter label above the statement on the final site. */
    label: 'Mission',
    /** The turning globe beside the statement on the final site. */
    globeAlt: 'A blue globe with eight stations on it, one for each enterprise function: customer support, product, design, engineering, marketing, sales, finance and operations. As the page scrolls the globe turns, the station facing the front is named, and work arcs from one station to the next.',
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
    { name: 'François Chollet', affiliations: ['Google', 'Keras', 'NDEA'], x: 'https://x.com/fchollet' },
    { name: 'Naveen Rao', affiliations: ['Intel', 'Databricks'], x: 'https://x.com/NaveenGRao' },
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
    // Labels and descriptions for the three animated illustrations beside the points. The parts
    // and designs in them are drawn in code to explain the idea; they are not SKY-001 output.
    figures: {
      input: 'Input',
      picked: 'Picked',
      mated: 'Mated',
      constraints: ['Hole A ↔ Pin A', 'Hole B ↔ Pin B', 'Face ↔ Face'],
      dof: 'DOF',
      constrained: 'Fully constrained',
      alts: [
        'A bracket is reasoned onto a base in 3D: hole A slides over pin A along X then Y, the bracket turns about Z until hole B meets pin B, then drops face to face, its X, Y, Z and angle offsets counting to zero and its degrees of freedom from six to zero.',
        'One input sketch, with fourteen different 3D designs growing out of noise around it at the same moment; one is then picked.',
        'A turning globe with the domains SKY-001 is built for orbiting around it: PCB design, aerospace, energy, protein folding, molecules, computer use agents and enterprise software.',
      ],
    },
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
    body: 'Our world model beats LLMs because LLMs are autoregressive in nature and not designed for visual reasoning. Our approach is undoubtedly the best path for scale compared to LLMs and a game changer for the AI industry.',
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
  // FAQ copy from Ankit, 19 Oct 2026.
  faq: {
    title: 'What you might be wondering',
    items: [
      { q: 'What is SKY-001?', a: "SKY-001 is the first Engineering World Model that breaks a complex physical object into manageable parts and keeps them consistent across hundreds or thousands of construction steps. It enables you to visualize any physical object in the real-world just like a ‘General Engineer’." },
      { q: 'Is SKY-001 just another Language-based model?', a: "No, SKY-001 is World Model Based and doesn’t do next-token prediction like LLMs. Given a prompt or 2D sketch, it uses a hierarchical composer which decides what the design is made of, separates them hierarchically and it generates the whole design for you part-by-part." },
      { q: 'Why are World Models better for physical object design?', a: "LLMs are autoregressive and were not designed for visual reasoning. Engineering design, by contrast, is a complex process that requires a model to reason about geometry, form latent-space abstractions, and plan over long horizons, since most designs involve hundreds of thousands of steps which World Models are suitable for." },
      { q: 'Can SKY-001 build a physical object?', a: "Not yet. Currently, SKY-001 is a Spatial World Model which can only produce a visual design plan that shows the design, the elements it breaks into, and the steps to build each one. However, as the next step, we plan to ground that in software where a VLA agent can then build the object." },
      { q: 'How do I get access to Sky-001?', a: "Join the waitlist to be the first to hear when it goes public." },
      { q: 'What is SKY-001 good at?', a: "SKY-001 excels at designing complex real-world objects with hundreds of thousands of parts, where getting the structure, constraints, and sequence right drives cost, speed, and design accuracy. It delivers frontier-level accuracy at 100 times the speed and 1/150th the cost of LLMs." },
      { q: 'What else can we design with SKY-001?', a: "We envision SKY-001 as the foundation model for designing any complex physical objects from PCBs, aerospace systems, and energy and power systems to proteins, molecules, computer-use agents, and much more." },
      { q: 'I have further questions. How to contact the team?', a: "Email us at info@skyfall.ai" },
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
// Benchmark story on the SKY-001 page: per model, a claim, a video and three bar charts.
// Numbers are exactly those in Ankit's two benchmark table images (2026-10-17), which replace the
// older BIM figures above. Claims are ratios against GPT-6 Astra's numbers, worded "LLMs" (Ankit).
// Speed and cost are drawn as samples per hour (3600 / seconds) and samples per $1 (1 / cost).
// ---------------------------------------------------------------------------------------------
export type StoryRow = { model: string; ours: boolean; iou: number | null; seconds: number; cost: number }

export const benchmarkStory = {
  charts: {
    speed: { tab: 'Speed', title: 'Speed, samples per hour', note: 'samples per hour = 3,600 ÷ seconds per sample' },
    cost: { tab: 'Cost', title: 'Cost, samples per $1', note: 'samples per $1 = 1 ÷ cost per sample' },
    iou: { tab: 'IoU', title: 'Accuracy (IoU)', note: 'IoU: overlap with the reference (%)' },
  },
  failed: 'Failed',
  models: [
    {
      key: 'cad',
      tag: '3D CAD',
      title: '3D Construction World Model',
      clip: '3D CAD / same input, 4 models',
      clipLabel: 'The same input image built into 3D CAD by SKY-001, GPT-6 Astra, Claude Opus 5.5 and Claude Fable 5.1',
      claims: [
        { value: '51×', label: 'faster', detail: '3.9 s vs 199 s' },
        { value: '150×', label: 'lower cost', detail: '$0.005 vs $0.75' },
        { value: '79.7%', label: 'accuracy', detail: 'IoU · LLMs best 79.1%' },
      ],
      rows: [
        { model: 'SKY-001', ours: true, iou: 79.7, seconds: 3.9, cost: 0.005 },
        { model: 'GPT-6 Astra', ours: false, iou: 79.1, seconds: 199, cost: 0.75 },
        { model: 'Opus 5.5', ours: false, iou: 69.4, seconds: 110, cost: 0.31 },
        { model: 'Gemini 3.8 Flash', ours: false, iou: 54.7, seconds: 112, cost: 0.08 },
        { model: 'Qwen 3.8 Max', ours: false, iou: 34.4, seconds: 764, cost: 0.3 },
        { model: 'Kimi K3', ours: false, iou: 9.5, seconds: 439, cost: 0.13 },
        { model: 'Grok 4.7', ours: false, iou: null, seconds: 1250, cost: 0.59 },
      ] as StoryRow[],
    },
    {
      key: 'bim',
      tag: 'BIM',
      title: 'BIM Construction World Model',
      clip: 'BIM / 36 levels',
      clipLabel: 'SKY-001 output: a 36-level tower built level by level',
      claims: [
        { value: '118×', label: 'faster', detail: '1.22 s vs 144.4 s' },
        { value: '188×', label: 'lower cost', detail: '$0.00237 vs $0.4465' },
        { value: '43.6%', label: 'accuracy', detail: 'IoU · LLMs best 42.3%' },
      ],
      rows: [
        { model: 'SKY-001', ours: true, iou: 43.6, seconds: 1.22, cost: 0.00237 },
        { model: 'GPT-6 Astra', ours: false, iou: 40.6, seconds: 144.4, cost: 0.4465 },
        { model: 'Opus 5.5', ours: false, iou: 34.4, seconds: 113.1, cost: 0.276 },
        { model: 'Gemini 3.8 Flash', ours: false, iou: 42.3, seconds: 345.4, cost: 0.2185 },
        { model: 'Qwen 3.8 Max', ours: false, iou: 28.8, seconds: 254.5, cost: 0.111 },
        { model: 'Kimi K3', ours: false, iou: 33.7, seconds: 114.0, cost: 0.27 },
        { model: 'Grok 4.7', ours: false, iou: 28.2, seconds: 592.3, cost: 0.305 },
      ] as StoryRow[],
    },
  ],
} as const

// ---------------------------------------------------------------------------------------------
// The benchmark charts drawn in the tables' own units, exactly as Ankit's CAD chart image and BIM table (2026-10-18):
// IoU (higher is better), time and cost per sample (lower is better), rows in table order. Labels
// are the table's text, character for character. Used by v8; apps/final keeps the flipped rates above.
// ---------------------------------------------------------------------------------------------
export const benchmarkRaw = {
  charts: {
    iou: { tab: 'IoU', title: 'IoU', arrow: '↑', note: 'Higher is better' },
    time: { tab: 'Time', title: 'Time / sample', arrow: '↓', note: 'Lower is better' },
    cost: { tab: 'Cost', title: 'Cost / sample', arrow: '↓', note: 'Lower is better' },
  },
  /** Which charts each model shows. BIM's IoU is the earlier BIM benchmark (seven models); its time and cost are the floor-plan table (Ankit, 2026-10-18). */
  metrics: { cad: ['iou', 'time', 'cost'], bim: ['iou', 'time', 'cost'] },
  /** BIM IoU as the earlier BIM table prints it, in that table's order (benchmarkStory BIM rows). */
  iouLabels: { bim: ['43.6%', '40.6%', '34.4%', '42.3%', '28.8%', '33.7%', '28.2%'] },
  /** Chart titles where a model's table names the unit differently. */
  titles: { bim: { time: 'Time / plan', cost: 'Cost / plan' } },
  /** BIM: 1,000 held-out floor plans (Swiss + IFC), mean per plan. Table order. */
  rows: {
    bim: [
      { model: 'SKY-001', ours: true, iou: null, seconds: 0.94, cost: 0.0016 },
      { model: 'GPT-6 Astra', ours: false, iou: null, seconds: 110.1, cost: 0.33 },
      { model: 'Claude Opus 5.5', ours: false, iou: null, seconds: 78.7, cost: 0.191 },
      { model: 'Gemini 3.8 Flash', ours: false, iou: null, seconds: 269.9, cost: 0.146 },
    ],
  },
  axes: {
    cad: { iou: [0, 50, 100], time: [0, 650, 1300], cost: [0, 0.4, 0.8] },
    bim: { iou: [0, 50, 100], time: [0, 150, 300], cost: [0, 0.2, 0.4] },
  },
  ticks: {
    cad: { iou: ['0%', '50%', '100%'], time: ['0s', '650s', '1300s'], cost: ['$0', '$0.4', '$0.8'] },
    bim: { iou: ['0%', '50%', '100%'], time: ['0s', '150s', '300s'], cost: ['$0', '$0.2', '$0.4'] },
  },
  /** Per model, in table order: the IoU, time and cost text as printed in the table ("–" where there is no value; BIM has no IoU). */
  labels: {
    cad: [
      ['79.7%', '3.9 s', '$0.005'],
      ['79.1%', '199 s', '$0.75'],
      ['69.4%', '110 s', '$0.31'],
      ['54.7%', '112 s', '$0.08'],
      ['34.4%', '764 s', '$0.30'],
      ['9.5%', '439 s', '$0.13'],
      ['–', '1,250 s', '$0.59'],
    ],
    bim: [
      ['–', '0.94 s', '$0.0016'],
      ['–', '110.1 s', '$0.330'],
      ['–', '78.7 s', '$0.191'],
      ['–', '269.9 s', '$0.146'],
    ],
  },
} as const

// ---------------------------------------------------------------------------------------------
// The four charts embedded in the content doc ("SKY PAGE" images 03 and 04), as data, so a page can
// redraw them with the same axes. Labels are the doc's. Values are the research team's figures
// behind those images (benchmark deck and source notes, 28 Sep 2026); the BIM dollar costs are the
// notes' calculated per-part costs and the BIM IoU is the notes' reported mean.
// ---------------------------------------------------------------------------------------------
export const docCharts = {
  /** Image 03: accuracy (IoU %) against cost per part (USD, log scale $0.001 to $1.00). */
  pareto: {
    hint: 'Better: up and to the left',
    xLabel: 'Cost per part, log scale',
    yLabel: 'Accuracy (IoU)',
    cad: {
      title: '3D CAD benchmark, 20 parts',
      yDomain: [0, 100],
      yTicks: [0, 25, 50, 75, 100],
      points: [
        { model: 'SKY-001', ours: true, cost: 0.005, iou: 79.7 },
        { model: 'GPT-6 Astra', ours: false, cost: 0.75, iou: 79.1 },
        { model: 'Opus 5.5', ours: false, cost: 0.31, iou: 69.4 },
        { model: 'Gemini 3.8 Flash', ours: false, cost: 0.08, iou: 54.7 },
        { model: 'Qwen 3.8 Max', ours: false, cost: 0.3, iou: 34.4 },
        { model: 'Kimi K3', ours: false, cost: 0.13, iou: 9.5 },
      ],
    },
    bim: {
      title: 'BIM benchmark, 20 parts',
      yDomain: [20, 50],
      yTicks: [20, 30, 40, 50],
      points: [
        { model: 'SKY-001', ours: true, cost: 0.00875, iou: 43.6 },
        { model: 'Gemini 3.8 Flash', ours: false, cost: 0.2185, iou: 42.3 },
        { model: 'GPT-6 Astra', ours: false, cost: 0.4465, iou: 40.6 },
        { model: 'Opus 5.5', ours: false, cost: 0.276, iou: 34.4 },
        { model: 'Kimi K3', ours: false, cost: 0.27, iou: 33.7 },
        { model: 'Qwen 3.8 Max', ours: false, cost: 0.111, iou: 28.8 },
        { model: 'Grok 4.7', ours: false, cost: 0.305, iou: 28.2 },
      ],
    },
  },
  /** Image 04: SKY-001 against GPT-6 Astra. Accuracy (IoU %) on a 30 to 90 axis, x on a log scale. */
  versus: {
    legend: { cad: '3D CAD', bim: 'BIM', ours: 'SKY-001', other: 'GPT-6 Astra' },
    yLabel: 'Accuracy (IoU %)',
    yDomain: [30, 90],
    yTicks: [30, 40, 50, 60, 70, 80, 90],
    cost: {
      title: 'Accuracy vs cost per part',
      xLabel: 'Cost per part (USD, log scale)',
      xTicks: [0.001, 0.01, 0.1, 1],
      xDomain: [0.001, 3],
      series: [
        { key: 'cad', label: '150× cheaper', ours: { x: 0.005, iou: 79.7 }, other: { x: 0.75, iou: 79.1 } },
        { key: 'bim', label: '50× cheaper', ours: { x: 0.00875, iou: 43.6 }, other: { x: 0.4465, iou: 40.6 } },
      ],
    },
    time: {
      title: 'Accuracy vs time per part',
      xLabel: 'Time per part (seconds, log scale)',
      xTicks: [1, 10, 100, 1000],
      xDomain: [1, 1000],
      series: [
        { key: 'cad', label: '51× faster', ours: { x: 3.9, iou: 79.7 }, other: { x: 199, iou: 79.1 } },
        { key: 'bim', label: '32× faster', ours: { x: 4.5, iou: 43.6 }, other: { x: 144.4, iou: 40.6 } },
      ],
    },
  },
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
    // the pop-up the explorer opens in
    viewer: { loading: 'Loading 3D', close: 'Close', previous: 'Previous model', next: 'Next model' },
  },
  disclaimer: 'Final-shot finishes are materials transferred onto the predicted parts; they are not predicted by the model.',
  models: [
    { id: 'jaguar', title: 'Jaguar E-Type Roadster', kind: 'Sports car', leaves: 103, nodes: 139, depth: 5 },
    { id: 'jet', title: 'Jet Engine', kind: 'Turbofan', leaves: 70, nodes: 96, depth: 5 },
    { id: 'arcmate', title: 'FANUC ArcMate 100iB', kind: 'Welding robot', leaves: 35, nodes: 55, depth: 4 },
    { id: 'tractor', title: 'Minitractor 4×4', kind: 'Compact tractor', leaves: 92, nodes: 130, depth: 5 },
  ],
} as const

// ---------------------------------------------------------------------------------------------
// Enterprise campus hero (v7). Text for the animated front-page hero, taken as written from
// Ankit's "Autonomous Enterprise Campus" direction (2026-10-13). The scenario is a made-up story
// of one business running itself: every figure in it (MRR, tickets, discounts, sites) is a
// placeholder, not Skyfall data, and needs the team's sign-off before the page is public.
// ---------------------------------------------------------------------------------------------
export const campus = {
  alt: 'An isometric campus with eight departments: support, product, design, engineering, marketing, sales, finance and operations, with a world model floating above. A churn signal in support makes the model imagine three futures for monthly recurring revenue and pick one. Work then travels department to department, a finance guardrail blocks an oversized discount, and when the loop closes MRR rises from 1.20 to 1.29 million dollars. A second, faster loop from a sales lead takes it to 1.34 million.',
  model: 'World model',
  departments: {
    support: { name: 'Customer support', stat: ['214 tickets resolved today', '3 escalated to a human'] },
    product: { name: 'Product', stat: ['Roadmap: 12 items', '1 moved to P0 today'] },
    design: { name: 'Design', stat: ['3 flows drafted', '1 picked and shipped'] },
    engineering: { name: 'Engineering', stat: ['18 PRs merged', '0 rollbacks'] },
    marketing: { name: 'Marketing', stat: ['41 accounts emailed', '2 campaigns live'] },
    sales: { name: 'Sales', stat: ['Pipeline $2.1M', '12 sites in trial'] },
    finance: { name: 'Finance', stat: ['6 guardrails active', '1 held today'] },
    operations: { name: 'Operations', stat: ['Uptime 99.98%', 'Capacity +22% this week'] },
  },
  /** Work travelling between departments: seconds into the 44 s loop, the artefact carried, and the log line on arrival. `bounce` is the offer the finance guardrail turns back. */
  hops: [
    { from: 'support', to: 'product', t0: 12, t1: 13.2, artefact: 'Ticket', log: 'Product · exports moved to P0', bounce: false },
    { from: 'product', to: 'design', t0: 13.4, t1: 14.6, artefact: 'Spec', log: 'Design · 3 flows drafted, 1 picked', bounce: false },
    { from: 'design', to: 'engineering', t0: 14.8, t1: 16, artefact: 'Mock', log: 'Engineering · PR merged, exports 6× faster', bounce: false },
    { from: 'engineering', to: 'marketing', t0: 16.2, t1: 17.4, artefact: 'Build', log: 'Marketing · release note to 41 accounts', bounce: false },
    { from: 'marketing', to: 'sales', t0: 17.6, t1: 18.8, artefact: 'Launch', log: 'Sales · renewal drafted at 40% off', bounce: false },
    { from: 'sales', to: 'finance', t0: 19, t1: 20.6, artefact: '40% off', log: 'Finance guardrail · discount capped at 15%, offer returned', bounce: true },
    { from: 'sales', to: 'finance', t0: 21.2, t1: 22.2, artefact: 'Contract', log: 'Finance · 38 renewals booked at list price', bounce: false },
    { from: 'finance', to: 'operations', t0: 22.4, t1: 23.4, artefact: 'Forecast', log: 'Operations · capacity scaled +22%', bounce: false },
    { from: 'operations', to: 'support', t0: 23.6, t1: 24.6, artefact: 'Status', log: 'Support · churn risk cleared, 3 cases to a human', bounce: false },
    { from: 'sales', to: 'design', t0: 29.4, t1: 30.3, artefact: 'Brief', log: 'Design · pilot workspace configured', bounce: false },
    { from: 'design', to: 'engineering', t0: 30.4, t1: 31.3, artefact: 'Spec', log: 'Engineering · ERP integration shipped', bounce: false },
    { from: 'engineering', to: 'marketing', t0: 31.4, t1: 32.3, artefact: 'Story', log: 'Marketing · case study drafted', bounce: false },
    { from: 'marketing', to: 'sales', t0: 32.4, t1: 33.3, artefact: 'Proof', log: 'Sales · 12 sites signed', bounce: false },
    { from: 'sales', to: 'finance', t0: 33.4, t1: 34.3, artefact: 'Contract', log: 'Finance · +$50K MRR booked', bounce: false },
    { from: 'finance', to: 'operations', t0: 34.4, t1: 35.3, artefact: 'Order', log: 'Operations · 12 sites onboarded', bounce: false },
  ],
  /** Other log lines: time, who speaks ("model" is the world model), text, and whether it is a headline moment. */
  logs: [
    { t: 0.6, who: 'operations', text: 'Steady state · 8 functions running', key: false },
    { t: 3, who: 'support', text: 'Churn risk · 41 accounts flag slow exports', key: true },
    { t: 6, who: 'model', text: 'World model · simulating 3 futures, 6 weeks ahead', key: false },
    { t: 10.8, who: 'model', text: 'Plan · ship faster exports (best MRR, margin intact)', key: true },
    { t: 20.8, who: 'sales', text: 'Sales · renewal at list price + annual plan', key: false },
    { t: 26.4, who: 'finance', text: 'MRR $1.20M → $1.29M', key: true },
    { t: 28, who: 'sales', text: 'Inbound · 12-site manufacturer asks for a pilot', key: true },
    { t: 28.7, who: 'model', text: 'World model · 2 futures, pick: pilot + integration', key: false },
    { t: 37.4, who: 'finance', text: 'MRR $1.29M → $1.34M', key: true },
    { t: 38.6, who: 'model', text: '+$140K MRR · 2 loops · 1 guardrail held', key: true },
  ],
  /** The status line under the hero copy: from this second on, show this title and line. */
  states: [
    { t: 0, title: 'Week 0', line: 'Business as usual' },
    { t: 3, title: 'Signal', line: 'Support spots churn risk' },
    { t: 6, title: 'Imagine', line: 'Three futures, six weeks ahead' },
    { t: 10.8, title: 'Plan', line: 'Pick the best future' },
    { t: 12, title: 'Ripple', line: 'Work moves department to department' },
    { t: 19, title: 'Guardrail', line: 'Finance blocks a 40% discount' },
    { t: 21, title: 'Ripple', line: 'Back on plan' },
    { t: 24.6, title: 'Loop closed', line: 'MRR rises' },
    { t: 28, title: 'Second loop', line: 'A new lead, handled faster' },
    { t: 37.4, title: 'Compounding', line: 'Two loops, one guardrail held' },
  ],
  futures: [
    { key: 'A', name: 'Ship faster exports', mrr: 1.29 },
    { key: 'B', name: '40% discount', mrr: 1.18 },
    { key: 'C', name: 'Do nothing', mrr: 1.15 },
  ],
  labels: {
    live: 'Live',
    guardrail: 'Guardrail · max discount 15%',
    counter: 'Sales counter · MRR',
    mrr: 'MRR',
    flat: 'Flat for 2 weeks',
    /** "+$90K booked since week 0": the amount is filled in. */
    booked: 'booked since week 0',
  },
} as const

// ---------------------------------------------------------------------------------------------
// Enterprise campus hero, final site. Same campus as v7, reworked on 2026-10-14: work is handed
// between departments in a random order instead of one fixed loop, every hand-off adds a little to
// MRR, and the log runs on a long floor beside the MRR figure. Hand-off lines reuse the v7 story
// where they can; `k` is each hand-off's share of the climb from `mrr.start` to `mrr.end` ($). Every figure is still a placeholder,
// not Skyfall data, and needs the team's sign-off before the page is public.
// ---------------------------------------------------------------------------------------------
export const campusFlow = {
  alt: 'An isometric campus with eight departments: support, product, design, engineering, marketing, sales, finance and operations, with a world model floating above them. Work is handed from department to department in no fixed order, several hand-offs at a time, and each one adds to monthly recurring revenue on a counter at the front. Once, a finance guardrail turns back an oversized discount.',
  model: 'World model',
  mrr: { start: 1248, end: 10480 },
  handoffs: [
    { from: 'support', to: 'product', artefact: 'Ticket', log: 'Product · exports moved to P0', k: 2 },
    { from: 'product', to: 'design', artefact: 'Spec', log: 'Design · 3 flows drafted, 1 picked', k: 2 },
    { from: 'design', to: 'engineering', artefact: 'Mock', log: 'Engineering · PR merged, exports 6× faster', k: 3 },
    { from: 'engineering', to: 'marketing', artefact: 'Build', log: 'Marketing · release note to 41 accounts', k: 2 },
    { from: 'marketing', to: 'sales', artefact: 'Launch', log: 'Sales · 12-site manufacturer asks for a pilot', k: 3 },
    { from: 'sales', to: 'finance', artefact: 'Contract', log: 'Finance · 38 renewals booked at list price', k: 6 },
    { from: 'finance', to: 'operations', artefact: 'Forecast', log: 'Operations · capacity scaled +22%', k: 2 },
    { from: 'operations', to: 'support', artefact: 'Status', log: 'Support · churn risk cleared, 3 cases to a human', k: 3 },
    { from: 'sales', to: 'design', artefact: 'Brief', log: 'Design · pilot workspace configured', k: 2 },
    { from: 'engineering', to: 'operations', artefact: 'Release', log: 'Operations · ERP integration deployed', k: 3 },
    { from: 'marketing', to: 'support', artefact: 'Campaign', log: 'Support · FAQ updated for the launch', k: 1 },
    { from: 'support', to: 'engineering', artefact: 'Bug', log: 'Engineering · fix shipped, 0 rollbacks', k: 2 },
    { from: 'finance', to: 'sales', artefact: 'Pricing', log: 'Sales · annual plan offered at list price', k: 3 },
    { from: 'product', to: 'marketing', artefact: 'Roadmap', log: 'Marketing · case study drafted', k: 2 },
    { from: 'operations', to: 'finance', artefact: 'Usage', log: 'Finance · usage billed for 12 sites', k: 4 },
    { from: 'design', to: 'product', artefact: 'Prototype', log: 'Product · pilot scope signed off', k: 2 },
    { from: 'sales', to: 'operations', artefact: 'Order', log: 'Operations · 12 sites onboarded', k: 4 },
    { from: 'engineering', to: 'product', artefact: 'Metrics', log: 'Product · exports 6× faster confirmed', k: 1 },
  ],
  /** The one hand-off the finance guardrail turns back, once per loop. */
  guardrail: { from: 'sales', to: 'finance', artefact: '40% off', log: 'Finance guardrail · discount capped at 15%, offer returned', label: 'Guardrail · max discount 15%' },
  /** What the world model says when it re-plans; it also lights a beam to every department. */
  modelLines: ['World model · simulating 3 futures, 6 weeks ahead', 'Plan · ship faster exports (best MRR, margin intact)', 'World model · 2 futures, pick: pilot + integration'],
  labels: { log: 'Operating log', mrr: 'MRR', live: 'Live' },
} as const

// ---------------------------------------------------------------------------------------------
// Partnership form (final site). Field names, hint and success line as Ankit specified them
// (2026-10-14); the error and failure lines are working copy for the team to edit.
// ---------------------------------------------------------------------------------------------
export const partnership = {
  nav: 'Partnership',
  title: 'Partnership',
  fields: {
    name: { label: 'Full name' },
    email: { label: 'Work email' },
    website: { label: 'Company website' },
    message: { label: 'How can we help?', placeholder: 'Write your query here...', maxWords: 250 },
  },
  submit: 'Submit',
  sending: 'Sending',
  required: 'Required',
  errors: {
    required: 'This field is required.',
    email: 'Enter a valid email address, like name@company.com.',
    website: 'Enter a valid website address, like company.com.',
    words: 'Keep your message to 250 words or fewer.',
    failed: 'Your query could not be sent. Check your connection and try again.',
  },
  success: {
    title: 'Thank you',
    body: 'We have received your query. Our team will reach out to you on the provided email.',
    close: 'Close',
  },
} as const

// ---------------------------------------------------------------------------------------------
// Waitlist pop-up and launch video pop-up (final site). The success line follows Ankit's wording
// (2026-10-14); the video is a stand-in clip until the real launch video exists.
// ---------------------------------------------------------------------------------------------
export const waitlistForm = {
  title: 'Join the waitlist',
  submit: 'Submit',
  sending: 'Sending',
  success: {
    title: 'Thank you',
    body: 'We have received your information and will mail you the necessary details.',
    close: 'Close',
  },
} as const

/**
 * Blog page chrome (Ankit, 2026-10-15). The posts themselves are verbatim from skyfall.ai/blog
 * (./blog/posts.ts); the header line and newsletter copy below are drafted for this site.
 */
export const blogPage = {
  nav: 'Blog',
  label: 'Skyfall Blog',
  title: 'Blog & Articles',
  lede: 'Research, essays and notes from the team building world models for the enterprise.',
  featured: 'Featured · Latest',
  readMore: 'Read more',
  read: 'Read',
  minRead: 'min read',
  all: { title: 'All articles', note: 'Newest first' },
  reader: {
    back: 'All articles',
    toc: 'On this page',
    sections: 'sections',
    share: 'Share',
    copy: 'Copy link',
    copied: 'Copied',
    newer: 'Newer',
    older: 'Older',
    more: 'Keep reading',
  },
  newsletter: {
    label: 'Newsletter',
    title: 'New research, straight to your inbox',
    body: "Every time we publish a paper, a benchmark or a note from building SKY-001, we'll send it to you. Nothing else.",
    email: 'Work email',
    placeholder: 'you@company.com',
    submit: 'Subscribe',
    sending: 'Sending',
    note: 'One email per new article. Unsubscribe any time.',
    success: "You're subscribed. We'll email you when the next article goes live.",
  },
} as const

export const launchVideo = {
  title: 'Launch video',
  /** Shown under the stand-in clip; remove once the real video is in. */
  note: 'Placeholder clip. The launch video will appear here.',
} as const
