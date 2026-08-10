import { spawn, spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

function parseArgs(argv) {
  const options = { timeout: 90_000 }
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index]
    const value = argv[++index]
    if (!value) throw new Error(`${argument} requires a value`)
    if (argument === '--chrome') options.chrome = value
    else if (argument === '--url') options.url = value
    else if (argument === '--profile') options.profile = path.resolve(value)
    else if (argument === '--marker') options.marker = value
    else if (argument === '--timeout') options.timeout = Number(value)
    else throw new Error(`Unknown option: ${argument}`)
  }
  if (!options.chrome || !options.url || !options.profile || !options.marker) {
    throw new Error('--chrome, --url, --profile, and --marker are required')
  }
  if (!Number.isFinite(options.timeout) || options.timeout <= 0) {
    throw new Error(`Invalid timeout: ${String(options.timeout)}`)
  }
  return options
}

function protocolConnection(readable, writable) {
  let buffer = Buffer.alloc(0)
  let nextId = 1
  const pending = new Map()
  const listeners = new Set()

  readable.on('data', (chunk) => {
    buffer = Buffer.concat([buffer, chunk])
    for (;;) {
      const separator = buffer.indexOf(0)
      if (separator < 0) break
      const payload = buffer.subarray(0, separator).toString('utf-8')
      buffer = buffer.subarray(separator + 1)
      if (!payload) continue
      let message
      try {
        message = JSON.parse(payload)
      } catch (error) {
        for (const listener of listeners) listener({ protocolError: error })
        continue
      }
      if (message.id !== undefined) {
        const request = pending.get(message.id)
        if (!request) continue
        pending.delete(message.id)
        if (message.error) {
          request.reject(
            new Error(
              `Browser protocol ${request.method} failed: ${message.error.message}`,
            ),
          )
        } else request.resolve(message.result ?? {})
      } else {
        for (const listener of listeners) listener(message)
      }
    }
  })

  return {
    listen(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    send(method, params = {}, sessionId = undefined) {
      const id = nextId++
      const message = { id, method, params }
      if (sessionId) message.sessionId = sessionId
      return new Promise((resolve, reject) => {
        pending.set(id, { method, reject, resolve })
        writable.write(`${JSON.stringify(message)}\0`)
      })
    },
  }
}

function consoleArgument(argument) {
  if (argument.value !== undefined) return String(argument.value)
  if (argument.unserializableValue !== undefined) {
    return String(argument.unserializableValue)
  }
  return argument.description ?? argument.type ?? '(unknown)'
}

function chromeArguments(options) {
  return [
    '--headless=new',
    '--remote-debugging-pipe',
    '--no-sandbox',
    '--no-first-run',
    '--disable-background-networking',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-extensions',
    '--disable-sync',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
    '--metrics-recording-only',
    '--mute-audio',
    '--use-angle=swiftshader',
    `--user-data-dir=${options.profile}`,
    '--window-size=1024,768',
    'about:blank',
  ]
}

async function runBrowser(options) {
  const browser = spawn(options.chrome, chromeArguments(options), {
    stdio: ['ignore', 'ignore', 'pipe', 'pipe', 'pipe'],
  })
  const browserInput = browser.stdio[3]
  const browserOutput = browser.stdio[4]
  if (!browserInput || !browserOutput) {
    browser.kill('SIGKILL')
    throw new Error('Chrome did not expose its browser protocol pipes')
  }
  let stderr = ''
  browser.stderr.on('data', (chunk) => {
    stderr = `${stderr}${chunk.toString('utf-8')}`.slice(-256 * 1024)
  })
  const protocol = protocolConnection(browserOutput, browserInput)
  const consoleLines = []
  const failures = []
  const sessions = new Set()
  let markerResolve
  let markerReject
  const markerPromise = new Promise((resolve, reject) => {
    markerResolve = resolve
    markerReject = reject
  })
  const timeout = setTimeout(() => {
    markerReject(
      new Error(
        `Timed out waiting for ${options.marker}\n${consoleLines.join('\n')}\n${stderr}`,
      ),
    )
  }, options.timeout)
  const fatalPatterns = [
    'Browser error:',
    'Failed to load extension',
    'SCRIPT ERROR',
    'WebAssembly.CompileError',
    'RuntimeError: unreachable',
  ]

  function captureLine(line) {
    consoleLines.push(line)
    if (fatalPatterns.some((pattern) => line.includes(pattern))) {
      failures.push(line)
      markerReject(new Error(`Web export browser failure: ${line}`))
    }
    if (line.includes(options.marker)) markerResolve(line)
  }

  async function enableSession(sessionId, page = false) {
    if (sessions.has(sessionId)) return
    sessions.add(sessionId)
    await protocol.send('Runtime.enable', {}, sessionId)
    await protocol.send('Log.enable', {}, sessionId)
    if (page) {
      await protocol.send('Page.enable', {}, sessionId)
      await protocol.send(
        'Target.setAutoAttach',
        {
          autoAttach: true,
          flatten: true,
          waitForDebuggerOnStart: false,
        },
        sessionId,
      )
    }
  }

  const stopListening = protocol.listen((message) => {
    if (message.protocolError) {
      markerReject(message.protocolError)
      return
    }
    if (message.method === 'Target.attachedToTarget') {
      void enableSession(message.params.sessionId).catch(markerReject)
      return
    }
    if (message.method === 'Runtime.consoleAPICalled') {
      captureLine(message.params.args.map(consoleArgument).join(' '))
      return
    }
    if (message.method === 'Runtime.exceptionThrown') {
      const detail = message.params.exceptionDetails
      captureLine(
        `Runtime exception: ${detail.exception?.description ?? detail.text}`,
      )
      return
    }
    if (message.method === 'Log.entryAdded') {
      const entry = message.params.entry
      if (entry.level === 'error') captureLine(`Browser error: ${entry.text}`)
    }
  })

  const exited = new Promise((_, reject) => {
    browser.once('error', reject)
    browser.once('exit', (code, signal) => {
      reject(
        new Error(
          `Chrome exited before the Web marker (code=${String(code)}, signal=${String(signal)})\n${stderr}`,
        ),
      )
    })
  })

  try {
    await protocol.send('Target.setDiscoverTargets', { discover: true })
    const targetResponse = await protocol.send('Target.getTargets')
    const page = targetResponse.targetInfos.find(
      (target) => target.type === 'page',
    )
    if (!page) throw new Error('Chrome did not create a page target')
    const attached = await protocol.send('Target.attachToTarget', {
      flatten: true,
      targetId: page.targetId,
    })
    await enableSession(attached.sessionId, true)
    await protocol.send(
      'Page.navigate',
      { url: options.url },
      attached.sessionId,
    )
    const marker = await Promise.race([markerPromise, exited])
    await new Promise((resolve) => setTimeout(resolve, 500))
    const isolation = await protocol.send(
      'Runtime.evaluate',
      {
        expression: 'globalThis.crossOriginIsolated',
        returnByValue: true,
      },
      attached.sessionId,
    )
    if (isolation.result?.value !== true) {
      throw new Error('Web export browser context is not cross-origin isolated')
    }
    const markerCount = consoleLines.filter((line) =>
      line.includes(options.marker),
    ).length
    if (markerCount !== 1) {
      throw new Error(
        `Web export emitted ${String(markerCount)} marker lines\n${consoleLines.join('\n')}`,
      )
    }
    if (failures.length > 0) {
      throw new Error(
        `Web export emitted browser failures\n${failures.join('\n')}`,
      )
    }
    return {
      console: consoleLines,
      crossOriginIsolated: true,
      marker,
    }
  } finally {
    clearTimeout(timeout)
    stopListening()
    try {
      await protocol.send('Browser.close')
    } catch {
      browser.kill('SIGTERM')
    }
    if (browser.exitCode === null) browser.kill('SIGTERM')
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const result = await runBrowser(options)
  process.stdout.write(`${JSON.stringify(result)}\n`)
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))
) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
