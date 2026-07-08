import {
  splitCssDeclaration,
  splitCssDeclarations,
} from './cssParsing.js'

export type HtmlViewportOrientation = 'portrait' | 'landscape'
export type HtmlStyleRuleStateName =
  | 'hover'
  | 'pressed'
  | 'focus'
  | 'focusVisible'
  | 'disabled'
  | 'checked'
  | 'readOnly'
  | 'selected'

export interface HtmlStyleMediaCondition {
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  orientation?: HtmlViewportOrientation
  key: string
}

export interface CssDeclaration {
  property: string
  value: string
}

export interface HtmlStyleSelector {
  component?: string
  classes: readonly string[]
  state?: HtmlStyleRuleStateName
}

export interface HtmlStyleRule {
  selector: HtmlStyleSelector
  selectorText: string
  declarations: readonly CssDeclaration[]
  media?: HtmlStyleMediaCondition
  specificity: number
  order: number
  line: number
}

export interface HtmlCssDiagnostic {
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
): HtmlStyleRuleStateName | null {
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

function normalizeComponentName(componentName: string): string {
  return componentName.trim().toLowerCase()
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

function parseMediaLength(value: string): number | null {
  const match = value.trim().match(/^(\d+(?:\.\d+)?)(?:px)?$/i)
  if (!match) {
    return null
  }

  const parsed = Number.parseFloat(match[1])
  return Number.isFinite(parsed) ? parsed : null
}

function mediaConditionKey(
  condition: Omit<HtmlStyleMediaCondition, 'key'>,
): string {
  return [
    condition.minWidth == null ? '' : `min-width:${condition.minWidth}`,
    condition.maxWidth == null ? '' : `max-width:${condition.maxWidth}`,
    condition.minHeight == null ? '' : `min-height:${condition.minHeight}`,
    condition.maxHeight == null ? '' : `max-height:${condition.maxHeight}`,
    condition.orientation == null ? '' : `orientation:${condition.orientation}`,
  ]
    .filter(Boolean)
    .join(';')
}

function unsupportedMediaValue(
  source: string | undefined,
  line: number,
  featureValue: string,
  feature: string,
): HtmlCssDiagnostic {
  return createCssDiagnostic(
    source,
    line,
    `Unsupported media value "${featureValue}" in "${feature}"`,
  )
}

function parseMediaCondition(
  atRule: string,
  source: string | undefined,
  line: number,
): {
  condition?: HtmlStyleMediaCondition
  diagnostic?: HtmlCssDiagnostic
} {
  const query = atRule.replace(/^@media\s*/i, '').trim()
  if (!/^@media\b/i.test(atRule) || query === '' || query.includes(',')) {
    return {
      diagnostic: createCssDiagnostic(
        source,
        line,
        `Unsupported at-rule "${atRule}"`,
      ),
    }
  }

  const featureMatches = [...query.matchAll(/\(([^()]+)\)/g)]
  const outsideFeatures = query.replace(/\([^()]+\)/g, ' ')
  if (
    featureMatches.length === 0 ||
    outsideFeatures.replace(/\b(?:all|screen|and)\b/gi, '').trim() !== ''
  ) {
    return {
      diagnostic: createCssDiagnostic(
        source,
        line,
        `Unsupported media query "${query}"`,
      ),
    }
  }

  const condition: Omit<HtmlStyleMediaCondition, 'key'> = {}
  for (const match of featureMatches) {
    const [featureName, featureValue] = match[1]
      .split(':')
      .map((part) => part.trim())

    if (!featureName || !featureValue) {
      return {
        diagnostic: createCssDiagnostic(
          source,
          line,
          `Unsupported media feature "${match[1]}"`,
        ),
      }
    }

    switch (featureName.toLowerCase()) {
      case 'min-width': {
        const value = parseMediaLength(featureValue)
        if (value == null) {
          return {
            diagnostic: unsupportedMediaValue(
              source,
              line,
              featureValue,
              match[1],
            ),
          }
        }
        condition.minWidth = value
        break
      }
      case 'max-width': {
        const value = parseMediaLength(featureValue)
        if (value == null) {
          return {
            diagnostic: unsupportedMediaValue(
              source,
              line,
              featureValue,
              match[1],
            ),
          }
        }
        condition.maxWidth = value
        break
      }
      case 'min-height': {
        const value = parseMediaLength(featureValue)
        if (value == null) {
          return {
            diagnostic: unsupportedMediaValue(
              source,
              line,
              featureValue,
              match[1],
            ),
          }
        }
        condition.minHeight = value
        break
      }
      case 'max-height': {
        const value = parseMediaLength(featureValue)
        if (value == null) {
          return {
            diagnostic: unsupportedMediaValue(
              source,
              line,
              featureValue,
              match[1],
            ),
          }
        }
        condition.maxHeight = value
        break
      }
      case 'orientation': {
        const normalized = featureValue.toLowerCase()
        if (normalized !== 'portrait' && normalized !== 'landscape') {
          return {
            diagnostic: createCssDiagnostic(
              source,
              line,
              `Unsupported media orientation "${featureValue}"`,
            ),
          }
        }
        condition.orientation = normalized
        break
      }
      default:
        return {
          diagnostic: createCssDiagnostic(
            source,
            line,
            `Unsupported media feature "${featureName}"`,
          ),
        }
    }
  }

  const key = mediaConditionKey(condition)
  if (key === '') {
    return {
      diagnostic: createCssDiagnostic(
        source,
        line,
        `Unsupported media query "${query}"`,
      ),
    }
  }

  return {
    condition: {
      ...condition,
      key,
    },
  }
}

function firstNonWhitespaceIndex(
  text: string,
  start: number,
  end: number,
): number {
  for (let index = start; index < end; index++) {
    if (!/\s/.test(text[index])) {
      return index
    }
  }
  return start
}

interface CssParseTarget {
  tokens: CssDeclaration[]
  rules: HtmlStyleRule[]
  diagnostics: HtmlCssDiagnostic[]
  order: number
}

function appendStyleRules(
  text: string,
  options: HtmlStyleSheetOptions,
  target: CssParseTarget,
  start: number,
  end: number,
  media: HtmlStyleMediaCondition | undefined,
): void {
  let index = start

  while (index < end) {
    const openIndex = text.indexOf('{', index)
    if (openIndex < 0 || openIndex >= end) {
      break
    }

    const selectorStart = firstNonWhitespaceIndex(text, index, openIndex)
    const selectorText = text.slice(index, openIndex).trim()
    const line = lineNumberAt(text, selectorStart)
    const closeIndex = findMatchingBrace(text, openIndex)
    if (closeIndex < 0 || closeIndex > end) {
      target.diagnostics.push(
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
      const parsedMedia = parseMediaCondition(selectorText, options.source, line)
      if (parsedMedia.diagnostic) {
        target.diagnostics.push(parsedMedia.diagnostic)
        continue
      }
      if (parsedMedia.condition) {
        appendStyleRules(
          text,
          options,
          target,
          openIndex + 1,
          closeIndex,
          parsedMedia.condition,
        )
      }
      continue
    }

    const declarations = parseDeclarations(body)
    for (const selectorPart of splitSelectorGroup(selectorText)) {
      const parsed = parseSelector(selectorPart, options.source, line)
      if (parsed.diagnostic) {
        target.diagnostics.push(parsed.diagnostic)
        continue
      }
      if (!parsed.selector) {
        continue
      }

      if (selectorPart === ':root') {
        if (media) {
          target.diagnostics.push(
            createCssDiagnostic(
              options.source,
              line,
              `Responsive :root variables are unsupported in "${selectorText}"`,
            ),
          )
          continue
        }

        target.tokens.push(
          ...declarations.filter((declaration) =>
            declaration.property.startsWith('--'),
          ),
        )
        continue
      }

      target.rules.push({
        selector: parsed.selector,
        selectorText: selectorPart,
        declarations,
        media,
        specificity: selectorSpecificity(parsed.selector),
        order: target.order++,
        line,
      })
    }
  }
}

export function createHtmlStyleSheet(
  cssText: string,
  options: HtmlStyleSheetOptions = {},
): HtmlStyleSheet {
  const text = stripCssComments(cssText)
  const target: CssParseTarget = {
    tokens: [],
    rules: [],
    diagnostics: [],
    order: 0,
  }

  appendStyleRules(text, options, target, 0, text.length, undefined)

  return {
    kind: 'html-style-sheet',
    source: options.source,
    tokens: target.tokens,
    rules: target.rules,
    diagnostics: target.diagnostics,
  }
}
