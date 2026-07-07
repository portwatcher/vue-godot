import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import {
  assembleGodotIosExportPackage,
  defaultGodotJsReleaseRepo,
  defaultGodotExportTemplatesRoot,
  defaultGodotJsAssetForPlatform,
  defaultGodotIosPackageSourceRef,
  defaultGodotIosPackageSourceRepo,
  godotJsReleaseAssetUrl,
  installGodotJsTemplateAsset,
  pinnedGodotJsRelease,
  resolveGodotJsSetupPlan,
} from '../scripts/setup-godotjs.mjs'

const repoRoot = process.cwd()

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf-8')
}

test('default GodotJS asset mapping covers supported CI and local platforms', () => {
  assert.equal(
    defaultGodotJsAssetForPlatform('darwin', 'arm64'),
    'prebuilt_macos_arm64_v8',
  )
  assert.equal(
    defaultGodotJsAssetForPlatform('linux', 'x64'),
    'prebuilt_linux_x64_v8',
  )
  assert.equal(
    defaultGodotJsAssetForPlatform('win32', 'x64'),
    'prebuilt_windows_x64_v8',
  )
})

test('default GodotJS asset mapping rejects unsupported platforms', () => {
  assert.throws(
    () => defaultGodotJsAssetForPlatform('freebsd', 'x64'),
    /No pinned GodotJS asset is configured for freebsd:x64/,
  )
})

test('GodotJS setup plan resolves pinned release, asset, cache paths, and URL', () => {
  const plan = resolveGodotJsSetupPlan({
    cacheDir: '.tmp-godot-cache',
    platform: 'darwin',
    arch: 'arm64',
  })

  assert.equal(plan.release, pinnedGodotJsRelease)
  assert.equal(plan.releaseRepo, defaultGodotJsReleaseRepo)
  assert.equal(plan.asset, 'prebuilt_macos_arm64_v8')
  assert.equal(plan.assetKind, 'editor')
  assert.equal(plan.cacheDir, path.join(repoRoot, '.tmp-godot-cache'))
  assert.equal(
    plan.assetDir,
    path.join(
      repoRoot,
      '.tmp-godot-cache',
      pinnedGodotJsRelease,
      'prebuilt_macos_arm64_v8',
    ),
  )
  assert.equal(
    plan.archivePath,
    path.join(plan.assetDir, 'prebuilt_macos_arm64_v8.zip'),
  )
  assert.equal(
    plan.url,
    'https://github.com/ialex32x/GodotJS-Build/releases/download/GodotJS_1.0.0-2/prebuilt_macos_arm64_v8.zip',
  )
  assert.equal(plan.url, godotJsReleaseAssetUrl(plan.release, plan.asset))
})

test('GodotJS setup plan supports alternate release repositories', () => {
  const plan = resolveGodotJsSetupPlan({
    asset: 'ios-template_debug-4.4-v8',
    assetKind: 'templates',
    cacheDir: '.tmp-godot-cache',
    release: 'v1.1.0-generate-typings',
    releaseRepo: 'godotjs/GodotJS',
  })

  assert.equal(plan.release, 'v1.1.0-generate-typings')
  assert.equal(plan.releaseRepo, 'godotjs/GodotJS')
  assert.equal(
    plan.url,
    'https://github.com/godotjs/GodotJS/releases/download/v1.1.0-generate-typings/ios-template_debug-4.4-v8.zip',
  )
})

test('GodotJS setup plan supports export template assets', () => {
  const plan = resolveGodotJsSetupPlan({
    asset: 'prebuilt_android_v8',
    assetKind: 'templates',
    cacheDir: '.tmp-godot-cache',
  })

  assert.equal(plan.release, pinnedGodotJsRelease)
  assert.equal(plan.asset, 'prebuilt_android_v8')
  assert.equal(plan.assetKind, 'templates')
  assert.equal(
    plan.assetDir,
    path.join(
      repoRoot,
      '.tmp-godot-cache',
      pinnedGodotJsRelease,
      'prebuilt_android_v8',
    ),
  )
  assert.equal(
    plan.url,
    'https://github.com/ialex32x/GodotJS-Build/releases/download/GodotJS_1.0.0-2/prebuilt_android_v8.zip',
  )
})

test('GodotJS setup plan rejects unknown asset kinds', () => {
  assert.throws(
    () => resolveGodotJsSetupPlan({ assetKind: 'runtime' }),
    /Unsupported GodotJS asset kind: runtime/,
  )
})

