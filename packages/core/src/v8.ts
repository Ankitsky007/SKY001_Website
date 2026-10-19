// ---------------------------------------------------------------------------------------------
// v8 Rewrite (apps/v8-rewrite). Everything from the shared core, with the copy from the content
// doc "New Website <> Skyfall AI", tabs "Front page re-write" and "Sky-001 page re-write"
// (captured 2026-10-18), verbatim apart from Ankit's calls the same day: "SKY 00-1" is written
// SKY-001, and the SKY-001 title stays as the doc has it. Sections the rewrite does not cover keep
// the shared copy. The exports below shadow the same names from ./index.
// ---------------------------------------------------------------------------------------------
import { backers as baseBackers, benchmarkStory as baseBenchmarkStory, hero as baseHero, research as baseResearch, site as baseSite, sky001 as baseSky001, team as baseTeam, type StoryRow } from './content'

export * from './index'

export const site = {
  ...baseSite,
  // capital A and E (Ankit, 2026-10-18)
  tagline: 'Engineering World Models for the Autonomous Enterprise.',
} as const

export const hero = {
  ...baseHero,
  title: 'Autonomous Business for the Post-scarcity era',
  lede: 'We’re enabling the future where an entire business can operate autonomously.',
} as const

export const research = {
  ...baseResearch,
  mission: {
    ...baseResearch.mission,
    before: 'Our mission is to create a future where businesses are run autonomously through ',
    emphasis: 'Enterprise World Models.',
  },
  problem: {
    title: 'The Problem with Next-Token Prediction',
    points: [
      { title: 'Long Horizon Planning', body: 'Planning and decision making in a business are long-horizoned, unconstrained and always evolving.' },
      {
        title: 'Dynamic Environment',
        body: 'Business ecosystems constantly shift due to market volatility, competitor actions, and macroeconomic disruptions, requiring internal models that adapt continuously in real time.',
      },
      {
        title: 'Inference efficiency',
        body: 'Running high-frequency simulations, causal reasoning, and multi-agent operations at scale demands low-latency, cost-effective architectures to support autonomous business workflows.',
      },
    ],
    paragraphs: [
      'Autoregressive next-token prediction architectures don’t really work in a business since it is a living system of parts, processes and decisions that is only partially observable and constantly changing.',
      'Every single decision can ripple through thousands of downstream steps across multiple departments and processes.',
    ],
  },
  build: {
    ...baseResearch.build,
    title: 'Enterprise World Models',
    lead: 'Skyfall AI has developed the first “Enterprise World Model” that learns the latent space of a business across its entirety: Design, Engineering, Sales, Marketing, Customer Support, Finance and Operations.',
    rest: 'These advanced models can simulate cause-and-effect relationships between functions and plan over long horizons to accomplish highly complex tasks, subject to safety guardrails.',
    steps: [
      { key: 'learn', label: 'Learn', title: 'Learn the latent space', body: 'Learns the latent space of a business across its entirety.' },
      ...baseResearch.build.steps.slice(1),
    ],
  },
  pareto: {
    ...baseResearch.pareto,
    body: 'By exploring far more of the solution space than any human team or language model can, they push enterprises onto a new Pareto frontier, where cost, speed, and quality no longer have to be traded against each other.',
  },
  matters: {
    title: 'No more AI co-pilots',
    description: {
      before: 'We are building foundation research for the software that will re-invent businesses. With world models, AI systems can ',
      emphasis: '‘dream’',
      after: ' what a successful business requires, and then plan and execute its own actions.',
    },
    body: 'Skyfall AI will advance AI research and develop AI systems for the business world where long horizon planning, adaptability, and reliability really matter, especially for the industrial, manufacturing, enterprise, healthcare, sectors and beyond.',
    sectors: ['Industrial', 'Manufacturing', 'Enterprise', 'Healthcare', 'And beyond'],
    qualities: baseResearch.matters.qualities,
  },
} as const

export const team = {
  ...baseTeam,
  story:
    'Founded by Maluuba co-founders, Skyfall AI is building foundational World Modeling technology that will transform how businesses operate. Maluuba was an early pioneer of the “Deep Learning” era which paved the path for the Transformers and LLMs breakthroughs. The Maluuba founders closely worked with Turing Award winners Yoshua Bengio and Richard Sutton. Microsoft acquired Maluuba and the team became Microsoft Research Canada.',
  experience:
    'Together, they bring more than 50 years of combined experience across fundamental science research and zero to one AI native product development as they are now shape the next era of AI.',
  researchTeam: 'Skyfall AI has assembled a world class AI Research team of 25 engineers and researchers.',
  // the rewrite drops the three-countries line, so its stat goes too
  stats: [
    { value: '50+', label: 'Years of combined experience' },
    { value: '25', label: 'Engineers and researchers' },
  ],
  experienceLabel: 'Our teams bring experience from',
  experienceFrom: ['Microsoft', 'University of Toronto', 'MILA', 'Vector Institute', 'AMII', 'YCombinator'],
} as const

