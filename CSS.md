# CSS-like Theme Layer for Vue Godot

Status: implementation roadmap phases 1-6 complete; scoped SFC styles and
utility presets remain deferred future work

Audience: future implementers of `@vue-godot/html`, `@vue-godot/cli`, and
example apps.

This document describes a CSS-like theme and stylesheet layer for Vue Godot.
The goal is to let developers author familiar web-style visual rules while the
runtime maps those rules to Godot `Theme`, Godot `Control` properties,
`StyleBoxFlat`, existing `@vue-godot/html` style helpers, and component-specific
state handling.

Implementation note: `@vue-godot/html` now ships the first five phases:
structured themes via `defineHtmlTheme()`, opt-in `defaultStyles` presets,
explicit global stylesheet registration through `createHtmlStyleSheet()`,
class/type/group selector matching, root token resolution, shared component
style resolution, and state pseudo-class styling for the documented component
states. It also supports the limited responsive media query subset documented
below through viewport buckets refreshed from Godot window metrics. Vite global
CSS collection is available through `@vue-godot/html/vite`, with generated
HTML-mode projects importing `vue/src/app.css` directly. `@vue-godot/cli`
ships the Phase 6 static migration audit through
`vue-godot doctor --migration`. Scoped SFC styles remain a future phase.

This is not a proposal to make Godot a browser. It is a proposal to improve
the migration path for compatible Vue apps and to make native-feeling mobile
apps easier to build.

## Short Version

The viable target is:

- CSS-like theme tokens.
- CSS-like component defaults.
- CSS-like class rules for `@vue-godot/html` components.
- Browser-ish and native-app default style presets.
- Godot `Theme` generation where Godot has a native theming surface.
- Existing `@vue-godot/html` inline style mapping for layout, backgrounds,
  borders, text, transforms, transitions, and animations.
- Good warnings when a CSS selector or property cannot be represented.

The non-viable target is:

- Arbitrary Vue web apps running unchanged with full browser DOM, CSSOM, and
  layout behavior.

The useful promise should be:

> Vue apps that follow the Vue Godot compatibility profile can migrate with
> small changes, keep familiar CSS-like authoring, and render through native
> Godot UI nodes.

## Why This Matters

Today `@vue-godot/html` already accepts inline style objects, CSS declaration
strings, and arrays of styles. It maps a documented CSS subset to Godot
containers and properties. That is a strong base for app development, but it
does not yet provide the parts developers expect from a mature app UI stack:

- App-wide tokens.
- Component defaults.
- Class-based reuse.
- State styles such as hover, pressed, focused, disabled, checked, and selected.
- Light and dark themes.
- Browser-like defaults for migration demos.
- Native mobile defaults for production app demos.
- A consistent way to map theme rules to Godot `Theme` resources.

Without those pieces, every demo and app repeats one-off inline styles. That can
still produce beautiful UI, but it makes the SDK feel lower-level than a mobile
app toolkit.

The CSS-like layer should make this possible:

```vue
<template>
  <Screen class="app-screen">
    <Div class="profile-card">
      <Span class="eyebrow">Account</Span>
      <Span class="title">Jane Developer</Span>
      <Button class="primary-action" @click="save">Save changes</Button>
    </Div>
  </Screen>
</template>
```

With styles like:

```css
:root {
  --color-page: #f8fafc;
  --color-surface: #ffffff;
  --color-text: #111827;
  --color-primary: #2563eb;
  --radius-md: 8px;
  --space-3: 12px;
  --space-4: 16px;
}

.app-screen {
  background-color: var(--color-page);
  padding: var(--space-4);
}

.profile-card {
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  gap: var(--space-3);
}

.title {
  color: var(--color-text);
  font-size: 22px;
  font-weight: bold;
}

Button.primary-action {
  background-color: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  padding: 10px 14px;
}

Button.primary-action:hover {
  background-color: #1d4ed8;
}
```

The implementation should normalize those rules into the existing
`HtmlStyle`-shaped style data where possible, and into Godot `Theme` items where
that is the better backend.

## Product Goal

The product goal is not "copy any Vue web app and it runs with native
performance." That is too broad because arbitrary web apps depend on DOM APIs,
browser CSS layout, CSSOM, browser events, web accessibility semantics, and
third-party libraries that assume real DOM nodes.

The achievable product goal is:

> Copy a Vue app that avoids direct DOM dependencies, uses supported HTML-like
> components and a supported CSS subset, and migrate it to native Godot with
> small, explicit changes.

The CSS-like layer is the main bridge for the styling part of that story.

## Existing Foundation

The current `@vue-godot/html` package already has most of the lower-level
building blocks:

