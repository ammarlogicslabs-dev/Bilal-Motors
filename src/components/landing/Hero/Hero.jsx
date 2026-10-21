import { motion } from 'framer-motion'
import FeatureCards from './FeatureCards'

const ease = [0.22, 1, 0.36, 1]

function Hero() {
  return (
    <section
      className="relative flex min-h-svh flex-col overflow-hidden"
      aria-label="Bilal Motors home"
    >
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <motion.img
          src="/images/hero.jpg"
          alt=""
          className="block h-full w-full object-cover object-[center_40%]"
          width={1920}
          height={1080}
          initial={{ scale: 1.06, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease }}
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      <div className="relative z-[1] mx-auto flex w-full max-w-[1240px] flex-1 flex-col justify-end px-6 pb-0 pt-[130px] max-[860px]:px-4 max-[860px]:pt-[120px]">
        <motion.div
          className="mb-10 mt-auto max-w-[620px] pt-10 text-white max-[860px]:mb-8"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
          }}
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 inline-flex items-center gap-3 text-xs font-bold tracking-[0.16em] text-white/90 uppercase"
          >
            <span className="h-0.5 w-7 shrink-0 bg-accent" aria-hidden="true" />
            Bilal Motors Marketplace
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mb-4 font-sans text-[clamp(2.35rem,5vw,3.55rem)] font-extrabold leading-[1.08] tracking-[-0.03em]"
          >
            <span className="block">Find your next</span>
            <span className="block text-accent">used car today.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mb-8 max-w-[500px] text-[16px] leading-[1.6] font-medium text-white/80"
          >
            Explore verified used car listings, watch video tours, and read
            buying guides — everything you need in one place.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-3 max-[560px]:flex-col max-[560px]:items-stretch"
          >
            <motion.a
              href="#used-cars"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3.5 text-[14.5px] font-bold text-ink no-underline shadow-cta max-[560px]:w-full"
            >
              Browse Used Cars
              <ArrowIcon />
            </motion.a>
            <motion.a
              href="#videos"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/35 bg-white/10 px-5 py-3.5 text-[14.5px] font-bold text-white no-underline backdrop-blur-sm max-[560px]:w-full"
            >
              Watch Videos
            </motion.a>
            <motion.a
              href="#blog"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/35 bg-transparent px-5 py-3.5 text-[14.5px] font-bold text-white no-underline max-[560px]:w-full"
            >
              Read Blogs
            </motion.a>
          </motion.div>
        </motion.div>

        <FeatureCards />
      </div>
    </section>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease },
  },
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

export default Hero
