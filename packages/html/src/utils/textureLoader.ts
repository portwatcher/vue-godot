import {
  atob as godotAtob,
  fetch as godotFetch,
  GodotTextEncoder,
} from '@vue-godot/browser'
import { Image, ImageTexture, ResourceLoader, type Texture2D } from 'godot'
import { resolveAssetPath } from './assetResolver.js'

/**
 * Union of all `Image.load_*_from_buffer` method names.
 * Used to index into an `Image` instance in a type-safe way.
 */
type ImageBufferLoaderMethod =
  | 'load_png_from_buffer'
  | 'load_jpg_from_buffer'
  | 'load_webp_from_buffer'
  | 'load_bmp_from_buffer'
  | 'load_tga_from_buffer'
  | 'load_svg_from_buffer'
  | 'load_ktx_from_buffer'

/**
 * Call the appropriate `Image.load_*_from_buffer` method in a type-safe
 * manner without resorting to `as any`.
 */
function callImageLoader(
  image: Image,
  method: ImageBufferLoaderMethod,
  buffer: ArrayBuffer,
): number {
  switch (method) {
    case 'load_png_from_buffer':
      return image.load_png_from_buffer(buffer)
    case 'load_jpg_from_buffer':
      return image.load_jpg_from_buffer(buffer)
    case 'load_webp_from_buffer':
      return image.load_webp_from_buffer(buffer)
    case 'load_bmp_from_buffer':
      return image.load_bmp_from_buffer(buffer)
    case 'load_tga_from_buffer':
      return image.load_tga_from_buffer(buffer)
    case 'load_svg_from_buffer':
      return image.load_svg_from_buffer(buffer)
    case 'load_ktx_from_buffer':
      return image.load_ktx_from_buffer(buffer)
  }
}

/**
 * MIME-type to Image buffer-loader method name mapping.
 */
const mimeToLoader: Record<string, ImageBufferLoaderMethod> = {
  'image/png': 'load_png_from_buffer',
  'image/jpeg': 'load_jpg_from_buffer',
  'image/jpg': 'load_jpg_from_buffer',
  'image/webp': 'load_webp_from_buffer',
  'image/bmp': 'load_bmp_from_buffer',
  'image/x-tga': 'load_tga_from_buffer',
  'image/tga': 'load_tga_from_buffer',
  'image/svg+xml': 'load_svg_from_buffer',
  'image/ktx': 'load_ktx_from_buffer',
}

/**
 * File-extension to Image buffer-loader method name mapping.
 * Used when MIME type is unavailable (e.g. remote URLs).
 */
const extToLoader: Record<string, ImageBufferLoaderMethod> = {
  '.png': 'load_png_from_buffer',
  '.jpg': 'load_jpg_from_buffer',
  '.jpeg': 'load_jpg_from_buffer',
  '.webp': 'load_webp_from_buffer',
  '.bmp': 'load_bmp_from_buffer',
  '.tga': 'load_tga_from_buffer',
  '.svg': 'load_svg_from_buffer',
  '.ktx': 'load_ktx_from_buffer',
}

/**
 * Magic-byte signatures for common image formats.
 * Checked in order; first match wins.
 */
const magicSignatures: Array<{
  bytes: number[]
  offset: number
  loader: ImageBufferLoaderMethod
}> = [
  {
    bytes: [0x89, 0x50, 0x4e, 0x47],
    offset: 0,
    loader: 'load_png_from_buffer',
  }, // PNG
  { bytes: [0xff, 0xd8, 0xff], offset: 0, loader: 'load_jpg_from_buffer' }, // JPEG
  {
    bytes: [0x52, 0x49, 0x46, 0x46],
    offset: 0,
    loader: 'load_webp_from_buffer',
  }, // RIFF (WebP)
  { bytes: [0x42, 0x4d], offset: 0, loader: 'load_bmp_from_buffer' }, // BMP
]

// ---------------------------------------------------------------------------
// Source-type detection
// ---------------------------------------------------------------------------

export type SourceKind = 'local' | 'data-uri' | 'remote' | 'binary'

export function classifySource(src: string): SourceKind {
  if (src.startsWith('data:')) return 'data-uri'
  if (src.startsWith('http://') || src.startsWith('https://')) return 'remote'
  return 'local'
}

// ---------------------------------------------------------------------------
// Data-URI parsing
// ---------------------------------------------------------------------------

interface DataUriParts {
  mime: string
  buffer: ArrayBuffer
}

function parseDataUri(uri: string): DataUriParts | null {
  // data:[<mediatype>][;base64],<data>
  const match = uri.match(/^data:([^;,]+)?(?:;base64)?,(.*)$/)
  if (!match) return null

  const mime = (match[1] ?? 'application/octet-stream').toLowerCase()
  const raw = match[2]

  // Base64-encoded
  if (uri.includes(';base64,')) {
    const binaryStr = godotAtob(raw)
    const bytes = new Uint8Array(binaryStr.length)
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i)
    }
    return { mime, buffer: bytes.buffer as ArrayBuffer }
  }

  // Percent-encoded (rare for images, but spec-compliant)
  const decoded = decodeURIComponent(raw)
  const bytes = new GodotTextEncoder().encode(decoded)
  return { mime, buffer: bytes.buffer as ArrayBuffer }
}

