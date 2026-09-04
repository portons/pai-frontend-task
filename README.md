# Find in conversation

A chat transcript with a browser-style **find in page**: press <kbd>⌘F</kbd> / <kbd>Ctrl+F</kbd>,
type, and every match lights up across message text, sender names and timestamps.

## Run it

```sh
npm install
npm run dev        # http://localhost:5173
```

```sh
npm run build      # type-checks with vue-tsc, then bundles
npm run lint       # ESLint (Vue + TypeScript presets)
npm run format     # Prettier over the whole project
```

Vue 3.5 · Vite 6 · Tailwind CSS 4 · TypeScript 6, strict, no `any`.

## Using the finder

| Action                         | Keys                                      |
| ------------------------------ | ----------------------------------------- |
| Open, or reselect the query    | <kbd>⌘F</kbd> / <kbd>Ctrl+F</kbd>         |
| Next / previous match          | <kbd>Enter</kbd> / <kbd>Shift+Enter</kbd> |
| Next / previous, from anywhere | <kbd>⌘G</kbd> / <kbd>⌘⇧G</kbd>            |
| Close                          | <kbd>Esc</kbd>                            |

Matching is case- and accent-insensitive ("cafe" finds "Café", "strasse" finds "Straße").
The scrollbar carries one tick per match; hover a tick to preview its message, click it to jump.

Behaviour borrowed from the browsers and chat apps that do this well:

- A new search starts at the first match at or below the viewport, so typing never yanks you to the top (Chrome).
- Closing leaves the current match as a normal text selection, so you keep your place and can copy it (Chrome).
- Light yellow for matches, orange for the current one, dark text on both (Chromium, Telegram Desktop). White text on orange fails the 4.5:1 contrast floor.
- Enter with no results shakes the bar; the counter turns red at `0/0`; counts are announced to screen readers.

## Code layout

```
src/
  App.vue                 composition root: parse, group by day, provide the finder
  types.ts                ApiMessage, Message, DayGroup, component props
  lib/                    dates, messages, initials — pure functions
  components/
    chat/                 ChatHeader, ChatMessage
    search/               the find module (importable on its own)
      index.ts            public API
      types.ts            Find, Match, FindConfig, FindOptions, …
      config.ts           colours, motion, copy, option defaults
      lib/                createFind (state, DOM-free), match (pure text), dom, nearestVisibleMatch
      composables/        provideFind / useFind (provide–inject), useFindHotkeys
      directives/         v-scroll-into-view
      components/         FindBar, FindTicks, HighlightedText
```

### The search module's API

```ts
// in the component that owns the list
provideFind(messages, {
  fields: { from: (m) => m.from, text: (m) => m.text, created: (m) => label(m.created) },
  config: { preview: { title: 'from', subtitle: 'created' } },
});
```

```vue
<FindBar />
<!-- wherever a searchable field is rendered -->
<HighlightedText :text="message.text" :id="message.id" />
<HighlightedText :text="message.from" :id="message.id" field="from" />
```

`fields` are named getters in on-screen order; that order is the order matches are stepped
through. Every colour, duration and string lives in `config.ts` and can be overridden per use.
`createFind` holds all the state and knows nothing about the DOM, so it can be unit-tested or
driven by a different UI.

## What changed in the original code

- Dead stylesheet link removed; document language and title set.
- The message bubble's contradictory Tailwind classes (`shadow-sm` + `!shadow-none`, `break-words` + `!break-all`, no-op tokens, negative-margin hacks) replaced by a flex column.
- Avatar initials derived from the sender name; the data's `initials` field disagreed with the name in 167 of 250 rows.
- Timestamps parsed once into `Date`, rendered in `<time>` with Intl formatting, and the list grouped under sticky day separators.
- Semantic structure: a `role="log"` region, one `<article>` per message, a `<header>`.
- Converted to strict TypeScript, Prettier with semicolons over the whole project.

## Deliberately left out

Tests (the pure functions in `search/lib` and `lib/` are written for them), virtualisation
(250 messages render fine), fuzzy matching (a find bar promises exact counts), and the CSS
Custom Highlight API (no DOM changes, but no `aria-current`, no element to anchor ticks to).
