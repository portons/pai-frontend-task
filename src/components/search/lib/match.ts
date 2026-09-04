import type { Range, Segment } from '../types';

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const combiningMark = /\p{M}/u;

// The upper/lower round trip also folds characters such as ß and ς.
const fold = (text: string) =>
  text.normalize('NFD').replace(/\p{M}/gu, '').toUpperCase().toLowerCase();

// Track original offsets because case folding can change string length.
function foldWithOffsets(text: string) {
  let folded = '';
  const starts: number[] = [];
  const ends: number[] = [];
  let offset = 0;
  for (const char of text) {
    const foldedChar = fold(char);
    for (let unit = 0; unit < foldedChar.length; unit++) {
      starts.push(offset);
      ends.push(offset + char.length);
    }
    folded += foldedChar;
    offset += char.length;
  }
  return { folded, starts, ends };
}

export function findRanges(text: string, query: string): Range[] {
  const needle = foldWithOffsets(query).folded;

  if (!needle) return [];

  const { folded, starts, ends } = foldWithOffsets(text);
  const pattern = new RegExp(escapeRegExp(needle), 'g');
  const ranges: Range[] = [];

  for (const found of folded.matchAll(pattern)) {
    const start = starts[found.index]!;
    let end = ends[found.index + found[0].length - 1]!;

    for (const character of text.slice(end)) {
      if (!combiningMark.test(character)) break;
      end += character.length;
    }

    if (!ranges.length || start >= ranges[ranges.length - 1]!.end) {
      ranges.push({ start, end });
    }
  }

  return ranges;
}

export function segment<M extends Range>(text: string, ranges: readonly M[]): Segment<M>[] {
  const out: Segment<M>[] = [];
  let pos = 0;

  for (const range of ranges) {
    if (range.start > pos) out.push({ text: text.slice(pos, range.start) });

    out.push({ text: text.slice(range.start, range.end), match: range });
    pos = range.end;
  }

  if (pos < text.length) out.push({ text: text.slice(pos) });

  return out;
}
