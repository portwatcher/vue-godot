import { createHash, randomUUID } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  isRuntimeManifest,
  runtimePackageName,
  type RuntimeArtifact,
  type RuntimeManifest,
} from './manifest.js'

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url))
const defaultPackageDirectory = path.resolve(moduleDirectory, '..')
const addonRelativePath = 'addons/godot-js-runtime'
const extensionRegistration = {
  path: '.godot/extension_list.cfg',
  value: 'res://addons/godot-js-runtime/godot_js_runtime.gdextension',
} as const

export const installationManifestFileName =
  'installation-manifest.json' as const

export interface InstalledRuntimeFile {
  readonly path: string
  readonly size: number
  readonly sha256: string
  readonly target: string | null
}

export interface InstalledRuntimeRegistration {
  readonly path: typeof extensionRegistration.path
  readonly value: typeof extensionRegistration.value
}

export interface RuntimeInstallationManifest {
  readonly schemaVersion: 1
  readonly packageName: typeof runtimePackageName
  readonly version: string
  readonly runtimeManifestSha256: string
  readonly targets: readonly string[]
  readonly files: readonly InstalledRuntimeFile[]
  readonly registrations: readonly InstalledRuntimeRegistration[]
}

export interface RuntimeSourceOptions {
  readonly sourceDirectory?: string
}

export interface InstallRuntimeOptions extends RuntimeSourceOptions {
  readonly projectDirectory: string
  readonly targets?: readonly string[]
  readonly force?: boolean
}

export interface AddRuntimeTargetOptions extends RuntimeSourceOptions {
  readonly projectDirectory: string
  readonly targets: readonly string[]
  readonly force?: boolean
}

export interface TypegenOptions {
  readonly projectDirectory: string
  readonly outputDirectory?: string
  readonly godotExecutable?: string
  readonly packageDirectory?: string
}

export interface InstallationResult {
  readonly manifest: RuntimeInstallationManifest
  readonly copiedFiles: number
  readonly unchangedFiles: number
  readonly removedFiles: number
}

export interface UninstallResult {
  readonly removedFiles: number
  readonly removedRegistrations: number
  readonly preservedFiles: readonly string[]
}

export interface VerificationResult {
  readonly ok: boolean
  readonly checkedFiles: number
  readonly errors: readonly string[]
  readonly manifest?: RuntimeInstallationManifest
}

export interface TypegenResult {
  readonly outputDirectory: string
  readonly files: readonly string[]
  readonly source: 'packaged' | 'stock-godot'
}

interface RuntimeSourceLayout {
  readonly packageDirectory: string
  readonly addonDirectory: string
  readonly manifest: RuntimeManifest
  readonly manifestSha256: string
}

interface SourceFile {
  readonly sourcePath: string
  readonly installPath: string
  readonly size: number
  readonly sha256: string
  readonly target: string | null
}

function sha256(contents: Buffer | string): string {
  return createHash('sha256').update(contents).digest('hex')
}

function sha256File(filePath: string): string {
  return sha256(fs.readFileSync(filePath))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function lstatIfPresent(filePath: string): fs.Stats | undefined {
  try {
    return fs.lstatSync(filePath)
  } catch (error) {
    const code =
      isRecord(error) && typeof error.code === 'string' ? error.code : undefined
    if (code === 'ENOENT') return undefined
    throw error
  }
}

function isInstalledFile(value: unknown): value is InstalledRuntimeFile {
  return (
    isRecord(value) &&
    typeof value.path === 'string' &&
    typeof value.size === 'number' &&
    Number.isSafeInteger(value.size) &&
    value.size >= 0 &&
    typeof value.sha256 === 'string' &&
    /^[a-f0-9]{64}$/.test(value.sha256) &&
    (value.target === null || typeof value.target === 'string')
  )
}

function isInstalledRegistration(
  value: unknown,
): value is InstalledRuntimeRegistration {
  return (
    isRecord(value) &&
    value.path === extensionRegistration.path &&
    value.value === extensionRegistration.value
  )
}

export function isRuntimeInstallationManifest(
  value: unknown,
): value is RuntimeInstallationManifest {
  return (
    isRecord(value) &&
    value.schemaVersion === 1 &&
    value.packageName === runtimePackageName &&
    typeof value.version === 'string' &&
    typeof value.runtimeManifestSha256 === 'string' &&
    /^[a-f0-9]{64}$/.test(value.runtimeManifestSha256) &&
    Array.isArray(value.targets) &&
    value.targets.every((target) => typeof target === 'string') &&
    Array.isArray(value.files) &&
    value.files.every(isInstalledFile) &&
    Array.isArray(value.registrations) &&
    value.registrations.length === 1 &&
    value.registrations.every(isInstalledRegistration)
  )
}

function readJson(filePath: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as unknown
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    throw new Error(`Could not read ${filePath}: ${detail}`)
  }
}

