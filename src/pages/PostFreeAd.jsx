import { Link } from 'react-router-dom'
import SellCarForm from '../components/sell/SellCarForm'

function PostFreeAd() {
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
          <span className="font-semibold text-ink">Post free ad</span>
        </nav>

        <SellCarForm
          service="free-ad"
          title="Post a free ad"
          subtitle="Add your vehicle details and a clear photo. Your request goes to our team for review before it appears in listings."
          submitLabel="Submit free ad"
          successMessage="Ad submitted — we will review it shortly"
        />
      </div>
    </main>
  )
}

export default PostFreeAd
