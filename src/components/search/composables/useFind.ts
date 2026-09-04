import { inject, provide, type InjectionKey, type MaybeRefOrGetter } from 'vue';
import { createFind } from '../lib/createFind';
import { nearestVisibleMatch } from '../lib/nearestVisibleMatch';
import type { Find, FindProviderOptions } from '../types';

const KEY: InjectionKey<Find> = Symbol.for('find-in-conversation');
const ROOT_KEY: InjectionKey<MaybeRefOrGetter<HTMLElement | null>> = Symbol.for(
  'find-in-conversation-root',
);

export function provideFind<T extends object>(
  items: MaybeRefOrGetter<T[]>,
  options: FindProviderOptions<T>,
): Find<T> {
  const { root, ...findOptions } = options;
  const find = createFind(items, {
    startAt: () => nearestVisibleMatch(root),
    ...findOptions,
  });

  provide(KEY, find);
  provide(ROOT_KEY, root);

  return find;
}

export function useFind(): Find {
  const find = inject(KEY, null);

  if (!find) throw new Error('useFind() called without provideFind() in an ancestor component');

  return find;
}

export function useFindRoot(): MaybeRefOrGetter<HTMLElement | null> {
  return inject(ROOT_KEY, null);
}
