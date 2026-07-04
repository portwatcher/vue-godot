// ---------------------------------------------------------------------------
// File polyfill for GodotJS
// ---------------------------------------------------------------------------

import { GodotBlob } from './blob.js'

export type GodotFilePart = ArrayBuffer | Uint8Array | string | GodotBlob

export interface GodotFilePropertyBag {
  type?: string
  lastModified?: number
}

/**
 * `File` implementation backed by `GodotBlob`.
 */
export class GodotFile extends GodotBlob {
  readonly name: string
  readonly lastModified: number
  readonly webkitRelativePath = ''

  constructor(
    parts: GodotFilePart[],
    fileName: string,
    options: GodotFilePropertyBag = {},
  ) {
    super(parts, { type: options.type })
    this.name = String(fileName)
    this.lastModified = options.lastModified ?? Date.now()
  }
}
