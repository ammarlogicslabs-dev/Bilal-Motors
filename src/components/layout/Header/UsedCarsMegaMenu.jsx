import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const BUY_SELL_SERVICES = [
  {
    title: 'Find Used Cars',
    subtitle: 'Search published car listings.',
    to: '/used-car',
    icon: 'search',
  },
  {
    title: 'Featured Cars for Sale',
    subtitle: 'Browse featured listings.',
    to: '/used-car',
    icon: 'star',
  },
  {
    title: 'Sell Your Car',
    subtitle: 'Choose the right way to sell.',
    to: '/used-car',
    icon: 'tag',
  },
  {
    title: 'Sell It For Me',
    subtitle: 'Managed selling service.',
    to: '/used-car',
    icon: 'user',
  },
  {
    title: 'Car Videos',
    subtitle: 'Watch automotive videos and guides.',
    to: '/videos',
    icon: 'video',
  },
]

const BRANDS = [
  { name: 'Honda', logo: '/images/brands/Honda.webp' },
  { name: 'Hyundai', logo: '/images/brands/Hyundai.webp' },
  { name: 'KIA', logo: '/images/brands/kia.webp' },
  { name: 'Suzuki', logo: '/images/brands/suzuki.webp' },
  { name: 'Toyota', logo: '/images/brands/toyota.webp' },
  { name: 'Changan', logo: '/images/brands/changan.webp' },
  { name: 'BYD', logo: '/images/brands/byd.jpg' },
  { name: 'MG', logo: '/images/brands/mg.jpg' },
]

const CITIES = [
  'Islamabad',
  'Karachi',
  'Lahore',
  'Peshawar',
  'Rawalpindi',
  'Faisalabad',
]

function UsedCarsMegaMenu({ open, pinned, onClose }) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          {pinned ? (
            <motion.button
              key="mega-backdrop"
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 cursor-default border-0 bg-ink/15"
              aria-label="Close menu"
              onClick={onClose}
            />
          ) : null}

          <motion.div
            key="mega-panel"
            className="absolute top-full left-1/2 z-50 mt-1.5 w-[min(990px,92vw)]"
            role="dialog"
            aria-label="Used Cars menu"
            initial={{ opacity: 0, y: -10, scale: 0.98, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: -8, scale: 0.98, x: '-50%' }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="overflow-hidden rounded-xl border border-border-soft bg-white shadow-nav">
              <motion.div
                className="grid grid-cols-3 max-[900px]:grid-cols-1"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.05 } },
                }}
              >
                <motion.section
                  variants={columnVariants}
                  className="border-border-soft p-3.5 max-[900px]:border-b min-[900px]:border-r"
                >
                  <h3 className="mb-2.5 flex items-center gap-1.5 text-[12.5px] font-bold text-primary">
                    <span className="grid h-6 w-6 place-items-center rounded-md bg-primary/15 text-primary">
                      <SearchIcon />
                    </span>
                    Buy &amp; Sell Services
                  </h3>
                  <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
                    {BUY_SELL_SERVICES.map((item) => (
                      <li key={item.title}>
                        <Link
                          to={item.to}
                          onClick={onClose}
                          className="flex items-start gap-2 rounded-lg px-1.5 py-1.5 no-underline transition-colors hover:bg-primary/10"
                        >
                          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary/12 text-primary">
                            <ServiceIcon name={item.icon} />
                          </span>
                          <span className="min-w-0">
                            <strong className="block text-[12.5px] font-bold text-ink">
                              {item.title}
                            </strong>
                            <span className="mt-px block text-[11px] leading-snug text-muted-text">
                              {item.subtitle}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.section>

                <motion.section
                  variants={columnVariants}
                  className="border-border-soft p-3.5 max-[900px]:border-b min-[900px]:border-r"
                >
                  <h3 className="mb-2.5 flex items-center gap-1.5 text-[12.5px] font-bold text-primary">
                    <span className="grid h-6 w-6 place-items-center rounded-md bg-primary/15 text-primary">
                      <CarIcon />
                    </span>
                    Popular Brands
                  </h3>
                  <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
                    {BRANDS.map((brand) => (
                      <li key={brand.name}>
                        <Link
                          to={`/used-car/${brand.name.toLowerCase()}`}
                          onClick={onClose}
                          className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 no-underline transition-colors hover:bg-primary/10"
                        >
                          <img
                            src={brand.logo}
                            alt={`${brand.name} logo`}
                            className="h-7 w-7 shrink-0 rounded-full bg-white object-contain ring-1 ring-border-soft"
                            width="28"
                            height="28"
                          />
                          <strong className="text-[12.5px] font-semibold text-ink">
                            {brand.name}
                          </strong>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.section>

                <motion.section variants={columnVariants} className="p-3.5">
                  <h3 className="mb-2.5 flex items-center gap-1.5 text-[12.5px] font-bold text-primary">
                    <span className="grid h-6 w-6 place-items-center rounded-md bg-primary/15 text-primary">
                      <PinIcon />
                    </span>
                    Popular Cities
                  </h3>
                  <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
                    {CITIES.map((city) => (
                      <li key={city}>
                        <Link
                          to={`/used-car?city=${encodeURIComponent(city)}`}
                          onClick={onClose}
                          className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 no-underline transition-colors hover:bg-primary/10"
                        >
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary/12 text-primary">
                            <PinIcon />
                          </span>
                          <strong className="text-[12.5px] font-semibold text-ink">
                            {city}
                          </strong>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.section>
              </motion.div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}

const columnVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  },
}

function ServiceIcon({ name }) {
  switch (name) {
    case 'search':
      return <SearchIcon />
    case 'star':
      return <StarIcon />
    case 'tag':
      return <TagIcon />
    case 'user':
      return <UserIcon />
    case 'video':
      return <VideoIcon />
    default:
      return <SearchIcon />
  }
}

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="m12 3.5 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.8 7.2 18.4l.9-5.4-3.9-3.8 5.4-.8L12 3.5z" />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 12.5V5.8A1.8 1.8 0 0 1 4.8 4h6.7L20 12.5 12.5 20 3 12.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5.5 19c1.6-2.8 3.8-4.2 6.5-4.2S16.9 16.2 18.5 19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function VideoIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="6"
        width="14"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m17 10 4-2v8l-4-2v-4z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 16h.5l1.2-3.4A2 2 0 0 1 8.6 11h6.8a2 2 0 0 1 1.9 1.3L18.5 16H19a2 2 0 0 1 2 2v1H3v-1a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2" fill="currentColor" />
    </svg>
  )
}

export default UsedCarsMegaMenu
