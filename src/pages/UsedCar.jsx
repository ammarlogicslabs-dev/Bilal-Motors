import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { CARS, FILTER_OPTIONS, formatMileage, formatPrice } from '../data/cars'

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

function UsedCar() {
  const { name } = useParams()
  const [searchParams] = useSearchParams()
  const reduceMotion = useReducedMotion()
  const [draftFilters, setDraftFilters] = useState(() => initialFilters(name, searchParams))
  const [appliedFilters, setAppliedFilters] = useState(() => initialFilters(name, searchParams))
  const [sort, setSort] = useState('newest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Mega menu / browse links change the URL while this page stays mounted — resync filters.
  const routeKey = `${name ?? ''}?${searchParams.toString()}`
  useEffect(() => {
    const next = initialFilters(name, searchParams)
    setDraftFilters(next)
    setAppliedFilters(next)
  }, [routeKey, name, searchParams])

  const results = useMemo(() => {
    let list = CARS.filter((car) => {
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
  }, [appliedFilters, sort])

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

  const activeCount = countActive(appliedFilters)
  const draftCount = countActive(draftFilters)

  return (
    <main className="px-6 pt-35 pb-16 max-[860px]:px-4 max-[860px]:pt-32.5">
      <div className="mx-auto max-w-310">
        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-[12.5px] text-muted-text">
          <Link to="/" className="no-underline transition hover:text-primary">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-ink">Used cars</span>
        </nav>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold tracking-[0.14em] text-primary uppercase">
              Marketplace
            </p>
            <h1 className="m-0 text-[clamp(1.75rem,3vw,2.4rem)] font-extrabold tracking-[-0.02em] text-ink">
              Browse used cars
            </h1>
            <p className="mt-2 mb-0 text-[15px] text-muted-text">
              {results.length} car{results.length === 1 ? '' : 's'} found
              {activeCount > 0 ? ` · ${activeCount} filter${activeCount === 1 ? '' : 's'} active` : ''}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl border border-border-soft bg-surface px-4 py-2.5 text-sm font-bold text-ink min-[961px]:hidden"
            >
              Filters
              {activeCount > 0 ? (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] text-ink">
                  {activeCount}
                </span>
              ) : null}
            </button>

            <label className="flex items-center gap-2 text-[13px] font-semibold text-muted-text">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border border-border-soft bg-surface px-3 py-2.5 text-sm font-bold text-ink outline-none"
              >
                <option value="newest">Newest year</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="mileage">Lowest mileage</option>
              </select>
            </label>
          </div>
        </div>

        <div className="grid items-start gap-5 min-[961px]:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sidebar filters */}
          <aside
            className={`${
              mobileFiltersOpen ? 'block' : 'hidden'
            } min-[961px]:sticky min-[961px]:top-28 min-[961px]:self-start min-[961px]:block`}
          >
            <div className="rounded-2xl border border-border-soft bg-surface shadow-soft">
              <div className="flex items-center justify-between border-b border-border-soft px-4 py-3">
                <h2 className="m-0 text-[14px] font-extrabold text-ink">Filters</h2>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[12px] font-bold text-primary transition hover:text-primary-hover"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-4 p-4">
                <FilterField label="Keyword">
                  <input
                    type="search"
                    value={draftFilters.q}
                    onChange={(e) => updateFilter('q', e.target.value)}
                    placeholder="Make, model…"
                    className="w-full rounded-lg border border-border-soft bg-bg px-3 py-2 text-[13px] font-semibold text-ink outline-none focus:border-primary/50"
                  />
                </FilterField>

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
                      className="w-full rounded-lg border border-border-soft bg-bg px-2.5 py-2 text-[13px] font-semibold text-ink outline-none"
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
                      className="w-full rounded-lg border border-border-soft bg-bg px-2.5 py-2 text-[13px] font-semibold text-ink outline-none"
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
                      className="w-full rounded-lg border border-border-soft bg-bg px-2.5 py-2 text-[13px] font-semibold text-ink outline-none"
                    />
                  </FilterField>
                  <FilterField label="Price max">
                    <input
                      type="number"
                      value={draftFilters.priceMax}
                      onChange={(e) => updateFilter('priceMax', e.target.value)}
                      placeholder="8000000"
                      className="w-full rounded-lg border border-border-soft bg-bg px-2.5 py-2 text-[13px] font-semibold text-ink outline-none"
                    />
                  </FilterField>
                </div>

                <FilterField label="Max mileage (km)">
                  <input
                    type="number"
                    value={draftFilters.mileageMax}
                    onChange={(e) => updateFilter('mileageMax', e.target.value)}
                    placeholder="80000"
                    className="w-full rounded-lg border border-border-soft bg-bg px-3 py-2 text-[13px] font-semibold text-ink outline-none"
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

              <div className="border-t border-border-soft p-4">
                <button
                  type="button"
                  onClick={applyFilters}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-extrabold text-ink transition hover:bg-primary-hover"
                >
                  Apply filters
                  {draftCount > 0 ? (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ink/15 px-1.5 text-[11px]">
                      {draftCount}
                    </span>
                  ) : null}
                </button>
              </div>
            </div>
          </aside>

          {/* Results */}
          <section>
            {results.length === 0 ? (
              <div className="rounded-2xl border border-border-soft bg-surface p-8 text-center shadow-soft">
                <h2 className="m-0 text-lg font-extrabold text-ink">No cars match</h2>
                <p className="mt-2 mb-0 text-[14px] text-muted-text">
                  Try clearing some filters to see more listings.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-ink"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-2 gap-4 max-[700px]:grid-cols-1"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: reduceMotion ? 0 : 0.05 } },
                }}
              >
                {results.map((car) => (
                  <motion.article
                    key={car.id}
                    variants={{
                      hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.35, ease },
                      },
                    }}
                    className="group overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-soft transition hover:border-primary/40 hover:shadow-[0_14px_34px_rgba(28,36,48,0.1)]"
                  >
                    <Link to={`/used-car/ad/${car.id}`} className="block no-underline text-inherit">
                    <div className="relative aspect-16/10 overflow-hidden bg-ink/5">
                      <img
                        src={car.image}
                        alt={car.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                      <span className="absolute top-3 left-3 rounded-full bg-ink/75 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                        {car.year}
                      </span>
                      <span className="absolute top-3 right-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-ink">
                        {car.condition}
                      </span>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="m-0 text-[11px] font-bold tracking-widest text-primary uppercase">
                            {car.make} · {car.body}
                          </p>
                          <h3 className="mt-1 mb-0 truncate text-[15px] font-extrabold text-ink">
                            {car.title}
                          </h3>
                        </div>
                      </div>

                      <p className="mt-2 mb-0 text-[1.05rem] font-extrabold tracking-[-0.02em] text-ink">
                        {formatPrice(car.price)}
                      </p>

                      <ul className="mt-3 mb-0 grid list-none grid-cols-2 gap-x-2 gap-y-1.5 p-0 text-[12px] text-muted-text">
                        <li>{formatMileage(car.mileage)}</li>
                        <li>{car.city}</li>
                        <li>{car.transmission}</li>
                        <li>{car.fuel}</li>
                        <li>{car.color}</li>
                        <li>{car.assembly}</li>
                      </ul>

                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border-soft pt-3">
                        <span className="text-[11px] font-semibold text-muted-text">
                          Reg: {car.registered}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[13px] font-bold text-primary transition group-hover:text-primary-hover">
                          View details
                          <span aria-hidden="true">→</span>
                        </span>
                      </div>
                    </div>
                    </Link>
                  </motion.article>
                ))}
              </motion.div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

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
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border-soft bg-bg px-3 py-2 text-[13px] font-semibold text-ink outline-none focus:border-primary/50"
      >
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
