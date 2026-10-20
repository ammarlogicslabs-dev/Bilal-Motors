const NAV_LINKS = [
  { label: 'Used Cars', href: '#used-cars', hasDropdown: true },
  { label: 'Auctions', href: '#auctions' },
  { label: 'New Cars', href: '#new-cars' },
  { label: 'Car Inspection', href: '#inspection' },
  { label: 'Car Videos', href: '#videos' },
  { label: 'Blog', href: '#blog' },
]

function Navbar() {
  return (
    <nav
      className="mx-auto max-w-[1240px] rounded-b-[14px] bg-white shadow-nav"
      aria-label="Main"
    >
      <div className="flex min-h-[70px] items-center justify-between gap-4 px-[18px] py-2.5 max-[960px]:px-4">
        <a href="/" className="flex shrink-0 items-center no-underline">
          <img
            src="/images/logo.webp"
            alt="Bilal Motors"
            className="block h-12 w-auto object-contain"
            width="180"
            height="48"
          />
        </a>

        <ul className="m-0 flex flex-1 list-none items-center justify-end gap-x-[18px] gap-y-1 p-0 max-[1100px]:gap-x-3.5 max-[960px]:hidden">
          {NAV_LINKS.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold tracking-wide text-nav-text no-underline transition-colors hover:text-primary max-[1100px]:text-[13.5px] [&_svg]:opacity-70"
              >
                {item.label}
                {item.hasDropdown ? <ChevronIcon /> : null}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#post-ad"
          className="ml-2 inline-flex shrink-0 items-center gap-2 rounded-[10px] bg-primary px-[18px] py-3 text-sm font-bold text-white no-underline shadow-cta transition duration-200 hover:-translate-y-px hover:bg-primary-hover hover:shadow-cta-hover"
        >
          Post Free Ad
          <ArrowIcon />
        </a>
      </div>
    </nav>
  )
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Navbar
