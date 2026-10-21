import { motion, useReducedMotion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
}) {
  const reduceMotion = useReducedMotion()
  const centered = align === 'center'

  return (
    <motion.div
      className={`mb-8 max-w-2xl ${centered ? 'mx-auto text-center' : ''} ${className}`}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45, ease }}
    >
      {eyebrow ? (
        <p
          className={`mb-2 inline-flex items-center gap-3 text-xs font-bold tracking-[0.14em] text-primary uppercase ${
            centered ? 'justify-center' : ''
          }`}
        >
          <span className="h-0.5 w-7 shrink-0 bg-accent" aria-hidden="true" />
          {eyebrow}
        </p>
      ) : null}
      <h2 className="m-0 text-[clamp(1.5rem,3vw,2rem)] font-extrabold tracking-[-0.02em] text-ink">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 mb-0 text-[15px] leading-relaxed text-muted-text">
          {description}
        </p>
      ) : null}
    </motion.div>
  )
}

export default SectionHeading
