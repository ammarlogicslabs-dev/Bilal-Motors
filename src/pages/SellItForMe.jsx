import { Link } from 'react-router-dom'
import SellCarForm from '../components/sell/SellCarForm'

function SellItForMe() {
  return (
    <main className="px-6 pt-35 pb-16 max-[860px]:px-4 max-[860px]:pt-32.5">
      <div className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-[12.5px] text-muted-text">
          <Link to="/" className="no-underline transition hover:text-primary">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/sell-car" className="no-underline transition hover:text-primary">
            Sell car
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-ink">Sell it for me</span>
        </nav>

        <div className="mb-5 rounded-2xl border border-primary/25 bg-primary/10 px-4 py-3 text-[13.5px] leading-relaxed text-ink">
          Our team will help with your listing, buyer enquiries and offer coordination after you
          submit this request.
        </div>

        <SellCarForm
          service="sell-it-for-me"
          title="Sell it for me"
          subtitle="Share your car details — Bilal Motors will follow up to support the sale from listing through buyer offers."
          submitLabel="Request assisted sale"
          successMessage="Assisted sale request submitted — we will contact you soon"
        />
      </div>
    </main>
  )
}

export default SellItForMe
