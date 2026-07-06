import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import {
  collectDeviceTestPrereqStatus,
  collectExportTemplateStatus,
  collectHostedDeviceProviderStatus,
  collectLocalToolchainStatus,
  formatHostedProviderStatus,
  isAndroidEmulatorDevice,
  parseAdbDevices,
  parseXctraceDevices,
  requiredAndroidExportTemplateFiles,
} from '../scripts/check-device-test-prereqs.mjs'

test('device prereq parser reads adb device states', () => {
  const devices = parseAdbDevices(`
List of devices attached
emulator-5554 device product:sdk model:Pixel_8 device:emu64a transport_id:1
R58M123 unauthorized usb:336592896X transport_id:2
`)

  assert.deepEqual(devices, [
    {
      details: 'product:sdk model:Pixel_8 device:emu64a transport_id:1',
      serial: 'emulator-5554',
      state: 'device',
    },
    {
      details: 'usb:336592896X transport_id:2',
      serial: 'R58M123',
      state: 'unauthorized',
    },
  ])
  assert.equal(isAndroidEmulatorDevice(devices[0]), true)
  assert.equal(isAndroidEmulatorDevice(devices[1]), false)
})

test('device prereq parser ignores simulators in xctrace output', () => {
  assert.deepEqual(
    parseXctraceDevices(`
== Devices ==
Jurys Mac (00006000-0000000000000000)
Release iPhone (00008110-001C2D123456801E)
QA iPad (00008101-000E12345678001E)
== Simulators ==
iPhone 16 Pro (11111111-2222-3333-4444-555555555555) (Shutdown)
`),
    [
      {
        identifier: '00008110-001C2D123456801E',
        name: 'Release iPhone',
      },
      {
        identifier: '00008101-000E12345678001E',
        name: 'QA iPad',
      },
    ],
  )
})

test('device prereq status reports ready local Android and iOS devices', () => {
  const summary = collectDeviceTestPrereqStatus({
    includeToolchains: false,
    runCommand(command, args) {
      if (command === 'adb' && args.join(' ') === 'devices -l') {
        return {
          errorCode: null,
          status: 0,
          stderr: '',
          stdout: [
            'List of devices attached',
            'pixel8 device product:shiba model:Pixel_8',
          ].join('\n'),
        }
      }
      if (command === 'xcrun' && args.join(' ') === 'xctrace list devices') {
        return {
          errorCode: null,
          status: 0,
          stderr: '',
          stdout: [
            '== Devices ==',
            'Release iPhone (00008110-001C2D123456801E)',
            '== Simulators ==',
            'iPhone 16 Pro (11111111-2222-3333-4444-555555555555)',
          ].join('\n'),
        }
      }
      throw new Error(`Unexpected command: ${command} ${args.join(' ')}`)
    },
  })

  assert.equal(summary.ready, true)
  assert.equal(summary.android.ready, true)
  assert.equal(summary.ios.ready, true)
  assert.deepEqual(summary.blockers, [])
})

test('device prereq status rejects Android emulators as release devices', () => {
  const summary = collectDeviceTestPrereqStatus({
    includeToolchains: false,
    platform: 'android',
    runCommand(command, args) {
      assert.equal(command, 'adb')
      assert.equal(args.join(' '), 'devices -l')
      return {
        errorCode: null,
        status: 0,
        stderr: '',
        stdout: [
          'List of devices attached',
          'emulator-5554 device product:sdk_gphone64_arm64 model:sdk_gphone64_arm64 device:emu64a',
        ].join('\n'),
      }
    },
  })

  assert.equal(summary.ready, false)
  assert.equal(summary.android.ready, false)
  assert.match(summary.android.blockers[0], /physical Android devices/)
  assert.match(summary.android.warnings[0], /appears to be an emulator/)
})

