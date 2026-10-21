import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const BRANDS = [
  { name: 'Toyota', logo: '/images/brands/toyota.webp', note: 'Long-term dependability' },
  { name: 'Suzuki', logo: '/images/brands/suzuki.webp', note: 'City-friendly picks' },
  { name: 'Honda', logo: '/images/brands/Honda.webp', note: 'Reliable daily drivers' },
  { name: 'KIA', logo: '/images/brands/kia.webp', note: 'Bold & practical' },
  { name: 'Hyundai', logo: '/images/brands/Hyundai.webp', note: 'Feature-rich value' },
  { name: 'Changan', logo: '/images/brands/changan.webp', note: 'Modern local lineup' },
  { name: 'BYD', logo: '/images/brands/byd.jpg', note: 'Electric & hybrid range' },
  { name: 'MG', logo: '/images/brands/mg.jpg', note: 'Stylish value picks' },
]

const ease = [0.22, 1, 0.36, 1]

function BrowseByMake() {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(BRANDS[0].name)
  const selected = BRANDS.find((b) => b.name === active) ?? BRANDS[0]

  return (
    <article
      id="browse-make"
      className="overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-soft"
    >
      <div className="h-1 bg-primary" aria-hidden="true" />

      <div className="p-5 max-[560px]:p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="m-0 mb-1 flex items-center gap-2 text-[10px] font-bold tracking-[0.14em] text-primary uppercase">
              <span className="inline-block h-0.5 w-3 rounded-full bg-primary" aria-hidden="true" />
              Popular brands
            </p>
            <h2 className="m-0 text-[1.35rem] font-extrabold tracking-[-0.02em] text-ink max-[560px]:text-[1.2rem]">
              Browse by <span className="text-primary">Make</span>
            </h2>
          </div>
          <a
            href="#used-cars"
            className="shrink-0 pt-1 text-[13px] font-bold text-primary no-underline transition hover:text-primary-hover"
          >
            Show all →
          </a>
        </div>

        {/* Compact interactive stage */}
        <div className="relative mb-3 overflow-hidden rounded-xl bg-[linear-gradient(145deg,#1c2430_0%,#243044_100%)] px-4 py-3 text-white">
          <div
            className="pointer-events-none absolute -top-10 -right-8 h-28 w-28 rounded-full bg-primary/25 blur-2xl"
            aria-hidden="true"
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.name}
              className="relative z-[1] flex items-center gap-3"
              initial={reduceMotion ? false : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -6 }}
              transition={{ duration: 0.22, ease }}
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white shadow-md">
                <img
                  src={selected.logo}
                  alt=""
                  className="h-7 w-7 object-contain"
                  width="28"
                  height="28"
                />
              </div>
              <div className="min-w-0 flex-1">
                <strong className="block truncate text-[15px] font-extrabold tracking-[-0.02em]">
                  {selected.name}
                </strong>
                <span className="block truncate text-[11px] text-white/60">
                  {selected.note}
                </span>
              </div>
              <a
                href={`#brand-${selected.name.toLowerCase()}`}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-primary px-3 py-2 text-[12px] font-bold text-ink no-underline transition hover:bg-primary-hover"
              >
                Explore
                <ArrowIcon />
              </a>
            </motion.div>
          </AnimatePresence>
        </div>

        <ul className="m-0 grid list-none grid-cols-4 gap-3 p-0 max-[420px]:grid-cols-2">
          {BRANDS.map((brand) => {
            const isActive = brand.name === active
            return (
              <li key={brand.name}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(brand.name)}
                  onFocus={() => setActive(brand.name)}
                  onClick={() => {
                    setActive(brand.name)
                    window.location.hash = `brand-${brand.name.toLowerCase()}`
                  }}
                  aria-pressed={isActive}
                  className={`flex w-full flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 text-center transition ${
                    isActive
                      ? 'border-primary/55 bg-primary/[0.08] ring-1 ring-primary/20'
                      : 'border-border-soft bg-bg/60 hover:border-primary/40 hover:bg-primary/[0.05]'
                  }`}
                >
                  <img
                    src={brand.logo}
                    alt=""
                    className="h-8 w-8 object-contain"
                    width="32"
                    height="32"
                  />
                  <span className="text-[11.5px] font-semibold text-ink">{brand.name}</span>
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

export default BrowseByMake
