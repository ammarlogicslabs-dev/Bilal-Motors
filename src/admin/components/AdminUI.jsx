import { useEffect, useId, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Image as ImageIcon, Inbox, Trash2, Upload, X } from 'lucide-react'
import { toastError, toastSuccess } from '../../lib/toast.jsx'
import { fadeUp, modalBackdrop, modalPanel } from '../motion'

/** Shared action styles — brand ice-blue + clear intent colors */
export const btnPrimary =
  'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-[13px] font-bold text-ink shadow-[0_4px_12px_rgba(110,196,224,0.35)] transition hover:bg-primary-hover hover:shadow-[0_6px_16px_rgba(110,196,224,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50'

export const btnSecondary =
  'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border-soft bg-surface px-3 py-1.5 text-[12.5px] font-semibold text-ink transition hover:border-primary/50 hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/40 disabled:cursor-not-allowed disabled:opacity-50'

export const btnSuccess =
  'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-[13px] font-bold text-white shadow-[0_4px_12px_rgba(5,150,105,0.28)] transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-50'

export const btnDanger =
  'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-[13px] font-bold text-white shadow-[0_4px_12px_rgba(220,38,38,0.28)] transition hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-40'

export const btnIconDanger =
  'grid size-8 cursor-pointer place-items-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40'

export const panelClass = 'overflow-hidden rounded-xl border border-border-soft bg-surface'

export const toolbarClass =
  'mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-border-soft bg-surface px-3 py-2.5'

/**
 * Page title lives in the layout breadcrumb on desktop;
 * mobile keeps its own heading from the layout.
 */
export function PageHeader({ title, subtitle, action }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className="mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-3"
      {...fadeUp(reduce, 0)}
    >
      <div className="min-w-0">
        <h1 className="m-0 hidden text-[20px] leading-tight font-bold tracking-tight text-ink min-[901px]:block">
          {title}
        </h1>
        {subtitle ? (
          <p className="m-0 text-[13px] font-medium text-muted-text min-[901px]:mt-1">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </motion.div>
  )
}

export function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <div className="rounded-xl border border-border-soft bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="m-0 text-[11px] font-bold tracking-widest text-muted-text uppercase">{label}</p>
        {Icon ? (
          <span className="grid size-8 place-items-center rounded-lg bg-primary/15 text-ink">
            <Icon size={16} />
          </span>
        ) : null}
      </div>
      <p className="m-0 mt-2 text-[26px] leading-none font-bold tracking-tight text-ink tabular-nums">
        {value}
      </p>
      {hint ? <p className="m-0 mt-2 text-[12px] font-medium text-muted-text">{hint}</p> : null}
    </div>
  )
}

export function Field({ label, hint, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold text-nav-text">{label}</span>
      {children}
      {error ? (
        <span role="alert" className="mt-1.5 block text-[12px] font-medium text-red-600">
          {error}
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-[12px] font-medium text-muted-text">{hint}</span>
      ) : null}
    </label>
  )
}

export const inputClass =
  'w-full rounded-lg border border-border-soft bg-bg px-3 py-2 text-[13px] font-semibold text-ink outline-none transition placeholder:font-medium placeholder:text-muted-text/70 hover:border-primary/40 focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70'