function normalizeRelativePath(value: string, label: string): string {
  if (
    value.length === 0 ||
    value.includes('\\') ||
    path.posix.isAbsolute(value) ||
    /^[A-Za-z]:/.test(value)
  ) {
    throw new Error(`${label} must be a portable relative path: ${value}`)
  }
  const normalized = path.posix.normalize(value)
  if (
    normalized !== value ||
    normalized === '..' ||
    normalized.startsWith('../')
  ) {
    throw new Error(`${label} escapes its allowed directory: ${value}`)
  }
  return normalized
}

function resolveInside(root: string, relativePath: string): string {
  const normalized = normalizeRelativePath(relativePath, 'Installed file path')
  const resolvedRoot = path.resolve(root)
  const resolved = path.resolve(resolvedRoot, ...normalized.split('/'))
  const relative = path.relative(resolvedRoot, resolved)
  if (
    relative === '' ||
    relative === '..' ||
    relative.startsWith(`..${path.sep}`)
  ) {
    throw new Error(`Path escapes ${resolvedRoot}: ${relativePath}`)
  }
  return resolved
}

function resolveProjectDirectory(projectDirectory: string): string {
  const resolved = path.resolve(projectDirectory)
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
    throw new Error(`Godot project directory does not exist: ${resolved}`)
  }
  const projectFile = path.join(resolved, 'project.godot')
  if (!fs.existsSync(projectFile) || !fs.statSync(projectFile).isFile()) {
    throw new Error(`Godot project file does not exist: ${projectFile}`)
  }
  return fs.realpathSync(resolved)
}

function assertSafeDestination(
  projectDirectory: string,
  filePath: string,
): void {
  const relative = path.relative(projectDirectory, filePath)
  if (
    relative === '' ||
    relative === '..' ||
    relative.startsWith(`..${path.sep}`)
  ) {
    throw new Error(`Destination escapes the Godot project: ${filePath}`)
  }
  const segments = relative.split(path.sep)
  let current = projectDirectory
  for (const segment of segments.slice(0, -1)) {
    current = path.join(current, segment)
    const status = lstatIfPresent(current)
    if (!status) continue
    if (status.isSymbolicLink()) {
      throw new Error(`Refusing to write through symbolic link: ${current}`)
    }
    if (!status.isDirectory()) {
      throw new Error(`Destination parent is not a directory: ${current}`)
    }
  }
}

function assertRegularSource(filePath: string): fs.Stats {
  const status = lstatIfPresent(filePath)
  if (!status) {
    throw new Error(`Runtime source file is missing: ${filePath}`)
  }
  if (status.isSymbolicLink() || !status.isFile()) {
    throw new Error(`Runtime source must be a regular file: ${filePath}`)
  }
  return status
}

function assertRegularDestination(filePath: string, label: string): void {
  const status = lstatIfPresent(filePath)
  if (!status) return
  if (status.isSymbolicLink() || !status.isFile()) {
    throw new Error(`${label} is not a regular file: ${filePath}`)
  }
}

function replaceTemporaryFile(
  temporaryPath: string,
  destinationPath: string,
): void {
  try {
    fs.renameSync(temporaryPath, destinationPath)
    return
  } catch (error) {
    const code =
      isRecord(error) && typeof error.code === 'string' ? error.code : undefined
    if (
      process.platform !== 'win32' ||
      !lstatIfPresent(destinationPath) ||
      !['EACCES', 'EEXIST', 'EPERM'].includes(code ?? '')
    ) {
      throw error
    }
  }

  assertRegularDestination(destinationPath, 'Replacement destination')
  const backupPath = `${temporaryPath}.${randomUUID()}.backup`
  fs.renameSync(destinationPath, backupPath)
  try {
    fs.renameSync(temporaryPath, destinationPath)
  } catch (error) {
    fs.renameSync(backupPath, destinationPath)
    throw error
  }
  fs.rmSync(backupPath, { force: true })
}