- `HtmlStyle` describes the supported style subset.
- `normalizeHtmlStyle()` accepts object, string, and array style inputs.
- CSS declaration strings are parsed from kebab-case into style keys.
- Shorthands such as `margin`, `padding`, `border`, `border-radius`, and
  `background` are partially normalized.
- Unsupported style keys warn once per component/property pair.
- `<Div>` maps layout styles to Godot containers:
  - row -> `HBoxContainer`
  - column -> `VBoxContainer`
  - row wrap -> `HFlowContainer`
  - column wrap -> `VFlowContainer`
  - grid -> `GridContainer`
- Spacing maps to `MarginContainer` and theme separation constants.
- Backgrounds and borders map to `PanelContainer` plus `StyleBoxFlat` or
  `StyleBoxTexture`.
- Text styles map to `theme_override_colors/font_color`,
  `theme_override_font_sizes/font_size`, and font overrides.
- Basic transforms, transitions, and registered keyframe animations are already
  supported for a limited property set.

The CSS-like layer should extend this path. It should not replace it with a
separate CSS layout engine.

## Design Principles

1. Prefer Godot-native rendering and layout.

   Use Godot `Theme`, `Control`, `Container`, and `StyleBox` features whenever
   they can represent the requested style accurately enough.

2. Preserve the current inline style API.

   Existing apps using `:style="{ ... }"` must continue to work. Inline style
   should remain the strongest style source below explicit component props.

3. Make unsupported CSS visible.

   Unsupported selectors, properties, values, pseudo-classes, and at-rules
   should warn in development. Silent failure makes migration work misleading.

4. Avoid promising browser layout parity.

   The layer can support CSS-like layout properties that already map to Godot
   containers. It should not imply support for browser block/inline layout,
   margin collapsing, full grid layout, stacking contexts, or DOM measurement.

5. Keep the first implementation small but shaped correctly.

   The architecture should allow future support for scoped styles, CSS Modules,
   utility CSS, and responsive rules, but the first implementation should focus
   on theme tokens, component defaults, class rules, and state styles.

6. Optimize for mobile app UI.

   The default visual direction should support polished app screens: safe areas,
   touch targets, readable typography, card surfaces, lists, dialogs, sheets,
   inputs, tabs, and focus states.

## Non-goals

This layer should not attempt to provide:

- Real DOM nodes.
- `document`, `HTMLElement`, CSSOM, `getComputedStyle()`, or selector APIs.
- Browser event propagation or DOM `Event` compatibility.
- Full CSS cascade and browser user-agent stylesheet compatibility.
- Full browser layout, including block formatting context, inline layout,
  baseline alignment, margin collapsing, floats, absolute/fixed positioning,
  full CSS grid, or stacking contexts.
- Pseudo-elements such as `::before` and `::after`.
- Arbitrary pseudo-classes such as `:nth-child()` in the first implementation.
- General browser form serialization.
- A claim that arbitrary Vue web UI libraries run unchanged.

## Developer Experience Target

### Plugin Options

The existing call must stay valid:

```ts
app.use(htmlPlugin)
```

A future options shape could be:

```ts
app.use(htmlPlugin, {
  defaultStyles: 'native-app',
  theme: appTheme,
  stylesheets: [appStyles],
  warnUnsupportedCss: true,
})
```

Suggested option meanings:

| Option | Meaning |
| --- | --- |
| `defaultStyles` | `'none'`, `'browser'`, or `'native-app'`. Defaults should remain backward compatible until a major version can change them. |
| `theme` | Structured theme object created by `defineHtmlTheme()` or `createHtmlTheme()`. |
| `stylesheets` | Parsed or raw CSS-like stylesheets registered globally. |
| `styleContext` | Pre-created style context for apps that need to refresh viewport buckets from Godot resize signals. |
| `viewport` | Initial viewport size used for responsive media query buckets. |
| `warnUnsupportedCss` | Development warning mode for unsupported selectors, properties, values, and at-rules. |

### Theme Definition

A structured theme API is useful because not every Godot theme capability maps
cleanly from CSS text.

```ts
export const appTheme = defineHtmlTheme({
  colorScheme: 'light',
  tokens: {
    color: {
      page: '#f8fafc',
      surface: '#ffffff',
      text: '#111827',
      mutedText: '#64748b',
      primary: '#2563eb',
      danger: '#dc2626',
    },
    radius: {
      sm: 4,
      md: 8,
      lg: 12,
    },
    space: {
      2: 8,
      3: 12,
      4: 16,
    },
    font: {
      body: 'Inter, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
  },
  components: {
    Button: {
      base: {
        minHeight: 44,
        padding: '10px 14px',
        borderRadius: 8,
      },
      states: {
        hover: {
          opacity: 0.96,
        },
        disabled: {
          opacity: 0.5,
        },
      },
      variants: {
        primary: {
          backgroundColor: '#2563eb',
          color: '#ffffff',
        },
      },
    },
  },
})
```

