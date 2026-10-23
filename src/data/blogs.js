export const BLOGS = [
  {
    slug: 'negotiation-tips',
    title: 'Negotiation Tips for Used Cars',
    category: 'Buying tips',
    readTime: '5 min read',
    date: 'Oct 2026',
    excerpt:
      'Practical ways to discuss price, condition, and paperwork so you close with confidence.',
    image: '/images/blogs/negotiation-tips.jpg',
    body: [
      'Negotiating a used car is easier when you prepare facts first. Check local market ranges for the same make, model, year, and city before you talk numbers.',
      'Use the inspection findings as your lever — paint work, tyre age, service gaps, and missing documents all affect fair value. Stay calm and specific.',
      'Agree on payment method, transfer timeline, and what stays with the car. Put key points in writing so both sides leave with clarity.',
    ],
  },
  {
    slug: 'documents-checklist',
    title: 'Documents Checklist Before Buying',
    category: 'Checklist',
    readTime: '4 min read',
    date: 'Oct 2026',
    excerpt:
      'Registration, transfer, and key papers to verify before you hand over payment.',
    image: '/images/blogs/documents-checklist.jpg',
    body: [
      'Before payment, confirm registration book details match the seller and the vehicle. Check chassis and engine numbers against the paperwork.',
      'Ask for transfer history, paid token tax evidence where relevant, and any outstanding dues. Keep photocopies of every signed page.',
      'If something feels incomplete, pause. Clean paperwork protects both buyer and seller after the deal is done.',
    ],
  },
  {
    slug: 'fuel-economy',
    title: 'How to Improve Fuel Economy',
    category: 'Driving tips',
    readTime: '6 min read',
    date: 'Sep 2026',
    excerpt:
      'Simple driving and maintenance habits that help stretch every litre on Pakistan roads.',
    image: '/images/blogs/fuel-economy.jpg',
    body: [
      'Smooth acceleration and steady speeds usually beat aggressive stop-start driving in city traffic. Plan routes to reduce idle time where you can.',
      'Keep tyre pressure correct, service on schedule, and avoid unnecessary roof load. Small habits add up across a monthly commute.',
      'Choose the right body type for your daily use — an oversized SUV for short city trips can cost more fuel than a compact hatchback.',
    ],
  },
]

export function getBlog(slug) {
  return BLOGS.find((item) => item.slug === slug) ?? null
}

const MONTHS = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
}

/** Normalize stored blog date → YYYY-MM-DD for <input type="date"> */
export function toBlogDateInput(value) {
  if (!value) return ''
  const raw = String(value).trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw

  const iso = Date.parse(raw)
  if (!Number.isNaN(iso)) {
    const d = new Date(iso)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  // "Oct 2026" / "October 2026"
  const match = raw.match(/^([A-Za-z]+)\s+(\d{4})$/)
  if (match) {
    const month = MONTHS[match[1].toLowerCase()]
    if (month != null) {
      const y = match[2]
      const m = String(month + 1).padStart(2, '0')
      return `${y}-${m}-01`
    }
  }

  return ''
}

/** Display blog date (supports ISO and legacy labels like "Oct 2026") */
export function formatBlogDate(value) {
  if (!value) return '—'
  const input = toBlogDateInput(value)
  if (!input) return String(value)
  const d = new Date(`${input}T12:00:00`)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function todayBlogDateInput() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function getRelatedBlogs(slug, limit = 2) {
  return BLOGS.filter((item) => item.slug !== slug).slice(0, limit)
}