function atomicCopy(sourcePath: string, destinationPath: string): void {
  const sourceStatus = assertRegularSource(sourcePath)
  fs.mkdirSync(path.dirname(destinationPath), { recursive: true })
  const temporaryPath = path.join(
    path.dirname(destinationPath),
    `.godot-js-runtime-${process.pid}-${randomUUID()}.tmp`,
  )
  try {
    fs.copyFileSync(sourcePath, temporaryPath, fs.constants.COPYFILE_EXCL)
    fs.chmodSync(temporaryPath, sourceStatus.mode & 0o777)
    replaceTemporaryFile(temporaryPath, destinationPath)
  } finally {
    if (fs.existsSync(temporaryPath)) fs.rmSync(temporaryPath, { force: true })
  }
}

function atomicWrite(filePath: string, contents: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  const temporaryPath = path.join(
    path.dirname(filePath),
    `.godot-js-runtime-${process.pid}-${randomUUID()}.tmp`,
  )
  try {
    fs.writeFileSync(temporaryPath, contents, { flag: 'wx' })
    replaceTemporaryFile(temporaryPath, filePath)
  } finally {
    if (fs.existsSync(temporaryPath)) fs.rmSync(temporaryPath, { force: true })
  }
}

function fileMatches(
  filePath: string,
  expected: InstalledRuntimeFile,
): boolean {
  const status = lstatIfPresent(filePath)
  if (!status) return false
  return (
    !status.isSymbolicLink() &&
    status.isFile() &&
    status.size === expected.size &&
    sha256File(filePath) === expected.sha256
  )
}

function resolveSourceLayout(sourceDirectory?: string): RuntimeSourceLayout {
  const requested = path.resolve(sourceDirectory ?? defaultPackageDirectory)
  if (!fs.existsSync(requested) || !fs.statSync(requested).isDirectory()) {
    throw new Error(`Runtime source directory does not exist: ${requested}`)
  }
  const packageCandidate = path.join(
    requested,
    'addon/godot-js-runtime/runtime-manifest.json',
  )
  const directCandidate = path.join(requested, 'runtime-manifest.json')
  const packageDirectory = fs.existsSync(packageCandidate)
    ? requested
    : path.resolve(requested, '../..')
  const addonDirectory = fs.existsSync(packageCandidate)
    ? path.join(requested, 'addon/godot-js-runtime')
    : requested
  const manifestPath = fs.existsSync(packageCandidate)
    ? packageCandidate
    : directCandidate
  if (!fs.existsSync(manifestPath)) {
    throw new Error(
      `Runtime source must be a package root or addon directory containing runtime-manifest.json: ${requested}`,
    )
  }
  const manifestSource = fs.readFileSync(manifestPath, 'utf-8')
  const manifest: unknown = readJson(manifestPath)
  if (!isRuntimeManifest(manifest)) {
    throw new Error(`Runtime manifest is invalid: ${manifestPath}`)
  }
  return {
    packageDirectory,
    addonDirectory,
    manifest,
    manifestSha256: sha256(manifestSource),
  }
}

export function readRuntimeSourceManifest(
  sourceDirectory?: string,
): RuntimeManifest {
  return resolveSourceLayout(sourceDirectory).manifest
}

function artifactSourceFile(
  source: RuntimeSourceLayout,
  artifact: RuntimeArtifact,
): SourceFile {
  const artifactName = normalizeRelativePath(
    artifact.name,
    'Runtime artifact name',
  )
  const sourcePath = resolveInside(
    path.join(source.addonDirectory, 'bin'),
    artifactName,
  )
  const status = assertRegularSource(sourcePath)
  if (
    status.size !== artifact.size ||
    sha256File(sourcePath) !== artifact.sha256
  ) {
    throw new Error(
      `Runtime artifact does not match runtime-manifest.json: ${artifactName}`,
    )
  }
  return {
    sourcePath,
    installPath: `${addonRelativePath}/bin/${artifactName}`,
    size: artifact.size,
    sha256: artifact.sha256,
    target: artifact.target,
  }
}

function ordinarySourceFile(
  sourcePath: string,
  installName: string,
): SourceFile {
  const status = assertRegularSource(sourcePath)
  return {
    sourcePath,
    installPath: `${addonRelativePath}/${installName}`,
    size: status.size,
    sha256: sha256File(sourcePath),
    target: null,
  }
}

