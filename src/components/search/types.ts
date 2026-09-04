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

/** Matches of one message, keyed by the field they were found in. */
export type MatchesByField<T = unknown> = Record<string, Match<T>[]>;

/** The outcome of one search: every match in order, and a per-message lookup. */
export interface FindResults<T = unknown> {
  matches: Match<T>[];
  byId: Map<PropertyKey, MatchesByField<T>>;
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

/** Props of <HighlightedText>. */
export interface HighlightedTextProps {
  text: string;
  /** The message id this text belongs to, as seen by provideFind(). */
  id: PropertyKey;
  /** Which searchable field this text is, as named in provideFind's `fields`. */
  field?: string;
}

/** What the find bar does on each browser shortcut. */
export interface FindHotkeyHandlers {
  onFind(): void;
  onClose(): void;
  onNext(): void;
  onPrev(): void;
}

/** One of the bar's icon buttons. */
export interface FindBarButton {
  label: string;
  /** Keyboard equivalent, shown in the tooltip. */
  hint: string;
  /** SVG path data. */
  icon: string;
  run(): void;
  needsResults?: boolean;
}

/** One scrollbar tick: which match, and how far down the scroll height it sits. */
export interface Tick {
  index: number;
  pct: number;
}

/** Props of the preview card's marked-text renderer. */
export interface MarkedProps {
  segments: Segment<Match>[];
  /** Global index of the match to emphasise. */
  active: number;
}
