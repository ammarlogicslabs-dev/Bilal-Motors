import { Link } from 'react-router-dom'

const YEAR = new Date().getFullYear()

const EXPLORE = [
  { label: 'Home', to: '/' },
  { label: 'Used Cars', to: '/used-car' },
  { label: 'Videos', to: '/videos' },
  { label: 'Blogs', to: '/blogs' },
]

const DISCOVER = [
  { label: 'Browse by Make', to: '/#browse-make' },
  { label: 'Browse by Body', to: '/#browse-body' },
  { label: 'Popular Cities', to: '/used-car?city=Karachi' },
  { label: 'Sell Your Car', to: '/used-car' },
]

const SERVICES = [
  { label: 'Find Used Cars', to: '/used-car' },
  { label: 'Sell It For Me', to: '/used-car' },
  { label: 'Car Videos', to: '/videos' },
  { label: 'Buying Guides', to: '/blogs' },
]

const footerLinkClass =
  'relative inline-flex pb-0.5 text-[13.5px] text-white/65 no-underline transition-colors duration-200 after:absolute after:right-0 after:bottom-0 after:left-0 after:h-[1.5px] after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-primary hover:after:scale-x-100'

function Footer() {
  return (
    <footer className="border-t border-border-soft bg-ink text-white">
      <div className="mx-auto max-w-310 px-6 pt-12 pb-8 max-[860px]:px-4 max-[860px]:pt-10">
        <div className="grid grid-cols-4 gap-8 max-[1000px]:grid-cols-2 max-[560px]:grid-cols-1">
          <div className="max-[1000px]:col-span-2 max-[560px]:col-span-1">
            <Link to="/" className="inline-flex no-underline">
              <img
                src="/images/logo.webp"
                alt="Bilal Motors"
                className="h-12 w-auto object-contain"
                width="180"
                height="48"
              />
            </Link>
            <p className="mt-4 mb-0 max-w-sm text-[14px] leading-relaxed text-white/65">
              Bilal Motors helps you discover used cars, watch video tours, and
              sell with confidence through one trusted automotive marketplace.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <a href="tel:+923459275777" className={`${footerLinkClass} items-center gap-2 text-white/80`}>
                <PhoneIcon />
                +92 345 9275777
              </a>
              <a
                href="mailto:info@bilalmotors.com"
                className={`${footerLinkClass} items-center gap-2 text-white/80`}
              >
                <MailIcon />
                info@bilalmotors.com
              </a>
            </div>
          </div>

          <FooterColumn title="Explore" links={EXPLORE} />
          <FooterColumn title="Discover" links={DISCOVER} />
          <FooterColumn title="Services" links={SERVICES} />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-[12.5px] text-white/50">
          <p className="m-0">
            © {YEAR} Bilal Motors. All rights reserved.
          </p>
          <p className="m-0">Buy · Sell · Discover used cars in Pakistan</p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="m-0 text-sm font-bold tracking-wide text-white">{title}</h3>
      <ul className="mt-4 mb-0 flex list-none flex-col gap-2.5 p-0">
        {links.map((item) => (
          <li key={item.label}>
            <Link to={item.to} className={footerLinkClass}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8c1.7 3.3 3.3 4.9 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.8 21 3 13.2 3 3.5 3 2.9 3.4 2.5 4 2.5h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z"
        fill="currentColor"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 1.5 8 5 8-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Footer
