import { FontVariation, ResourceLoader, type Font } from 'godot'
import { resolveAssetPath } from './assetResolver.js'

export interface ResolvedFontFamilyStyle {
  primary: Font
  fallbacks: Font[]
}

interface RegisteredFontFamily {
  source: string
  fallbacks: string[]
}

const BOLD_EMBOLDEN_STRENGTH = 0.7
const fontSourcePattern =
  /\.(?:ttf|otf|woff2?|pfb|pfm|fnt|font|tres|res)(?:[?#].*)?$/i
const genericFontFamilies = new Set([
  'cursive',
  'emoji',
  'fangsong',
  'fantasy',
  'math',
  'monospace',
  'sans-serif',
  'serif',
  'system-ui',
  'ui-monospace',
  'ui-rounded',
  'ui-sans-serif',
  'ui-serif',
])

const registeredFontFamilies = new Map<string, RegisteredFontFamily>()
const loadedFontCache = new Map<string, Font | null>()
const styleOverrideCache = new Map<string, Font | FontVariation | null>()

let boldFontVariation: FontVariation | null = null

function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

function normalizeFamilyName(value: string): string {
  return normalizeWhitespace(value).toLowerCase()
}

function isFontResource(value: unknown): value is Font {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const record = value as Record<string, unknown>
  return (
    typeof record.get_font_name === 'function' ||
    typeof record.get_rids === 'function' ||
    'fallbacks' in record
  )
}

function isLocalFontSource(value: string): boolean {
  return (
    value.startsWith('res://') ||
    value.startsWith('user://') ||
    value.startsWith('./') ||
    value.startsWith('../') ||
    value.startsWith('/') ||
    fontSourcePattern.test(value)
  )
}

function normalizeFontSource(source: string): string {
  return resolveAssetPath(source.trim())
}

function loadFontSource(source: string): Font | null {
  const normalized = normalizeFontSource(source)
  if (loadedFontCache.has(normalized)) {
    return loadedFontCache.get(normalized) ?? null
  }

  let loaded: unknown = null
  try {
    loaded = ResourceLoader.load(normalized, 'Font')
  } catch {
    loadedFontCache.set(normalized, null)
    return null
  }

  const font = isFontResource(loaded) ? loaded : null
  loadedFontCache.set(normalized, font)
  return font
}

function getBoldFontVariation(): FontVariation {
  if (!boldFontVariation) {
    // Godot does not provide CSS-style font matching here. A FontVariation with
    // embolden gives a native bold approximation using the active theme font.
    boldFontVariation = new FontVariation()
    boldFontVariation.variation_embolden = BOLD_EMBOLDEN_STRENGTH
  }
  return boldFontVariation
}

function createFontVariationOverride(
  baseFont: Font,
  fallbacks: Font[],
  bold: boolean,
): FontVariation {
  const variation = new FontVariation()
  variation.base_font = baseFont
  if (fallbacks.length > 0) {
    variation.fallbacks = fallbacks as unknown as Font['fallbacks']
  }
  if (bold) {
    variation.variation_embolden = BOLD_EMBOLDEN_STRENGTH
  }
  return variation
}

function sourcesForFamilyToken(token: string): string[] {
  const registered = registeredFontFamilies.get(normalizeFamilyName(token))
  if (registered) {
    return [registered.source, ...registered.fallbacks]
  }

  if (genericFontFamilies.has(normalizeFamilyName(token))) {
    return []
  }

  return isLocalFontSource(token) ? [token] : []
}

export function parseFontFamilyList(fontFamily: string | undefined): string[] {
  if (typeof fontFamily !== 'string') {
    return []
  }

  const families: string[] = []
  let token = ''
  let quote: '"' | "'" | null = null
  let escaped = false

  const pushToken = (): void => {
    const normalized = normalizeWhitespace(token)
    if (normalized !== '') {
      families.push(normalized)
    }
    token = ''
  }

  for (const char of fontFamily) {
    if (escaped) {
      token += char
      escaped = false
      continue
    }

    if (char === '\\') {
      escaped = true
      continue
    }

    if (quote) {
      if (char === quote) {
        quote = null
      } else {
        token += char
      }
      continue
    }

    if (char === '"' || char === "'") {
      quote = char
      continue
    }

    if (char === ',') {
      pushToken()
      continue
    }

    token += char
  }

  pushToken()
  return families
}

export function registerFontFamily(
  family: string,
  source: string,
  fallbacks: string[] = [],
): void {
  const normalizedFamily = normalizeFamilyName(family)
  const normalizedSource = source.trim()
  if (normalizedFamily === '') {
    throw new TypeError('Font family name must be a non-empty string.')
  }
  if (normalizedSource === '') {
    throw new TypeError('Font family source must be a non-empty string.')
  }

  registeredFontFamilies.set(normalizedFamily, {
    source: normalizedSource,
    fallbacks: fallbacks
      .map((fallback) => fallback.trim())
      .filter((fallback) => fallback !== ''),
  })
  styleOverrideCache.clear()
}

export function unregisterFontFamily(family: string): boolean {
  const removed = registeredFontFamilies.delete(normalizeFamilyName(family))
  if (removed) {
    styleOverrideCache.clear()
  }
  return removed
}

export function clearFontFamilyRegistryForTests(): void {
  registeredFontFamilies.clear()
  styleOverrideCache.clear()
}

export function clearFontLoaderCacheForTests(): void {
  loadedFontCache.clear()
  styleOverrideCache.clear()
  boldFontVariation = null
}

export function resolveFontFamilyStyle(
  fontFamily: string | undefined,
): ResolvedFontFamilyStyle | null {
  const fonts: Font[] = []
  for (const family of parseFontFamilyList(fontFamily)) {
    for (const source of sourcesForFamilyToken(family)) {
      const font = loadFontSource(source)
      if (font) {
        fonts.push(font)
      }
    }
  }

  const [primary, ...fallbacks] = fonts
  return primary ? { primary, fallbacks } : null
}

export function createFontStyleOverride(
  fontFamily: string | undefined,
  fontWeight: 'normal' | 'bold' | undefined,
): Font | FontVariation | null {
  const bold = fontWeight === 'bold'
  if (!fontFamily && !bold) {
    return null
  }
  if (!fontFamily && bold) {
    return getBoldFontVariation()
  }

  const cacheKey = `${fontWeight ?? 'normal'}:${fontFamily ?? ''}`
  if (styleOverrideCache.has(cacheKey)) {
    return styleOverrideCache.get(cacheKey) ?? null
  }

  const resolved = resolveFontFamilyStyle(fontFamily)
  if (!resolved) {
    const fallback = bold ? getBoldFontVariation() : null
    styleOverrideCache.set(cacheKey, fallback)
    return fallback
  }

  const override =
    bold || resolved.fallbacks.length > 0
      ? createFontVariationOverride(resolved.primary, resolved.fallbacks, bold)
      : resolved.primary
  styleOverrideCache.set(cacheKey, override)
  return override
}
