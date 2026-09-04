import { describe, expect, it } from 'vitest';
import { findRanges, segment } from './match';

describe('findRanges', () => {
  it('finds every case-insensitive occurrence', () => {
    expect(findRanges('Hello hello', 'hello')).toEqual([
      { start: 0, end: 5 },
      { start: 6, end: 11 },
    ]);
  });

  it('matches accents without changing the original range', () => {
    expect(findRanges('Café', 'cafe')).toEqual([{ start: 0, end: 4 }]);
    expect(findRanges('Cafe\u0301', 'cafe')).toEqual([{ start: 0, end: 5 }]);
  });

  it('handles length-changing case folds without duplicate ranges', () => {
    expect(findRanges('Straße', 's')).toEqual([
      { start: 0, end: 1 },
      { start: 4, end: 5 },
    ]);
    expect(findRanges('Straße', 'strasse')).toEqual([{ start: 0, end: 6 }]);
  });

  it('treats regular expression characters as text', () => {
    expect(findRanges('one.two', '.')).toEqual([{ start: 3, end: 4 }]);
  });

  it('returns no matches for an empty query', () => {
    expect(findRanges('message', '')).toEqual([]);
  });
});

describe('segment', () => {
  it('preserves the original text around matches', () => {
    const text = 'Straße';
    const ranges = findRanges(text, 's');

    expect(
      segment(text, ranges)
        .map((part) => part.text)
        .join(''),
    ).toBe(text);
  });
});
