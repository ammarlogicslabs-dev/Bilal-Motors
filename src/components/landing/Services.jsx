import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import SectionHeading from '../SectionHeading'

const SERVICES = [
  {
    eyebrow: 'Want to buy a car?',
    title: 'Find the right used car',
    description: 'Browse listings with clear filters for make, city, and body type.',
    cta: 'Search cars',
    to: '/used-car',
    image: '/images/body/hatchback.jpg',
    icon: 'search',
    tint: 'from-[#e8f6fb] to-white',
    accent: 'text-primary',
  },
  {
    eyebrow: 'Ready to sell?',
    title: 'Sell your car online',
    description: 'List your vehicle quickly with photos and details buyers care about.',
    cta: 'Post your ad',
    to: '/sell-car',
    image: '/images/body/sedan.jpg',
    icon: 'tag',
    tint: 'from-[#eef3f8] to-white',
    accent: 'text-[#4a90b8]',
  },
  {
    eyebrow: 'Watch before you decide',
    title: 'Car video tours',
    description: 'Review walkarounds and guides so you know what to expect first.',
    cta: 'Watch videos',
    to: '/videos',
    image: '/images/videos/suv-inspection.jpg',
    icon: 'video',
    tint: 'from-[#eaf4fb] to-white',
    accent: 'text-[#4f8fbf]',
  },
  {
    eyebrow: 'Stay informed',
    title: 'Buying guides & blogs',
    description: 'Practical tips on comparing cars, paperwork, and smarter selling.',
    cta: 'Read blogs',
    to: '/blogs',
    image: '/images/blogs/negotiation-tips.jpg',
    icon: 'blog',
    tint: 'from-[#f0f4f8] to-white',
    accent: 'text-[#5a7a94]',
  },
]

const ease = [0.22, 1, 0.36, 1]

function Services() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="services" className="bg-bg px-6 py-14 max-[860px]:px-4 max-[860px]:py-10">
      <div className="mx-auto max-w-310">
        
        <SectionHeading
          eyebrow="Services"
          title="Everything you need in one place"
          description="Buy, sell, learn, and explore — connected through one trusted automotive marketplace."
        />

        <motion.div
          className="grid grid-cols-2 gap-4 max-[860px]:grid-cols-1"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: reduceMotion ? 0 : 0.07 },
            },
          }}
        >
          {SERVICES.map((item) => (
            <motion.div
              key={item.title}
              variants={{
                hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4, ease },
                },
              }}
              whileHover={reduceMotion ? undefined : { y: -3 }}
            >
            <Link
              to={item.to}
              className={`group relative flex min-h-42 overflow-hidden rounded-[22px] border border-border-soft bg-linear-to-r ${item.tint} no-underline shadow-soft transition-shadow hover:shadow-[0_14px_34px_rgba(28,36,48,0.1)]`}
            >
              <div className="relative z-1 flex min-w-0 flex-1 flex-col justify-between gap-4 p-5 pr-2 max-[560px]:p-4">
                <div>
                  
                  <p
                    className={`m-0 mb-2 text-[10px] font-bold tracking-[0.12em] uppercase ${item.accent}`}
                  >
                    
                    {item.eyebrow}
                  </p>
                  <h3 className="m-0 text-[1.15rem] leading-snug font-extrabold tracking-[-0.02em] text-ink max-[560px]:text-[1.05rem]">
                    {item.title}
                  </h3>
                  <p className="mt-2 mb-0 max-w-60 text-[13px] leading-relaxed text-muted-text">
                    {item.description}
                  </p>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 text-[13px] font-bold ${item.accent} transition group-hover:gap-2.5`}
                >
                  {item.cta}
                  <ArrowIcon />
                </span>
              </div>

              <div className="relative flex w-[44%] max-w-60 shrink-0 items-stretch p-3 pl-0 max-[560px]:w-[40%] max-[560px]:p-2">
                <span
                  className={`absolute top-3 right-3 z-2 grid h-8 w-8 place-items-center rounded-full border border-white bg-white shadow-sm ${item.accent}`}
                >
                  <ServiceIcon name={item.icon} />
                </span>
                <div className="relative h-full min-h-35 w-full overflow-hidden rounded-2xl">
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.05]"
                    width="240"
                    height="160"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-linear-to-l from-transparent via-transparent to-white/25" />
                </div>
              </div>
            </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ServiceIcon({ name }) {
  const props = {
    width: 14,
    height: 14,
    viewBox: '0 0 24 24',
    fill: 'none',
    'aria-hidden': true,
  }

  if (name === 'search') {
    return (
      <svg {...props}>
        <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }
  if (name === 'tag') {
    return (
      <svg {...props}>
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
  if (name === 'user') {
    return (
      <svg {...props}>
        <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M5 19c1.7-3 4-4.5 7-4.5s5.3 1.5 7 4.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  if (name === 'star') {
    return (
      <svg {...props}>
        <path
          d="m12 3.5 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.8 7.2 18.4l.9-5.4L4.2 9.2l5.4-.8L12 3.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (name === 'video') {
    return (
      <svg {...props}>
        <rect x="3" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="m17 10 4-2v8l-4-2v-4z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return (
    <svg {...props}>
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
