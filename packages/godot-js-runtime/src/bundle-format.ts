/**
 * Deterministic metadata read by the native loader when a CommonJS bundle uses
 * the otherwise format-neutral `.js` extension.
 */
export const commonJsBundleBanner =
  '/*! godot-js-runtime:format=commonjs */' as const