This API is not a replacement for CSS. It is the canonical way to define design
tokens and component defaults in TypeScript, with CSS as a familiar authoring
front-end over the same model.

### Stylesheet Registration

CSS text can be registered explicitly:

```ts
import appCss from './app.css?raw'

app.use(htmlPlugin, {
  stylesheets: [createHtmlStyleSheet(appCss)],
})
```

The first implementation can use explicit registration. A later Vite plugin can
collect global CSS and Vue SFC styles automatically.

### Component Usage

HTML-like components should accept `class` and possibly `className` for
migration friendliness.

```vue
<template>
  <Screen class="settings-screen">
    <Div class="settings-group">
      <Span class="section-title">Notifications</Span>
      <Switch class="setting-toggle" v-model="enabled"></Switch>
    </Div>
  </Screen>
</template>
```

`class` resolution should work for both PascalCase and lowercase aliases:

```vue
<template>
  <screen class="settings-screen">
    <div class="settings-group">
      <span class="section-title">Notifications</span>
    </div>
  </screen>
</template>
```

The lowercase form still requires the existing Vue compiler configuration:

```ts
isNativeTag: () => false
```

## Style Source Precedence

The style system should have a clear order. A suggested order from weakest to
strongest:

1. Built-in reset needed for correct Godot behavior.
2. `defaultStyles` preset.
3. Theme component defaults.
4. Global stylesheet type selectors, such as `Button`.
5. Global stylesheet class selectors, such as `.primary-action`.
6. State rules, such as `Button:hover`.
7. Component variant props, if variants are added later.
8. Inline `style` prop.
9. Explicit component props that are not style props, such as `disabled`,
   `modelValue`, `src`, or `href`.

Inline `style` must remain strong because Vue developers already expect it to
override class and default styles.

`!important` should not be supported in the first implementation. If supported
later, it should be limited to conflict resolution inside the CSS-like layer and
should not override explicit component props.

## Architecture

The CSS-like layer should be built as four cooperating pieces.

### 1. Theme Model

The theme model stores normalized design tokens and component defaults.

Responsibilities:

- Store tokens by stable semantic names.
- Resolve `var(--name)` references in CSS-like rules.
- Provide light/dark theme variants.
- Provide component default styles.
- Provide state styles for components.
- Convert supported global component defaults into a Godot `Theme` resource
  where possible.
- Keep unsupported component defaults in the Vue Godot style registry.

Suggested internal shape:

```ts
interface HtmlTheme {
  tokens: HtmlThemeTokens
  components: Record<string, HtmlComponentTheme>
  godotTheme: unknown
}
```

The real implementation should use concrete Godot types instead of `unknown`
where available.

### 2. Stylesheet Model

The stylesheet model stores parsed CSS-like rules.

Responsibilities:

- Parse selectors into a supported selector AST.
- Parse declarations using the existing `HtmlStyle` normalization path.
- Resolve tokens.
- Preserve source locations for warnings.
- Sort rules by precedence and specificity.
- Cache resolved style results by component tag, class list, state, and viewport
  bucket.

The stylesheet should compile declarations into existing `HtmlStyle` data when
possible. If a declaration is Godot-theme-only or component-state-only, it can
compile into a richer intermediate style record.

### 3. Runtime Style Resolver

Every `@vue-godot/html` component should call a shared resolver before applying
styles.

Conceptually:

```ts
const style = resolveHtmlComponentStyle({
  component: 'Button',
  props,
  state,
})
```

The resolver returns:

- The merged `HtmlStyle` for existing style mapping.
- Theme override props when per-node overrides are required.
- Component-specific style data, such as stateful button style boxes.
- Diagnostics for unsupported or ignored declarations.

This avoids duplicating rule merge logic across components.

### 4. Godot Theme Adapter

The adapter converts as much as possible into Godot `Theme` data and applies it
to the root `Control` or relevant subtree.

Godot `Theme` should be used for:

- Shared fonts.
- Shared font sizes.
- Shared text colors.
- Shared control constants where Godot exposes them.
- `Button` normal, hover, pressed, disabled, and focus styles where possible.
- `LineEdit` and `TextEdit` default styles where possible.
- `PanelContainer` panel styles where possible.
- Icons where the package later supports icon theme entries.

Godot theme overrides or wrapper nodes should be used when:

- A style applies to only one component instance.
- The component uses wrappers for padding, margin, or background.
- The component maps a web-like concept to multiple Godot nodes.
- The style involves dynamic state that is easier to express through props.

## Godot Theme Mapping

Not every CSS concept belongs in Godot `Theme`. The implementation should use
three buckets.

### Bucket A: Theme-backed

Use Godot `Theme` when the value is shared and maps naturally to a Control type.

