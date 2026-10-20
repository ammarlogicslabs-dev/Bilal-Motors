import FeatureCards from './FeatureCards'

function Hero() {
  return (
    <section
      className="relative flex min-h-svh flex-col overflow-hidden text-white"
      aria-label="Bilal Motors marketplace"
    >
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <img
          src="/images/main.webp"
          alt=""
          className="motion-safe-anim block h-full w-full scale-[1.02] object-cover object-[center_40%] animate-hero-ken"
          width={1920}
          height={1080}
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      <div className="relative z-[1] mx-auto flex w-full max-w-[1240px] flex-1 flex-col justify-end px-7 pb-10 pt-[130px] max-[860px]:px-5 max-[860px]:pb-7 max-[860px]:pt-[120px]">
        <div className="motion-safe-anim mb-12 mt-auto max-w-[620px] pt-12 animate-hero-rise max-[860px]:mb-8">
          <p className="mb-[18px] inline-flex items-center gap-3 text-xs font-bold tracking-[0.16em] text-white/90 uppercase">
            <span className="h-0.5 w-7 shrink-0 bg-primary" aria-hidden="true" />
            Bilal Motors Marketplace
          </p>

          <h1 className="mb-[18px] font-sans text-[clamp(2.4rem,5.2vw,3.75rem)] font-black leading-[1.08] tracking-[-0.03em]">
            <span className="block">Find the right car.</span>
            <span className="block text-primary">Make the right move.</span>
          </h1>

          <p className="mb-7 max-w-[520px] text-[16.5px] leading-[1.55] font-medium text-white/85">
            Browse used cars, join live auctions, or sell your vehicle through
            one trusted automotive marketplace.
          </p>

          <div className="flex flex-wrap items-center gap-3 max-[560px]:flex-col max-[560px]:items-stretch">
            <a
              href="#auctions"
              className="motion-safe-anim inline-flex items-center justify-center gap-2 rounded-[10px] bg-primary px-5 py-[13px] text-[14.5px] font-bold text-white no-underline shadow-cta transition duration-200 animate-btn-pulse hover:-translate-y-px hover:bg-primary-hover hover:shadow-cta-hover max-[560px]:w-full"
            >
              <BoltIcon />
              Live Auction
            </a>
            <a
              href="#dealer-register"
              className="inline-flex items-center justify-center gap-2 rounded-[10px] border-[1.5px] border-white/75 bg-transparent px-5 py-[13px] text-[14.5px] font-bold text-white no-underline transition duration-200 hover:-translate-y-px hover:border-white hover:bg-white/10 max-[560px]:w-full [&_svg]:text-primary"
            >
              Dealer Register
              <ArrowIcon />
            </a>
            <a
              href="#dealer-login"
              className="inline-flex items-center justify-center gap-2 rounded-[10px] border-[1.5px] border-white/75 bg-transparent px-5 py-[13px] text-[14.5px] font-bold text-white no-underline transition duration-200 hover:-translate-y-px hover:border-white hover:bg-white/10 max-[560px]:w-full [&_svg]:text-primary"
            >
              Dealer Login
              <ArrowIcon />
            </a>
          </div>
        </div>

        <FeatureCards />
      </div>
    </section>
  )
}

function BoltIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2 4 13.5h6.5L10 22l9-11.5h-6.5L13 2z" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

export default Hero
