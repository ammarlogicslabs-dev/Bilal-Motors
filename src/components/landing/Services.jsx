import { motion, useReducedMotion } from 'framer-motion'
import SectionHeading from '../SectionHeading'

const SERVICES = [
  {
    title: 'Find used cars',
    description: 'Browse verified listings with clear filters for make, city, and budget.',
    href: '#used-cars',
    icon: 'search',
  },
  {
    title: 'Sell your car',
    description: 'List your vehicle quickly with photos and details buyers care about.',
    href: '#post-ad',
    icon: 'tag',
  },
  {
    title: 'Watch car videos',
    description: 'Review walkaround tours and guides before you decide.',
    href: '#videos',
    icon: 'video',
  },
  {
    title: 'Read buying guides',
    description: 'Stay informed with marketplace tips, reviews, and local advice.',
    href: '#blog',
    icon: 'blog',
  },
]

const ease = [0.22, 1, 0.36, 1]

function Services() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="services" className="bg-bg px-6 py-14 max-[860px]:px-4 max-[860px]:py-10">
      <div className="mx-auto max-w-[1240px]">
        <SectionHeading
          eyebrow="Services"
          title="Everything you need in one place"
          description="Buy, sell, learn, and explore — connected through one trusted automotive marketplace."
        />

        <motion.div
          className="grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: reduceMotion ? 0 : 0.07 },
            },
          }}
        >
          {SERVICES.map((item) => (
            <motion.a
              key={item.title}
              href={item.href}
              variants={{
                hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4, ease },
                },
              }}
              whileHover={reduceMotion ? undefined : { y: -4 }}
              className="group rounded-2xl border border-border-soft bg-surface p-5 no-underline shadow-soft transition-colors hover:border-primary/35"
            >
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-ink">
                <ServiceIcon name={item.icon} />
              </span>
              <strong className="block text-[15px] font-bold text-ink">
                {item.title}
              </strong>
              <p className="mt-2 mb-0 text-[13.5px] leading-relaxed text-muted-text">
                {item.description}
              </p>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function ServiceIcon({ name }) {
  if (name === 'search') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }
  if (name === 'tag') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
  if (name === 'video') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="m17 10 4-2v8l-4-2v-4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 4h11a2 2 0 0 1 2 2v14l-3.5-2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M7 9h8M7 13h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export default Services
