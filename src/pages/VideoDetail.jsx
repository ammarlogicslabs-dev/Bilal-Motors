import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { VIDEOS, getRelatedVideos, getVideo } from '../data/videos'

const ease = [0.22, 1, 0.36, 1]

function VideoDetail() {
  const { slug } = useParams()
  const video = getVideo(slug)
  const related = getRelatedVideos(slug) || []
  const reduceMotion = useReducedMotion()
  const [copied, setCopied] = useState(false)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })

  if (!video) {
    return (
      <main className="px-6 pt-35 pb-16 max-[860px]:px-4">
        <div className="mx-auto max-w-160 rounded-2xl border border-border-soft bg-surface p-8 text-center shadow-soft">
          <h1 className="m-0 text-2xl font-extrabold text-ink">Video not found</h1>
          <p className="mt-2 text-muted-text">This video may have moved or is unavailable.</p>
          <Link
            to="/videos"
            className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-bold text-ink no-underline transition hover:bg-primary-hover"
          >
            Back to videos
          </Link>
        </div>
      </main>
    )
  }

  const index = VIDEOS.findIndex((item) => item.slug === video.slug)
  const previous = index > 0 ? VIDEOS[index - 1] : null
  const next = index >= 0 && index < VIDEOS.length - 1 ? VIDEOS[index + 1] : null
  const latest = VIDEOS.filter((item) => item.slug !== video.slug).slice(0, 4)

  async function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    try {
      if (navigator.share) {
        await navigator.share({ title: video.title, text: video.description, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Share sheet closed or clipboard blocked.
    }
  }

  return (
    <main className="px-6 pt-35 pb-16 max-[860px]:px-4 max-[860px]:pt-32.5">
      <motion.div
        aria-hidden="true"
        style={{ scaleX: reduceMotion ? scrollYProgress : progress }}
        className="fixed inset-x-0 top-0 z-60 h-0.75 origin-left bg-primary"
      />

      <div className="mx-auto max-w-275">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[12.5px] text-muted-text">
          <Link to="/" className="no-underline transition hover:text-primary">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/videos" className="no-underline transition hover:text-primary">Videos</Link>
          <span aria-hidden="true">/</span>
          <span className="max-w-[16rem] truncate font-semibold text-ink">{video.title}</span>
        </nav>

        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="mt-5 max-w-205"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-primary/15 px-2.5 py-1 text-[11px] font-bold tracking-wide text-primary uppercase">
              {video.category}
            </span>
            <span className="text-[12.5px] font-medium text-muted-text">
              {video.duration} · {video.meta}
            </span>
          </div>

          <h1 className="mt-3 mb-0 text-[clamp(1.7rem,3.2vw,2.4rem)] font-extrabold leading-[1.15] tracking-[-0.03em] text-ink">
            {video.title}
          </h1>
          <p className="mt-3 mb-0 text-[16px] leading-relaxed text-muted-text">
            {video.description}
          </p>
        </motion.header>

        <div className="mt-8 min-[961px]:grid min-[961px]:grid-cols-[minmax(0,1fr)_320px] min-[961px]:items-start min-[961px]:gap-10">
          <motion.article
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: reduceMotion ? 0 : 0.05 }}
            className="min-w-0"
          >
            <div className="relative overflow-hidden rounded-[22px] border border-border-soft bg-ink shadow-soft">
              <Cover src={video.image} title={video.title} />
              <span className="absolute inset-0 bg-ink/25" />
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-ink shadow-cta">
                  <PlayIcon />
                </span>
              </span>
              <span className="absolute right-4 bottom-4 rounded-full bg-ink/75 px-3 py-1 text-[12px] font-bold text-white backdrop-blur-sm">
                {video.duration}
              </span>
            </div>

            <div className="mt-8 max-w-180 space-y-5">
              <p className="m-0 text-[16px] leading-[1.75] text-ink/85">
                {video.description}
              </p>
              <p className="m-0 text-[16px] leading-[1.75] text-ink/85">
                Use this walkthrough as a quick reference before you visit a seller or compare
                listings. Pause on any section you want to re-check during a real inspection.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border-soft pt-6">
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/used-car"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-ink no-underline shadow-cta transition hover:-translate-y-px hover:bg-primary-hover"
                >
                  Browse used cars
                  <ArrowIcon />
                </Link>
                <Link
                  to="/blogs"
                  className="inline-flex items-center gap-2 rounded-xl border border-border-soft bg-surface px-5 py-3 text-sm font-bold text-ink no-underline transition hover:border-primary/40"
                >
                  Read guides
                </Link>
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border-soft bg-surface px-4 py-3 text-sm font-bold text-ink transition hover:border-primary/40 hover:text-primary"
              >
                <ShareIcon />
                <span aria-live="polite">{copied ? 'Link copied' : 'Share'}</span>
              </button>
            </div>

            {(previous || next) && (
              <nav aria-label="More videos" className="mt-8 grid gap-3 sm:grid-cols-2">
                {previous ? (
                  <Link
                    to={`/videos/${previous.slug}`}
                    className="group rounded-2xl border border-border-soft bg-surface p-4 no-underline shadow-soft transition hover:border-primary/40"
                  >
                    <span className="text-[11px] font-bold tracking-wide text-muted-text uppercase">
                      ← Previous
                    </span>
                    <strong className="mt-1 line-clamp-2 block text-[14px] leading-snug text-ink transition group-hover:text-primary">
                      {previous.title}
                    </strong>
                  </Link>
                ) : (
                  <span className="hidden sm:block" />
                )}
                {next && (
                  <Link
                    to={`/videos/${next.slug}`}
                    className="group rounded-2xl border border-border-soft bg-surface p-4 text-right no-underline shadow-soft transition hover:border-primary/40"
                  >
                    <span className="text-[11px] font-bold tracking-wide text-muted-text uppercase">
                      Next →
                    </span>
                    <strong className="mt-1 line-clamp-2 block text-[14px] leading-snug text-ink transition group-hover:text-primary">
                      {next.title}
                    </strong>
                  </Link>
                )}
              </nav>
            )}
          </motion.article>

          <aside className="mt-10 space-y-5 min-[961px]:sticky min-[961px]:top-28 min-[961px]:mt-0">
            <div className="relative overflow-hidden rounded-2xl bg-ink p-5 text-white shadow-soft">
              <span
                className="pointer-events-none absolute -top-8 -right-6 h-24 w-24 rounded-full bg-primary/25 blur-2xl"
                aria-hidden="true"
              />
              <h3 className="relative m-0 text-[1.05rem] font-extrabold">Ready to find your car?</h3>
              <p className="relative mt-1.5 mb-0 text-[13.5px] leading-relaxed text-white/65">
                Browse verified used cars and apply what you just watched.
              </p>
              <Link
                to="/used-car"
                className="relative mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-ink no-underline transition hover:bg-primary-hover"
              >
                Browse used cars
                <ArrowIcon />
              </Link>
            </div>

            {latest.length > 0 && (
              <div className="rounded-2xl border border-border-soft bg-surface p-5 shadow-soft">
                <h3 className="m-0 text-[11px] font-bold tracking-[0.14em] text-ink uppercase">
                  Latest videos
                </h3>
                <ul className="m-0 mt-4 list-none space-y-4 p-0">
                  {latest.map((item) => (
                    <li key={item.slug}>
                      <Link to={`/videos/${item.slug}`} className="group flex gap-3 no-underline">
                        <Thumb src={item.image} title={item.title} className="size-14 shrink-0 rounded-lg" />
                        <span className="min-w-0">
                          <span className="line-clamp-2 block text-[13px] leading-snug font-bold text-ink transition group-hover:text-primary">
                            {item.title}
                          </span>
                          <span className="mt-0.5 block text-[11px] text-muted-text">
                            {item.duration}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/videos"
                  className="mt-4 inline-flex text-[13px] font-bold text-primary no-underline transition hover:text-primary-hover"
                >
                  View all videos →
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mx-auto mt-14 max-w-275">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="m-0 text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
                Keep watching
              </p>
              <h2 className="mt-1 mb-0 text-[1.2rem] font-extrabold text-ink">Related videos</h2>
            </div>
            <Link
              to="/videos"
              className="hidden text-[13px] font-bold text-primary no-underline transition hover:text-primary-hover sm:block"
            >
              View all →
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
            {related.map((item) => {
              return (
                <Link
                  key={item.slug}
                  to={`/videos/${item.slug}`}
                  className="group flex gap-4 overflow-hidden rounded-2xl border border-border-soft bg-surface p-3 no-underline shadow-soft transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="relative h-22 w-30 shrink-0 overflow-hidden rounded-xl bg-ink/5">
                    <Thumb
                      src={item.image}
                      title=""
                      className="h-full w-full transition group-hover:scale-105" />
                    <span className="absolute inset-0 grid place-items-center bg-ink/20">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-ink">
                        <PlayIcon size={12} />
                      </span>
                    </span>
                  </div>
                  <div className="min-w-0 py-1">
                    <span className="text-[11px] font-bold tracking-wide text-primary uppercase">
                      {item.category}
                    </span>
                    <strong className="mt-1 block text-[14.5px] leading-snug font-bold text-ink">
                      {item.title}
                    </strong>
                    <p className="mt-1 mb-0 line-clamp-2 text-[12.5px] text-muted-text">
                      {item.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      ) : null}
    </main>
  )
}

function Cover({ src, title }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <div
        aria-hidden="true"
        className="grid aspect-video w-full place-items-center bg-ink/6 text-5xl font-extrabold text-ink/25"
      >
        {String(title || '?').charAt(0)}
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={title}
      onError={() => setFailed(true)}
      className="block aspect-video w-full object-cover"
    />
  )
}

function Thumb({ src, title, className }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <span
        aria-hidden="true"
        className={`${className} grid place-items-center bg-ink/6 text-[15px] font-extrabold text-ink/35`}
      >
        {String(title || '?').charAt(0)}
      </span>
    )
  }
  return (
    <img
      src={src}
      alt={title ? title : ''}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${className} object-cover`}
    />
  )
}

function PlayIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5L8 5.5z" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M8.6 10.5l6.8-4M8.6 13.5l6.8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default VideoDetail
