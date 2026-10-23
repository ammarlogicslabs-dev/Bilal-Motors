import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  Car,
  FileText,
  Inbox,
  RotateCcw,
  Users,
  Video,
} from 'lucide-react'
import { useDataStore } from '../../context/DataStore'
import { PageHeader, StatusPill, btnSecondary, panelClass } from '../components/AdminUI'
import { fadeUp, staggerItem } from '../motion'
import { formatPrice } from '../../data/cars'
import { toastConfirm, toastSuccess } from '../../lib/toast.jsx'

const TONES = {
  cars: {
    card: 'border-sky-200/80 bg-gradient-to-br from-sky-50 via-surface to-surface',
    icon: 'bg-sky-500 text-white shadow-[0_4px_12px_rgba(14,165,233,0.35)]',
    value: 'text-sky-900',
    hover: 'hover:border-sky-300 hover:shadow-[0_8px_20px_rgba(14,165,233,0.12)]',
  },
  blogs: {
    card: 'border-violet-200/80 bg-gradient-to-br from-violet-50 via-surface to-surface',
    icon: 'bg-violet-500 text-white shadow-[0_4px_12px_rgba(139,92,246,0.35)]',
    value: 'text-violet-950',
    hover: 'hover:border-violet-300 hover:shadow-[0_8px_20px_rgba(139,92,246,0.12)]',
  },
  videos: {
    card: 'border-cyan-200/80 bg-gradient-to-br from-cyan-50 via-surface to-surface',
    icon: 'bg-cyan-500 text-white shadow-[0_4px_12px_rgba(6,182,212,0.35)]',
    value: 'text-cyan-950',
    hover: 'hover:border-cyan-300 hover:shadow-[0_8px_20px_rgba(6,182,212,0.12)]',
  },
  users: {
    card: 'border-indigo-200/80 bg-gradient-to-br from-indigo-50 via-surface to-surface',
    icon: 'bg-indigo-500 text-white shadow-[0_4px_12px_rgba(99,102,241,0.35)]',
    value: 'text-indigo-950',
    hover: 'hover:border-indigo-300 hover:shadow-[0_8px_20px_rgba(99,102,241,0.12)]',
  },
  pending: {
    card: 'border-amber-300/90 bg-gradient-to-br from-amber-50 via-surface to-surface',
    icon: 'bg-amber-500 text-white shadow-[0_4px_12px_rgba(245,158,11,0.4)]',
    value: 'text-amber-950',
    hover: 'hover:border-amber-400 hover:shadow-[0_8px_20px_rgba(245,158,11,0.14)]',
  },
}

const ACTIONS = [
  {
    to: '/admin/cars',
    label: 'Cars',
    hint: 'Inventory & listings',
    icon: Car,
    tone: 'bg-sky-100 text-sky-700 group-hover:bg-sky-500 group-hover:text-white',
  },
  {
    to: '/admin/blogs',
    label: 'Blogs',
    hint: 'Articles & guides',
    icon: FileText,
    tone: 'bg-violet-100 text-violet-700 group-hover:bg-violet-500 group-hover:text-white',
  },
  {
    to: '/admin/videos',
    label: 'Videos',
    hint: 'Video library',
    icon: Video,
    tone: 'bg-cyan-100 text-cyan-700 group-hover:bg-cyan-500 group-hover:text-white',
  },
  {
    to: '/admin/requests',
    label: 'Requests',
    hint: 'Customer enquiries',
    icon: Inbox,
    tone: 'bg-amber-100 text-amber-700 group-hover:bg-amber-500 group-hover:text-white',
  },
  {
    to: '/admin/users',
    label: 'Users',
    hint: 'Staff & members',
    icon: Users,
    tone: 'bg-indigo-100 text-indigo-700 group-hover:bg-indigo-500 group-hover:text-white',
  },
]

function StatTile({ to, label, value, hint, toneKey, icon: Icon, index, reduce }) {
  const tone = TONES[toneKey] || TONES.cars
  return (
    <motion.div {...staggerItem(reduce, index, 0.05)}>
      <Link
        to={to}
        className={`group relative flex h-full flex-col overflow-hidden rounded-xl border p-4 no-underline transition hover:-translate-y-0.5 ${tone.card} ${tone.hover}`}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="m-0 text-[11px] font-bold tracking-widest text-muted-text uppercase">{label}</p>
          <span className={`grid size-9 place-items-center rounded-lg ${tone.icon}`}>
            <Icon size={16} />
          </span>
        </div>
        <p className={`m-0 mt-3 text-[28px] leading-none font-bold tracking-tight tabular-nums ${tone.value}`}>
          {value}
        </p>
        <p className="m-0 mt-2 text-[12px] font-medium text-muted-text">{hint}</p>
      </Link>
    </motion.div>
  )
}

