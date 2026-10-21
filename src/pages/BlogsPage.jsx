import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { BLOGS } from '../data/blogs'

const ease = [0.22, 1, 0.36, 1]
const featured = BLOGS[0]

function BlogsPage() {
  const reduceMotion = useReducedMotion()

  return (
    <main className="pb-16">
      <section className="relative overflow-hidden bg-[linear-gradient(160deg,#eef1f4_0%,#e8f4f9_45%,#eef1f4_100%)] px-6 pt-[140px] pb-12 max-[860px]:px-4 max-[860px]:pt-[130px] max-[860px]:pb-10">
        <div
          className="pointer-events-none absolute top-24 right-10 h-56 w-56 rounded-full bg-primary/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-[1240px]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease }}
            className="mb-8"
          >
            <p className="mb-3 text-[11px] font-bold tracking-[0.16em] text-primary uppercase">
              Blog library
            </p>
            <h1 className="m-0 max-w-2xl text-[clamp(1.9rem,4vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink">
              Guides for smarter decisions
            </h1>
            <p className="mt-3 mb-0 max-w-xl text-[15px] leading-relaxed text-muted-text">
              Practical tips on buying, selling, paperwork, and driving — written
              for Pakistan used-car shoppers.
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: reduceMotion ? 0 : 0.06 }}
          >
            <Link
              to={`/blogs/${featured.slug}`}
              className="group grid overflow-hidden rounded-[24px] border border-border-soft bg-surface no-underline shadow-soft max-[900px]:grid-cols-1 min-[901px]:grid-cols-[1.2fr_1fr]"
            >
              <div className="relative aspect-[16/10] overflow-hidden min-[901px]:aspect-auto min-[901px]:min-h-[300px]">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-col justify-center gap-3 p-6 max-[860px]:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-primary/15 px-2 py-0.5 text-[11px] font-bold tracking-wide text-primary uppercase">
                    {featured.category}
                  </span>
                  <span className="text-[12px] font-medium text-muted-text">
                    {featured.readTime} · {featured.date}
                  </span>
                </div>
                <h2 className="m-0 text-[clamp(1.35rem,2.5vw,1.8rem)] font-extrabold tracking-[-0.02em] text-ink">
                  {featured.title}
                </h2>
                <p className="m-0 text-[14.5px] leading-relaxed text-muted-text">
                  {featured.excerpt}
                </p>
                <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition group-hover:gap-2.5">
                  Read article
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
                All articles
              </p>
              <h2 className="mt-1 mb-0 text-[1.35rem] font-extrabold tracking-[-0.02em] text-ink">
                Full library
              </h2>
            </div>
            <p className="m-0 text-[13px] text-muted-text">{BLOGS.length} guides</p>
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
            {BLOGS.map((item) => (
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
                <BlogCard item={item} />
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-8 overflow-hidden rounded-2xl bg-ink p-6 text-white shadow-soft max-[560px]:p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="m-0 text-[1.15rem] font-extrabold">
                  Prefer watching instead?
                </h3>
                <p className="mt-1 mb-0 text-[14px] text-white/65">
                  Browse walkaround tours and inspection guides in our video library.
                </p>
              </div>
              <Link
                to="/videos"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-ink no-underline transition hover:bg-primary-hover"
              >
                Watch videos
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function BlogCard({ item }) {
  return (
    <Link
      to={`/blogs/${item.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface no-underline shadow-soft transition hover:border-primary/40"
    >
      <div className="aspect-[16/10] overflow-hidden bg-ink/5">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-primary/15 px-2 py-0.5 text-[11px] font-bold tracking-wide text-primary uppercase">
            {item.category}
          </span>
          <span className="text-[11px] font-medium text-muted-text">{item.readTime}</span>
        </div>
        <strong className="mt-2.5 block text-[15px] leading-snug font-bold text-ink">
          {item.title}
        </strong>
        <p className="mt-2 mb-0 flex-1 text-[13.5px] leading-relaxed text-muted-text">
          {item.excerpt}
        </p>
        <span className="mt-3 text-[13px] font-bold text-primary transition group-hover:text-primary-hover">
          Read more →
        </span>
      </div>
    </Link>
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

export default BlogsPage
