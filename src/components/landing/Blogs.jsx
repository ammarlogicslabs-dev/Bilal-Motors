import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import SectionHeading from '../SectionHeading'
import { BLOGS } from '../../data/blogs'

const ease = [0.22, 1, 0.36, 1]

function Blogs() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="blog" className="bg-bg px-6 py-14 max-[860px]:px-4 max-[860px]:py-10">
      <div className="mx-auto max-w-310">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            className="mb-0!"
            eyebrow="Blogs"
            title="Guides for smarter decisions"
            description="Practical tips on buying, selling, and choosing the right used car in Pakistan."
          />
          <Link
            to="/blogs"
            className="shrink-0 text-sm font-bold text-primary no-underline transition hover:text-primary-hover"
          >
            View all blogs →
          </Link>
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
          {BLOGS.map((item) => (
            <motion.div
              key={item.slug}
              variants={{
                hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4, ease },
                },
              }}
              whileHover={reduceMotion ? undefined : { y: -4 }}
            >
              <Link
                to={`/blogs/${item.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface no-underline shadow-soft transition-colors hover:border-primary/35"
              >
                <div className="aspect-16/10 overflow-hidden bg-ink/5">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    width="640"
                    height="400"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex w-fit rounded-md bg-primary/15 px-2 py-0.5 text-[11px] font-bold tracking-wide text-primary uppercase">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-medium text-muted-text">
                      {item.readTime}
                    </span>
                  </div>
                  <strong className="mt-2.5 block text-[15px] leading-snug font-bold text-ink">
                    {item.title}
                  </strong>
                  <p className="mt-2 mb-0 flex-1 text-[13.5px] leading-relaxed text-muted-text">
                    {item.excerpt}
                  </p>
                  <span className="mt-3 text-[13px] font-bold text-primary transition group-hover:text-primary-hover">
                    Read more →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Blogs
