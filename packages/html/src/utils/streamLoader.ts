import { fetch as godotFetch, resolveObjectURL } from '@vue-godot/browser'
import {
  DirAccess,
  FileAccess,
  ResourceLoader,
  VideoStreamTheora,
  type VideoStream,
} from 'godot'
import { classifySource, resolveAssetPath } from './assetResolver.js'
import { parseDataUri } from './dataUri.js'
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

/** Directory under `user://` where temp video files are stored. */
const TEMP_DIR = 'user://tmp/vue-godot-video'

// ---------------------------------------------------------------------------
// MIME → file extension for temp files
// ---------------------------------------------------------------------------

const mimeToExt: Record<string, string> = {
  'video/ogg': 'ogv',
  'video/theora': 'ogv',
  'video/x-theora': 'ogv',
  'application/ogg': 'ogv',
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

// ---------------------------------------------------------------------------
// Buffer → VideoStream via temp file
// ---------------------------------------------------------------------------

/**
 * Create a `VideoStream` from raw binary data by writing it to a Godot
 * temporary file and pointing a `VideoStreamTheora` at it.
 *
 * Godot's `VideoStreamTheora` requires a file path — it cannot read from
 * an in-memory buffer. We write the data to `user://tmp/vue-godot-video/`
 * using `FileAccess.open()` and set the `file` property on a new
 * `VideoStreamTheora`.
 *
 * Returns `null` if the write fails.
 */
export function createStreamFromBuffer(
  buffer: ArrayBuffer,
  mime?: string,
): VideoStream | null {
  const ext = (mime ? mimeToExt[mime.toLowerCase()] : null) ?? 'ogv'

  // Ensure the temp directory exists.
  DirAccess.make_dir_recursive_absolute(TEMP_DIR)

  const id = ++tempFileId
  const tempPath = `${TEMP_DIR}/${id}.${ext}`

  const file = FileAccess.open(tempPath, MODE_WRITE)
  if (!file) return null

  file.store_buffer(buffer)
  file.close()

  const stream = new VideoStreamTheora()
  stream.file = tempPath
  return stream
}

// ---------------------------------------------------------------------------
// Remote fetching
// ---------------------------------------------------------------------------

/**
 * Fetch a remote video and return it as a `VideoStream`.
 *
 * Downloads the video using `@vue-godot/browser`'s fetch, writes it to
 * a Godot temp file, and creates a `VideoStreamTheora` pointing at it.
 *
 * Returns `null` if the request fails.
 */
export async function fetchRemoteStream(
  url: string,
): Promise<VideoStream | null> {
  const res = await godotFetch(url)
  if (!res.ok) return null

  const contentType = res.headers.get('content-type') ?? undefined
  const buffer = await res.arrayBuffer()

  const mime =
    contentType && contentType !== 'application/octet-stream'
      ? contentType.split(';')[0].trim()
      : undefined

  // Fall back to extension from URL if MIME is unavailable
  const ext =
    (mime ? mimeToExt[mime.toLowerCase()] : null) ?? extFromUrl(url) ?? 'ogv'

  return createStreamFromBuffer(buffer, mime ?? `video/${ext}`)
}

// ---------------------------------------------------------------------------
// Unified loader
// ---------------------------------------------------------------------------

/**
 * Load a `VideoStream` from any supported source string.
 *
 * Supported source types:
 *   - Godot resource paths (`res://`, `user://`, relative)
 *   - Data URIs (`data:video/ogg;base64,…`)
 *   - Blob URLs (`blob:…`)
 *   - Remote URLs (`http://`, `https://`)
 *
 * Returns a Promise that resolves to the stream or `null`.
 */
export async function loadStream(src: string): Promise<VideoStream | null> {
  const kind = classifySource(src)

  if (kind === 'local') {
    const path = resolveAssetPath(src)
    return ResourceLoader.load(path) as VideoStream | null
  }

  if (kind === 'data-uri') {
    const parsed = parseDataUri(src)
    if (!parsed) return null
    return createStreamFromBuffer(parsed.buffer, parsed.mime)
  }

  if (kind === 'blob') {
    const blob = resolveObjectURL(src)
    if (!blob) return null
    const buffer = await blob.arrayBuffer()
    return createStreamFromBuffer(buffer, blob.type || undefined)
  }

  if (kind === 'remote') {
    return fetchRemoteStream(src)
  }

  return null
}
