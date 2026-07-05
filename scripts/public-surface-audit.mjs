import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readJson, releasePackageConfigs, repoRoot } from './release-utils.mjs'

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf-8')
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function recordMissingPatterns(errors, relativePath, patterns) {
  const source = readText(relativePath)

  for (const pattern of patterns) {
    if (!pattern.test(source)) {
      errors.push(`${relativePath} must include ${pattern.toString()}`)
    }
  }
}

function readHtmlComponentNames() {
  const pluginSource = readText('packages/html/src/plugin.ts')
  const match = pluginSource.match(
    /const components: Record<string, Component> = \{([\s\S]*?)\n\}/,
  )
  if (!match) {
    return {
      components: [],
      errors: ['Unable to locate @vue-godot/html component registry'],
    }
  }

  return {
    components: match[1]
      .split('\n')
      .map((line) => line.trim().replace(/,$/, ''))
      .filter((line) => /^[A-Z][A-Za-z0-9]*$/.test(line))
      .sort(),
    errors: [],
  }
}

function checkPackageReadmes(errors) {
  for (const config of releasePackageConfigs) {
    const packageJson = readJson(path.join(config.dir, 'package.json'))
    const readmePath = `${config.dir}/README.md`
    const readme = readText(readmePath)

    if (!new RegExp(escapeRegExp(packageJson.name)).test(readme)) {
      errors.push(`${readmePath} must name ${packageJson.name}`)
    }

    for (const subpath of Object.keys(packageJson.exports ?? {})) {
      if (subpath === '.') {
        continue
      }

      const specifier = `${packageJson.name}${subpath.slice(1)}`
      if (!new RegExp(escapeRegExp(specifier)).test(readme)) {
        errors.push(`${readmePath} must document exported subpath ${specifier}`)
      }
    }

    for (const binName of Object.keys(packageJson.bin ?? {})) {
      if (!new RegExp(escapeRegExp(binName)).test(readme)) {
        errors.push(`${readmePath} must document CLI binary ${binName}`)
      }
    }
  }
}

function checkHtmlSurface(errors) {
  const { components, errors: registryErrors } = readHtmlComponentNames()
  errors.push(...registryErrors)
  if (registryErrors.length > 0) {
    return
  }

  const htmlReadme = readText('packages/html/README.md')
  const compatibility = readText('docs/compatibility.md')
  const htmlDemo = readText('apps/html-demo/vue/src/App.vue')

  for (const componentName of components) {
    const tagPattern = new RegExp(`<${escapeRegExp(componentName)}\\b`)
    if (!tagPattern.test(htmlReadme)) {
      errors.push(`packages/html/README.md must document <${componentName}>`)
    }
    if (!tagPattern.test(compatibility)) {
      errors.push(`docs/compatibility.md must document <${componentName}>`)
    }
    if (!tagPattern.test(htmlDemo)) {
      errors.push(`apps/html-demo/vue/src/App.vue must render <${componentName}>`)
    }
  }
}

