import { useId, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  AlertCircle,
  ArrowLeft,
  Car,
  Eye,
  EyeOff,
  Heart,
  KeyRound,
  Lock,
  LogIn,
  Tag,
  User,
  Video,
} from 'lucide-react'
import { useDataStore } from '../context/DataStore'
import { toastError, toastSuccess } from '../lib/toast.jsx'

const EASE = [0.22, 1, 0.36, 1]

/** Block members from following ?next=/admin (and open-redirect tricks). */
function safePostLoginPath(user, nextParam) {
  const next =
    typeof nextParam === 'string' &&
    nextParam.startsWith('/') &&
    !nextParam.startsWith('//')
      ? nextParam
      : null
  const wantsAdmin = Boolean(next?.startsWith('/admin'))
  if (wantsAdmin && user?.role !== 'admin') return '/'
  if (next) return next
  return user?.role === 'admin' ? '/admin' : '/'
}

const FEATURES = [
  { icon: Car, title: 'Browse used cars', text: 'Search verified listings by make, city and budget.' },
  { icon: Video, title: 'Watch before you buy', text: 'Video walkarounds and inspection guides.' },
  { icon: Tag, title: 'Sell with confidence', text: 'List your car and reach serious buyers.' },
  { icon: Heart, title: 'Save favourites', text: 'Keep track of cars you like while you decide.' },
]

const fieldClass =
  'w-full rounded-xl border bg-bg py-3 pr-3.5 pl-11 text-[14px] font-semibold text-ink outline-none transition placeholder:font-medium placeholder:text-muted-text/70 focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/20'