export function Modal({ title, children, onClose }) {
  const dialogRef = useRef(null)
  const titleId = useId()
  const reduce = useReducedMotion()

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus()
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <motion.button
        type="button"
        tabIndex={-1}
        aria-label="Close"
        onClick={onClose}
        {...modalBackdrop}
        className="absolute inset-0 cursor-default border-0 bg-ink/50"
      />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        {...modalPanel(reduce)}
        className="relative z-1 flex max-h-[min(92vh,880px)] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-border-soft bg-surface shadow-nav outline-none sm:rounded-xl"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border-soft bg-bg px-4 py-3">
          <h2 id={titleId} className="m-0 truncate text-[15px] font-bold text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg text-muted-text transition hover:bg-bg hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>
        <div className="custom-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain bg-surface p-4 sm:p-5">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

export function EmptyState({ title, text, icon: Icon = Inbox, action }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className="rounded-xl border border-dashed border-border-soft bg-surface px-5 py-14 text-center"
      {...fadeUp(reduce, 0.05)}
    >
      <span className="mx-auto grid size-10 place-items-center rounded-lg bg-primary/15 text-ink">
        <Icon size={18} />
      </span>
      <h3 className="m-0 mt-3 text-[14px] font-bold text-ink">{title}</h3>
      {text ? <p className="mx-auto mt-1 mb-0 max-w-sm text-[13px] text-muted-text">{text}</p> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </motion.div>
  )
}

export function StatusPill({ status }) {
  const map = {
    published: { pill: 'bg-emerald-50 text-emerald-800 ring-emerald-200', dot: 'bg-emerald-500' },
    draft: { pill: 'bg-slate-100 text-slate-600 ring-slate-200', dot: 'bg-slate-400' },
    pending: { pill: 'bg-amber-50 text-amber-800 ring-amber-200', dot: 'bg-amber-500' },
    approved: { pill: 'bg-sky-50 text-sky-800 ring-sky-200', dot: 'bg-sky-500' },
    rejected: { pill: 'bg-red-50 text-red-700 ring-red-200', dot: 'bg-red-500' },
  }
  const tone = map[status] || map.draft
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-bold capitalize ring-1 ring-inset ${tone.pill}`}
    >
      <span className={`size-1.5 rounded-full ${tone.dot}`} aria-hidden="true" />
      {status}
    </span>
  )
}

/** Compress image file to a data URL suitable for localStorage demos. */
export function readImageFile(file, { maxWidth = 960, quality = 0.78 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Please choose an image file.'))
      return
    }
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read that file.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Invalid image file.'))
      img.onload = () => {
        const scale = Math.min(1, maxWidth / Math.max(img.width, 1))
        const w = Math.max(1, Math.round(img.width * scale))
        const h = Math.max(1, Math.round(img.height * scale))
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not process image.'))
          return
        }
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, w, h)
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export function ImagePicker({ label = 'Image', value, onChange }) {
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)

  async function handleFile(file) {
    if (!file || busy) return
    setBusy(true)
    try {
      const dataUrl = await readImageFile(file)
      onChange(dataUrl)
      toastSuccess('Image ready')
    } catch (err) {
      toastError(err.message || 'Could not load image.')
    } finally {
      setBusy(false)
    }
  }

  async function onFile(e) {
    const file = e.target.files?.[0]
    try {
      await handleFile(file)
    } finally {
      e.target.value = ''
    }
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  return (
    <div className="min-w-0">
      <span className="mb-1.5 block text-[12px] font-semibold text-nav-text">{label}</span>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex min-w-0 flex-wrap items-center gap-3 rounded-xl border border-dashed p-3 transition-colors ${
          dragging ? 'border-primary bg-primary/10' : 'border-border-soft bg-bg'
        }`}
      >
        {/* Fixed box — avoids layout blow-up when a large data-URL image loads */}
        <div className="relative h-22.5 w-36 shrink-0 overflow-hidden rounded-lg border border-border-soft bg-bg">
          {value ? (
            <img
              src={value}
              alt=""
              className="absolute inset-0 block size-full object-cover"
            />
          ) : (
            <div className="grid size-full place-items-center text-muted-text">
              <span className="flex flex-col items-center gap-1 text-[11px] font-medium">
                <ImageIcon size={18} aria-hidden="true" />
                No image
              </span>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 basis-40 flex-col items-start gap-2">
          <label
            className={`${btnPrimary} ${busy ? 'pointer-events-none opacity-60' : ''} has-focus-visible:outline-2 has-focus-visible:outline-offset-2`}
          >
            <Upload size={14} />
            {busy ? 'Processing…' : value ? 'Replace image' : 'Choose from device'}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={busy}
              onChange={onFile}
            />
          </label>

          {value ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => onChange('')}
              className={btnDanger}
            >
              <Trash2 size={13} />
              Remove
            </button>
          ) : (
            <p className="m-0 text-[12px] font-medium text-muted-text">
              Drag &amp; drop or choose a JPG, PNG, or WebP.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/** Multi-photo gallery picker — first image is the cover. Soft max (not advertised in UI). */
export function MultiImagePicker({
  label = 'Photos',
  value = [],
  onChange,
  max = 20,
}) {
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const list = Array.isArray(value) ? value.filter(Boolean) : []
  const remaining = Math.max(0, max - list.length)
  const atLimit = remaining <= 0

  async function addFiles(fileList) {
    const files = Array.from(fileList || []).filter((f) => f?.type?.startsWith('image/'))
    if (!files.length || busy) return
    if (atLimit) {
      toastError('No more photos can be added.')
      return
    }

    const toProcess = files.slice(0, remaining)
    setBusy(true)
    try {
      const loaded = []
      for (const file of toProcess) {
        loaded.push(await readImageFile(file, { maxWidth: 960, quality: 0.76 }))
      }
      const next = [...list, ...loaded]
      onChange(next)
      toastSuccess(
        toProcess.length === 1
          ? 'Photo added'
          : `${toProcess.length} photos added`,
      )
      if (files.length > toProcess.length) {
        toastError('Extra photos were skipped.')
      }
    } catch (err) {
      toastError(err.message || 'Could not load image.')
    } finally {
      setBusy(false)
    }
  }

  function onFile(e) {
    const files = e.target.files
    e.target.value = ''
    addFiles(files)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  function removeAt(index) {
    onChange(list.filter((_, i) => i !== index))
  }

  function makeCover(index) {
    if (index <= 0) return
    const next = [...list]
    const [picked] = next.splice(index, 1)
    next.unshift(picked)
    onChange(next)
    toastSuccess('Cover photo updated')
  }

  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[12px] font-semibold text-nav-text">{label}</span>
        {list.length > 0 ? (
          <span className="text-[11px] font-bold text-muted-text tabular-nums">
            {list.length} {list.length === 1 ? 'photo' : 'photos'}
          </span>
        ) : null}
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (remaining > 0) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`rounded-xl border border-dashed p-3 transition-colors ${
          dragging ? 'border-primary bg-primary/10' : 'border-border-soft bg-bg'
        }`}
      >
        {list.length > 0 ? (
          <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {list.map((src, index) => (
              <div
                key={`${index}-${src.slice(0, 24)}`}
                className="group relative aspect-4/3 overflow-hidden rounded-lg border border-border-soft bg-surface"
              >
                <img src={src} alt="" className="absolute inset-0 block size-full object-cover" />
                {index === 0 ? (
                  <span className="absolute top-1.5 left-1.5 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-bold text-ink">
                    Cover
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => makeCover(index)}
                    className="absolute top-1.5 left-1.5 rounded-md bg-ink/75 px-1.5 py-0.5 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100"
                  >
                    Set cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  aria-label={`Remove photo ${index + 1}`}
                  className="absolute top-1.5 right-1.5 grid size-7 place-items-center rounded-md bg-red-600 text-white opacity-90 transition hover:bg-red-700"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-3 flex flex-col items-center justify-center gap-1 rounded-lg border border-border-soft bg-surface px-3 py-8 text-center text-muted-text">
            <ImageIcon size={22} aria-hidden="true" />
            <p className="m-0 text-[12px] font-medium">No photos yet</p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <label
            className={`${btnPrimary} ${
              busy || atLimit ? 'pointer-events-none opacity-60' : ''
            } has-focus-visible:outline-2 has-focus-visible:outline-offset-2`}
          >
            <Upload size={14} />
            {busy
              ? 'Processing…'
              : atLimit
                ? 'Add photos'
                : list.length
                  ? 'Add more photos'
                  : 'Add photos'}
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              disabled={busy || atLimit}
              onChange={onFile}
            />
          </label>
          <p className="m-0 text-[12px] font-medium text-muted-text">
            First photo is the cover. You can add more.
          </p>
        </div>
      </div>
    </div>
  )
}
