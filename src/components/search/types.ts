import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';

export interface Range {
  start: number;
  end: number;
}

export interface Segment<M extends Range = Range> {
  text: string;
  match?: M;
}

export interface Match<T = unknown> extends Range {
  index: number;
  id: PropertyKey;
  item: T;
  field: string;
}

export interface FindConfig {
  colors: {
    match: string;
    matchText: string;
    activeMatch: string;
    activeMatchText: string;
    tick: string;
    activeTick: string;
  };
  motion: {
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
  preview: {
    title: string | null;
    subtitle: string | null;
    body: string | null;
  };
}

export type MatchesByField<T = unknown> = Record<string, Match<T>[]>;

export interface FindResults<T = unknown> {
  matches: Match<T>[];
  byId: Map<PropertyKey, MatchesByField<T>>;
}

export type FindConfigOverrides = { [S in keyof FindConfig]?: Partial<FindConfig[S]> };

export interface FindOptions<T> {
  fields?: Record<string, (item: T) => unknown>;
  getId?: (item: T) => PropertyKey;
  startAt?: (matches: Match<T>[]) => number | Promise<number>;
  config?: FindConfigOverrides;
}

export interface FindProviderOptions<T> extends FindOptions<T> {
  root?: MaybeRefOrGetter<HTMLElement | null>;
}

export interface Find<T = unknown> {
  config: FindConfig;
  query: Ref<string>;
  isOpen: Ref<boolean>;
  matches: ComputedRef<Match<T>[]>;
  total: ComputedRef<number>;
  current: Ref<number>;
  fieldText(item: T, field: string): string;
  matchesFor(id: PropertyKey, field?: string): readonly Match<T>[];
  open(): void;
  close(): void;
  next(): void;
  prev(): void;
  goTo(index: number): void;
}

export interface HighlightedTextProps {
  text: string;
  id: PropertyKey;
  field?: string;
}

export interface FindHotkeyHandlers {
  onFind(): void;
  onClose(): void;
  onNext(): boolean;
  onPrev(): boolean;
}

export interface FindBarButton {
  label: string;
  hint: string;
  icon: string;
  run(): void;
  needsResults?: boolean;
}

export interface Tick {
  index: number;
  pct: number;
}

export interface MarkedProps {
  segments: Segment<Match>[];
  active: number;
}
