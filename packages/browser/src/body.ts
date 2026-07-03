import { GodotBlob } from './blob.js'
import { GodotTextDecoder, GodotTextEncoder } from './encoding.js'

export type GodotBodyInit = string | ArrayBuffer | Uint8Array | GodotBlob

export function cloneArrayBuffer(buffer: ArrayBuffer): ArrayBuffer {
  return buffer.slice(0) as ArrayBuffer
}

export function cloneBodyInit(body: GodotBodyInit): GodotBodyInit {
  if (typeof body === 'string') {
    return body
  }
  if (body instanceof ArrayBuffer) {
    return cloneArrayBuffer(body)
  }
  if (body instanceof Uint8Array) {
    return new Uint8Array(body)
  }
  return body.slice(0, body.size, body.type)
}

export async function bodyInitToArrayBuffer(
  body: GodotBodyInit,
): Promise<ArrayBuffer> {
  if (typeof body === 'string') {
    return new GodotTextEncoder().encode(body).buffer as ArrayBuffer
  }
  if (body instanceof ArrayBuffer) {
    return cloneArrayBuffer(body)
  }
  if (body instanceof Uint8Array) {
    return body.buffer.slice(
      body.byteOffset,
      body.byteOffset + body.byteLength,
    ) as ArrayBuffer
  }
  return body.arrayBuffer()
}

export function decodeBodyBuffer(buffer: ArrayBuffer): string {
  return new GodotTextDecoder().decode(buffer)
}
