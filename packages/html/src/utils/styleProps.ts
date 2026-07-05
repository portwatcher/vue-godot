import type { PropType } from '@vue/runtime-core'
import type { HtmlStyleInput } from './styleMapping.js'

export const htmlStyleProp = {
  type: [Object, String, Array] as PropType<HtmlStyleInput>,
  default: undefined,
}
