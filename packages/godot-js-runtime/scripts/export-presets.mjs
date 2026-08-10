import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptPath = fileURLToPath(import.meta.url)
const packageRoot = path.resolve(path.dirname(scriptPath), '..')
const repositoryRoot = path.resolve(packageRoot, '../..')

export const exportSmokeFeature = 'godotjs_export_smoke'
const exportApplicationResources = [
  'dist/*.js',
  'dist/**/*.js',
  'dist/*.mjs',
  'dist/**/*.mjs',
  'dist/*.cjs',
  'dist/**/*.cjs',
  'dist/*.json',
  'dist/**/*.json',
  'dist/*.js.map',
  'dist/**/*.js.map',
].join(',')

export const exportApplications = Object.freeze([
  Object.freeze({
    id: 'standalone',
    name: 'GodotJS Smoke',
    slug: 'godotjs-smoke',
    bundleId: 'org.vuegodot.javascript.runtime.smoke',
    root: path.join(repositoryRoot, 'apps/godotjs-demo'),
  }),
  Object.freeze({
    id: 'vue',
    name: 'Vue Godot Native App Demo',
    slug: 'vue-godot-native-app',
    bundleId: 'org.vuegodot.nativeappdemo',
    root: path.join(repositoryRoot, 'apps/native-app-demo'),
  }),
])

export const exportPlatformPresets = Object.freeze([
  Object.freeze({
    id: 'macos',
    name: 'macOS',
    platform: 'macOS',
    extension: '.zip',
    modes: Object.freeze(['debug', 'release']),
  }),
  Object.freeze({
    id: 'windows',
    name: 'Windows',
    platform: 'Windows Desktop',
    extension: '.exe',
    modes: Object.freeze(['debug', 'release']),
  }),
  Object.freeze({
    id: 'linux',
    name: 'Linux',
    platform: 'Linux/X11',
    extension: '.x86_64',
    modes: Object.freeze(['debug', 'release']),
  }),
  Object.freeze({
    id: 'android',
    name: 'Android Debug',
    releaseName: 'Android Release',
    platform: 'Android',
    extension: '.apk',
    modes: Object.freeze(['debug', 'release']),
  }),
  Object.freeze({
    id: 'ios',
    name: 'iOS',
    platform: 'iOS',
    extension: '',
    modes: Object.freeze(['debug', 'release']),
  }),
  Object.freeze({
    id: 'web',
    name: 'Web',
    platform: 'Web',
    extension: '.html',
    modes: Object.freeze(['debug', 'release']),
  }),
])

function quoted(value) {
  return JSON.stringify(value)
}

function presetHeader(index, name, platform, exportPath, runnable = true) {
  return `[preset.${String(index)}]

name=${quoted(name)}
platform=${quoted(platform)}
runnable=${String(runnable)}
dedicated_server=false
custom_features=${quoted(exportSmokeFeature)}
export_filter=${quoted('all_resources')}
include_filter=${quoted(exportApplicationResources)}
exclude_filter=${quoted('android/**,build/**')}
export_path=${quoted(exportPath)}
encryption_include_filters=${quoted('')}
encryption_exclude_filters=${quoted('')}
encrypt_pck=false
encrypt_directory=false
script_export_mode=2

[preset.${String(index)}.options]

custom_template/debug=${quoted('')}
custom_template/release=${quoted('')}`
}

function outputPath(application, platform, mode = undefined) {
  const modeSegment = mode ? `/${mode}` : ''
  return `build/exports/${platform.id}${modeSegment}/${application.slug}${platform.extension}`
}

function platformOptions(application, platform, mode = undefined) {
  switch (platform.id) {
    case 'macos':
      return `
binary_format/architecture=${quoted('universal')}
application/bundle_identifier=${quoted(application.bundleId)}`
    case 'windows':
    case 'linux':
      return `
binary_format/architecture=${quoted('x86_64')}
binary_format/embed_pck=false`
    case 'android':
      return `
gradle_build/use_gradle_build=false
gradle_build/export_format=0
architectures/armeabi-v7a=false
architectures/arm64-v8a=true
architectures/x86=false
architectures/x86_64=true
package/unique_name=${quoted(application.bundleId)}
package/name=${quoted(application.name)}
package/signed=${String(mode === 'debug')}
permissions/internet=true`
    case 'ios':
      return `
architectures/arm64=true
application/app_store_team_id=${quoted('VUEGODOT00')}
application/bundle_identifier=${quoted(application.bundleId)}
application/short_version=${quoted('1.0.0')}
application/version=${quoted('1.0.0')}
application/min_ios_version=${quoted('14.0')}
application/export_project_only=true
application/delete_old_export_files_unconditionally=true
icons/icon_1024x1024=${quoted('res://icon.svg')}
icons/icon_1024x1024_dark=${quoted('')}
icons/icon_1024x1024_tinted=${quoted('')}`
    case 'web':
      return `
variant/extensions_support=true
variant/thread_support=true
vram_texture_compression/for_desktop=true
vram_texture_compression/for_mobile=false
html/export_icon=false
html/canvas_resize_policy=2
html/focus_canvas_on_start=true
progressive_web_app/enabled=false`
    default:
      throw new Error(`Unsupported export platform: ${platform.id}`)
  }
}

export function presetName(platform, mode) {
  if (platform.id === 'android') {
    return mode === 'release' ? platform.releaseName : platform.name
  }
  return platform.name
}

export function exportOutputPath(application, platform, mode) {
  return outputPath(
    application,
    platform,
    platform.id === 'android' ? mode : undefined,
  )
}

export function generateExportPresets(application) {
  const sections = []
  let index = 0
  for (const platform of exportPlatformPresets) {
    const modes = platform.id === 'android' ? platform.modes : [undefined]
    for (const mode of modes) {
      const name = presetName(platform, mode ?? 'debug')
      sections.push(
        `${presetHeader(
          index,
          name,
          platform.platform,
          outputPath(application, platform, mode),
          mode !== 'release',
        )}${platformOptions(application, platform, mode)}\n`,
      )
      index += 1
    }
  }
  return `; Generated by packages/godot-js-runtime/scripts/export-presets.mjs.
; Run npm run generate:export-presets after changing the canonical matrix.

${sections.join('\n')}`
}

export function writeExportPresets({ check = false } = {}) {
  const stale = []
  for (const application of exportApplications) {
    const destination = path.join(application.root, 'export_presets.cfg')
    const expected = generateExportPresets(application)
    if (check) {
      if (
        !fs.existsSync(destination) ||
        fs.readFileSync(destination, 'utf-8') !== expected
      ) {
        stale.push(path.relative(repositoryRoot, destination))
      }
      continue
    }
    fs.writeFileSync(destination, expected)
  }
  if (stale.length > 0) {
    throw new Error(`Generated export presets are stale: ${stale.join(', ')}`)
  }
}

function main() {
  const arguments_ = process.argv.slice(2)
  const unknown = arguments_.filter((argument) => argument !== '--check')
  if (unknown.length > 0) {
    throw new Error(`Unknown option(s): ${unknown.join(', ')}`)
  }
  const check = arguments_.includes('--check')
  writeExportPresets({ check })
  console.log(
    check
      ? '[export-presets] generated files are current'
      : `[export-presets] wrote ${String(exportApplications.length)} application matrices`,
  )
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}
