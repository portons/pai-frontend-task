import { nextTick } from 'vue'
import { findMarks, scrollParent } from './dom'

/**
 * Chrome's rule for where a search starts: the first match at or below the
 * top of the viewport, so a new query never yanks the reader away from where
 * they were.
 */
export async function nearestVisibleMatch() {
  await nextTick()
  const marks = findMarks()
  if (marks.length === 0) return 0
  const viewportTop = scrollParent(marks[0]).getBoundingClientRect().top
  for (const mark of marks) {
    if (mark.getBoundingClientRect().bottom >= viewportTop) return Number(mark.dataset.findIndex)
  }
  return 0
}
