// ---------------------------------------------------------------------------
// Timing and Performance polyfills for the Godot JavaScript Runtime
// ---------------------------------------------------------------------------

import { Engine, SceneTree, Time } from 'godot'

export type GodotTimerHandler = (...args: unknown[]) => void
export type GodotAnimationFrameCallback = (time: number) => void

export interface GodotPerformanceMarkOptions {
  detail?: unknown
  startTime?: number
}

export interface GodotPerformanceMeasureOptions {
  detail?: unknown
  start?: string | number
  duration?: number
  end?: string | number
}

export class GodotPerformanceEntry {
  readonly name: string
  readonly entryType: string
  readonly startTime: number
  readonly duration: number
  readonly detail: unknown

  constructor(
    name: string,
    entryType: string,
    startTime: number,
    duration: number,
    detail?: unknown,
  ) {
    this.name = name
    this.entryType = entryType
    this.startTime = startTime
    this.duration = duration
    this.detail = detail
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail,
    }
  }
}

export class GodotPerformanceMark extends GodotPerformanceEntry {
  constructor(name: string, startTime: number, detail?: unknown) {
    super(name, 'mark', startTime, 0, detail)
  }
}

export class GodotPerformanceMeasure extends GodotPerformanceEntry {
  constructor(
    name: string,
    startTime: number,
    duration: number,
    detail?: unknown,
  ) {
    super(name, 'measure', startTime, duration, detail)
  }
}

interface NativePerformanceLike {
  now(): number
  timeOrigin?: number
}

type NativeSetTimeout = (callback: () => void, delay?: number) => unknown
type NativeClearTimeout = (handle: unknown) => void

interface ScheduledTimer {
  id: number
  delay: number
  repeat: boolean
  handler: GodotTimerHandler
  args: unknown[]
  nativeHandle: unknown
}

const g: Record<string, unknown> = globalThis
const nativeSetTimeout =
  typeof g['setTimeout'] === 'function'
    ? (g['setTimeout'] as NativeSetTimeout)
    : null
const nativeClearTimeout =
  typeof g['clearTimeout'] === 'function'
    ? (g['clearTimeout'] as NativeClearTimeout)
    : null
const nativePerformance = isNativePerformanceLike(g['performance'])
  ? g['performance']
  : null

let nextTimerId = 1
const scheduledTimers = new Map<number, ScheduledTimer>()
const scheduledAnimationFrames = new Map<number, GodotAnimationFrameCallback>()

const fallbackTimeOrigin = Date.now()
const fallbackStart = nativePerformance?.now() ?? 0
const initialMonotonicTime = readGodotMonotonicMilliseconds() ?? fallbackStart

function isNativePerformanceLike(
  value: unknown,
): value is NativePerformanceLike {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { now?: unknown }).now === 'function'
  )
}

function getSceneTree(): SceneTree | null {
  try {
    const mainLoop = Engine.get_main_loop()
    return mainLoop instanceof SceneTree ? mainLoop : null
  } catch {
    return null
  }
}

function readGodotMonotonicMilliseconds(): number | null {
  try {
    const ticks = Time.get_ticks_usec()
    return Number.isFinite(ticks) ? Number(ticks) / 1000 : null
  } catch {
    return null
  }
}

function nowMilliseconds(): number {
  const godotNow = readGodotMonotonicMilliseconds()
  if (godotNow !== null) {
    return godotNow
  }

  if (nativePerformance) {
    return nativePerformance.now()
  }

  return Date.now() - fallbackTimeOrigin
}

function reportAsyncError(error: unknown): void {
  Promise.resolve().then(() => {
    throw error
  })
}

async function waitForNextProcessFrame(): Promise<void> {
  const tree = getSceneTree()
  if (tree) {
    await tree.process_frame.as_promise()
    return
  }

  await asyncDelay(16)
}

/**
 * Non-blocking delay using `SceneTree.create_timer()` when Godot's scene tree is
 * available. Falls back to a captured host timer in tests or a microtask yield
 * during very early runtime startup.
 */
export async function asyncDelay(ms: number): Promise<void> {
  const delay = Math.max(0, ms)
  const tree = getSceneTree()

  if (tree) {
    const timer = tree.create_timer(delay / 1000, true, false, true)
    await timer.timeout.as_promise()
    return
  }

  if (nativeSetTimeout && nativeSetTimeout !== setTimeout) {
    await new Promise<void>((resolve) => {
      nativeSetTimeout(resolve, delay)
    })
    return
  }

  await Promise.resolve()
}

export function setTimeout(
  handler: GodotTimerHandler,
  timeout = 0,
  ...args: unknown[]
): number {
  const id = nextTimerId++
  const timer: ScheduledTimer = {
    id,
    delay: Math.max(0, Number(timeout) || 0),
    repeat: false,
    handler,
    args,
    nativeHandle: null,
  }
  scheduledTimers.set(id, timer)
  scheduleTimer(timer)
  return id
}

export function clearTimeout(id: number): void {
  const timer = scheduledTimers.get(id)
  if (!timer) return

  if (timer.nativeHandle !== null && nativeClearTimeout) {
    nativeClearTimeout(timer.nativeHandle)
  }
  scheduledTimers.delete(id)
}

export function setInterval(
  handler: GodotTimerHandler,
  timeout = 0,
  ...args: unknown[]
): number {
  const id = nextTimerId++
  const timer: ScheduledTimer = {
    id,
    delay: Math.max(0, Number(timeout) || 0),
    repeat: true,
    handler,
    args,
    nativeHandle: null,
  }
  scheduledTimers.set(id, timer)
  scheduleTimer(timer)
  return id
}

