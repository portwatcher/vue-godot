export const runtimeName = 'Godot JavaScript Runtime' as const
export const runtimePackageName = 'godot-js-runtime' as const
export const minimumGodotVersion = '4.4' as const

export interface RuntimeDependencyRevision {
  readonly name: string
  readonly repository: string
  readonly commit: string
  readonly license: string
}

export interface RuntimeArtifact {
  readonly name: string
  readonly target: string
  readonly size: number
  readonly sha256: string
}

export interface RuntimeManifest {
  readonly schemaVersion: 1
  readonly runtimeName: typeof runtimeName
  readonly packageName: typeof runtimePackageName
  readonly version: string
  readonly gitCommit: string
  readonly godotMinimum: typeof minimumGodotVersion
  readonly dependencies: readonly RuntimeDependencyRevision[]
  readonly artifacts: readonly RuntimeArtifact[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isDependency(value: unknown): value is RuntimeDependencyRevision {
  return (
    isRecord(value) &&
    isString(value.name) &&
    isString(value.repository) &&
    isString(value.commit) &&
    isString(value.license)
  )
}

function isArtifact(value: unknown): value is RuntimeArtifact {
  return (
    isRecord(value) &&
    isString(value.name) &&
    isString(value.target) &&
    typeof value.size === 'number' &&
    Number.isSafeInteger(value.size) &&
    value.size >= 0 &&
    isString(value.sha256) &&
    /^[a-f0-9]{64}$/.test(value.sha256)
  )
}

export function isRuntimeManifest(value: unknown): value is RuntimeManifest {
  return (
    isRecord(value) &&
    value.schemaVersion === 1 &&
    value.runtimeName === runtimeName &&
    value.packageName === runtimePackageName &&
    isString(value.version) &&
    isString(value.gitCommit) &&
    value.godotMinimum === minimumGodotVersion &&
    Array.isArray(value.dependencies) &&
    value.dependencies.every(isDependency) &&
    Array.isArray(value.artifacts) &&
    value.artifacts.every(isArtifact)
  )
}
