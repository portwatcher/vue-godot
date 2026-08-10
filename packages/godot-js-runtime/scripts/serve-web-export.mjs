import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const contentTypes = Object.freeze({
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pck': 'application/octet-stream',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
})

function parseArgs(argv) {
  const options = { port: 0 }
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index]
    const value = argv[++index]
    if (!value) throw new Error(`${argument} requires a value`)
    if (argument === '--root') options.root = path.resolve(value)
    else if (argument === '--ready-file') {
      options.readyFile = path.resolve(value)
    } else if (argument === '--port') options.port = Number(value)
    else throw new Error(`Unknown option: ${argument}`)
  }
  if (!options.root || !options.readyFile) {
    throw new Error('--root and --ready-file are required')
  }
  if (
    !Number.isInteger(options.port) ||
    options.port < 0 ||
    options.port > 65535
  ) {
    throw new Error(`Invalid port: ${String(options.port)}`)
  }
  return options
}

function requestFile(root, requestUrl) {
  const url = new URL(requestUrl ?? '/', 'http://127.0.0.1')
  let pathname
  try {
    pathname = decodeURIComponent(url.pathname)
  } catch {
    return undefined
  }
  const relative = pathname === '/' ? 'index.html' : pathname.slice(1)
  const candidate = path.resolve(root, relative)
  const relation = path.relative(root, candidate)
  if (
    relation === '' ||
    relation === '..' ||
    relation.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relation)
  ) {
    return undefined
  }
  return candidate
}

export function createWebExportServer(root) {
  const resolvedRoot = path.resolve(root)
  return http.createServer((request, response) => {
    if (request.url?.split('?', 1)[0] === '/favicon.ico') {
      response.writeHead(204, { 'Cache-Control': 'no-store' })
      response.end()
      return
    }
    const filePath = requestFile(resolvedRoot, request.url)
    if (
      !filePath ||
      !fs.existsSync(filePath) ||
      !fs.statSync(filePath).isFile()
    ) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end('Not found\n')
      return
    }
    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type':
        contentTypes[path.extname(filePath).toLowerCase()] ??
        'application/octet-stream',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin',
      'Origin-Agent-Cluster': '?1',
    })
    fs.createReadStream(filePath).pipe(response)
  })
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  if (!fs.statSync(options.root).isDirectory()) {
    throw new Error(`Web export root is not a directory: ${options.root}`)
  }
  const server = createWebExportServer(options.root)
  server.listen(options.port, '127.0.0.1', () => {
    const address = server.address()
    if (!address || typeof address === 'string') {
      throw new Error('Unable to resolve Web export server address')
    }
    const ready = `${JSON.stringify({
      origin: `http://127.0.0.1:${String(address.port)}`,
      port: address.port,
    })}\n`
    const temporaryReadyFile = `${options.readyFile}.tmp-${String(process.pid)}`
    fs.mkdirSync(path.dirname(options.readyFile), { recursive: true })
    fs.writeFileSync(temporaryReadyFile, ready)
    fs.renameSync(temporaryReadyFile, options.readyFile)
  })
  const shutdown = () => server.close(() => process.exit(0))
  process.once('SIGINT', shutdown)
  process.once('SIGTERM', shutdown)
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))
) {
  try {
    main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}