| CSS-like concept | Godot backing | Notes |
| --- | --- | --- |
| `font-family` | Theme font or registered font family | Reuse existing `registerFontFamily()` behavior. |
| `font-size` | Theme font size | Good for global text scale and component defaults. |
| `color` | Theme font color | Best for text controls and buttons. |
| `background-color` on panel-like controls | `StyleBoxFlat` | Works for `PanelContainer`, buttons, inputs, and similar controls. |
| `border-color`, `border-width`, `border-radius` | `StyleBoxFlat` | Already used by background style helpers. |
| `padding` for native controls | StyleBox content margins or component wrapper | Use native style box content margins when available. |
| `gap` / separation | Theme constants | Already maps to separation constants for containers. |
| component state surfaces | State-specific style boxes | Useful for button, line edit, textarea, select, switch, and progress components. |

### Bucket B: Component-backed

Use component defaults or props when Godot Theme does not express the concept
globally enough.

| CSS-like concept | Component strategy | Notes |
| --- | --- | --- |
| `min-touch-target` candidate token | Component prop/default | Existing components already support `minTouchTarget`. |
| `object-fit` | Media component prop mapping | Already maps for `Img`, `Svg`, `CameraView`, and similar components. |
| `display`, `flex-direction`, `flex-wrap`, `columns` | Component layout mapping | Belongs in `Div` and content wrappers, not global Godot Theme. |
| `overflow` | Component prop mapping | Depends on backing control support. |
| `transition` and `animation*` | Component motion helper | Existing Tween-backed subset should be reused. |

### Bucket C: Wrapper-backed

Use wrapper nodes when CSS-like appearance requires node composition.

| CSS-like concept | Wrapper strategy | Notes |
| --- | --- | --- |
| `margin` | Outer `MarginContainer` | Already used where supported. |
| `padding` around layout children | Inner `MarginContainer` | Already used by `<Div>`. |
| `background-image` | `PanelContainer` with `StyleBoxTexture` | Current behavior stretches texture. |
| rich card backgrounds | `PanelContainer` with style box | Good for surfaces. |
| clipping/overflow | Backing `Control` clipping or wrapper | Must warn where unavailable. |

## CSS Selector Support

Selector support should be phased. A small, reliable subset is better than a
large subset that fails silently.

### Phase 1 Selectors

Support:

- `:root`
- Type selectors for HTML-like components:
  - `Button`
  - `button`
  - `Div`
  - `div`
- Class selectors:
  - `.card`
  - `.primary`
- Compound type plus class:
  - `Button.primary`
  - `button.primary`
- Grouping:
  - `Button, Input, Textarea`
- State pseudo-classes that components can report:
  - `:hover`
  - `:active`
  - `:pressed`
  - `:focus`
  - `:focus-visible`
  - `:disabled`
  - `:checked`
  - `:read-only`

State names should be normalized to Godot-backed state where possible.
For example, `:active` and `:pressed` can resolve to the same internal state
for button-like controls.

### Phase 2 Selectors

Consider later:

- Descendant selectors:
  - `.toolbar Button`
- Direct child selectors:
  - `.toolbar > Button`
- Attribute selectors for simple component props:
  - `Input[type="password"]`
  - `Button[disabled]`
- `:not()` with simple selectors.

Descendant and child selectors require ancestor style context. That is feasible
but more invasive than Phase 1 because `@vue-godot/html` components are Vue
components, not DOM nodes. The implementation would need a provide/inject style
scope stack or a renderer-level style context.

### Unsupported Selectors

Do not support initially:

- Universal selector `*`, unless it is limited to a reset preset.
- Sibling selectors `+` and `~`.
- Complex attribute selectors.
- `:nth-child()`, `:first-child`, `:last-child`, and structural selectors.
- Pseudo-elements `::before`, `::after`, `::placeholder`, and others.
- Browser-specific selectors.
- Selector APIs such as `querySelector`.

Unsupported selectors should warn with the selector text and source location
when available.

## CSS Property Support

Property support should start with the current `HtmlStyle` subset. That keeps
implementation risk low and aligns docs with real behavior.

### Existing Supported Property Families

| Family | Properties |
| --- | --- |
| Display and layout | `display`, `flex-direction`, `flex-wrap`, `justify-content`, `align-items`, `align-self`, `flex`, `gap`, `columns` |
| Spacing | `margin`, `margin-top`, `margin-right`, `margin-bottom`, `margin-left`, `padding`, `padding-top`, `padding-right`, `padding-bottom`, `padding-left` |
| Size | `width`, `height`, `min-width`, `min-height`, `max-width`, `max-height` |
| Media | `object-fit` |
| Background and border | `background`, `background-color`, `background-image`, `border`, `border-color`, `border-style`, `border-width`, side border widths, `border-radius`, corner radii |
| Text | `color`, `font-family`, `font-size`, `font-weight`, `text-transform`, `text-align`, `overflow-wrap` |
| Visibility and clipping | `display: none`, `overflow: hidden`, `opacity` |
| Transform and motion | `transform`, `transition`, transition longhands, `animation-name`, animation longhands |

