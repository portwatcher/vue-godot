import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import {
  collectHtmlTagMirrorErrors,
  collectPublicSurfaceAuditErrors,
} from '../scripts/public-surface-audit.mjs'

const repoRoot = process.cwd()

function readDoc(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf-8')
}

function readJson(relativePath) {
  return JSON.parse(readDoc(relativePath))
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function assertPatterns(relativePath, patterns) {
  const source = readDoc(relativePath)

  for (const pattern of patterns) {
    assert.match(
      source,
      pattern,
      `${relativePath} must include ${pattern.toString()}`,
    )
  }
}

test('public surface audit passes for package READMEs, docs, templates, and demos', () => {
  assert.deepEqual(collectPublicSurfaceAuditErrors(), [])
})

test('public surface audit detects stale htmlTags mirrors', () => {
  const source = [
    'const htmlTags = [',
    "  'div',",
    "  'div',",
    "  'legacytag',",
    ']',
  ].join('\n')

  const errors = collectHtmlTagMirrorErrors('fixture/vite.config.ts', source, [
    'button',
    'div',
    'span',
  ]).join('\n')

  assert.match(errors, /htmlTags contains duplicate div/)
  assert.match(errors, /htmlTags is missing button, span/)
  assert.match(errors, /htmlTags contains unexpected legacytag/)
})

test('root README links public support docs, packages, and checked-in examples', () => {
  assertPatterns('README.md', [
    /SDK for building Godot interfaces with Vue Single File\s+Components/,
    /Vue custom renderer, HTML-like Godot components, browser API\s+polyfills, native capability adapter contracts, and project tooling/,
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
})

test('package READMEs link compatibility docs and document their public surface', () => {
  const packages = [
    {
      path: 'packages/runtime-tscn/README.md',
      patterns: [
        /docs\/compatibility\.md/,
        /docs\/runtime\.md/,
        /Render Vue components into Godot scene nodes/,
        /Runtime Diagnostics/,
        /Prop Removal \/ Unset Semantics/,
      ],
    },
    {
      path: 'packages/html/README.md',
      patterns: [
        /docs\/compatibility\.md/,
        /^## Provided APIs/m,
        /htmlPlugin/,
        /htmlTags/,
        /<SafeAreaView>/,
        /<KeyboardAvoidingView>/,
        /<VirtualList>/,
        /<CameraView>/,
      ],
    },
    {
      path: 'packages/browser/README.md',
      patterns: [
        /docs\/compatibility\.md/,
        /docs\/permissions\.md/,
        /^## Provided APIs/m,
        /installBrowserAPIs/,
        /navigator\.permissions\.query\(\)/,
        /navigator\.geolocation/,
        /navigator\.mediaDevices\.getUserMedia\(\)/,
        /navigator\.vibrate\(\)/,
        /Notification/,
      ],
    },
    {
      path: 'packages/device/README.md',
      patterns: [
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
      ],
    },
    {
      path: 'packages/cli/README.md',
      patterns: [
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
      ],
    },
  ]

  for (const { path: relativePath, patterns } of packages) {
    assertPatterns(relativePath, patterns)
  }
})

test('package READMEs document npm package names and exported subpaths', () => {
  for (const packageDir of [
    'packages/runtime-tscn',
    'packages/html',
    'packages/browser',
    'packages/device',
    'packages/cli',
  ]) {
    const packageJson = readJson(`${packageDir}/package.json`)
    const readme = readDoc(`${packageDir}/README.md`)
    const packageName = packageJson.name

    assert.match(
      readme,
      new RegExp(escapeRegExp(packageName)),
      `${packageDir}/README.md must name ${packageName}`,
    )

    for (const subpath of Object.keys(packageJson.exports ?? {})) {
      if (subpath === '.') {
        continue
      }

      const specifier = `${packageName}${subpath.slice(1)}`
      assert.match(
        readme,
        new RegExp(escapeRegExp(specifier)),
        `${packageDir}/README.md must document exported subpath ${specifier}`,
      )
    }
  }
})

test('generated project docs and Vite template preserve export-ready defaults', () => {
  assertPatterns('packages/cli/templates/docs/production.md', [
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

  assertPatterns('packages/cli/templates/vue/vite.config.ts', [
    /isNativeTag: \(\) => false/,
    /isCustomElement: \(tag\) => tag\[0\] === tag\[0\]\.toUpperCase\(\)/,
    /alias: { vue: '@vue\/runtime-core' }/,
    /entry: 'vue\/src\/main\.ts'/,
    /formats: \['cjs'\]/,
    /fileName: \(\) => 'app\.js'/,
    /external: \['godot'\]/,
    /chunkFileNames: 'chunks\/\[name\]\.js'/,
  ])
})

test('serious example READMEs document their SDK coverage and smoke commands', () => {
  const examples = ['apps/native-app-demo/README.md', 'apps/game-ui-demo/README.md']

  for (const relativePath of examples) {
    assertPatterns(relativePath, [
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
})

test('experimental wording remains while final release gates are still open', () => {
  assertPatterns('TODO.md', [
    /- \[x\] `npm run check` passes locally and in CI/,
    /- \[x\] Godot smoke, generated Godot smoke, and editor reload smoke pass in CI for every release candidate/,
    /- \[ \] Android and iOS export smoke apps run on real or hosted devices for the production profile/,
    /- \[ \] The wording "not production ready", "alpha", and "experimental" is removed only after all criteria above are satisfied/,
    /Android\/iOS release device\s+evidence, Release Preflight evidence, and final public wording removal are\s+still incomplete/,
  ])

  assertPatterns('README.md', [/experimental and not production ready yet/])
  assertPatterns('docs/compatibility.md', [/project is still experimental/])
  assertPatterns('docs/production.md', [/Vue Godot is still experimental/])
})
