import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FindHotkeyHandlers } from '../types';
import { handleFindHotkey } from './useFindHotkeys';

function keydown(key: string, modifiers: Partial<KeyboardEvent> = {}) {
  const preventDefault = vi.fn();
  const event = {
    key,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    preventDefault,
    ...modifiers,
  } as unknown as KeyboardEvent;

  return { event, preventDefault };
}

describe('handleFindHotkey', () => {
  let handlers: FindHotkeyHandlers;

  beforeEach(() => {
    handlers = {
      onFind: vi.fn(),
      onClose: vi.fn(),
      onNext: vi.fn(() => true),
      onPrev: vi.fn(() => true),
    };
  });

  it('opens custom search for Cmd/Ctrl+F', () => {
    const { event, preventDefault } = keydown('f', { ctrlKey: true });

    handleFindHotkey(event, handlers);

    expect(handlers.onFind).toHaveBeenCalledOnce();
    expect(preventDefault).toHaveBeenCalledOnce();
  });

  it('handles Cmd/Ctrl+G while custom search is open', () => {
    const { event, preventDefault } = keydown('g', { metaKey: true });

    handleFindHotkey(event, handlers);

    expect(handlers.onNext).toHaveBeenCalledOnce();
    expect(preventDefault).toHaveBeenCalledOnce();
  });

  it('leaves Cmd/Ctrl+G to the browser while custom search is closed', () => {
    handlers.onNext = vi.fn(() => false);
    const { event, preventDefault } = keydown('g', { metaKey: true });

    handleFindHotkey(event, handlers);

    expect(handlers.onNext).toHaveBeenCalledOnce();
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('steps backward for Shift+Cmd/Ctrl+G', () => {
    const { event, preventDefault } = keydown('G', { ctrlKey: true, shiftKey: true });

    handleFindHotkey(event, handlers);

    expect(handlers.onPrev).toHaveBeenCalledOnce();
    expect(preventDefault).toHaveBeenCalledOnce();
  });

  it('closes custom search with Escape', () => {
    const { event } = keydown('Escape');

    handleFindHotkey(event, handlers);

    expect(handlers.onClose).toHaveBeenCalledOnce();
  });
});
