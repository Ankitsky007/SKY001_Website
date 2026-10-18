import { blogPage as B } from '@skyfall/core/v8'
import { blogPosts, type BlogPost } from '@skyfall/core/blog'
import { Reveal, useLenis } from '@skyfall/core/motion'
import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import { Footer } from '../components/Footer'
import { LineGrid } from '../components/LineGrid'
import { Nav } from '../components/Nav'
import { NewsletterForm } from '../components/NewsletterForm'
import { footerPages, navTabs } from '../lib/nav'
import { BLOG, HOME, postHref } from '../lib/routes'
import { scrambleOnHover } from '../lib/scramble'
import { GUTTER, LABEL, Ticks, WRAP } from '../lib/ui'

const TABS = navTabs('blog')
// Blog media lives in the site's public folder; the base keeps paths right in the relative artifact build too.
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

const META = 'flex flex-wrap items-center gap-x-3.5 gap-y-2 font-mono text-xs font-medium tracking-[-0.02em] text-muted uppercase'
const Dot = () => <span aria-hidden="true" className="block size-1 bg-faint" />

function Meta({ post, date = true, className = '' }: { post: BlogPost; date?: boolean; className?: string }) {
  return (
    <div className={`${META} ${className}`}>
      {date && (
        <>
          <time dateTime={post.iso} className="text-brand">
            {post.date}
          </time>
          <Dot />
        </>
      )}
      <span>{post.author}</span>
      <Dot />
      <span>
        {post.minutes} {B.minRead}
      </span>
    </div>
  )
}

function Chips({ chips }: { chips: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Keywords">
      {chips.map((c) => (
        <li key={c} className="flex h-[26px] items-center border border-line bg-paper px-2.5 font-mono text-[11px] text-body uppercase">
          {c}
        </li>
      ))}
    </ul>
  )
}

