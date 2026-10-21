import { Link, useParams, useSearchParams } from 'react-router-dom'

function formatLabel(value) {
  if (!value) return ''
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function UsedCar() {
  const { name } = useParams()
  const [searchParams] = useSearchParams()
  const make = searchParams.get('make')
  const city = searchParams.get('city')
  const q = searchParams.get('q')

  const focus = name ? formatLabel(name) : make || null

  return (
    <main className="px-6 pt-[140px] pb-16 max-[860px]:px-4 max-[860px]:pt-[130px]">
      <div className="mx-auto max-w-[1240px]">
        <p className="mb-2 text-xs font-bold tracking-[0.14em] text-primary uppercase">
          Used cars
        </p>
        <h1 className="m-0 text-[clamp(1.75rem,3vw,2.4rem)] font-extrabold tracking-[-0.02em] text-ink">
          {focus ? `${focus} cars` : 'Browse used cars'}
        </h1>
        <p className="mt-3 mb-8 max-w-2xl text-[15px] leading-relaxed text-muted-text">
          {focus
            ? `Showing the ${focus} path on Bilal Motors. Listings will appear here as inventory is connected.`
            : 'Search and filter used cars by make, city, and keyword. Listings will appear here as inventory is connected.'}
        </p>

        {(city || q) && (
          <div className="mb-6 flex flex-wrap gap-2">
            {city ? (
              <span className="rounded-full bg-primary/15 px-3 py-1 text-[12px] font-semibold text-ink">
                City: {city}
              </span>
            ) : null}
            {q ? (
              <span className="rounded-full bg-primary/15 px-3 py-1 text-[12px] font-semibold text-ink">
                Search: {q}
              </span>
            ) : null}
          </div>
        )}

        <div className="rounded-2xl border border-border-soft bg-surface p-8 shadow-soft">
          <p className="m-0 text-[14px] text-muted-text">
            No live inventory wired yet. Use browse filters on the homepage, or continue exploring.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex rounded-lg border border-border-soft bg-bg px-4 py-2.5 text-sm font-bold text-ink no-underline transition hover:border-primary/40"
            >
              Back to home
            </Link>
            <Link
              to="/videos"
              className="inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-ink no-underline transition hover:bg-primary-hover"
            >
              Watch videos
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default UsedCar
