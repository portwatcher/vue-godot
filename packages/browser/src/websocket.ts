// ---------------------------------------------------------------------------
// WebSocket polyfill for GodotJS
// ---------------------------------------------------------------------------
// Browser-shaped WebSocket wrapper backed by Godot's WebSocketPeer.
// ---------------------------------------------------------------------------

import { TLSOptions, WebSocketPeer } from 'godot'
import { GodotBlob } from './blob.js'
import { bodyInitToArrayBuffer } from './body.js'
import { GodotTextDecoder } from './encoding.js'
import { GodotEvent, GodotEventTarget } from './event-target.js'
import {
  clearInterval as clearGodotInterval,
  setInterval as setGodotInterval,
  setTimeout as setGodotTimeout,
} from './timing.js'
import { GodotURL } from './url.js'

export type GodotWebSocketBinaryType = 'arraybuffer' | 'blob'
export type GodotWebSocketData = string | ArrayBuffer | Uint8Array | GodotBlob
export type GodotWebSocketEventHandler = (event: GodotEvent) => void
export type GodotWebSocketMessageEventHandler = (
  event: GodotMessageEvent,
) => void
export type GodotWebSocketCloseEventHandler = (event: GodotCloseEvent) => void

const ReadyState = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
} as const

const GodotPeerState = {
  STATE_CONNECTING: 0,
  STATE_OPEN: 1,
  STATE_CLOSING: 2,
  STATE_CLOSED: 3,
} as const

const WriteMode = {
  WRITE_MODE_TEXT: 0,
  WRITE_MODE_BINARY: 1,
} as const

const POLL_INTERVAL_MS = 16

export class GodotMessageEvent extends GodotEvent {
  readonly data: string | ArrayBuffer | GodotBlob

  constructor(type: 'message', init: { data: string | ArrayBuffer | GodotBlob }) {
    super(type)
    this.data = init.data
  }
}

export class GodotCloseEvent extends GodotEvent {
  readonly code: number
  readonly reason: string
  readonly wasClean: boolean

  constructor(
    type: 'close',
    init?: { code?: number; reason?: string; wasClean?: boolean },
  ) {
    super(type)
    this.code = init?.code ?? 1000
    this.reason = init?.reason ?? ''
    this.wasClean = init?.wasClean ?? this.code === 1000
  }
}

function normalizeProtocols(protocols?: string | readonly string[]): string[] {
  if (typeof protocols === 'undefined') {
    return []
  }
  return typeof protocols === 'string' ? [protocols] : [...protocols]
}

function validateUrl(url: string): string {
  const parsed = new GodotURL(url)
  if (parsed.protocol !== 'ws:' && parsed.protocol !== 'wss:') {
    throw new SyntaxError('WebSocket URL must use ws: or wss:.')
  }
  if (!parsed.hostname) {
    throw new SyntaxError('WebSocket URL must include a host.')
  }
  return parsed.href
}

function packetToArrayBuffer(packet: { to_array_buffer(): ArrayBuffer }): ArrayBuffer {
  return packet.to_array_buffer()
}

export class GodotWebSocket extends GodotEventTarget {
  static readonly CONNECTING = ReadyState.CONNECTING
  static readonly OPEN = ReadyState.OPEN
  static readonly CLOSING = ReadyState.CLOSING
  static readonly CLOSED = ReadyState.CLOSED

  readonly CONNECTING = ReadyState.CONNECTING
  readonly OPEN = ReadyState.OPEN
  readonly CLOSING = ReadyState.CLOSING
  readonly CLOSED = ReadyState.CLOSED

  readonly url: string
  readonly extensions = ''

  binaryType: GodotWebSocketBinaryType = 'blob'
  onopen: GodotWebSocketEventHandler | null = null
  onmessage: GodotWebSocketMessageEventHandler | null = null
  onerror: GodotWebSocketEventHandler | null = null
  onclose: GodotWebSocketCloseEventHandler | null = null

  private readonly _peer = new WebSocketPeer()
  private _readyState: number = ReadyState.CONNECTING
  private _pollIntervalId: number | null = null
  private _closeDispatched = false

  constructor(url: string, protocols?: string | readonly string[]) {
    super()
    this.url = validateUrl(url)

    const normalizedProtocols = normalizeProtocols(protocols)
    if (normalizedProtocols.length > 0) {
      this._peer.supported_protocols = normalizedProtocols
    }

    const tlsOptions =
      this.url.startsWith('wss:') ? TLSOptions.client() : undefined
    const error = this._peer.connect_to_url(this.url, tlsOptions)
    if (error !== 0) {
      setGodotTimeout(() => {
        if (this._readyState !== ReadyState.CLOSED) {
          this._handleError(`connect_to_url failed (${error})`)
        }
      }, 0)
      return
    }

    this._startPolling()
  }

  get readyState(): number {
    return this._readyState
  }

  get protocol(): string {
    try {
      return this._peer.get_selected_protocol()
    } catch {
      return ''
    }
  }

