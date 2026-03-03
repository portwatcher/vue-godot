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
