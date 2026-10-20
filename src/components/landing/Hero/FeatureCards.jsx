const FEATURES = [
  {
    title: 'Used Cars',
    subtitle: 'Search Listings',
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
    <div className="motion-safe-anim grid grid-cols-3 gap-3.5 animate-hero-rise-delay max-[860px]:grid-cols-1">
      {FEATURES.map((item) => (
        <a
          key={item.title}
          href={item.href}
          className="flex items-center gap-3.5 rounded-[10px] border border-white/10 bg-glass px-5 py-[18px] text-inherit no-underline backdrop-blur-[12px] transition duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-[rgba(28,28,28,0.86)]"
        >
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border-[1.5px] border-primary/55 text-primary"
            aria-hidden="true"
          >
            {item.icon === 'car' ? <CarIcon /> : null}
            {item.icon === 'bolt' ? <BoltIcon /> : null}
            {item.icon === 'shield' ? <ShieldIcon /> : null}
          </span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <strong className="text-base font-bold text-white">{item.title}</strong>
            <span className="text-[13px] font-medium text-muted-text">
              {item.subtitle}
            </span>
          </span>
        </a>
      ))}
    </div>
  )
}

function CarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2 4 13.5h6.5L10 22l9-11.5h-6.5L13 2z" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
