import { nextTick } from 'vue'

const isScrollable = (el) => /auto|scroll/.test(getComputedStyle(el).overflowY)

function scrollParent(el) {
  let parent = el.parentElement
  while (parent && !isScrollable(parent)) parent = parent.parentElement
  return parent ?? document.documentElement
}

/**
 * Chrome's rule for where a search starts: the first match at or below the
 * top of the viewport, so a new query never yanks the reader away from where
 * they were. Reads the <mark> elements rendered by HighlightedText.
 */
export async function nearestVisibleMatch() {
  await nextTick()
  const marks = document.querySelectorAll('[data-find-index]')
  if (marks.length === 0) return 0
  const viewportTop = scrollParent(marks[0]).getBoundingClientRect().top
  for (const mark of marks) {
    if (mark.getBoundingClientRect().bottom >= viewportTop) return Number(mark.dataset.findIndex)
  }
  return 0
}
