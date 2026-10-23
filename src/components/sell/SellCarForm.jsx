import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FILTER_OPTIONS } from '../../data/cars'
import { useDataStore } from '../../context/DataStore'
import { MultiImagePicker, Field, inputClass } from '../../admin/components/AdminUI'
import { toastError, toastSuccess } from '../../lib/toast.jsx'
import {
  isValidPkMobile,
  normalizePkMobile,
  sanitizePkMobileInput,
  PK_MOBILE_ERROR,
  PK_MOBILE_PLACEHOLDER,
} from '../../lib/phone'

const EMPTY = {
  name: '',
  phone: '',
  email: '',
  make: 'Toyota',
  model: '',
  version: '',
  year: String(new Date().getFullYear() - 2),
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
  notes: '',
  images: [],
}

function SellCarForm({
  service,
  title,
  subtitle,
  submitLabel,
  successMessage,
}) {
  const { addRequest, currentUser } = useDataStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    ...EMPTY,
    name: currentUser?.name || '',
    email: currentUser?.email || '',
  })
  const [submitting, setSubmitting] = useState(false)

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
    if (!images.length) {
      toastError('Please upload at least one photo of your car.')
      return
    }
    setSubmitting(true)
    try {
      const titleText = `${form.year} ${form.make} ${form.model}${form.version ? ` ${form.version}` : ''}`.trim()
      addRequest({
        type: 'sell-car',
        service,
        name: form.name,
        phone,
        email: form.email,
        title: titleText,
        make: form.make,
        model: form.model,
        version: form.version,
        year: form.year,
        price: form.price,
        mileage: form.mileage,
        city: form.city,
        body: form.body,
        transmission: form.transmission,
        fuel: form.fuel,
        color: form.color,
        condition: form.condition,
        registered: form.registered,
        assembly: form.assembly,
        notes: form.notes,
        images,
        image: images[0],
      })
      toastSuccess(successMessage)
      navigate('/sell-car', { replace: true })
    } catch {
      toastError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h1 className="m-0 text-[clamp(1.5rem,3vw,2rem)] font-extrabold tracking-[-0.02em] text-ink">
          {title}
        </h1>
        <p className="mt-2 mb-0 text-[14px] leading-relaxed text-muted-text">{subtitle}</p>
      </div>

      <section className="rounded-2xl border border-border-soft bg-surface p-5 shadow-soft max-[560px]:p-4">
        <h2 className="m-0 text-[13px] font-extrabold tracking-[0.08em] text-ink uppercase">
          Contact details
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Your name">
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Hassan Ali"
              autoComplete="name"
              required
            />
          </Field>
          <Field label="Phone">
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
          <Field label="Email">
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="name@email.com"
              autoComplete="email"
              required
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-border-soft bg-surface p-5 shadow-soft max-[560px]:p-4">
        <h2 className="m-0 text-[13px] font-extrabold tracking-[0.08em] text-ink uppercase">
          Vehicle details
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Field label="Make">
            <select
              className={inputClass}
              value={form.make}
              onChange={(e) => set('make', e.target.value)}
            >
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
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Field label="Year">
            <input
              type="number"
              className={inputClass}
              value={form.year}
              onChange={(e) => set('year', e.target.value)}
              placeholder="2022"
              required
            />
          </Field>
          <Field label="Asking price (PKR)">
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
              required
            />
          </Field>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Field label="City">
            <select
              className={inputClass}
              value={form.city}
              onChange={(e) => set('city', e.target.value)}
            >
              {FILTER_OPTIONS.cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Body type">
            <select
              className={inputClass}
              value={form.body}
              onChange={(e) => set('body', e.target.value)}
            >
              {FILTER_OPTIONS.bodies.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Transmission">
            <select
              className={inputClass}
              value={form.transmission}
              onChange={(e) => set('transmission', e.target.value)}
            >
              {FILTER_OPTIONS.transmissions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Field label="Fuel">
            <select
              className={inputClass}
              value={form.fuel}
              onChange={(e) => set('fuel', e.target.value)}
            >
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
              {FILTER_OPTIONS.colors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Condition">
            <select
              className={inputClass}
              value={form.condition}
              onChange={(e) => set('condition', e.target.value)}
            >
              {FILTER_OPTIONS.conditions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Registered in">
            <select
              className={inputClass}
              value={form.registered}
              onChange={(e) => set('registered', e.target.value)}
            >
              {FILTER_OPTIONS.registered.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Assembly">
            <select
              className={inputClass}
              value={form.assembly}
              onChange={(e) => set('assembly', e.target.value)}
            >
              {FILTER_OPTIONS.assemblies.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-border-soft bg-surface p-5 shadow-soft max-[560px]:p-4">
        <h2 className="m-0 text-[13px] font-extrabold tracking-[0.08em] text-ink uppercase">
          Photos & notes
        </h2>
        <div className="mt-4 space-y-4">
          <MultiImagePicker
            label="Car photos"
            value={form.images}
            onChange={(images) => set('images', images)}
            max={20}
          />
          <Field label="Additional notes">
            <textarea
              className={`${inputClass} min-h-28 resize-y`}
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Service history, known issues, extras…"
            />
          </Field>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/sell-car"
          className="text-center text-[13px] font-bold text-muted-text no-underline hover:text-ink"
        >
          ← Back to selling options
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-primary px-6 py-3.5 text-[14px] font-extrabold text-ink shadow-cta transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Submitting…' : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default SellCarForm
