import type { Range, Segment } from '../types';

/** Pure text matching. No Vue, no DOM. */

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Case- and accent-insensitive form of a string: "Café" → "cafe", "ß" → "ss".
 * The upper-then-lower round trip is full case folding; toLowerCase() alone
 * leaves "ß" and "ς" unmatched against "ss" and "σ".
 */
const fold = (text: string) =>
  text.normalize('NFD').replace(/\p{M}/gu, '').toUpperCase().toLowerCase();

/**
 * Folds `text` one character at a time, remembering for every folded code
 * unit which original character produced it. Folding can change the length
 * of a string, so offsets found in the folded text must be mapped back.
 */
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

/**
 * Every occurrence of `query` in `text`, ignoring case and accents.
 * Sorted, non-overlapping, in original-string offsets.
 */
export function findRanges(text: string, query: string): Range[] {
  const needle = foldWithOffsets(query).folded;

  if (!needle) return [];

  const { folded, starts, ends } = foldWithOffsets(text);
  const pattern = new RegExp(escapeRegExp(needle), 'g');

  return Array.from(folded.matchAll(pattern), (found) => ({
    start: starts[found.index]!,
    end: ends[found.index + found[0].length - 1]!,
  }));
}

/**
 * Split `text` into plain and matched pieces, so a template can render
 * text nodes and <mark> elements without ever touching innerHTML.
 * `ranges` must be sorted and non-overlapping.
 */
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