test('device prereq status permits physical Android devices with emulator warnings', () => {
  const summary = collectDeviceTestPrereqStatus({
    includeToolchains: false,
    platform: 'android',
    runCommand(command, args) {
      assert.equal(command, 'adb')
      assert.equal(args.join(' '), 'devices -l')
      return {
        errorCode: null,
        status: 0,
        stderr: '',
        stdout: [
          'List of devices attached',
          'emulator-5554 device product:sdk_gphone64_arm64 model:sdk_gphone64_arm64 device:emu64a',
          'R5CT12345 device product:shiba model:Pixel_8 device:shiba',
        ].join('\n'),
      }
    },
  })

  assert.equal(summary.ready, true)
  assert.equal(summary.android.ready, true)
  assert.deepEqual(summary.android.blockers, [])
  assert.match(summary.android.warnings[0], /emulator/)
})

test('device prereq status reports missing local tooling without failing hosted evidence', () => {
  const summary = collectDeviceTestPrereqStatus({
    env: {},
    includeToolchains: false,
    platform: 'all',
    runCommand() {
      return {
        errorCode: 'ENOENT',
        status: null,
        stderr: '',
        stdout: '',
      }
    },
  })

  assert.equal(summary.ready, false)
  assert.equal(summary.hostedDeviceEvidenceAccepted, true)
  assert.equal(summary.hostedProviders.anyConfigured, false)
  assert.match(summary.note, /non-local http\(s\) evidence URLs/)
  assert.equal(summary.blockers.length, 2)
  assert.match(summary.blockers[0], /adb not found/)
  assert.match(summary.blockers[1], /xcrun not found/)
})

test('device prereq status explains missing full Xcode when xctrace is unavailable', () => {
  const summary = collectDeviceTestPrereqStatus({
    includeToolchains: false,
    platform: 'ios',
    runCommand(command, args) {
      if (command === 'xcrun' && args.join(' ') === 'xctrace list devices') {
        return {
          errorCode: null,
          status: 72,
          stderr:
            'xcrun: error: unable to find utility "xctrace", not a developer tool or in PATH',
          stdout: '',
        }
      }
      if (command === 'xcode-select' && args.join(' ') === '-p') {
        return {
          errorCode: null,
          status: 0,
          stderr: '',
          stdout: '/Library/Developer/CommandLineTools\n',
        }
      }
      throw new Error(`Unexpected command: ${command} ${args.join(' ')}`)
    },
  })

  assert.equal(summary.ready, false)
  assert.equal(summary.ios.ready, false)
  assert.match(summary.ios.blockers[0], /xcrun xctrace list devices failed/)
  assert.match(summary.ios.blockers[1], /Full Xcode is not selected/)
  assert.match(summary.ios.blockers.join('\n'), /Xcode\.app/)
  assert.match(
    summary.ios.blockers.join('\n'),
    /App Store \(app id 497799835\)/,
  )
  assert.match(summary.ios.blockers.join('\n'), /Apple ID/)
})

test('hosted provider status reports configured env names without values', () => {
  const status = collectHostedDeviceProviderStatus({
    BROWSERSTACK_ACCESS_KEY: 'secret',
    BROWSERSTACK_USERNAME: 'release-user',
    FIREBASE_TOKEN: '',
    GCLOUD_PROJECT: 'vue-godot-release',
    LAMBDATEST_ACCESS_KEY: 'lt-secret',
    LAMBDATEST_USERNAME: 'lt-user',
  })

  assert.equal(status.anyConfigured, true)
  assert.deepEqual(
    status.providers
      .filter((provider) => provider.configured)
      .map((provider) => [provider.id, provider.configuredEnv]),
    [
      ['browserstack', ['BROWSERSTACK_USERNAME', 'BROWSERSTACK_ACCESS_KEY']],
      ['lambdatest', ['LAMBDATEST_USERNAME', 'LAMBDATEST_ACCESS_KEY']],
    ],
  )
  assert.equal(
    status.providers.find((provider) => provider.id === 'firebase-test-lab')
      ?.configured,
    false,
  )
  assert.doesNotMatch(JSON.stringify(status), /secret|release-user|lt-user/)
})

