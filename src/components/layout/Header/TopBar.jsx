import { Link, useNavigate } from 'react-router-dom'
import { useDataStore } from '../../../context/DataStore'
import { toastSuccess } from '../../../lib/toast.jsx'

function TopBar() {
  const { currentUser, isAdmin, isLoggedIn, logout } = useDataStore()
  const navigate = useNavigate()

  function onLogout() {
    logout()
    toastSuccess('Signed out')
    navigate('/', { replace: true })
  }

  return (
    <div className="bg-ink text-[12.5px] leading-none text-white/80">
      <div className="mx-auto flex max-w-310 items-center justify-between gap-4 px-6 py-1.5">
        <div className="flex items-center gap-5 max-[960px]:gap-3">
          <a
            href="tel:+923459275777"
            className="inline-flex items-center gap-2 transition-colors hover:text-white"
          >
            <PhoneIcon />
            <span>Call +92 345 9275777</span>
          </a>
          <a
            href="mailto:info@bilalmotors.com"
            className="inline-flex items-center gap-2 transition-colors hover:text-white max-[960px]:hidden"
          >
            <MailIcon />
            <span>info@bilalmotors.com</span>
          </a>
        </div>

        <div className="flex items-center gap-3 max-[960px]:gap-2">
          <span className="h-3 w-px bg-white/25 max-[960px]:hidden" aria-hidden="true" />

          {isLoggedIn ? (
            <>
              <span className="hidden text-white/70 sm:inline">
                Hi, <strong className="font-bold text-white">{currentUser?.name}</strong>
              </span>
              {isAdmin ? (
                <Link
                  to="/admin"
                  className="rounded-md bg-primary/20 px-2.5 py-1.5 font-bold text-primary no-underline transition hover:bg-primary/30"
                >
                  Admin
                </Link>
              ) : null}
              <button
                type="button"
                onClick={onLogout}
                className="rounded-md bg-white/10 px-2.5 py-1.5 font-semibold text-white transition hover:bg-white/15"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden transition-colors hover:text-white sm:inline no-underline text-white/80"
              >
                Create account
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1.5 font-semibold text-white no-underline transition-colors hover:bg-white/15"
              >
                <UserIcon />
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8c1.7 3.3 3.3 4.9 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.8 21 3 13.2 3 3.5 3 2.9 3.4 2.5 4 2.5h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z"
        fill="currentColor"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 1.5 8 5 8-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5 19.5c1.8-3.2 4.2-4.8 7-4.8s5.2 1.6 7 4.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default TopBar
