import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Bell,
  Car,
  ChevronDown,
  ChevronRight,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  Video,
  X,
} from 'lucide-react'
import { useDataStore } from '../context/DataStore'
import { drawerSlide, menuPop, modalBackdrop, pageMotion } from './motion'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/cars', label: 'Cars', icon: Car },
  { to: '/admin/blogs', label: 'Blogs', icon: FileText },
  { to: '/admin/videos', label: 'Videos', icon: Video },
  { to: '/admin/requests', label: 'Requests', icon: Inbox },
  { to: '/admin/users', label: 'Users', icon: Users },
]

const COLLAPSE_KEY = 'admin-sidebar-collapsed'

function readCollapsed() {
  try {
    return window.localStorage.getItem(COLLAPSE_KEY) === '1'
  } catch {
    return false
  }
}

function initials(name) {
  const parts = String(name || 'Admin').trim().split(/\s+/).filter(Boolean)
  return (parts[0]?.[0] || 'A').toUpperCase() + (parts[1]?.[0] || '').toUpperCase()
}

function titleCase(segment) {
  return segment.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function NavItems({ collapsed, pending, onNavigate, animateActive = false }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
      {NAV.map((item) => {
        const Icon = item.icon
        const badge = item.to === '/admin/requests' && pending > 0 ? pending : 0
        return (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold no-underline transition-colors ${
                  collapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'text-ink'
                    : 'text-nav-text hover:bg-bg hover:text-ink'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    animateActive ? (
                      <motion.span
                        layoutId="admin-nav-active"
                        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                        className="absolute inset-0 rounded-lg bg-primary/20"
                      />
                    ) : (
                      <span className="absolute inset-0 rounded-lg bg-primary/20" />
                    )
                  ) : null}
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 left-0 z-1 h-5 w-0.75 -translate-y-1/2 rounded-r bg-primary"
                    />
                  ) : null}
                  <span className="relative z-1 grid size-7 shrink-0 place-items-center">
                    <Icon size={17} strokeWidth={isActive ? 2.25 : 1.75} />
                    {badge && collapsed ? (
                      <span className="absolute top-0.5 right-0.5 size-1.5 rounded-full bg-ink" />
                    ) : null}
                  </span>
                  {!collapsed ? (
                    <>
                      <span className="relative z-1 min-w-0 flex-1 truncate">{item.label}</span>
                      {badge ? (
                        <span className="relative z-1 grid h-6 min-w-6 place-items-center rounded-md bg-ink px-1 text-[10px] font-bold text-white">
                          {badge}
                        </span>
                      ) : null}
                    </>
                  ) : null}
                </>
              )}
            </NavLink>
          </li>
        )
      })}
    </ul>
  )
}

function SidebarBrand({ collapsed }) {
  return (
    <Link
      to="/admin"
      className={`flex items-center gap-2.5 border-b border-border-soft px-3 py-3.5 no-underline ${
        collapsed ? 'justify-center' : ''
      }`}
    >
      <img src="/images/logo.webp" alt="" className="h-7 w-auto" />
      {!collapsed ? (
        <div className="min-w-0">
          <p className="m-0 truncate text-[13px] font-bold text-ink">Bilal Motors</p>
          <p className="m-0 text-[10px] font-bold tracking-[0.12em] text-muted-text uppercase">
            Admin
          </p>
        </div>
      ) : null}
    </Link>
  )
}

