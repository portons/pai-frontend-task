import { onMounted, onUnmounted } from 'vue';
import type { FindHotkeyHandlers } from '../types';

/**
 * Browser find shortcuts: ⌘F / Ctrl+F opens (taking over the native find),
 * ⌘G / Ctrl+G steps forward and with Shift backward, Escape closes.
 */
export function useFindHotkeys(on: FindHotkeyHandlers) {
  const onKeydown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if ((event.metaKey || event.ctrlKey) && (key === 'f' || key === 'g')) {
      event.preventDefault();
      if (key === 'f') on.onFind();
      else if (event.shiftKey) on.onPrev();
      else on.onNext();
    } else if (key === 'escape') {
      on.onClose();
    }
  };
  onMounted(() => window.addEventListener('keydown', onKeydown));
  onUnmounted(() => window.removeEventListener('keydown', onKeydown));
}
