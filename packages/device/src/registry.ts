import {
  DeviceCapabilityError,
  createDeviceCapabilityError,
  isDeviceCapabilityError,
} from './errors.js'
import type {
  DeviceCapabilityAdapter,
  DeviceCapabilityName,
  DeviceCapabilityState,
  DeviceCapabilityStatus,
} from './types.js'

function statusForError(
  capability: DeviceCapabilityName,
  error: unknown,
): DeviceCapabilityStatus {
  if (isDeviceCapabilityError(error)) {
    return {
      capability: error.capability,
      state: error.code,
      message: error.message,
    }
  }

  return {
    capability,
    state: 'unsupported-platform',
    message:
      error instanceof Error
        ? error.message
        : `Capability "${capability}" failed support detection.`,
  }
}

function errorForStatus(status: DeviceCapabilityStatus) {
  if (status.state === 'supported') {
    return null
  }

  return createDeviceCapabilityError(status.state, status.capability, {
    message: status.message,
  })
}

function normalizeStatus<TName extends DeviceCapabilityName>(
  capability: TName,
  adapter: DeviceCapabilityAdapter<TName>,
  status: DeviceCapabilityStatus<TName>,
): DeviceCapabilityStatus<TName> {
  const pluginName = status.pluginName ?? adapter.pluginName
  const normalized = {
    capability: status.capability ?? capability,
    state: status.state,
    message: status.message,
  }
  return pluginName ? { ...normalized, pluginName } : normalized
}

export class DeviceCapabilityRegistry {
  private readonly adapters = new Map<
    DeviceCapabilityName,
    DeviceCapabilityAdapter
  >()

  register<TName extends DeviceCapabilityName>(
    adapter: DeviceCapabilityAdapter<TName>,
  ): () => void {
    this.adapters.set(adapter.capability, adapter)
    return () => {
      this.unregister(adapter.capability, adapter)
    }
  }

  unregister<TName extends DeviceCapabilityName>(
    capability: TName,
    adapter?: DeviceCapabilityAdapter<TName>,
  ): boolean {
    if (adapter && this.adapters.get(capability) !== adapter) {
      return false
    }
    return this.adapters.delete(capability)
  }

  clear(): void {
    this.adapters.clear()
  }

  getAdapter<TName extends DeviceCapabilityName>(
    capability: TName,
  ): DeviceCapabilityAdapter<TName> | null {
    const adapter = this.adapters.get(capability)
    return (adapter as DeviceCapabilityAdapter<TName> | undefined) ?? null
  }

  async getStatus<TName extends DeviceCapabilityName>(
    capability: TName,
  ): Promise<DeviceCapabilityStatus<TName>> {
    const adapter = this.getAdapter(capability)

    if (!adapter) {
      return {
        capability,
        state: 'missing-plugin',
        message: `No adapter or native plugin is registered for device capability "${capability}".`,
      }
    }

    if (adapter.getStatus) {
      try {
        return normalizeStatus(capability, adapter, await adapter.getStatus())
      } catch (error) {
        return statusForError(capability, error) as DeviceCapabilityStatus<TName>
      }
    }

    if (adapter.isSupported) {
      try {
        const supported = await adapter.isSupported()
        return {
          capability,
          state: supported ? 'supported' : 'unsupported-platform',
          ...(adapter.pluginName ? { pluginName: adapter.pluginName } : {}),
        }
      } catch (error) {
        return statusForError(capability, error) as DeviceCapabilityStatus<TName>
      }
    }

    return {
      capability,
      state: 'supported',
      ...(adapter.pluginName ? { pluginName: adapter.pluginName } : {}),
    }
  }

  async isSupported(capability: DeviceCapabilityName): Promise<boolean> {
    const status = await this.getStatus(capability)
    return status.state === 'supported'
  }

  async requireCapability<TName extends DeviceCapabilityName>(
    capability: TName,
  ): Promise<DeviceCapabilityStatus<TName>> {
    const status = await this.getStatus(capability)
    const error = errorForStatus(status)

    if (error) {
      throw error
    }

    return status
  }
}

export const deviceCapabilities = new DeviceCapabilityRegistry()

export function registerDeviceCapability<TName extends DeviceCapabilityName>(
  adapter: DeviceCapabilityAdapter<TName>,
) {
  return deviceCapabilities.register(adapter)
}

export function unregisterDeviceCapability<TName extends DeviceCapabilityName>(
  capability: TName,
  adapter?: DeviceCapabilityAdapter<TName>,
) {
  return deviceCapabilities.unregister(capability, adapter)
}

export function getCapabilityStatus<TName extends DeviceCapabilityName>(
  capability: TName,
) {
  return deviceCapabilities.getStatus(capability)
}

export function isSupported(capability: DeviceCapabilityName) {
  return deviceCapabilities.isSupported(capability)
}

export function requireCapability<TName extends DeviceCapabilityName>(
  capability: TName,
) {
  return deviceCapabilities.requireCapability(capability)
}

export function normalizeDeviceCapabilityError(
  capability: DeviceCapabilityName,
  error: unknown,
): DeviceCapabilityError {
  if (isDeviceCapabilityError(error)) {
    return error
  }

  return createDeviceCapabilityError('unsupported-platform', capability, {
    cause: error,
    message:
      error instanceof Error
        ? error.message
        : `Device capability "${capability}" failed with an unknown error.`,
  })
}

export type { DeviceCapabilityState }
