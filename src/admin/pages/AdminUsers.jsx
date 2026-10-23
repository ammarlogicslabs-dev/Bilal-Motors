import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Pencil, Plus, Search, Shield, Trash2, UserRound, X } from 'lucide-react'
import { useDataStore } from '../../context/DataStore'
import {
  EmptyState,
  Field,
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
import { toastConfirm, toastError, toastSuccess } from '../../lib/toast.jsx'

const EMPTY = {
  name: '',
  username: '',
  email: '',
  password: '',
  role: 'user',
}

function RolePill({ role }) {
  const isAdmin = role === 'admin'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold capitalize ring-1 ring-inset ${
        isAdmin
          ? 'bg-primary/20 text-ink ring-primary/30'
          : 'bg-bg text-muted-text ring-border-soft'
      }`}
    >
      {isAdmin ? <Shield size={11} /> : <UserRound size={11} />}
      {isAdmin ? 'Admin' : 'Member'}
    </span>
  )
}

function RowActions({ user, onEdit, onDelete, disableDelete }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => onEdit(user)}
        className={btnSecondary}
      >
        <Pencil size={13} />
        Edit
      </button>
      <button
        type="button"
        onClick={() => onDelete(user)}
        disabled={disableDelete}
        aria-label={`Delete ${user.name}`}
        title={disableDelete ? 'Cannot delete this account' : 'Delete'}
        className={btnIconDanger}
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

function AdminUsers() {
  const { users, currentUser, addUser, updateUser, deleteUser } = useDataStore()
  const reduce = useReducedMotion()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [formError, setFormError] = useState('')

  const list = Array.isArray(users) ? users : []

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return list
    return list.filter((u) =>
      `${u.name} ${u.username} ${u.email} ${u.role}`.toLowerCase().includes(term),
    )
  }, [list, q])

  const adminCount = list.filter((u) => u.role === 'admin').length

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (formError) setFormError('')
  }

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY)
    setFormError('')
    setOpen(true)
  }

  function openEdit(user) {
    setEditingId(user.id)
    setForm({
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      password: '',
      role: user.role || 'user',
    })
    setFormError('')
    setOpen(true)
  }

  function onSubmit(e) {
    e.preventDefault()
    if (editingId) {
      const result = updateUser(editingId, form)
      if (!result.ok) {
        setFormError(result.error)
        toastError(result.error)
        return
      }
      toastSuccess('User updated')
    } else {
      const result = addUser(form)
      if (!result.ok) {
        setFormError(result.error)
        toastError(result.error)
        return
      }
      toastSuccess('User created')
    }
    setOpen(false)
  }

  async function confirmDelete(user) {
    const isSelf =
      currentUser?.id === user.id || currentUser?.username === user.username
    if (isSelf) {
      toastError('You cannot delete your own account.')
      return
    }
    const ok = await toastConfirm(`Delete user “${user.username}”?`, {
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    })
    if (!ok) return
    const result = deleteUser(user.id)
    if (!result.ok) {
      toastError(result.error)
      return
    }
    toastSuccess('User deleted')
  }

  const total = list.length
  const searching = q.trim().length > 0

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Create and manage admin staff and member accounts."
        action={
          <button
            type="button"
            onClick={openCreate}
            className={btnPrimary}
          >
            <Plus size={16} />
            Add user
          </button>
        }
      />

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
            placeholder="Search name, username, email…"
            aria-label="Search users"
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
          {total === 1 ? 'user' : 'users'}
        </p>
      </motion.div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={UserRound}
          title="No users found"
          text={searching ? 'Try another search or clear it.' : 'Add your first user account.'}
        />
      ) : (
        <>
          <motion.div className={`hidden ${panelClass} md:block`} {...fadeUp(reduce, 0.08)}>
            <div className="custom-scrollbar overflow-x-auto">
              <table className="w-full min-w-180 border-collapse text-left text-[13px]">
                <thead className="bg-bg text-[11px] font-bold tracking-widest text-muted-text uppercase">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      User
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Username
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Role
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Created
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => {
                    const isSelf =
                      currentUser?.id === user.id ||
                      currentUser?.username === user.username
                    const disableDelete =
                      isSelf || (user.role === 'admin' && adminCount <= 1)
                    return (
                      <tr
                        key={user.id}
                        className="border-t border-border-soft transition-colors hover:bg-bg/70"
                      >
                        <td className="px-4 py-3">
                          <div className="min-w-0">
                            <p className="m-0 font-bold text-ink">
                              {user.name}
                              {isSelf ? (
                                <span className="ml-2 text-[11px] font-semibold text-primary">
                                  (you)
                                </span>
                              ) : null}
                            </p>
                            <p className="m-0 mt-0.5 truncate text-[12px] font-medium text-muted-text">
                              {user.email || '—'}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-ink">{user.username}</td>
                        <td className="px-4 py-3">
                          <RolePill role={user.role} />
                        </td>
                        <td className="px-4 py-3 font-medium text-muted-text">
                          {user.createdAt || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <RowActions
                            user={user}
                            onEdit={openEdit}
                            onDelete={confirmDelete}
                            disableDelete={disableDelete}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>

          <div className="grid gap-3 md:hidden">
            <AnimatePresence initial={false}>
              {filtered.map((user, index) => {
                const isSelf =
                  currentUser?.id === user.id ||
                  currentUser?.username === user.username
                const disableDelete =
                  isSelf || (user.role === 'admin' && adminCount <= 1)
                return (
                  <motion.article
                    key={user.id}
                    {...staggerItem(reduce, index)}
                    className="rounded-xl border border-border-soft bg-surface p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="m-0 text-[14px] font-semibold text-ink">
                          {user.name}
                          {isSelf ? (
                            <span className="ml-2 text-[11px] font-semibold text-primary">
                              (you)
                            </span>
                          ) : null}
                        </p>
                        <p className="m-0 mt-1 text-[12px] font-medium text-muted-text">
                          @{user.username}
                        </p>
                      </div>
                      <RolePill role={user.role} />
                    </div>
                    <p className="mt-2 mb-0 text-[12px] text-muted-text">{user.email || '—'}</p>
                    <div className="mt-3 border-t border-border-soft pt-3">
                      <RowActions
                        user={user}
                        onEdit={openEdit}
                        onDelete={confirmDelete}
                        disableDelete={disableDelete}
                      />
                    </div>
                  </motion.article>
                )
              })}
            </AnimatePresence>
          </div>
        </>
      )}

      {open ? (
        <Modal title={editingId ? 'Edit user' : 'Add user'} onClose={() => setOpen(false)}>
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Full name">
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Hassan Ali"
                required
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Username">
                <input
                  className={inputClass}
                  value={form.username}
                  onChange={(e) => set('username', e.target.value)}
                  placeholder="e.g. hassan"
                  autoComplete="off"
                  required
                />
              </Field>
              <Field label="Role">
                <select
                  className={inputClass}
                  value={form.role}
                  onChange={(e) => set('role', e.target.value)}
                >
                  <option value="" disabled>
                    Select role
                  </option>
                  <option value="user">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </Field>
            </div>
            <Field label="Email">
              <input
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="name@email.com"
              />
            </Field>
            <Field
              label={editingId ? 'Password (leave blank to keep)' : 'Password'}
            >
              <input
                type="password"
                className={inputClass}
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                placeholder={editingId ? '••••••••' : 'Min. 4 characters'}
                autoComplete="new-password"
                required={!editingId}
                minLength={editingId ? undefined : 4}
              />
            </Field>

            {formError ? (
              <p className="m-0 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[13px] font-semibold text-red-600">
                {formError}
              </p>
            ) : null}

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
                {editingId ? 'Save changes' : 'Create user'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}

export default AdminUsers