test('Godot export template root resolves platform user directories', () => {
  assert.equal(
    defaultGodotExportTemplatesRoot('darwin', {}, '/Users/dev'),
    path.join(
      '/Users/dev',
      'Library',
      'Application Support',
      'Godot',
      'export_templates',
    ),
  )
  assert.equal(
    defaultGodotExportTemplatesRoot('linux', {}, '/home/dev'),
    path.join('/home/dev', '.local', 'share', 'godot', 'export_templates'),
  )
  assert.equal(
    defaultGodotExportTemplatesRoot(
      'linux',
      { XDG_DATA_HOME: '/data/share' },
      '/home/dev',
    ),
    path.join('/data/share', 'godot', 'export_templates'),
  )
  assert.equal(
    defaultGodotExportTemplatesRoot(
      'win32',
      { APPDATA: 'C:\\Users\\dev\\AppData\\Roaming' },
      'C:\\Users\\dev',
    ),
    path.join('C:\\Users\\dev\\AppData\\Roaming', 'Godot', 'export_templates'),
  )
})

test('GodotJS template asset installation copies templates and version marker', () => {
  const tempRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vue-godot-templates-'),
  )
  try {
    const assetDir = path.join(tempRoot, 'asset')
    const templatesRoot = path.join(tempRoot, 'templates')
    const archivePath = path.join(assetDir, 'prebuilt_android_v8.zip')
    fs.mkdirSync(assetDir)
    fs.writeFileSync(path.join(assetDir, 'android_debug.apk'), 'debug')
    fs.writeFileSync(path.join(assetDir, 'android_release.apk'), 'release')
    fs.writeFileSync(path.join(assetDir, 'godot-lib.template_debug.aar'), 'aar')
    fs.writeFileSync(archivePath, 'archive')

    const install = installGodotJsTemplateAsset(
      { assetDir, archivePath },
      {
        templateVersion: '4.4.1.rc.custom_build.daa4b058e',
        templatesRoot,
      },
    )

    assert.deepEqual(install.entries, [
      'android_debug.apk',
      'android_release.apk',
      'godot-lib.template_debug.aar',
    ])
    assert.equal(
      install.templatesDir,
      path.join(templatesRoot, '4.4.1.rc.custom_build.daa4b058e'),
    )
    assert.equal(
      fs.readFileSync(path.join(install.templatesDir, 'version.txt'), 'utf-8'),
      '4.4.1.rc.custom_build.daa4b058e\n',
    )
    assert.equal(
      fs.readFileSync(
        path.join(install.templatesDir, 'android_release.apk'),
        'utf-8',
      ),
      'release',
    )
  } finally {
    fs.rmSync(tempRoot, { force: true, recursive: true })
  }
})

test('GodotJS template asset installation flattens single nested template directories', () => {
  const tempRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vue-godot-templates-'),
  )
  try {
    const assetDir = path.join(tempRoot, 'asset')
    const nestedDir = path.join(assetDir, 'ios-template_debug-4.4-v8')
    const templatesRoot = path.join(tempRoot, 'templates')
    const archivePath = path.join(assetDir, 'ios-template_debug-4.4-v8.zip')
    fs.mkdirSync(nestedDir, { recursive: true })
    fs.writeFileSync(
      path.join(nestedDir, 'libgodot.ios.template_debug.arm64.a'),
      'debug',
    )
    fs.writeFileSync(archivePath, 'archive')

    const install = installGodotJsTemplateAsset(
      { assetDir, archivePath },
      {
        templateVersion: '4.4.1.rc.custom_build.daa4b058e',
        templatesRoot,
      },
    )

    assert.deepEqual(install.entries, ['libgodot.ios.template_debug.arm64.a'])
    assert.equal(
      fs.readFileSync(
        path.join(install.templatesDir, 'libgodot.ios.template_debug.arm64.a'),
        'utf-8',
      ),
      'debug',
    )
    assert.equal(
      fs.existsSync(
        path.join(install.templatesDir, 'ios-template_debug-4.4-v8'),
      ),
      false,
    )
  } finally {
    fs.rmSync(tempRoot, { force: true, recursive: true })
  }
})

