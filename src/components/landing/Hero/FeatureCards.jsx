import { motion } from 'framer-motion'

const FEATURES = [
  {
    title: 'Used Cars',
    subtitle: 'Browse verified listings',
    href: '#used-cars',
    icon: 'car',
  },
  {
    title: 'Videos',
    subtitle: 'Watch car video tours',
    href: '#videos',
    icon: 'video',
  },
  {
    title: 'Blogs',
    subtitle: 'Tips and buying guides',
    href: '#blog',
    icon: 'blog',
  },
]

const ease = [0.22, 1, 0.36, 1]

function FeatureCards() {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.35, ease }}
    >
      <motion.div
        className="grid grid-cols-3 gap-3 rounded-t-2xl bg-surface px-5 py-4 shadow-soft max-[860px]:grid-cols-1 max-[860px]:gap-2 max-[860px]:px-4 max-[860px]:py-3"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08, delayChildren: 0.45 } },
        }}
      >
        {FEATURES.map((item) => (
          <motion.a
            key={item.title}
            href={item.href}
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
            }}
            whileHover={{ y: -2, backgroundColor: 'rgba(238, 241, 244, 1)' }}
            className="group flex items-center gap-3 rounded-xl px-2 py-2 text-inherit no-underline"
          >
            <span
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary transition duration-200 group-hover:bg-primary group-hover:text-ink"
              aria-hidden="true"
            >
              {item.icon === 'car' ? <CarIcon /> : null}
              {item.icon === 'video' ? <VideoIcon /> : null}
              {item.icon === 'blog' ? <BlogIcon /> : null}
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <strong className="text-[13.5px] font-bold text-ink">
                {item.title}
              </strong>
              <span className="text-[11.5px] font-medium text-muted-text">
                {item.subtitle}
              </span>
            </span>
          </motion.a>
        ))}
      </motion.div>
    </motion.div>
  )
}

function CarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 16h.5l1.2-3.6A2 2 0 0 1 8.6 11h6.8a2 2 0 0 1 1.9 1.4L18.5 16H19a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1H6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M7 11 8.2 7.8A2 2 0 0 1 10.1 6.5h3.8a2 2 0 0 1 1.9 1.3L17 11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="7.5" cy="17" r="1" fill="currentColor" />
      <circle cx="16.5" cy="17" r="1" fill="currentColor" />
    </svg>
  )
}

function VideoIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
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

function BlogIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 4h11a2 2 0 0 1 2 2v14l-3.5-2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M7 9h8M7 13h5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default FeatureCards
