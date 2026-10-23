import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useDataStore } from '../context/DataStore'

const ease = [0.22, 1, 0.36, 1]
const PAGE_SIZE = 9

const SORTS = [
  { value: 'featured', label: 'Featured order' },
  { value: 'shortest', label: 'Shortest first' },
  { value: 'longest', label: 'Longest first' },
  { value: 'title', label: 'Title A to Z' },
]

function secondsOf(item) {
  const parts = String(item.duration || '')
    .split(':')
    .map((part) => Number(part.replace(/\D/g, '')))
  if (parts.length < 2 || parts.some((n) => Number.isNaN(n))) return Number.MAX_SAFE_INTEGER
  return parts.reduce((total, part) => total * 60 + part, 0)
}

function VideosPage() {
  const reduceMotion = useReducedMotion()
  const { videos: VIDEOS } = useDataStore()
  const featured = VIDEOS[0]
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('featured')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const categories = useMemo(() => {
    const counts = new Map()
    VIDEOS.forEach((video) => counts.set(video.category, (counts.get(video.category) || 0) + 1))
    return [['All', VIDEOS.length], ...counts.entries()]
  }, [VIDEOS])

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const list = VIDEOS.filter((video) => {
      const matchesCategory = category === 'All' || video.category === category
      const matchesQuery =
        !needle ||
        [video.title, video.description, video.category].join(' ').toLowerCase().includes(needle)
      return matchesCategory && matchesQuery
    })

    if (sort === 'shortest') return [...list].sort((a, b) => secondsOf(a) - secondsOf(b))
    if (sort === 'longest') {
      return [...list].sort((a, b) => {
        const sa = secondsOf(a)
        const sb = secondsOf(b)
        if (sa === Number.MAX_SAFE_INTEGER) return 1
        if (sb === Number.MAX_SAFE_INTEGER) return -1
        return sb - sa
      })
    }
    if (sort === 'title') return [...list].sort((a, b) => a.title.localeCompare(b.title))
    return list
  }, [query, category, sort, VIDEOS])

  const shown = results.slice(0, visible)
  const hasMore = visible < results.length
  const filtersActive = query.trim() !== '' || category !== 'All'
  const picks = VIDEOS.slice(0, 4)

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
          Top picks
        </h3>
        <ul className="m-0 mt-3 list-none space-y-3 p-0">
          {picks.map((item) => (
            <li key={item.slug}>
              <Link to={`/videos/${item.slug}`} className="group flex gap-3 no-underline">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-lg">
                  <Thumb src={item.image} title={item.title} className="size-full" />
                  <span className="absolute inset-0 grid place-items-center bg-ink/25">
                    <PlayIcon size={12} />
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="line-clamp-2 block text-[13px] leading-snug font-bold text-ink transition group-hover:text-primary">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-muted-text">{item.duration}</span>
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
      <section className="relative overflow-hidden bg-ink px-6 pt-35 pb-14 text-white max-[860px]:px-4 max-[860px]:pt-32.5 max-[860px]:pb-10">
        <div
          className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/25 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/4 h-40 w-80 rounded-full bg-accent/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-310">
          <nav aria-label="Breadcrumb" className="mb-4 text-[12px] text-white/55">
            <Link to="/" className="no-underline transition hover:text-white">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="font-semibold text-white">Videos</span>
          </nav>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease }}
            className="flex flex-wrap items-end justify-between gap-6"
          >
            <div>
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
            </div>

            <div className="relative w-full max-w-sm max-[860px]:max-w-none">
              <SearchIcon dark />
              <input
                type="search"
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                placeholder="Search videos..."
                aria-label="Search videos"
                className="w-full rounded-xl border border-white/15 bg-white/10 py-3 pr-4 pl-11 text-[14px] text-white outline-none backdrop-blur-sm transition placeholder:text-white/45 focus:border-primary focus:ring-4 focus:ring-primary/20"
              />
            </div>
          </motion.div>

          {featured && (
            <motion.div
              className="mt-10"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: reduceMotion ? 0 : 0.08 }}
            >
              <Link
                to={`/videos/${featured.slug}`}
                className="group relative grid overflow-hidden rounded-3xl border border-white/10 bg-white/5 no-underline shadow-[0_20px_50px_rgba(0,0,0,0.35)] max-[900px]:grid-cols-1 min-[901px]:grid-cols-[1.35fr_0.9fr]"
              >
                <div className="relative aspect-16/10 min-[901px]:aspect-auto min-[901px]:min-h-80">
                  <Thumb
                    src={featured.image}
                    title={featured.title}
                    className="h-full w-full transition duration-700 group-hover:scale-[1.03]"
                  />
                  <span className="absolute inset-0 bg-linear-to-t from-ink/70 via-ink/20 to-transparent min-[901px]:bg-linear-to-r min-[901px]:from-transparent min-[901px]:via-transparent min-[901px]:to-ink/40" />
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
          )}
        </div>
      </section>

      {/* Catalogue: sidebar + grid */}
      <section className="px-6 py-12 max-[860px]:px-4 max-[860px]:py-10">
        <div className="mx-auto max-w-310">
          <div className="mb-6">
            <p className="m-0 text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
              All videos
            </p>
            <h2 className="mt-1 mb-0 text-[1.35rem] font-extrabold tracking-[-0.02em] text-ink">
              Full library
            </h2>
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
                    <strong className="text-ink">{results.length}</strong> videos
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
                        <VideoCard item={item} />
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
                      You have viewed {shown.length} of {results.length} videos
                    </p>
                    {hasMore && (
                      <button
                        type="button"
                        onClick={() => setVisible((count) => count + PAGE_SIZE)}
                        className="cursor-pointer rounded-xl border border-primary bg-surface px-8 py-3 text-[13.5px] font-bold text-ink shadow-soft transition hover:bg-primary"
                      >
                        Load more videos
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-border-soft bg-surface px-5 py-16 text-center">
                  <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary/15 text-primary">
                    <SearchIcon />
                  </span>
                  <h3 className="mt-4 mb-0 text-[1.1rem] font-extrabold text-ink">No videos found</h3>
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

          <div className="mt-12 overflow-hidden rounded-2xl border border-border-soft bg-surface p-6 shadow-soft max-[560px]:p-5">
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

function Thumb({ src, title, className }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <span
        aria-hidden="true"
        className={`${className} grid place-items-center bg-ink/8 text-[15px] font-extrabold text-ink/35`}
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

function VideoCard({ item }) {
  return (
    <Link
      to={`/videos/${item.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface no-underline shadow-soft transition hover:border-primary/40 hover:shadow-md"
    >
      <div className="relative aspect-16/10 overflow-hidden bg-ink/5">
        <Thumb
          src={item.image}
          title={item.title}
          className="h-full w-full transition duration-500 group-hover:scale-[1.04]"
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
      <div className="flex flex-1 flex-col p-4">
        <p className="m-0 text-[11px] font-bold tracking-widest text-primary uppercase">
          {item.category}
        </p>
        <strong className="mt-1.5 block text-[15px] leading-snug font-bold text-ink">
          {item.title}
        </strong>
        <p className="mt-2 mb-0 line-clamp-2 flex-1 text-[13px] leading-relaxed text-muted-text">
          {item.description}
        </p>
        <span className="mt-3 border-t border-border-soft pt-3 text-[13px] font-bold text-primary transition group-hover:text-primary-hover">
          Watch now →
        </span>
      </div>
    </Link>
  )
}

function SearchIcon({ dark = false }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={
        dark ? 'pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-white/55' : ''
      }
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function PlayIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-white">
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