import {
  hasInjectionContext,
  inject,
  type InjectionKey,
} from '@vue/runtime-core'
import {
  splitCssDeclaration,
  splitCssDeclarations,
} from './cssParsing.js'
import {
  getUnsupportedStyleKeys,
  normalizeHtmlStyle,
  parseHtmlStyle,
  supportedHtmlStyleKeys,
  type HtmlStyle,
  type HtmlStyleInput,
} from './styleMapping.js'

export type HtmlDefaultStylePreset = 'none' | 'browser' | 'native-app'
export type HtmlColorScheme = 'light' | 'dark'
export type HtmlComponentStateName =
  | 'hover'
  | 'pressed'
  | 'focus'
  | 'focusVisible'
  | 'disabled'
  | 'checked'
  | 'readOnly'
  | 'selected'

export type HtmlComponentState = Partial<
  Record<HtmlComponentStateName, boolean>
> & {
  active?: boolean
}

export type HtmlThemeTokenPrimitive = string | number
export interface HtmlThemeTokens {
  readonly [key: string]: HtmlThemeTokenPrimitive | HtmlThemeTokens
}

export type HtmlComponentStateStyles = Partial<
  Record<HtmlComponentStateName, HtmlStyleInput>
>

export interface HtmlComponentThemeDefinition {
  base?: HtmlStyleInput
  states?: HtmlComponentStateStyles
  variants?: Record<string, HtmlStyleInput>
}

export interface HtmlThemeDefinition {
  colorScheme?: HtmlColorScheme
  tokens?: HtmlThemeTokens
  components?: Record<string, HtmlComponentThemeDefinition>
}

export interface HtmlComponentTheme {
  base?: HtmlStyle
  states: Partial<Record<HtmlComponentStateName, HtmlStyle>>
  variants: Record<string, HtmlStyle>
}

export interface HtmlTheme {
  kind: 'html-theme'
  colorScheme?: HtmlColorScheme
  tokens: Record<string, string>
  components: Record<string, HtmlComponentTheme>
}

interface CssDeclaration {
  property: string
  value: string
}

interface HtmlStyleSelector {
  component?: string
  classes: readonly string[]
  state?: HtmlComponentStateName
}

interface HtmlStyleRule {
  selector: HtmlStyleSelector
  selectorText: string
  declarations: readonly CssDeclaration[]
  specificity: number
  order: number
  line: number
}

interface HtmlCssDiagnostic {
  message: string
  key: string
}

export interface HtmlStyleSheet {
  kind: 'html-style-sheet'
  source?: string
  tokens: readonly CssDeclaration[]
  rules: readonly HtmlStyleRule[]
  diagnostics: readonly HtmlCssDiagnostic[]
}

export interface HtmlStyleSheetOptions {
  source?: string
}

export interface HtmlPluginOptions {
  defaultStyles?: HtmlDefaultStylePreset
  theme?: HtmlTheme | HtmlThemeDefinition
  stylesheets?: readonly (HtmlStyleSheet | string)[]
  warnUnsupportedCss?: boolean
}

export interface HtmlStyleContext {
  defaultStyles: HtmlDefaultStylePreset
  theme?: HtmlTheme
  stylesheets: readonly HtmlStyleSheet[]
  warnUnsupportedCss: boolean
}

export interface ResolveHtmlComponentStyleOptions {
  componentName: string
  class?: unknown
  className?: unknown
  inlineStyle?: HtmlStyleInput
  state?: HtmlComponentState
}

export interface ResolvedHtmlComponentStyle {
  style?: HtmlStyle
  classList: readonly string[]
  stateStyles: Partial<Record<HtmlComponentStateName, HtmlStyle>>
}

const supportedStyleKeySet = new Set<string>(supportedHtmlStyleKeys)
const warnedCssDiagnostics = new Set<string>()

const htmlComponentStateNames: readonly HtmlComponentStateName[] = [
  'hover',
  'pressed',
  'focus',
  'focusVisible',
  'disabled',
  'checked',
  'readOnly',
  'selected',
]

