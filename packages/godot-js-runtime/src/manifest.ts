export const runtimeName = 'GodotJS' as const
export const runtimePackageName = 'godotjs' as const
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
  readonly archive: string | null
  readonly url: string | null
}

export interface RuntimeArchive {
  readonly name: string
  readonly platform: string
  readonly url: string
  readonly size: number
  readonly sha256: string
  readonly targets: readonly string[]
}

export interface RuntimeManifest {
  readonly schemaVersion: 2
  readonly runtimeName: typeof runtimeName
  readonly packageName: typeof runtimePackageName
  readonly version: string
  readonly gitCommit: string
  readonly godotMinimum: typeof minimumGodotVersion
  readonly dependencies: readonly RuntimeDependencyRevision[]
  readonly archives: readonly RuntimeArchive[]
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
    /^[a-f0-9]{64}$/.test(value.sha256) &&
    (value.archive === null || isString(value.archive)) &&
    (value.url === null || isString(value.url))
  )
}

function isArchive(value: unknown): value is RuntimeArchive {
  return (
    isRecord(value) &&
    isString(value.name) &&
    isString(value.platform) &&
    isString(value.url) &&
    typeof value.size === 'number' &&
    Number.isSafeInteger(value.size) &&
    value.size >= 0 &&
    isString(value.sha256) &&
    /^[a-f0-9]{64}$/.test(value.sha256) &&
    Array.isArray(value.targets) &&
    value.targets.every(isString)
  )
}

export function isRuntimeManifest(value: unknown): value is RuntimeManifest {
  return (
    isRecord(value) &&
    value.schemaVersion === 2 &&
    value.runtimeName === runtimeName &&
    value.packageName === runtimePackageName &&
    isString(value.version) &&
    isString(value.gitCommit) &&
    value.godotMinimum === minimumGodotVersion &&
    Array.isArray(value.dependencies) &&
    value.dependencies.every(isDependency) &&
    Array.isArray(value.archives) &&
    value.archives.every(isArchive) &&
    Array.isArray(value.artifacts) &&
    value.artifacts.every(isArtifact)
  )
}
