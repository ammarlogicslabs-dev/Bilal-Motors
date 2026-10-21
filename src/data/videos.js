export const VIDEOS = [
  {
    slug: 'suv-inspection',
    title: 'SUV Exterior Inspection Walkthrough',
    meta: 'Walkaround · 4 min',
    category: 'Walkaround',
    duration: '4:12',
    description:
      'Learn what to check on an SUV exterior before you buy — panels, lights, tyres, and common wear points that matter in used-car deals.',
    image: '/images/videos/suv-inspection.jpg',
  },
  {
    slug: 'first-car-checklist',
    title: 'First Used Car Checklist',
    meta: 'Buying guide · 6 min',
    category: 'Buying guide',
    duration: '6:05',
    description:
      'A clear first-time buyer checklist covering documents, test drive basics, and red flags so you walk into a deal with confidence.',
    image: '/images/videos/first-car-checklist.jpg',
  },
  {
    slug: 'engine-sound',
    title: 'Engine Sound Check Explained',
    meta: 'Inspection · 5 min',
    category: 'Inspection',
    duration: '5:20',
    description:
      'Understand common engine sounds during idle and rev — what is normal, what needs a second look, and when to walk away.',
    image: '/images/videos/engine-sound.jpg',
  },
]

export function getVideo(slug) {
  return VIDEOS.find((item) => item.slug === slug) ?? null
}

export function getRelatedVideos(slug, limit = 2) {
  return VIDEOS.filter((item) => item.slug !== slug).slice(0, limit)
}
