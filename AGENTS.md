# Agent Coding Guidelines

Rules and conventions that all AI coding agents **must** follow when contributing to this repository.

You can update this doc if you found something important that should be persisted as baked system prompts. Always keep this doc and other docs inside monorepo up-to-date.

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

## Vue Compiler Options (`isNativeTag` / `isCustomElement`)

Vue's template compiler has two hooks that control how tags are classified:

- **`isNativeTag`** — identifies browser-native HTML elements (`<div>`, `<span>`, …). When `true`, the tag emits a plain platform element with **no component resolution**.
- **`isCustomElement`** — marks a tag as a custom element (passed through to the renderer as-is, no component lookup).

Godot is **not a browser**. There are no native HTML elements. Every `vite.config.ts` in this repo **must** set:

```ts
isNativeTag: () => false,
```

Without this, Vue's default `isNativeTag` (which knows about real HTML tags like `div`, `button`, `select`, …) will short-circuit component resolution. Tags like `<div>` would be emitted as raw platform elements instead of resolving to `@vue-godot/html` components registered via `htmlPlugin`.

For **`@vue-godot/html` apps**, `isCustomElement` must also exclude the HTML component names so they go through Vue's global component resolution:

```ts
isCustomElement: (tag) =>
  tag[0] === tag[0].toUpperCase() &&
  !htmlTags.includes(tag.toLowerCase()),
```

For **non-HTML apps** (pure Godot nodes), all uppercase tags are custom elements:

```ts
isCustomElement: (tag) => tag[0] === tag[0].toUpperCase(),
```

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

### Keep `apps/html-demo` up to date

`apps/html-demo` is the integration demo app that exercises **every** `@vue-godot/html` component and `@vue-godot/browser` API. When you add, remove, or rename a component in `@vue-godot/html` or a polyfilled API in `@vue-godot/browser`, you **must** update `apps/html-demo` in the same change:

- **New `@vue-godot/html` component** — add a section in `App.vue` that renders the component with representative props, events, and reactive state. Use lowercase HTML tag names (e.g. `<div>`, `<button>`) since `htmlPlugin` registers both cases.
- **New `@vue-godot/browser` API** — add a smoke test in the `runBrowserTests()` function that instantiates or calls the API and reports success/failure.
- **Removed / renamed component or API** — remove or update the corresponding section in `App.vue`.
- **New `htmlTags` entry** — also add the tag to the `htmlTags` array in `apps/html-demo/vue/vite.config.ts` and in `packages/cli/src/integrate.ts` (`generateHtmlViteConfig`).

The demo must build successfully (`npm run build` from the app directory) after every change.
