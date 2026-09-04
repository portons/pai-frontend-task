import type { Directive } from 'vue';

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const reveal = (el: Element) =>
  el.scrollIntoView({ block: 'center', behavior: reducedMotion() ? 'instant' : 'smooth' });

export const vScrollIntoView: Directive<HTMLElement, boolean> = {
  mounted: (el, { value }) => value && reveal(el),
  updated: (el, { value, oldValue }) => value && !oldValue && reveal(el),
};
