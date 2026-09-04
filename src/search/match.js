/**
 * Pure text matching. No Vue, no DOM.
 * @typedef {{ start: number, end: number }} Range
 */

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Case- and accent-insensitive form of a string: "Café" → "cafe", "ß" → "ss".
 * The upper-then-lower round trip is full case folding; toLowerCase() alone
 * leaves "ß" and "ς" unmatched against "ss" and "σ".
 */
const fold = (s) => s.normalize('NFD').replace(/\p{M}/gu, '').toUpperCase().toLowerCase()

/**
 * Folds `text` one character at a time, remembering for every folded code
 * unit which original character produced it. Folding can change the length
 * of a string, so offsets found in the folded text must be mapped back.
 */
function foldWithOffsets(text) {
  let folded = ''
  const starts = []
  const ends = []
  let offset = 0
  for (const char of text) {
    const f = fold(char)
    for (let i = 0; i < f.length; i++) {
      starts.push(offset)
      ends.push(offset + char.length)
    }
    folded += f
    offset += char.length
  }
  return { folded, starts, ends }
}

/**
 * Every occurrence of `query` in `text`, ignoring case and accents.
 * @returns {Range[]} sorted, non-overlapping, in original-string offsets
 */
export function findRanges(text, query) {
  const needle = foldWithOffsets(query).folded
  if (!needle) return []
  const { folded, starts, ends } = foldWithOffsets(text)
  const re = new RegExp(escapeRegExp(needle), 'g')
  return Array.from(folded.matchAll(re), (m) => ({
    start: starts[m.index],
    end: ends[m.index + m[0].length - 1],
  }))
}

/**
 * Split `text` into plain and matched pieces, so a template can render
 * text nodes and <mark> elements without ever touching innerHTML.
 * @template {Range} T
 * @param {string} text
 * @param {T[]} ranges sorted, non-overlapping
 * @returns {{ text: string, match?: T }[]}
 */
export function segment(text, ranges) {
  const out = []
  let pos = 0
  for (const range of ranges) {
    if (range.start > pos) out.push({ text: text.slice(pos, range.start) })
    out.push({ text: text.slice(range.start, range.end), match: range })
    pos = range.end
  }
  if (pos < text.length) out.push({ text: text.slice(pos) })
  return out
}
