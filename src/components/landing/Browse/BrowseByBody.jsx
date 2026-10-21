import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const BODY_TYPES = [
  {
    name: 'Sedan',
    slug: 'sedan',
    image: '/images/body/sedan.jpg',
    tip: 'Families & daily commute',
  },
  {
    name: 'Hatchback',
    slug: 'hatchback',
    image: '/images/body/hatchback.jpg',
    tip: 'Tight city streets',
  },
  {
    name: 'SUV',
    slug: 'suv',
    image: '/images/body/suv.jpg',
    tip: 'Space & road confidence',
  },
  {
    name: 'Crossover',
    slug: 'crossover',
    image: '/images/body/crossover.jpg',
    tip: 'Flexible all-rounder',
  },
  {
    name: 'Pickup',
    slug: 'pickup',
    image: '/images/body/pickup.jpg',
    tip: 'Work & cargo days',
  },
  {
    name: 'Van',
    slug: 'van',
    image: '/images/body/van.jpg',
    tip: 'People & volume',
  },
  {
    name: 'Convertible',
    slug: 'convertible',
    image: '/images/body/convertible.jpg',
    tip: 'Open-air driving',
  },
  {
    name: 'Coupe',
    slug: 'coupe',
    image: '/images/body/test.jpg',
    tip: 'Sporty styling & sleek design',
  },
]

const ease = [0.22, 1, 0.36, 1]

function BodyImage({ src, name, className, width, height, hovered = false }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span
        aria-hidden="true"
        className={`${className} grid place-items-center rounded-md bg-ink/[0.06] text-[13px] font-extrabold text-ink/40`}
      >
        {name.charAt(0)}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt=""
      width={width}
      height={height}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${className} transition duration-300 ease-out ${hovered ? 'scale-110' : ''}`}
    />
  )
}

function BrowseByBody() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState('Sedan')
  const itemRefs = useRef([])
  const selected = BODY_TYPES.find((b) => b.name === active) ?? BODY_TYPES[0]
  const selectedIndex = BODY_TYPES.indexOf(selected)

  function goToBody(slug) {
    navigate(`/used-car/${slug}`)
  }

  function handleKeyDown(event, index) {
    const last = BODY_TYPES.length - 1
    let next = null
    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1
    if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = last
    if (next === null) return
    event.preventDefault()
    setActive(BODY_TYPES[next].name)
    itemRefs.current[next]?.focus()
  }

  return (
    <article
      id="browse-body"
      className="overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-soft"
    >
      <div
        className="h-1 bg-gradient-to-r from-ink via-primary to-ink/80"
        aria-hidden="true"
      />

      <div className="p-5 max-[560px]:p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="m-0 mb-1 flex items-center gap-2 text-[10px] font-bold tracking-[0.14em] text-ink/55 uppercase">
              <span className="inline-block h-0.5 w-3 rounded-full bg-primary" aria-hidden="true" />
              Choose your style
            </p>
            <h2 className="m-0 text-[1.35rem] font-extrabold tracking-[-0.02em] text-ink max-[560px]:text-[1.2rem]">
              Browse by <span className="text-primary">Body</span>
            </h2>
          </div>
          <Link
            to="/used-car"
            className="group shrink-0 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[13px] font-bold text-primary no-underline transition hover:bg-primary/[0.08] hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Show all
            <span className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        {/* Preview strip (same size as before) */}
        <div
          className="relative mb-3 overflow-hidden rounded-xl border border-primary/10 bg-[linear-gradient(145deg,#eaf6fb_0%,#f4f8fb_55%,#e8f3f9_100%)] px-4 py-3"
          aria-live="polite"
        >
          <span
            className="pointer-events-none absolute -right-6 -top-8 h-20 w-20 rounded-full bg-primary/10 blur-2xl"
            aria-hidden="true"
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.name}
              className="relative flex items-center gap-3"
              initial={reduceMotion ? false : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -6 }}
              transition={{ duration: 0.22, ease }}
            >
              <BodyImage
                src={selected.image}
                name={selected.name}
                width="100"
                height="44"
                className="h-11 w-[100px] rounded-md object-contain object-center drop-shadow-sm"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <strong className="block truncate text-[15px] font-extrabold tracking-[-0.02em] text-ink">
                    {selected.name}
                  </strong>
                  <span className="shrink-0 rounded-full bg-ink/[0.07] px-1.5 py-0.5 text-[10px] font-bold text-ink/60">
                    {selectedIndex + 1}/{BODY_TYPES.length}
                  </span>
                </div>
                <span className="block truncate text-[11px] text-muted-text">
                  {selected.tip}
                </span>
              </div>
              <Link
                to={`/used-car/${selected.slug}`}
                className="group inline-flex shrink-0 items-center gap-1 rounded-lg bg-primary px-3 py-2 text-[12px] font-bold text-ink no-underline transition hover:-translate-y-px hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:translate-y-0"
              >
                Explore
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  <ArrowIcon />
                </span>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <ul
          className="m-0 grid list-none grid-cols-4 gap-3 p-0 max-[420px]:grid-cols-2"
          role="group"
          aria-label="Body types"
        >
          {BODY_TYPES.map((item, index) => {
            const isActive = item.name === active
            return (
              <motion.li
                key={item.name}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease, delay: reduceMotion ? 0 : index * 0.03 }}
              >
                <button
                  ref={(node) => {
                    itemRefs.current[index] = node
                  }}
                  type="button"
                  onMouseEnter={() => setActive(item.name)}
                  onFocus={() => setActive(item.name)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  onClick={() => {
                    setActive(item.name)
                    goToBody(item.slug)
                  }}
                  aria-pressed={isActive}
                  className={`group relative flex w-full cursor-pointer flex-col items-center gap-1.5 overflow-hidden rounded-xl border px-2 py-2.5 text-center text-ink transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    isActive
                      ? 'border-primary/55 ring-1 ring-primary/20'
                      : 'border-border-soft bg-bg/60 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm'
                  }`}
                >
                  {/* Active background slides between tiles */}
                  {isActive && (
                    <motion.span
                      layoutId="body-active-bg"
                      className="absolute inset-0 -z-0 bg-primary/[0.08]"
                      transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                      aria-hidden="true"
                    />
                  )}
                  {isActive && (
                    <motion.span
                      layoutId="body-active-bar"
                      className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary"
                      transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                      aria-hidden="true"
                    />
                  )}

                  <span className="relative flex w-full justify-center">
                    <BodyImage
                      src={item.image}
                      name={item.name}
                      width="88"
                      height="36"
                      hovered={isActive}
                      className="h-9 w-full max-w-[88px] object-contain"
                    />
                  </span>
                  <span
                    className={`relative text-[11.5px] transition-colors ${
                      isActive ? 'font-bold text-ink' : 'font-semibold text-ink/80 group-hover:text-ink'
                    }`}
                  >
                    {item.name}
                  </span>
                </button>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </article>
  )
}

function ArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default BrowseByBody