### Candidate New Properties

The CSS-like layer may need additional properties to support polished mobile UI.
These should be added only when they have a clear Godot mapping.

| Property | Proposed backing | Priority |
| --- | --- | --- |
| `box-shadow` | `StyleBoxFlat` shadow fields where available, or unsupported warning | Medium |
| `outline-color`, `outline-width`, `outline-style` | Focus style box or component focus ring | High for keyboard/controller focus |
| `cursor` | Godot mouse cursor shape | Low for mobile, useful for desktop |
| `line-height` | Label theme/setting if Godot exposes enough control | Medium |
| `letter-spacing` | Only if Godot text controls expose it reliably | Low |
| `aspect-ratio` | Custom minimum size helper or layout metadata | Medium |
| `position` | Avoid until there is a clear absolute-layout story | Low |
| `z-index` | Avoid or map to child order explicitly | Low |

### Unsupported Properties

Properties outside the supported list should warn in development. Important
examples:

- `float`
- `clear`
- `position: fixed`
- `position: sticky`
- most `position: absolute` behavior
- `inset`
- `top`, `right`, `bottom`, `left`
- full `grid-template-*`
- `place-*`
- `line-clamp`
- `filter`
- `backdrop-filter`
- `mix-blend-mode`
- CSS custom layout properties that require a browser engine

Some of these can become supported later, but they should not be accepted
silently until there is a real Godot-backed behavior.

## Tokens and CSS Variables

Support CSS custom properties as theme tokens, not as a full CSS variable
runtime.

Recommended scope:

- Parse custom properties in `:root`.
- Parse custom properties in theme definitions.
- Resolve `var(--token)` inside supported declarations.
- Support fallback values:
  - `var(--color-primary, #2563eb)`
- Warn on unresolved variables.

Initial limitations:

- No arbitrary per-node custom property inheritance.
- No CSSOM mutation of variables.
- No runtime `element.style.setProperty()`.
- No computed style reads.

Example:

```css
:root {
  --space-4: 16px;
  --radius-card: 8px;
  --color-card: #ffffff;
}

.card {
  background-color: var(--color-card);
  border-radius: var(--radius-card);
  padding: var(--space-4);
}
```

Per-subtree themes can be added later with a `ThemeProvider` or `HtmlThemeScope`
component, but the first version should keep variables global.

## Default Style Presets

The layer should support presets, but they should be explicit at first to avoid
breaking existing apps.

### `defaultStyles: 'none'`

Current behavior. No browser or native visual defaults beyond what Godot nodes
already provide.

### `defaultStyles: 'browser'`

Goal: make HTML-like components look familiar to web developers and make
migration demos less visually surprising.

Suggested defaults:

- Root screen/page background: white.
- Text color: near black.
- Default font size: 16.
- `Div`: transparent, column layout unless style says otherwise.
- `Span`: text color and font defaults.
- `Button`: light gray background, border, padding, minimum height, focus ring,
  disabled state.
- `Input`, `Textarea`, `Select`: white background, border, padding, placeholder
  color, focus ring, disabled/readonly state.
- `A`: link blue text.
- Headings if heading components are added later: browser-like sizes and
  margins.
- Paragraph/list defaults if those components are added later.

Important distinction: real browser `<div>` elements are transparent by
default. The white background belongs to the page/root surface, not every `Div`.

### `defaultStyles: 'native-app'`

Goal: make new mobile apps look polished without writing a large style sheet.

Suggested defaults:

- Root screen background: app-neutral light surface.
- Text color: semantic primary text.
- Minimum touch target: 44 or 48 pixels for interactive controls.
- Rounded but restrained controls.
- Clear focus and pressed states.
- Comfortable spacing scale.
- App-friendly inputs and form controls.
- Surface/card defaults.
- Safe-area compatible screen defaults.

This preset is more valuable for production mobile apps than browser defaults.

## Responsive Styling

Responsive support is useful for mobile and tablet apps, but it must be defined
in terms of Godot window or viewport metrics, not browser layout viewport
semantics.

Phase 1 can support a limited media query subset:

```css
@media (max-width: 480px) {
  .profile-card {
    padding: 12px;
  }
}

@media (orientation: landscape) {
  .settings-screen {
    flex-direction: row;
  }
}
```

Suggested supported media features:

- `min-width`
- `max-width`
- `min-height`
- `max-height`
- `orientation`

Possible later features:

- `prefers-color-scheme`
- `pointer`
- `hover`
- `safe-area-inset-*` token aliases

