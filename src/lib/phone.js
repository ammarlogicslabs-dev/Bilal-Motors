/** Pakistani mobile: exactly 11 digits starting with 03 (e.g. 03001234567). */

export const PK_MOBILE_PATTERN = /^03\d{9}$/

export function digitsOnly(value) {
  return String(value || '').replace(/\D/g, '')
}

/** Normalize common formats (+92…, 92…, 3…) to 03XXXXXXXXX when possible. */
export function normalizePkMobile(value) {
  let d = digitsOnly(value)
  if (d.startsWith('92') && d.length >= 12) d = `0${d.slice(2)}`
  if (d.length === 10 && d.startsWith('3')) d = `0${d}`
  return d.slice(0, 11)
}

export function isValidPkMobile(value) {
  return PK_MOBILE_PATTERN.test(normalizePkMobile(value))
}

/** Keep only digits while typing — max 11. */
export function sanitizePkMobileInput(value) {
  return digitsOnly(value).slice(0, 11)
}

/** Digits for wa.me (923XXXXXXXXX). */
export function toWhatsappDigits(value) {
  const n = normalizePkMobile(value)
  if (PK_MOBILE_PATTERN.test(n)) return `92${n.slice(1)}`
  const d = digitsOnly(value)
  if (d.startsWith('92')) return d
  if (d.startsWith('0') && d.length === 11) return `92${d.slice(1)}`
  return d
}

export const PK_MOBILE_HINT = '11 digits starting with 03'
export const PK_MOBILE_PLACEHOLDER = '03XXXXXXXXX'
export const PK_MOBILE_ERROR = 'Enter a valid 11-digit mobile number starting with 03'
