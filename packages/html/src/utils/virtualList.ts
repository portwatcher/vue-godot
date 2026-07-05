export interface VirtualListRangeInput {
  itemCount: number
  itemHeight: number
  viewportHeight: number
  scrollOffset: number
  overscan: number
}

export interface VirtualListRange {
  startIndex: number
  endIndex: number
  offsetTop: number
  offsetBottom: number
  totalHeight: number
  renderedCount: number
}

function finiteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

export function nonNegativeFinite(value: unknown, fallback = 0): number {
  return Math.max(0, finiteNumber(value) ?? fallback)
}

export function positiveFinite(value: unknown, fallback: number): number {
  const resolved = finiteNumber(value)
  return resolved != null && resolved > 0 ? resolved : fallback
}

export function resolveItemCount(
  items: readonly unknown[] | undefined,
  itemCount: number | undefined,
): number {
  if (Array.isArray(items)) {
    return items.length
  }

  return Math.floor(nonNegativeFinite(itemCount))
}

export function resolveVirtualListRange(
  input: VirtualListRangeInput,
): VirtualListRange {
  const itemCount = Math.floor(nonNegativeFinite(input.itemCount))
  const itemHeight = positiveFinite(input.itemHeight, 1)
  const viewportHeight = nonNegativeFinite(input.viewportHeight)
  const scrollOffset = nonNegativeFinite(input.scrollOffset)
  const overscan = Math.floor(nonNegativeFinite(input.overscan))
  const totalHeight = itemCount * itemHeight

  if (itemCount === 0 || viewportHeight === 0) {
    return {
      startIndex: 0,
      endIndex: 0,
      offsetTop: 0,
      offsetBottom: totalHeight,
      totalHeight,
      renderedCount: 0,
    }
  }

  const firstVisible = Math.min(
    itemCount - 1,
    Math.floor(scrollOffset / itemHeight),
  )
  const visibleEnd = Math.ceil((scrollOffset + viewportHeight) / itemHeight)
  const startIndex = Math.max(0, firstVisible - overscan)
  const endIndex = Math.min(
    itemCount,
    visibleEnd + overscan,
  )
  const offsetTop = startIndex * itemHeight
  const renderedHeight = (endIndex - startIndex) * itemHeight

  return {
    startIndex,
    endIndex,
    offsetTop,
    offsetBottom: Math.max(0, totalHeight - offsetTop - renderedHeight),
    totalHeight,
    renderedCount: endIndex - startIndex,
  }
}