const emptyHtmlStyleContext: HtmlStyleContext = {
  defaultStyles: 'none',
  stylesheets: [],
  warnUnsupportedCss: true,
}

export const htmlStyleContextKey: InjectionKey<HtmlStyleContext> =
  Symbol('vue-godot-html-style-context')

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isHtmlTheme(value: unknown): value is HtmlTheme {
  return isRecord(value) && value['kind'] === 'html-theme'
}

function isHtmlStyleSheet(value: unknown): value is HtmlStyleSheet {
  return isRecord(value) && value['kind'] === 'html-style-sheet'
}

function normalizeComponentName(componentName: string): string {
  return componentName.trim().toLowerCase()
}

function normalizeTokenSegment(segment: string): string {
  return segment
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase()
}

function normalizeTokenName(parts: readonly string[]): string {
  const joined = parts.map(normalizeTokenSegment).filter(Boolean).join('-')
  return joined.startsWith('--') ? joined : `--${joined}`
}

function flattenThemeTokens(
  tokens: HtmlThemeTokens | undefined,
  path: readonly string[] = [],
  output: Record<string, string> = {},
): Record<string, string> {
  if (!tokens) {
    return output
  }

  for (const [key, value] of Object.entries(tokens)) {
    if (typeof value === 'string' || typeof value === 'number') {
      const tokenName = key.startsWith('--')
        ? key
        : normalizeTokenName([...path, key])
      output[tokenName] = String(value)
    } else if (isRecord(value)) {
      flattenThemeTokens(value as HtmlThemeTokens, [...path, key], output)
    }
  }

  return output
}

function normalizeStyle(style: HtmlStyleInput): HtmlStyle | undefined {
  const normalized = normalizeHtmlStyle(style)
  return normalized && Object.keys(normalized).length > 0
    ? normalized
    : undefined
}

function normalizeComponentTheme(
  definition: HtmlComponentThemeDefinition,
): HtmlComponentTheme {
  const states: Partial<Record<HtmlComponentStateName, HtmlStyle>> = {}
  for (const state of htmlComponentStateNames) {
    const normalized = normalizeStyle(definition.states?.[state])
    if (normalized) {
      states[state] = normalized
    }
  }

  const variants: Record<string, HtmlStyle> = {}
  for (const [name, style] of Object.entries(definition.variants ?? {})) {
    const normalized = normalizeStyle(style)
    if (normalized) {
      variants[name] = normalized
    }
  }

  return {
    base: normalizeStyle(definition.base),
    states,
    variants,
  }
}

export function defineHtmlTheme(definition: HtmlThemeDefinition): HtmlTheme {
  const components: Record<string, HtmlComponentTheme> = {}

  for (const [componentName, component] of Object.entries(
    definition.components ?? {},
  )) {
    components[normalizeComponentName(componentName)] =
      normalizeComponentTheme(component)
  }

  return {
    kind: 'html-theme',
    colorScheme: definition.colorScheme,
    tokens: flattenThemeTokens(definition.tokens),
    components,
  }
}

export const createHtmlTheme = defineHtmlTheme

