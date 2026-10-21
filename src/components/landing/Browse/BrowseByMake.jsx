import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

/* Shows the logo, or the brand's first letter if the file is missing, so the layout never collapses. */
function BrandLogo({ src, name, className, size, grow = false }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span
        aria-hidden="true"
        className={`${className} grid place-items-center rounded-md bg-ink/[0.06] text-[13px] font-extrabold text-ink/45`}
      >
        {name.charAt(0)}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${className} transition duration-300 ease-out ${grow ? 'scale-110' : ''}`}
    />
  )
}

function BrowseByMake() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(BRANDS[0].name)
  const itemRefs = useRef([])
  const selected = BRANDS.find((b) => b.name === active) ?? BRANDS[0]
  const selectedIndex = BRANDS.indexOf(selected)
  const spring = reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }

  function goToBrand(name) {
    navigate(`/used-car/${name.toLowerCase()}`)
  }

  function handleKeyDown(event, index) {
    const last = BRANDS.length - 1
    let next = null
    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1
    if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = last
    if (next === null) return
    event.preventDefault()
    setActive(BRANDS[next].name)
    itemRefs.current[next]?.focus()
  }

  return (
    <article
      id="browse-make"
      className="overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-soft"
    >
      <div
        className="h-1 bg-gradient-to-r from-primary via-primary-hover to-primary"
        aria-hidden="true"
      />

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
          <Link
            to="/used-car"
            className="group inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[13px] font-bold text-primary no-underline transition hover:bg-primary/8 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Show all
            <span className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        {/* Compact interactive stage (same size as before) */}
        <div
          className="relative mb-3 overflow-hidden rounded-xl border border-white/5 bg-[linear-gradient(145deg,#1c2430_0%,#243044_100%)] px-4 py-3 text-white"
          aria-live="polite"
        >
          <div
            className="pointer-events-none absolute -top-10 -right-8 h-28 w-28 rounded-full bg-primary/25 blur-2xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden="true"/>
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.name}
              className="relative z-1 flex items-center gap-3"
              initial={reduceMotion ? false : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -6 }}
              transition={{ duration: 0.22, ease }}
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white shadow-md ring-1 ring-white/20">
                <BrandLogo
                  src={selected.logo}
                  name={selected.name}
                  size="28"
                  className="h-7 w-7 object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <strong className="block truncate text-[15px] font-extrabold tracking-[-0.02em]">
                    {selected.name}
                  </strong>
                  <span className="shrink-0 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-white/70">
                    {selectedIndex + 1}/{BRANDS.length}
                  </span>
                </div>
                <span className="block truncate text-[11px] text-white/60">
                  {selected.note}
                </span>
              </div>
              <Link
                to={`/used-car/${selected.name.toLowerCase()}`}
                className="group inline-flex shrink-0 items-center gap-1 rounded-lg bg-primary px-3 py-2 text-[12px] font-bold text-ink no-underline transition hover:-translate-y-px hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-0"
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
          aria-label="Car makes"
        >
          {BRANDS.map((brand, index) => {
            const isActive = brand.name === active
            return (
              <motion.li
                key={brand.name}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease, delay: reduceMotion ? 0 : index * 0.03 }}
              >
                <button
                  ref={(node) => {
                    itemRefs.current[index] = node
                  }}
                  type="button"
                  onMouseEnter={() => setActive(brand.name)}
                  onFocus={() => setActive(brand.name)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  onClick={() => {
                    setActive(brand.name)
                    goToBrand(brand.name)
                  }}
                  aria-pressed={isActive}
                  className={`group relative flex w-full cursor-pointer flex-col items-center gap-1.5 overflow-hidden rounded-xl border px-2 py-2.5 text-center transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    isActive
                      ? 'border-primary/55 ring-1 ring-primary/20'
                      : 'border-border-soft bg-bg/60 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm'
                  }`}
                >
                  {/* Active background slides between tiles */}
                  {isActive && (
                    <motion.span
                      layoutId="make-active-bg"
                      className="absolute inset-0 bg-primary/8"
                      transition={spring}
                      aria-hidden="true"
                    />
                  )}
                  {isActive && (
                    <motion.span
                      layoutId="make-active-bar"
                      className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary"
                      transition={spring}
                      aria-hidden="true"
                    />
                  )}

                  <span className="relative flex justify-center">
                    <BrandLogo
                      src={brand.logo}
                      name={brand.name}
                      size="32"
                      grow={isActive}
                      className="h-8 w-8 object-contain"
                    />
                  </span>
                  <span
                    className={`relative text-[11.5px] transition-colors ${
                      isActive ? 'font-bold text-ink' : 'font-semibold text-ink/80 group-hover:text-ink'
                    }`}
                  >
                    {brand.name}
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

export default BrowseByMake