export function parseGodotNumericVersion(version) {
  if (typeof version !== 'string') {
    throw new Error('Godot version must be a string')
  }
  const match = /^(\d+)\.(\d+)(?:\.(\d+))?/.exec(version)
  if (!match) {
    throw new Error(`Unable to parse Godot version: ${version}`)
  }
  return [
    Number.parseInt(match[1], 10),
    Number.parseInt(match[2], 10),
    Number.parseInt(match[3] ?? '0', 10),
  ]
}

export function compareGodotVersionParts(left, right) {
  for (let index = 0; index < left.length; index++) {
    if (left[index] !== right[index]) return left[index] - right[index]
  }
  return 0
}

export function parseStableGodotTag(tag) {
  if (typeof tag !== 'string' || !/^\d+\.\d+(?:\.\d+)?-stable$/.test(tag)) {
    throw new Error(`Invalid Godot stable release tag: ${String(tag)}`)
  }
  return parseGodotNumericVersion(tag)
}

export function compareStableGodotTags(left, right) {
  return compareGodotVersionParts(
    parseStableGodotTag(left),
    parseStableGodotTag(right),
  )
}
