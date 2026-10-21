import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import UsedCarsMegaMenu from './UsedCarsMegaMenu'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Used Cars', to: '/used-car', mega: true },
  { label: 'Videos', to: '/videos' },
  { label: 'Blogs', to: '/blogs' },
]

const navLinkClass =
  'group relative inline-flex items-center gap-1 pb-1 text-sm font-semibold tracking-wide no-underline transition-colors duration-200 after:absolute after:right-0 after:bottom-0 after:left-0 after:h-[2px] after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:after:scale-x-100'

function Navbar() {
  const [hovered, setHovered] = useState(false)
  const [pinned, setPinned] = useState(false)
  const leaveTimer = useRef(null)
  const megaOpen = hovered || pinned

  useEffect(() => {
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current)
    }
  }, [])

  useEffect(() => {
    if (!megaOpen) return undefined

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setPinned(false)
        setHovered(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [megaOpen])

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

  return (
    <nav
      className="relative mx-auto max-w-[1240px] rounded-b-[14px] bg-white shadow-nav"
      aria-label="Main"
    >
      <div className="flex min-h-[70px] items-center justify-between gap-4 px-[18px] py-2.5 max-[960px]:px-4">
        <Link to="/" className="flex shrink-0 items-center no-underline">
          <img
            src="/images/logo.webp"
            alt="Bilal Motors"
            className="block h-12 w-auto object-contain"
            width="180"
            height="48"
          />
        </Link>

        <ul className="m-0 flex flex-1 list-none items-center justify-end gap-x-[18px] gap-y-1 p-0 max-[960px]:hidden">
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

        <Link
          to="/used-car"
          className="ml-2 inline-flex shrink-0 items-center gap-2 rounded-[10px] bg-primary px-[18px] py-3 text-sm font-bold text-ink no-underline shadow-cta transition duration-200 hover:-translate-y-px hover:bg-primary-hover hover:shadow-cta-hover"
        >
          Sell Your Car
          <ArrowIcon />
        </Link>
      </div>

      <div onMouseEnter={openHover} onMouseLeave={closeHover}>
        <UsedCarsMegaMenu open={megaOpen} pinned={pinned} onClose={closeMega} />
      </div>
    </nav>
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