Responsive rules should be compiled into viewport buckets and re-resolved only
when the relevant viewport metrics change. They should not trigger expensive
per-frame recalculation.

## SFC Styles

Vue SFC `<style>` blocks are important for migration, but they need special
handling because the runtime renderer does not have DOM scope attributes.

Recommended phases:

### Phase 1: Explicit Global CSS

Developers import CSS as text and pass it to `htmlPlugin`.

Pros:

- Simple.
- Predictable.
- No Vite plugin required.
- Good enough for a first implementation.

Cons:

- Existing Vue apps need style import changes.
- SFC-local styles are not automatic.

### Phase 2: Vite CSS Collector

Add a Vite plugin that collects supported global CSS and registers it with
`@vue-godot/html`.

Pros:

- Closer to web migration.
- Can process ordinary `.css` files.
- Can warn at build time.

Cons:

- Needs careful integration with Vue plugin output.
- Needs source maps or useful warning locations.

### Phase 3: Scoped SFC Styles

Support a Vue Godot scoped-style mode.

Possible strategies:

- Convert Vue scope IDs into generated class names and inject those classes into
  matching HTML-like component roots.
- Provide a compile transform for `@vue-godot/html` components only.
- Require explicit CSS Modules-like class binding instead of automatic scoped
  selectors.

This is valuable but should not be part of the first implementation. Scoped CSS
can become complex because `@vue-godot/html` components often render multiple
Godot nodes and wrappers.

## Utility CSS and Tailwind-like Workflows

Utility CSS is viable if it compiles down to supported class selectors and
supported declarations.

Example:

```vue
<template>
  <Div class="bg-white rounded-md p-4 gap-3">
    <Span class="text-lg font-bold text-slate-900">Profile</Span>
  </Div>
</template>
```

This can work if:

- The utility classes are present in a registered stylesheet.
- Each utility maps to supported `HtmlStyle` properties.
- Unsupported utilities warn.

This does not mean Tailwind as a whole is supported. Many utilities rely on CSS
features outside the Godot-backed subset. A future `@vue-godot/tailwind-preset`
could intentionally expose only supported utilities.

## Component State Styling

Stateful controls need a consistent state model.

Suggested internal state flags:

| State | Source |
| --- | --- |
| `hover` | Godot mouse enter/exit or control hover state |
| `pressed` | Button/Pressable input state |
| `active` | Alias to pressed for web-like CSS |
| `focus` | Godot focus enter/exit |
| `focusVisible` | Focus via keyboard/controller where detectable, otherwise focus |
| `disabled` | Component `disabled` prop or native disabled state |
| `checked` | Switch, checkbox, radio |
| `readOnly` | Input/Textarea readonly prop |
| `selected` | Select option/list item where components expose it |

Components should report state to the shared style resolver. The resolver then
adds matching pseudo-class rules.

For example:

```css
Button {
  background-color: #f8fafc;
  border: 1px solid #cbd5e1;
}

Button:hover {
  background-color: #f1f5f9;
}

Button:pressed {
  background-color: #e2e8f0;
}

Button:focus-visible {
  outline-color: #2563eb;
  outline-width: 2px;
}

Button:disabled {
  opacity: 0.5;
}
```

Implementation detail: some state styles should compile to Godot state-specific
theme style boxes, while others may be applied as node props on state changes.
The public behavior should be the same.

## Browser-like Migration Profile

The dream is to copy a Vue web app and get native Godot rendering. The realistic
way to approach that is to define migration tiers.

### Tier A: Small-change Migration

Likely to work with this CSS layer:

- Vue SFC components.
- Composition API, props, slots, stores, and router state.
- Lowercase HTML-like tags configured through `htmlPlugin`.
- CSS mostly made of class selectors.
- Layout mostly flex rows/columns, wrapping, simple grids, spacing, size,
  colors, borders, radius, and text styles.
- Browser-like APIs provided by `@vue-godot/browser`, such as `fetch`, `URL`,
  storage, timers, and history.
- Form state expressed through Vue state and `v-model`.

### Tier B: Medium Migration

Requires explicit rewrites:

- CSS with unsupported selectors or layout features.
- DOM refs that need to become Vue/Godot refs.
- Components that assume `HTMLElement`.
- Browser form serialization.
- CSS animations outside the supported Tween-backed subset.
- Third-party Vue UI components that can be ported but not run directly.

### Tier C: Rewrite

Not a good migration candidate:

- Apps dominated by DOM measurement and manual layout.
- Rich text editors built around `contenteditable`.
- Data grids that depend on real DOM virtualization and measurement.
- Map libraries that depend on browser canvas/SVG/DOM.
- Chart libraries that render to browser DOM/canvas/SVG.
- Apps with heavy CSS grid, position/sticky/fixed, pseudo-elements, or complex
  selectors.