export function clearInterval(id: number): void {
  clearTimeout(id)
}

export function queueMicrotask(callback: () => void): void {
  Promise.resolve().then(callback).catch(reportAsyncError)
}

export function requestAnimationFrame(
  callback: GodotAnimationFrameCallback,
): number {
  const id = nextTimerId++
  scheduledAnimationFrames.set(id, callback)
  void runAnimationFrame(id)
  return id
}

export function cancelAnimationFrame(id: number): void {
  scheduledAnimationFrames.delete(id)
}

function scheduleTimer(timer: ScheduledTimer): void {
  if (nativeSetTimeout && nativeSetTimeout !== setTimeout) {
    timer.nativeHandle = nativeSetTimeout(() => {
      runTimer(timer.id)
    }, timer.delay)
    return
  }

  void runGodotTimer(timer.id)
}

async function runGodotTimer(id: number): Promise<void> {
  const timer = scheduledTimers.get(id)
  if (!timer) return

  await asyncDelay(timer.delay)
  runTimer(id)
}

function runTimer(id: number): void {
  const timer = scheduledTimers.get(id)
  if (!timer) return

  try {
    timer.handler(...timer.args)
  } catch (error) {
    reportAsyncError(error)
  }

  if (!scheduledTimers.has(id)) return

  if (timer.repeat) {
    timer.nativeHandle = null
    scheduleTimer(timer)
  } else {
    scheduledTimers.delete(id)
  }
}

async function runAnimationFrame(id: number): Promise<void> {
  await waitForNextProcessFrame()

  const callback = scheduledAnimationFrames.get(id)
  if (!callback) return

  scheduledAnimationFrames.delete(id)

  try {
    callback(performance.now())
  } catch (error) {
    reportAsyncError(error)
  }
}

export class GodotPerformance {
  readonly timeOrigin: number
  private _entries: GodotPerformanceEntry[] = []

  constructor() {
    const nativeTimeOrigin = nativePerformance?.timeOrigin
    this.timeOrigin =
      typeof nativeTimeOrigin === 'number'
        ? nativeTimeOrigin
        : fallbackTimeOrigin - initialMonotonicTime
  }

  now(): number {
    return nowMilliseconds() - initialMonotonicTime
  }

  mark(
    name: string,
    options: GodotPerformanceMarkOptions = {},
  ): GodotPerformanceMark {
    const mark = new GodotPerformanceMark(
      String(name),
      options.startTime ?? this.now(),
      options.detail,
    )
    this._entries.push(mark)
    return mark
  }

  measure(
    name: string,
    startOrOptions?: string | number | GodotPerformanceMeasureOptions,
    endMark?: string,
  ): GodotPerformanceMeasure {
    if (typeof startOrOptions === 'object' && startOrOptions !== null) {
      const start = this._resolveMeasureStart(startOrOptions)
      const end = this._resolveMeasureEnd(startOrOptions, start)
      const measure = new GodotPerformanceMeasure(
        String(name),
        start,
        Math.max(0, end - start),
        startOrOptions.detail,
      )
      this._entries.push(measure)
      return measure
    }

    const start =
      startOrOptions === undefined
        ? this._resolveTimePoint(undefined, 0)
        : this._resolveTimePoint(startOrOptions, 0)
    const end = this._resolveTimePoint(endMark, this.now())
    const measure = new GodotPerformanceMeasure(
      String(name),
      start,
      Math.max(0, end - start),
    )
    this._entries.push(measure)
    return measure
  }

  getEntries(): GodotPerformanceEntry[] {
    return [...this._entries]
  }

  getEntriesByName(name: string, type?: string): GodotPerformanceEntry[] {
    const expectedName = String(name)
    return this._entries.filter((entry) => {
      if (entry.name !== expectedName) return false
      return type === undefined || entry.entryType === type
    })
  }

  getEntriesByType(type: string): GodotPerformanceEntry[] {
    return this._entries.filter((entry) => entry.entryType === type)
  }

  clearMarks(name?: string): void {
    this._clearEntries('mark', name)
  }

  clearMeasures(name?: string): void {
    this._clearEntries('measure', name)
  }

  private _resolveMeasureStart(
    options: GodotPerformanceMeasureOptions,
  ): number {
    if (options.start !== undefined) {
      return this._resolveTimePoint(options.start, 0)
    }
    if (options.end !== undefined && options.duration !== undefined) {
      return this._resolveTimePoint(options.end, this.now()) - options.duration
    }
    return 0
  }

  private _resolveMeasureEnd(
    options: GodotPerformanceMeasureOptions,
    start: number,
  ): number {
    if (options.end !== undefined) {
      return this._resolveTimePoint(options.end, this.now())
    }
    if (options.duration !== undefined) {
      return start + options.duration
    }
    return this.now()
  }

  private _resolveTimePoint(
    point: string | number | undefined,
    fallback: number,
  ): number {
    if (typeof point === 'number') {
      return point
    }
    if (typeof point === 'string') {
      return this._findLatestMark(point).startTime
    }
    return fallback
  }

  private _findLatestMark(name: string): GodotPerformanceEntry {
    for (let index = this._entries.length - 1; index >= 0; index--) {
      const entry = this._entries[index]
      if (entry.entryType === 'mark' && entry.name === name) {
        return entry
      }
    }
    throw new Error(`performance mark "${name}" does not exist`)
  }

  private _clearEntries(type: string, name?: string): void {
    this._entries = this._entries.filter((entry) => {
      if (entry.entryType !== type) return true
      return name !== undefined && entry.name !== name
    })
  }
}

export const performance = new GodotPerformance()
