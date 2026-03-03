// ---------------------------------------------------------------------------
// Minimal Response implementation for GodotJS
// ---------------------------------------------------------------------------

import { GodotBlob } from './blob.js'
import { GodotTextDecoder } from './encoding.js'
import { GodotHeaders } from './headers.js'

/**
 * Simplified `Response` compatible with the Fetch API surface.
 */
export class GodotResponse {
  readonly headers: GodotHeaders
  readonly ok: boolean
  readonly status: number
  readonly statusText: string
  readonly url: string
  readonly redirected: boolean

  private _body: ArrayBuffer
  private _bodyUsed = false

  constructor(
    body: ArrayBuffer,
    init: {
      status: number
      statusText?: string
      headers: GodotHeaders
      url?: string
      redirected?: boolean
    },
  ) {
    this._body = body
    this.status = init.status
    this.statusText = init.statusText ?? ''
    this.headers = init.headers
    this.url = init.url ?? ''
    this.redirected = init.redirected ?? false
    this.ok = init.status >= 200 && init.status < 300
  }

  get bodyUsed(): boolean {
    return this._bodyUsed
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    this._checkBodyUsed()
    this._bodyUsed = true
    return this._body
  }

  async text(): Promise<string> {
    this._checkBodyUsed()
    this._bodyUsed = true
    return new GodotTextDecoder().decode(this._body)
  }

  async json(): Promise<any> {
    const text = await this.text()
    return JSON.parse(text)
  }

  async blob(): Promise<GodotBlob> {
    this._checkBodyUsed()
    this._bodyUsed = true
    const type = this.headers.get('content-type') ?? ''
    return new GodotBlob([this._body], { type })
  }

  clone(): GodotResponse {
    this._checkBodyUsed()
    return new GodotResponse(this._body.slice(0), {
      status: this.status,
      statusText: this.statusText,
      headers: new GodotHeaders(this.headers),
      url: this.url,
      redirected: this.redirected,
    })
  }

  private _checkBodyUsed(): void {
    if (this._bodyUsed) {
      throw new TypeError('Body has already been consumed.')
    }
  }
}
