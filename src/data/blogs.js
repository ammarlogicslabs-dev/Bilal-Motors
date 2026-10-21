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

export function getRelatedBlogs(slug, limit = 2) {
  return BLOGS.filter((item) => item.slug !== slug).slice(0, limit)
}
