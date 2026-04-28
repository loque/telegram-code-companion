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

## Coding Philosophy

As a rule of thumb:

- prefer simplicity and readability over cleverness
- avoid premature optimization; optimize only when necessary and based on
  evidence
- write code that is easy to understand and maintain, even if it means being
  more verbose
- prioritize correctness and reliability over performance, unless performance is
  a critical requirement
- avoid premature abstraction; abstract only when it provides clear benefits in
  terms of code reuse or maintainability, do not abstract just so the code looks
  cleaner or can be tested more easily
- avoid over-engineering; do not add unnecessary complexity or features that are
  not required by the current requirements or use cases
- prefer domain-driven design principles, such as modeling the problem domain
  accurately and using meaningful names for variables, functions, and classes
