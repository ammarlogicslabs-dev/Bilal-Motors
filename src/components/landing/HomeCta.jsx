import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

function HomeCta() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="px-6 py-14 max-[860px]:px-4 max-[860px]:py-10">
      <motion.div
        className="mx-auto max-w-310 overflow-hidden rounded-3xl bg-ink px-8 py-10 text-white max-[860px]:rounded-2xl max-[860px]:px-5 max-[860px]:py-8"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.5, ease }}
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="mb-2 text-xs font-bold tracking-[0.14em] text-accent uppercase">
              Ready when you are
            </p>
            <h2 className="m-0 text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold tracking-[-0.02em]">
              Find your next car — or list the one you have.
            </h2>
            <p className="mt-3 mb-0 text-[15px] leading-relaxed text-white/70">
              Browse verified used cars, watch video tours, and publish your ad
              through one connected marketplace experience.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <motion.div
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              <Link
                to="/used-car"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-bold text-ink no-underline shadow-cta"
              >
                Browse Used Cars
              </Link>
            </motion.div>
            <motion.div
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              <Link
                to="/used-car"
                className="inline-flex items-center justify-center rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-white no-underline"
              >
                Sell Your Car
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default HomeCta