// ---------------------------------------------------------------------------
// Buffer → ImageTexture
// ---------------------------------------------------------------------------

function loaderForMime(mime: string): ImageBufferLoaderMethod | null {
  return mimeToLoader[mime.toLowerCase()] ?? null
}

function loaderForExtension(url: string): ImageBufferLoaderMethod | null {
  const cleaned = url.split('?')[0].split('#')[0]
  const dot = cleaned.lastIndexOf('.')
  if (dot === -1) return null
  const ext = cleaned.slice(dot).toLowerCase()
  return extToLoader[ext] ?? null
}

function loaderFromMagicBytes(
  buffer: ArrayBuffer,
): ImageBufferLoaderMethod | null {
  const view = new Uint8Array(buffer)
  for (const sig of magicSignatures) {
    if (view.length < sig.offset + sig.bytes.length) continue
    let match = true
    for (let i = 0; i < sig.bytes.length; i++) {
      if (view[sig.offset + i] !== sig.bytes[i]) {
        match = false
        break
      }
    }
    if (match) return sig.loader
  }
  return null
}

/**
 * Create an ImageTexture from a raw buffer.
 *
 * Resolves the correct `Image.load_*_from_buffer` method using
 * (in priority order): explicit MIME type → magic bytes.
 */
export function createTextureFromBuffer(
  buffer: ArrayBuffer,
  mime?: string,
): ImageTexture | null {
  const loader =
    (mime ? loaderForMime(mime) : null) ?? loaderFromMagicBytes(buffer)
  if (!loader) return null

  const image = new Image()
  const err = callImageLoader(image, loader, buffer)
  // GError 0 === OK
  if (err !== 0) return null

  return ImageTexture.create_from_image(image)
}

// ---------------------------------------------------------------------------
// Remote fetching
// ---------------------------------------------------------------------------

/**
 * Fetch a remote image and return it as an ImageTexture.
 *
 * Uses `@vue-godot/browser`'s fetch implementation which is built on
 * Godot's HTTPClient — no browser APIs required.
 *
 * Returns `null` if the request fails or the format is unsupported.
 */
export async function fetchRemoteTexture(
  url: string,
): Promise<ImageTexture | null> {
  const res = await godotFetch(url)
  if (!res.ok) return null

  const contentType = res.headers.get('content-type') ?? undefined
  const buffer = await res.arrayBuffer()

  // Determine format: content-type header → file extension → magic bytes
  const mime =
    contentType && contentType !== 'application/octet-stream'
      ? contentType.split(';')[0].trim()
      : undefined

  const loaderMethod =
    (mime ? loaderForMime(mime) : null) ??
    loaderForExtension(url) ??
    loaderFromMagicBytes(buffer)

  if (!loaderMethod) return null

  const image = new Image()
  const err = callImageLoader(image, loaderMethod, buffer)
  if (err !== 0) return null

  return ImageTexture.create_from_image(image)
}

// ---------------------------------------------------------------------------
// Unified loader
// ---------------------------------------------------------------------------

/**
 * Load a texture from any supported source string.
 *
 * Supported source types:
 *   - Godot resource paths (`res://`, `user://`, relative)
 *   - Data URIs (`data:image/png;base64,…`)
 *   - Remote URLs (`http://`, `https://`)
 *
 * Returns a Promise that resolves to the texture or `null`.
 */
export async function loadTexture(
  src: string,
): Promise<Texture2D | ImageTexture | null> {
  const kind = classifySource(src)

  if (kind === 'local') {
    const path = resolveAssetPath(src)
    return ResourceLoader.load(path) as Texture2D | null
  }

  if (kind === 'data-uri') {
    const parsed = parseDataUri(src)
    if (!parsed) return null
    return createTextureFromBuffer(parsed.buffer, parsed.mime)
  }

  if (kind === 'remote') {
    return fetchRemoteTexture(src)
  }

  return null
}

/**
 * Create an ImageTexture from binary data (ArrayBuffer / Uint8Array).
 *
 * The format is auto-detected from magic bytes, or you can pass
 * an explicit MIME type.
 *
 * Usage:
 *   const tex = loadTextureFromBinary(pngArrayBuffer)
 *   const tex = loadTextureFromBinary(jpgUint8Array, 'image/jpeg')
 */
export function loadTextureFromBinary(
  data: ArrayBuffer | Uint8Array,
  mime?: string,
): ImageTexture | null {
  const buffer =
    data instanceof Uint8Array
      ? (data.buffer.slice(
          data.byteOffset,
          data.byteOffset + data.byteLength,
        ) as ArrayBuffer)
      : data
  return createTextureFromBuffer(buffer, mime)
}
