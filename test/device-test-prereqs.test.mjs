import assert from 'node:assert/strict'
import test from 'node:test'

import {
  collectDeviceTestPrereqStatus,
  collectHostedDeviceProviderStatus,
  formatHostedProviderStatus,
  isAndroidEmulatorDevice,
  parseAdbDevices,
  parseXctraceDevices,
} from '../scripts/check-device-test-prereqs.mjs'

test('device prereq parser reads adb device states', () => {
  const devices = parseAdbDevices(`
List of devices attached
emulator-5554 device product:sdk model:Pixel_8 device:emu64a transport_id:1
R58M123 unauthorized usb:336592896X transport_id:2
`)

  assert.deepEqual(
    devices,
    [
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
    ],
  )
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
      [
        'browserstack',
        ['BROWSERSTACK_USERNAME', 'BROWSERSTACK_ACCESS_KEY'],
      ],
      [
        'lambdatest',
        ['LAMBDATEST_USERNAME', 'LAMBDATEST_ACCESS_KEY'],
      ],
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
      [
        'browserstack',
        ['BROWSERSTACK_USERNAME'],
        ['BROWSERSTACK_ACCESS_KEY'],
      ],
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