function Thumb({ post, className = '' }: { post: BlogPost; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-studio ${className}`}>
      <img src={asset(post.thumb)} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover object-left transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]" />
    </div>
  )
}

/** A post in the ruled grid: thumbnail, read time and author, title, two lines, chips, date. */
function PostCard({ post }: { post: BlogPost }) {
  return (
    <li className="flex border-r border-b border-line">
      <a
        href={postHref(post.slug)}
        className="group relative flex w-full flex-col bg-paper outline-offset-[-2px] hover:z-10 focus-visible:z-10"
      >
        {/* the blue hover frame sits above the thumbnail, so it runs round the whole card */}
        <span aria-hidden="true" className="pointer-events-none absolute -inset-px z-10 border border-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <Thumb post={post} className="aspect-[16/10] border-b border-line" />
        <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
          <div className={META}>
            <span className="text-brand">
              {post.minutes} {B.minRead}
            </span>
            <Dot />
            <span>{post.author}</span>
          </div>
          <h3 className="text-[22px] leading-[1.15] font-medium tracking-[-0.05em] transition-colors duration-300 group-hover:text-brand">{post.title}</h3>
          <p className="line-clamp-2 text-[15px] leading-[1.5] text-body">{post.excerpt}</p>
          <Chips chips={post.chips} />
          <div className={`${META} mt-auto justify-between border-t border-dashed border-line pt-3.5`}>
            <time dateTime={post.iso}>{post.date}</time>
            <span className="text-ink transition-colors duration-300 group-hover:text-brand">
              {B.read} <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </a>
    </li>
  )
}

function CardGrid({ posts }: { posts: readonly BlogPost[] }) {
  return <ul className="grid border-t border-l border-line md:grid-cols-2 lg:grid-cols-3">{posts.map((p) => <PostCard key={p.slug} post={p} />)}</ul>
}

function SectionHead({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4 border-b border-ink pb-4">
      <h2 className="text-[30px] leading-none font-medium tracking-[-0.045em] md:text-[44px]">{title}</h2>
      {children}
    </div>
  )
}

function Newsletter() {
  return (
    <section className={`relative bg-paper ${GUTTER} py-16 md:py-24`}>
      <LineGrid mask="radial-gradient(ellipse at 50% 50%, #000 20%, transparent 75%)" />
      <Reveal className={`relative ${WRAP} grid border border-line bg-paper lg:grid-cols-2`}>
        <div className="flex flex-col gap-4 border-b border-line p-6 md:p-10 lg:border-r lg:border-b-0">
          <span className={`${LABEL} text-brand`}>/ {B.newsletter.label}</span>
          <h2 className="max-w-[14ch] text-[34px] leading-[0.98] font-medium tracking-[-0.045em] md:text-[56px]">{B.newsletter.title}</h2>
          <p className="max-w-[44ch] text-[17px] leading-[1.45] text-body">{B.newsletter.body}</p>
        </div>
        <div className="flex flex-col justify-center p-6 md:p-10">
          <NewsletterForm />
        </div>
      </Reveal>
    </section>
  )
}

function BlogIndex() {
  const [feat, ...rest] = blogPosts
  return (
    <>
      <section className={`relative bg-paper ${GUTTER} pt-10 pb-10 md:pt-16`}>
        <Reveal stagger={0.1} className={`relative ${WRAP}`}>
          <Ticks>
            <div className="flex flex-col gap-5 px-1">
              <span className={`${LABEL} text-brand`}>/ {B.label}</span>
              <h1 className="text-[46px] leading-[0.92] font-medium tracking-[-0.045em] sm:text-[84px] lg:text-[120px] lg:leading-[0.86]">{B.title}</h1>
              <p className="max-w-[44ch] text-lg leading-[1.4] text-body md:text-xl">{B.lede}</p>
            </div>
          </Ticks>
        </Reveal>
      </section>

      <section className={`bg-paper ${GUTTER} pb-16 md:pb-24`}>
        <Reveal className={WRAP}>
          <p className={`${LABEL} mb-3.5 flex items-center gap-2.5`}>
            <span aria-hidden="true" className="block size-2 bg-brand" />
            {B.featured}
          </p>
          <a href={postHref(feat.slug)} className="group grid border border-line bg-paper transition-colors duration-300 hover:border-brand lg:grid-cols-[7fr_5fr]">
            <Thumb post={feat} className="aspect-[16/10] border-b border-line lg:aspect-auto lg:min-h-[440px] lg:border-r lg:border-b-0" />
            <div className="flex flex-col gap-5 p-6 md:p-10">
              <Meta post={feat} />
              <h2 className="text-[30px] leading-[1.05] font-medium tracking-[-0.045em] transition-colors duration-300 group-hover:text-brand md:text-[42px]">{feat.title}</h2>
              <p className="line-clamp-4 text-base leading-[1.5] text-body">{feat.excerpt}</p>
              <Chips chips={feat.chips} />
              <span onPointerEnter={scrambleOnHover} className="mt-auto inline-flex min-h-11 w-fit items-center gap-2.5 border-b border-ink font-mono text-sm font-semibold uppercase transition-colors group-hover:border-brand group-hover:text-brand">
                <span data-scramble>{B.readMore}</span> <span aria-hidden="true">→</span>
              </span>
            </div>
          </a>
        </Reveal>
      </section>

      <section className={`bg-paper ${GUTTER} pb-16 md:pb-24`}>
        <div className={WRAP}>
          <SectionHead title={B.all.title}>
            <span className={`${LABEL} text-muted`}>
              {String(rest.length).padStart(2, '0')} / {B.all.note}
            </span>
          </SectionHead>
          <CardGrid posts={rest} />
        </div>
      </section>
    </>
  )
}

/** The article's looping clips (the published GIFs) play while on screen and pause off it; reduced motion leaves them still. */
function useLoopsInView(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const videos = [...(ref.current?.querySelectorAll('video') ?? [])]
    if (!videos.length || typeof IntersectionObserver === 'undefined') return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement
          if (!e.isIntersecting) v.pause()
          else if (still) v.preload = 'metadata'
          else v.play().catch(() => {})
        }
      },
      { rootMargin: '200px 0px' },
    )
    for (const v of videos) io.observe(v)
    return () => io.disconnect()
  }, [ref])
}

/** Lights the heading the reader is in: the last one whose top has passed a line a quarter down the screen. */
function useActiveHeading(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    let raf = 0
    const check = () => {
      raf = 0
      let hit = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.25) hit = id
      }
      setActive(hit)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [ids])
  return active
}

/** A thin blue bar along the bottom of the screen that fills as the article is read (the top edge belongs to the nav). */
function Progress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById('article')
      if (!el) return
      const r = el.getBoundingClientRect()
      setP(Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight))))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-[3px] bg-line/70">
      <div className="h-full origin-left bg-brand" style={{ transform: `scaleX(${p})` }} />
    </div>
  )
}

function Share({ post }: { post: BlogPost }) {
  const [copied, setCopied] = useState(false)
  const url = typeof window === 'undefined' ? '' : window.location.href
  const box = 'flex min-h-11 items-center border border-line bg-paper px-3 font-mono text-[11px] font-medium uppercase transition-colors hover:border-brand hover:text-brand'
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked: nothing to do */
    }
  }
  return (
    <div>
      <p className={`${LABEL} mb-2.5`}>{B.reader.share}</p>
      <div className="flex flex-wrap gap-1.5">
        <button type="button" onClick={copy} className={`${box} cursor-pointer`} aria-live="polite">
          {copied ? B.reader.copied : B.reader.copy}
        </button>
        <a className={box} target="_blank" rel="noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}>
          LinkedIn
        </a>
        <a className={box} target="_blank" rel="noreferrer" href={`https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`}>
          X
        </a>
      </div>
    </div>
  )
}

function Reader({ post }: { post: BlogPost }) {
  const lenis = useLenis()
  const ids = post.toc.map((t) => t.id)
  const active = useActiveHeading(ids)
  const [open, setOpen] = useState(false)
  const i = blogPosts.indexOf(post)
  const newer = blogPosts[i - 1]
  const older = blogPosts[i + 1]
  const more = blogPosts.filter((p) => p !== post).slice(0, 3)
  const html = useMemo(() => post.html.replaceAll('src="blog-media/', `src="${asset('blog-media/')}`), [post])
  const body = useRef<HTMLDivElement>(null)
  useLoopsInView(body)

  const go = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const offset = -84
    if (lenis) lenis.scrollTo(el, { offset, duration: 1.2 })
    else el.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  const toc = (
    <ol className="border-l border-line">
      {post.toc.map((t) => (
        <li key={t.id}>
          <button
            type="button"
            onClick={() => go(t.id)}
            aria-current={active === t.id ? 'location' : undefined}
            className={`-ml-px block min-h-9 w-full cursor-pointer border-l py-1.5 pl-3.5 text-left text-sm leading-[1.35] transition-colors ${active === t.id ? 'border-brand text-ink' : 'border-transparent text-muted hover:text-ink'}`}
          >
            {t.title}
          </button>
        </li>
      ))}
    </ol>
  )

  return (
    <>
      <Progress />
      <article id="article">
        <header className={`relative bg-paper ${GUTTER} pt-12 pb-10 md:pt-20 lg:pt-32`}>
          <Reveal stagger={0.08} className={`relative ${WRAP} flex flex-col gap-5 md:gap-6`}>
            <nav aria-label="Breadcrumb" className="mb-6 md:mb-14">
              <a
                href={BLOG}
                onPointerEnter={scrambleOnHover}
                className="group inline-flex h-11 items-center gap-3 border border-ink bg-paper px-4 font-mono text-[13px] font-semibold tracking-[-0.02em] text-ink uppercase transition-colors duration-300 hover:border-brand hover:bg-brand hover:text-white md:text-sm"
              >
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>
                <span data-scramble>{B.reader.back}</span>
              </a>
            </nav>
            <Meta post={post} />
            <h1 className="max-w-[20ch] text-[38px] leading-none font-medium tracking-[-0.045em] text-balance sm:text-[56px] lg:text-[76px] lg:leading-[0.94]">{post.title}</h1>
            <Chips chips={post.chips} />
          </Reveal>
        </header>

        <div className={GUTTER}>
          <figure className={`${WRAP} border border-line bg-paper`}>
            <img src={asset(post.hero)} alt={post.heroAlt} className="block h-auto w-full" />
            {post.caption && <figcaption className="border-t border-line px-4 py-3 font-mono text-xs text-muted uppercase">{post.caption}</figcaption>}
          </figure>
        </div>

        <div className={`${GUTTER} pt-10 pb-16 md:pt-14 md:pb-24`}>
          <div className={`${WRAP} grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-16`}>
            <aside className="hidden lg:block">
              <div className="sticky top-28 flex flex-col gap-8">
                {post.toc.length > 0 && (
                  <nav aria-label={B.reader.toc}>
                    <p className={`${LABEL} mb-3`}>{B.reader.toc}</p>
                    {toc}
                  </nav>
                )}
                <Share post={post} />
              </div>
            </aside>

            <div className="min-w-0">
              {post.toc.length > 0 && (
                <div className="mb-8 border border-line lg:hidden">
                  <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className={`${LABEL} flex min-h-[52px] w-full cursor-pointer items-center justify-between px-4`}>
                    <span>
                      {B.reader.toc} · {post.toc.length} {B.reader.sections}
                    </span>
                    <span aria-hidden="true" className={`text-base transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
                      +
                    </span>
                  </button>
                  {open && <div className="border-t border-line px-4 py-3">{toc}</div>}
                </div>
              )}
              <div ref={body} className="blog-prose max-w-[680px]" dangerouslySetInnerHTML={{ __html: html }} />
              <div className="mt-12 max-w-[680px] lg:hidden">
                <Share post={post} />
              </div>
              {(newer || older) && (
                <nav aria-label="More articles" className="mt-12 grid max-w-[680px] border border-line md:grid-cols-2">
                  {newer ? (
                    <a href={postHref(newer.slug)} className="group flex flex-col gap-2.5 p-6 hover:bg-tint">
                      <span className={`${LABEL} text-muted`}>← {B.reader.newer}</span>
                      <span className="text-xl leading-[1.2] font-medium tracking-[-0.04em] group-hover:text-brand">{newer.title}</span>
                    </a>
                  ) : (
                    <span className="hidden md:block" />
                  )}
                  {older && (
                    <a href={postHref(older.slug)} className="group flex flex-col gap-2.5 border-t border-line p-6 hover:bg-tint md:border-t-0 md:border-l md:text-right">
                      <span className={`${LABEL} text-muted`}>{B.reader.older} →</span>
                      <span className="text-xl leading-[1.2] font-medium tracking-[-0.04em] group-hover:text-brand">{older.title}</span>
                    </a>
                  )}
                </nav>
              )}
            </div>
          </div>
        </div>
      </article>

      <section className={`bg-paper ${GUTTER} pb-16 md:pb-24`}>
        <div className={WRAP}>
          <SectionHead title={B.reader.more}>
            <a href={BLOG} className="inline-flex min-h-11 items-center gap-2 border-b border-ink font-mono text-[13px] font-semibold uppercase hover:border-brand hover:text-brand">
              {B.all.title} <span aria-hidden="true">→</span>
            </a>
          </SectionHead>
          <CardGrid posts={more} />
        </div>
      </section>
    </>
  )
}

/** The blog: the index at /blog and each post at /blog/<slug>. An unknown slug shows the index. */
export default function BlogPage({ post: slug }: { post?: string }) {
  const post = slug ? blogPosts.find((p) => p.slug === slug) : undefined
  useEffect(() => {
    document.title = post ? `${post.title} · Skyfall AI` : `${B.title} · Skyfall AI`
    return () => {
      document.title = 'Skyfall AI'
    }
  }, [post])
  return (
    <>
      <Nav home={HOME} tabs={TABS} />
      <main>
        {post ? <Reader post={post} /> : <BlogIndex />}
        <Newsletter />
      </main>
      <Footer pages={footerPages()} />
    </>
  )
}
