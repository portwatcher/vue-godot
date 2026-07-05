export function splitCssCommaSeparated(value: string): string[] {
  const parts: string[] = []
  let quote: '"' | "'" | null = null
  let depth = 0
  let start = 0

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index]
    if ((char === '"' || char === "'") && value[index - 1] !== '\\') {
      quote = quote === char ? null : quote ?? char
    } else if (!quote && char === '(') {
      depth += 1
    } else if (!quote && char === ')' && depth > 0) {
      depth -= 1
    } else if (!quote && char === ',' && depth === 0) {
      parts.push(value.slice(start, index).trim())
      start = index + 1
    }
  }

  parts.push(value.slice(start).trim())
  return parts.filter((part) => part.length > 0)
}

export function splitCssWhitespaceOutsideParens(value: string): string[] {
  const parts: string[] = []
  let quote: '"' | "'" | null = null
  let depth = 0
  let start: number | null = null

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index]
    if ((char === '"' || char === "'") && value[index - 1] !== '\\') {
      quote = quote === char ? null : quote ?? char
    } else if (!quote && char === '(') {
      depth += 1
    } else if (!quote && char === ')' && depth > 0) {
      depth -= 1
    }

    if (!quote && /\s/.test(char) && depth === 0) {
      if (start != null) {
        parts.push(value.slice(start, index))
        start = null
      }
    } else if (start == null) {
      start = index
    }
  }

  if (start != null) {
    parts.push(value.slice(start))
  }

  return parts
}

export function splitCssDeclarations(value: string): string[] {
  const declarations: string[] = []
  let quote: '"' | "'" | null = null
  let depth = 0
  let start = 0

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index]
    if ((char === '"' || char === "'") && value[index - 1] !== '\\') {
      quote = quote === char ? null : quote ?? char
    } else if (!quote && char === '(') {
      depth += 1
    } else if (!quote && char === ')' && depth > 0) {
      depth -= 1
    } else if (!quote && char === ';' && depth === 0) {
      declarations.push(value.slice(start, index).trim())
      start = index + 1
    }
  }

  declarations.push(value.slice(start).trim())
  return declarations.filter((declaration) => declaration.length > 0)
}

export function splitCssDeclaration(
  declaration: string,
): { property: string; value: string } | null {
  let quote: '"' | "'" | null = null
  let depth = 0

  for (let index = 0; index < declaration.length; index += 1) {
    const char = declaration[index]
    if ((char === '"' || char === "'") && declaration[index - 1] !== '\\') {
      quote = quote === char ? null : quote ?? char
    } else if (!quote && char === '(') {
      depth += 1
    } else if (!quote && char === ')' && depth > 0) {
      depth -= 1
    } else if (!quote && char === ':' && depth === 0) {
      const property = declaration.slice(0, index).trim()
      const value = declaration.slice(index + 1).trim()
      return property && value ? { property, value } : null
    }
  }

  return null
}
