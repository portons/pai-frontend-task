# Find in conversation

A Vue 3 chat interface with browser-style search.

## Setup

```sh
npm install
npm run dev
```

Available checks:

```sh
npm run build
npm run lint
npm run format:check
```

## Search

| Action         | Shortcut                                              |
| -------------- | ----------------------------------------------------- |
| Open or focus  | <kbd>Cmd/Ctrl+F</kbd>                                 |
| Next match     | <kbd>Enter</kbd> or <kbd>Cmd/Ctrl+G</kbd>             |
| Previous match | <kbd>Shift+Enter</kbd> or <kbd>Cmd/Ctrl+Shift+G</kbd> |
| Close          | <kbd>Esc</kbd>                                        |

Search is case- and accent-insensitive and covers message text, sender names, and timestamps.
Matches are highlighted in the conversation and marked alongside the scrollbar.

## Structure

- `src/components/chat`: chat UI
- `src/components/search`: search state, matching, controls, and highlighting
- `src/lib`: message and date helpers
