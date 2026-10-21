import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const BODY_TYPES = [
  {
    name: 'Sedan',
    href: '#body-sedan',
    image: '/images/body/sedan.jpg',
    tip: 'Families & daily commute',
  },
  {
    name: 'Hatchback',
    href: '#body-hatchback',
    image: '/images/body/hatchback.jpg',
    tip: 'Tight city streets',
  },
  {
    name: 'SUV',
    href: '#body-suv',
    image: '/images/body/suv.jpg',
    tip: 'Space & road confidence',
  },
  {
    name: 'Crossover',
    href: '#body-crossover',
    image: '/images/body/crossover.jpg',
    tip: 'Flexible all-rounder',
  },
  {
    name: 'Pickup',
    href: '#body-pickup',
    image: '/images/body/pickup.jpg',
    tip: 'Work & cargo days',
  },
  {
    name: 'Van',
    href: '#body-van',
    image: '/images/body/van.jpg',
    tip: 'People & volume',
  },
  {
    name: 'Convertible',
    href: '#body-convertible',
    image: '/images/body/convertible.jpg',
    tip: 'Open-air driving',
  },
  {
    name: 'Test',
    href: '#body-test',
    image: '/images/body/test.jpg',
    tip: 'Special category',
  },
]

const ease = [0.22, 1, 0.36, 1]

function BrowseByBody() {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState('Sedan')
  const selected = BODY_TYPES.find((b) => b.name === active) ?? BODY_TYPES[0]

  return (
    <article
      id="browse-body"
      className="overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-soft"
    >
      <div className="h-1 bg-ink" aria-hidden="true" />

      <div className="p-5 max-[560px]:p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="m-0 mb-1 flex items-center gap-2 text-[10px] font-bold tracking-[0.14em] text-ink/55 uppercase">
              <span className="inline-block h-0.5 w-3 rounded-full bg-ink/40" aria-hidden="true" />
              Choose your style
            </p>
            <h2 className="m-0 text-[1.35rem] font-extrabold tracking-[-0.02em] text-ink max-[560px]:text-[1.2rem]">
              Browse by <span className="text-primary">Body</span>
            </h2>
          </div>
          <a
            href="#used-cars"
            className="shrink-0 pt-1 text-[13px] font-bold text-primary no-underline transition hover:text-primary-hover"
          >
            Show all →
          </a>
        </div>

        <div className="relative mb-3 overflow-hidden rounded-xl bg-[linear-gradient(145deg,#eaf6fb_0%,#f4f8fb_55%,#e8f3f9_100%)] px-4 py-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.name}
              className="flex items-center gap-3"
              initial={reduceMotion ? false : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -6 }}
              transition={{ duration: 0.22, ease }}
            >
              <img
                src={selected.image}
                alt=""
                className="h-11 w-[100px] rounded-md object-contain object-center"
                width="100"
                height="44"
              />
              <div className="min-w-0 flex-1">
                <strong className="block truncate text-[15px] font-extrabold tracking-[-0.02em] text-ink">
                  {selected.name}
                </strong>
                <span className="block truncate text-[11px] text-muted-text">
                  {selected.tip}
                </span>
              </div>
              <a
                href={selected.href}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-primary px-3 py-2 text-[12px] font-bold text-ink no-underline shadow-cta transition hover:bg-primary-hover"
              >
                Explore
                <ArrowIcon />
              </a>
            </motion.div>
          </AnimatePresence>
        </div>

        <ul className="m-0 grid list-none grid-cols-4 gap-3 p-0 max-[420px]:grid-cols-2">
          {BODY_TYPES.map((item) => {
            const isActive = item.name === active
            return (
              <li key={item.name}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(item.name)}
                  onFocus={() => setActive(item.name)}
                  onClick={() => {
                    setActive(item.name)
                    window.location.hash = item.href.replace('#', '')
                  }}
                  aria-pressed={isActive}
                  className={`flex w-full flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 text-center transition ${
                    isActive
                      ? 'border-primary/55 bg-primary/[0.08] text-ink ring-1 ring-primary/20'
                      : 'border-border-soft bg-bg/60 text-ink hover:border-primary/40 hover:bg-primary/[0.05]'
                  }`}
                >
                  <img
                    src={item.image}
                    alt=""
                    className="h-9 w-full max-w-[88px] object-contain"
                    width="88"
                    height="36"
                  />
                  <span className="text-[11.5px] font-semibold">{item.name}</span>
                </button>
              </li>
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
