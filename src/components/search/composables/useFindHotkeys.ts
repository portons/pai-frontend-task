import { onMounted, onUnmounted } from 'vue';

interface Handlers {
  onFind(): void;
  onClose(): void;
  onNext(): void;
  onPrev(): void;
}

/**
 * Browser find shortcuts: ⌘F / Ctrl+F opens (taking over the native find),
 * ⌘G / Ctrl+G steps forward and with Shift backward, Escape closes.
 */
export function useFindHotkeys(on: Handlers) {
  const onKeydown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if ((e.metaKey || e.ctrlKey) && (key === 'f' || key === 'g')) {
      e.preventDefault();
      if (key === 'f') on.onFind();
      else if (e.shiftKey) on.onPrev();
      else on.onNext();
    } else if (key === 'escape') {
      on.onClose();
    }
  };
  onMounted(() => window.addEventListener('keydown', onKeydown));
  onUnmounted(() => window.removeEventListener('keydown', onKeydown));
}