function stripCssComments(cssText: string): string {
  return cssText.replace(/\/\*[\s\S]*?\*\//g, '')
}

function findMatchingBrace(text: string, openIndex: number): number {
  let depth = 0
  for (let index = openIndex; index < text.length; index++) {
    const char = text[index]
    if (char === '{') {
      depth += 1
    } else if (char === '}') {
      depth -= 1
      if (depth === 0) {
        return index
      }
    }
  }
  return -1
}

function lineNumberAt(text: string, index: number): number {
  let line = 1
  for (let cursor = 0; cursor < index; cursor++) {
    if (text[cursor] === '\n') {
      line += 1
    }
  }
  return line
}

function createCssDiagnostic(
  source: string | undefined,
  line: number,
  message: string,
): HtmlCssDiagnostic {
  const location = source ? `${source}:${line}` : `line ${line}`
  return {
    key: `${location}:${message}`,
    message: `[vue-godot/html/css] ${message} (${location}).`,
  }
}

function parseDeclarations(body: string): CssDeclaration[] {
  const declarations: CssDeclaration[] = []
  for (const declaration of splitCssDeclarations(body)) {
    const parts = splitCssDeclaration(declaration)
    if (parts) {
      declarations.push({
        property: parts.property.trim(),
        value: parts.value.trim(),
      })
    }
  }
  return declarations
}

function normalizePseudoState(
  pseudoClass: string,
): HtmlComponentStateName | null {
  switch (pseudoClass.trim().toLowerCase()) {
    case 'hover':
      return 'hover'
    case 'active':
    case 'pressed':
      return 'pressed'
    case 'focus':
      return 'focus'
    case 'focus-visible':
      return 'focusVisible'
    case 'disabled':
      return 'disabled'
    case 'checked':
      return 'checked'
    case 'read-only':
    case 'readonly':
      return 'readOnly'
    case 'selected':
      return 'selected'
    default:
      return null
  }
}

function parseSelector(
  selectorText: string,
  source: string | undefined,
  line: number,
): { selector?: HtmlStyleSelector; diagnostic?: HtmlCssDiagnostic } {
  const selector = selectorText.trim()
  if (selector === ':root') {
    return { selector: { classes: [] } }
  }

  if (
    selector === '' ||
    selector.includes(' ') ||
    selector.includes('>') ||
    selector.includes('+') ||
    selector.includes('~') ||
    selector.includes('[') ||
    selector.includes('#') ||
    selector.includes('*') ||
    selector.includes('::')
  ) {
    return {
      diagnostic: createCssDiagnostic(
        source,
        line,
        `Unsupported selector "${selectorText}"`,
      ),
    }
  }

  const pseudoMatch = selector.match(/:([A-Za-z-]+)$/)
  const state = pseudoMatch ? normalizePseudoState(pseudoMatch[1]) : undefined
  if (pseudoMatch && !state) {
    return {
      diagnostic: createCssDiagnostic(
        source,
        line,
        `Unsupported pseudo-class ":${pseudoMatch[1]}" in "${selectorText}"`,
      ),
    }
  }

  const body = pseudoMatch
    ? selector.slice(0, pseudoMatch.index).trim()
    : selector
  if (body === '' || body.includes(':')) {
    return {
      diagnostic: createCssDiagnostic(
        source,
        line,
        `Unsupported selector "${selectorText}"`,
      ),
    }
  }

  const parts = body.split('.')
  const typePart = parts[0]
  const component =
    typePart === '' ? undefined : normalizeComponentName(typePart)
  if (component && !/^[a-z][a-z0-9]*$/i.test(typePart)) {
    return {
      diagnostic: createCssDiagnostic(
        source,
        line,
        `Unsupported type selector "${typePart}" in "${selectorText}"`,
      ),
    }
  }

  const classes = parts.slice(component ? 1 : 1)
  if (classes.length === 0 && !component) {
    return {
      diagnostic: createCssDiagnostic(
        source,
        line,
        `Unsupported selector "${selectorText}"`,
      ),
    }
  }

  for (const className of classes) {
    if (!/^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/.test(className)) {
      return {
        diagnostic: createCssDiagnostic(
          source,
          line,
          `Unsupported class selector ".${className}" in "${selectorText}"`,
        ),
      }
    }
  }

  return {
    selector: {
      component,
      classes,
      state: state ?? undefined,
    },
  }
}

function selectorSpecificity(selector: HtmlStyleSelector): number {
  return (
    (selector.component ? 1 : 0) +
    selector.classes.length * 10 +
    (selector.state ? 10 : 0)
  )
}

function splitSelectorGroup(selectorText: string): string[] {
  return selectorText
    .split(',')
    .map((selector) => selector.trim())
    .filter(Boolean)
}

export function createHtmlStyleSheet(
  cssText: string,
  options: HtmlStyleSheetOptions = {},
): HtmlStyleSheet {
  const text = stripCssComments(cssText)
  const tokens: CssDeclaration[] = []
  const rules: HtmlStyleRule[] = []
  const diagnostics: HtmlCssDiagnostic[] = []
  let index = 0
  let order = 0

  while (index < text.length) {
    const openIndex = text.indexOf('{', index)
    if (openIndex < 0) {
      break
    }

    const selectorText = text.slice(index, openIndex).trim()
    const line = lineNumberAt(text, index)
    const closeIndex = findMatchingBrace(text, openIndex)
    if (closeIndex < 0) {
      diagnostics.push(
        createCssDiagnostic(
          options.source,
          line,
          `Unclosed CSS rule "${selectorText}"`,
        ),
      )
      break
    }

    const body = text.slice(openIndex + 1, closeIndex)
    index = closeIndex + 1

    if (selectorText.startsWith('@')) {
      diagnostics.push(
        createCssDiagnostic(
          options.source,
          line,
          `Unsupported at-rule "${selectorText}"`,
        ),
      )
      continue
    }

    const declarations = parseDeclarations(body)
    for (const selectorPart of splitSelectorGroup(selectorText)) {
      const parsed = parseSelector(selectorPart, options.source, line)
      if (parsed.diagnostic) {
        diagnostics.push(parsed.diagnostic)
        continue
      }
      if (!parsed.selector) {
        continue
      }

      if (selectorPart === ':root') {
        tokens.push(
          ...declarations.filter((declaration) =>
            declaration.property.startsWith('--'),
          ),
        )
        continue
      }

      rules.push({
        selector: parsed.selector,
        selectorText: selectorPart,
        declarations,
        specificity: selectorSpecificity(parsed.selector),
        order: order++,
        line,
      })
    }
  }

  return {
    kind: 'html-style-sheet',
    source: options.source,
    tokens,
    rules,
    diagnostics,
  }
}

function normalizeTheme(
  theme: HtmlPluginOptions['theme'],
): HtmlTheme | undefined {
  if (!theme) {
    return undefined
  }
  return isHtmlTheme(theme) ? theme : defineHtmlTheme(theme)
}

function normalizeStyleSheets(
  stylesheets: HtmlPluginOptions['stylesheets'],
): HtmlStyleSheet[] {
  return (stylesheets ?? []).map((stylesheet) =>
    isHtmlStyleSheet(stylesheet)
      ? stylesheet
      : createHtmlStyleSheet(stylesheet),
  )
}

export function createHtmlStyleContext(
  options: HtmlPluginOptions = {},
): HtmlStyleContext {
  return {
    defaultStyles: options.defaultStyles ?? 'none',
    theme: normalizeTheme(options.theme),
    stylesheets: normalizeStyleSheets(options.stylesheets),
    warnUnsupportedCss: options.warnUnsupportedCss !== false,
  }
}

function warnCss(context: HtmlStyleContext, diagnostic: HtmlCssDiagnostic): void {
  if (!context.warnUnsupportedCss || warnedCssDiagnostics.has(diagnostic.key)) {
    return
  }
  warnedCssDiagnostics.add(diagnostic.key)
  console.warn(diagnostic.message)
}

function readStyleSheetTokens(
  context: HtmlStyleContext,
): Record<string, string> {
  const tokens: Record<string, string> = {}

  Object.assign(tokens, defaultPresetTheme(context.defaultStyles)?.tokens)
  Object.assign(tokens, context.theme?.tokens)

  for (const stylesheet of context.stylesheets) {
    for (const diagnostic of stylesheet.diagnostics) {
      warnCss(context, diagnostic)
    }
    for (const declaration of stylesheet.tokens) {
      tokens[declaration.property] = resolveCssVariables(
        declaration.value,
        tokens,
        context,
        `:root ${declaration.property}`,
      )
    }
  }

  return tokens
}

function resolveCssVariables(
  value: string,
  tokens: Record<string, string>,
  context: HtmlStyleContext,
  origin: string,
): string {
  let resolved = value

  for (let pass = 0; pass < 10; pass++) {
    let changed = false
    resolved = resolved.replace(
      /var\(\s*(--[_a-zA-Z][_a-zA-Z0-9-]*)\s*(?:,\s*([^)]+))?\)/g,
      (match: string, tokenName: string, fallback: string | undefined) => {
        if (tokens[tokenName] != null) {
          changed = true
          return tokens[tokenName]
        }
        if (fallback != null) {
          changed = true
          return fallback.trim()
        }

        warnCss(context, {
          key: `${origin}:unresolved:${tokenName}`,
          message: `[vue-godot/html/css] Unresolved CSS variable "${tokenName}" in ${origin}.`,
        })
        return match
      },
    )

    if (!changed || !resolved.includes('var(')) {
      break
    }
  }

  return resolved
}

