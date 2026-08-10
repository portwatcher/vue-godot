import {
  AudioStreamMP3,
  Callable,
  HTTPClient,
  Image,
  Input,
  Node2D,
  PackedByteArray,
  Timer,
  Vector2,
} from 'godot'
import {
  defineScript,
  hasFeature,
  runtimeFeatures,
  runtimeVersion,
} from 'godot-js'
import { callable, to_array_buffer } from 'godot-jsb'

class Player extends Node2D {
  speed = 240

  _process(delta: number): void {
    const direction = Input.get_vector(
      'ui_left',
      'ui_right',
      'ui_up',
      'ui_down',
    )
    const distance = this.speed * delta
    this.position = new Vector2(
      this.position.x + direction.x * distance,
      this.position.y + direction.y * distance,
    )
  }
}

const definedPlayer = defineScript(Player, {
  properties: {
    speed: { type: 'float', default: 240, hint: { range: [0, 1000, 1] } },
  },
  signals: {
    moved: [{ name: 'distance', type: 'float' }],
  },
})

const modernCallable: Callable<readonly [number], number> = Callable.create(
  (distance: number) => distance * 2,
)
const compatibilityCallable = callable((distance: number) => distance * 2)
const bytes = new PackedByteArray()
const bytesFromBuffer = new PackedByteArray(new Uint8Array([1, 2]).buffer)
bytes.append_array(new Uint8Array([3]))
const image = new Image()
image.load_png_from_buffer(new ArrayBuffer(0))
const stream = new AudioStreamMP3()
stream.data = new ArrayBuffer(0)
const client = new HTTPClient()
client.request_raw(
  HTTPClient.Method.METHOD_GET,
  '/',
  ['accept: text/plain'],
  new ArrayBuffer(0),
)
const buffer: ArrayBuffer = to_array_buffer(bytes)
const timeoutPromise: Promise<void> = new Timer().timeout.as_promise()

void modernCallable
void compatibilityCallable
void bytesFromBuffer
void image
void stream
void client
void buffer
void timeoutPromise
void runtimeVersion()
void runtimeFeatures()
void hasFeature('source-maps')

export default definedPlayer
