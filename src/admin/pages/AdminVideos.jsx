import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Clock, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { useDataStore } from '../../context/DataStore'
import {
  EmptyState,
  Field,
  ImagePicker,
  Modal,
  PageHeader,
  inputClass,
  btnPrimary,
  btnSecondary,
  btnIconDanger,
  panelClass,
  toolbarClass
} from '../components/AdminUI'
import { fadeUp, staggerItem } from '../motion'
import { toastConfirm, toastSuccess } from '../../lib/toast.jsx'

const EMPTY = {
  title: '',
  slug: '',
  category: 'Buying guide',
  duration: '5:00',
  meta: '',
  description: '',
  image: '',
}

function AdminVideos() {
  const { videos, addVideo, updateVideo, deleteVideo } = useDataStore()
  const reduce = useReducedMotion()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [editingSlug, setEditingSlug] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return videos
    return videos.filter((v) =>
      `${v.title} ${v.category} ${v.slug}`.toLowerCase().includes(term),
    )
  }, [videos, q])

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function openCreate() {
    setEditingSlug(null)
    setForm(EMPTY)
    setOpen(true)
  }

  function openEdit(video) {
    setEditingSlug(video.slug)
    setForm({
      title: video.title,
      slug: video.slug,
      category: video.category,
      duration: video.duration,
      meta: video.meta,
      description: video.description,
      image: video.image,
    })
    setOpen(true)
  }

  function onSubmit(e) {
    e.preventDefault()
    const payload = {
      ...form,
      meta: form.meta || `${form.category} · ${form.duration}`,
    }
    if (editingSlug) {
      updateVideo(editingSlug, payload)
      toastSuccess('Video updated')
    } else {
      addVideo(payload)
      toastSuccess('Video published')
    }
    setOpen(false)
  }

  async function confirmDelete(video) {
    const ok = await toastConfirm(`Delete “${video.title}”?`, {
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    })
    if (!ok) return
    deleteVideo(video.slug)
    toastSuccess('Video deleted')
  }

  const total = Array.isArray(videos) ? videos.length : 0
  const searching = q.trim().length > 0

  return (
    <div>
      <PageHeader
        title="Videos"
        subtitle="Manage walkarounds, inspections, and buying guides."
        action={
          <button
            type="button"
            onClick={openCreate}
            className={btnPrimary}
          >
            <Plus size={16} />
            Add video
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
            placeholder="Search by title, category or slug…"
            aria-label="Search videos"
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
          {searching ? `${filtered.length} of ${total}` : total} {total === 1 ? 'video' : 'videos'}
        </p>
      </motion.div>

      {filtered.length === 0 ? (
        <EmptyState
          title={searching ? 'No matching videos' : 'No videos'}
          text={searching ? 'Try a different keyword or clear the search.' : 'Add your first video guide.'}
        />
      ) : (
        <motion.div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" {...fadeUp(reduce, 0.08)}>
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((video, index) => (
              <motion.article
                key={video.slug}
                layout={!reduce}
                {...staggerItem(reduce, index)}
                className={`${panelClass} group flex flex-col transition-colors hover:border-primary/40`}
              >
                <div className="relative aspect-video overflow-hidden bg-bg">
                  <img
                    src={video.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 block size-full object-cover"
                  />
                  <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-md bg-ink/85 px-2 py-0.5 text-[11px] font-bold text-white">
                    <Clock size={11} aria-hidden="true" />
                    {video.duration}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-3.5">
                  <span className="w-fit rounded-md bg-primary/15 px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-ink uppercase">
                    {video.category}
                  </span>
                  <h3 className="mt-2 mb-0 line-clamp-2 text-[13.5px] leading-snug font-bold text-ink">
                    {video.title}
                  </h3>
                  {video.description ? (
                    <p className="m-0 mt-1.5 line-clamp-2 text-[12px] leading-relaxed font-medium text-muted-text">
                      {video.description}
                    </p>
                  ) : null}

                  <div className="mt-auto flex items-center gap-2 border-t border-border-soft pt-3">
                    <button
                      type="button"
                      onClick={() => openEdit(video)}
                      className={btnSecondary}
                    >
                      <Pencil size={13} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => confirmDelete(video)}
                      aria-label={`Delete ${video.title}`}
                      title="Delete"
                      className={`ml-auto ${btnIconDanger}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {open ? (
        <Modal title={editingSlug ? 'Edit video' : 'Add video'} onClose={() => setOpen(false)}>
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Title">
              <input
                className={inputClass}
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. 2019 Honda Civic walkaround"
                required
              />
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Slug (optional)">
                <input
                  className={`${inputClass} disabled:cursor-not-allowed disabled:bg-bg disabled:text-muted-text`}
                  value={form.slug}
                  onChange={(e) => set('slug', e.target.value)}
                  placeholder="honda-civic-walkaround"
                  disabled={Boolean(editingSlug)}
                />
              </Field>
              <Field label="Category">
                <input
                  className={inputClass}
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  placeholder="e.g. Buying guide"
                />
              </Field>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Duration">
                <input
                  className={inputClass}
                  value={form.duration}
                  onChange={(e) => set('duration', e.target.value)}
                  placeholder="5:20"
                />
              </Field>
              <Field label="Meta label">
                <input
                  className={inputClass}
                  value={form.meta}
                  onChange={(e) => set('meta', e.target.value)}
                  placeholder="Walkaround · 4 min"
                />
              </Field>
            </div>

            <ImagePicker label="Thumbnail" value={form.image} onChange={(v) => set('image', v)} />

            <Field label="Description">
              <textarea
                className={`${inputClass} min-h-28 resize-y`}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="What this video covers…"
                required
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
                {editingSlug ? 'Save changes' : 'Publish video'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}

export default AdminVideos