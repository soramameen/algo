# AGENTS.md
## 指示
- コーディングタスク時には必ず、docs/TDD.mdの指示に従う。
## 実装フロー
7まで行うことを実装完了と呼ぶ。
1. 実装計画確認
2. `git status`で現状確認
3. 最新の状態のmainブランチから改善用branchをきりworktree作成
4. 実装
5. 適切なcommitの単位に切り分け、それぞれreviewする。不適切な修正の場合は1に戻る
6. commit
7. PRを作成する

## Purpose
- This repository is a Vite + React + TypeScript app for visualizing algorithms.
- Use this file as the operating guide for coding agents working in this repo.
- Prefer matching the existing codebase over introducing new patterns.

## Repository Facts
- Package manager: `npm`
- App framework: React 19
- Build tool: Vite
- Language: TypeScript with `strict` mode enabled
- Test runner: Vitest
- DOM test utilities: React Testing Library + `@testing-library/jest-dom`
- Deployment target: GitHub Pages

## Project Layout
- `src/main.tsx`: application entry point
- `src/App.tsx`: primary UI shell and playback logic
- `src/algorithms/`: algorithm step generators
- `src/data/algorithms.ts`: algorithm metadata and registry
- `src/types.ts`: shared domain types
- `src/styles.css`: global styles
- `tests/`: Vitest test suite
- `.github/workflows/`: CI and deployment workflows
- `docs/plans/`: longer design or planning notes if present

## Source Of Truth
- Follow actual repository configuration first.
- Follow existing code patterns second.
- Do not assume tools exist unless they are present in `package.json` or config files.

## Commands
- Install dependencies: `npm ci`
- Start dev server: `npm run dev`
- Run all tests: `npm test`
- Build production bundle: `npm run build`
- Preview production build: `npm run preview`

## Single Test Commands
- Run one test file: `npm test -- tests/bubble-sort.test.ts`
- Run one test by name: `npm test -- -t "returns the sorted values on the final step"`
- Run UI test file: `npm test -- tests/app.test.tsx`
- Vitest CLI flags pass through after `--` because the script is `vitest run`.

## Lint / Static Checks
- There is currently no dedicated `lint` script in `package.json`.
- Do not tell users to run `npm run lint` unless you add and document that script.
- The main static safety check is included in build: `tsc --noEmit -p tsconfig.json`.
- `npm run build` is the required verification command because it type-checks and bundles.

## Required Verification
- For code changes, prefer running `npm test` and `npm run build` before finishing.
- For targeted fixes, at minimum run the most relevant single test file plus `npm run build`.
- If you change only algorithm step generation logic, run the relevant unit test file.
- If you change `App.tsx`, controls, rendering, or accessibility text, run `tests/app.test.tsx`.

## Cursor / Copilot Rules
- No `.cursor/rules/` directory was found.
- No `.cursorrules` file was found.
- No `.github/copilot-instructions.md` file was found.
- If any of these files are added later, merge their instructions into this document and follow the more specific rule where applicable.

## TypeScript Configuration Constraints
- `strict` is enabled.
- `noUnusedLocals` is enabled.
- `noUnusedParameters` is enabled.
- `noFallthroughCasesInSwitch` is enabled.
- `moduleResolution` is `Bundler`.
- `jsx` is `react-jsx`.
- Code must compile cleanly without relying on emit.

## General Code Style
- Use TypeScript ES modules.
- Use two-space indentation.
- Use double quotes, not single quotes.
- Omit semicolons to match the existing codebase.
- Prefer small, focused functions.
- Prefer straightforward control flow over abstraction.
- Keep UI rendering logic readable even when somewhat repetitive.
- Add comments only when behavior is not obvious from the code.

## Imports
- Put external imports before local imports.
- Use `import type` for type-only imports.
- Keep import groups compact; do not add decorative spacing unless clarity improves.
- Prefer relative imports that match the current project structure.
- Do not introduce path aliases unless the repo is updated to support them.
- Keep CSS side-effect imports near the entry point or component that owns them.