export const backers = {
  ...baseBackers,
  more: 'And many others.',
} as const

export const sky001 = {
  ...baseSky001,
  hero: {
    ...baseSky001.hero,
    title: 'The First Engineering World Model',
    lede: 'Accelerating innovations in the physical economy with world models',
    note: 'Our first stop is Design & Engineering.',
  },
  intro: {
    ...baseSky001.intro,
    // the line above the SKY-001 headline, in capitals, shown as a bracket tag with the name in blue (Ankit, 2026-10-19)
    before: 'INTRODUCING ',
    emphasis: 'SKY-001',
  },
  contrarian: {
    ...baseSky001.contrarian,
    title: 'We’re taking a contrarian approach to AI research',
    points: [
      {
        title: 'Geometric & Spatial Reasoning',
        body: 'Engineering design isn’t a language problem. It’s a sequential decision problem that requires a model that can reason about geometry and formulate latent space abstractions.',
      },
      {
        title: 'First ‘Dreaming’ Foundational Model',
        body: 'We built a new type of world model with a completely new architecture. SKY-001 is designed for the next generation of AI that can ‘dream’ anything in the physical world. SKY-001 is an AI general engineer that can dream from product concept to factory',
      },
      {
        title: 'Generalization capabilities',
        body: 'As a latent world model, SKY-001 fundamentally understands how physical systems are designed and manufactured. From engineering to operations, the possibilities are endless.',
      },
    ],
  },
  moment: {
    ...baseSky001.moment,
    body: 'Our World Model significantly outperforms LLMs because LLMs are autoregressive in nature and not designed for Visual Reasoning. Our approach is the best path to scale compared to LLMs and a game changer for the AI industry.',
  },
} as const

// The charts name Opus as "Claude Opus 5.5" (Ankit, 2026-10-19). BIM's rows, and its speed and cost claims
// against GPT-6 Astra, are the research team's BIM table (Ankit, 2026-10-19): 144.6 ÷ 1.22 = 119×, 0.446 ÷ 0.0024 = 186×.
const [baseCad, baseBim] = baseBenchmarkStory.models
const claudeOpus = (rows: readonly StoryRow[]) => rows.map((r) => (r.model === 'Opus 5.5' ? { ...r, model: 'Claude Opus 5.5' } : r))
export const benchmarkStory = {
  ...baseBenchmarkStory,
  models: [
    {
      ...baseCad,
      rows: claudeOpus(baseCad.rows),
      // two films side by side on desktop, tabs on phones; each named by a black bar, so no chip (Ankit, 2026-10-19)
      clip: '',
      views: [
        { label: 'Accuracy', clipLabel: 'SKY-001, GPT-6 Astra, Gemini 4 Argon and Claude Fable 5.1 building the same car, motorbike and engine parts from one input image' },
        { label: 'Speed', clipLabel: 'SKY-001, GPT-6 Astra, Claude Fable 5.1 and Gemini 4 building the same 3D CAD part, each with its running time' },
      ],
    },
    {
      ...baseBim,
      rows: claudeOpus([
        { model: 'SKY-001', ours: true, iou: 43.6, seconds: 1.22, cost: 0.0024 },
        { model: 'GPT-6 Astra', ours: false, iou: 40.6, seconds: 144.6, cost: 0.446 },
        { model: 'Opus 5.5', ours: false, iou: 34.4, seconds: 113.2, cost: 0.276 },
        { model: 'Gemini 3.8 Flash', ours: false, iou: 42.3, seconds: 346.2, cost: 0.218 },
        { model: 'Qwen 3.8 Max', ours: false, iou: 28.8, seconds: 255.3, cost: 0.111 },
        { model: 'Kimi K3', ours: false, iou: 33.7, seconds: 113.9, cost: 0.27 },
        { model: 'Grok 4.7', ours: false, iou: 28.2, seconds: 592.1, cost: 0.305 },
      ]),
      // Accuracy and Speed films, as in 3D CAD (Ankit, 2026-10-19); each named by a black bar, so no chip
      clip: '',
      clipLabel: 'SKY-001, GPT-6 Astra, Claude Fable 5.1 and Muse Wonder 1.0 drawing the same floor plan side by side',
      views: [
        { label: 'Accuracy', clipLabel: 'SKY-001, GPT-6 Astra, Claude Fable 5.1 and Muse Wonder 1.0 drawing the same floor plan side by side' },
        { label: 'Speed', clipLabel: 'SKY-001, GPT-6 Astra, Claude Fable 5.1 and Muse Wonder 1.0 timed on the same floor plan, until all four finish' },
      ],
      claims: [{ value: '119×', label: 'faster', detail: '1.22 s vs 144.6 s' }, { value: '186×', label: 'lower cost', detail: '$0.0024 vs $0.446' }, baseBim.claims[2]],
    },
  ],
} as const
