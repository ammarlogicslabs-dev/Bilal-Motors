import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Car, MapPin, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { FILTER_OPTIONS, formatMileage, formatPrice } from '../../data/cars'
import { useDataStore } from '../../context/DataStore'
import {
  EmptyState,
  Field,
  MultiImagePicker,
  Modal,
  PageHeader,
  StatusPill,
  inputClass,
  btnPrimary,
  btnSecondary,
  btnIconDanger,
  panelClass,
  toolbarClass
} from '../components/AdminUI'
import { fadeUp, staggerItem } from '../motion'
import { toastConfirm, toastError, toastSuccess } from '../../lib/toast.jsx'
import {
  isValidPkMobile,
  normalizePkMobile,
  sanitizePkMobileInput,
  PK_MOBILE_ERROR,
  PK_MOBILE_PLACEHOLDER,
} from '../../lib/phone'

const EMPTY = {
  title: '',
  make: 'Toyota',
  model: '',
  version: '',
  year: '2022',
  price: '',
  mileage: '',
  city: 'Karachi',
  body: 'Sedan',
  transmission: 'Automatic',
  fuel: 'Petrol',
  color: 'White',
  condition: 'Good',
  registered: 'Punjab',
  assembly: 'Local',
  engineCapacity: '',
  description: '',
  features: '',
  sellerName: 'Bilal Motors',
  sellerType: 'Dealer',
  phone: '03459275777',
  images: [],
  status: 'published',
}

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <h3 className="m-0 text-[11px] font-bold tracking-[0.12em] whitespace-nowrap text-ink uppercase">
        {children}
      </h3>
      <span className="h-px flex-1 bg-border-soft" aria-hidden="true" />
    </div>
  )
}

function CarThumb({ src, className }) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        className={`${className} block bg-bg object-cover`}
      />
    )
  }
  return (
    <span className={`${className} grid place-items-center overflow-hidden bg-bg text-muted-text`}>
      <Car size={18} />
    </span>
  )
}

