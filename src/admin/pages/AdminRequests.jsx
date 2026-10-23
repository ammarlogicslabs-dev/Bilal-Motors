import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  CalendarDays,
  Car,
  Check,
  CheckCheck,
  Info,
  Mail,
  MessageSquare,
  Phone,
  X,
} from 'lucide-react'
import { useDataStore } from '../../context/DataStore'
import { formatPrice } from '../../data/cars'
import {
  EmptyState,
  PageHeader,
  StatusPill,
  btnDanger,
  btnSuccess,
  panelClass,
} from '../components/AdminUI'
import { fadeUp, staggerItem } from '../motion'
import { toastSuccess } from '../../lib/toast.jsx'

const FILTERS = ['pending', 'approved', 'rejected', 'all']

function AdminRequests() {
  const { requests, approveRequest, rejectRequest } = useDataStore()
  const reduce = useReducedMotion()
  const [filter, setFilter] = useState('pending')

  const list = Array.isArray(requests) ? requests : []

  const counts = useMemo(() => {
    const base = { all: list.length, pending: 0, approved: 0, rejected: 0 }
    list.forEach((r) => {
      if (base[r?.status] !== undefined) base[r.status] += 1
    })
    return base
  }, [list])

  const filtered = useMemo(() => {
    if (filter === 'all') return list
    return list.filter((r) => r.status === filter)
  }, [list, filter])

  return (
    <div>
      <PageHeader
        title="Requests"
        subtitle="Approve sell-car listings and review contact inquiries."
      />

      <motion.div
        role="tablist"
        aria-label="Filter requests"
        className="mb-4 flex flex-wrap gap-1 rounded-xl border border-border-soft bg-surface p-1"
        {...fadeUp(reduce, 0.04)}
      >
        {FILTERS.map((key) => {
          const active = filter === key
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(key)}
              className={`relative inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-[12.5px] font-bold capitalize transition-colors ${
                active
                  ? 'text-ink'
                  : 'text-nav-text hover:bg-bg hover:text-ink'
              }`}
            >
              {active ? (
                <motion.span
                  layoutId="admin-requests-filter"
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  className="absolute inset-0 rounded-lg bg-primary"
                />
              ) : null}
              <span className="relative z-1">{key}</span>
              <span
                className={`relative z-1 grid h-6 min-w-6 place-items-center rounded-md px-1 text-[10px] font-bold ${
                  active ? 'bg-ink/10 text-ink' : 'bg-bg text-muted-text'
                }`}
              >
                {counts[key]}
              </span>
            </button>
          )
        })}
      </motion.div>

      {filtered.length === 0 ? (
        <EmptyState title="No requests" text="Nothing in this filter right now." />
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((req, index) => {
            const isSell = req.type === 'sell-car'
            const TypeIcon = isSell ? Car : MessageSquare
            const pendingReq = req.status === 'pending'

            return (
              <motion.article
                key={req.id}
                layout={!reduce}
                {...staggerItem(reduce, index)}
                className={`${panelClass} relative p-4 ${
                  pendingReq ? 'border-l-[3px] border-l-primary' : ''
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-ink">
                      <TypeIcon size={16} />
                    </span>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusPill status={req.status} />
                        <span className="rounded-md bg-bg px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-ink uppercase">
                          {isSell
                            ? req.service === 'sell-it-for-me'
                              ? 'Sell it for me'
                              : 'Free ad'
                            : 'Contact'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[12px] font-medium text-muted-text">
                          <CalendarDays size={12} aria-hidden="true" />
                          {req.createdAt}
                        </span>
                      </div>

                      <h3 className="mt-2 mb-0 text-[15px] leading-snug font-bold text-ink">
                        {isSell ? req.title : req.subject}
                      </h3>

                      <p className="m-0 mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] font-medium text-muted-text">
                        <span className="font-bold text-ink">{req.name}</span>
                        <span className="inline-flex items-center gap-1">
                          <Phone size={12} aria-hidden="true" />
                          {req.phone}
                        </span>
                        <span className="inline-flex min-w-0 items-center gap-1">
                          <Mail size={12} aria-hidden="true" className="shrink-0" />
                          <span className="truncate">{req.email}</span>
                        </span>
                      </p>
                    </div>
                  </div>

                  {pendingReq ? (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          approveRequest(req.id)
                          toastSuccess(
                            isSell ? 'Request approved — listing published' : 'Request marked done',
                          )
                        }}
                        className={btnSuccess}
                      >
                        {isSell ? <Check size={14} /> : <CheckCheck size={14} />}
                        {isSell ? 'Approve & publish' : 'Mark done'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          rejectRequest(req.id)
                          toastSuccess('Request rejected')
                        }}
                        className={btnDanger}
                      >
                        <X size={14} />
                        Reject
                      </button>
                    </div>
                  ) : null}
                </div>

                {isSell ? (
                  <dl className="mt-4 mb-0 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                      { label: 'Price', value: formatPrice(req.price) },
                      {
                        label: 'Year / mileage',
                        value: `${req.year} · ${Number(req.mileage).toLocaleString()} km`,
                      },
                      { label: 'City / body', value: `${req.city} · ${req.body}` },
                      { label: 'Specs', value: `${req.transmission} · ${req.fuel}` },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="min-w-0 rounded-lg border border-border-soft bg-bg px-3 py-2"
                      >
                        <dt className="text-[11px] font-bold tracking-wide text-muted-text uppercase">
                          {item.label}
                        </dt>
                        <dd className="m-0 mt-0.5 truncate text-[13px] font-bold text-ink">
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="mt-4 mb-0 rounded-lg border border-border-soft bg-bg px-3 py-2.5 text-[13px] leading-relaxed text-ink">
                    {req.message}
                  </p>
                )}

                {req.notes ? (
                  <p className="mt-3 mb-0 text-[13px] leading-relaxed text-muted-text">
                    <span className="font-bold text-ink">Notes: </span>
                    {req.notes}
                  </p>
                ) : null}
              </motion.article>
            )
          })}
          </AnimatePresence>
        </div>
      )}

      <motion.div
        {...fadeUp(reduce, 0.12)}
        className="mt-4 flex items-start gap-2.5 rounded-xl border border-dashed border-border-soft bg-surface px-3.5 py-2.5 text-[12.5px] font-medium text-muted-text"
      >
        <Info size={14} className="mt-px shrink-0" aria-hidden="true" />
        <p className="m-0">Approving a sell-car request creates a published listing in Cars automatically.</p>
      </motion.div>
    </div>
  )
}

export default AdminRequests
