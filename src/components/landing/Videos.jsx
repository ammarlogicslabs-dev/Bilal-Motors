import { motion, useReducedMotion } from 'framer-motion'
import SectionHeading from '../SectionHeading'

const VIDEOS = [
  {
    title: 'SUV Exterior Inspection Walkthrough',
    meta: 'Walkaround · 4 min',
    href: '#video-suv-inspection',
    image: '/images/videos/suv-inspection.jpg',
  },
  {
    title: 'First Used Car Checklist',
    meta: 'Buying guide · 6 min',
    href: '#video-first-car-checklist',
    image: '/images/videos/first-car-checklist.jpg',
  },
  {
    title: 'Engine Sound Check Explained',
    meta: 'Inspection · 5 min',
    href: '#video-engine-sound',
    image: '/images/videos/engine-sound.jpg',
  },
]

const ease = [0.22, 1, 0.36, 1]

function Videos() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="videos" className="bg-surface px-6 py-14 max-[860px]:px-4 max-[860px]:py-10">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            className="!mb-0"
            eyebrow="Videos"
            title="Watch before you decide"
            description="Quick walkarounds and buying guides to help you compare used cars with confidence."
          />
          <a
            href="#videos-all"
            className="shrink-0 text-sm font-bold text-primary no-underline transition hover:text-primary-hover"
          >
            View all videos →
          </a>
        </div>

        <motion.div
          className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: reduceMotion ? 0 : 0.08 },
            },
          }}
        >
          {VIDEOS.map((item) => (
            <motion.a
              key={item.title}
              href={item.href}
              variants={{
                hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4, ease },
                },
              }}
              whileHover={reduceMotion ? undefined : { y: -4 }}
              className="group overflow-hidden rounded-2xl border border-border-soft bg-bg no-underline shadow-soft transition-colors hover:border-primary/35"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-ink/5">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  width="640"
                  height="400"
                />
                <span className="absolute inset-0 bg-ink/15 transition group-hover:bg-ink/25" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-ink shadow-cta transition group-hover:scale-105">
                    <PlayIcon />
                  </span>
                </span>
              </div>
              <div className="p-4">
                <p className="m-0 text-[11px] font-bold tracking-[0.1em] text-primary uppercase">
                  {item.meta}
                </p>
                <strong className="mt-1.5 block text-[15px] leading-snug font-bold text-ink">
                  {item.title}
                </strong>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5L8 5.5z" />
    </svg>
  )
}

export default Videos