test('hosted provider status reports partial env names without values', () => {
  const status = collectHostedDeviceProviderStatus({
    AWS_ACCESS_KEY_ID: 'aws-key',
    AWS_SECRET_ACCESS_KEY: 'aws-secret',
    BROWSERSTACK_USERNAME: 'release-user',
  })

  assert.equal(status.anyConfigured, false)
  assert.deepEqual(
    status.providers
      .filter((provider) => provider.partiallyConfigured)
      .map((provider) => [
        provider.id,
        provider.partialEnv,
        provider.missingEnv,
      ]),
    [
      ['browserstack', ['BROWSERSTACK_USERNAME'], ['BROWSERSTACK_ACCESS_KEY']],
      [
        'aws-device-farm',
        ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'],
        ['AWS_REGION'],
      ],
    ],
  )
  assert.doesNotMatch(JSON.stringify(status), /aws-key|aws-secret|release-user/)
})

test('hosted provider text lists accepted env sets when none are configured', () => {
  const status = collectHostedDeviceProviderStatus({})
  const lines = formatHostedProviderStatus(status)

  assert.equal(lines[0], '[device-prereqs] hosted provider env: none detected')
  assert.match(
    lines.join('\n'),
    /BrowserStack App Automate \(BROWSERSTACK_USERNAME \+ BROWSERSTACK_ACCESS_KEY\)/,
  )
  assert.match(
    lines.join('\n'),
    /Firebase Test Lab \(GOOGLE_APPLICATION_CREDENTIALS \+ GCLOUD_PROJECT or GOOGLE_APPLICATION_CREDENTIALS \+ GOOGLE_CLOUD_PROJECT or FIREBASE_TOKEN \+ GCLOUD_PROJECT or FIREBASE_TOKEN \+ GOOGLE_CLOUD_PROJECT\)/,
  )
  assert.match(
    lines.join('\n'),
    /LambdaTest Real Device Cloud \(LT_USERNAME \+ LT_ACCESS_KEY or LAMBDATEST_USERNAME \+ LAMBDATEST_ACCESS_KEY\)/,
  )
})

test('hosted provider text reports partial env names without values', () => {
  const status = collectHostedDeviceProviderStatus({
    BROWSERSTACK_USERNAME: 'release-user',
  })
  const text = formatHostedProviderStatus(status).join('\n')

  assert.match(text, /hosted provider env: none detected/)
  assert.match(
    text,
    /hosted provider env partial: BrowserStack App Automate \(set: BROWSERSTACK_USERNAME; missing: BROWSERSTACK_ACCESS_KEY\)/,
  )
  assert.match(text, /hosted provider env option: BrowserStack App Automate/)
  assert.doesNotMatch(text, /release-user/)
})

test('hosted provider text reports configured env names without values', () => {
  const status = collectHostedDeviceProviderStatus({
    BROWSERSTACK_ACCESS_KEY: 'secret',
    BROWSERSTACK_USERNAME: 'release-user',
  })
  const text = formatHostedProviderStatus(status).join('\n')

  assert.match(
    text,
    /BrowserStack App Automate \(BROWSERSTACK_USERNAME, BROWSERSTACK_ACCESS_KEY\)/,
  )
  assert.doesNotMatch(text, /secret|release-user/)
  assert.doesNotMatch(text, /hosted provider env option/)
})

test('hosted provider text reports configured and partial providers together', () => {
  const status = collectHostedDeviceProviderStatus({
    BROWSERSTACK_ACCESS_KEY: 'secret',
    BROWSERSTACK_USERNAME: 'release-user',
    LT_USERNAME: 'lt-user',
  })
  const text = formatHostedProviderStatus(status).join('\n')

  assert.match(
    text,
    /BrowserStack App Automate \(BROWSERSTACK_USERNAME, BROWSERSTACK_ACCESS_KEY\)/,
  )
  assert.match(
    text,
    /LambdaTest Real Device Cloud \(set: LT_USERNAME; missing: LT_ACCESS_KEY\)/,
  )
  assert.doesNotMatch(text, /secret|release-user|lt-user/)
  assert.doesNotMatch(text, /hosted provider env option/)
})

