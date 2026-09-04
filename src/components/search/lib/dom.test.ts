import { describe, expect, it, vi } from 'vitest';
import { findMarks } from './dom';

describe('findMarks', () => {
  it('queries only within the provided root', () => {
    const matches = {} as NodeListOf<HTMLElement>;
    const querySelectorAll = vi.fn(() => matches);
    const root = { querySelectorAll } as unknown as ParentNode;

    expect(findMarks(root)).toBe(matches);
    expect(querySelectorAll).toHaveBeenCalledWith('[data-find-index]');
  });
});