test('GodotJS setup assembles an iOS project export package from installed libraries', () => {
  const tempRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vue-godot-ios-package-'),
  )
  try {
    const templatesDir = path.join(tempRoot, 'templates')
    const sourceRoot = path.join(tempRoot, 'godot-source')
    const scaffoldDir = path.join(sourceRoot, 'misc', 'dist', 'ios_xcode')
    fs.mkdirSync(templatesDir, { recursive: true })
    fs.mkdirSync(path.join(scaffoldDir, 'godot_ios.xcodeproj'), {
      recursive: true,
    })
    fs.mkdirSync(path.join(scaffoldDir, 'godot_ios'), { recursive: true })
    fs.writeFileSync(
      path.join(templatesDir, 'libgodot.ios.template_debug.arm64.a'),
      'debug',
    )
    fs.writeFileSync(
      path.join(templatesDir, 'libgodot.ios.template_release.arm64.a'),
      'release',
    )
    fs.writeFileSync(
      path.join(scaffoldDir, 'godot_ios.xcodeproj', 'project.pbxproj'),
      'project',
    )
    fs.writeFileSync(
      path.join(scaffoldDir, 'godot_ios', 'godot_ios-Info.plist'),
      'plist',
    )
    fs.writeFileSync(path.join(scaffoldDir, 'data.pck'), 'pck')

    const calls = []
    const commandRunner = (command, args, options, label) => {
      calls.push({ command, args, cwd: options.cwd, label })
      if (command === 'xcodebuild') {
        const outputIndex = args.indexOf('-output')
        fs.mkdirSync(args[outputIndex + 1], { recursive: true })
        fs.writeFileSync(path.join(args[outputIndex + 1], 'Info.plist'), label)
      }
      if (command === 'zip') {
        fs.writeFileSync(args[2], 'zip')
      }
      return { status: 0, stdout: '', stderr: '' }
    }

    const result = assembleGodotIosExportPackage(templatesDir, {
      commandRunner,
      iosPackageSource: sourceRoot,
      log: () => {},
    })

    assert.equal(result.outputPath, path.join(templatesDir, 'ios.zip'))
    assert.equal(fs.readFileSync(result.outputPath, 'utf-8'), 'zip')
    assert.equal(result.scaffoldDir, scaffoldDir)
    assert.deepEqual(
      calls.map((call) => [call.command, call.label]),
      [
        ['xcodebuild', 'GodotJS iOS debug xcframework creation'],
        ['xcodebuild', 'GodotJS iOS release xcframework creation'],
        ['zip', 'GodotJS iOS export package zip'],
      ],
    )
    assert.match(calls[0].args.join(' '), /template_debug\.arm64\.a/)
    assert.match(calls[1].args.join(' '), /template_release\.arm64\.a/)
    assert.equal(
      path.basename(calls[2].cwd).startsWith('vue-godot-ios-zip-'),
      true,
    )
  } finally {
    fs.rmSync(tempRoot, { force: true, recursive: true })
  }
})

test('GodotJS iOS package assembly requires installed debug and release libraries', () => {
  const tempRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vue-godot-ios-package-'),
  )
  try {
    const templatesDir = path.join(tempRoot, 'templates')
    fs.mkdirSync(templatesDir)

    assert.throws(
      () =>
        assembleGodotIosExportPackage(templatesDir, {
          iosPackageSource: tempRoot,
          log: () => {},
        }),
      /GodotJS iOS debug library is missing/,
    )
  } finally {
    fs.rmSync(tempRoot, { force: true, recursive: true })
  }
})

test('GodotJS setup is exposed through npm and the shared CI action', () => {
  const packageJson = JSON.parse(readText('package.json'))
  const action = readText('.github/actions/setup-godotjs/action.yml')
  const script = readText('scripts/setup-godotjs.mjs')
  const readme = readText('README.md')
  const productionDocs = readText('docs/production.md')

  assert.equal(
    packageJson.scripts['setup:godotjs'],
    'node scripts/setup-godotjs.mjs',
  )
  assert.equal(
    defaultGodotIosPackageSourceRepo,
    'https://github.com/godotengine/godot.git',
  )
  assert.equal(defaultGodotIosPackageSourceRef, '4.4')
  assert.match(action, /default: GodotJS_1\.0\.0-2/)
  assert.match(action, /default: prebuilt_linux_x64_v8/)
  assert.match(action, /actions\/cache@v5/)
  assert.match(action, /node scripts\/setup-godotjs\.mjs/)
  assert.match(action, /--github-env "\$GITHUB_ENV"/)
  assert.match(script, /--asset-kind <kind>/)
  assert.match(script, /GODOTJS_ASSET_DIR/)
  assert.match(script, /--install-templates/)
  assert.match(script, /--assemble-ios-package/)
  assert.match(script, /--ios-package-source <p>/)
  assert.match(script, /GODOTJS_EXPORT_TEMPLATES_DIR/)
  assert.match(script, /GODOTJS_IOS_PACKAGE/)
  assert.match(readme, /--asset prebuilt_android_v8 --asset-kind templates/)
  assert.match(readme, /--assemble-ios-package/)
  assert.match(
    productionDocs,
    /--asset prebuilt_android_v8 --asset-kind templates/,
  )
  assert.doesNotMatch(action, /curl --fail/)
  assert.doesNotMatch(action, /find "\$GODOTJS_CACHE_DIR"/)
})
