import { motion } from 'framer-motion'

function HelpFab() {
  return (
    <motion.a
      href="#help"
      initial={{ opacity: 0, y: 16, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="fixed right-5 bottom-5 z-50 inline-flex items-center gap-2 rounded-3xl bg-primary py-2 pr-4 pl-2 text-[13px] font-bold text-ink no-underline shadow-fab max-[560px]:right-4 max-[560px]:bottom-4 max-[560px]:rounded-xl max-[560px]:p-2"
      aria-label="Need Help?"
    >
      <span
        className="grid h-9 w-9 place-items-center rounded-xl bg-white/45 text-ink"
        aria-hidden="true"
      >
        <ChatIcon />
        </span>
        <span className="max-[500px]:sr-only">Need Help?</span>
    </motion.a>
  )
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 18.5 4 21l3.2-1.2A9 9 0 1 0 5 18.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="11.5" r="1" fill="currentColor" />
      <circle cx="12" cy="11.5" r="1" fill="currentColor" />
      <circle cx="15" cy="11.5" r="1" fill="currentColor" />
    </svg>
  )
}

export default HelpFab
