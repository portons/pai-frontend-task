import { nextTick } from 'vue';
import { findMarks, scrollParent } from './dom';

/**
 * Chrome's rule for where a search starts: the first match at or below the
 * top of the viewport, so a new query never yanks the reader away from where
 * they were.
 */
export async function nearestVisibleMatch(): Promise<number> {
  await nextTick();

  const marks = findMarks();
  const first = marks[0];

  if (!first) return 0;

  const viewportTop = scrollParent(first).getBoundingClientRect().top;

  for (const mark of marks) {
    if (mark.getBoundingClientRect().bottom >= viewportTop) return Number(mark.dataset.findIndex);
  }

  return 0;
}
