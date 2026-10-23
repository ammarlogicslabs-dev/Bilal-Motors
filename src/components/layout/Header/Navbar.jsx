import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import UsedCarsMegaMenu from './UsedCarsMegaMenu'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Used Cars', to: '/used-car', mega: true },
  { label: 'Videos', to: '/videos' },
  { label: 'Blogs', to: '/blogs' },
]

const MOBILE_BRANDS = [
  { name: 'Honda', logo: '/images/brands/Honda.webp' },
  { name: 'Toyota', logo: '/images/brands/toyota.webp' },
  { name: 'Suzuki', logo: '/images/brands/suzuki.webp' },
  { name: 'KIA', logo: '/images/brands/kia.webp' },
  { name: 'Hyundai', logo: '/images/brands/Hyundai.webp' },
  { name: 'MG', logo: '/images/brands/mg.jpg' },
]

const MOBILE_CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Faisalabad']

const navLinkClass =
  'group relative inline-flex items-center gap-1 pb-1 text-sm font-semibold tracking-wide no-underline transition-colors duration-200 after:absolute after:right-0 after:bottom-0 after:left-0 after:h-[2px] after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:after:scale-x-100'

const ease = [0.22, 1, 0.36, 1]

function Navbar() {
  const location = useLocation()
  const [hovered, setHovered] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileUsedOpen, setMobileUsedOpen] = useState(false)
  const leaveTimer = useRef(null)
  const megaOpen = hovered || pinned

  useEffect(() => {
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current)
    }
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setMobileUsedOpen(false)
    setPinned(false)
    setHovered(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!megaOpen && !mobileOpen) return undefined

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setPinned(false)
        setHovered(false)
        setMobileOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [megaOpen, mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  function openHover() {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
    setHovered(true)
  }

  function closeHover() {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
    leaveTimer.current = setTimeout(() => setHovered(false), 140)
  }

  function closeMega() {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
    setPinned(false)
    setHovered(false)
  }

  function closeMobile() {
    setMobileOpen(false)
    setMobileUsedOpen(false)
  }

  return (
    <nav
      className="relative mx-auto max-w-310 rounded-b-[14px] bg-white shadow-nav"
      aria-label="Main"
    >
      <div className="flex min-h-17.5 items-center justify-between gap-3 px-4.5 py-2.5 max-[960px]:px-4">
        <Link to="/" className="flex shrink-0 items-center no-underline" onClick={closeMobile}>
          <img
            src="/images/logo.webp"
            alt="Bilal Motors"
            className="block h-12 w-auto object-contain max-[420px]:h-10"
            width="180"
            height="48"
          />
        </Link>

        <ul className="m-0 flex flex-1 list-none items-center justify-end gap-x-4.5 gap-y-1 p-0 max-[960px]:hidden">
          {NAV_LINKS.map((item) => (
            <li
              key={item.label}
              onMouseEnter={item.mega ? openHover : undefined}
              onMouseLeave={item.mega ? closeHover : undefined}
            >
              {item.mega ? (
                <button
                  type="button"
                  onClick={() => setPinned((value) => !value)}
                  aria-expanded={megaOpen}
                  aria-haspopup="dialog"
                  className={`${navLinkClass} border-0 bg-transparent ${
                    megaOpen
                      ? 'text-primary after:scale-x-100'
                      : 'text-nav-text hover:text-primary'
                  }`}
                >
                  {item.label}
                  <ChevronIcon open={megaOpen} />
                </button>
              ) : (
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `${navLinkClass} ${
                      isActive
                        ? 'text-primary after:scale-x-100'
                        : 'text-nav-text hover:text-primary'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/sell-car"
            className="hidden items-center gap-2 rounded-[10px] bg-primary px-4.5 py-3 text-sm font-bold text-ink no-underline shadow-cta transition duration-200 hover:-translate-y-px hover:bg-primary-hover hover:shadow-cta-hover min-[961px]:inline-flex"
          >
            Sell Your Car
            <ArrowIcon />
          </Link>

          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-[10px] border border-border-soft bg-bg text-ink transition hover:border-primary/40 hover:bg-primary/10 min-[961px]:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      <div className="max-[960px]:hidden" onMouseEnter={openHover} onMouseLeave={closeHover}>
        <UsedCarsMegaMenu open={megaOpen} pinned={pinned} onClose={closeMega} />
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              key="mobile-backdrop"
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 border-0 bg-ink/35 min-[961px]:hidden"
              aria-label="Close menu"
              onClick={closeMobile}
            />

            <motion.div
              key="mobile-panel"
              id="mobile-nav"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease }}
              className="absolute top-full right-0 left-0 z-50 mt-1.5 overflow-hidden rounded-2xl border border-border-soft bg-white shadow-nav min-[961px]:hidden"
            >
              <div className="custom-scrollbar max-h-[min(78vh,640px)] overflow-y-auto p-3">
                <ul className="m-0 flex list-none flex-col gap-1 p-0">
                  {NAV_LINKS.map((item) =>
                    item.mega ? (
                      <li key={item.label}>
                        <button
                          type="button"
                          onClick={() => setMobileUsedOpen((v) => !v)}
                          aria-expanded={mobileUsedOpen}
                          className="flex w-full items-center justify-between rounded-xl border-0 bg-transparent px-3.5 py-3 text-left text-[15px] font-bold text-ink transition hover:bg-primary/10"
                        >
                          {item.label}
                          <ChevronIcon open={mobileUsedOpen} />
                        </button>

                        <AnimatePresence initial={false}>
                          {mobileUsedOpen ? (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22, ease }}
                              className="overflow-hidden"
                            >
                              <div className="mb-2 ml-1 space-y-3 rounded-xl border border-border-soft bg-bg/80 p-3">
                                <Link
                                  to="/used-car"
                                  onClick={closeMobile}
                                  className="block rounded-lg bg-primary/15 px-3 py-2.5 text-[13.5px] font-bold text-ink no-underline transition hover:bg-primary/25"
                                >
                                  Browse all used cars
                                </Link>

                                <div>
                                  <p className="m-0 mb-2 text-[11px] font-bold tracking-widest text-primary uppercase">
                                    Popular brands
                                  </p>
                                  <div className="grid grid-cols-3 gap-1.5">
                                    {MOBILE_BRANDS.map((brand) => (
                                      <Link
                                        key={brand.name}
                                        to={`/used-car/${brand.name.toLowerCase()}`}
                                        onClick={closeMobile}
                                        className="flex flex-col items-center gap-1 rounded-lg bg-white px-2 py-2 text-center no-underline ring-1 ring-border-soft transition hover:ring-primary/40"
                                      >
                                        <img
                                          src={brand.logo}
                                          alt=""
                                          className="h-7 w-7 object-contain"
                                          width="28"
                                          height="28"
                                        />
                                        <span className="text-[11px] font-semibold text-ink">
                                          {brand.name}
                                        </span>
                                      </Link>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <p className="m-0 mb-2 text-[11px] font-bold tracking-widest text-primary uppercase">
                                    Popular cities
                                  </p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {MOBILE_CITIES.map((city) => (
                                      <Link
                                        key={city}
                                        to={`/used-car?city=${encodeURIComponent(city)}`}
                                        onClick={closeMobile}
                                        className="rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-ink no-underline ring-1 ring-border-soft transition hover:ring-primary/40"
                                      >
                                        {city}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </li>
                    ) : (
                      <li key={item.label}>
                        <NavLink
                          to={item.to}
                          end={item.to === '/'}
                          onClick={closeMobile}
                          className={({ isActive }) =>
                            `block rounded-xl px-3.5 py-3 text-[15px] font-bold no-underline transition ${
                              isActive
                                ? 'bg-primary/15 text-ink'
                                : 'text-nav-text hover:bg-primary/10 hover:text-ink'
                            }`
                          }
                        >
                          {item.label}
                        </NavLink>
                      </li>
                    ),
                  )}
                </ul>

                <Link
                  to="/sell-car"
                  onClick={closeMobile}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-[14px] font-extrabold text-ink no-underline shadow-cta transition hover:bg-primary-hover"
                >
                  Sell Your Car
                  <ArrowIcon />
                </Link>

                <div className="mt-3 border-t border-border-soft pt-3">
                  <a
                    href="tel:+923459275777"
                    className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold text-ink no-underline transition hover:bg-primary/10"
                  >
                    Call +92 345 9275777
                  </a>
                  <a
                    href="mailto:info@bilalmotors.com"
                    className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold text-ink no-underline transition hover:bg-primary/10"
                  >
                    info@bilalmotors.com
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </nav>
  )
}

function HamburgerIcon({ open }) {
  return (
    <span className="relative block h-3.5 w-4.5" aria-hidden="true">
      <span
        className={`absolute top-0 left-0 h-0.5 w-full rounded-full bg-current transition duration-200 ${
          open ? 'translate-y-1.5 rotate-45' : ''
        }`}
      />
      <span
        className={`absolute top-1.5 left-0 h-0.5 w-full rounded-full bg-current transition duration-200 ${
          open ? 'opacity-0' : ''
        }`}
      />
      <span
        className={`absolute top-3 left-0 h-0.5 w-full rounded-full bg-current transition duration-200 ${
          open ? '-translate-y-1.5 -rotate-45' : ''
        }`}
      />
    </span>
  )
}

function ChevronIcon({ open }) {
  return (
    <motion.svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

export default Navbar