function coreSourceFiles(source: RuntimeSourceLayout): SourceFile[] {
  const files = [
    ordinarySourceFile(
      path.join(source.addonDirectory, 'godot_js_runtime.gdextension'),
      'godot_js_runtime.gdextension',
    ),
    ordinarySourceFile(
      path.join(source.addonDirectory, 'runtime-manifest.json'),
      'runtime-manifest.json',
    ),
  ]
  for (const name of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) {
    const sourcePath = path.join(source.packageDirectory, name)
    if (fs.existsSync(sourcePath))
      files.push(ordinarySourceFile(sourcePath, name))
  }
  return files
}

export function availableRuntimeTargets(
  manifest: RuntimeManifest,
): readonly string[] {
  return [
    ...new Set(manifest.artifacts.map((artifact) => artifact.target)),
  ].sort()
}

export function resolveHostDebugTarget(
  manifest: RuntimeManifest,
  platform = process.platform,
  architecture = process.arch,
): string {
  const platformNames: Readonly<Record<string, string>> = {
    darwin: 'macos',
    linux: 'linux',
    win32: 'windows',
  }
  const architectureNames: Readonly<Record<string, string>> = {
    arm64: 'arm64',
    x64: 'x86_64',
  }
  const targetPlatform = platformNames[platform]
  const targetArchitecture =
    targetPlatform === 'macos' ? 'universal' : architectureNames[architecture]
  if (!targetPlatform || !targetArchitecture) {
    throw new Error(
      `No supported host target mapping for ${platform}/${architecture}`,
    )
  }
  const candidates = availableRuntimeTargets(manifest).filter(
    (target) =>
      target.startsWith(`${targetPlatform}.template_debug.`) &&
      target.endsWith(`.${targetArchitecture}`),
  )
  if (candidates.length !== 1) {
    const available = availableRuntimeTargets(manifest)
    throw new Error(
      `Expected one packaged debug artifact for ${targetPlatform}/${targetArchitecture}; found ${candidates.length}. Available targets: ${available.join(', ') || '(none)'}`,
    )
  }
  return candidates[0]
}

function selectedArtifactFiles(
  source: RuntimeSourceLayout,
  targets: readonly string[],
): SourceFile[] {
  const available = new Set(availableRuntimeTargets(source.manifest))
  for (const target of targets) {
    if (!available.has(target)) {
      throw new Error(
        `Runtime target is not packaged: ${target}. Available targets: ${[...available].sort().join(', ') || '(none)'}`,
      )
    }
  }
  return source.manifest.artifacts
    .filter((artifact) => targets.includes(artifact.target))
    .map((artifact) => artifactSourceFile(source, artifact))
}

function installationManifestPath(projectDirectory: string): string {
  return resolveInside(
    projectDirectory,
    `${addonRelativePath}/${installationManifestFileName}`,
  )
}

function readInstallationManifest(
  projectDirectory: string,
  required: boolean,
): RuntimeInstallationManifest | undefined {
  const manifestPath = installationManifestPath(projectDirectory)
  if (!lstatIfPresent(manifestPath)) {
    if (required) {
      throw new Error(
        `Godot JavaScript Runtime is not installed: ${manifestPath} is missing`,
      )
    }
    return undefined
  }
  assertRegularDestination(manifestPath, 'Installation manifest')
  const manifest: unknown = readJson(manifestPath)
  if (!isRuntimeInstallationManifest(manifest)) {
    throw new Error(
      `Installation manifest is invalid; refusing to modify files: ${manifestPath}`,
    )
  }
  const ownedPaths = new Set<string>()
  for (const file of manifest.files) {
    normalizeRelativePath(file.path, 'Installation manifest path')
    if (!file.path.startsWith(`${addonRelativePath}/`)) {
      throw new Error(
        `Installation manifest owns a file outside ${addonRelativePath}: ${file.path}`,
      )
    }
    if (ownedPaths.has(file.path)) {
      throw new Error(
        `Installation manifest records a duplicate owned file: ${file.path}`,
      )
    }
    ownedPaths.add(file.path)
  }
  return manifest
}

function installedFile(sourceFile: SourceFile): InstalledRuntimeFile {
  return {
    path: sourceFile.installPath,
    size: sourceFile.size,
    sha256: sourceFile.sha256,
    target: sourceFile.target,
  }
}