function declarationsToStyle(
  declarations: readonly CssDeclaration[],
  tokens: Record<string, string>,
  context: HtmlStyleContext,
  origin: string,
): HtmlStyle | undefined {
  const css = declarations
    .filter((declaration) => !declaration.property.startsWith('--'))
    .map(
      (declaration) =>
        `${declaration.property}: ${resolveCssVariables(
          declaration.value,
          tokens,
          context,
          `${origin} ${declaration.property}`,
        )}`,
    )
    .join(';')

  if (css === '') {
    return undefined
  }

  const parsed = parseHtmlStyle(css)
  const unsupportedKeys = getUnsupportedStyleKeys(parsed)
  for (const key of unsupportedKeys) {
    warnCss(context, {
      key: `${origin}:unsupported-property:${key}`,
      message: `[vue-godot/html/css] Unsupported property "${key}" in ${origin}.`,
    })
  }

  const supported: Record<string, unknown> = {}
  for (const [key, parsedValue] of Object.entries(parsed)) {
    if (supportedStyleKeySet.has(key)) {
      supported[key] = parsedValue
    }
  }

  return Object.keys(supported).length > 0
    ? (supported as HtmlStyle)
    : undefined
}

function mergeStyles(
  ...styles: readonly (HtmlStyleInput | undefined)[]
): HtmlStyle | undefined {
  const merged: Record<string, unknown> = {}
  for (const style of styles) {
    const normalized = normalizeHtmlStyle(style)
    if (normalized) {
      Object.assign(merged, normalized)
    }
  }

  return Object.keys(merged).length > 0 ? (merged as HtmlStyle) : undefined
}

