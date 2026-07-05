import { CameraServer, CameraTexture } from 'godot'
import type { CameraFeed, Image as GodotImage, Texture2D } from 'godot'

export type CameraFeedPosition = 'unspecified' | 'front' | 'back'

export interface CameraFeedInfo {
  index: number
  id: number
  name: string
  position: CameraFeedPosition
  active: boolean
}

export interface CameraTextureOptions {
  feedId?: number
  feedIndex?: number
  whichFeed?: number
  active?: boolean
}

function finiteInteger(value: number | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.trunc(value)
    : null
}

function readNumberMethod(
  target: unknown,
  methodName: string,
): number | null {
  if (typeof target !== 'object' || target === null) {
    return null
  }

  const method = (target as Record<string, unknown>)[methodName]
  if (typeof method !== 'function') {
    return null
  }

  const value = method.call(target)
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function readStringMethod(target: unknown, methodName: string): string | null {
  if (typeof target !== 'object' || target === null) {
    return null
  }

  const method = (target as Record<string, unknown>)[methodName]
  return typeof method === 'function' ? String(method.call(target)) : null
}

function readBooleanProp(target: unknown, propName: string): boolean {
  if (typeof target !== 'object' || target === null) {
    return false
  }

  return (target as Record<string, unknown>)[propName] === true
}

function normalizeFeedPosition(position: number | null): CameraFeedPosition {
  switch (position) {
    case 1:
      return 'front'
    case 2:
      return 'back'
    default:
      return 'unspecified'
  }
}

function readFeedAtIndex(index: number): CameraFeed | null {
  try {
    return CameraServer.get_feed(index)
  } catch {
    return null
  }
}

export function listCameraFeeds(): CameraFeedInfo[] {
  let count = 0
  try {
    count = Math.max(0, Math.trunc(Number(CameraServer.get_feed_count())))
  } catch {
    return []
  }

  const feeds: CameraFeedInfo[] = []
  for (let index = 0; index < count; index++) {
    const feed = readFeedAtIndex(index)
    if (!feed) {
      continue
    }

    feeds.push({
      index,
      id: readNumberMethod(feed, 'get_id') ?? index,
      name: readStringMethod(feed, 'get_name') ?? '',
      position: normalizeFeedPosition(readNumberMethod(feed, 'get_position')),
      active: readBooleanProp(feed, 'feed_is_active'),
    })
  }

  return feeds
}

export function resolveCameraFeedId(
  options: Pick<CameraTextureOptions, 'feedId' | 'feedIndex'> = {},
): number | null {
  const explicitFeedId = finiteInteger(options.feedId)
  if (explicitFeedId != null) {
    return explicitFeedId
  }

  const feedIndex = finiteInteger(options.feedIndex) ?? 0
  const feed = readFeedAtIndex(feedIndex)
  if (!feed) {
    return null
  }

  return readNumberMethod(feed, 'get_id') ?? feedIndex
}

export function createCameraTexture(
  options: CameraTextureOptions = {},
): Texture2D | null {
  const feedId = resolveCameraFeedId(options)
  if (feedId == null) {
    return null
  }

  const texture = new CameraTexture()
  texture.camera_feed_id = feedId
  texture.which_feed = finiteInteger(options.whichFeed) ?? 0
  texture.camera_is_active = options.active !== false
  return texture
}

export function captureCameraTextureImage(
  texture: Texture2D | null | undefined,
): GodotImage | null {
  if (!texture) {
    return null
  }

  try {
    return texture.get_image()
  } catch {
    return null
  }
}

export function captureCameraImage(
  options: CameraTextureOptions = {},
): GodotImage | null {
  return captureCameraTextureImage(createCameraTexture(options))
}