function sortedFiles(
  files: readonly InstalledRuntimeFile[],
): InstalledRuntimeFile[] {
  return [...files].sort((left, right) => left.path.localeCompare(right.path))
}

function manifestSource(
  source: RuntimeSourceLayout,
  targets: readonly string[],
  files: readonly InstalledRuntimeFile[],
): string {
  const manifest: RuntimeInstallationManifest = {
    schemaVersion: 1,
    packageName: runtimePackageName,
    version: source.manifest.version,
    runtimeManifestSha256: source.manifestSha256,
    targets: [...new Set(targets)].sort(),
    files: sortedFiles(files),
    registrations: [extensionRegistration],
  }
  return `${JSON.stringify(manifest, null, 2)}\n`
}

function ensureExtensionRegistration(projectDirectory: string): boolean {
  const registrationPath = resolveInside(
    projectDirectory,
    extensionRegistration.path,
  )
  assertSafeDestination(projectDirectory, registrationPath)
  let source = ''
  if (lstatIfPresent(registrationPath)) {
    assertRegularDestination(registrationPath, 'Extension registration')
    source = fs.readFileSync(registrationPath, 'utf-8')
    if (source.split(/\r?\n/).includes(extensionRegistration.value)) {
      return false
    }
  }
  const prefix =
    source.length === 0 || source.endsWith('\n') ? source : `${source}\n`
  atomicWrite(registrationPath, `${prefix}${extensionRegistration.value}\n`)
  return true
}

function preflightExtensionRegistration(projectDirectory: string): void {
  const registrationPath = resolveInside(
    projectDirectory,
    extensionRegistration.path,
  )
  assertSafeDestination(projectDirectory, registrationPath)
  assertRegularDestination(registrationPath, 'Extension registration')
}

function preflightOwnedFile(
  projectDirectory: string,
  file: InstalledRuntimeFile,
): void {
  const filePath = resolveInside(projectDirectory, file.path)
  assertSafeDestination(projectDirectory, filePath)
  assertRegularDestination(filePath, 'Manifest-owned runtime path')
}

function removeOwnedFile(
  projectDirectory: string,
  file: InstalledRuntimeFile,
): boolean {
  const filePath = resolveInside(projectDirectory, file.path)
  assertSafeDestination(projectDirectory, filePath)
  if (!lstatIfPresent(filePath)) return false
  assertRegularDestination(filePath, 'Manifest-owned runtime path')
  fs.rmSync(filePath, { force: true })
  return true
}

function preflightSourceFiles(
  projectDirectory: string,
  sourceFiles: readonly SourceFile[],
  existingManifest: RuntimeInstallationManifest | undefined,
  force: boolean,
): void {
  const ownedPaths = new Set(
    existingManifest?.files.map((file) => file.path) ?? [],
  )
  const destinationPaths = new Set<string>()
  for (const sourceFile of sourceFiles) {
    if (destinationPaths.has(sourceFile.installPath)) {
      throw new Error(
        `Runtime source selects the same destination more than once: ${sourceFile.installPath}`,
      )
    }
    destinationPaths.add(sourceFile.installPath)
    const destinationPath = resolveInside(
      projectDirectory,
      sourceFile.installPath,
    )
    assertSafeDestination(projectDirectory, destinationPath)
    assertRegularSource(sourceFile.sourcePath)
    assertRegularDestination(destinationPath, 'Runtime destination')
    if (
      lstatIfPresent(destinationPath) !== undefined &&
      !ownedPaths.has(sourceFile.installPath) &&
      !force
    ) {
      throw new Error(
        `Runtime destination is not owned by an installation manifest: ${destinationPath}. Pass --force to replace this exact file.`,
      )
    }
  }
}

