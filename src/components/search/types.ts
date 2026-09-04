import type { ComputedRef, Ref } from 'vue';

/** A half-open character range inside a string. */
export interface Range {
  start: number;
  end: number;
}

/** A piece of text, either plain or covering one match. */
export interface Segment<M extends Range = Range> {
  text: string;
  match?: M;
}

/** One occurrence of the query, with its position among all matches. */
export interface Match<T = unknown> extends Range {
  /** Position in the flat, document-ordered list of every match. */
  index: number;
  /** The message it belongs to, as returned by `getId`. */
  id: PropertyKey;
  item: T;
  /** Which searchable field of the message it sits in. */
  field: string;
}

export interface FindConfig {
  colors: {
    match: string;
    matchText: string;
    activeMatch: string;
    activeMatchText: string;
    activeMatchOutline: string;
    tick: string;
    activeTick: string;
  };
  motion: {
    ringMs: number;
    shakeMs: number;
    barEnterMs: number;
    barLeaveMs: number;
  };
  behavior: {
    selectMatchOnClose: boolean;
  };
  text: {
    placeholder: string;
    noResults: string;
  };
  /** Which fields (by the names given to `fields`) the tick-mark preview shows. */
  preview: {
    title: string | null;
    subtitle: string | null;
    body: string | null;
  };
}

/** Any subset of the config; untouched keys keep their defaults. */
export type FindConfigOverrides = { [S in keyof FindConfig]?: Partial<FindConfig[S]> };

export interface FindOptions<T> {
  /**
   * Searchable fields by name, in the order they appear on screen (that order
   * is the order matches are stepped through). Defaults to `text`.
   */
  fields?: Record<string, (item: T) => unknown>;
  getId?: (item: T) => PropertyKey;
  /** Which match to land on when the result set changes. Defaults to the first. */
  startAt?: (matches: Match<T>[]) => number | Promise<number>;
  config?: FindConfigOverrides;
}

/** The find state shared with FindBar and HighlightedText. */
export interface Find<T = unknown> {
  config: FindConfig;
  query: Ref<string>;
  isOpen: Ref<boolean>;
  /** Every match in document order, each with its global index. */
  matches: ComputedRef<Match<T>[]>;
  total: ComputedRef<number>;
  /** Index of the current match in `matches`, -1 when there is none. */
  current: Ref<number>;
  /** The text of one field of one item, always a string. */
  fieldText(item: T, field: string): string;
  /** Matches inside one field of one message; the same empty array whenever there are none. */
  matchesFor(id: PropertyKey, field?: string): readonly Match<T>[];
  open(): void;
  close(): void;
  next(): void;
  prev(): void;
  goTo(index: number): void;
}