## React Conventions
- Use function components.
- Prefer hooks-based state management.
- Follow the existing pattern of `useState`, `useEffect`, and `useMemo` where needed.
- Do not add memoization hooks by default; add them only when there is a clear need.
- Keep derived values inline or in small helpers when it improves readability.
- Preserve accessible labels and roles because tests rely on them.
- Avoid unnecessary component splitting in this small app.

## Domain Modeling
- Shared domain types belong in `src/types.ts`.
- Algorithm catalog data belongs in `src/data/algorithms.ts`.
- Algorithm-specific step generation belongs in `src/algorithms/<name>.ts`.
- Prefer extending existing discriminated or literal-union types over introducing loosely typed strings.
- When adding a new algorithm, update both the type union and the algorithm registry.

## Naming
- React components: PascalCase
- Functions and variables: camelCase
- Type aliases: PascalCase
- File names for algorithms: kebab-case, for example `bubble-sort.ts`
- Constants: `UPPER_SNAKE_CASE` only for true constants shared as stable values; otherwise use `camelCase`
- Use descriptive names like `selectedAlgorithm`, `activeIndices`, `targetValue`, `intervalMs`
- Prefer naming that reflects domain behavior instead of generic names like `data`, `item`, or `helper`

## Types
- Prefer explicit domain types over `any`.
- Avoid `as` casts unless there is no cleaner option.
- Prefer narrow unions such as `"compare" | "swap"` over freeform strings.
- Keep optional properties genuinely optional; do not fill them with placeholder values without need.
- Use local helper types when they reduce duplication, as in `CellSnapshot`.
- Preserve readonly semantics only if introduced consistently; the current code does not rely on them heavily.

## Functions And Logic
- Prefer pure functions for algorithm step generation.
- Avoid mutating caller-owned inputs unless mutation is clearly intentional.
- Local cloning helpers are acceptable when they keep snapshots correct and obvious.
- Keep helper functions near the logic that uses them.
- Prefer direct loops when they are clearer than chained array methods.
- Minimize hidden behavior and shared mutable state.

## Error Handling
- This codebase currently contains little explicit error handling.
- Do not add broad `try/catch` blocks without a real failure mode to handle.
- Validate assumptions when new user input or async behavior is introduced.
- Fail early with clear conditions when invalid state is possible.
- In UI code, prefer guarding nullable values over swallowing errors.
- In pure algorithm code, prefer returning correct deterministic output over defensive noise.

## Testing Style
- Put tests in `tests/`.
- Use `*.test.ts` for non-React code.
- Use `*.test.tsx` for React rendering tests.
- Use `describe`, `it`, and `expect` from Vitest.
- Prefer behavior-oriented assertions over implementation-detail assertions.
- For algorithms, test final snapshots, actions, indices, and messages.
- For UI, test visible text, ARIA labels, roles, classes, and timer-driven transitions when relevant.
- Use fake timers when testing playback behavior.
- `tests/setup.ts` already loads `@testing-library/jest-dom`.

## UI And Accessibility
- Keep interactive elements as real buttons, labels, and form controls.
- Preserve existing Japanese UI copy unless the task requires changing text.
- Remember that tests assert on exact Japanese strings in several places.
- Preserve `aria-label` values unless corresponding tests are updated.
- If changing class names used in tests, update tests in the same change.

## Styling
- Global styles currently live in `src/styles.css`.
- Reuse existing class naming patterns such as `*-card`, `*-label`, `*-value`, `*-index`.
- Avoid introducing CSS-in-JS or a styling framework unless explicitly requested.
- Prefer small style extensions over large visual rewrites.

## Build And Deployment Notes
- Vite config sets `base` dynamically for GitHub Pages using `GITHUB_ACTIONS`.
- Do not break the `/algo/` production base path assumption without updating deployment logic.
- `main` is the release branch according to repository guidance.

## Change Scope Guidance
- Keep changes small and local.
- Do not refactor unrelated files while fixing a focused issue.
- Do not create new abstractions unless duplication or complexity actually justifies them.
- If you add a new pattern, apply it consistently in the touched area.

## Before Finishing
- Re-read affected files for consistency with existing style.
- Run the smallest useful test command plus broader verification as appropriate.
- Mention clearly if a command could not be run.
- Mention clearly if no lint command exists instead of implying that lint passed.
