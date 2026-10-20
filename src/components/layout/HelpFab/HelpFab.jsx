function HelpFab() {
  return (
    <a
      href="#help"
      className="motion-safe-anim fixed right-[22px] bottom-[22px] z-50 inline-flex items-center gap-2.5 rounded-full bg-primary py-2.5 pr-4 pl-2.5 text-[13px] font-bold text-white no-underline shadow-fab transition duration-200 animate-fab-in hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_14px_32px_rgba(230,30,38,0.45)] max-[560px]:right-4 max-[560px]:bottom-4 max-[560px]:p-2.5"
      aria-label="Need help?"
    >
      <span
        className="grid h-9 w-9 place-items-center rounded-full bg-white/16"
        aria-hidden="true"
      >
        <ChatIcon />
      </span>
      <span className="max-[560px]:sr-only">Need Help?</span>
    </a>
  )
}

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
