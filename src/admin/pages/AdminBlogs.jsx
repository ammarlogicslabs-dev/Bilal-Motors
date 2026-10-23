import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { BookOpen, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
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
import {
  formatBlogDate,
  toBlogDateInput,
  todayBlogDateInput,
} from '../../data/blogs'
import { toastConfirm, toastSuccess } from '../../lib/toast.jsx'

const EMPTY = {
  title: '',
  slug: '',
  category: 'Buying tips',
  readTime: '5 min read',
  date: todayBlogDateInput(),
  excerpt: '',
  image: '',
  body: '',
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

function BlogThumb({ src, className }) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        className={`${className} block overflow-hidden bg-bg object-cover`}
      />
    )
  }
  return (
    <span className={`${className} grid place-items-center bg-bg text-muted-text`}>
      <BookOpen size={18} />
    </span>
  )
}

function RowActions({ blog, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => onEdit(blog)}
        className={btnSecondary}
      >
        <Pencil size={13} />
        Edit
      </button>
      <button
        type="button"
        onClick={() => onDelete(blog)}
        aria-label={`Delete ${blog.title}`}
        title="Delete"
        className={btnIconDanger}
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

function AdminBlogs() {
  const { blogs, addBlog, updateBlog, deleteBlog } = useDataStore()
  const reduce = useReducedMotion()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [editingSlug, setEditingSlug] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return blogs
    return blogs.filter((b) =>
      `${b.title} ${b.category} ${b.slug}`.toLowerCase().includes(term),
    )
  }, [blogs, q])

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function openCreate() {
    setEditingSlug(null)
    setForm({ ...EMPTY, date: todayBlogDateInput() })
    setOpen(true)
  }

  function openEdit(blog) {
    setEditingSlug(blog.slug)
    setForm({
      title: blog.title,
      slug: blog.slug,
      category: blog.category,
      readTime: blog.readTime,
      date: toBlogDateInput(blog.date) || todayBlogDateInput(),
      excerpt: blog.excerpt,
      image: blog.image || '',
      body: (blog.body || []).join('\n\n'),
    })
    setOpen(true)
  }

  function onSubmit(e) {
    e.preventDefault()
    if (editingSlug) {
      updateBlog(editingSlug, form)
      toastSuccess('Blog updated')
    } else {
      addBlog(form)
      toastSuccess('Blog published')
    }
    setOpen(false)
  }

  async function confirmDelete(blog) {
    const ok = await toastConfirm(`Delete “${blog.title}”?`, {
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    })
    if (!ok) return
    deleteBlog(blog.slug)
    toastSuccess('Blog deleted')
  }

  const total = Array.isArray(blogs) ? blogs.length : 0
  const searching = q.trim().length > 0

  return (
    <div>
      <PageHeader
        title="Blogs"
        subtitle="Create and edit buying guides and articles."
        action={
          <button
            type="button"
            onClick={openCreate}
            className={btnPrimary}
          >
            <Plus size={16} />
            Add blog
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
            placeholder="Search title, category, slug…"
            aria-label="Search blogs"
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
          {searching ? `${filtered.length} of ${total}` : total}{' '}
          {total === 1 ? 'article' : 'articles'}
        </p>
      </motion.div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No blogs found"
          text={searching ? 'Try another search or clear it.' : 'Add your first article.'}
        />
      ) : (
        <>
          {/* Desktop / tablet table */}
          <motion.div className={`hidden ${panelClass} md:block`} {...fadeUp(reduce, 0.08)}>
            <div className="custom-scrollbar overflow-x-auto">
              <table className="w-full min-w-180 border-collapse text-left text-[13px]">
                <thead className="bg-bg text-[11px] font-bold tracking-widest text-muted-text uppercase">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Article
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Category
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Read time
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((blog) => (
                    <tr
                      key={blog.slug}
                      className="border-t border-border-soft transition-colors hover:bg-bg/70"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <BlogThumb
                            src={blog.image}
                            className="h-12 w-17 shrink-0 rounded-md"
                          />
                          <div className="min-w-0">
                            <p className="m-0 max-w-70 truncate font-bold text-ink">
                              {blog.title}
                            </p>
                            <p className="m-0 mt-0.5 truncate text-[12px] font-medium text-muted-text">
                              /{blog.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-muted-text">{blog.category}</td>
                      <td className="px-4 py-3 font-medium whitespace-nowrap text-muted-text">
                        {blog.readTime}
                      </td>
                      <td className="px-4 py-3 font-medium whitespace-nowrap text-muted-text">
                        {formatBlogDate(blog.date)}
                      </td>
                      <td className="px-4 py-3">
                        <RowActions blog={blog} onEdit={openEdit} onDelete={confirmDelete} />
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
              {filtered.map((blog, index) => (
                <motion.article
                  key={blog.slug}
                  {...staggerItem(reduce, index)}
                  className="rounded-xl border border-border-soft bg-surface p-4"
                >
                  <div className="flex gap-3">
                    <BlogThumb src={blog.image} className="h-16 w-24 shrink-0 rounded-md" />
                    <div className="min-w-0 flex-1">
                      <p className="m-0 line-clamp-2 text-[14px] leading-snug font-semibold text-ink">
                        {blog.title}
                      </p>
                      <p className="m-0 mt-1 text-[12px] font-medium text-muted-text">
                        {blog.category} · {blog.readTime}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 mb-0 line-clamp-2 text-[13px] text-muted-text">{blog.excerpt}</p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="m-0 text-[12px] font-medium text-muted-text">
                      {formatBlogDate(blog.date)}
                    </p>
                    <p className="m-0 truncate text-[11px] font-bold text-primary">/{blog.slug}</p>
                  </div>

                  <div className="mt-3 border-t border-border-soft pt-3">
                    <RowActions blog={blog} onEdit={openEdit} onDelete={confirmDelete} />
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {open ? (
        <Modal title={editingSlug ? 'Edit blog' : 'Add blog'} onClose={() => setOpen(false)}>
          <form onSubmit={onSubmit} className="space-y-4">
            <SectionTitle>Basic info</SectionTitle>
            <Field label="Title">
              <input
                className={inputClass}
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. How to inspect a used car"
                required
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Slug (optional)" hint="Auto from title if empty">
                <input
                  className={inputClass}
                  value={form.slug}
                  onChange={(e) => set('slug', e.target.value)}
                  placeholder="how-to-inspect-a-used-car"
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
              <Field label="Read time">
                <input
                  className={inputClass}
                  value={form.readTime}
                  onChange={(e) => set('readTime', e.target.value)}
                  placeholder="e.g. 5 min read"
                />
              </Field>
              <Field label="Publish date">
                <input
                  type="date"
                  className={inputClass}
                  value={form.date}
                  onChange={(e) => set('date', e.target.value)}
                  required
                />
              </Field>
            </div>

            <SectionTitle>Media</SectionTitle>
            <ImagePicker label="Cover image" value={form.image} onChange={(v) => set('image', v)} />

            <SectionTitle>Content</SectionTitle>
            <Field label="Excerpt">
              <textarea
                className={`${inputClass} min-h-20 resize-y`}
                value={form.excerpt}
                onChange={(e) => set('excerpt', e.target.value)}
                placeholder="Short summary shown on the blogs list…"
                required
              />
            </Field>
            <Field
              label="Body"
              hint="Separate paragraphs with a blank line"
            >
              <textarea
                className={`${inputClass} min-h-40 resize-y`}
                value={form.body}
                onChange={(e) => set('body', e.target.value)}
                placeholder="Write the full article here…"
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
                {editingSlug ? 'Save changes' : 'Publish blog'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}

export default AdminBlogs
