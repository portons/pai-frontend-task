import { onMounted, onUnmounted } from 'vue';
import type { FindHotkeyHandlers } from '../types';

export function handleFindHotkey(event: KeyboardEvent, on: FindHotkeyHandlers) {
  const key = event.key.toLowerCase();

  if ((event.metaKey || event.ctrlKey) && key === 'f') {
    event.preventDefault();
    on.onFind();
  } else if ((event.metaKey || event.ctrlKey) && key === 'g') {
    const handled = event.shiftKey ? on.onPrev() : on.onNext();
    if (handled) event.preventDefault();
  } else if (key === 'escape') {
    on.onClose();
  }
}

export function useFindHotkeys(on: FindHotkeyHandlers) {
  const onKeydown = (event: KeyboardEvent) => handleFindHotkey(event, on);
  onMounted(() => window.addEventListener('keydown', onKeydown));
  onUnmounted(() => window.removeEventListener('keydown', onKeydown));
}