function writeSourceFiles(
  projectDirectory: string,
  sourceFiles: readonly SourceFile[],
  existingManifest: RuntimeInstallationManifest | undefined,
  force: boolean,
): { copiedFiles: number; unchangedFiles: number } {
  preflightSourceFiles(projectDirectory, sourceFiles, existingManifest, force)
  const ownedPaths = new Set(
    existingManifest?.files.map((file) => file.path) ?? [],
  )
  let copiedFiles = 0
  let unchangedFiles = 0
  for (const sourceFile of sourceFiles) {
    const destinationPath = resolveInside(
      projectDirectory,
      sourceFile.installPath,
    )
    assertSafeDestination(projectDirectory, destinationPath)
    const expected = installedFile(sourceFile)
    const status = lstatIfPresent(destinationPath)
    if (status) {
      if (status.isSymbolicLink() || !status.isFile()) {
        throw new Error(
          `Refusing to replace non-file runtime destination: ${destinationPath}`,
        )
      }
      if (!ownedPaths.has(sourceFile.installPath) && !force)
        throw new Error('Runtime destination ownership changed during install')
      if (fileMatches(destinationPath, expected)) {
        unchangedFiles += 1
        continue
      }
    }
    atomicCopy(sourceFile.sourcePath, destinationPath)
    copiedFiles += 1
  }
  return { copiedFiles, unchangedFiles }
}

function installFiles(
  projectDirectory: string,
  source: RuntimeSourceLayout,
  sourceFiles: readonly SourceFile[],
  targets: readonly string[],
  existingManifest: RuntimeInstallationManifest | undefined,
  preserveExisting: boolean,
  force: boolean,
): InstallationResult {
  const desiredFiles = sourceFiles.map(installedFile)
  const desiredPaths = new Set(desiredFiles.map((file) => file.path))
  const filesToRemove =
    !preserveExisting && existingManifest
      ? existingManifest.files.filter((file) => !desiredPaths.has(file.path))
      : []
  for (const file of filesToRemove) {
    preflightOwnedFile(projectDirectory, file)
  }
  preflightExtensionRegistration(projectDirectory)
  const manifestPath = installationManifestPath(projectDirectory)
  assertSafeDestination(projectDirectory, manifestPath)
  assertRegularDestination(manifestPath, 'Installation manifest')
  const writeResult = writeSourceFiles(
    projectDirectory,
    sourceFiles,
    existingManifest,
    force,
  )
  const preservedFiles = preserveExisting
    ? (existingManifest?.files.filter((file) => !desiredPaths.has(file.path)) ??
      [])
    : []
  let removedFiles = 0
  for (const file of filesToRemove) {
    if (removeOwnedFile(projectDirectory, file)) removedFiles += 1
  }
  const allFiles = sortedFiles([...preservedFiles, ...desiredFiles])
  const allTargets = preserveExisting
    ? [...(existingManifest?.targets ?? []), ...targets]
    : [...targets]
  ensureExtensionRegistration(projectDirectory)
  const serialized = manifestSource(source, allTargets, allFiles)
  if (
    !fs.existsSync(manifestPath) ||
    fs.readFileSync(manifestPath, 'utf-8') !== serialized
  ) {
    atomicWrite(manifestPath, serialized)
  }
  const manifest: unknown = JSON.parse(serialized)
  if (!isRuntimeInstallationManifest(manifest)) {
    throw new Error('Generated installation manifest failed validation')
  }
  return {
    manifest,
    copiedFiles: writeResult.copiedFiles,
    unchangedFiles: writeResult.unchangedFiles,
    removedFiles,
  }
}

export function installRuntime(
  options: InstallRuntimeOptions,
): InstallationResult {
  const projectDirectory = resolveProjectDirectory(options.projectDirectory)
  const source = resolveSourceLayout(options.sourceDirectory)
  const targets =
    options.targets && options.targets.length > 0
      ? [...new Set(options.targets)].sort()
      : [resolveHostDebugTarget(source.manifest)]
  const sourceFiles = [
    ...coreSourceFiles(source),
    ...selectedArtifactFiles(source, targets),
  ]
  const existingManifest = readInstallationManifest(projectDirectory, false)
  return installFiles(
    projectDirectory,
    source,
    sourceFiles,
    targets,
    existingManifest,
    false,
    options.force === true,
  )
}

export function addRuntimeTarget(
  options: AddRuntimeTargetOptions,
): InstallationResult {
  const projectDirectory = resolveProjectDirectory(options.projectDirectory)
  const source = resolveSourceLayout(options.sourceDirectory)
  const existingManifest = readInstallationManifest(projectDirectory, true)
  if (!existingManifest) throw new Error('Installation manifest is unavailable')
  if (
    existingManifest.version !== source.manifest.version ||
    existingManifest.runtimeManifestSha256 !== source.manifestSha256
  ) {
    throw new Error(
      'The installed runtime and target source differ; run install before adding targets',
    )
  }
  const targets = [...new Set(options.targets)].sort()
  if (targets.length === 0) throw new Error('add-target requires a target')
  return installFiles(
    projectDirectory,
    source,
    selectedArtifactFiles(source, targets),
    targets,
    existingManifest,
    true,
    options.force === true,
  )
}

