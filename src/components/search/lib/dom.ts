const isScrollable = (el: Element) => /auto|scroll/.test(getComputedStyle(el).overflowY);

export function scrollParent(el: Element): Element {
  let parent = el.parentElement;

  while (parent && !isScrollable(parent)) parent = parent.parentElement;

  return parent ?? document.documentElement;
}

export const findMarks = (root: ParentNode | null = null) =>
  (root ?? document).querySelectorAll<HTMLElement>('[data-find-index]');

export function selectText(el: Element, start: number, end: number) {
  const node = Array.from(el.childNodes).find(
    (node): node is Text => node.nodeType === Node.TEXT_NODE && (node as Text).length >= end,
  );

  if (!node) return;

  const range = document.createRange();

  range.setStart(node, start);
  range.setEnd(node, end);

  const selection = getSelection();

  selection?.removeAllRanges();
  selection?.addRange(range);
}
