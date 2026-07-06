import assert from 'node:assert/strict'
import test from 'node:test'

import {
  collectDeviceTestPrereqStatus,
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
  assert.equal(summary.blockers.length, 2)
  assert.match(summary.blockers[0], /adb not found/)
  assert.match(summary.blockers[1], /xcrun not found/)
})