test('device prereq status includes hosted provider diagnostics', () => {
  const summary = collectDeviceTestPrereqStatus({
    env: {
      SAUCE_ACCESS_KEY: 'secret',
      SAUCE_USERNAME: 'release-user',
    },
    includeToolchains: false,
    platform: 'android',
    runCommand() {
      return {
        errorCode: 'ENOENT',
        status: null,
        stderr: '',
        stdout: '',
      }
    },
  })

  assert.equal(summary.ready, false)
  assert.equal(summary.hostedProviders.anyConfigured, true)
  assert.deepEqual(
    summary.hostedProviders.providers
      .filter((provider) => provider.configured)
      .map((provider) => provider.id),
    ['sauce-labs'],
  )
  assert.equal(summary.blockers.length, 1)
  assert.match(summary.blockers[0], /adb not found/)
})

test('export template status reports installed Android GodotJS templates', (t) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vue-godot-templates-'))
  t.after(() => fs.rmSync(tempDir, { force: true, recursive: true }))

  const templateVersion = '4.4.1.rc.custom_build.test'
  const templatesDir = path.join(tempDir, templateVersion)
  fs.mkdirSync(templatesDir, { recursive: true })
  for (const file of requiredAndroidExportTemplateFiles) {
    fs.writeFileSync(path.join(templatesDir, file), `${file}\n`)
  }
  fs.writeFileSync(
    path.join(templatesDir, 'version.txt'),
    `${templateVersion}\n`,
  )

  const status = collectExportTemplateStatus({
    platform: 'android',
    templateVersion,
    templatesRoot: tempDir,
  })

  assert.equal(status.android.ready, true)
  assert.equal(status.android.templateVersion, templateVersion)
  assert.equal(status.android.templatesDir, templatesDir)
  assert.deepEqual(status.android.missingFiles, [])
  assert.deepEqual(status.android.requiredFiles, [
    ...requiredAndroidExportTemplateFiles,
  ])
  assert.equal(status.ios, null)
})

test('export template diagnostics do not change local device readiness', () => {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vue-godot-missing-templates-'),
  )
  try {
    const summary = collectDeviceTestPrereqStatus({
      includeToolchains: false,
      platform: 'android',
      templateVersion: 'missing-version',
      templatesRoot: tempDir,
      runCommand(command, args) {
        assert.equal(command, 'adb')
        assert.equal(args.join(' '), 'devices -l')
        return {
          errorCode: null,
          status: 0,
          stderr: '',
          stdout: [
            'List of devices attached',
            'R5CT12345 device product:shiba model:Pixel_8 device:shiba',
          ].join('\n'),
        }
      },
    })

    assert.equal(summary.ready, true)
    assert.deepEqual(summary.blockers, [])
    assert.equal(summary.exportTemplates.android.ready, false)
    assert.match(
      summary.exportTemplates.android.blockers.join('\n'),
      /Android GodotJS export templates are incomplete/,
    )
    assert.match(
      summary.exportTemplates.android.warnings.join('\n'),
      /setup:godotjs/,
    )
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
})

test('export template status records unavailable pinned iOS templates', () => {
  const status = collectExportTemplateStatus({
    platform: 'ios',
  })

  assert.equal(status.android, null)
  assert.equal(status.ios.ready, false)
  assert.equal(status.ios.availableInPinnedRelease, false)
  assert.match(
    status.ios.notes.join('\n'),
    /does not publish an iOS export-template asset/,
  )
})

