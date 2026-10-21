import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { formatMileage, formatPrice, getCarById } from '../data/cars'

const ease = [0.22, 1, 0.36, 1]

function CarDetail() {
  const { id } = useParams()
  const car = getCarById(id)
  const reduceMotion = useReducedMotion()
  const [activeImage, setActiveImage] = useState(0)
  const [tab, setTab] = useState('details')
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const images = useMemo(() => car?.images?.length ? car.images : car ? [car.image] : [], [car])

  if (!car) {
    return (
      <main className="px-6 pt-35 pb-16 max-[860px]:px-4">
        <div className="mx-auto max-w-160 rounded-2xl border border-border-soft bg-surface p-8 text-center shadow-soft">
          <h1 className="m-0 text-2xl font-extrabold text-ink">Car not found</h1>
          <p className="mt-2 text-muted-text">This listing may have been removed or moved.</p>
          <Link
            to="/used-car"
            className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-bold text-ink no-underline transition hover:bg-primary-hover"
          >
            Back to used cars
          </Link>
        </div>
      </main>
    )
  }

  function prevImage() {
    setActiveImage((i) => (i === 0 ? images.length - 1 : i - 1))
  }

  function nextImage() {
    setActiveImage((i) => (i === images.length - 1 ? 0 : i + 1))
  }

  async function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    try {
      if (navigator.share) {
        await navigator.share({ title: car.title, text: `${car.year} ${car.title}`, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignored
    }
  }

  const detailRows = [
    ['Registered In', car.registered],
    ['Assembly', car.assembly],
    ['Body Type', car.body],
    ['Ad Ref ID', car.refId],
    ['Drive Type', car.driveType],
    ['Make', car.make],
    ['Color', car.color],
    ['Engine Capacity', car.engineCapacity],
    ['Last Updated', car.updated],
    ['Mileage', formatMileage(car.mileage)],
    ['Seating Capacity', car.seating],
    ['Model / Version', car.version],
  ]

  return (
    <main className="px-6 pt-35 pb-16 max-[860px]:px-4 max-[860px]:pt-32.5">
      <div className="mx-auto max-w-310">
        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-[12.5px] text-muted-text">
          <Link to="/" className="no-underline transition hover:text-primary">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/used-car" className="no-underline transition hover:text-primary">Used cars</Link>
          <span aria-hidden="true">/</span>
          <span className="max-w-[16rem] truncate font-semibold text-ink">{car.title}</span>
        </nav>

        {/* Header */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="mb-6 flex flex-wrap items-start justify-between gap-4"
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold tracking-[0.14em] text-primary uppercase">
                Used car for sale
              </span>
              <span className="text-[12px] font-semibold text-muted-text">Ref #{car.refId}</span>
            </div>
            <h1 className="mt-2 mb-0 text-[clamp(1.6rem,3vw,2.35rem)] font-extrabold tracking-[-0.03em] text-ink">
              {car.year} {car.title}
            </h1>
            <p className="mt-2 mb-0 inline-flex items-center gap-1.5 text-[14px] font-medium text-muted-text">
              <PinIcon />
              {car.city}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSaved((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-bold transition ${
                saved
                  ? 'border-primary bg-primary/15 text-ink'
                  : 'border-border-soft bg-surface text-ink hover:border-primary/40'
              }`}
            >
              <HeartIcon filled={saved} />
              {saved ? 'Saved' : 'Favorite'}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-xl border border-border-soft bg-surface px-3.5 py-2.5 text-sm font-bold text-ink transition hover:border-primary/40"
            >
              <ShareIcon />
              <span aria-live="polite">{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </motion.div>

        <div className="grid items-start gap-5 min-[1100px]:grid-cols-[minmax(0,1fr)_340px]">
          {/* Main column */}
          <div className="min-w-0 space-y-5">
            {/* Gallery */}
            <section className="overflow-hidden rounded-2xl border border-border-soft bg-surface p-3 shadow-soft max-[860px]:p-2">
              <div className="grid gap-3 min-[760px]:grid-cols-[1.45fr_0.7fr]">
                <div className="relative overflow-hidden rounded-xl bg-ink/5">
                  <img
                    src={images[activeImage]}
                    alt={car.title}
                    className="aspect-video w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute top-1/2 left-3 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-ink/70 text-white transition hover:bg-ink"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute top-1/2 right-3 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-ink/70 text-white transition hover:bg-ink"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 max-[759px]:grid-cols-6 min-[760px]:grid-cols-2">
                  {images.slice(0, 6).map((src, index) => (
                    <button
                      key={`${src}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`overflow-hidden rounded-lg border-2 transition ${
                        activeImage === index
                          ? 'border-primary'
                          : 'border-transparent hover:border-primary/40'
                      }`}
                    >
                      <img src={src} alt="" className="aspect-4/3 w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Quick stats */}
            <section className="grid grid-cols-5 gap-2 max-[700px]:grid-cols-3 max-[420px]:grid-cols-2">
              {[
                ['Year', String(car.year)],
                ['Mileage', formatMileage(car.mileage)],
                ['Transmission', car.transmission],
                ['Fuel', car.fuel],
                ['Assembly', car.assembly],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-border-soft bg-surface px-3 py-3 text-center shadow-soft"
                >
                  <p className="m-0 text-[10px] font-bold tracking-[0.08em] text-muted-text uppercase">
                    {label}
                  </p>
                  <p className="mt-1 mb-0 text-[13px] font-extrabold text-ink">{value}</p>
                </div>
              ))}
            </section>

            {/* Tabs */}
            <section className="overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-soft">
              <div className="flex flex-wrap gap-1 border-b border-border-soft p-2">
                {[
                  ['details', 'Car Details'],
                  ['description', 'Description'],
                  ['features', 'Car Features'],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key)}
                    className={`rounded-lg px-4 py-2.5 text-[13px] font-bold transition ${
                      tab === key
                        ? 'bg-ink text-white'
                        : 'bg-transparent text-nav-text hover:bg-bg hover:text-ink'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="p-5 max-[860px]:p-4">
                {tab === 'details' && (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 max-[560px]:grid-cols-1">
                    {detailRows.map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-3 border-b border-border-soft py-2.5"
                      >
                        <span className="text-[13px] text-muted-text">{label}</span>
                        <strong className="text-right text-[13.5px] font-bold text-ink">
                          {value}
                        </strong>
                      </div>
                    ))}
                  </div>
                )}

                {tab === 'description' && (
                  <p className="m-0 text-[15px] leading-relaxed text-ink/85">{car.description}</p>
                )}

                {tab === 'features' && (
                  <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 max-[560px]:grid-cols-1">
                    {car.features.map((feature) => (
                      <li
                        key={feature}
                        className="inline-flex items-center gap-2 rounded-lg border border-border-soft bg-bg px-3 py-2.5 text-[13px] font-semibold text-ink"
                      >
                        <span className="text-primary">●</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 min-[1100px]:sticky min-[1100px]:top-28">
            <div className="overflow-hidden rounded-2xl border border-border-soft bg-surface p-5 shadow-soft">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold tracking-wide text-ink uppercase">
                  Active listing
                </span>
                {car.negotiable ? (
                  <span className="rounded-full bg-ink/5 px-2.5 py-1 text-[10px] font-bold tracking-wide text-muted-text uppercase">
                    Negotiable
                  </span>
                ) : null}
              </div>
              <p className="mt-3 mb-0 text-[clamp(1.5rem,2.5vw,1.85rem)] font-extrabold tracking-[-0.03em] text-ink">
                {formatPrice(car.price)}
              </p>

              <a
                href={`tel:${car.phone}`}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-ink no-underline transition hover:bg-primary-hover"
              >
                <PhoneIcon />
                Call Seller
              </a>
              <a
                href={`https://wa.me/${car.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border-soft bg-bg px-4 py-3.5 text-sm font-bold text-ink no-underline transition hover:border-primary/40"
              >
                <WhatsAppIcon />
                WhatsApp Seller
              </a>
            </div>

            <div className="rounded-2xl border border-border-soft bg-surface p-5 shadow-soft">
              <h3 className="m-0 text-[11px] font-bold tracking-[0.12em] text-muted-text uppercase">
                Seller information
              </h3>
              <p className="mt-3 mb-0 text-[16px] font-extrabold text-ink">{car.seller.name}</p>
              <p className="mt-1 mb-0 text-[13px] text-muted-text">
                {car.seller.type} · {car.city}
              </p>
              <p className="mt-1 mb-0 text-[12px] text-muted-text">{car.seller.memberSince}</p>
            </div>

            <div className="rounded-2xl border border-border-soft bg-surface p-5 shadow-soft">
              <h3 className="m-0 text-[11px] font-bold tracking-[0.12em] text-muted-text uppercase">
                Safety tips
              </h3>
              <ul className="mt-3 mb-0 list-none space-y-2 p-0 text-[13px] leading-relaxed text-muted-text">
                <li>• Meet in a safe public place</li>
                <li>• Verify documents before payment</li>
                <li>• Prefer a test drive and inspection</li>
                <li>• Never share OTPs or advance fees blindly</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border-soft bg-surface p-5 shadow-soft">
              <h3 className="m-0 text-[11px] font-bold tracking-[0.12em] text-muted-text uppercase">
                Listing overview
              </h3>
              <dl className="mt-3 mb-0 space-y-2.5">
                {[
                  ['Reference ID', car.refId],
                  ['Views', String(car.views)],
                  ['Published', car.published],
                  ['Location', car.city],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3 text-[13px]">
                    <dt className="text-muted-text">{label}</dt>
                    <dd className="m-0 font-bold text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function HeartIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} aria-hidden="true">
      <path
        d="M12 20s-7-4.4-7-10a4.5 4.5 0 0 1 8-2.7A4.5 4.5 0 0 1 21 10c0 5.6-7 10-7 10z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.6 10.5l6.8-4M8.6 13.5l6.8 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.6 10.8c1.7 3.3 3.3 4.9 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.8 21 3 13.2 3 3.5 3 2.9 3.4 2.5 4 2.5h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3zm4.8 12.9c-.2.6-1.2 1.1-1.9 1.2-.5.1-1.1.1-1.8-.1-1.7-.5-3.7-1.9-5-3.7-1-1.4-1.5-2.8-1.6-3.4-.1-.6.2-1.3.6-1.6.2-.2.5-.3.8-.3h.6c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4-.1.6l-.4.6c-.1.2-.2.4 0 .6.5.8 1.3 1.7 2.1 2.2.2.1.4.1.6 0l.7-.4c.2-.1.4-.1.6 0l1.8.9c.2.1.4.3.3.6z" />
    </svg>
  )
}

export default CarDetail