function Login() {
  const { currentUser, login } = useDataStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const reduce = useReducedMotion()
  const errorId = useId()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const [error, setError] = useState('')
  const [shakeKey, setShakeKey] = useState(0)

  if (currentUser) {
    return <Navigate to={safePostLoginPath(currentUser, searchParams.get('next'))} replace />
  }

  function onSubmit(e) {
    e.preventDefault()
    const session = login(username.trim(), password)
    if (!session) {
      setError('Invalid username or password.')
      setShakeKey((k) => k + 1)
      toastError('Invalid username or password.')
      return
    }
    toastSuccess(`Welcome back, ${session.name}`)
    navigate(safePostLoginPath(session, searchParams.get('next')), { replace: true })
  }

  function onUsernameChange(value) {
    setUsername(value)
    if (error) setError('')
  }

  function onPasswordChange(value) {
    setPassword(value)
    if (error) setError('')
  }

  function onPasswordKey(event) {
    if (typeof event.getModifierState === 'function') {
      setCapsLock(event.getModifierState('CapsLock'))
    }
  }

  function fillDemo(role) {
    if (role === 'admin') {
      setUsername('admin')
      setPassword('bilal2026')
    } else {
      setUsername('user')
      setPassword('user123')
    }
    setError('')
  }

  const borderClass = error ? 'border-red-300' : 'border-border-soft'

  return (
    <div className="min-h-svh bg-bg text-ink min-[901px]:grid min-[901px]:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <aside className="relative hidden overflow-hidden bg-ink text-white min-[901px]:flex min-[901px]:flex-col min-[901px]:justify-between min-[901px]:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -left-24 size-105 rounded-full bg-primary/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -bottom-32 size-95 rounded-full bg-primary/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />

        <div className="relative">
          <p className="m-0 inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.14em] text-primary uppercase">
            <span className="h-0.5 w-6 bg-primary" aria-hidden="true" />
            Bilal Motors
          </p>
        </div>

        <div className="relative max-w-md">
          <h1 className="m-0 text-[2.4rem] leading-[1.1] font-extrabold tracking-[-0.03em]">
            One account for buying, selling and more.
          </h1>
          <p className="mt-3 mb-0 text-[14.5px] leading-relaxed text-white/65">
            Sign in to browse listings, watch video tours, and manage your Bilal Motors
            experience.
          </p>

          <ul className="mt-8 m-0 grid list-none gap-3 p-0">
            {FEATURES.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.li
                  key={item.title}
                  initial={reduce ? false : { opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : 0.15 + index * 0.07 }}
                  className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/20 text-primary">
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-bold">{item.title}</span>
                    <span className="block text-[12.5px] font-medium text-white/60">
                      {item.text}
                    </span>
                  </span>
                </motion.li>
              )
            })}
          </ul>
        </div>

        <p className="relative m-0 text-[12px] font-medium text-white/50">
          Trusted used car marketplace across Pakistan.
        </p>
      </aside>

      <main className="relative flex min-h-svh items-center justify-center px-4 py-10 min-[901px]:min-h-0 min-[901px]:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b from-primary/15 to-transparent min-[901px]:hidden"
        />

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="relative w-full max-w-105"
        >
          <div className="mb-6 flex items-center gap-2 min-[901px]:hidden">
            <img src="/images/logo.webp" alt="Bilal Motors" className="h-10 w-auto" />
          </div>

          <div className="rounded-3xl border border-border-soft bg-surface p-6 shadow-soft sm:p-8">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary text-ink shadow-soft">
              <Lock size={20} />
            </span>
            <h2 className="mt-4 mb-0 text-[22px] font-extrabold tracking-tight text-ink">
              Welcome back
            </h2>
            <p className="m-0 mt-1 text-[13px] font-medium text-muted-text">
              Sign in with your Bilal Motors account.
            </p>

            <motion.form
              key={shakeKey}
              onSubmit={onSubmit}
              animate={!reduce && shakeKey > 0 ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-6 space-y-4"
            >
              <div>
                <label
                  htmlFor="login-username"
                  className="mb-1.5 block text-[11px] font-bold tracking-[0.12em] text-muted-text uppercase"
                >
                  Username
                </label>
                <div className="relative">
                  <User
                    size={16}
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-text"
                  />
                  <input
                    id="login-username"
                    value={username}
                    onChange={(e) => onUsernameChange(e.target.value)}
                    autoComplete="username"
                    autoFocus
                    placeholder="Enter your username"
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={error ? errorId : undefined}
                    className={`${fieldClass} ${borderClass}`}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="mb-1.5 block text-[11px] font-bold tracking-[0.12em] text-muted-text uppercase"
                >
                  Password
                </label>
                <div className="relative">
                  <KeyRound
                    size={16}
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-text"
                  />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    onKeyUp={onPasswordKey}
                    onKeyDown={onPasswordKey}
                    onBlur={() => setCapsLock(false)}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={error ? errorId : undefined}
                    className={`${fieldClass} ${borderClass} pr-12!`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-muted-text transition hover:bg-bg hover:text-ink"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {capsLock ? (
                    <motion.p
                      initial={reduce ? false : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={reduce ? undefined : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      className="m-0 mt-2 flex items-center gap-1.5 overflow-hidden text-[12px] font-semibold text-muted-text"
                    >
                      <AlertCircle size={13} aria-hidden="true" />
                      Caps Lock is on
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </div>

              <AnimatePresence initial={false}>
                {error ? (
                  <motion.div
                    id={errorId}
                    role="alert"
                    initial={reduce ? false : { opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: EASE }}
                    className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-[13px] font-semibold text-red-600"
                  >
                    <AlertCircle size={16} className="mt-px shrink-0" aria-hidden="true" />
                    {error}
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <button
                type="submit"
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-[14px] font-extrabold text-ink shadow-cta transition hover:bg-primary-hover active:scale-[0.99]"
              >
                <LogIn size={16} />
                Sign in
              </button>
            </motion.form>

            {/* <div className="mt-5 space-y-2 rounded-xl border border-dashed border-border-soft bg-bg px-3.5 py-3">
              <p className="m-0 text-[11px] font-bold tracking-[0.1em] text-muted-text uppercase">
                Demo accounts
              </p>
              <p className="m-0 text-[12px] font-medium text-muted-text">
                Admins can create more accounts from Admin → Users.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo('user')}
                  className="cursor-pointer rounded-lg border border-border-soft bg-surface px-3 py-1.5 text-[12px] font-bold text-ink transition hover:border-primary/50"
                >
                  Member · user / user123
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('admin')}
                  className="cursor-pointer rounded-lg border border-border-soft bg-surface px-3 py-1.5 text-[12px] font-bold text-ink transition hover:border-primary/50"
                >
                  Staff · admin / bilal2026
                </button>
              </div>
            </div> */}
          </div>

          <Link
            to="/"
            className="mt-5 inline-flex w-full items-center justify-center gap-1.5 text-[13px] font-bold text-muted-text no-underline transition hover:text-ink"
          >
            <ArrowLeft size={14} />
            Back to website
          </Link>
        </motion.div>
      </main>
    </div>
  )
}

export default Login
