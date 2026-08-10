import fs from 'node:fs'
import path from 'node:path'
import { gunzipSync, gzipSync, constants as zlibConstants } from 'node:zlib'

const blockSize = 512

export interface TarArchiveEntry {
  readonly path: string
  readonly contents: Buffer
  readonly mode?: number
}

export interface ExtractedTarArchiveEntry extends TarArchiveEntry {
  readonly mode: number
}

function normalizeArchivePath(value: string): string {
  if (value.length === 0 || value.includes('\0') || value.includes('\\')) {
    throw new Error(`Invalid archive path: ${value}`)
  }
  if (value.startsWith('/') || /^[A-Za-z]:/.test(value)) {
    throw new Error(`Archive path must be relative: ${value}`)
  }
  const parts = value.split('/')
  if (parts.some((part) => part === '' || part === '.' || part === '..')) {
    throw new Error(`Archive path contains an unsafe segment: ${value}`)
  }
  return value
}

function writeString(
  target: Buffer,
  offset: number,
  length: number,
  value: string,
): void {
  const source = Buffer.from(value, 'utf-8')
  if (source.length > length) {
    throw new Error(`Tar header value is too long: ${value}`)
  }
  source.copy(target, offset)
}

function writeOctal(
  target: Buffer,
  offset: number,
  length: number,
  value: number,
): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`Tar header integer is invalid: ${String(value)}`)
  }
  const encoded = value.toString(8).padStart(length - 1, '0')
  if (encoded.length > length - 1) {
    throw new Error(`Tar header integer does not fit: ${String(value)}`)
  }
  writeString(target, offset, length, `${encoded}\0`)
}

function splitArchivePath(archivePath: string): {
  readonly name: string
  readonly prefix: string
} {
  const encoded = Buffer.from(archivePath, 'utf-8')
  if (encoded.length <= 100) return { name: archivePath, prefix: '' }

  for (let index = archivePath.length - 1; index >= 0; index -= 1) {
    if (archivePath[index] !== '/') continue
    const prefix = archivePath.slice(0, index)
    const name = archivePath.slice(index + 1)
    if (
      Buffer.byteLength(prefix, 'utf-8') <= 155 &&
      Buffer.byteLength(name, 'utf-8') <= 100
    ) {
      return { name, prefix }
    }
  }
  throw new Error(`Archive path does not fit in a ustar header: ${archivePath}`)
}

function tarHeader(entry: TarArchiveEntry): Buffer {
  const archivePath = normalizeArchivePath(entry.path)
  const { name, prefix } = splitArchivePath(archivePath)
  const header = Buffer.alloc(blockSize)
  writeString(header, 0, 100, name)
  writeOctal(header, 100, 8, (entry.mode ?? 0o644) & 0o777)
  writeOctal(header, 108, 8, 0)
  writeOctal(header, 116, 8, 0)
  writeOctal(header, 124, 12, entry.contents.length)
  writeOctal(header, 136, 12, 0)
  header.fill(0x20, 148, 156)
  header[156] = '0'.charCodeAt(0)
  writeString(header, 257, 6, 'ustar\0')
  writeString(header, 263, 2, '00')
  writeString(header, 265, 32, 'root')
  writeString(header, 297, 32, 'root')
  writeString(header, 345, 155, prefix)
  const checksum = header.reduce((sum, byte) => sum + byte, 0)
  const encodedChecksum = checksum.toString(8).padStart(6, '0')
  writeString(header, 148, 8, `${encodedChecksum}\0 `)
  return header
}

export function createDeterministicTarGzip(
  entries: readonly TarArchiveEntry[],
): Buffer {
  const paths = new Set<string>()
  const blocks: Buffer[] = []
  for (const entry of [...entries].sort((left, right) =>
    left.path.localeCompare(right.path),
  )) {
    const archivePath = normalizeArchivePath(entry.path)
    if (paths.has(archivePath)) {
      throw new Error(`Archive contains a duplicate path: ${archivePath}`)
    }
    paths.add(archivePath)
    blocks.push(tarHeader({ ...entry, path: archivePath }), entry.contents)
    const padding =
      (blockSize - (entry.contents.length % blockSize)) % blockSize
    if (padding > 0) blocks.push(Buffer.alloc(padding))
  }
  blocks.push(Buffer.alloc(blockSize * 2))
  return gzipSync(Buffer.concat(blocks), {
    level: zlibConstants.Z_BEST_COMPRESSION,
  })
}

