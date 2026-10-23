import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { CARS as SEED_CARS } from '../data/cars'
import { BLOGS as SEED_BLOGS } from '../data/blogs'
import { VIDEOS as SEED_VIDEOS } from '../data/videos'
import { isValidPkMobile, normalizePkMobile, toWhatsappDigits } from '../lib/phone'

const STORAGE_KEY = 'bilal-motors-admin-data-v1'
const AUTH_KEY = 'bilal-motors-auth-v2'
const USERS_KEY = 'bilal-motors-users-v1'

const SEED_USERS = [
  {
    id: 'u-admin',
    username: 'admin',
    password: 'bilal2026',
    name: 'Admin',
    email: 'admin@bilalmotors.com',
    role: 'admin',
    createdAt: '2026-10-01',
  },
  {
    id: 'u-user',
    username: 'user',
    password: 'user123',
    name: 'Hassan Ali',
    email: 'hassan@email.com',
    role: 'user',
    createdAt: '2026-10-15',
  },
]

/** @deprecated use SEED_USERS — kept for login demo labels */
const DEMO_ACCOUNTS = SEED_USERS

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return SEED_USERS.map((u) => ({ ...u }))
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : SEED_USERS.map((u) => ({ ...u }))
  } catch {
    return SEED_USERS.map((u) => ({ ...u }))
  }
}

function loadAuthUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    // Migrate old admin-only flag
    if (raw === '1') {
      const admin = {
        id: SEED_USERS[0].id,
        username: SEED_USERS[0].username,
        name: SEED_USERS[0].name,
        email: SEED_USERS[0].email,
        role: 'admin',
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify(admin))
      return admin
    }
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const SEED_REQUESTS = [
  {
    id: 'req1',
    type: 'sell-car',
    status: 'pending',
    createdAt: '2026-10-20',
    name: 'Hassan Ali',
    phone: '03001112233',
    email: 'hassan@email.com',
    title: '2018 Honda City Aspire',
    make: 'Honda',
    model: 'City',
    version: 'Aspire',
    year: 2018,
    price: 3650000,
    mileage: 72000,
    city: 'Lahore',
    body: 'Sedan',
    transmission: 'Automatic',
    fuel: 'Petrol',
    color: 'White',
    condition: 'Good',
    registered: 'Punjab',
    assembly: 'Local',
    notes: 'Single owner, full service history.',
  },
  {
    id: 'req2',
    type: 'sell-car',
    status: 'pending',
    createdAt: '2026-10-21',
    name: 'Nadia Khan',
    phone: '03214455667',
    email: 'nadia@email.com',
    title: '2021 Suzuki Cultus VXL',
    make: 'Suzuki',
    model: 'Cultus',
    version: 'VXL',
    year: 2021,
    price: 2890000,
    mileage: 31000,
    city: 'Karachi',
    body: 'Hatchback',
    transmission: 'Manual',
    fuel: 'Petrol',
    color: 'Silver',
    condition: 'Excellent',
    registered: 'Sindh',
    assembly: 'Local',
    notes: 'Urgent sale, negotiable.',
  },
  
]

function withStatus(cars) {
  return cars.map((car) => ({
    ...car,
    status: car.status || 'published',
  }))
}

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function galleryFor(body) {
  if (body === 'Sedan') {
    return [
      '/images/body/sedan.jpg',
      '/images/body/hatchback.jpg',
      '/images/body/crossover.jpg',
      '/images/videos/first-car-checklist.jpg',
      '/images/blogs/negotiation-tips.jpg',
      '/images/body/sedan.jpg',
    ]
  }
  if (body === 'SUV' || body === 'Crossover') {
    return [
      '/images/body/suv.jpg',
      '/images/body/crossover.jpg',
      '/images/videos/suv-inspection.jpg',
      '/images/body/pickup.jpg',
      '/images/blogs/fuel-economy.jpg',
      '/images/body/suv.jpg',
    ]
  }
  if (body === 'Hatchback') {
    return [
      '/images/body/hatchback.jpg',
      '/images/body/sedan.jpg',
      '/images/videos/engine-sound.jpg',
      '/images/blogs/documents-checklist.jpg',
      '/images/body/hatchback.jpg',
      '/images/body/crossover.jpg',
    ]
  }
  return [
    '/images/body/crossover.jpg',
    '/images/body/suv.jpg',
    '/images/body/van.jpg',
    '/images/body/pickup.jpg',
    '/images/body/convertible.jpg',
    '/images/videos/suv-inspection.jpg',
  ]
}

