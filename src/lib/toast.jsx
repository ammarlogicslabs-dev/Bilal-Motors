import { toast } from 'react-toastify'

export function toastSuccess(message) {
  return toast.success(message)
}

export function toastError(message) {
  return toast.error(message)
}

export function toastInfo(message) {
  return toast.info(message)
}

/** Promise-based confirm using a toast (replaces window.confirm). */
export function toastConfirm(
  message,
  { confirmLabel = 'Confirm', cancelLabel = 'Cancel', type = 'warning' } = {},
) {
  return new Promise((resolve) => {
    let settled = false

    const finish = (value, closeToast) => {
      if (settled) return
      settled = true
      closeToast?.()
      resolve(value)
    }

    toast(
      ({ closeToast }) => (
        <div className="w-full">
          <p className="m-0 text-[13.5px] leading-snug font-semibold text-ink">{message}</p>
          <div className="mt-3 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => finish(false, closeToast)}
              className="cursor-pointer rounded-lg border border-border-soft bg-surface px-3 py-1.5 text-[12px] font-bold text-ink transition hover:bg-bg"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={() => finish(true, closeToast)}
              className="cursor-pointer rounded-lg bg-ink px-3 py-1.5 text-[12px] font-bold text-white transition hover:bg-ink/90"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      ),
      {
        type,
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: true,
        onClose: () => finish(false),
      },
    )
  })
}
