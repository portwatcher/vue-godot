# @vue-godot/cli

CLI tool for vue-godot projects — scaffolds new projects, integrates Vue into existing Godot projects, and generates type declarations.

## Installation

```bash
npm install -D @vue-godot/cli
```

Or run directly with `npx`:

```bash
npx vue-godot <command> [options]
```

## Commands

### `create`

Create a new Godot project with vue-godot set up and ready to go.

```bash
vue-godot create [name] [options]
```

| Argument | Description                                           |
| -------- | ----------------------------------------------------- |
| `name`   | Project name (used as dir name). Prompted if omitted. |

| Option   | Description                                                            |
| -------- | ---------------------------------------------------------------------- |
| `-f`     | Force overwrite if directory already exists                            |
| `--html` | Enable `@vue-godot/html` — HTML-like components on Godot nodes        |

When `--html` is set, the scaffolded project includes:
- `@vue-godot/html` as a dependency
- Vite compiler config (`isNativeTag`) so lowercase HTML tags like `<div>`, `<img>` resolve as components
- `htmlPlugin` registered in `main.ts` for global component availability

**Example:**

```bash
npx vue-godot create my-game --html
cd my-game
npm install
npm run build
```

### `integrate`

Scaffold a `vue/` folder with Vite + Vue configuration for an existing Godot project.

```bash
vue-godot integrate [dir] [options]
```

| Argument | Description                        |
| -------- | ---------------------------------- |
| `dir`    | Target directory (defaults to `.`) |

| Option   | Description                                                            |
| -------- | ---------------------------------------------------------------------- |
| `-f`     | Force overwrite if `vue/` already exists                               |
| `--html` | Enable `@vue-godot/html` — HTML-like components on Godot nodes        |

This command:

1. Copies a Vue + Vite template into `<dir>/vue/`
2. Creates or updates `package.json` with the necessary scripts and dependencies
3. Resolves `node_modules` paths for the generated `tsconfig.json`

**Example:**

```bash
cd my-existing-godot-project
npx vue-godot integrate
npm install
npm run gen:types
npm run dev
```

### `gen-types`

Generate Vue `GlobalComponents` type augmentation from GodotJS typings. This gives Volar full autocomplete and type checking for Godot node tags (e.g. `<Button>`, `<Label>`) in `.vue` templates.

```bash
vue-godot gen-types [options]
```

| Option       | Default                                   | Description                                        |
| ------------ | ----------------------------------------- | -------------------------------------------------- |
| `--typings`  | `./typings`                               | Directory containing `godot*.gen.d.ts` files       |
| `--out`      | `<typings>/godot.vue-components.gen.d.ts` | Output file path for the generated `.d.ts`         |
| `--ancestor` | `Control`                                 | Base class — only descendants are included         |
| `--vue-src`  | `./vue/src`                               | Vue source dir — generates an `env.d.ts` shim here |

**Example:**

```bash
cd apps/v-model
npx vue-godot gen-types
```

Re-run whenever Godot typings are regenerated (e.g. after a Godot version upgrade).

## Development (monorepo)

From the repository root:

```bash
npm install
npm run build        # builds all packages via Turborepo
npx vue-godot        # runs the locally-built CLI
```

## License

MIT
