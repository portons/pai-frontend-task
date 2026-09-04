const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

const reveal = (el) =>
  el.scrollIntoView({ block: 'center', behavior: reducedMotion() ? 'instant' : 'smooth' })

/**
 * `v-scroll-into-view="isActive"` scrolls the element into view whenever its
 * binding turns truthy, so "the current match" reveals itself instead of a
 * parent hunting for it in the DOM.
 */
export const vScrollIntoView = {
  mounted: (el, { value }) => value && reveal(el),
  updated: (el, { value, oldValue }) => value && !oldValue && reveal(el),
}