type HtmlClassRecord = Record<string, unknown>

function collectClassList(value: unknown, classes: Set<string>): void {
  if (typeof value === 'string') {
    for (const className of value.split(/\s+/)) {
      const normalized = className.trim()
      if (normalized) {
        classes.add(normalized)
      }
    }
    return
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      collectClassList(entry, classes)
    }
    return
  }

  if (isRecord(value)) {
    for (const [className, enabled] of Object.entries(
      value as HtmlClassRecord,
    )) {
      if (enabled) {
        classes.add(className)
      }
    }
  }
}

export function normalizeHtmlClassList(
  ...values: readonly unknown[]
): string[] {
  const classes = new Set<string>()
  for (const value of values) {
    collectClassList(value, classes)
  }
  return [...classes]
}

function selectorMatches(
  selector: HtmlStyleSelector,
  componentName: string,
  classes: Set<string>,
): boolean {
  if (selector.component && selector.component !== componentName) {
    return false
  }

  for (const className of selector.classes) {
    if (!classes.has(className)) {
      return false
    }
  }

  return true
}

function isStateActive(
  stateName: HtmlComponentStateName,
  state: HtmlComponentState | undefined,
): boolean {
  if (!state) {
    return false
  }

  if (stateName === 'pressed') {
    return state.pressed === true || state.active === true
  }
  if (stateName === 'focusVisible') {
    return state.focusVisible === true || state.focus === true
  }

  return state[stateName] === true
}

