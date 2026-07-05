import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const repoRoot = process.cwd()
const appsRoot = path.join(repoRoot, 'apps')

const fixtureApps = [
  {
    id: 'anchor-ordering',
    entryComponent: 'App.vue',
    requiredDependencies: ['@vue-godot/runtime-tscn'],
    sources: {
      'vue/src/main.ts': [
        "import App from './App.vue'",
        'createApp(App)',
        'app.mount(this)',
        'this.app?.unmount()',
      ],
      'vue/src/App.vue': [
        'v-if="showMiddle"',
        'v-for="item in keyedOrder"',
        'swapAB.value = !swapAB.value',
        '[anchor-ordering]',
      ],
    },
  },
  {
    id: 'html-demo',
    entryComponent: 'App.vue',
    requiredDependencies: [
      '@vue-godot/browser',
      '@vue-godot/device',
      '@vue-godot/html',
      '@vue-godot/runtime-tscn',
    ],
    usesHtmlPlugin: true,
    sources: {
      'vue/src/main.ts': [
        'installBrowserAPIs()',
        'app.use(htmlPlugin)',
        'runBrowserSmokeTests',
        'assertSignalConnectionCount',
      ],
      'vue/src/App.vue': [
        '<Div',
        '<Input',
        '<Select',
        'v-model="selectedFruit"',
        '<Option value="cherry" :disabled="true">Cherry</Option>',
        '<CameraView',
        '<Canvas',
        '<Audio',
        '<Video',
        '<VirtualList',
        'runBrowserTests',
      ],
      'vue/src/browserSmoke.ts': [
        'new URLSearchParams',
        'WebSocket',
        'navigator.permissions.query',
        'navigator.geolocation',
        'navigator.mediaDevices',
        'navigator.clipboard.readText',
        'navigator.vibrate',
        'readDeviceMotion',
        'localStorage.setItem',
        'fetch(request)',
      ],
    },
  },
  {
    id: 'native-app-demo',
    entryComponent: 'App.vue',
    requiredDependencies: [
      '@vue-godot/browser',
      '@vue-godot/device',
      '@vue-godot/html',
      '@vue-godot/runtime-tscn',
      'vue-router',
    ],
    usesHtmlPlugin: true,
    sources: {
      'vue/src/main.ts': [
        'installBrowserAPIs()',
        'app.use(htmlPlugin)',
        'app.use(router)',
      ],
      'vue/src/App.vue': ['<SafeAreaView', '<router-view></router-view>'],
      'vue/src/app/router.ts': ['createRouter', 'HomeScreen', 'DeviceScreen'],
      'vue/src/screens/HomeScreen.vue': [
        'Profile form input',
        '<KeyboardAvoidingView',
        '<Form',
        'checkNetworkReachability',
        'setNavigatorOnline',
        'localStorage.setItem',
        'sessionStorage.setItem',
      ],
      'vue/src/screens/DeviceScreen.vue': [
        'godotNavigator.permissions.query',
        'godotNavigator.geolocation.getCurrentPosition',
        'mediaDevices.getUserMedia',
        'getCapabilityStatus',
      ],
    },
  },
  {
    id: 'game-ui-demo',
    entryComponent: 'App.vue',
    requiredDependencies: [
      '@vue-godot/browser',
      '@vue-godot/html',
      '@vue-godot/runtime-tscn',
    ],
    usesHtmlPlugin: true,
    sources: {
      'vue/src/main.ts': ['installBrowserAPIs()', 'app.use(htmlPlugin)'],
      'vue/src/App.vue': [
        'Vue-rendered HUD',
        'controller',
        'keyboard',
        'touch',
        '<Audio',
        '<Video',
        '<Img',
        'inventory',
        'settings',
        'focus restoration',
        'requestAnimationFrame',
        'pause',
      ],
    },
  },
  {
    id: 'lifecycles',
    entryComponent: 'App.vue',
    requiredDependencies: ['@vue-godot/runtime-tscn'],
    sources: {
      'vue/src/main.ts': [
        "import App from './App.vue'",
        'createApp(App)',
        'app.mount(this)',
        'this.app?.unmount()',
      ],
      'vue/src/App.vue': [
        'onMounted(() => {',
        '@pressed="toggle"',
        'labelText.value = `Label text:',
        'buttonText.value = `Toggle',
      ],
    },
  },
  {
    id: 'template-ref',
    entryComponent: 'Test.vue',
    requiredDependencies: ['@vue-godot/runtime-tscn'],
    sources: {
      'vue/src/main.ts': [
        "import Test from './Test.vue'",
        'createApp(Test)',
        'app.mount(this)',
        'this.app?.unmount()',
      ],
      'vue/src/Test.vue': [
        'ref="hbox"',
        'ref<HBoxContainer | null>(null)',
        "hbox.value?.set?.('theme_override_constants/separation', 100)",
        'has_theme_constant_override',
      ],
    },
  },
  {
    id: 'v-model',
    entryComponent: 'Test.vue',
    requiredDependencies: ['@vue-godot/runtime-tscn'],
    sources: {
      'vue/src/main.ts': [
        "import Test from './Test.vue'",
        'createApp(Test)',
        'app.mount(this)',
        'this.app?.unmount()',
      ],
      'vue/src/Test.vue': [
        '<model-line-edit v-model="text"></model-line-edit>',
        "emit('update:modelValue', value)",
        'onTextChanged',
        'Model value:',
      ],
    },
  },
  {
    id: 'v-on',
    entryComponent: 'App.vue',
    requiredDependencies: ['@vue-godot/runtime-tscn'],
    sources: {
      'vue/src/main.ts': [
        "import App from './App.vue'",
        'createApp(App)',
        'app.mount(this)',
        'this.app?.unmount()',
      ],
      'vue/src/App.vue': [
        '@text_changed="onSnakeCaseTextChanged"',
        ':onTextChanged=',
        "ref<'single' | 'array' | 'off'>('single')",
        'resetCounters',
      ],
    },
  },
]

