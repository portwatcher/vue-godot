interface PackedStringArrayLike {
  size(): number
  get_indexed?: (index: number) => unknown
  [index: number]: unknown
}

function isPackedStringArrayLike(
  value: unknown,
): value is PackedStringArrayLike {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const record = value as Record<string, unknown>
  return typeof record['size'] === 'function'
}

export function packedStringArrayToStrings(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item))
  }

  if (!isPackedStringArrayLike(value)) {
    return []
  }

  const count = Math.max(0, Math.trunc(Number(value.size())))
  const items: string[] = []
  for (let index = 0; index < count; index++) {
    const item =
      typeof value.get_indexed === 'function'
        ? value.get_indexed(index)
        : value[index]
    items.push(String(item))
  }

  return items
}
