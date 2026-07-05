export const FocusMode = {
  NONE: 0,
  ALL: 2,
} as const

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)
    : null
}

export function readPressedState(event: unknown): boolean | null {
  const record = asRecord(event)
  if (!record || typeof record.pressed !== 'boolean') {
    return null
  }
  if (record.echo === true) {
    return null
  }
  return record.pressed
}

export function readInputAction(event: unknown): string | null {
  const record = asRecord(event)
  return typeof record?.action === 'string' ? record.action : null
}

export function isPressedInputAction(
  event: unknown,
  action: string,
): boolean {
  return readPressedState(event) === true && readInputAction(event) === action
}
