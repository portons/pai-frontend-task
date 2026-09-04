/** DOM helpers shared by the parts of the module that must look at layout. */

const isScrollable = (el: Element) => /auto|scroll/.test(getComputedStyle(el).overflowY)

/** The nearest scrolling ancestor, falling back to the document. */
export function scrollParent(el: Element): Element {
  let parent = el.parentElement
  while (parent && !isScrollable(parent)) parent = parent.parentElement
  return parent ?? document.documentElement
}

/** Every rendered match, in document order (HighlightedText tags each <mark>). */
export const findMarks = () => document.querySelectorAll<HTMLElement>('[data-find-index]')

/**
 * Select a slice of the text inside `el`, the way Chrome leaves the last
 * match selected when its find bar closes. Skips Vue's empty anchor nodes.
 */
export function selectText(el: Element, start: number, end: number) {
  const node = Array.from(el.childNodes).find(
    (n): n is Text => n.nodeType === Node.TEXT_NODE && (n as Text).length >= end,
  )
  if (!node) return
  const range = document.createRange()
  range.setStart(node, start)
  range.setEnd(node, end)
  const selection = getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
}
