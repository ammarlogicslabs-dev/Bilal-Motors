import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  Calendar,
  Factory,
  Fuel,
  Gauge,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Settings2,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { FILTER_OPTIONS, formatMileage, formatPrice } from '../data/cars'
import { useDataStore } from '../context/DataStore'
import { toWhatsappDigits } from '../lib/phone'

const ease = [0.22, 1, 0.36, 1]

const EMPTY_FILTERS = {
  make: '',
  body: '',
  city: '',
  transmission: '',
  fuel: '',
  color: '',
  condition: '',
  assembly: '',
  registered: '',
  yearMin: '',
  yearMax: '',
  priceMin: '',
  priceMax: '',
  mileageMax: '',
  q: '',
}

const FILTER_LABELS = {
  q: 'Search',
  make: 'Make',
  body: 'Body',
  city: 'City',
  transmission: 'Transmission',
  fuel: 'Fuel',
  color: 'Color',
  condition: 'Condition',
  assembly: 'Assembly',
  registered: 'Registered',
  yearMin: 'Year min',
  yearMax: 'Year max',
  priceMin: 'Price min',
  priceMax: 'Price max',
  mileageMax: 'Max km',
}

function formatLabel(value) {
  if (!value) return ''
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function initialFilters(name, searchParams) {
  const next = { ...EMPTY_FILTERS }
  const route = formatLabel(name)
  const makeQ = searchParams.get('make') || ''
  const cityQ = searchParams.get('city') || ''
  const q = searchParams.get('q') || ''

  if (route) {
    const lower = route.toLowerCase()
    const makeMatch = FILTER_OPTIONS.makes.find((m) => m.toLowerCase() === lower)
    const bodyMatch = FILTER_OPTIONS.bodies.find((b) => b.toLowerCase() === lower)
    if (makeMatch) next.make = makeMatch
    else if (bodyMatch) next.body = bodyMatch
  }
  if (makeQ) next.make = makeQ
  if (cityQ) next.city = cityQ
  if (q) next.q = q
  return next
}

function countActive(filters) {
  return Object.entries(filters).filter(([, v]) => String(v).trim() !== '').length
}

function chipValue(key, value) {
  if (key === 'priceMin' || key === 'priceMax') {
    const n = Number(value)
    return Number.isFinite(n) && n > 0 ? formatPrice(n) : value
  }
  if (key === 'mileageMax') {
    const n = Number(value)
    return Number.isFinite(n) && n > 0 ? formatMileage(n) : value
  }
  return value
}

function UsedCar() {
  const { name } = useParams()
  const [searchParams] = useSearchParams()
  const reduceMotion = useReducedMotion()
  const { publishedCars } = useDataStore()
  const [draftFilters, setDraftFilters] = useState(() => initialFilters(name, searchParams))
  const [appliedFilters, setAppliedFilters] = useState(() => initialFilters(name, searchParams))
  const [sort, setSort] = useState('newest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const routeKey = `${name ?? ''}?${searchParams.toString()}`
  useEffect(() => {
    const next = initialFilters(name, searchParams)
    setDraftFilters(next)
    setAppliedFilters(next)
  }, [routeKey, name, searchParams])

  const results = useMemo(() => {
    let list = publishedCars.filter((car) => {
      if (appliedFilters.make && car.make !== appliedFilters.make) return false
      if (appliedFilters.body && car.body !== appliedFilters.body) return false
      if (appliedFilters.city && car.city !== appliedFilters.city) return false
      if (appliedFilters.transmission && car.transmission !== appliedFilters.transmission)
        return false
      if (appliedFilters.fuel && car.fuel !== appliedFilters.fuel) return false
      if (appliedFilters.color && car.color !== appliedFilters.color) return false
      if (appliedFilters.condition && car.condition !== appliedFilters.condition) return false
      if (appliedFilters.assembly && car.assembly !== appliedFilters.assembly) return false
      if (appliedFilters.registered && car.registered !== appliedFilters.registered) return false
      if (appliedFilters.yearMin && car.year < Number(appliedFilters.yearMin)) return false
      if (appliedFilters.yearMax && car.year > Number(appliedFilters.yearMax)) return false
      if (appliedFilters.priceMin && car.price < Number(appliedFilters.priceMin)) return false
      if (appliedFilters.priceMax && car.price > Number(appliedFilters.priceMax)) return false
      if (appliedFilters.mileageMax && car.mileage > Number(appliedFilters.mileageMax))
        return false
      if (appliedFilters.q) {
        const hay = `${car.title} ${car.make} ${car.model} ${car.city}`.toLowerCase()
        if (!hay.includes(appliedFilters.q.toLowerCase().trim())) return false
      }
      return true
    })

    list = [...list]
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'mileage') list.sort((a, b) => a.mileage - b.mileage)
    else list.sort((a, b) => b.year - a.year)

    return list
  }, [appliedFilters, sort, publishedCars])

  function updateFilter(key, value) {
    setDraftFilters((prev) => ({ ...prev, [key]: value }))
  }

  function applyFilters() {
    setAppliedFilters({ ...draftFilters })
    setMobileFiltersOpen(false)
  }

  function clearFilters() {
    const empty = { ...EMPTY_FILTERS }
    setDraftFilters(empty)
    setAppliedFilters(empty)
  }

  function removeApplied(key) {
    const next = { ...appliedFilters, [key]: '' }
    setAppliedFilters(next)
    setDraftFilters((prev) => ({ ...prev, [key]: '' }))
  }

  function setSearchQuery(value) {
    setDraftFilters((prev) => ({ ...prev, q: value }))
    setAppliedFilters((prev) => ({ ...prev, q: value }))
  }

  const activeCount = countActive(appliedFilters)
  const draftCount = countActive(draftFilters)
  const activeChips = Object.entries(appliedFilters).filter(([, v]) => String(v).trim() !== '')

  const headingContext =
    appliedFilters.make ||
    appliedFilters.body ||
    appliedFilters.city ||
    (name ? formatLabel(name) : '')

  return (
    <main className="px-6 pt-35 pb-16 max-[860px]:px-4 max-[860px]:pt-32.5">
      <div className="mx-auto max-w-310">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <nav
              aria-label="Breadcrumb"
              className="mb-1.5 flex flex-wrap items-center gap-2 text-[12.5px] text-muted-text"
            >
              <Link to="/" className="no-underline transition hover:text-primary">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-ink">Used cars</span>
            </nav>
            <h1 className="m-0 text-[clamp(1.5rem,2.8vw,2rem)] font-extrabold tracking-[-0.02em] text-ink">
              {headingContext ? `${headingContext} used cars` : 'Browse used cars'}
            </h1>
            <p className="mt-1.5 mb-0 text-[13px] font-semibold text-muted-text">
              {results.length} result{results.length === 1 ? '' : 's'}
              {activeCount > 0 ? ` · ${activeCount} filter${activeCount === 1 ? '' : 's'}` : ''}
            </p>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-2.5 min-[700px]:flex-nowrap">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((v) => !v)}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border-soft bg-surface px-3 py-2 text-sm font-bold text-ink shadow-soft transition hover:border-primary/40 min-[961px]:hidden"
          >
            <SlidersHorizontal size={15} aria-hidden="true" />
            Filters
            {activeCount > 0 ? (
              <span className="grid h-5 min-w-5 place-items-center rounded-md bg-primary px-1.5 text-[11px] font-extrabold text-ink">
                {activeCount}
              </span>
            ) : null}
          </button>

          <div className="relative min-w-0 flex-1 basis-full min-[700px]:basis-auto">
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-text"
              aria-hidden="true"
            />
            <input
              type="search"
              value={appliedFilters.q}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search make, model, city…"
              aria-label="Search used cars"
              className="w-full rounded-xl border border-border-soft bg-surface py-2.5 pr-3.5 pl-10 text-[13.5px] font-semibold text-ink shadow-soft outline-none transition placeholder:font-medium placeholder:text-muted-text/75 focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          </div>

          <label className="flex shrink-0 items-center gap-2 text-[13px] font-semibold text-muted-text">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="cursor-pointer rounded-xl border border-border-soft bg-surface px-3 py-2.5 text-sm font-bold text-ink shadow-soft outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
            >
              <option value="newest">Newest year</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="mileage">Lowest mileage</option>
            </select>
          </label>
        </div>

        {activeChips.length > 0 ? (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {activeChips.map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => removeApplied(key)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 py-1 pr-1.5 pl-2.5 text-[12px] font-semibold text-ink transition hover:bg-primary/20"
              >
                <span className="text-muted-text">{FILTER_LABELS[key] || key}:</span>
                <span>{chipValue(key, value)}</span>
                <span className="grid size-5 place-items-center rounded-md text-muted-text hover:bg-ink/5 hover:text-ink">
                  <X size={12} aria-hidden="true" />
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={clearFilters}
              className="cursor-pointer text-[12px] font-bold text-primary transition hover:text-primary-hover"
            >
              Clear all
            </button>
          </div>
        ) : null}

        <div className="grid items-start gap-5 min-[961px]:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="hidden min-[961px]:sticky min-[961px]:top-28 min-[961px]:block min-[961px]:self-start">
            <FilterPanel
              draftFilters={draftFilters}
              draftCount={draftCount}
              activeCount={activeCount}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
              applyFilters={applyFilters}
            />
          </aside>

          <section>
            {results.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border-soft bg-surface px-6 py-14 text-center shadow-soft">
                <span className="mx-auto grid size-12 place-items-center rounded-xl bg-primary/15 text-ink">
                  <SlidersHorizontal size={20} aria-hidden="true" />
                </span>
                <h2 className="m-0 mt-4 text-lg font-extrabold text-ink">No cars match</h2>
                <p className="mx-auto mt-2 mb-0 max-w-sm text-[14px] leading-relaxed text-muted-text">
                  Try clearing some filters or broadening year, price, or city.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 inline-flex cursor-pointer rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-primary-hover"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 gap-3 min-[1100px]:grid-cols-2"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: reduceMotion ? 0 : 0.04 } },
                }}
              >
                {results.map((car) => (
                  <CarCard key={car.id} car={car} reduceMotion={reduceMotion} />
                ))}
              </motion.div>
            )}
          </section>
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen ? (
          <div
            className="fixed inset-0 z-50 min-[961px]:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
          >
            <motion.button
              type="button"
              aria-label="Close filters"
              onClick={() => setMobileFiltersOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 cursor-pointer border-0 bg-ink/45"
            />
            <motion.div
              initial={reduceMotion ? false : { y: '100%' }}
              animate={{ y: 0 }}
              exit={reduceMotion ? undefined : { y: '100%' }}
              transition={{ duration: 0.35, ease }}
              className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-hidden rounded-t-2xl border border-border-soft bg-surface shadow-nav"
            >
              <div className="flex items-center justify-between border-b border-border-soft px-4 py-3">
                <h2 className="m-0 text-[15px] font-extrabold text-ink">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  aria-label="Close"
                  className="grid size-9 cursor-pointer place-items-center rounded-lg text-muted-text transition hover:bg-bg hover:text-ink"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="custom-scrollbar max-h-[calc(88vh-3.5rem)] overflow-y-auto">
                <FilterPanel
                  draftFilters={draftFilters}
                  draftCount={draftCount}
                  activeCount={activeCount}
                  updateFilter={updateFilter}
                  clearFilters={clearFilters}
                  applyFilters={applyFilters}
                  embedded
                />
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </main>
  )
}

