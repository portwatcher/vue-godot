import type { GodotAbortSignal } from './abort.js'
import { GodotBlob } from './blob.js'
import {
  type GodotBodyInit,
  bodyInitToArrayBuffer,
  cloneArrayBuffer,
  cloneBodyInit,
  decodeBodyBuffer,
} from './body.js'
import { GodotFormData } from './form-data.js'
import { GodotHeaders } from './headers.js'
import { GodotURL } from './url.js'

export type GodotHeadersInit =
  | Record<string, string>
  | [string, string][]
  | GodotHeaders

export type GodotRequestRedirect = 'follow' | 'manual' | 'error'

export type GodotRequestInput = string | GodotURL | GodotRequest

export interface GodotRequestInit {
  method?: string
  headers?: GodotHeadersInit
  body?: GodotBodyInit
  signal?: GodotAbortSignal
  redirect?: GodotRequestRedirect
}

export class GodotRequest {
  readonly method: string
  readonly url: string
  readonly headers: GodotHeaders
  readonly signal?: GodotAbortSignal
  readonly redirect: GodotRequestRedirect

  private _body: GodotBodyInit | null
  private _bodyUsed = false

  constructor(input: GodotRequestInput, init: GodotRequestInit = {}) {
    const inputRequest = input instanceof GodotRequest ? input : null
    const method = (init.method ?? inputRequest?.method ?? 'GET').toUpperCase()
    const body =
      init.body !== undefined
        ? cloneBodyInit(init.body)
        : (inputRequest?._cloneBodyForConstructor() ?? null)

    if ((method === 'GET' || method === 'HEAD') && body !== null) {
      throw new TypeError('Request with GET/HEAD method cannot have a body.')
    }

    this.method = method
    this.url = inputRequest?.url ?? String(input)
    this.headers =
      init.headers !== undefined
        ? new GodotHeaders(init.headers)
        : new GodotHeaders(inputRequest?.headers)
    if (body instanceof GodotFormData && !this.headers.has('content-type')) {
      this.headers.set('content-type', body._getMultipartContentType())
    }
    this.signal = init.signal ?? inputRequest?.signal
    this.redirect = init.redirect ?? inputRequest?.redirect ?? 'follow'
    this._body = body
  }

  get bodyUsed(): boolean {
    return this._bodyUsed
  }

  get hasBody(): boolean {
    return this._body !== null
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    this._checkBodyUsed()
    this._bodyUsed = true
    if (this._body === null) {
      return new ArrayBuffer(0)
    }
    return bodyInitToArrayBuffer(this._body)
  }

  async text(): Promise<string> {
    const buffer = await this.arrayBuffer()
    return decodeBodyBuffer(buffer)
  }

  async json(): Promise<unknown> {
    const text = await this.text()
    return JSON.parse(text)
  }

  async blob(): Promise<GodotBlob> {
    const buffer = await this.arrayBuffer()
    const type = this.headers.get('content-type') ?? ''
    return new GodotBlob([buffer], { type })
  }

  clone(): GodotRequest {
    this._checkBodyUsed()
    return new GodotRequest(this.url, {
      method: this.method,
      headers: new GodotHeaders(this.headers),
      body: this._body === null ? undefined : cloneBodyInit(this._body),
      signal: this.signal,
      redirect: this.redirect,
    })
  }

  private _cloneBodyForConstructor(): GodotBodyInit | null {
    this._checkBodyUsed()
    return this._body === null ? null : cloneBodyInit(this._body)
  }

  private _checkBodyUsed(): void {
    if (this._bodyUsed) {
      throw new TypeError('Body has already been consumed.')
    }
  }
}