function uid(prefix) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const DataStoreContext = createContext(null)

export function DataStoreProvider({ children }) {
  const stored = loadStored()
  const [cars, setCars] = useState(() => withStatus(stored?.cars ?? SEED_CARS))
  const [blogs, setBlogs] = useState(() => stored?.blogs ?? SEED_BLOGS)
  const [videos, setVideos] = useState(() => stored?.videos ?? SEED_VIDEOS)
  const [requests, setRequests] = useState(() => stored?.requests ?? SEED_REQUESTS)
  const [users, setUsers] = useState(() => loadUsers())
  const [currentUser, setCurrentUser] = useState(() => loadAuthUser())

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ cars, blogs, videos, requests }),
      )
    } catch {
      console.error('Error saving data to localStorage')
    }
  }, [cars, blogs, videos, requests])

  useEffect(() => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
    } catch {
      console.error('Error saving users to localStorage')
    }
  }, [users])

  useEffect(() => {
    if (!currentUser) return
    const match = users.find(
      (u) =>
        (currentUser.id && u.id === currentUser.id) ||
        u.username.toLowerCase() === String(currentUser.username || '').toLowerCase(),
    )
    if (!match) {
      localStorage.removeItem(AUTH_KEY)
      setCurrentUser(null)
      return
    }
    if (
      match.role !== currentUser.role ||
      match.name !== currentUser.name ||
      match.email !== currentUser.email ||
      match.id !== currentUser.id
    ) {
      const session = {
        id: match.id,
        username: match.username,
        name: match.name,
        email: match.email,
        role: match.role,
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify(session))
      setCurrentUser(session)
    }
  }, [users, currentUser])

  const login = useCallback(
    (username, password) => {
      const match = users.find(
        (a) =>
          a.username.toLowerCase() === String(username).trim().toLowerCase() &&
          a.password === password,
      )
      if (!match) return null
      const session = {
        id: match.id,
        username: match.username,
        name: match.name,
        email: match.email,
        role: match.role,
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify(session))
      setCurrentUser(session)
      return session
    },
    [users],
  )

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY)
    setCurrentUser(null)
  }, [])

  const addUser = useCallback(
    (payload) => {
      const username = String(payload.username || '')
        .trim()
        .toLowerCase()
      if (!username || !payload.password) {
        return { ok: false, error: 'Username and password are required.' }
      }
      if (users.some((u) => u.username.toLowerCase() === username)) {
        return { ok: false, error: 'Username already exists.' }
      }
      const next = {
        id: uid('u'),
        username,
        password: String(payload.password),
        name: String(payload.name || username).trim(),
        email: String(payload.email || '').trim(),
        role: payload.role === 'admin' ? 'admin' : 'user',
        createdAt: new Date().toISOString().slice(0, 10),
      }
      setUsers((prev) => [next, ...prev])
      return { ok: true, user: next }
    },
    [users],
  )

  const updateUser = useCallback(
    (id, patch) => {
      const username = patch.username
        ? String(patch.username).trim().toLowerCase()
        : null
      if (
        username &&
        users.some((u) => u.id !== id && u.username.toLowerCase() === username)
      ) {
        return { ok: false, error: 'Username already exists.' }
      }
      const target = users.find((u) => u.id === id)
      if (!target) return { ok: false, error: 'User not found.' }

      const nextRole =
        patch.role === 'admin' || patch.role === 'user' ? patch.role : target.role
      if (
        target.role === 'admin' &&
        nextRole !== 'admin' &&
        users.filter((u) => u.role === 'admin').length <= 1
      ) {
        return { ok: false, error: 'At least one admin account is required.' }
      }

      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== id) return u
          return {
            ...u,
            name: patch.name != null ? String(patch.name).trim() : u.name,
            email: patch.email != null ? String(patch.email).trim() : u.email,
            username: username || u.username,
            role: nextRole,
            password:
              patch.password != null && String(patch.password).trim() !== ''
                ? String(patch.password)
                : u.password,
          }
        }),
      )

      if (currentUser?.id === id || currentUser?.username === target.username) {
        const session = {
          id,
          username: username || target.username,
          name: patch.name != null ? String(patch.name).trim() : target.name,
          email: patch.email != null ? String(patch.email).trim() : target.email,
          role: nextRole,
        }
        localStorage.setItem(AUTH_KEY, JSON.stringify(session))
        setCurrentUser(session)
      }

      return { ok: true }
    },
    [users, currentUser],
  )

  const deleteUser = useCallback(
    (id) => {
      const target = users.find((u) => u.id === id)
      if (!target) return { ok: false, error: 'User not found.' }
      if (currentUser?.id === id || currentUser?.username === target.username) {
        return { ok: false, error: 'You cannot delete your own account.' }
      }
      if (
        target.role === 'admin' &&
        users.filter((u) => u.role === 'admin').length <= 1
      ) {
        return { ok: false, error: 'At least one admin account is required.' }
      }
      setUsers((prev) => prev.filter((u) => u.id !== id))
      return { ok: true }
    },
    [users, currentUser],
  )

  const publishedCars = useMemo(
    () => cars.filter((c) => c.status === 'published'),
    [cars],
  )

  const addCar = useCallback((payload) => {
    const id = uid('c')
    const body = payload.body || 'Sedan'
    const next = {
      id,
      refId: payload.refId || `BM-${String(Math.floor(10000 + Math.random() * 89999))}`,
      title: payload.title,
      make: payload.make,
      model: payload.model,
      version: payload.version || '',
      year: Number(payload.year) || new Date().getFullYear(),
      price: Number(payload.price) || 0,
      mileage: Number(payload.mileage) || 0,
      city: payload.city || 'Karachi',
      body,
      transmission: payload.transmission || 'Automatic',
      fuel: payload.fuel || 'Petrol',
      color: payload.color || 'White',
      condition: payload.condition || 'Good',
      registered: payload.registered || 'Punjab',
      assembly: payload.assembly || 'Local',
      engineCapacity: payload.engineCapacity || '',
      driveType: payload.driveType || 'FWD',
      seating: payload.seating || '5',
      negotiable: Boolean(payload.negotiable),
      views: 0,
      published: 'Just now',
      updated: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      phone: (() => {
        const p = normalizePkMobile(payload.phone)
        return isValidPkMobile(p) ? p : '03459275777'
      })(),
      whatsapp: (() => {
        const fromPhone = normalizePkMobile(payload.phone || payload.whatsapp)
        if (isValidPkMobile(fromPhone)) return toWhatsappDigits(fromPhone)
        return toWhatsappDigits(payload.whatsapp || '03459275777')
      })(),
      seller: {
        name: payload.sellerName || 'Bilal Motors',
        type: payload.sellerType || 'Dealer',
        memberSince: 'Member since 2026',
      },
      image:
        (Array.isArray(payload.images) && payload.images[0]) ||
        payload.image ||
        galleryFor(body)[0],
      images: (() => {
        if (Array.isArray(payload.images) && payload.images.length) {
          return payload.images.filter(Boolean).slice(0, 20)
        }
        if (payload.image) {
          return [payload.image, ...galleryFor(body).filter((src) => src !== payload.image)].slice(
            0,
            20,
          )
        }
        return galleryFor(body).slice(0, 20)
      })(),
      description: payload.description || '',
      features: Array.isArray(payload.features)
        ? payload.features
        : String(payload.features || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
      inspection: ['Engine', 'Exterior', 'Suspension', 'Interior'],
      status: payload.status || 'published',
    }
    setCars((prev) => [next, ...prev])
    return next
  }, [])

  const updateCar = useCallback((id, patch) => {
    setCars((prev) =>
      prev.map((car) => {
        if (car.id !== id) return car
        const body = patch.body ?? car.body
        const features = Array.isArray(patch.features)
          ? patch.features
          : patch.features != null
            ? String(patch.features)
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            : car.features
        const nextPhone =
          patch.phone != null
            ? (() => {
                const p = normalizePkMobile(patch.phone)
                return isValidPkMobile(p) ? p : car.phone
              })()
            : car.phone
        return {
          ...car,
          ...patch,
          year: patch.year != null ? Number(patch.year) : car.year,
          price: patch.price != null ? Number(patch.price) : car.price,
          mileage: patch.mileage != null ? Number(patch.mileage) : car.mileage,
          features,
          phone: nextPhone,
          whatsapp:
            patch.phone != null || patch.whatsapp != null
              ? toWhatsappDigits(patch.whatsapp || nextPhone)
              : car.whatsapp,
          image: (() => {
            if (Array.isArray(patch.images) && patch.images.length) return patch.images[0]
            if (patch.image != null && patch.image !== '') return patch.image
            return car.image
          })(),
          images: (() => {
            if (Array.isArray(patch.images)) {
              return patch.images.filter(Boolean).slice(0, 20)
            }
            if (patch.image) {
              return [patch.image, ...(car.images || []).filter((src) => src !== patch.image)].slice(
                0,
                20,
              )
            }
            if (patch.body) return galleryFor(body).slice(0, 20)
            return car.images
          })(),
          seller: patch.sellerName
            ? {
                name: patch.sellerName,
                type: patch.sellerType || car.seller?.type || 'Individual',
                memberSince: car.seller?.memberSince || 'Member since 2026',
              }
            : car.seller,
        }
      }),
    )
  }, [])

  const deleteCar = useCallback((id) => {
    setCars((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const addBlog = useCallback((payload) => {
    const slug = payload.slug || slugify(payload.title) || uid('blog-')
    const next = {
      slug,
      title: payload.title,
      category: payload.category || 'Guides',
      readTime: payload.readTime || '5 min read',
      date:
        payload.date ||
        new Date().toISOString().slice(0, 10),
      excerpt: payload.excerpt || '',
      image: payload.image || '/images/blogs/negotiation-tips.jpg', // fallback if none uploaded
      body: Array.isArray(payload.body)
        ? payload.body
        : String(payload.body || '')
            .split(/\n+/)
            .map((s) => s.trim())
            .filter(Boolean),
    }
    setBlogs((prev) => [next, ...prev.filter((b) => b.slug !== slug)])
    return next
  }, [])

  const updateBlog = useCallback((slug, patch) => {
    setBlogs((prev) =>
      prev.map((blog) => {
        if (blog.slug !== slug) return blog
        const body = Array.isArray(patch.body)
          ? patch.body
          : patch.body != null
            ? String(patch.body)
                .split(/\n+/)
                .map((s) => s.trim())
                .filter(Boolean)
            : blog.body
        return { ...blog, ...patch, body }
      }),
    )
  }, [])

  const deleteBlog = useCallback((slug) => {
    setBlogs((prev) => prev.filter((b) => b.slug !== slug))
  }, [])

  const addVideo = useCallback((payload) => {
    const slug = payload.slug || slugify(payload.title) || uid('vid-')
    const next = {
      slug,
      title: payload.title,
      meta: payload.meta || `${payload.category || 'Guide'} · ${payload.duration || '5 min'}`,
      category: payload.category || 'Buying guide',
      duration: payload.duration || '5:00',
      description: payload.description || '',
      image: payload.image || '/images/videos/suv-inspection.jpg', // fallback if none uploaded
    }
    setVideos((prev) => [next, ...prev.filter((v) => v.slug !== slug)])
    return next
  }, [])

  const updateVideo = useCallback((slug, patch) => {
    setVideos((prev) =>
      prev.map((video) => (video.slug === slug ? { ...video, ...patch } : video)),
    )
  }, [])

  const deleteVideo = useCallback((slug) => {
    setVideos((prev) => prev.filter((v) => v.slug !== slug))
  }, [])

  const addRequest = useCallback((payload) => {
    const next = {
      id: uid('req'),
      type: payload.type || 'sell-car',
      service: payload.service || 'free-ad',
      status: 'pending',
      createdAt: new Date().toISOString().slice(0, 10),
      name: payload.name || '',
      phone: (() => {
        const p = normalizePkMobile(payload.phone)
        return isValidPkMobile(p) ? p : ''
      })(),
      email: payload.email || '',
      title: payload.title || '',
      make: payload.make || '',
      model: payload.model || '',
      version: payload.version || '',
      year: Number(payload.year) || new Date().getFullYear(),
      price: Number(payload.price) || 0,
      mileage: Number(payload.mileage) || 0,
      city: payload.city || '',
      body: payload.body || 'Sedan',
      transmission: payload.transmission || 'Automatic',
      fuel: payload.fuel || 'Petrol',
      color: payload.color || 'White',
      condition: payload.condition || 'Good',
      registered: payload.registered || 'Punjab',
      assembly: payload.assembly || 'Local',
      notes: payload.notes || '',
      images: Array.isArray(payload.images)
        ? payload.images.filter(Boolean).slice(0, 20)
        : payload.image
          ? [payload.image]
          : [],
      image:
        (Array.isArray(payload.images) && payload.images[0]) || payload.image || '',
      subject: payload.subject || '',
      message: payload.message || '',
    }
    setRequests((prev) => [next, ...prev])
    return next
  }, [])

  const updateRequest = useCallback((id, status) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }, [])

  const approveRequest = useCallback(
    (id) => {
      const req = requests.find((r) => r.id === id)
      if (!req) return
      if (req.type === 'sell-car') {
        addCar({
          title: req.title,
          make: req.make,
          model: req.model,
          version: req.version,
          year: req.year,
          price: req.price,
          mileage: req.mileage,
          city: req.city,
          body: req.body,
          transmission: req.transmission,
          fuel: req.fuel,
          color: req.color,
          condition: req.condition,
          registered: req.registered,
          assembly: req.assembly,
          description: req.notes,
          sellerName: req.name,
          sellerType: 'Individual',
          phone: req.phone,
          images:
            Array.isArray(req.images) && req.images.length
              ? req.images
              : req.image
                ? [req.image]
                : [],
          image: req.image || (Array.isArray(req.images) && req.images[0]) || '',
          status: 'published',
        })
      }
      updateRequest(id, 'approved')
    },
    [requests, addCar, updateRequest],
  )

  const rejectRequest = useCallback(
    (id) => updateRequest(id, 'rejected'),
    [updateRequest],
  )

  const resetData = useCallback(() => {
    setCars(withStatus(SEED_CARS))
    setBlogs(SEED_BLOGS)
    setVideos(SEED_VIDEOS)
    setRequests(SEED_REQUESTS)
    setUsers(SEED_USERS.map((u) => ({ ...u })))
  }, [])

  const value = useMemo(
    () => ({
      cars,
      publishedCars,
      blogs,
      videos,
      requests,
      users,
      currentUser,
      adminUser: currentUser?.role === 'admin' ? currentUser : null,
      isAdmin: currentUser?.role === 'admin',
      isLoggedIn: Boolean(currentUser),
      login,
      logout,
      addUser,
      updateUser,
      deleteUser,
      DEMO_ACCOUNTS: DEMO_ACCOUNTS.map(({ password: _p, ...rest }) => rest),
      addCar,
      updateCar,
      deleteCar,
      addBlog,
      updateBlog,
      deleteBlog,
      addVideo,
      updateVideo,
      deleteVideo,
      addRequest,
      approveRequest,
      rejectRequest,
      updateRequest,
      resetData,
      getCarById: (id) => cars.find((c) => c.id === id) ?? null,
      getBlog: (slug) => blogs.find((b) => b.slug === slug) ?? null,
      getVideo: (slug) => videos.find((v) => v.slug === slug) ?? null,
      getRelatedBlogs: (slug, limit = 2) =>
        blogs.filter((b) => b.slug !== slug).slice(0, limit),
      getRelatedVideos: (slug, limit = 2) =>
        videos.filter((v) => v.slug !== slug).slice(0, limit),
    }),
    [
      cars,
      publishedCars,
      blogs,
      videos,
      requests,
      users,
      currentUser,
      login,
      logout,
      addUser,
      updateUser,
      deleteUser,
      addCar,
      updateCar,
      deleteCar,
      addBlog,
      updateBlog,
      deleteBlog,
      addVideo,
      updateVideo,
      deleteVideo,
      addRequest,
      approveRequest,
      rejectRequest,
      updateRequest,
      resetData,
    ],
  )

  return <DataStoreContext.Provider value={value}>{children}</DataStoreContext.Provider>
}

export function useDataStore() {
  const ctx = useContext(DataStoreContext)
  if (!ctx) throw new Error('useDataStore must be used within DataStoreProvider')
  return ctx
}
