export interface ParsedColor {
  r: number
  g: number
  b: number
  a: number
}

const CSS_NAMED_COLORS: Record<string, string> = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkgrey: '#a9a9a9',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkslategrey: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dimgrey: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  grey: '#808080',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgray: '#d3d3d3',
  lightgreen: '#90ee90',
  lightgrey: '#d3d3d3',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightslategrey: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#db7093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  rebeccapurple: '#663399',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  slategrey: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  transparent: '#00000000',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32',
}

function fromByteChannels(
  r: number,
  g: number,
  b: number,
  a = 255,
): ParsedColor {
  return {
    r: r / 255,
    g: g / 255,
    b: b / 255,
    a: a / 255,
  }
}

function parseNumericToken(token: string): number | null {
  const matched = token.match(/^([+-]?(?:\d+(?:\.\d+)?|\.\d+))$/)
  if (!matched) return null
  const value = Number(matched[1])
  return Number.isFinite(value) ? value : null
}

function parsePercentageToken(token: string): number | null {
  const matched = token.match(/^([+-]?(?:\d+(?:\.\d+)?|\.\d+))%$/)
  if (!matched) return null
  const value = Number(matched[1])
  if (!Number.isFinite(value) || value < 0 || value > 100) return null
  return value / 100
}

function parseAlphaToken(token: string | undefined): number | null {
  if (token == null || token === '') return 1

  const percentage = parsePercentageToken(token)
  if (percentage != null) return percentage

  const value = parseNumericToken(token)
  if (value == null || value < 0 || value > 1) return null
  return value
}

function parseRgbChannelToken(token: string): number | null {
  const percentage = parsePercentageToken(token)
  if (percentage != null) return percentage

  const value = parseNumericToken(token)
  if (value == null || value < 0 || value > 255) return null
  return value / 255
}

function splitFunctionalColorArgs(body: string): string[] | null {
  if (body.includes(',')) {
    const parts = body.split(',').map((part) => part.trim())
    if (parts.some((part) => part === '' || part.includes('/'))) return null
    return parts
  }

  const slashParts = body.split('/').map((part) => part.trim())
  if (slashParts.length > 2 || slashParts.some((part) => part === '')) {
    return null
  }

  const channels = slashParts[0].split(/\s+/).filter(Boolean)
  if (slashParts[1] != null) {
    channels.push(slashParts[1])
  }
  return channels
}

function parseHexColorChannels(color: string): ParsedColor | null {
  const normalized = color.trim()
  const matched = normalized.match(
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,
  )
  if (!matched) return null

  const hex = matched[1]
  if (hex.length === 3 || hex.length === 4) {
    const r = parseInt(hex[0] + hex[0], 16)
    const g = parseInt(hex[1] + hex[1], 16)
    const b = parseInt(hex[2] + hex[2], 16)
    const a = hex.length === 4 ? parseInt(hex[3] + hex[3], 16) : 255
    return fromByteChannels(r, g, b, a)
  }

  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) : 255
  return fromByteChannels(r, g, b, a)
}

function parseRgbColor(color: string): ParsedColor | null {
  const matched = color.match(/^rgba?\((.*)\)$/i)
  if (!matched) return null

  const parts = splitFunctionalColorArgs(matched[1])
  if (!parts || (parts.length !== 3 && parts.length !== 4)) return null

  const r = parseRgbChannelToken(parts[0])
  const g = parseRgbChannelToken(parts[1])
  const b = parseRgbChannelToken(parts[2])
  const a = parseAlphaToken(parts[3])

  if (r == null || g == null || b == null || a == null) return null
  return { r, g, b, a }
}

function parseHueToken(token: string): number | null {
  const matched = token.match(/^([+-]?(?:\d+(?:\.\d+)?|\.\d+))(deg|grad|rad|turn)?$/)
  if (!matched) return null

  const value = Number(matched[1])
  if (!Number.isFinite(value)) return null

  const unit = matched[2] ?? 'deg'
  let degrees = value
  if (unit === 'grad') {
    degrees = value * 0.9
  } else if (unit === 'rad') {
    degrees = (value * 180) / Math.PI
  } else if (unit === 'turn') {
    degrees = value * 360
  }

  return ((degrees % 360) + 360) % 360
}

function hueToRgb(hue: number, saturation: number, lightness: number): ParsedColor {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation
  const huePrime = hue / 60
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1))

  let r1 = 0
  let g1 = 0
  let b1 = 0

  if (huePrime < 1) {
    r1 = chroma
    g1 = x
  } else if (huePrime < 2) {
    r1 = x
    g1 = chroma
  } else if (huePrime < 3) {
    g1 = chroma
    b1 = x
  } else if (huePrime < 4) {
    g1 = x
    b1 = chroma
  } else if (huePrime < 5) {
    r1 = x
    b1 = chroma
  } else {
    r1 = chroma
    b1 = x
  }

  const m = lightness - chroma / 2
  return { r: r1 + m, g: g1 + m, b: b1 + m, a: 1 }
}

function parseHslColor(color: string): ParsedColor | null {
  const matched = color.match(/^hsla?\((.*)\)$/i)
  if (!matched) return null

  const parts = splitFunctionalColorArgs(matched[1])
  if (!parts || (parts.length !== 3 && parts.length !== 4)) return null

  const hue = parseHueToken(parts[0])
  const saturation = parsePercentageToken(parts[1])
  const lightness = parsePercentageToken(parts[2])
  const alpha = parseAlphaToken(parts[3])

  if (
    hue == null ||
    saturation == null ||
    lightness == null ||
    alpha == null
  ) {
    return null
  }

  return { ...hueToRgb(hue, saturation, lightness), a: alpha }
}

export function parseColorChannels(color: string): ParsedColor | null {
  const normalized = color.trim().toLowerCase()
  if (!normalized) return null

  const hexColor = CSS_NAMED_COLORS[normalized] ?? normalized
  const parsedHex = parseHexColorChannels(hexColor)
  if (parsedHex) return parsedHex

  return parseRgbColor(normalized) ?? parseHslColor(normalized)
}

/**
 * Parse a CSS color string into a Godot-compatible `r,g,b,a` string that the
 * renderer can convert.
 *
 * Supports hex (`#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`), named CSS colors,
 * `rgb()` / `rgba()`, and `hsl()` / `hsla()`. Returns `null` for unsupported
 * formats.
 */
export function parseHexColor(color: string): string | null {
  const parsed = parseColorChannels(color)
  if (!parsed) return null
  return `${parsed.r},${parsed.g},${parsed.b},${parsed.a}`
}