export function collectPublicSurfaceAuditErrors() {
  const errors = []

  recordMissingPatterns(errors, 'README.md', [
    /docs\/compatibility\.md/,
    /docs\/production\.md/,
    /docs\/permissions\.md/,
    /docs\/plugins\.md/,
    /docs\/real-device-release\.md/,
    /docs\/routing\.md/,
    /docs\/runtime\.md/,
    /docs\/migration\.md/,
    /docs\/troubleshooting\.md/,
    /docs\/roadmap\.md/,
    /packages\/runtime-tscn\/README\.md/,
    /packages\/html\/README\.md/,
    /packages\/browser\/README\.md/,
    /packages\/device\/README\.md/,
    /packages\/cli\/README\.md/,
    /apps\/html-demo/,
    /apps\/native-app-demo/,
    /apps\/game-ui-demo/,
    /docs\/example-apps\.md/,
  ])

  recordMissingPatterns(errors, 'packages/runtime-tscn/README.md', [
    /docs\/compatibility\.md/,
    /docs\/runtime\.md/,
    /Render Vue components into Godot scene nodes/,
    /Runtime Diagnostics/,
    /Prop Removal \/ Unset Semantics/,
  ])
  recordMissingPatterns(errors, 'packages/html/README.md', [
    /docs\/compatibility\.md/,
    /^## Provided APIs/m,
    /htmlPlugin/,
    /htmlTags/,
    /<SafeAreaView>/,
    /<KeyboardAvoidingView>/,
    /<VirtualList>/,
    /<CameraView>/,
  ])
  recordMissingPatterns(errors, 'packages/browser/README.md', [
    /docs\/compatibility\.md/,
    /docs\/permissions\.md/,
    /^## Provided APIs/m,
    /installBrowserAPIs/,
    /navigator\.permissions\.query\(\)/,
    /navigator\.geolocation/,
    /navigator\.mediaDevices\.getUserMedia\(\)/,
    /navigator\.vibrate\(\)/,
    /Notification/,
  ])
  recordMissingPatterns(errors, 'packages/device/README.md', [
    /docs\/compatibility\.md/,
    /docs\/permissions\.md/,
    /^## Provided APIs/m,
    /DeviceCapabilityRegistry/,
    /registerDeviceCapability\(adapter\)/,
    /isSupported\(capability\)/,
    /requireCapability\(capability\)/,
    /GeolocationAdapter/,
    /MediaDevicesAdapter/,
    /PermissionAdapter/,
  ])
  recordMissingPatterns(errors, 'packages/cli/README.md', [
    /docs\/compatibility\.md/,
    /vue-godot create app my-app/,
    /vue-godot create game-ui my-game-ui/,
    /--router/,
    /--storage/,
    /--network/,
    /--device-api/,
    /check:exports/,
    /doctor --exports-only/,
    /GlobalComponents/,
  ])

  checkPackageReadmes(errors)
  checkHtmlSurface(errors)

  recordMissingPatterns(errors, 'packages/cli/templates/docs/production.md', [
    /^# Production Export Guide/m,
    /npm run build/,
    /npm run check:exports/,
    /npx vue-godot doctor/,
    /dist\/app\.js/,
    /dist\/chunks\/\*\.js/,
    /android\.permission\.INTERNET/,
    /android\.permission\.CAMERA/,
    /android\.permission\.RECORD_AUDIO/,
    /android\.permission\.VIBRATE/,
    /android\.permission\.POST_NOTIFICATIONS/,
    /android\.permission\.ACCESS_FINE_LOCATION/,
    /NSCameraUsageDescription/,
    /NSMicrophoneUsageDescription/,
    /NSLocationWhenInUseUsageDescription/,
    /NSPhotoLibraryUsageDescription/,
    /real device testing/,
  ])
  recordMissingPatterns(errors, 'packages/cli/templates/vue/vite.config.ts', [
    /isNativeTag: \(\) => false/,
    /isCustomElement: \(tag\) => tag\[0\] === tag\[0\]\.toUpperCase\(\)/,
    /alias: { vue: '@vue\/runtime-core' }/,
    /entry: 'vue\/src\/main\.ts'/,
    /formats: \['cjs'\]/,
    /fileName: \(\) => 'app\.js'/,
    /external: \['godot'\]/,
    /chunkFileNames: 'chunks\/\[name\]\.js'/,
  ])

  for (const relativePath of [
    'apps/native-app-demo/README.md',
    'apps/game-ui-demo/README.md',
  ]) {
    recordMissingPatterns(errors, relativePath, [
      /^## Production Readiness Coverage/m,
      /npm run build/,
      /npm run dev/,
      /npm run gen:types/,
      /GODOT_BIN=\/path\/to\/godot npm run smoke:godot/,
      /project\.godot/,
      /dist\/app\.js/,
      /app\.tscn/,
    ])
  }

  return errors
}

function main() {
  const errors = collectPublicSurfaceAuditErrors()

  if (errors.length > 0) {
    console.error('[public-surface] failed')
    for (const error of errors) {
      console.error(`- ${error}`)
    }
    process.exit(1)
  }

  console.log('[public-surface] passed')
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main()
}
