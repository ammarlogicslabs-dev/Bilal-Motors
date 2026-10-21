import { motion, useReducedMotion } from 'framer-motion'
import HomeSearch from './HomeSearch'
import BrowseByMake from './BrowseByMake'
import BrowseByBody from './BrowseByBody'

const ease = [0.22, 1, 0.36, 1]

function BrowseSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="browse"
      className="relative px-6 py-6 max-[860px]:px-4 max-[860px]:py-5"
    >
      <div className="mx-auto max-w-310">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, ease }}
        >
          <HomeSearch />
        </motion.div>

        <motion.div
          className="mt-4 grid grid-cols-2 gap-4 max-[860px]:grid-cols-1"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease, delay: reduceMotion ? 0 : 0.06 }}
        >
          <BrowseByMake />
          <BrowseByBody />
        </motion.div>
      </div>
    </section>
  )
}

export default BrowseSection
