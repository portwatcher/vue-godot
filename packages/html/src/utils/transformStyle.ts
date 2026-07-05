import { toNumericPixels } from './styleMapping.js'

export interface ResolvedTransform {
  translateX: number
  translateY: number
  scaleX: number
  scaleY: number
  rotation: number
}

const transformFunctionPattern = /([a-zA-Z][a-zA-Z0-9]*)\(([^)]*)\)/g

function splitTransformArgs(rawArgs: string): string[] {
  const trimmed = rawArgs.trim()
  return trimmed === '' ? [] : trimmed.split(/(?:\s*,\s*|\s+)/)
}

function parseFiniteNumber(value: string | undefined): number | null {
  if (typeof value !== 'string') {
    return null
  }
  const parsed = Number(value.trim())
  return Number.isFinite(parsed) ? parsed : null
}

function parseTransformLength(value: string | undefined): number | null {
  return value == null ? null : toNumericPixels(value)
}

function parseTransformAngle(value: string | undefined): number | null {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim().toLowerCase()
  const matched = normalized.match(/^(-?\d+(?:\.\d+)?)(deg|rad|turn)?$/)
  if (!matched) {
    return null
  }

  const amount = Number(matched[1])
  if (!Number.isFinite(amount)) {
    return null
  }

  const unit = matched[2] ?? 'deg'
  switch (unit) {
    case 'deg':
      return (amount * Math.PI) / 180
    case 'rad':
      return amount
    case 'turn':
      return amount * Math.PI * 2
    default:
      return null
  }
}

function createIdentityTransform(): ResolvedTransform {
  return {
    translateX: 0,
    translateY: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
  }
}

export function resolveTransformStyle(
  transform: string | undefined,
): ResolvedTransform | null {
  if (typeof transform !== 'string') {
    return null
  }

  const trimmed = transform.trim()
  if (trimmed === '' || trimmed.toLowerCase() === 'none') {
    return null
  }

  const resolved = createIdentityTransform()
  let matchedAny = false
  let cursor = 0

  for (const match of trimmed.matchAll(transformFunctionPattern)) {
    const [fullMatch, rawName, rawArgs] = match
    const index = match.index
    if (index == null || trimmed.slice(cursor, index).trim() !== '') {
      return null
    }

    const name = rawName.toLowerCase()
    const args = splitTransformArgs(rawArgs)
    matchedAny = true

    switch (name) {
      case 'translate': {
        const x = parseTransformLength(args[0])
        const y = args.length > 1 ? parseTransformLength(args[1]) : 0
        if (x == null || y == null || args.length > 2) {
          return null
        }
        resolved.translateX += x
        resolved.translateY += y
        break
      }
      case 'translatex': {
        const x = parseTransformLength(args[0])
        if (x == null || args.length !== 1) {
          return null
        }
        resolved.translateX += x
        break
      }
      case 'translatey': {
        const y = parseTransformLength(args[0])
        if (y == null || args.length !== 1) {
          return null
        }
        resolved.translateY += y
        break
      }
      case 'scale': {
        const x = parseFiniteNumber(args[0])
        const y = args.length > 1 ? parseFiniteNumber(args[1]) : x
        if (x == null || y == null || args.length > 2) {
          return null
        }
        resolved.scaleX *= x
        resolved.scaleY *= y
        break
      }
      case 'scalex': {
        const x = parseFiniteNumber(args[0])
        if (x == null || args.length !== 1) {
          return null
        }
        resolved.scaleX *= x
        break
      }
      case 'scaley': {
        const y = parseFiniteNumber(args[0])
        if (y == null || args.length !== 1) {
          return null
        }
        resolved.scaleY *= y
        break
      }
      case 'rotate':
      case 'rotatez': {
        const rotation = parseTransformAngle(args[0])
        if (rotation == null || args.length !== 1) {
          return null
        }
        resolved.rotation += rotation
        break
      }
      default:
        return null
    }

    cursor = index + fullMatch.length
  }

  if (!matchedAny || trimmed.slice(cursor).trim() !== '') {
    return null
  }

  return resolved
}
