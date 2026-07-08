import { isSecureStorageAdapter } from './adapterGuards.js'
import type { SecureStorageAdapter } from './adapters.js'
import { createDeviceCapabilityError } from './errors.js'
import { deviceCapabilities, requireCapability } from './registry.js'

export function getRegisteredSecureStorageAdapter(): SecureStorageAdapter | null {
  const adapter = deviceCapabilities.getAdapter('secure-storage')
  return isSecureStorageAdapter(adapter) ? adapter : null
}

async function requireSecureStorageAdapter(): Promise<SecureStorageAdapter> {
  const adapter = getRegisteredSecureStorageAdapter()
  if (!adapter) {
    throw createDeviceCapabilityError('missing-plugin', 'secure-storage', {
      message:
        'No secure storage adapter is registered. Register a @vue-godot/device SecureStorageAdapter before storing secrets.',
    })
  }

  await requireCapability('secure-storage')
  return adapter
}

export async function getSecureItem(key: string): Promise<string | null> {
  const adapter = await requireSecureStorageAdapter()
  const value = await adapter.getItem(String(key))
  return typeof value === 'string' ? value : null
}

export async function setSecureItem(
  key: string,
  value: string,
): Promise<void> {
  const adapter = await requireSecureStorageAdapter()
  await adapter.setItem(String(key), String(value))
}

export async function removeSecureItem(key: string): Promise<void> {
  const adapter = await requireSecureStorageAdapter()
  await adapter.removeItem(String(key))
}
