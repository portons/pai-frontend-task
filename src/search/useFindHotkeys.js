import { onMounted, onUnmounted } from 'vue'

/**
 * Browser find shortcuts: ⌘F / Ctrl+F opens (taking over the native find),
 * ⌘G / Ctrl+G steps forward and with Shift backward, Escape closes.
 * @param {{ onFind: () => void, onClose: () => void, onNext: () => void, onPrev: () => void }} on
 */
export function useFindHotkeys(on) {
  const onKeydown = (e) => {
    const key = e.key.toLowerCase()
    if ((e.metaKey || e.ctrlKey) && (key === 'f' || key === 'g')) {
      e.preventDefault()
      if (key === 'f') on.onFind()
      else if (e.shiftKey) on.onPrev()
      else on.onNext()
    } else if (key === 'escape') {
      on.onClose()
    }
  }
  onMounted(() => window.addEventListener('keydown', onKeydown))
  onUnmounted(() => window.removeEventListener('keydown', onKeydown))
}
