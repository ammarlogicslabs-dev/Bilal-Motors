import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { getBlog, getRelatedBlogs } from '../data/blogs'

const ease = [0.22, 1, 0.36, 1]

function BlogDetail() {
  const { slug } = useParams()
  const blog = getBlog(slug)
  const related = getRelatedBlogs(slug)
  const reduceMotion = useReducedMotion()

  if (!blog) {
    return (
      <main className="px-6 pt-[140px] pb-16 max-[860px]:px-4">
        <div className="mx-auto max-w-[640px] rounded-2xl border border-border-soft bg-surface p-8 text-center shadow-soft">
          <h1 className="m-0 text-2xl font-extrabold text-ink">Blog not found</h1>
          <p className="mt-2 text-muted-text">This article may have moved or is unavailable.</p>
          <Link
            to="/blogs"
            className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-bold text-ink no-underline"
          >
            Back to blogs
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="px-6 pt-[140px] pb-16 max-[860px]:px-4 max-[860px]:pt-[130px]">
      <article className="mx-auto max-w-[760px]">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-primary no-underline transition hover:text-primary-hover"
        >
          ← All blogs
        </Link>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-primary/15 px-2.5 py-1 text-[11px] font-bold tracking-wide text-primary uppercase">
              {blog.category}
            </span>
            <span className="text-[12.5px] font-medium text-muted-text">
              {blog.readTime} · {blog.date}
            </span>
          </div>

          <h1 className="mt-3 mb-0 text-[clamp(1.7rem,3.2vw,2.4rem)] font-extrabold leading-[1.15] tracking-[-0.03em] text-ink">
            {blog.title}
          </h1>
          <p className="mt-3 mb-0 text-[16px] leading-relaxed text-muted-text">
            {blog.excerpt}
          </p>

          <div className="mt-6 overflow-hidden rounded-[22px] border border-border-soft shadow-soft">
            <img
              src={blog.image}
              alt={blog.title}
              className="block aspect-[16/9] w-full object-cover"
            />
          </div>

          <div className="mt-8 space-y-5">
            {blog.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="m-0 text-[16px] leading-[1.75] text-ink/85"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3 border-t border-border-soft pt-6">
            <Link
              to="/used-car"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-ink no-underline transition hover:bg-primary-hover"
            >
              Browse used cars
            </Link>
            <Link
              to="/videos"
              className="inline-flex items-center gap-2 rounded-xl border border-border-soft bg-surface px-5 py-3 text-sm font-bold text-ink no-underline transition hover:border-primary/40"
            >
              Watch videos
            </Link>
          </div>
        </motion.div>
      </article>

      {related.length > 0 ? (
        <section className="mx-auto mt-14 max-w-[1100px]">
          <h2 className="m-0 text-[1.2rem] font-extrabold text-ink">Related articles</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
            {related.map((item) => (
              <Link
                key={item.slug}
                to={`/blogs/${item.slug}`}
                className="group flex gap-4 overflow-hidden rounded-2xl border border-border-soft bg-surface p-3 no-underline shadow-soft transition hover:border-primary/40"
              >
                <div className="h-[88px] w-[120px] shrink-0 overflow-hidden rounded-xl bg-ink/5">
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0 py-1">
                  <span className="text-[11px] font-bold tracking-wide text-primary uppercase">
                    {item.category}
                  </span>
                  <strong className="mt-1 block text-[14.5px] leading-snug font-bold text-ink">
                    {item.title}
                  </strong>
                  <p className="mt-1 mb-0 line-clamp-2 text-[12.5px] text-muted-text">
                    {item.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}

export default BlogDetail
