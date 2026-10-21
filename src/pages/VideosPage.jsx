import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { VIDEOS } from '../data/videos'

const ease = [0.22, 1, 0.36, 1]
const featured = VIDEOS[0]

function VideosPage() {
  const reduceMotion = useReducedMotion()

  return (
    <main className="pb-16">
      <section className="relative overflow-hidden bg-ink px-6 pt-[140px] pb-14 text-white max-[860px]:px-4 max-[860px]:pt-[130px] max-[860px]:pb-10">
        <div
          className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/25 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/4 h-40 w-80 rounded-full bg-accent/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-[1240px]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease }}
          >
            <p className="mb-3 text-[11px] font-bold tracking-[0.16em] text-accent uppercase">
              Video library
            </p>
            <h1 className="m-0 max-w-2xl text-[clamp(1.9rem,4vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.03em]">
              Watch before you decide
            </h1>
            <p className="mt-3 mb-0 max-w-xl text-[15px] leading-relaxed text-white/70">
              Walkarounds, buying guides, and inspection tips — built to help you
              compare used cars with more confidence.
            </p>
          </motion.div>

          <motion.div
            className="mt-10"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: reduceMotion ? 0 : 0.08 }}
          >
            <Link
              to={`/videos/${featured.slug}`}
              className="group relative grid overflow-hidden rounded-[24px] border border-white/10 bg-white/5 no-underline shadow-[0_20px_50px_rgba(0,0,0,0.35)] max-[900px]:grid-cols-1 min-[901px]:grid-cols-[1.35fr_0.9fr]"
            >
              <div className="relative aspect-[16/10] min-[901px]:aspect-auto min-[901px]:min-h-[320px]">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent min-[901px]:bg-gradient-to-r min-[901px]:from-transparent min-[901px]:via-transparent min-[901px]:to-ink/40" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-primary text-ink shadow-cta transition group-hover:scale-105">
                    <PlayIcon size={20} />
                  </span>
                </span>
              </div>

              <div className="relative flex flex-col justify-center gap-3 p-6 max-[860px]:p-5">
                <span className="inline-flex w-fit rounded-full bg-primary/20 px-3 py-1 text-[11px] font-bold tracking-wide text-accent uppercase">
                  Featured · {featured.duration}
                </span>
                <h2 className="m-0 text-[clamp(1.35rem,2.5vw,1.75rem)] font-extrabold tracking-[-0.02em] text-white">
                  {featured.title}
                </h2>
                <p className="m-0 text-[14px] leading-relaxed text-white/65">
                  {featured.description}
                </p>
                <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition group-hover:gap-2.5">
                  Watch now
                  <ArrowIcon />
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-12 max-[860px]:px-4 max-[860px]:py-10">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="m-0 text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
                All videos
              </p>
              <h2 className="mt-1 mb-0 text-[1.35rem] font-extrabold tracking-[-0.02em] text-ink">
                Full library
              </h2>
            </div>
            <p className="m-0 text-[13px] text-muted-text">{VIDEOS.length} videos</p>
          </div>

          <motion.div
            className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: reduceMotion ? 0 : 0.08 } },
            }}
          >
            {VIDEOS.map((item) => (
              <motion.div
                key={item.slug}
                variants={{
                  hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, ease },
                  },
                }}
                whileHover={reduceMotion ? undefined : { y: -4 }}
              >
                <VideoCard item={item} />
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-border-soft bg-surface p-6 shadow-soft max-[560px]:p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="m-0 text-[1.15rem] font-extrabold text-ink">
                  Ready to browse cars?
                </h3>
                <p className="mt-1 mb-0 text-[14px] text-muted-text">
                  Apply what you learned and explore used cars by make or body type.
                </p>
              </div>
              <Link
                to="/used-car"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-ink no-underline transition hover:bg-primary-hover"
              >
                Browse used cars
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function VideoCard({ item }) {
  return (
    <Link
      to={`/videos/${item.slug}`}
      className="group block overflow-hidden rounded-2xl border border-border-soft bg-surface no-underline shadow-soft transition hover:border-primary/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink/5">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute inset-0 bg-ink/20 transition group-hover:bg-ink/30" />
        <span className="absolute top-3 left-3 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
          {item.duration}
        </span>
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-ink shadow-cta transition group-hover:scale-105">
            <PlayIcon />
          </span>
        </span>
      </div>
      <div className="p-4">
        <p className="m-0 text-[11px] font-bold tracking-[0.1em] text-primary uppercase">
          {item.category}
        </p>
        <strong className="mt-1.5 block text-[15px] leading-snug font-bold text-ink">
          {item.title}
        </strong>
        <p className="mt-2 mb-0 line-clamp-2 text-[13px] leading-relaxed text-muted-text">
          {item.description}
        </p>
      </div>
    </Link>
  )
}

function PlayIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5L8 5.5z" />
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

export default VideosPage
