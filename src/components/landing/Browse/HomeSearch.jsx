import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MAKES = ['Honda', 'Hyundai', 'KIA', 'Suzuki', 'Toyota', 'Changan', 'BYD', 'MG']
const CITIES = [
  'Islamabad',
  'Karachi',
  'Lahore',
  'Peshawar',
  'Rawalpindi',
  'Faisalabad',
]

function HomeSearch() {
  const navigate = useNavigate()
  const [make, setMake] = useState('')
  const [city, setCity] = useState('')
  const [query, setQuery] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    if (query.trim()) params.set('q', query.trim())
    const qs = params.toString()

    if (make) {
      navigate(qs ? `/used-car/${make.toLowerCase()}?${qs}` : `/used-car/${make.toLowerCase()}`)
      return
    }

    navigate(qs ? `/used-car?${qs}` : '/used-car')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 rounded-2xl border border-border-soft bg-surface p-3 shadow-soft max-[980px]:flex-col max-[980px]:items-stretch"
      role="search"
      aria-label="Search used cars"
    >
      <div className="shrink-0 px-3 py-1 max-[980px]:px-1">
        <p className="m-0 text-[10px] font-bold tracking-[0.12em] text-primary uppercase">
          Find your next car
        </p>
        <p className="m-0 text-[15px] font-extrabold tracking-[-0.02em] text-ink">
          Search across Pakistan
        </p>
      </div>

      <div className="hidden h-10 w-px shrink-0 bg-border-soft min-[981px]:block" aria-hidden="true" />

      <label className="flex min-w-0 flex-1 flex-col gap-0.5 rounded-xl border border-border-soft bg-bg px-3 py-2">
        <span className="text-[10px] font-bold tracking-[0.08em] text-muted-text uppercase">
          Make
        </span>
        <select
          value={make}
          onChange={(e) => setMake(e.target.value)}
          className="w-full appearance-none border-0 bg-transparent p-0 text-[14px] font-bold text-ink outline-none"
        >
          <option value="">Any make</option>
          {MAKES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className="flex min-w-0 flex-1 flex-col gap-0.5 rounded-xl border border-border-soft bg-bg px-3 py-2">
        <span className="text-[10px] font-bold tracking-[0.08em] text-muted-text uppercase">
          City
        </span>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full appearance-none border-0 bg-transparent p-0 text-[14px] font-bold text-ink outline-none"
        >
          <option value="">Any city</option>
          {CITIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className="flex min-w-0 flex-[1.35] flex-col gap-0.5 rounded-xl border border-border-soft bg-bg px-3 py-2">
        <span className="text-[10px] font-bold tracking-[0.08em] text-muted-text uppercase">
          Keyword
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Make, model or reference"
          className="w-full border-0 bg-transparent p-0 text-[14px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-muted-text"
        />
      </label>

      <button
        type="submit"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-ink shadow-cta transition hover:bg-primary-hover max-[980px]:w-full"
      >
        <SearchIcon />
        Search
      </button>
    </form>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default HomeSearch
