const FEATURES = [
  {
    title: 'Used Cars',
    subtitle: 'Search listings',
    href: '#used-cars',
    icon: 'car',
  },
  {
    title: 'Live Auctions',
    subtitle: 'Bid with confidence',
    href: '#auctions',
    icon: 'bolt',
  },
  {
    title: 'Inspection',
    subtitle: 'Know before you buy',
    href: '#inspection',
    icon: 'shield',
  },
]

function FeatureCards() {
  return (
    <div className="motion-safe-anim w-full border-t border-white/10 pt-4 animate-hero-rise-delay max-[860px]:pt-3.5">
      <div className="flex flex-wrap items-center gap-x-10 gap-y-4 max-[860px]:flex-col max-[860px]:items-start max-[860px]:gap-3.5">
        {FEATURES.map((item) => (
          <a
            key={item.title}
            href={item.href}
            className="group flex items-center gap-2.5 text-inherit no-underline transition duration-200 hover:opacity-90"
          >
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#1a1f28] text-primary transition duration-200 group-hover:bg-[#222833]"
              aria-hidden="true"
            >
              {item.icon === 'car' ? <CarIcon /> : null}
              {item.icon === 'bolt' ? <BoltIcon /> : null}
              {item.icon === 'shield' ? <ShieldIcon /> : null}
            </span>
            <span className="flex min-w-0 flex-col gap-px">
              <strong className="text-[13px] font-bold text-white">
                {item.title}
              </strong>
              <span className="text-[11px] font-medium text-muted-text">
                {item.subtitle}
              </span>
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

function CarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 16h.5l1.2-3.6A2 2 0 0 1 8.6 11h6.8a2 2 0 0 1 1.9 1.4L18.5 16H19a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1H6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M7 11 8.2 7.8A2 2 0 0 1 10.1 6.5h3.8a2 2 0 0 1 1.9 1.3L17 11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="7.5" cy="17" r="1" fill="currentColor" />
      <circle cx="16.5" cy="17" r="1" fill="currentColor" />
    </svg>
  )
}

function BoltIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2 4 13.5h6.5L10 22l9-11.5h-6.5L13 2z" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3 5 6.5v5.2c0 4.3 2.9 7.6 7 8.8 4.1-1.2 7-4.5 7-8.8V6.5L12 3z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="m9.2 12 1.9 1.9 3.7-3.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default FeatureCards
