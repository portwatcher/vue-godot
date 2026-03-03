import {
  atob as godotAtob,
  fetch as godotFetch,
  GodotTextEncoder,
  resolveObjectURL,
} from '@vue-godot/browser'
import {
  AudioStreamMP3,
  AudioStreamOggVorbis,
  DirAccess,
  FileAccess,
  ResourceLoader,
  type AudioStream,
} from 'godot'
import { classifySource, resolveAssetPath } from './assetResolver.js'
export { classifySource } from './assetResolver.js'
export type { SourceKind } from './assetResolver.js'

// ---------------------------------------------------------------------------
// FileAccess.ModeFlags (numeric values, avoids runtime enum import issues)
// ---------------------------------------------------------------------------

/** FileAccess.ModeFlags.WRITE */
const MODE_WRITE = 2

/**
 * Monotonic counter used to generate unique temp-file names within a
 * single session. Combined with a timestamp prefix this is sufficient
 * to avoid collisions without needing `crypto.randomUUID()`.
 */
let tempFileId = 0

/** Directory under `user://` where temp audio files are stored. */
const TEMP_DIR = 'user://tmp/vue-godot-audio'

// ---------------------------------------------------------------------------
// Audio format detection
// ---------------------------------------------------------------------------

/**
 * Supported audio formats with their corresponding Godot stream constructor.
 */
type AudioFormat = 'ogg' | 'mp3' | 'wav'

const mimeToFormat: Record<string, AudioFormat> = {
  'audio/ogg': 'ogg',
  'audio/vorbis': 'ogg',
  'application/ogg': 'ogg',
  'audio/mpeg': 'mp3',
  'audio/mp3': 'mp3',
  'audio/wav': 'wav',
  'audio/wave': 'wav',
  'audio/x-wav': 'wav',
  'audio/x-pn-wav': 'wav',
}

const extToFormat: Record<string, AudioFormat> = {
  ogg: 'ogg',
  oga: 'ogg',
  mp3: 'mp3',
  wav: 'wav',
}

/**
 * Infer a file extension from a URL's path, stripping query/fragment.
 */
function extFromUrl(url: string): string | null {
  const cleaned = url.split('?')[0].split('#')[0]
  const dot = cleaned.lastIndexOf('.')
  if (dot === -1) return null
  return cleaned.slice(dot + 1).toLowerCase() || null
}

/**
 * Determine the audio format from a MIME type or URL extension.
 */
function detectFormat(mime?: string, url?: string): AudioFormat | null {
  if (mime) {
    const fmt = mimeToFormat[mime.toLowerCase()]
    if (fmt) return fmt
  }
  if (url) {
    const ext = extFromUrl(url)
    if (ext) {
      const fmt = extToFormat[ext]
      if (fmt) return fmt
    }
  }
  return null
}

// ---------------------------------------------------------------------------
// Data-URI parsing
// ---------------------------------------------------------------------------

interface DataUriParts {
  mime: string
  buffer: ArrayBuffer
}

function parseDataUri(uri: string): DataUriParts | null {
  const match = uri.match(/^data:([^;,]+)?(?:;base64)?,(.*)$/)
  if (!match) return null

  const mime = (match[1] ?? 'application/octet-stream').toLowerCase()
  const raw = match[2]

  if (uri.includes(';base64,')) {
    const binaryStr = godotAtob(raw)
    const bytes = new Uint8Array(binaryStr.length)
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i)
    }
    return { mime, buffer: bytes.buffer as ArrayBuffer }
  }

  const decoded = decodeURIComponent(raw)
  const bytes = new GodotTextEncoder().encode(decoded)
  return { mime, buffer: bytes.buffer as ArrayBuffer }
}

// ---------------------------------------------------------------------------
// Buffer → AudioStream
// ---------------------------------------------------------------------------