export function verifyRuntime(
  projectDirectoryValue: string,
): VerificationResult {
  const errors: string[] = []
  let projectDirectory: string
  try {
    projectDirectory = resolveProjectDirectory(projectDirectoryValue)
  } catch (error) {
    return {
      ok: false,
      checkedFiles: 0,
      errors: [error instanceof Error ? error.message : String(error)],
    }
  }
  let manifest: RuntimeInstallationManifest
  try {
    const installed = readInstallationManifest(projectDirectory, true)
    if (!installed) throw new Error('Installation manifest is unavailable')
    manifest = installed
  } catch (error) {
    return {
      ok: false,
      checkedFiles: 0,
      errors: [error instanceof Error ? error.message : String(error)],
    }
  }
  let checkedFiles = 0
  for (const file of manifest.files) {
    const filePath = resolveInside(projectDirectory, file.path)
    checkedFiles += 1
    const status = lstatIfPresent(filePath)
    if (!status) {
      errors.push(`Installed file is missing: ${file.path}`)
      continue
    }
    if (status.isSymbolicLink() || !status.isFile()) {
      errors.push(`Installed path is not a regular file: ${file.path}`)
      continue
    }
    if (status.size !== file.size) {
      errors.push(
        `Installed file size differs for ${file.path}: expected ${file.size}, received ${status.size}`,
      )
      continue
    }
    if (sha256File(filePath) !== file.sha256) {
      errors.push(`Installed file checksum differs: ${file.path}`)
    }
  }
  for (const registration of manifest.registrations) {
    const registrationPath = resolveInside(projectDirectory, registration.path)
    const status = lstatIfPresent(registrationPath)
    if (!status) {
      errors.push(`Runtime registration file is missing: ${registration.path}`)
      continue
    }
    if (status.isSymbolicLink() || !status.isFile()) {
      errors.push(
        `Runtime registration is not a regular file: ${registration.path}`,
      )
      continue
    }
    const lines = fs.readFileSync(registrationPath, 'utf-8').split(/\r?\n/)
    if (!lines.includes(registration.value)) {
      errors.push(`Runtime registration is missing from ${registration.path}`)
    }
  }
  return {
    ok: errors.length === 0,
    checkedFiles,
    errors,
    manifest,
  }
}

function pruneEmptyAddonDirectories(
  projectDirectory: string,
  files: readonly InstalledRuntimeFile[],
): void {
  const addonDirectory = resolveInside(projectDirectory, addonRelativePath)
  const candidates = new Set<string>([addonDirectory])
  for (const file of files) {
    let directory = path.dirname(resolveInside(projectDirectory, file.path))
    while (
      directory === addonDirectory ||
      directory.startsWith(`${addonDirectory}${path.sep}`)
    ) {
      candidates.add(directory)
      if (directory === addonDirectory) break
      directory = path.dirname(directory)
    }
  }
  for (const directory of [...candidates].sort(
    (left, right) => right.length - left.length,
  )) {
    if (
      fs.existsSync(directory) &&
      fs.lstatSync(directory).isDirectory() &&
      fs.readdirSync(directory).length === 0
    ) {
      fs.rmdirSync(directory)
    }
  }
}