function AdminDashboard() {
  const { cars, blogs, videos, requests, users, resetData } = useDataStore()
  const reduce = useReducedMotion()
  const pending = requests.filter((r) => r.status === 'pending')
  const published = cars.filter((c) => c.status === 'published').length
  const drafts = cars.filter((c) => c.status === 'draft').length
  const adminCount = (users || []).filter((u) => u.role === 'admin').length

  const stats = [
    {
      to: '/admin/cars',
      label: 'Cars',
      value: cars.length,
      hint: `${published} live · ${drafts} draft`,
      toneKey: 'cars',
      icon: Car,
    },
    {
      to: '/admin/blogs',
      label: 'Blogs',
      value: blogs.length,
      hint: 'Published articles',
      toneKey: 'blogs',
      icon: FileText,
    },
    {
      to: '/admin/videos',
      label: 'Videos',
      value: videos.length,
      hint: 'Video guides',
      toneKey: 'videos',
      icon: Video,
    },
    {
      to: '/admin/users',
      label: 'Users',
      value: (users || []).length,
      hint: `${adminCount} admin · ${(users || []).length - adminCount} member`,
      toneKey: 'users',
      icon: Users,
    },
    {
      to: '/admin/requests',
      label: 'Pending',
      value: pending.length,
      hint: pending.length > 0 ? 'Awaiting review' : 'Queue clear',
      toneKey: 'pending',
      icon: Inbox,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Marketplace content and pending work."
        action={
          <button
            type="button"
            onClick={async () => {
              const ok = await toastConfirm('Reset all admin data to demo seed?', {
                confirmLabel: 'Reset',
                cancelLabel: 'Cancel',
              })
              if (!ok) return
              resetData()
              toastSuccess('Demo data restored')
            }}
            className={btnSecondary}
          >
            <RotateCcw size={14} />
            Reset demo data
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat, index) => (
          <StatTile key={stat.label} {...stat} index={index} reduce={reduce} />
        ))}
      </div>

      {pending.length > 0 ? (
        <motion.section
          {...fadeUp(reduce, 0.18)}
          className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-linear-to-r from-amber-50 to-orange-50 px-4 py-3.5"
        >
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-amber-500 text-white shadow-[0_4px_12px_rgba(245,158,11,0.35)]">
              <Inbox size={18} />
            </span>
            <div className="min-w-0">
              <p className="m-0 text-[13px] font-bold text-ink">
                {pending.length} request{pending.length === 1 ? '' : 's'} waiting for review
              </p>
              <p className="m-0 mt-0.5 text-[12px] font-medium text-muted-text">
                Approve sell listings or contact inquiries from Requests.
              </p>
            </div>
          </div>
          <Link
            to="/admin/requests"
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-2 text-[13px] font-bold text-white no-underline shadow-[0_4px_12px_rgba(217,119,6,0.35)] transition hover:bg-amber-700"
          >
            Open requests
            <ArrowRight size={14} />
          </Link>
        </motion.section>
      ) : null}

      <div className="mt-5 grid gap-4 min-[900px]:grid-cols-2">
        <motion.section
          {...fadeUp(reduce, 0.22)}
          className={`${panelClass} border-primary/20 bg-linear-to-b from-primary/5 to-surface p-4`}
        >
          <div className="mb-3 flex items-center justify-between gap-2 border-b border-border-soft pb-3">
            <h2 className="m-0 text-[14px] font-bold text-ink">Quick actions</h2>
          </div>
          <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
            {ACTIONS.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.li key={item.to} {...staggerItem(reduce, index, 0.04)}>
                  <Link
                    to={item.to}
                    className="group flex items-center gap-3 rounded-lg px-2 py-2 no-underline transition hover:bg-surface"
                  >
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-lg transition ${item.tone}`}
                    >
                      <Icon size={15} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-bold text-ink">{item.label}</span>
                      <span className="block truncate text-[12px] font-medium text-muted-text">
                        {item.hint}
                      </span>
                    </span>
                    <ArrowRight
                      size={14}
                      aria-hidden="true"
                      className="shrink-0 text-muted-text transition group-hover:translate-x-0.5 group-hover:text-ink"
                    />
                  </Link>
                </motion.li>
              )
            })}
          </ul>
        </motion.section>

        <motion.section
          {...fadeUp(reduce, 0.28)}
          className={`${panelClass} border-sky-200/70 bg-linear-to-b from-sky-50/80 to-surface p-4`}
        >
          <div className="mb-3 flex items-center justify-between gap-2 border-b border-border-soft pb-3">
            <h2 className="m-0 text-[14px] font-bold text-ink">Latest cars</h2>
            <Link
              to="/admin/cars"
              className="inline-flex items-center gap-1 text-[12.5px] font-bold text-sky-700 no-underline hover:text-sky-900"
            >
              View all
              <ArrowRight size={13} />
            </Link>
          </div>

          {cars.length === 0 ? (
            <p className="m-0 rounded-lg border border-dashed border-sky-200 bg-sky-50/50 px-4 py-8 text-center text-[13px] font-medium text-muted-text">
              No cars yet. Add a listing from Cars.
            </p>
          ) : (
            <div className="overflow-hidden rounded-lg border border-sky-100 bg-surface">
              <table className="w-full border-collapse text-left text-[13px]">
                <thead className="bg-sky-50/80 text-[11px] font-bold tracking-widest text-sky-800/70 uppercase">
                  <tr>
                    <th scope="col" className="px-3 py-2">
                      Listing
                    </th>
                    <th scope="col" className="px-3 py-2">
                      Price
                    </th>
                    <th scope="col" className="px-3 py-2">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cars.slice(0, 5).map((car, index) => (
                    <motion.tr
                      key={car.id}
                      className="border-t border-sky-100/80"
                      {...staggerItem(reduce, index, 0.04)}
                    >
                      <td className="px-3 py-2.5">
                        <p className="m-0 max-w-55 truncate font-semibold text-ink">{car.title}</p>
                        <p className="m-0 text-[12px] font-medium text-muted-text">{car.city}</p>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap font-semibold text-sky-900 tabular-nums">
                        {formatPrice(car.price)}
                      </td>
                      <td className="px-3 py-2.5">
                        <StatusPill status={car.status || 'published'} />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  )
}

export default AdminDashboard
