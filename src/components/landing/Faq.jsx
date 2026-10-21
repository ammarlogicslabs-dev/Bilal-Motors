import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import SectionHeading from '../SectionHeading'

const FAQS = [
  {
    question: 'How do I search for a used car on Bilal Motors?',
    answer:
      'Use the search bar to filter by make, city, or keyword. You can also browse by brand or body type to narrow results faster.',
  },
  {
    question: 'Are the car listings verified?',
    answer:
      'Listings are published by sellers with vehicle details and photos. Always review the listing carefully and confirm key information before you decide.',
  },
  {
    question: 'How can I sell my car?',
    answer:
      'Open Sell Your Car from the menu or homepage CTA, then share your vehicle details and photos to publish an ad for buyers to discover.',
  },
  {
    question: 'Do you cover cities across Pakistan?',
    answer:
      'Yes. You can browse and filter cars by major cities including Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, and Faisalabad.',
  },
  {
    question: 'What are car videos used for?',
    answer:
      'Car videos give you walkaround tours and buying guides so you can understand a vehicle better before contacting a seller.',
  },
  {
    question: 'Where can I get help if I have a question?',
    answer:
      'Use the Help button on the site or reach out through the contact details in the header and footer. Our team can guide you on browsing or selling.',
  },
]

const ease = [0.22, 1, 0.36, 1]

function Faq() {
  const reduceMotion = useReducedMotion()
  const [openId, setOpenId] = useState(0)

  return (
    <section id="faq" className="bg-bg px-6 py-14 max-[860px]:px-4 max-[860px]:py-10">
      <div className="mx-auto max-w-[1240px]">
        <SectionHeading
          eyebrow="Need Help?"
          title="Frequently Asked Questions"
          description="Quick answers about browsing, selling, and using Bilal Motors."
        />

        <motion.div
          className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-soft"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease }}
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
                      isOpen
                        ? 'bg-primary text-ink'
                        : 'bg-bg text-muted-text'
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
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease }}
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
  )
}

export default Faq