/**
 * Write raw audio data to a Godot temp file and load it via
 * `ResourceLoader`. This is needed for formats where the Godot class
 * doesn't expose an in-memory `load_from_buffer()` in Godot 4.3 (MP3,
 * WAV) or where the `data` property expects decoded PCM rather than
 * the container format (WAV).
 *
 * Returns `null` if the write or load fails.
 */
function loadAudioViaTempFile(
  buffer: ArrayBuffer,
  ext: string,
): AudioStream | null {
  DirAccess.make_dir_recursive_absolute(TEMP_DIR)

  const id = ++tempFileId
  const tempPath = `${TEMP_DIR}/${id}.${ext}`

  const file = FileAccess.open(tempPath, MODE_WRITE)
  if (!file) return null

  file.store_buffer(buffer)
  file.close()

  return ResourceLoader.load(tempPath) as AudioStream | null
}

/**
 * Create an `AudioStream` from raw binary data.
 *
 * - **OGG Vorbis**: Uses `AudioStreamOggVorbis.load_from_buffer()`.
 * - **MP3**: Creates a new `AudioStreamMP3` and sets its `data` property
 *   (the property accepts the raw MP3 file bytes directly).
 * - **WAV**: Writes a temp file and uses `ResourceLoader.load()` since
 *   `AudioStreamWAV.data` expects decoded PCM samples, not a WAV container.
 *
 * Returns `null` if the format is unrecognised or the load fails.
 */
export function createAudioStreamFromBuffer(
  buffer: ArrayBuffer,
  mime?: string,
  url?: string,
): AudioStream | null {
  const format = detectFormat(mime, url) ?? 'ogg'

  switch (format) {
    case 'ogg':
      return AudioStreamOggVorbis.load_from_buffer(buffer)
    case 'mp3': {
      const stream = new AudioStreamMP3()
      stream.data = buffer
      return stream
    }
    case 'wav':
      return loadAudioViaTempFile(buffer, 'wav')
  }
}

// ---------------------------------------------------------------------------
// Remote fetching
// ---------------------------------------------------------------------------

/**
 * Fetch a remote audio file and return it as an `AudioStream`.
 *
 * Downloads the audio using `@vue-godot/browser`'s fetch, then creates
 * the appropriate Godot audio stream from the response buffer.
 *
 * Returns `null` if the request fails.
 */
export async function fetchRemoteAudioStream(
  url: string,
): Promise<AudioStream | null> {
  const res = await godotFetch(url)
  if (!res.ok) return null

  const contentType = res.headers.get('content-type') ?? undefined
  const buffer = await res.arrayBuffer()

  const mime =
    contentType && contentType !== 'application/octet-stream'
      ? contentType.split(';')[0].trim()
      : undefined

  return createAudioStreamFromBuffer(buffer, mime, url)
}

// ---------------------------------------------------------------------------
// Unified loader
// ---------------------------------------------------------------------------

/**
 * Load an `AudioStream` from any supported source string.
 *
 * Supported source types:
 *   - Godot resource paths (`res://`, `user://`, relative)
 *   - Data URIs (`data:audio/mpeg;base64,…`)
 *   - Blob URLs (`blob:…`)
 *   - Remote URLs (`http://`, `https://`)
 *
 * Returns a Promise that resolves to the stream or `null`.
 */
export async function loadAudioStream(
  src: string,
): Promise<AudioStream | null> {
  const kind = classifySource(src)

  if (kind === 'local') {
    const path = resolveAssetPath(src)
    return ResourceLoader.load(path) as AudioStream | null
  }

  if (kind === 'data-uri') {
    const parsed = parseDataUri(src)
    if (!parsed) return null
    return createAudioStreamFromBuffer(parsed.buffer, parsed.mime)
  }

  if (kind === 'blob') {
    const blob = resolveObjectURL(src)
    if (!blob) return null
    const buffer = await blob.arrayBuffer()
    return createAudioStreamFromBuffer(buffer, blob.type || undefined)
  }

  if (kind === 'remote') {
    return fetchRemoteAudioStream(src)
  }

  return null
}
