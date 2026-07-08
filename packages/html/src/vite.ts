import * as fs from 'node:fs'
import * as path from 'node:path'
import {
  getUnsupportedStyleKeys,
  parseHtmlStyle,
} from './utils/styleMapping.js'
import { createHtmlStyleSheet } from './utils/styleSheet.js'
import type { HtmlStyleRule } from './utils/styleSheet.js'

interface ViteResolvedConfig {
  root: string
}

interface ViteResolvedId {
  id: string
}

interface ViteResolveOptions {
  skipSelf?: boolean
}

interface VitePluginContext {
  resolve(
    source: string,
    importer?: string,
    options?: ViteResolveOptions,
  ): Promise<ViteResolvedId | null>
  warn(message: string): void
}

interface VitePlugin {
  name: string
  enforce: 'post'
  configResolved(config: ViteResolvedConfig): void
  resolveId(
    this: VitePluginContext,
    source: string,
    importer?: string,
  ): Promise<string | null>
  load(this: VitePluginContext, id: string): string | null
  transform(this: VitePluginContext, code: string, id: string): string | null
}

export interface VueGodotHtmlCssPluginOptions {
  include?: RegExp
  exclude?: RegExp
}

const htmlCssVirtualPrefix = '\0vue-godot-html-css:'

function stripCssComments(cssText: string): string {
  return cssText.replace(/\/\*[\s\S]*?\*\//g, '')
}

function normalizePath(filePath: string): string {
  return filePath.split(path.sep).join('/')
}

function withoutQuery(id: string): string {
  const queryIndex = id.indexOf('?')
  return queryIndex < 0 ? id : id.slice(0, queryIndex)
}

function isCssSource(id: string): boolean {
  return withoutQuery(id).toLowerCase().endsWith('.css')
}

function isCssModule(filePath: string): boolean {
  return filePath.toLowerCase().endsWith('.module.css')
}

function resolveSourcePath(filePath: string, root: string): string {
  const relative = path.relative(root, filePath)
  return normalizePath(relative.startsWith('..') ? filePath : relative)
}

function extractCssModuleClasses(cssText: string): Record<string, string> {
  const classes: Record<string, string> = {}
  const css = stripCssComments(cssText)

  for (const match of css.matchAll(/([^{}]+)\{/g)) {
    const selectorText = match[1].trim()
    if (selectorText.startsWith('@')) {
      continue
    }

    for (const classMatch of selectorText.matchAll(
      /\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g,
    )) {
      classes[classMatch[1]] = classMatch[1]
    }
  }

  return classes
}

function warnUnsupportedProperties(
  warn: (message: string) => void,
  source: string,
  rule: HtmlStyleRule,
): void {
  const css = rule.declarations
    .filter((declaration) => !declaration.property.startsWith('--'))
    .map((declaration) => `${declaration.property}: ${declaration.value}`)
    .join(';')
  if (css === '') {
    return
  }

  const parsed = parseHtmlStyle(css)
  for (const key of getUnsupportedStyleKeys(parsed)) {
    warn(
      `[vue-godot/html/css] Unsupported property "${key}" in ${source}:${rule.line} (${rule.selectorText}).`,
    )
  }
}

function createCssRegistrationModule(
  cssText: string,
  source: string,
  filePath: string,
): string {
  const classes = isCssModule(filePath) ? extractCssModuleClasses(cssText) : {}

  return [
    "import { registerHtmlStyleSheet } from '@vue-godot/html'",
    `registerHtmlStyleSheet(${JSON.stringify(cssText)}, ${JSON.stringify({
      source,
    })})`,
    `export const classes = ${JSON.stringify(classes)}`,
    `export default ${JSON.stringify(classes)}`,
    '',
  ].join('\n')
}

function warnStyleSheetDiagnostics(
  warn: (message: string) => void,
  cssText: string,
  source: string,
): void {
  const stylesheet = createHtmlStyleSheet(cssText, { source })
  for (const diagnostic of stylesheet.diagnostics) {
    warn(diagnostic.message)
  }
  for (const rule of stylesheet.rules) {
    warnUnsupportedProperties(warn, source, rule)
  }
}

function shouldHandleCss(
  id: string,
  options: VueGodotHtmlCssPluginOptions,
): boolean {
  if (!isCssSource(id)) {
    return false
  }
  if (options.include && !options.include.test(id)) {
    return false
  }
  if (options.exclude && options.exclude.test(id)) {
    return false
  }
  return true
}

export function vueGodotHtmlCss(
  options: VueGodotHtmlCssPluginOptions = {},
): VitePlugin {
  let root = process.cwd()

  return {
    name: 'vue-godot-html-css',
    enforce: 'post',
    configResolved(config) {
      root = config.root
    },
    async resolveId(source, importer) {
      if (source.includes('?') || !shouldHandleCss(source, options)) {
        return null
      }

      const resolved = await this.resolve(source, importer, { skipSelf: true })
      if (!resolved || !shouldHandleCss(resolved.id, options)) {
        return null
      }

      return `${htmlCssVirtualPrefix}${resolved.id}`
    },
    load(id) {
      if (!id.startsWith(htmlCssVirtualPrefix)) {
        return null
      }

      const filePath = id.slice(htmlCssVirtualPrefix.length)
      const cssText = fs.readFileSync(filePath, 'utf-8')
      const source = resolveSourcePath(filePath, root)
      warnStyleSheetDiagnostics(this.warn.bind(this), cssText, source)
      return createCssRegistrationModule(cssText, source, filePath)
    },
    transform(_code, id) {
      if (id.includes('?') || !shouldHandleCss(id, options)) {
        return null
      }

      const filePath = withoutQuery(id)
      const cssText = fs.readFileSync(filePath, 'utf-8')
      const source = resolveSourcePath(filePath, root)
      warnStyleSheetDiagnostics(this.warn.bind(this), cssText, source)
      return createCssRegistrationModule(cssText, source, filePath)
    },
  }
}

export const vueGodotHtmlCssPlugin = vueGodotHtmlCss
