import { shallowRef, watch, type ShallowRef } from '@vue/runtime-core'
import type { Texture2D } from 'godot'
import { resolveBackgroundImageSource } from './backgroundStyle.js'
import type { HtmlStyle } from './styleMapping.js'
import { loadTexture } from './textureLoader.js'

export function useBackgroundTexture(
  resolveStyle: () => HtmlStyle | undefined,
  componentName: string,
): ShallowRef<Texture2D | null> {
  const texture = shallowRef<Texture2D | null>(null)
  let loadVersion = 0

  watch(
    () => resolveBackgroundImageSource(resolveStyle()?.backgroundImage),
    async (src) => {
      const version = ++loadVersion
      if (!src) {
        texture.value = null
        return
      }

      try {
        const loaded = await loadTexture(src)
        if (version === loadVersion) {
          texture.value = loaded
        }
      } catch (error) {
        if (version === loadVersion) {
          texture.value = null
        }
        console.warn(
          `[vue-godot/html] Unable to load backgroundImage on <${componentName}> from ${src}:`,
          error,
        )
      }
    },
    { immediate: true },
  )

  return texture
}