function readString(source: Buffer, offset: number, length: number): string {
  const field = source.subarray(offset, offset + length)
  const terminator = field.indexOf(0)
  return field
    .subarray(0, terminator === -1 ? field.length : terminator)
    .toString('utf-8')
}

function readOctal(source: Buffer, offset: number, length: number): number {
  const value = readString(source, offset, length).trim()
  if (!/^[0-7]+$/.test(value)) {
    throw new Error(`Invalid octal value in tar header: ${value}`)
  }
  const parsed = Number.parseInt(value, 8)
  if (!Number.isSafeInteger(parsed)) {
    throw new Error(`Tar header integer is out of range: ${value}`)
  }
  return parsed
}

function verifyHeaderChecksum(header: Buffer): void {
  const expected = readOctal(header, 148, 8)
  const copy = Buffer.from(header)
  copy.fill(0x20, 148, 156)
  const actual = copy.reduce((sum, byte) => sum + byte, 0)
  if (actual !== expected) {
    throw new Error(
      `Tar header checksum differs: expected ${expected}, received ${actual}`,
    )
  }
}

export function readTarGzip(
  archive: Buffer,
): readonly ExtractedTarArchiveEntry[] {
  const tar = gunzipSync(archive)
  const entries: ExtractedTarArchiveEntry[] = []
  const paths = new Set<string>()
  let offset = 0
  while (offset + blockSize <= tar.length) {
    const header = tar.subarray(offset, offset + blockSize)
    offset += blockSize
    if (header.every((byte) => byte === 0)) break
    verifyHeaderChecksum(header)
    if (readString(header, 257, 6) !== 'ustar') {
      throw new Error('Archive entry is not in the supported ustar format')
    }
    const type = header[156]
    if (type !== 0 && type !== '0'.charCodeAt(0)) {
      throw new Error(`Archive contains unsupported tar entry type ${type}`)
    }
    const name = readString(header, 0, 100)
    const prefix = readString(header, 345, 155)
    const archivePath = normalizeArchivePath(
      prefix ? `${prefix}/${name}` : name,
    )
    if (paths.has(archivePath)) {
      throw new Error(`Archive contains a duplicate path: ${archivePath}`)
    }
    paths.add(archivePath)
    const mode = readOctal(header, 100, 8) & 0o777
    const size = readOctal(header, 124, 12)
    if (offset + size > tar.length) {
      throw new Error(`Archive entry is truncated: ${archivePath}`)
    }
    const contents = Buffer.from(tar.subarray(offset, offset + size))
    entries.push({ path: archivePath, contents, mode })
    offset += Math.ceil(size / blockSize) * blockSize
  }
  return entries
}

function ensureDirectory(root: string, relativeDirectory: string): void {
  let current = root
  for (const part of relativeDirectory.split('/').filter(Boolean)) {
    current = path.join(current, part)
    if (fs.existsSync(current)) {
      const status = fs.lstatSync(current)
      if (status.isSymbolicLink() || !status.isDirectory()) {
        throw new Error(
          `Archive extraction path is not a safe directory: ${current}`,
        )
      }
    } else {
      fs.mkdirSync(current)
    }
  }
}

export function extractTarGzip(
  archivePath: string,
  destinationDirectory: string,
): readonly string[] {
  const destination = path.resolve(destinationDirectory)
  fs.mkdirSync(destination, { recursive: true })
  const destinationStatus = fs.lstatSync(destination)
  if (destinationStatus.isSymbolicLink() || !destinationStatus.isDirectory()) {
    throw new Error(`Archive extraction destination is unsafe: ${destination}`)
  }

  const extracted: string[] = []
  for (const entry of readTarGzip(fs.readFileSync(archivePath))) {
    const output = path.resolve(destination, ...entry.path.split('/'))
    const relative = path.relative(destination, output)
    if (
      relative === '' ||
      relative === '..' ||
      relative.startsWith(`..${path.sep}`)
    ) {
      throw new Error(
        `Archive entry escapes extraction destination: ${entry.path}`,
      )
    }
    ensureDirectory(destination, path.posix.dirname(entry.path))
    if (fs.existsSync(output)) {
      throw new Error(
        `Archive extraction would replace an existing path: ${output}`,
      )
    }
    fs.writeFileSync(output, entry.contents, { flag: 'wx', mode: entry.mode })
    fs.chmodSync(output, entry.mode)
    extracted.push(output)
  }
  return extracted
}
