# Agent Instructions

## Code Quality Checks

When preparing changes, use these code quality scripts from `package.json`:

1. `bun run lint:fix`
2. `bun run knip:fix`
3. `bun run format:fix`
4. `bun run types:check`
5. `bun run test`

Run the fixers before the check-only commands. Keep `format:fix` after the other
fixers so Prettier normalizes any files that ESLint or Knip changed. Run
`types:check` and `test` last so they validate the final source state.
