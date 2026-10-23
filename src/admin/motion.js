/** Shared admin motion — soft, professional, respects reduced motion */

export const EASE = [0.22, 1, 0.36, 1]

/** Enter-only page motion (no exit opacity — avoids blank screens with Outlet). */
export function pageMotion(reduce) {
  if (reduce) {
    return {
      initial: false,
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0 },
    }
  }
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.22, ease: EASE },
  }
}

export function fadeUp(reduce, delay = 0) {
  if (reduce) return { initial: false, animate: { opacity: 1, y: 0 } }
  return {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.28, ease: EASE, delay },
  }
}

export function fadeIn(reduce, delay = 0) {
  if (reduce) return { initial: false, animate: { opacity: 1 } }
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.25, ease: EASE, delay },
  }
}

export function staggerItem(reduce, index = 0, step = 0.04) {
  if (reduce) return { initial: false, animate: { opacity: 1, y: 0 } }
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, transition: { duration: 0.15 } },
    transition: {
      duration: 0.26,
      ease: EASE,
      delay: Math.min(index, 8) * step,
    },
  }
}

export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}

export function modalPanel(reduce) {
  // No scale — transform+overflow on dialogs caused black gaps after image replace.
  if (reduce) {
    return { initial: false, animate: { opacity: 1, y: 0 } }
  }
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 8 },
    transition: { duration: 0.22, ease: EASE },
  }
}

export function drawerSlide(reduce) {
  if (reduce) return { initial: false, animate: { x: 0 }, exit: { x: 0 } }
  return {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
    transition: { duration: 0.3, ease: EASE },
  }
}

export function menuPop(reduce) {
  if (reduce) return { initial: false, animate: { opacity: 1, y: 0, scale: 1 } }
  return {
    initial: { opacity: 0, y: -6, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -4, scale: 0.98 },
    transition: { duration: 0.18, ease: EASE },
  }
}
