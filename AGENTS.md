# Repository Guidelines

## Project Structure & Module Organization
This is a Vite + React + TypeScript app for visualizing algorithms. Application code lives in `src/`, with algorithm implementations in `src/algorithms/`, shared data in `src/data/algorithms.ts`, and types in `src/types.ts`. UI entry points are `src/main.tsx` and `src/App.tsx`. Test files live in `tests/`, and long-running planning notes are kept in `docs/plans/`. GitHub Actions workflows are under `.github/workflows/`.

## Build, Test, and Development Commands
- `npm ci` installs dependencies exactly as locked.
- `npm run dev` starts the local Vite dev server.
- `npm test` runs the Vitest suite in jsdom.
- `npm run build` type-checks with `tsc` and produces the production bundle.
- `npm run preview` serves the built app locally for verification.

## Coding Style & Naming Conventions
Follow the existing TypeScript and React style in the repo: ES modules, two-space indentation, double quotes, and small focused functions. Use PascalCase for React components, camelCase for variables and functions, and kebab-case for file names such as `bubble-sort.ts`. Keep UI state and algorithm step logic separate when possible.

## Testing Guidelines
Use Vitest with React Testing Library. Test files should be named `*.test.ts` or `*.test.tsx` and placed in `tests/`. Prefer user-visible behavior tests for UI and direct unit tests for algorithm step generation. Before opening a PR, run `npm test` and `npm run build`.

## Commit & Pull Request Guidelines
Recent commits use short imperative English messages such as `Add ...`, `Fix ...`, `Update ...`, or `Switch ...`. Branch names commonly follow `feature/...`, `fix/...`, or `issue-...`. PRs should describe the change, mention how it was verified, and include screenshots or short notes when UI behavior changes. Keep PRs scoped to one feature or fix.

## Deployment Notes
`main` is the release branch. Merges to `main` trigger the GitHub Pages deployment workflow, so make sure the app passes tests and builds cleanly before merging.
