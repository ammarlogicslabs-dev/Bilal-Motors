import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { BLOGS } from '../data/blogs'

const ease = [0.22, 1, 0.36, 1]
const PAGE_SIZE = 9

const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'quick', label: 'Quickest read' },
  { value: 'title', label: 'Title A to Z' },
]

const featured = BLOGS[0]

function timeValue(item) {
  const parsed = Date.parse(item.date)
  return Number.isNaN(parsed) ? null : parsed
}

function minutesOf(item) {
  const match = String(item.readTime || '').match(/\d+/)
  return match ? Number(match[0]) : 0
}

function BlogsPage() {
  const reduceMotion = useReducedMotion()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('newest')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const categories = useMemo(() => {
    const counts = new Map()
    BLOGS.forEach((blog) => counts.set(blog.category, (counts.get(blog.category) || 0) + 1))
    return [['All', BLOGS.length], ...counts.entries()]
  }, [])

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const list = BLOGS.map((blog, index) => ({ blog, index })).filter(({ blog }) => {
      const matchesCategory = category === 'All' || blog.category === category
      const matchesQuery =
        !needle ||
        [blog.title, blog.excerpt, blog.category].join(' ').toLowerCase().includes(needle)
      return matchesCategory && matchesQuery
    })

    list.sort((a, b) => {
      if (sort === 'title') return a.blog.title.localeCompare(b.blog.title)
      if (sort === 'quick') return minutesOf(a.blog) - minutesOf(b.blog)
      const ta = timeValue(a.blog)
      const tb = timeValue(b.blog)
      // Fall back to the original order when dates cannot be parsed.
      if (ta === null || tb === null) return sort === 'oldest' ? b.index - a.index : a.index - b.index
      return sort === 'oldest' ? ta - tb : tb - ta
    })
    return list.map(({ blog }) => blog)
  }, [query, category, sort])

  const shown = results.slice(0, visible)
  const hasMore = visible < results.length
  const filtersActive = query.trim() !== '' || category !== 'All'
  const popular = BLOGS.slice(0, 4)

  function updateQuery(value) {
    setQuery(value)
    setVisible(PAGE_SIZE)
  }
  function updateCategory(value) {
    setCategory(value)
    setVisible(PAGE_SIZE)
    setFiltersOpen(false)
  }
  function updateSort(value) {
    setSort(value)
    setVisible(PAGE_SIZE)
  }
  function clearFilters() {
    setQuery('')
    setCategory('All')
    setVisible(PAGE_SIZE)
  }

  const sidebar = (
    <div className="space-y-6">
      <div>
        <h3 className="m-0 text-[11px] font-bold tracking-[0.14em] text-ink uppercase">
          Categories
        </h3>
        <ul className="m-0 mt-3 list-none space-y-1 p-0">
          {categories.map(([name, count]) => {
            const isActive = category === name
            return (
              <li key={name}>
                <button
                  type="button"
                  onClick={() => updateCategory(name)}
                  aria-pressed={isActive}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-[13.5px] transition ${
                    isActive
                      ? 'bg-primary/10 font-bold text-ink'
                      : 'font-medium text-muted-text hover:bg-ink/4 hover:text-ink'
                  }`}
                >
                  <span className="truncate">{name}</span>
                  <span
                    className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      isActive ? 'bg-primary text-ink' : 'bg-ink/6 text-muted-text'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div>
        <h3 className="m-0 text-[11px] font-bold tracking-[0.14em] text-ink uppercase">
          Popular reads
        </h3>
        <ul className="m-0 mt-3 list-none space-y-3 p-0">
          {popular.map((item) => (
            <li key={item.slug}>
              <Link to={`/blogs/${item.slug}`} className="group flex gap-3 no-underline">
                <Thumb src={item.image} title={item.title} className="size-14 shrink-0 rounded-lg" />
                <span className="min-w-0">
                  <span className="line-clamp-2 block text-[13px] leading-snug font-bold text-ink transition group-hover:text-primary">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-muted-text">{item.readTime}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {filtersActive && (
        <button
          type="button"
          onClick={clearFilters}
          className="w-full cursor-pointer rounded-xl border border-border-soft bg-surface px-4 py-2.5 text-[13px] font-bold text-ink transition hover:border-primary/50 hover:text-primary"
        >
          Reset filters
        </button>
      )}
    </div>
  )

  return (
    <main className="pb-16">
      {/* Hero + featured */}
      <section className="relative overflow-hidden bg-[linear-gradient(160deg,#eef1f4_0%,#e8f4f9_45%,#eef1f4_100%)] px-6 pt-35 pb-12 max-[860px]:px-4 max-[860px]:pt-32.5 max-[860px]:pb-10">
        <div
          className="pointer-events-none absolute top-24 right-10 h-56 w-56 rounded-full bg-primary/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-310">
          <nav aria-label="Breadcrumb" className="mb-4 text-[12px] text-muted-text">
            <Link to="/" className="no-underline transition hover:text-primary">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="font-semibold text-ink">Blogs</span>
          </nav>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease }}
            className="mb-8 flex flex-wrap items-end justify-between gap-6"
          >
            <div>
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
            </div>

            <div className="relative w-full max-w-sm max-[860px]:max-w-none">
              <SearchIcon />
              <input
                type="search"
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                placeholder="Search guides..."
                aria-label="Search guides"
                className="w-full rounded-xl border border-border-soft bg-surface py-3 pr-4 pl-11 text-[14px] text-ink shadow-soft outline-none transition placeholder:text-muted-text focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
            </div>
          </motion.div>

          {featured && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: reduceMotion ? 0 : 0.06 }}
            >
              <Link
                to={`/blogs/${featured.slug}`}
                className="group grid overflow-hidden rounded-3xl border border-border-soft bg-surface no-underline shadow-soft max-[900px]:grid-cols-1 min-[901px]:grid-cols-[1.2fr_1fr]"
              >
                <div className="relative aspect-16/10 overflow-hidden min-[901px]:aspect-auto min-[901px]:min-h-75">
                  <Thumb
                    src={featured.image}
                    title={featured.title}
                    className="h-full w-full transition duration-700 group-hover:scale-[1.03]"
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-ink px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase shadow-md">
                    Featured
                  </span>
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
          )}
        </div>
      </section>

      {/* Catalogue: sidebar + grid */}
      <section className="px-6 py-12 max-[860px]:px-4 max-[860px]:py-10">
        <div className="mx-auto max-w-310">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="m-0 text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
                All articles
              </p>
              <h2 className="mt-1 mb-0 text-[1.35rem] font-extrabold tracking-[-0.02em] text-ink">
                Full library
              </h2>
            </div>
          </div>

          <div className="min-[961px]:grid min-[961px]:grid-cols-[260px_minmax(0,1fr)] min-[961px]:items-start min-[961px]:gap-8">
            {/* Desktop sidebar */}
            <aside className="hidden min-[961px]:block">
              <div className="sticky top-28 rounded-2xl border border-border-soft bg-surface p-5 shadow-soft">
                {sidebar}
              </div>
            </aside>

            <div>
              {/* Toolbar */}
              <div className="mb-5 flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="m-0 text-[13px] text-muted-text">
                    Showing <strong className="text-ink">{shown.length}</strong> of{' '}
                    <strong className="text-ink">{results.length}</strong> guides
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFiltersOpen((open) => !open)}
                      aria-expanded={filtersOpen}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border-soft bg-surface px-3.5 py-2.5 text-[13px] font-semibold text-ink transition hover:border-primary/50 min-[961px]:hidden"
                    >
                      Categories
                      {category !== 'All' && (
                        <span className="rounded-full bg-primary px-1.5 text-[11px] font-bold text-ink">1</span>
                      )}
                    </button>

                    <label className="flex items-center gap-2 text-[13px] text-muted-text">
                      <span className="max-[560px]:sr-only">Sort by</span>
                      <select
                        value={sort}
                        onChange={(event) => updateSort(event.target.value)}
                        className="cursor-pointer rounded-xl border border-border-soft bg-surface px-3 py-2.5 text-[13px] font-semibold text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                      >
                        {SORTS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                {/* Mobile categories */}
                {filtersOpen && (
                  <div className="rounded-2xl border border-border-soft bg-surface p-4 shadow-soft min-[961px]:hidden">
                    {sidebar}
                  </div>
                )}

                {/* Active filter chips */}
                {filtersActive && (
                  <div className="flex flex-wrap items-center gap-2">
                    {category !== 'All' && (
                      <Chip label={category} onRemove={() => updateCategory('All')} />
                    )}
                    {query.trim() && (
                      <Chip label={`"${query.trim()}"`} onRemove={() => updateQuery('')} />
                    )}
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="cursor-pointer text-[12px] font-bold text-muted-text underline-offset-2 transition hover:text-primary hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>

              {/* Grid */}
              {shown.length > 0 ? (
                <>
                  <motion.div
                    key={`${category}-${sort}-${query}`}
                    className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1"
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: {},
                      show: { transition: { staggerChildren: reduceMotion ? 0 : 0.05 } },
                    }}
                  >
                    {shown.map((item) => (
                      <motion.div
                        key={item.slug}
                        variants={{
                          hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 },
                          show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
                        }}
                        whileHover={reduceMotion ? undefined : { y: -4 }}
                      >
                        <BlogCard item={item} />
                      </motion.div>
                    ))}
                  </motion.div>

                  <div className="mt-10 flex flex-col items-center gap-3">
                    <div className="h-1.5 w-48 overflow-hidden rounded-full bg-ink/10">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${(shown.length / results.length) * 100}%` }}
                      />
                    </div>
                    <p className="m-0 text-[12px] text-muted-text">
                      You have viewed {shown.length} of {results.length} guides
                    </p>
                    {hasMore && (
                      <button
                        type="button"
                        onClick={() => setVisible((count) => count + PAGE_SIZE)}
                        className="cursor-pointer rounded-xl border border-primary bg-surface px-8 py-3 text-[13.5px] font-bold text-ink shadow-soft transition hover:bg-primary"
                      >
                        Load more guides
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-border-soft bg-surface px-5 py-16 text-center">
                  <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary/15 text-primary">
                    <SearchIcon static />
                  </span>
                  <h3 className="mt-4 mb-0 text-[1.1rem] font-extrabold text-ink">No guides found</h3>
                  <p className="mt-2 mb-0 text-[14px] text-muted-text">
                    Try a different search or category.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 cursor-pointer rounded-xl bg-primary px-5 py-3 text-[13.5px] font-bold text-ink transition hover:bg-primary-hover"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl bg-ink p-6 text-white shadow-soft max-[560px]:p-5">
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
      alt={title}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${className} object-cover`}
    />
  )
}

function Chip({ label, onRemove }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove filter ${label}`}
      className="group inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 py-1 pr-2 pl-3 text-[12px] font-semibold text-ink transition hover:bg-primary/20"
    >
      {label}
      <span className="text-muted-text transition group-hover:text-ink" aria-hidden="true">×</span>
    </button>
  )
}

function BlogCard({ item }) {
  return (
    <Link
      to={`/blogs/${item.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface no-underline shadow-soft transition hover:border-primary/40 hover:shadow-md"
    >
      <div className="aspect-16/10 overflow-hidden bg-ink/5">
        <Thumb
          src={item.image}
          title={item.title}
          className="h-full w-full transition duration-500 group-hover:scale-[1.04]"
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
        <p className="mt-2 mb-0 line-clamp-3 flex-1 text-[13.5px] leading-relaxed text-muted-text">
          {item.excerpt}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-border-soft pt-3">
          <span className="text-[11.5px] text-muted-text">{item.date}</span>
          <span className="text-[13px] font-bold text-primary transition group-hover:text-primary-hover">
            Read more →
          </span>
        </div>
      </div>
    </Link>
  )
}

function SearchIcon({ static: isStatic = false }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={isStatic ? '' : 'pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-text'}
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

export default BlogsPage