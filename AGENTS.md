# Agent Coding Guidelines

Rules and conventions that all AI coding agents **must** follow when contributing to this repository.

## TypeScript

### No `as any`

Never use `as any` in source code. This includes:

- Direct casts: `value as any`
- Intermediate casts: `value as any as SomeType`
- Generic parameters: `foo<any>()`-style usage when a concrete type is available

Instead, prefer:

- **Narrow union types** — define the exact set of types a value can be.
- **`unknown` with type guards** — use `as unknown` followed by a runtime check or a well-justified `as ConcreteType`.
- **Helper functions / switch dispatch** — when a dynamic key indexes into an object, use a switch statement that calls each variant explicitly (see `callImageLoader` in `packages/html/src/utils/textureLoader.ts` for an example).
- **Wrapper constructors** — e.g. `new Callable(callable)` instead of `callable as any` when converting between compatible Godot types.
- **`Record<string, unknown>`** — for loosely-typed dictionary access on `globalThis` or similar objects, instead of `globalThis as any`.

If you believe a cast is truly unavoidable, leave a `// SAFETY:` comment explaining
why `as any` is the _only_ viable option and open a discussion with the maintainer.

### DRY — Don't Repeat Yourself

Never duplicate non-trivial logic across files. If the same function, type, constant, or pattern appears (or would appear) in more than one place:

1. **Extract** it into a shared module inside the nearest common `utils/` directory.
2. **Export** the shared symbol from the package's public `index.ts` when it is useful to consumers.
3. **Import** from the shared module in every call-site — never copy-paste and adapt.

When deciding whether something counts as "non-trivial":

- **Extract**: helper functions, parsers, mapping tables, type definitions, constants with domain meaning.
- **OK to inline**: one-line expressions, simple boolean checks, framework boilerplate that cannot be meaningfully abstracted.

If you spot existing duplication while working on a task, refactor it as part of the same change.

## Documentation

### Keep READMEs up to date

Every package under `packages/` has a `README.md`. When you add, remove, rename, or change the public API surface of a package (exports, polyfilled globals, new modules, changed behaviour), you **must** update that package's `README.md` in the same change.

Specifically:

- **New API** — add a row to the "Provided APIs" table (or equivalent section) and, if the feature is non-trivial, add a dedicated subsection with usage examples and spec/behaviour notes.
- **Removed / renamed API** — delete or update the corresponding table row, section, and any code examples that reference it.
- **Changed behaviour** — update the description so it accurately reflects the new behaviour. Do not leave stale documentation.
- **New package** — create a `README.md` following the same structure as existing packages (title, description, installation, quick start, API table, detailed sections, requirements, license).

If you are unsure whether a change affects the README, err on the side of updating it.

### Keep GitHub issues aligned with the codebase

Open issues must accurately reflect the current state of the repository. When your work resolves, partially resolves, or invalidates an open issue, you **must** update that issue in the same session.

#### Closing resolved issues

Close an issue when **all** of its acceptance criteria are met in the codebase. The closing comment must include:

- A brief statement of what was done.
- The **commit hash(es)** that implement the resolution (e.g. `447fe2b`).
- References to the key files added or changed.

Example closing comment:

> Closing — `<Video>` component implemented in `packages/html/src/components/Video.ts`. Supports src, autoplay, loop, muted, volume, @ended. Registered and tested.
>
> Commit: 22f6ad0

#### Updating partially resolved issues

When your work completes **some but not all** items in an issue, add a status-update comment that includes:

- A clear list of what is **done** (with commit hashes).
- A clear list of what **remains** open.
- Updated checkbox state if the issue body uses a task list.

Do not close a partially resolved issue.

#### Superseded or duplicate issues

If a newer issue fully covers an older one, or if two issues track the same work, close the redundant issue with a comment linking to the canonical issue.

#### Tracker / meta issues

When closing an issue that is referenced in a tracker or meta issue (e.g. a beta-readiness checklist), update the tracker's checklist in the same session — check off completed items and note the closing commit hashes.

#### When to review issues

- **After implementing a feature or fix** — scan open issues for any that your change resolves or advances.
- **When explicitly asked** — use `gh issue list` to audit all open issues against the current codebase and close or update every stale entry.