export function uninstallRuntime(
  projectDirectoryValue: string,
): UninstallResult {
  const projectDirectory = resolveProjectDirectory(projectDirectoryValue)
  const manifest = readInstallationManifest(projectDirectory, true)
  if (!manifest) throw new Error('Installation manifest is unavailable')
  for (const file of manifest.files) {
    preflightOwnedFile(projectDirectory, file)
  }
  const manifestPath = installationManifestPath(projectDirectory)
  assertSafeDestination(projectDirectory, manifestPath)
  assertRegularDestination(manifestPath, 'Installation manifest')
  for (const registration of manifest.registrations) {
    const registrationPath = resolveInside(projectDirectory, registration.path)
    assertSafeDestination(projectDirectory, registrationPath)
    assertRegularDestination(registrationPath, 'Runtime registration')
  }
  let removedFiles = 0
  for (const file of manifest.files) {
    if (removeOwnedFile(projectDirectory, file)) removedFiles += 1
  }
  if (fs.existsSync(manifestPath)) {
    fs.rmSync(manifestPath, { force: true })
    removedFiles += 1
  }
  let removedRegistrations = 0
  for (const registration of manifest.registrations) {
    const registrationPath = resolveInside(projectDirectory, registration.path)
    if (!lstatIfPresent(registrationPath)) continue
    const lines = fs.readFileSync(registrationPath, 'utf-8').split(/\r?\n/)
    if (!lines.includes(registration.value)) continue
    const retainedLines = lines.filter((line) => line !== registration.value)
    while (retainedLines.at(-1) === '') retainedLines.pop()
    if (retainedLines.length === 0) {
      fs.rmSync(registrationPath, { force: true })
    } else {
      atomicWrite(registrationPath, `${retainedLines.join('\n')}\n`)
    }
    removedRegistrations += 1
  }
  pruneEmptyAddonDirectories(projectDirectory, manifest.files)
  const addonDirectory = resolveInside(projectDirectory, addonRelativePath)
  const preservedFiles = fs.existsSync(addonDirectory)
    ? fs
        .readdirSync(addonDirectory, { recursive: true, encoding: 'utf-8' })
        .map((entry) => String(entry).split(path.sep).join('/'))
        .sort()
    : []
  return { removedFiles, removedRegistrations, preservedFiles }
}

function resolveTypeOutput(
  projectDirectory: string,
  outputDirectory?: string,
): string {
  const resolved = path.resolve(projectDirectory, outputDirectory ?? 'typings')
  const relative = path.relative(projectDirectory, resolved)
  if (
    relative === '' ||
    relative === '..' ||
    relative.startsWith(`..${path.sep}`)
  ) {
    throw new Error(
      `Type output must be a directory inside the Godot project: ${resolved}`,
    )
  }
  assertSafeDestination(projectDirectory, path.join(resolved, 'index.d.ts'))
  return resolved
}

export function generateProjectTypes(options: TypegenOptions): TypegenResult {
  const projectDirectory = resolveProjectDirectory(options.projectDirectory)
  const outputDirectory = resolveTypeOutput(
    projectDirectory,
    options.outputDirectory,
  )
  const packageDirectory = path.resolve(
    options.packageDirectory ?? defaultPackageDirectory,
  )
  const files = [
    'godot.d.ts',
    'godot-js.d.ts',
    'godot-jsb.d.ts',
    'index.d.ts',
    'manifest.json',
  ]
  const generatedPaths = files.map((name) => path.join(outputDirectory, name))
  for (const generatedPath of generatedPaths) {
    assertSafeDestination(projectDirectory, generatedPath)
    assertRegularDestination(generatedPath, 'Type declaration destination')
  }
  if (options.godotExecutable) {
    const generatorPath = path.join(
      packageDirectory,
      'scripts/generate-types.mjs',
    )
    const result = spawnSync(
      process.execPath,
      [
        generatorPath,
        '--godot',
        path.resolve(options.godotExecutable),
        '--out-dir',
        outputDirectory,
      ],
      {
        cwd: projectDirectory,
        encoding: 'utf-8',
        maxBuffer: 16 * 1024 * 1024,
      },
    )
    if (result.error || result.status !== 0) {
      const detail = result.error
        ? result.error.message
        : `${result.stdout ?? ''}${result.stderr ?? ''}`.trim()
      throw new Error(`Stock-Godot type generation failed: ${detail}`)
    }
  } else {
    const packagedTypes = path.join(packageDirectory, 'typings')
    const sourcePaths = files.map((name) => path.join(packagedTypes, name))
    for (const sourcePath of sourcePaths) assertRegularSource(sourcePath)
    for (let index = 0; index < files.length; ++index) {
      const sourcePath = sourcePaths[index]
      const destinationPath = generatedPaths[index]
      if (
        !fs.existsSync(destinationPath) ||
        sha256File(destinationPath) !== sha256File(sourcePath)
      ) {
        atomicCopy(sourcePath, destinationPath)
      }
    }
  }
  for (const generatedPath of generatedPaths) assertRegularSource(generatedPath)
  return {
    outputDirectory,
    files,
    source: options.godotExecutable ? 'stock-godot' : 'packaged',
  }
}