function CarCard({ car, reduceMotion }) {
  const detailTo = `/used-car/ad/${car.id}`
  const phone = car.phone || ''
  const waDigits = toWhatsappDigits(car.whatsapp || car.phone)
  const blurb = car.description
    ? `${String(car.description).slice(0, 96)}${car.description.length > 96 ? '…' : ''}`
    : null

  const specs = [
    { icon: Calendar, label: String(car.year) },
    { icon: Gauge, label: formatMileage(car.mileage) },
    { icon: Settings2, label: car.transmission },
    { icon: Fuel, label: car.fuel },
    { icon: Factory, label: car.assembly },
  ]

  return (
    <motion.article
      variants={{
        hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.3, ease },
        },
      }}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border-soft bg-surface shadow-soft transition hover:border-primary/40 hover:shadow-[0_12px_28px_rgba(28,36,48,0.1)]"
    >
      <Link to={detailTo} className="relative block aspect-video overflow-hidden bg-ink/5 no-underline">
        <img
          src={car.image}
          alt={car.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-ink/40 to-transparent" />
        {car.refId ? (
          <span className="absolute bottom-2 left-2 rounded-md bg-ink/80 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white backdrop-blur-sm">
            {car.refId}
          </span>
        ) : null}
        {car.condition ? (
          <span className="absolute top-2 right-2 rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold text-ink">
            {car.condition}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={detailTo} className="no-underline">
              <h3 className="m-0 line-clamp-2 text-[14px] leading-snug font-extrabold text-ink transition group-hover:text-ink">
                {car.year} {car.title}
              </h3>
            </Link>
            <p className="mt-1 mb-0 flex items-center gap-1 text-[11.5px] font-medium text-muted-text">
              <MapPin size={12} className="shrink-0 text-primary" aria-hidden="true" />
              <span className="truncate">
                {car.city}
                {car.registered ? `, Reg. ${car.registered}` : ''}
              </span>
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="m-0 text-[15px] font-extrabold tracking-[-0.02em] text-primary">
              {formatPrice(car.price)}
            </p>
            {car.negotiable ? (
              <p className="m-0 mt-0.5 text-[10px] font-bold tracking-wide text-muted-text uppercase">
                Negotiable
              </p>
            ) : null}
          </div>
        </div>

        <ul className="mt-2.5 mb-0 flex list-none flex-wrap gap-1.5 p-0">
          {specs.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-1 rounded-md border border-border-soft bg-bg px-1.5 py-1 text-[11px] font-semibold text-ink"
            >
              <Icon size={11} className="text-primary" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>

        {blurb ? (
          <p className="mt-2 mb-0 line-clamp-2 text-[12px] leading-relaxed text-muted-text">
            {blurb}
          </p>
        ) : null}

        <div className="mt-auto grid grid-cols-3 gap-1.5 pt-3">
          <a
            href={phone ? `tel:${phone}` : undefined}
            onClick={(e) => {
              if (!phone) e.preventDefault()
            }}
            className="inline-flex items-center justify-center gap-1 rounded-lg bg-primary px-2 py-2 text-[11px] font-extrabold text-ink no-underline transition hover:bg-primary-hover"
          >
            <Phone size={12} aria-hidden="true" />
            Call
          </a>
          <a
            href={waDigits ? `https://wa.me/${waDigits}` : undefined}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              if (!waDigits) e.preventDefault()
            }}
            className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-600 px-2 py-2 text-[11px] font-extrabold text-white no-underline transition hover:bg-emerald-700"
          >
            <MessageCircle size={12} aria-hidden="true" />
            WhatsApp
          </a>
          <Link
            to={detailTo}
            className="inline-flex items-center justify-center gap-1 rounded-lg border border-primary/45 bg-surface px-2 py-2 text-[11px] font-extrabold text-ink no-underline transition hover:border-primary hover:bg-primary/10"
          >
            Details
            <ArrowRight size={12} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-border-soft pt-2 text-[10px] font-semibold text-muted-text">
          <span className="truncate">{car.published ? `Posted ${car.published}` : car.make}</span>
          <span className="shrink-0">{car.seller?.type || 'Seller'}</span>
        </div>
      </div>
    </motion.article>
  )
}