- Apps that require browser accessibility tree semantics.

The CSS-like layer should make Tier A good and Tier B diagnosable. It should
not disguise Tier C as supported.

## Direct Godot Nodes

This proposal primarily targets `@vue-godot/html` components. Direct Godot node
tags such as `<HBoxContainer>` and `<Label>` should not be forced through the
HTML CSS layer by default.

Possible future support:

- Apply a generated Godot `Theme` to the root `Control`, so direct Godot
  controls inherit global fonts, colors, and style boxes.
- Provide an explicit `themeType` or `themeClass` prop for direct Godot controls.
- Document how to use Godot-native Theme resources alongside the CSS-like layer.

The first implementation should avoid trying to match arbitrary CSS selectors
against direct Godot node tags.

## Performance Model

The style system must avoid web-browser-style recalculation complexity.

Recommended model:

- Parse stylesheets once.
- Normalize declarations once.
- Resolve tokens once per active theme.
- Cache matched style results by:
  - component name
  - class list
  - state flags
  - viewport bucket
  - active theme id
- Recompute only when:
  - `class` changes
  - `style` prop changes
  - component state changes
  - active theme changes
  - relevant viewport bucket changes
- Prefer Godot `Theme` inheritance for broad defaults.
- Use per-node `theme_override_*` only when instance-specific styling is needed.
- Avoid per-frame style resolution.

The CSS-like layer should not introduce a JavaScript layout engine. Layout
should continue to use Godot containers unless a future, separate layout project
explicitly chooses otherwise.

## Diagnostics

Good warnings are essential because developers will bring browser CSS.

Warnings should include:

- Unsupported selector.
- Unsupported pseudo-class.
- Unsupported property.
- Unsupported value.
- Token resolution failure.
- Rule ignored because the target component cannot represent it.
- State selector ignored because the component does not expose that state.
- Media query ignored because the feature is unsupported.

Example warning shape:

```text
[vue-godot/html/css] Unsupported property "position: sticky" in .toolbar.
Godot-backed styles do not implement sticky positioning. Rule ignored.
```

Warnings should be deduplicated to avoid noisy logs, but they should still
identify source files and lines when available.

## Testing Strategy

### Unit Tests

Add tests for:

- CSS parser supported declarations.
- CSS parser unsupported declarations.
- Token parsing and `var()` fallback resolution.
- Selector parsing.
- Specificity sorting.
- State pseudo-class matching.
- Media query matching.
- CSS rule to `HtmlStyle` normalization.
- Theme object to Godot theme adapter mapping.
- Warning deduplication.

### Component Tests

Add tests for:

- `class` merging with inline style.
- Type selector defaults.
- Class selector overrides.
- State selector changes.
- Theme default plus inline override precedence.
- Lowercase and PascalCase component names resolving the same rules.
- Components with wrappers, especially `Div`, `Screen`, `Form`, `Overlay`,
  `SafeAreaView`, and `KeyboardAvoidingView`.

### Demo Coverage

Update `apps/html-demo` when the feature lands:

- Add a CSS theme section.
- Show `defaultStyles: 'browser'`.
- Show token-based CSS.
- Show class selectors.
- Show hover/pressed/focus/disabled states.
- Show responsive rule behavior if implemented.

Update `apps/native-app-demo` when the feature lands:

- Use `defaultStyles: 'native-app'`.
- Move repeated inline styles into theme/classes where practical.
- Keep the demo visually polished and app-like.

### Build and Smoke

Required checks for implementation PRs:

- Package tests.
- `npm run build --workspace=html-demo`.
- `npm run build --workspace=native-app-demo`.
- Existing Godot smoke tests where available.
- Any new CSS parser or Vite plugin package tests.

If the public API changes, update package READMEs and the compatibility
checklist in the same change.

## Implementation Roadmap

### Phase 0: Design Document

This document.

Acceptance criteria:

- Clear goals and non-goals.
- Proposed API shape.
- Mapping strategy.
- Migration boundaries.
- Testing plan.

### Phase 1: Theme Tokens and Component Defaults

Implement structured theme registration without CSS text parsing beyond current
inline declaration strings.

Scope:

- `defineHtmlTheme()`.
- Theme tokens.
- Component defaults.
- `defaultStyles: 'browser'` and `defaultStyles: 'native-app'` as opt-in.
- Shared resolver used by all HTML components.
- Backward-compatible `app.use(htmlPlugin)`.

Acceptance criteria:

- Existing demos still build.
- Theme defaults apply to core components.
- Inline styles override theme defaults.
- Unsupported component defaults warn.

### Phase 2: Global Stylesheet Registry

Implement explicit CSS-like stylesheet registration.

Scope:

