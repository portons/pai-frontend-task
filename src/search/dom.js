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