function sortedMatchingRules(
  context: HtmlStyleContext,
  componentName: string,
  classes: Set<string>,
  stateName?: HtmlComponentStateName,
): HtmlStyleRule[] {
  const rules: HtmlStyleRule[] = []
  for (const stylesheet of context.stylesheets) {
    for (const rule of stylesheet.rules) {
      if (rule.selector.state !== stateName) {
        continue
      }
      if (selectorMatches(rule.selector, componentName, classes)) {
        rules.push(rule)
      }
    }
  }

  return rules.sort((a, b) =>
    a.specificity === b.specificity
      ? a.order - b.order
      : a.specificity - b.specificity,
  )
}

function componentTheme(
  theme: HtmlTheme | undefined,
  componentName: string,
): HtmlComponentTheme | undefined {
  return theme?.components[componentName]
}

function defaultPresetTheme(
  preset: HtmlDefaultStylePreset,
): HtmlTheme | undefined {
  switch (preset) {
    case 'browser':
      return browserDefaultTheme
    case 'native-app':
      return nativeAppDefaultTheme
    case 'none':
      return undefined
  }
}

function resolveRuleStyles(
  rules: readonly HtmlStyleRule[],
  tokens: Record<string, string>,
  context: HtmlStyleContext,
): HtmlStyle | undefined {
  return mergeStyles(
    ...rules.map((rule) =>
      declarationsToStyle(
        rule.declarations,
        tokens,
        context,
        rule.selectorText,
      ),
    ),
  )
}

function resolveComponentThemeState(
  preset: HtmlTheme | undefined,
  theme: HtmlTheme | undefined,
  componentName: string,
  stateName: HtmlComponentStateName,
): HtmlStyle | undefined {
  return mergeStyles(
    componentTheme(preset, componentName)?.states[stateName],
    componentTheme(theme, componentName)?.states[stateName],
  )
}

export function resolveHtmlComponentStyle(
  context: HtmlStyleContext | undefined,
  options: ResolveHtmlComponentStyleOptions,
): ResolvedHtmlComponentStyle {
  const resolvedContext = context ?? emptyHtmlStyleContext
  const componentName = normalizeComponentName(options.componentName)
  const classList = normalizeHtmlClassList(options.class, options.className)
  const classSet = new Set(classList)
  const tokens = readStyleSheetTokens(resolvedContext)
  const preset = defaultPresetTheme(resolvedContext.defaultStyles)
  const baseRules = sortedMatchingRules(resolvedContext, componentName, classSet)
  const baseRuleStyle = resolveRuleStyles(baseRules, tokens, resolvedContext)
  const presetComponent = componentTheme(preset, componentName)
  const themedComponent = componentTheme(resolvedContext.theme, componentName)
  const inlineStyle = normalizeStyle(options.inlineStyle)
  const stateStyles: Partial<Record<HtmlComponentStateName, HtmlStyle>> = {}
  const activeStateStyles: HtmlStyle[] = []

  const baseBeforeInline = mergeStyles(
    presetComponent?.base,
    themedComponent?.base,
    baseRuleStyle,
  )

  for (const stateName of htmlComponentStateNames) {
    const stateRules = sortedMatchingRules(
      resolvedContext,
      componentName,
      classSet,
      stateName,
    )
    const themeStateStyle = resolveComponentThemeState(
      preset,
      resolvedContext.theme,
      componentName,
      stateName,
    )
    const ruleStateStyle = resolveRuleStyles(
      stateRules,
      tokens,
      resolvedContext,
    )
    const stateStyle = mergeStyles(themeStateStyle, ruleStateStyle)

    if (stateStyle) {
      stateStyles[stateName] =
        mergeStyles(baseBeforeInline, stateStyle, inlineStyle) ?? stateStyle
    }

    if (isStateActive(stateName, options.state)) {
      const activeStateStyle = mergeStyles(themeStateStyle, ruleStateStyle)
      if (activeStateStyle) {
        activeStateStyles.push(activeStateStyle)
      }
    }
  }

  return {
    style: mergeStyles(baseBeforeInline, ...activeStateStyles, inlineStyle),
    classList,
    stateStyles,
  }
}

