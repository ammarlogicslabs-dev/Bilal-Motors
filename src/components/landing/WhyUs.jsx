import { motion, useReducedMotion } from 'framer-motion'
import SectionHeading from '../SectionHeading'

const POINTS = [
  {
    title: 'Clear discovery',
    description: 'Browse by make, city, and body type without clutter or confusion.',
  },
  {
    title: 'Buyer-first details',
    description: 'Focus on the information that helps you compare cars with confidence.',
  },
  {
    title: 'Simple selling flow',
    description: 'List your vehicle with a clean post-ad path built for real sellers.',
  },
  {
    title: 'Trusted local presence',
    description: 'Built around Pakistan marketplace needs — from Karachi to Islamabad.',
  },
]

const ease = [0.22, 1, 0.36, 1]

function WhyUs() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="why-us" className="bg-surface px-6 py-14 max-[860px]:px-4 max-[860px]:py-10">
      <div className="mx-auto max-w-310">
        <SectionHeading
          eyebrow="Why Bilal Motors"
          title="A clearer way to buy and sell"
          description="A focused marketplace experience designed around discovery, details, and convenient selling."
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
          {POINTS.map((item, index) => (
            <motion.article
              key={item.title}
              variants={{
                hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4, ease },
                },
              }}
              className="rounded-2xl border border-border-soft bg-bg p-5"
            >
              <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-sm font-bold text-primary">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="m-0 text-[15px] font-bold text-ink">{item.title}</h3>
              <p className="mt-2 mb-0 text-[13.5px] leading-relaxed text-muted-text">
                {item.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default WhyUs
