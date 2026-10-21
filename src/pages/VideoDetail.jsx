import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { getRelatedVideos, getVideo } from '../data/videos'

const ease = [0.22, 1, 0.36, 1]

function VideoDetail() {
  const { slug } = useParams()
  const video = getVideo(slug)
  const related = getRelatedVideos(slug)
  const reduceMotion = useReducedMotion()

  if (!video) {
    return (
      <main className="px-6 pt-[140px] pb-16 max-[860px]:px-4">
        <div className="mx-auto max-w-[640px] rounded-2xl border border-border-soft bg-surface p-8 text-center shadow-soft">
          <h1 className="m-0 text-2xl font-extrabold text-ink">Video not found</h1>
          <p className="mt-2 text-muted-text">This video may have moved or is unavailable.</p>
          <Link
            to="/videos"
            className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-bold text-ink no-underline"
          >
            Back to videos
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="px-6 pt-[140px] pb-16 max-[860px]:px-4 max-[860px]:pt-[130px]">
      <div className="mx-auto max-w-[1100px]">
        <Link
          to="/videos"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-primary no-underline transition hover:text-primary-hover"
        >
          ← All videos
        </Link>

        <motion.div
          className="mt-5 grid gap-8 min-[960px]:grid-cols-[1.4fr_0.75fr]"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <div>
            <div className="relative overflow-hidden rounded-[22px] border border-border-soft bg-ink shadow-soft">
              <img
                src={video.image}
                alt={video.title}
                className="block aspect-[16/9] w-full object-cover"
              />
              <span className="absolute inset-0 bg-ink/25" />
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-ink shadow-cta">
                  <PlayIcon />
                </span>
              </span>
              <span className="absolute right-4 bottom-4 rounded-full bg-ink/75 px-3 py-1 text-[12px] font-bold text-white backdrop-blur-sm">
                {video.duration}
              </span>
            </div>

            <p className="mt-5 mb-2 text-[11px] font-bold tracking-[0.12em] text-primary uppercase">
              {video.category} · {video.meta}
            </p>
            <h1 className="m-0 text-[clamp(1.55rem,3vw,2.15rem)] font-extrabold tracking-[-0.02em] text-ink">
              {video.title}
            </h1>
            <p className="mt-3 mb-0 text-[15.5px] leading-relaxed text-muted-text">
              {video.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/used-car"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-ink no-underline transition hover:bg-primary-hover"
              >
                Browse used cars
              </Link>
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 rounded-xl border border-border-soft bg-surface px-5 py-3 text-sm font-bold text-ink no-underline transition hover:border-primary/40"
              >
                Read guides
              </Link>
            </div>
          </div>

          <aside>
            <h2 className="m-0 text-[15px] font-extrabold text-ink">Related videos</h2>
            <div className="mt-4 flex flex-col gap-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  to={`/videos/${item.slug}`}
                  className="group flex gap-3 overflow-hidden rounded-xl border border-border-soft bg-surface p-2 no-underline shadow-soft transition hover:border-primary/40"
                >
                  <div className="relative h-[72px] w-[112px] shrink-0 overflow-hidden rounded-lg bg-ink/5">
                    <img
                      src={item.image}
                      alt=""
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                    <span className="absolute inset-0 grid place-items-center bg-ink/20">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-ink">
                        <PlayIcon size={12} />
                      </span>
                    </span>
                  </div>
                  <div className="min-w-0 py-0.5">
                    <p className="m-0 text-[10px] font-bold tracking-wide text-primary uppercase">
                      {item.duration}
                    </p>
                    <strong className="mt-1 block text-[13px] leading-snug font-bold text-ink">
                      {item.title}
                    </strong>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </motion.div>
      </div>
    </main>
  )
}

function PlayIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5L8 5.5z" />
    </svg>
  )
}

export default VideoDetail
