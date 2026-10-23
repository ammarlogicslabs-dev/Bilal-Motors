import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, CheckCircle2, FilePlus2, Handshake } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'

const EASE = [0.22, 1, 0.36, 1]

const OPTIONS = [
  {
    key: 'free-ad',
    to: '/sell-car/post-ad',
    icon: FilePlus2,
    eyebrow: 'Self managed',
    title: 'Post Free Ad',
    description:
      'List your car yourself — add vehicle details and photos, then connect directly with interested buyers.',
    points: [
      'Post your car ad with a simple form',
      'Add details, price and photos',
      'Manage buyer enquiries yourself',
    ],
    cta: 'Post free ad',
    featured: true,
  },
  {
    key: 'assisted',
    to: '/sell-car/sell-it-for-me',
    icon: Handshake,
    eyebrow: 'Assisted sale',
    title: 'Sell It For Me',
    description:
      'Let Bilal Motors support your listing, buyer enquiries, offers and deal coordination.',
    points: [
      'Assisted selling service',
      'Help with enquiries and offers',
      'Guided sale through our team',
    ],
    cta: 'Request assisted sale',
    featured: false,
  },
]

const FAQS = [
  {
    question: 'How do I sell my car online on Bilal Motors?',
    answer:
      'Choose Post Free Ad to list yourself, or Sell It For Me if you want our team to help with enquiries and coordination.',
  },
  {
    question: 'What should I include in my advertisement?',
    answer:
      'Include make, model, year, variant, mileage, transmission, city, asking price, and clear photos of the actual car.',
  },
  {
    question: 'Which photos help buyers?',
    answer:
      'Front, rear, both sides, cabin, dashboard, seats, tyres and any visible wear — in good daylight, without heavy editing.',
  },
  {
    question: 'Is Post Free Ad really free?',
    answer:
      'Yes. You publish the listing yourself at no listing fee. You handle buyer chats and the final deal arrangements.',
  },
]

function SellCar() {
  const reduce = useReducedMotion()
  const [openId, setOpenId] = useState(0)

  return (
    <main>
      <section className="relative overflow-hidden px-6 pt-35 pb-12 max-[860px]:px-4 max-[860px]:pt-32.5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(110,196,224,0.18),transparent_55%)]"
        />
        <div className="relative mx-auto max-w-310">
          <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-[12.5px] text-muted-text">
            <Link to="/" className="no-underline transition hover:text-primary">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-ink">Sell car</span>
          </nav>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="max-w-2xl"
          >
            <p className="m-0 inline-flex items-center gap-3 text-xs font-bold tracking-[0.14em] text-primary uppercase">
              <span className="h-0.5 w-7 shrink-0 bg-accent" aria-hidden="true" />
              Sell online
            </p>
            <h1 className="mt-3 mb-0 text-[clamp(1.9rem,4vw,2.85rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink">
              Sell your car your way
            </h1>
            <p className="mt-3 mb-0 text-[15px] leading-relaxed text-muted-text">
              Choose the selling option that works best for you. Post your own free ad, or let
              Bilal Motors handle the sale with assisted support.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-6 pb-14 max-[860px]:px-4 max-[860px]:pb-10">
        <div className="mx-auto grid max-w-310 gap-5 min-[800px]:grid-cols-2">
          {OPTIONS.map((opt, index) => {
            const Icon = opt.icon
            return (
              <motion.article
                key={opt.key}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : index * 0.08 }}
                className={`flex flex-col overflow-hidden rounded-3xl border bg-surface shadow-soft ${
                  opt.featured ? 'border-primary/40' : 'border-border-soft'
                }`}
              >
                <div className="flex flex-1 flex-col p-6 max-[560px]:p-5">
                  <span
                    className={`grid size-12 place-items-center rounded-2xl ${
                      opt.featured ? 'bg-primary text-ink' : 'bg-primary/15 text-ink'
                    }`}
                  >
                    <Icon size={22} />
                  </span>
                  <p className="mt-4 mb-0 text-[11px] font-bold tracking-[0.12em] text-primary uppercase">
                    {opt.eyebrow}
                  </p>
                  <h2 className="mt-1 mb-0 text-[1.35rem] font-extrabold tracking-[-0.02em] text-ink">
                    {opt.title}
                  </h2>
                  <p className="mt-2 mb-0 text-[14px] leading-relaxed text-muted-text">
                    {opt.description}
                  </p>
                  <ul className="mt-5 mb-0 flex list-none flex-col gap-2.5 p-0">
                    {opt.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-[13.5px] font-semibold text-ink">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={opt.to}
                    className={`mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-[14px] font-extrabold no-underline transition active:scale-[0.99] ${
                      opt.featured
                        ? 'bg-primary text-ink shadow-cta hover:bg-primary-hover'
                        : 'border border-border-soft bg-bg text-ink hover:border-primary/40'
                    }`}
                  >
                    {opt.cta}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.article>
            )
          })}
        </div>
      </section>

      <section className="px-6 py-14 max-[860px]:px-4 max-[860px]:py-10">
        <div className="mx-auto max-w-310">
          <SectionHeading
            eyebrow="Need Help?"
            title="Sell my car online FAQs"
            description="Quick answers about posting an ad and completing a safe online sale."
          />

          <motion.div
            className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-soft"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {FAQS.map((item, index) => {
              const isOpen = openId === index
              return (
                <div
                  key={item.question}
                  className={index > 0 ? 'border-t border-border-soft' : ''}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-bg/70 max-[560px]:px-4"
                  >
                    <span className="text-[14.5px] font-bold tracking-[-0.01em] text-ink">
                      {item.question}
                    </span>
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold transition ${
                        isOpen ? 'bg-primary text-ink' : 'bg-bg text-muted-text'
                      }`}
                      aria-hidden="true"
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        key={`answer-${index}`}
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={reduce ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="m-0 px-5 pb-4 text-[14px] leading-relaxed text-muted-text max-[560px]:px-4">
                          {item.answer}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>
    </main>
  )
}

export default SellCar