test('toolchain status reports Android SDK and build-tools readiness', (t) => {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vue-godot-android-sdk-'),
  )
  t.after(() => fs.rmSync(tempDir, { force: true, recursive: true }))

  const buildToolsDir = path.join(tempDir, 'build-tools', '37.0.0')
  fs.mkdirSync(buildToolsDir, { recursive: true })
  fs.writeFileSync(path.join(buildToolsDir, 'apksigner'), '')
  fs.writeFileSync(path.join(buildToolsDir, 'zipalign'), '')

  const status = collectLocalToolchainStatus({
    env: {
      ANDROID_HOME: tempDir,
    },
    platform: 'android',
    runCommand(command, args) {
      if (command === 'adb' && args.join(' ') === 'version') {
        return {
          errorCode: null,
          status: 0,
          stderr: '',
          stdout: 'Android Debug Bridge version 1.0.41\n',
        }
      }
      if (command === 'apksigner' && args.join(' ') === '--version') {
        return {
          errorCode: null,
          status: 0,
          stderr: '',
          stdout: '0.9\n',
        }
      }
      if (command === 'zipalign' && args.length === 0) {
        return {
          errorCode: null,
          status: 1,
          stderr: '',
          stdout: 'Zip alignment utility\n',
        }
      }
      throw new Error(`Unexpected command: ${command} ${args.join(' ')}`)
    },
  })

  assert.equal(status.android.ready, true)
  assert.equal(status.android.sdkRoot, tempDir)
  assert.equal(status.android.sdkRootSource, 'ANDROID_HOME')
  assert.equal(status.android.buildToolsVersion, '37.0.0')
  assert.equal(status.android.buildToolsDir, buildToolsDir)
  assert.deepEqual(status.android.blockers, [])
  assert.equal(status.android.commands.length, 3)
  assert.equal(status.ios, null)
})

test('toolchain diagnostics do not change local device readiness', (t) => {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'vue-godot-incomplete-sdk-'),
  )
  t.after(() => fs.rmSync(tempDir, { force: true, recursive: true }))
  fs.mkdirSync(path.join(tempDir, 'build-tools', '37.0.0'), {
    recursive: true,
  })

  const summary = collectDeviceTestPrereqStatus({
    env: {
      ANDROID_HOME: tempDir,
    },
    platform: 'android',
    runCommand(command, args) {
      if (command === 'adb' && args.join(' ') === 'devices -l') {
        return {
          errorCode: null,
          status: 0,
          stderr: '',
          stdout: [
            'List of devices attached',
            'R5CT12345 device product:shiba model:Pixel_8 device:shiba',
          ].join('\n'),
        }
      }
      if (command === 'adb' && args.join(' ') === 'version') {
        return {
          errorCode: null,
          status: 0,
          stderr: '',
          stdout: 'Android Debug Bridge version 1.0.41\n',
        }
      }
      if (command === 'apksigner' || command === 'zipalign') {
        return {
          errorCode: 'ENOENT',
          status: null,
          stderr: '',
          stdout: '',
        }
      }
      throw new Error(`Unexpected command: ${command} ${args.join(' ')}`)
    },
  })

  assert.equal(summary.ready, true)
  assert.equal(summary.toolchains.android.ready, false)
  assert.match(
    summary.toolchains.android.blockers.join('\n'),
    /APK signer not found/,
  )
  assert.match(
    summary.toolchains.android.blockers.join('\n'),
    /Android SDK build-tools are missing apksigner, zipalign/,
  )
})

test('toolchain status reports selected Xcode utilities', () => {
  const status = collectLocalToolchainStatus({
    platform: 'ios',
    runCommand(command, args) {
      const rendered = [command, ...args].join(' ')
      if (rendered === 'xcode-select -p') {
        return {
          errorCode: null,
          status: 0,
          stderr: '',
          stdout: '/Applications/Xcode.app/Contents/Developer\n',
        }
      }
      if (rendered === 'xcodebuild -version') {
        return {
          errorCode: null,
          status: 0,
          stderr: '',
          stdout: 'Xcode 26.6\nBuild version 17F113\n',
        }
      }
      if (rendered === 'xcrun --find xctrace') {
        return {
          errorCode: null,
          status: 0,
          stderr: '',
          stdout:
            '/Applications/Xcode.app/Contents/Developer/usr/bin/xctrace\n',
        }
      }
      if (rendered === 'xcrun --find devicectl') {
        return {
          errorCode: null,
          status: 0,
          stderr: '',
          stdout:
            '/Applications/Xcode.app/Contents/Developer/usr/bin/devicectl\n',
        }
      }
      throw new Error(`Unexpected command: ${rendered}`)
    },
  })

  assert.equal(status.android, null)
  assert.equal(status.ios.ready, true)
  assert.equal(
    status.ios.developerDir,
    '/Applications/Xcode.app/Contents/Developer',
  )
  assert.equal(status.ios.xcodeVersion, 'Xcode 26.6')
  assert.deepEqual(status.ios.blockers, [])
})
