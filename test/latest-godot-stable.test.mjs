import assert from 'node:assert/strict'
import test from 'node:test'

import {
  compareStableGodotTags,
  createStableGodotReleaseMetadata,
  mergeStableGodotReleaseMetadata,
  parseStableGodotTag,
  resolveLatestStableGodotRelease,
  stableCompatibilityReleaseTag,
  validateStableGodotReleaseMetadata,
} from '../scripts/resolve-latest-godot-stable.mjs'

function releaseAsset(name, sha256, size = 1234) {
  return {
    name,
    size,
    digest: `sha256:${sha256}`,
    browser_download_url: `https://github.com/godotengine/godot-builds/releases/download/4.8-stable/${name}`,
  }
}

function releaseFixtures() {
  const version = '4.8-stable'
  const digest = {
    linux: '1'.repeat(64),
    macos: '2'.repeat(64),
    windows: '3'.repeat(64),
    templates: '4'.repeat(64),
  }
  return {
    source: {
      tag_name: version,
      draft: false,
      prerelease: false,
      published_at: '2026-09-01T00:00:00Z',
      html_url: `https://github.com/godotengine/godot/releases/tag/${version}`,
    },
    builds: {
      tag_name: version,
      draft: false,
      prerelease: false,
      assets: [
        releaseAsset(`Godot_v${version}_linux.x86_64.zip`, digest.linux),
        releaseAsset(`Godot_v${version}_macos.universal.zip`, digest.macos),
        releaseAsset(`Godot_v${version}_win64.exe.zip`, digest.windows),
        releaseAsset(
          `Godot_v${version}_export_templates.tpz`,
          digest.templates,
          9876,
        ),
      ],
    },
    digest,
  }
}

test('stable Godot versions parse and sort numerically', () => {
  assert.deepEqual(parseStableGodotTag('4.8-stable'), [4, 8, 0])
  assert.deepEqual(parseStableGodotTag('4.7.1-stable'), [4, 7, 1])
  assert.ok(compareStableGodotTags('4.10-stable', '4.9.3-stable') > 0)
  assert.throws(() => parseStableGodotTag('4.8-rc1'), /Invalid Godot stable/)
})

test('official source and build releases become checksummed setup metadata', () => {
  const { source, builds, digest } = releaseFixtures()
  const metadata = createStableGodotReleaseMetadata(source, builds)

  assert.equal(metadata.version, '4.8-stable')
  assert.equal(metadata.installedVersion, '4.8.stable')
  assert.equal(metadata.editors['linux-x86_64'].sha256, digest.linux)
  assert.equal(
    metadata.editors['macos-universal'].executable,
    'Godot.app/Contents/MacOS/Godot',
  )
  assert.equal(
    metadata.editors['windows-x86_64'].executable,
    'Godot_v4.8-stable_win64_console.exe',
  )
  assert.deepEqual(metadata.exportTemplates, {
    filename: 'Godot_v4.8-stable_export_templates.tpz',
    installedVersion: '4.8.stable',
    sha256: digest.templates,
    size: 9876,
  })
})

test('stable release metadata rejects prereleases and unverified assets', () => {
  const prerelease = releaseFixtures()
  prerelease.source.prerelease = true
  assert.throws(
    () =>
      createStableGodotReleaseMetadata(prerelease.source, prerelease.builds),
    /draft or prerelease/,
  )

  const unsigned = releaseFixtures()
  delete unsigned.builds.assets[0].digest
  assert.throws(
    () => createStableGodotReleaseMetadata(unsigned.source, unsigned.builds),
    /lacks an official SHA-256/,
  )
})

test('persisted stable metadata rejects incomplete or inconsistent catalogs', () => {
  const { source, builds } = releaseFixtures()
  const metadata = createStableGodotReleaseMetadata(source, builds)
  assert.equal(validateStableGodotReleaseMetadata(metadata), metadata)

  const inconsistent = structuredClone(metadata)
  inconsistent.installedVersion = '4.7.1.stable'
  assert.throws(
    () => validateStableGodotReleaseMetadata(inconsistent),
    /installed version is inconsistent/,
  )

  const incomplete = structuredClone(metadata)
  delete incomplete.editors['windows-x86_64']
  assert.throws(
    () => validateStableGodotReleaseMetadata(incomplete),
    /editor platforms are incomplete/,
  )
})

test('resolved metadata merges into sorted editor and template catalogs', () => {
  const { source, builds } = releaseFixtures()
  const metadata = createStableGodotReleaseMetadata(source, builds)
  const merged = mergeStableGodotReleaseMetadata(
    metadata,
    {
      '4.7.1-stable': { fixture: 'current' },
      '4.4.1-stable': { fixture: 'minimum' },
    },
    {
      '4.7.1-stable': { fixture: 'current' },
      '4.4.1-stable': { fixture: 'minimum' },
    },
  )

  assert.deepEqual(Object.keys(merged.editorCatalog), [
    '4.4.1-stable',
    '4.7.1-stable',
    '4.8-stable',
  ])
  assert.deepEqual(Object.keys(merged.templateCatalog), [
    '4.4.1-stable',
    '4.7.1-stable',
    '4.8-stable',
  ])
  assert.deepEqual(merged.editorCatalog['4.8-stable'], metadata.editors)
})

test('latest stable resolution uses the official source and build releases', async () => {
  const { source, builds } = releaseFixtures()
  const requests = []
  const fetchImplementation = async (url, options) => {
    requests.push({ url, options })
    return {
      ok: true,
      json: async () =>
        requests.length === 1
          ? [
              { ...source, tag_name: '4.7.1-stable' },
              {
                ...source,
                tag_name: '4.9-dev1',
                prerelease: true,
              },
              source,
            ]
          : builds,
    }
  }

  const metadata = await resolveLatestStableGodotRelease({
    token: 'fixture-token',
    fetchImplementation,
  })
  assert.equal(metadata.version, '4.8-stable')
  assert.deepEqual(
    requests.map((request) => request.url),
    [
      'https://api.github.com/repos/godotengine/godot/releases?per_page=100',
      'https://api.github.com/repos/godotengine/godot-builds/releases/tags/4.8-stable',
    ],
  )
  assert.equal(
    requests[0].options.headers.Authorization,
    'Bearer fixture-token',
  )
})

test('compatibility release tags cannot trigger the npm v-tag publisher', () => {
  const tag = stableCompatibilityReleaseTag('0.0.1', '4.7.1-stable')
  assert.equal(tag, 'godot-js-runtime-v0.0.1-godot-4.7.1')
  assert.equal(tag.startsWith('v'), false)
})