export function useHtmlComponentStyleResolver(
  componentName: string,
  attrs?: Record<string, unknown>,
): (
  inlineStyle: HtmlStyleInput,
  state?: HtmlComponentState,
) => ResolvedHtmlComponentStyle {
  const context = useHtmlStyleContext()

  return (inlineStyle, state) =>
    resolveHtmlComponentStyle(context, {
      componentName,
      class: attrs?.['class'],
      className: attrs?.['className'],
      inlineStyle,
      state,
    })
}

export function useHtmlStyleContext(): HtmlStyleContext {
  return hasInjectionContext()
    ? inject(htmlStyleContextKey, emptyHtmlStyleContext)
    : emptyHtmlStyleContext
}

export function clearHtmlCssWarningsForTests(): void {
  warnedCssDiagnostics.clear()
}

const browserDefaultTheme = defineHtmlTheme({
  tokens: {
    color: {
      page: '#ffffff',
      text: '#111827',
      border: '#9ca3af',
      control: '#f3f4f6',
      controlHover: '#e5e7eb',
      controlPressed: '#d1d5db',
      link: '#2563eb',
      focus: '#2563eb',
    },
    radius: {
      control: 4,
    },
  },
  components: {
    A: {
      base: {
        color: '#2563eb',
        fontSize: 16,
      },
    },
    Button: {
      base: {
        minHeight: 32,
        padding: '2px 8px',
        backgroundColor: '#f3f4f6',
        borderColor: '#9ca3af',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 4,
        color: '#111827',
        fontSize: 16,
      },
      states: {
        hover: {
          backgroundColor: '#e5e7eb',
        },
        pressed: {
          backgroundColor: '#d1d5db',
        },
        focusVisible: {
          borderColor: '#2563eb',
        },
        disabled: {
          opacity: 0.5,
        },
      },
    },
    Div: {
      base: {
        flexDirection: 'column',
      },
    },
    Screen: {
      base: {
        backgroundColor: '#ffffff',
        color: '#111827',
      },
    },
    Span: {
      base: {
        color: '#111827',
        fontSize: 16,
      },
    },
  },
})

const nativeAppDefaultTheme = defineHtmlTheme({
  tokens: {
    color: {
      page: '#f8fafc',
      surface: '#ffffff',
      text: '#111827',
      mutedText: '#64748b',
      border: '#dbe3ef',
      primary: '#2563eb',
      primaryPressed: '#1d4ed8',
      focus: '#2563eb',
    },
    radius: {
      sm: 6,
      md: 8,
      lg: 12,
    },
    space: {
      2: 8,
      3: 12,
      4: 16,
    },
  },
  components: {
    A: {
      base: {
        color: '#2563eb',
        fontSize: 16,
      },
    },
    Button: {
      base: {
        minHeight: 44,
        padding: '10px 14px',
        backgroundColor: '#2563eb',
        borderColor: '#2563eb',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 8,
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
      },
      states: {
        hover: {
          opacity: 0.96,
        },
        pressed: {
          backgroundColor: '#1d4ed8',
        },
        focusVisible: {
          borderColor: '#2563eb',
        },
        disabled: {
          opacity: 0.5,
        },
      },
    },
    Div: {
      base: {
        flexDirection: 'column',
      },
    },
    Pressable: {
      base: {
        borderRadius: 8,
      },
      states: {
        pressed: {
          opacity: 0.92,
        },
      },
    },
    Screen: {
      base: {
        backgroundColor: '#f8fafc',
        color: '#111827',
      },
    },
    Span: {
      base: {
        color: '#111827',
        fontSize: 16,
      },
    },
  },
})
