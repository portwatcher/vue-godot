import {
  AudioStreamGenerator,
  AudioStreamPlayer,
  Callable,
  ClassDB,
  HTTPClient,
  Label,
  Node,
  OS,
  ResourceLoader,
  Time,
  Timer,
  VideoStreamPlayer,
  WebSocketPeer,
} from 'godot'
import type { Callable0 } from 'godot'

const PASS_MARKER = '[godot-js-runtime-contract] PASS'
const EXIT_MARKER = '[godot-js-runtime-contract] EXIT'
const FAILURE_MARKER = '[godot-js-runtime-contract] FAIL'

function assertContract(
  condition: unknown,
  description: string,
): asserts condition {
  if (!condition) {
    throw new Error(`Contract assertion failed: ${description}`)
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.stack ?? error.message : String(error)
}

export default class RuntimeContract extends Node {
  private enteredTree = false
  private readyCalled = false
  private processCalled = false
  private signalObserved = false
  private chunkObserved = false
  private failed = false
  private finished = false
  private timer: Timer | null = null
  private timerCallable: Callable0<void> | null = null

  _enter_tree(): void {
    this.enteredTree = true
  }

  _ready(): void {
    try {
      this.runSynchronousContract()
      this.readyCalled = true
      this.startSignalContract()

      void import('./chunk').then(
        (module) => {
          assertContract(
            module.asyncContractMarker === 'vite-relative-chunk',
            'relative Vite chunk exports its marker',
          )
          this.chunkObserved = true
        },
        (error: unknown) => {
          this.fail(error)
        },
      )
    } catch (error) {
      this.fail(error)
    }
  }

  _process(_delta: number): void {
    this.processCalled = true
    if (
      !this.failed &&
      !this.finished &&
      this.enteredTree &&
      this.readyCalled &&
      this.processCalled &&
      this.signalObserved &&
      this.chunkObserved
    ) {
      this.finished = true
      console.log(
        `${PASS_MARKER} classdb properties signals callable resource environment timing networking media promise chunk lifecycle`,
      )
      this.get_tree().quit(0)
    }
  }

  _exit_tree(): void {
    if (
      this.timer &&
      this.timerCallable &&
      this.timer.timeout.is_connected(this.timerCallable)
    ) {
      this.timer.timeout.disconnect(this.timerCallable)
    }
    this.timerCallable = null
    this.timer = null
    console.log(EXIT_MARKER)
  }

  private runSynchronousContract(): void {
    const label = new Label()
    assertContract(label instanceof Node, 'Label inherits Node')
    label.text = 'direct-property'
    assertContract(label.text === 'direct-property', 'direct property access')
    label.set('text', 'dynamic-property')
    assertContract(label.get('text') === 'dynamic-property', 'dynamic get/set')
    label.free()

    assertContract(ClassDB.class_exists('Label'), 'ClassDB finds Label')
    assertContract(ClassDB.can_instantiate('Label'), 'ClassDB instantiates Label')
    const dynamicLabel = ClassDB.instantiate('Label')
    assertContract(dynamicLabel instanceof Label, 'ClassDB preserves inheritance')
    dynamicLabel.free()

    let callableInvoked = false
    const callable = Callable.create(this, () => {
      callableInvoked = true
    })
    assertContract(callable.is_valid(), 'Callable is valid')
    callable.call()
    assertContract(callableInvoked, 'Callable invokes JavaScript')

    const resource = ResourceLoader.load('res://contract-resource.tres')
    assertContract(
      resource.resource_name === 'runtime-contract-resource',
      'ResourceLoader loads the fixture resource',
    )

    assertContract(
      OS.has_environment('GODOT_JS_RUNTIME_CONTRACT'),
      'OS exposes the smoke environment variable',
    )
    assertContract(
      OS.get_environment('GODOT_JS_RUNTIME_CONTRACT') === 'phase-0-baseline',
      'OS reads the smoke environment value',
    )

    const ticks = Time.get_ticks_msec()
    assertContract(
      typeof ticks === 'number' || typeof ticks === 'bigint',
      'Time exposes integer ticks',
    )

    const http = new HTTPClient()
    assertContract(http instanceof HTTPClient, 'HTTPClient is constructible')
    assertContract(typeof http.get_status() === 'number', 'HTTP status is readable')
    http.close()

    const webSocket = new WebSocketPeer()
    assertContract(
      webSocket instanceof WebSocketPeer,
      'WebSocketPeer is constructible',
    )
    assertContract(
      typeof webSocket.get_ready_state() === 'number',
      'WebSocket state is readable',
    )

    const generator = new AudioStreamGenerator()
    generator.mix_rate = 22_050
    const audioPlayer = new AudioStreamPlayer()
    audioPlayer.stream = generator
    assertContract(
      audioPlayer.stream === generator,
      'media Resource wrapper identity is preserved',
    )
    audioPlayer.free()

    const videoPlayer = new VideoStreamPlayer()
    assertContract(!videoPlayer.is_playing(), 'VideoStreamPlayer is constructible')
    videoPlayer.free()
  }

  private startSignalContract(): void {
    this.timer = new Timer()
    this.timer.one_shot = true
    this.timer.wait_time = 0.05
    this.add_child(this.timer)

    this.timerCallable = Callable.create(this, () => {
      this.signalObserved = true
    })
    this.timer.timeout.connect(this.timerCallable)
    assertContract(
      this.timer.timeout.is_connected(this.timerCallable),
      'Signal retains its Callable connection',
    )
    this.timer.start()
  }

  private fail(error: unknown): void {
    if (this.failed) {
      return
    }
    this.failed = true
    console.error(`${FAILURE_MARKER} ${errorMessage(error)}`)
    this.get_tree().quit(1)
  }
}