function RowActions({ car, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => onEdit(car)}
        className={btnSecondary}
      >
        <Pencil size={13} />
        Edit
      </button>
      <button
        type="button"
        onClick={() => onDelete(car)}
        aria-label={`Delete ${car.title}`}
        title="Delete"
        className={btnIconDanger}
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

function AdminCars() {
  const { cars, addCar, updateCar, deleteCar } = useDataStore()
  const reduce = useReducedMotion()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return cars
    return cars.filter((c) =>
      `${c.title} ${c.make} ${c.city} ${c.refId}`.toLowerCase().includes(term),
    )
  }, [cars, q])

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY)
    setOpen(true)
  }

  function openEdit(car) {
    setEditingId(car.id)
    setForm({
      title: car.title,
      make: car.make,
      model: car.model,
      version: car.version || '',
      year: String(car.year),
      price: String(car.price),
      mileage: String(car.mileage),
      city: car.city,
      body: car.body,
      transmission: car.transmission,
      fuel: car.fuel,
      color: car.color,
      condition: car.condition,
      registered: car.registered,
      assembly: car.assembly,
      engineCapacity: car.engineCapacity || '',
      description: car.description || '',
      features: (car.features || []).join(', '),
      sellerName: car.seller?.name || '',
      sellerType: car.seller?.type || 'Individual',
      phone: car.phone ? normalizePkMobile(car.phone) : '',
      images:
        Array.isArray(car.images) && car.images.length
          ? [...car.images]
          : car.image
            ? [car.image]
            : [],
      status: car.status || 'published',
    })
    setOpen(true)
  }

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function onSubmit(e) {
    e.preventDefault()
    const phone = normalizePkMobile(form.phone)
    if (!isValidPkMobile(phone)) {
      toastError(PK_MOBILE_ERROR)
      return
    }
    const images = Array.isArray(form.images) ? form.images.filter(Boolean).slice(0, 20) : []
    const payload = {
      ...form,
      phone,
      images,
      image: images[0] || '',
    }
    if (editingId) {
      updateCar(editingId, payload)
      toastSuccess('Car updated')
    } else {
      addCar(payload)
      toastSuccess('Car listing created')
    }
    setOpen(false)
  }

  async function confirmDelete(car) {
    const ok = await toastConfirm(`Delete “${car.title}”?`, {
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    })
    if (!ok) return
    deleteCar(car.id)
    toastSuccess('Car deleted')
  }

  const total = Array.isArray(cars) ? cars.length : 0
  const searching = q.trim().length > 0
  const priceHint = form.price !== '' && Number(form.price) > 0 ? formatPrice(Number(form.price)) : undefined

  return (
    <div>
      <PageHeader
        title="Cars"
        subtitle="Add, edit, publish, or remove used car listings."
        action={
          <button
            type="button"
            onClick={openCreate}
            className={btnPrimary}
          >
            <Plus size={16} />
            Add car
          </button>
        }
      />

      {/* Toolbar */}
      <motion.div className={toolbarClass} {...fadeUp(reduce, 0.04)}>
        <div className="relative min-w-0 flex-1 basis-60">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-text"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, make, city, ref…"
            aria-label="Search cars"
            className={`${inputClass} pl-10! ${searching ? 'pr-10!' : ''}`}
          />
          {searching ? (
            <button
              type="button"
              onClick={() => setQ('')}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-muted-text transition hover:bg-bg hover:text-ink"
            >
              <X size={14} />
            </button>
          ) : null}
        </div>

        <p className="m-0 rounded-md bg-bg px-2.5 py-1 text-[12px] font-medium text-muted-text">
          {searching ? `${filtered.length} of ${total}` : total} {total === 1 ? 'listing' : 'listings'}
        </p>
      </motion.div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Car}
          title="No cars found"
          text={searching ? 'Try another search or clear it.' : 'Try another search or add a new listing.'}
        />
      ) : (
        <>
          {/* Desktop / tablet table */}
          <motion.div className={`hidden ${panelClass} md:block`} {...fadeUp(reduce, 0.08)}>
            <div className="custom-scrollbar overflow-x-auto">
              <table className="w-full min-w-180 border-collapse text-left text-[13px]">
                <thead className="bg-bg text-[11px] font-bold tracking-widest text-muted-text uppercase">
                  <tr>
                    <th scope="col" className="px-4 py-3">Listing</th>
                    <th scope="col" className="px-4 py-3">Price</th>
                    <th scope="col" className="px-4 py-3">City</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((car) => (
                    <tr key={car.id} className="border-t border-border-soft transition-colors hover:bg-bg/70">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <CarThumb src={car.image} className="h-12 w-17 shrink-0 rounded-md" />
                          <div className="min-w-0">
                            <p className="m-0 max-w-70 truncate font-bold text-ink">{car.title}</p>
                            <p className="m-0 mt-0.5 text-[12px] font-medium text-muted-text">
                              {car.refId} · {car.year} · {formatMileage(car.mileage)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold whitespace-nowrap text-ink">{formatPrice(car.price)}</td>
                      <td className="px-4 py-3 font-medium text-muted-text">
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={12} aria-hidden="true" />
                          {car.city}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={car.status || 'published'} />
                      </td>
                      <td className="px-4 py-3">
                        <RowActions car={car} onEdit={openEdit} onDelete={confirmDelete} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Mobile cards */}
          <div className="grid gap-3 md:hidden">
            <AnimatePresence initial={false}>
              {filtered.map((car, index) => (
                <motion.article
                  key={car.id}
                  {...staggerItem(reduce, index)}
                  className="rounded-xl border border-border-soft bg-surface p-4"
                >
                  <div className="flex gap-3">
                    <CarThumb src={car.image} className="h-16 w-24 shrink-0 rounded-md" />
                    <div className="min-w-0 flex-1">
                      <p className="m-0 line-clamp-2 text-[14px] leading-snug font-semibold text-ink">{car.title}</p>
                      <p className="m-0 mt-1 text-[12px] font-medium text-muted-text">
                        {car.refId} · {car.year} · {formatMileage(car.mileage)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="m-0 text-[15px] font-semibold text-ink">{formatPrice(car.price)}</p>
                      <p className="m-0 mt-0.5 inline-flex items-center gap-1 text-[12px] font-medium text-muted-text">
                        <MapPin size={12} aria-hidden="true" />
                        {car.city}
                      </p>
                    </div>
                    <StatusPill status={car.status || 'published'} />
                  </div>

                  <div className="mt-3 border-t border-border-soft pt-3">
                    <RowActions car={car} onEdit={openEdit} onDelete={confirmDelete} />
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {open ? (
        <Modal title={editingId ? 'Edit car' : 'Add car'} onClose={() => setOpen(false)}>
          <form onSubmit={onSubmit} className="space-y-4">
            <SectionTitle>Basic info</SectionTitle>
            <Field label="Title">
              <input
                className={inputClass}
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. 2022 Toyota Corolla Gli"
                required
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Make">
                <select
                  className={inputClass}
                  value={form.make}
                  onChange={(e) => set('make', e.target.value)}
                >
                  <option value="" disabled>
                    Select make
                  </option>
                  {FILTER_OPTIONS.makes.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Model">
                <input
                  className={inputClass}
                  value={form.model}
                  onChange={(e) => set('model', e.target.value)}
                  placeholder="e.g. Corolla"
                  required
                />
              </Field>
              <Field label="Version">
                <input
                  className={inputClass}
                  value={form.version}
                  onChange={(e) => set('version', e.target.value)}
                  placeholder="e.g. Gli 1.6"
                />
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Year">
                <input
                  type="number"
                  className={inputClass}
                  value={form.year}
                  onChange={(e) => set('year', e.target.value)}
                  placeholder="2022"
                />
              </Field>
              <Field label="Price (PKR)" hint={priceHint}>
                <input
                  type="number"
                  className={inputClass}
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  placeholder="4500000"
                  required
                />
              </Field>
              <Field label="Mileage (km)">
                <input
                  type="number"
                  className={inputClass}
                  value={form.mileage}
                  onChange={(e) => set('mileage', e.target.value)}
                  placeholder="45000"
                />
              </Field>
            </div>

            <SectionTitle>Specs &amp; status</SectionTitle>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="City">
                <select
                  className={inputClass}
                  value={form.city}
                  onChange={(e) => set('city', e.target.value)}
                >
                  <option value="" disabled>
                    Select city
                  </option>
                  {FILTER_OPTIONS.cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Body">
                <select
                  className={inputClass}
                  value={form.body}
                  onChange={(e) => set('body', e.target.value)}
                >
                  <option value="" disabled>
                    Select body type
                  </option>
                  {FILTER_OPTIONS.bodies.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Status">
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) => set('status', e.target.value)}
                >
                  <option value="" disabled>
                    Select status
                  </option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Transmission">
                <select
                  className={inputClass}
                  value={form.transmission}
                  onChange={(e) => set('transmission', e.target.value)}
                >
                  <option value="" disabled>
                    Select transmission
                  </option>
                  {FILTER_OPTIONS.transmissions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Fuel">
                <select
                  className={inputClass}
                  value={form.fuel}
                  onChange={(e) => set('fuel', e.target.value)}
                >
                  <option value="" disabled>
                    Select fuel
                  </option>
                  {FILTER_OPTIONS.fuels.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Color">
                <select
                  className={inputClass}
                  value={form.color}
                  onChange={(e) => set('color', e.target.value)}
                >
                  <option value="" disabled>
                    Select color
                  </option>
                  {FILTER_OPTIONS.colors.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <SectionTitle>Seller &amp; media</SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Seller name">
                <input
                  className={inputClass}
                  value={form.sellerName}
                  onChange={(e) => set('sellerName', e.target.value)}
                  placeholder="e.g. Bilal Motors"
                />
              </Field>
              <Field label="Phone" >
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => set('phone', sanitizePkMobileInput(e.target.value))}
                  placeholder={PK_MOBILE_PLACEHOLDER}
                  maxLength={11}
                  pattern="03[0-9]{9}"
                  title={PK_MOBILE_ERROR}
                  required
                />
              </Field>
            </div>
            <MultiImagePicker
              label="Photos"
              value={form.images}
              onChange={(images) => set('images', images)}
              max={20}
            />

            <SectionTitle>Details</SectionTitle>
            <Field label="Description">
              <textarea
                className={`${inputClass} min-h-24 resize-y`}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Write a short listing description…"
              />
            </Field>
            <Field label="Features (comma separated)" hint="Example: ABS, Airbags, Sunroof, Alloy rims">
              <input
                className={inputClass}
                value={form.features}
                onChange={(e) => set('features', e.target.value)}
                placeholder="ABS, Airbags, Sunroof, Alloy rims"
              />
            </Field>

            <div className="flex flex-col-reverse gap-2 border-t border-border-soft pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={btnSecondary}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={btnPrimary}
              >
                {editingId ? 'Save changes' : 'Create listing'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}

export default AdminCars