- `createHtmlStyleSheet(cssText)`.
- `:root` variables.
- Type selectors.
- Class selectors.
- Type plus class selectors.
- Group selectors.
- Current `HtmlStyle` property subset.
- Development warnings.

Acceptance criteria:

- CSS class rules style components.
- Lowercase and PascalCase tags match.
- Inline style precedence works.
- Unsupported CSS warns with useful messages.

### Phase 3: Stateful Styling

Add pseudo-class support for component states.

Scope:

- `:hover`
- `:pressed`
- `:active`
- `:focus`
- `:focus-visible`
- `:disabled`
- `:checked`
- `:read-only`

Acceptance criteria:

- Button, Pressable, Input, Textarea, Select, Switch, and Form-related controls
  respond to relevant state styles.
- Focus styles are visible on keyboard/controller focus.
- Disabled styles do not re-enable disabled behavior.

### Phase 4: Responsive Rules

Implemented: limited media query support.

Scope:

- `min-width`
- `max-width`
- `min-height`
- `max-height`
- `orientation`

Acceptance criteria:

- Rules update when viewport bucket changes.
- No per-frame recalculation.
- Native app demo has at least one phone/tablet layout adaptation.

### Phase 5: Build Tooling

Implemented: Vite integration for global CSS files.

Scope:

- Global CSS collection.
- Build-time diagnostics.
- Source locations.
- Optional CSS Modules-like class maps.

Acceptance criteria:

- A generated app can import a CSS file without manual raw-loader style setup.
- Unsupported CSS warnings point to useful source locations.

### Phase 6: Migration Tooling

Implemented: CLI audit tooling for Vue web app migration through
`vue-godot doctor --migration`.

Scope:

- Scan CSS for unsupported properties/selectors.
- Scan Vue code for DOM assumptions.
- Report migration tier.
- Suggest equivalent `@vue-godot/html` components and style replacements.

Acceptance criteria:

- Running the tool on a candidate Vue app produces a concrete migration report.
- The report distinguishes small-change, medium, and rewrite areas.

Implementation notes:

- CSS files under `vue/` and `src/` are scanned for unsupported properties,
  selectors, and at-rules.
- Vue/TypeScript source files under `vue/` and `src/` are scanned for DOM
  assumptions such as `document.querySelector`, `HTMLElement`, CSSOM reads,
  browser window layout APIs, and browser canvas contexts.
- Vue SFC browser tags such as `<div>`, `<button>`, `<input>`, and `<img>` are
  reported with suggested `@vue-godot/html` component replacements.
- The strongest finding determines the overall report tier:
  `small-change`, `medium`, or `rewrite`.

## Public Documentation Updates

Implemented documentation coverage includes:

- `packages/html/README.md`
  - Add theme and CSS-like stylesheet API.
  - Add supported selector/property tables.
  - Add default style preset docs.
- `docs/compatibility.md`
  - Add CSS-like theme layer rows.
  - Mark selector/property support accurately.
- `docs/migration.md`
  - Add the migration profile and CSS audit flow.
- `packages/cli/README.md`
  - Add `vue-godot doctor --migration`.
- `README.md`
  - Link to the CSS/theming guide after the feature is real.
- `apps/html-demo`
  - Exercise every public CSS/theme capability.
- `apps/native-app-demo`
  - Demonstrate a polished native mobile app theme.

Do not document unsupported CSS as supported just because the parser accepts
the text. Support means there is a Godot-backed behavior and test coverage.

## Open Questions

- Should the first implementation expose only structured themes, or structured
  themes plus explicit CSS text registration?
- Should `className` be accepted in addition to `class` for migration from
  React-style component code?
- Should component variants be first-class props, class names, or both?
- Should `defaultStyles: 'native-app'` eventually become the default for new
  `create app` projects?
- How should scoped SFC styles map onto components that render wrapper nodes?
- How much descendant selector support is worth the added runtime context?
- Should utility CSS support be a separate package or a documented preset?
- Can direct Godot node tags safely participate in theme inheritance without
  surprising game UI users?
- What is the minimum focus-ring API needed for accessible keyboard and
  controller navigation?
- Should unsupported CSS warn in production, or only in development builds?

## Decision Summary

The CSS-like theme layer is viable and worth pursuing if it stays honest about
its scope.

Best first target:

- Theme tokens.
- Component defaults.
- Browser and native-app presets.
- Class selectors.
- State styles.
- Current `HtmlStyle` property subset.
- Godot `Theme` adapter where possible.

Avoid first:

- Full browser CSS.
- Arbitrary web app compatibility claims.
- A JavaScript CSS layout engine.
- Complex selectors.
- Scoped SFC CSS before the global stylesheet path is proven.

This gives Vue Godot a much stronger app-development story without undermining
the core architectural choice: Vue owns component composition, Godot owns the
native scene tree and UI backend.