function AdminLayout() {
  const { isAdmin, adminUser, currentUser, logout, requests } = useDataStore()
  const location = useLocation()
  const navigate = useNavigate()
  const reduce = useReducedMotion()

  function onLogout() {
    logout()
    navigate('/', { replace: true })
  }

  const [collapsed, setCollapsed] = useState(readCollapsed)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const pending = useMemo(
    () => (Array.isArray(requests) ? requests.filter((r) => r?.status === 'pending').length : 0),
    [requests],
  )

  const crumbs = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean)
    return segments.map((segment, index) => {
      const to = '/' + segments.slice(0, index + 1).join('/')
      const match = NAV.find((item) => item.to === to)
      return { to, label: match?.label || titleCase(segment) }
    })
  }, [location.pathname])

  const pageTitle = crumbs[crumbs.length - 1]?.label || 'Dashboard'

  useEffect(() => {
    try {
      window.localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0')
    } catch {
      /* storage unavailable */
    }
  }, [collapsed])

  useEffect(() => {
    setDrawerOpen(false)
    setMenuOpen(false)
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  useEffect(() => {
    if (!menuOpen && !drawerOpen) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setDrawerOpen(false)
      }
    }
    const onDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onDown)
    }
  }, [menuOpen, drawerOpen])

  // Admin-only: members / guests cannot open /admin via URL change
  if (!isAdmin) {
    if (currentUser) return <Navigate to="/" replace />
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?next=${next}`} replace />
  }

  const name = adminUser?.name || 'Admin'

  return (
    <div className="admin-shell min-h-svh">
      {/* Desktop sidebar — light brand panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-border-soft bg-surface transition-[width] duration-200 min-[901px]:flex ${
          collapsed ? 'w-16' : 'w-55'
        }`}
      >
        <SidebarBrand collapsed={collapsed} />

        <nav aria-label="Admin" className="admin-aside-scroll flex-1 overflow-y-auto px-2 py-3">
          {!collapsed ? (
            <p className="mb-2 px-2.5 text-[10px] font-bold tracking-[0.14em] text-muted-text uppercase">
              Menu
            </p>
          ) : null}
          <NavItems collapsed={collapsed} pending={pending} animateActive />
        </nav>

        <div className="border-t border-border-soft p-2">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-semibold text-muted-text transition hover:bg-bg hover:text-ink ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
            {!collapsed ? <span>Collapse</span> : null}
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div
        className={`flex min-h-svh flex-col transition-[padding] duration-200 ${
          collapsed ? 'min-[901px]:pl-16' : 'min-[901px]:pl-55'
        }`}
      >
        <div className="flex min-h-svh flex-col">
          <header className="sticky top-0 z-20 border-b border-border-soft bg-surface/95 backdrop-blur-md">
            <div className="flex h-14 items-center justify-between gap-3 px-4 min-[901px]:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  aria-label="Open menu"
                  className="grid size-9 cursor-pointer place-items-center rounded-lg border border-border-soft text-ink transition hover:border-primary/50 hover:bg-bg min-[901px]:hidden"
                >
                  <Menu size={17} />
                </button>

                <Link to="/admin" className="flex shrink-0 items-center gap-2 no-underline min-[901px]:hidden">
                  <img src="/images/logo.webp" alt="Bilal Motors" className="h-7 w-auto" />
                  <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-ink uppercase">
                    Admin
                  </span>
                </Link>

                <nav
                  aria-label="Breadcrumb"
                  className="hidden min-w-0 items-center gap-1 text-[13px] min-[901px]:flex"
                >
                  {crumbs.map((crumb, index) => {
                    const last = index === crumbs.length - 1
                    return (
                      <span key={crumb.to} className="flex min-w-0 items-center gap-1">
                        {index > 0 ? (
                          <ChevronRight size={13} className="text-muted-text" aria-hidden="true" />
                        ) : null}
                        {last ? (
                          <span aria-current="page" className="truncate font-bold text-ink">
                            {crumb.label}
                          </span>
                        ) : (
                          <Link
                            to={crumb.to}
                            className="truncate font-semibold text-muted-text no-underline transition hover:text-ink"
                          >
                            {crumb.label}
                          </Link>
                        )}
                      </span>
                    )
                  })}
                </nav>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/admin/requests"
                  aria-label={pending > 0 ? `${pending} pending requests` : 'Requests'}
                  className="relative grid size-9 place-items-center rounded-lg border border-border-soft text-ink no-underline transition hover:border-primary/50 hover:bg-bg"
                >
                  <Bell size={16} />
                  {pending > 0 ? (
                    <span className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[10px] font-bold text-white">
                      {pending > 99 ? '99+' : pending}
                    </span>
                  ) : null}
                </Link>

                <div ref={menuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-border-soft bg-surface py-1 pr-2 pl-1 transition hover:border-primary/50 hover:bg-bg"
                  >
                    <span className="grid size-7 place-items-center rounded-md bg-primary text-[11px] font-bold text-ink">
                      {initials(name)}
                    </span>
                    <span className="hidden max-w-30 truncate text-[13px] font-semibold text-ink sm:inline">
                      {name}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-muted-text transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {menuOpen ? (
                      <motion.div
                        role="menu"
                        {...menuPop(reduce)}
                        className="absolute right-0 z-50 mt-1.5 w-56 origin-top-right overflow-hidden rounded-xl border border-border-soft bg-surface shadow-soft"
                      >
                        <div className="border-b border-border-soft px-3 py-2.5">
                          <p className="m-0 truncate text-[13px] font-bold text-ink">{name}</p>
                          <p className="m-0 mt-0.5 truncate text-[12px] text-muted-text">
                            {adminUser?.email || 'Administrator'}
                          </p>
                        </div>
                        <div className="p-1">
                          <button
                            type="button"
                            role="menuitem"
                            onClick={onLogout}
                            className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            <LogOut size={14} />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-360 flex-1 overflow-x-hidden px-4 py-5 min-[901px]:px-6 min-[901px]:py-6">
            <div className="mb-4 min-[901px]:hidden">
              <h1 className="m-0 text-[18px] font-bold tracking-tight text-ink">{pageTitle}</h1>
            </div>
            {/* Enter-only transition — no AnimatePresence exit (that caused blank pages). */}
            <motion.div
              key={location.pathname}
              {...pageMotion(reduce)}
              className="min-w-0"
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen ? (
          <div
            className="fixed inset-0 z-50 min-[901px]:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Admin menu"
          >
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              onClick={() => setDrawerOpen(false)}
              {...modalBackdrop}
              className="absolute inset-0 cursor-pointer border-0 bg-ink/45"
            />
            <motion.aside
              {...drawerSlide(reduce)}
              className="absolute inset-y-0 left-0 flex w-[80vw] max-w-70 flex-col border-r border-border-soft bg-surface shadow-soft"
            >
              <div className="flex items-center justify-between border-b border-border-soft pr-2">
                <SidebarBrand collapsed={false} />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="grid size-9 cursor-pointer place-items-center rounded-lg text-muted-text transition hover:bg-bg hover:text-ink"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="admin-aside-scroll flex-1 overflow-y-auto px-2 py-3">
                <p className="mb-2 px-2.5 text-[10px] font-bold tracking-[0.14em] text-muted-text uppercase">
                  Menu
                </p>
                <NavItems collapsed={false} pending={pending} onNavigate={() => setDrawerOpen(false)} />
              </div>

              <div className="border-t border-border-soft p-3">
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] font-bold text-red-600 transition hover:bg-red-100"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default AdminLayout
