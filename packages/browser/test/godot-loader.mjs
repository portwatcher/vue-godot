const GODOT_MOCK_URL = 'mock:godot'

export function resolve(specifier, context, nextResolve) {
  if (specifier === 'godot') {
    return { url: GODOT_MOCK_URL, shortCircuit: true }
  }
  return nextResolve(specifier, context)
}

export function load(url, context, nextLoad) {
  if (url === GODOT_MOCK_URL) {
    return {
      format: 'module',
      shortCircuit: true,
      source: `
        export class HTTPClient {
          blocking_mode_enabled = false
        }

        export class SceneTree {}

        export const Engine = {
          get_main_loop() {
            return null
          },
        }

        export const TLSOptions = {
          client() {
            return { __mock: true, __kind: 'tls-options' }
          },
        }
      `,
    }
  }

  return nextLoad(url, context)
}
