/** DOM helpers shared by the parts of the module that must look at layout. */

const isScrollable = (el) => /auto|scroll/.test(getComputedStyle(el).overflowY)

/** The nearest scrolling ancestor, falling back to the document. */
export function scrollParent(el) {
  let parent = el.parentElement
  while (parent && !isScrollable(parent)) parent = parent.parentElement
  return parent ?? document.documentElement
}

/** Every rendered match, in document order (HighlightedText tags each <mark>). */
export const findMarks = () => document.querySelectorAll('[data-find-index]')

/**
 * Select a slice of the text inside `el`, the way Chrome leaves the last
 * match selected when its find bar closes. Skips Vue's empty anchor nodes.
 */
export function selectText(el, start, end) {
  const node = Array.from(el.childNodes).find(
    (n) => n.nodeType === Node.TEXT_NODE && n.length >= end,
  )
  if (!node) return
  const range = document.createRange()
  range.setStart(node, start)
  range.setEnd(node, end)
  const selection = getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
}
