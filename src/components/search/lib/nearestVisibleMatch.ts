import { nextTick, toValue, type MaybeRefOrGetter } from 'vue';
import { findMarks, scrollParent } from './dom';

export async function nearestVisibleMatch(
  root: MaybeRefOrGetter<HTMLElement | null> = null,
): Promise<number> {
  await nextTick();

  const marks = findMarks(toValue(root));
  const first = marks[0];

  if (!first) return 0;

  const viewportTop = scrollParent(first).getBoundingClientRect().top;

  for (const mark of marks) {
    if (mark.getBoundingClientRect().bottom >= viewportTop) return Number(mark.dataset.findIndex);
  }

  return 0;
}