function FilterPanel({
  draftFilters,
  draftCount,
  activeCount,
  updateFilter,
  clearFilters,
  applyFilters,
  embedded = false,
}) {
  return (
    <div
      className={
        embedded
          ? ''
          : 'overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-soft'
      }
    >
      {!embedded ? (
        <div className="flex items-center justify-between border-b border-border-soft px-4 py-3.5">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary/15 text-ink">
              <SlidersHorizontal size={15} aria-hidden="true" />
            </span>
            <h2 className="m-0 text-[14px] font-extrabold text-ink">Filters</h2>
          </div>
          {draftCount > 0 || activeCount > 0 ? (
            <button
              type="button"
              onClick={clearFilters}
              className="cursor-pointer text-[12px] font-bold text-primary transition hover:text-primary-hover"
            >
              Clear all
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-4 p-4">
        <FilterSelect
          label="Make"
          value={draftFilters.make}
          onChange={(v) => updateFilter('make', v)}
          options={FILTER_OPTIONS.makes}
        />
        <FilterSelect
          label="Body type"
          value={draftFilters.body}
          onChange={(v) => updateFilter('body', v)}
          options={FILTER_OPTIONS.bodies}
        />
        <FilterSelect
          label="City"
          value={draftFilters.city}
          onChange={(v) => updateFilter('city', v)}
          options={FILTER_OPTIONS.cities}
        />

        <div className="grid grid-cols-2 gap-2">
          <FilterField label="Year min">
            <input
              type="number"
              min="2005"
              max="2026"
              value={draftFilters.yearMin}
              onChange={(e) => updateFilter('yearMin', e.target.value)}
              placeholder="2015"
              className={inputClass}
            />
          </FilterField>
          <FilterField label="Year max">
            <input
              type="number"
              min="2005"
              max="2026"
              value={draftFilters.yearMax}
              onChange={(e) => updateFilter('yearMax', e.target.value)}
              placeholder="2024"
              className={inputClass}
            />
          </FilterField>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <FilterField label="Price min">
            <input
              type="number"
              value={draftFilters.priceMin}
              onChange={(e) => updateFilter('priceMin', e.target.value)}
              placeholder="2000000"
              className={inputClass}
            />
          </FilterField>
          <FilterField label="Price max">
            <input
              type="number"
              value={draftFilters.priceMax}
              onChange={(e) => updateFilter('priceMax', e.target.value)}
              placeholder="8000000"
              className={inputClass}
            />
          </FilterField>
        </div>

        <FilterField label="Max mileage (km)">
          <input
            type="number"
            value={draftFilters.mileageMax}
            onChange={(e) => updateFilter('mileageMax', e.target.value)}
            placeholder="80000"
            className={inputClass}
          />
        </FilterField>

        <FilterSelect
          label="Transmission"
          value={draftFilters.transmission}
          onChange={(v) => updateFilter('transmission', v)}
          options={FILTER_OPTIONS.transmissions}
        />
        <FilterSelect
          label="Fuel type"
          value={draftFilters.fuel}
          onChange={(v) => updateFilter('fuel', v)}
          options={FILTER_OPTIONS.fuels}
        />
        <FilterSelect
          label="Color"
          value={draftFilters.color}
          onChange={(v) => updateFilter('color', v)}
          options={FILTER_OPTIONS.colors}
        />
        <FilterSelect
          label="Condition"
          value={draftFilters.condition}
          onChange={(v) => updateFilter('condition', v)}
          options={FILTER_OPTIONS.conditions}
        />
        <FilterSelect
          label="Assembly"
          value={draftFilters.assembly}
          onChange={(v) => updateFilter('assembly', v)}
          options={FILTER_OPTIONS.assemblies}
        />
        <FilterSelect
          label="Registered in"
          value={draftFilters.registered}
          onChange={(v) => updateFilter('registered', v)}
          options={FILTER_OPTIONS.registered}
        />
      </div>

      <div className="sticky bottom-0 border-t border-border-soft bg-surface p-4">
        <button
          type="button"
          onClick={applyFilters}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-extrabold text-ink shadow-cta transition hover:bg-primary-hover"
        >
          Apply filters
          {draftCount > 0 ? (
            <span className="grid h-5 min-w-5 place-items-center rounded-md bg-ink/15 px-1.5 text-[11px]">
              {draftCount}
            </span>
          ) : null}
        </button>
      </div>
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-border-soft bg-bg px-3 py-2 text-[13px] font-semibold text-ink outline-none transition placeholder:font-medium placeholder:text-muted-text/80 focus:border-primary focus:ring-4 focus:ring-primary/12'

function FilterField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold tracking-[0.08em] text-muted-text uppercase">
        {label}
      </span>
      {children}
    </label>
  )
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <FilterField label={label}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        <option value="">Any</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </FilterField>
  )
}

export default UsedCar