  get bufferedAmount(): number {
    try {
      return Number(this._peer.get_current_outbound_buffered_amount())
    } catch {
      return 0
    }
  }

  close(code = 1000, reason = ''): void {
    if (
      this._readyState === ReadyState.CLOSING ||
      this._readyState === ReadyState.CLOSED
    ) {
      return
    }

    this._readyState = ReadyState.CLOSING
    this._peer.close(Math.trunc(Number(code)), String(reason))
    this._poll()
  }

  send(data: GodotWebSocketData): void {
    if (this._readyState === ReadyState.CONNECTING) {
      throw new Error('WebSocket is still connecting.')
    }
    if (this._readyState !== ReadyState.OPEN) {
      return
    }

    if (typeof data === 'string') {
      this._sendText(data)
      return
    }

    if (data instanceof GodotBlob) {
      void this._sendBlob(data)
      return
    }

    const body = data instanceof Uint8Array ? data : data.slice(0)
    this._sendBinary(body)
  }

  private async _sendBlob(blob: GodotBlob): Promise<void> {
    if (this._readyState !== ReadyState.OPEN) {
      return
    }

    const body = await bodyInitToArrayBuffer(blob)
    if (this._readyState === ReadyState.OPEN) {
      this._sendBinary(body)
    }
  }

  private _sendText(data: string): void {
    const error = this._peer.send_text(data)
    if (error !== 0) {
      this._handleError(`send_text failed (${error})`)
    }
  }

  private _sendBinary(data: Uint8Array | ArrayBuffer): void {
    if (this._readyState !== ReadyState.OPEN) {
      return
    }

    const error = this._peer.send(data, WriteMode.WRITE_MODE_BINARY)
    if (error !== 0) {
      this._handleError(`send failed (${error})`)
    }
  }

  private _startPolling(): void {
    if (this._pollIntervalId !== null) {
      return
    }

    this._pollIntervalId = setGodotInterval(() => {
      this._poll()
    }, POLL_INTERVAL_MS)
  }

  private _stopPolling(): void {
    if (this._pollIntervalId === null) {
      return
    }

    clearGodotInterval(this._pollIntervalId)
    this._pollIntervalId = null
  }

  private _poll(): void {
    if (this._readyState === ReadyState.CLOSED) {
      this._stopPolling()
      return
    }

    try {
      this._peer.poll()
      this._syncState()
      if (this._readyState === ReadyState.CLOSED) {
        return
      }
      this._readPackets()
    } catch (error) {
      this._handleError(error instanceof Error ? error.message : String(error))
    }
  }

  private _syncState(): void {
    const peerState = this._peer.get_ready_state()

    if (
      peerState === GodotPeerState.STATE_OPEN &&
      this._readyState === ReadyState.CONNECTING
    ) {
      this._readyState = ReadyState.OPEN
      this._emit('open', new GodotEvent('open'))
      return
    }

    if (peerState === GodotPeerState.STATE_CLOSING) {
      this._readyState = ReadyState.CLOSING
      return
    }

    if (peerState === GodotPeerState.STATE_CLOSED) {
      this._readyState = ReadyState.CLOSED
      this._stopPolling()
      this._dispatchClose(
        Number(this._peer.get_close_code()),
        this._peer.get_close_reason(),
        this._peer.get_close_code() !== -1,
      )
    }
  }

  private _readPackets(): void {
    while (this._peer.get_available_packet_count() > 0) {
      const packet = this._peer.get_packet()
      const buffer = packetToArrayBuffer(packet)

      if (this._peer.was_string_packet()) {
        this._emit(
          'message',
          new GodotMessageEvent('message', {
            data: new GodotTextDecoder().decode(buffer),
          }),
        )
      } else {
        this._emit(
          'message',
          new GodotMessageEvent('message', {
            data:
              this.binaryType === 'arraybuffer'
                ? buffer
                : GodotBlob._fromBuffer(buffer, 'application/octet-stream'),
          }),
        )
      }
    }
  }

  private _handleError(message: string): void {
    this._emit('error', new GodotEvent('error'))
    this._readyState = ReadyState.CLOSED
    this._stopPolling()
    this._dispatchClose(1006, message, false)
  }

  private _dispatchClose(
    code: number,
    reason: string,
    wasClean: boolean,
  ): void {
    if (this._closeDispatched) {
      return
    }

    this._closeDispatched = true
    this._emit(
      'close',
      new GodotCloseEvent('close', {
        code,
        reason,
        wasClean,
      }),
    )
  }

  private _emit(type: string, event: GodotEvent): void {
    switch (type) {
      case 'open':
        this.onopen?.(event)
        break
      case 'message':
        if (event instanceof GodotMessageEvent) {
          this.onmessage?.(event)
        }
        break
      case 'error':
        this.onerror?.(event)
        break
      case 'close':
        if (event instanceof GodotCloseEvent) {
          this.onclose?.(event)
        }
        break
    }
    this.dispatchEvent(event)
  }
}