function fixturePath(fixture, ...segments) {
  return path.join(appsRoot, fixture.id, ...segments)
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf-8')
}

function readJson(filePath) {
  return JSON.parse(readText(filePath))
}

function assertFileExists(filePath) {
  assert.ok(fs.existsSync(filePath), `Expected fixture file ${filePath}`)
}

function assertIncludes(source, marker, filePath) {
  assert.ok(
    source.includes(marker),
    `Expected ${path.relative(repoRoot, filePath)} to include ${marker}`,
  )
}

function hasDependency(packageJson, dependencyName) {
  return (
    Object.prototype.hasOwnProperty.call(
      packageJson.dependencies ?? {},
      dependencyName,
    ) ||
    Object.prototype.hasOwnProperty.call(
      packageJson.devDependencies ?? {},
      dependencyName,
    )
  )
}

function appDirectoryNames() {
  return fs
    .readdirSync(appsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

test('fixture registry includes every checked-in app workspace', () => {
  const registeredIds = fixtureApps.map((fixture) => fixture.id).sort()
  assert.equal(
    new Set(registeredIds).size,
    registeredIds.length,
    'Fixture app ids must be unique',
  )
  assert.deepEqual(registeredIds, appDirectoryNames())
})

test('fixture app workspaces expose the regression build contract', () => {
  for (const fixture of fixtureApps) {
    const fixtureRoot = fixturePath(fixture)
    assertFileExists(fixtureRoot)

    for (const fileName of [
      'package.json',
      'project.godot',
      'app.tscn',
      'vue/vite.config.ts',
      'vue/src/main.ts',
      'vue/src/env.d.ts',
      `vue/src/${fixture.entryComponent}`,
    ]) {
      assertFileExists(fixturePath(fixture, fileName))
    }

    const packageJson = readJson(fixturePath(fixture, 'package.json'))
    assert.match(
      packageJson.scripts?.build ?? '',
      /^npm run build:deps && vite build -c vue\/vite\.config\.ts$/,
      `${fixture.id} must build through its Godot Vite config`,
    )
    assert.match(
      packageJson.scripts?.dev ?? '',
      /^npm run build:deps && vite build --watch -c vue\/vite\.config\.ts$/,
      `${fixture.id} must watch-build through its Godot Vite config`,
    )
    assert.match(
      packageJson.scripts?.['build:deps'] ?? '',
      /--workspace=@vue-godot\/runtime-tscn build/,
      `${fixture.id} must build runtime-tscn before Vite`,
    )
    assert.equal(packageJson.scripts?.['gen:types'], 'vue-godot gen-types')

    for (const dependencyName of [
      '@vue-godot/cli',
      '@vitejs/plugin-vue',
      'vite',
      '@vue/runtime-core',
      ...fixture.requiredDependencies,
    ]) {
      assert.ok(
        hasDependency(packageJson, dependencyName),
        `${fixture.id} must depend on ${dependencyName}`,
      )
    }

    const viteConfigPath = fixturePath(fixture, 'vue/vite.config.ts')
    const viteConfig = readText(viteConfigPath)
    for (const marker of [
      'isNativeTag: () => false',
      "entry: 'vue/src/main.ts'",
      "formats: ['cjs']",
      "fileName: () => 'app.js'",
      "external: ['godot']",
      "chunkFileNames: 'chunks/[name].js'",
      "alias: { vue: '@vue/runtime-core' }",
    ]) {
      assertIncludes(viteConfig, marker, viteConfigPath)
    }

    if (fixture.usesHtmlPlugin) {
      assertIncludes(viteConfig, 'const htmlTags = [', viteConfigPath)
      assertIncludes(
        viteConfig,
        '!htmlTags.includes(tag.toLowerCase())',
        viteConfigPath,
      )
    } else {
      assertIncludes(
        viteConfig,
        'isCustomElement: (tag) => tag[0] === tag[0].toUpperCase()',
        viteConfigPath,
      )
    }
  }
})

test('fixture app sources keep their regression scenario markers', () => {
  for (const fixture of fixtureApps) {
    for (const [sourceFile, markers] of Object.entries(fixture.sources)) {
      const sourcePath = fixturePath(fixture, sourceFile)
      const source = readText(sourcePath)
      for (const marker of markers) {
        assertIncludes(source, marker, sourcePath)
      }
    }
  }
})
