import { defineComponent, h, ref, watch } from '@vue/runtime-core'
import { ResourceLoader } from 'godot'
import { resolveAssetPath } from '../utils/assetResolver'

/**
 * <Img> — image display component.
 *
 * Maps to a Godot TextureRect node. Resolves web-style `src` paths
 * to Godot resource paths and loads the texture automatically.
 *
 * Usage:
 *   <Img src="./assets/logo.png" />
 *   <Img src="res://icon.svg" :style="{ width: 64, height: 64 }" />
 */
export const Img = defineComponent({
  name: 'Img',
  props: {
    src: {
      type: String,
      required: true,
    },
    // TODO: fit prop → TextureRect.expand_mode / stretch_mode
  },
  setup(props) {
    const texture = ref<any>(null)

    watch(
      () => props.src,
      (src) => {
        if (!src) {
          texture.value = null
          return
        }
        const path = resolveAssetPath(src)
        texture.value = ResourceLoader.load(path)
      },
      { immediate: true },
    )

    return () =>
      h('TextureRect', {
        texture: texture.value,
        // TODO: apply width/height from style as custom_minimum_size
        // TODO: map fit/object-fit to expand_mode / stretch_mode
      })
  },
})
