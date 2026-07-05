// @ts-check
/**
 * Volar language-service plugin for @vue-godot/html.
 *
 * Overrides the template compiler's `isNativeTag` so Volar does not treat
 * lowercase HTML tags (<div>, <button>, …) as native browser elements.
 * This lets GlobalComponents augmentation take effect for both PascalCase
 * and lowercase tag names.
 *
 * Usage – add to vue/tsconfig.json:
 *   "vueCompilerOptions": {
 *     "plugins": ["@vue-godot/html/volar-plugin"]
 *   }
 */

const htmlTags = [
  'a',
  'activityindicator',
  'audio',
  'dialog',
  'div',
  'img',
  'span',
  'button',
  'input',
  'modal',
  'textarea',
  'select',
  'option',
  'overlay',
  'pressable',
  'progress',
  'scrollview',
  'switch',
  'canvas',
  'video',
  'svg',
]

/** @returns {import('@volar/language-service').VueLanguagePlugin} */
module.exports = () => {
  return {
    name: '@vue-godot/html',
    version: 2.1,
    resolveTemplateCompilerOptions(options) {
      return {
        ...options,
        // Nothing is a native platform element in Godot.
        isNativeTag: () => false,
        // For the IDE, resolve ALL tags through GlobalComponents so both
        // Godot nodes and @vue-godot/html components get full type info.
        // (The build-time isCustomElement in vite.config.ts handles the
        // actual custom-element pass-through for the compiler output.)
        isCustomElement: () => false,
      }
    },
  }
}
