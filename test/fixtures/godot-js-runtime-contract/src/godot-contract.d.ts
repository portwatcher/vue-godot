interface RuntimeContractConsole {
  log(...values: unknown[]): void
  error(...values: unknown[]): void
}

declare const console: RuntimeContractConsole

declare module 'godot' {
  class Object {
    free(): void
    get(property: string): unknown
    set(property: string, value: unknown): void
  }

  class SceneTree extends Object {
    quit(exitCode?: number): void
  }

  class Node extends Object {
    add_child(child: Node): void
    get_tree(): SceneTree
  }

  class Label extends Node {
    text: string
  }

  interface Callable0<Result = void> {
    call(): Result
    is_valid(): boolean
  }

  class Callable {
    static create<Result>(callback: () => Result): Callable0<Result>
    static create<Result>(
      owner: Object,
      callback: () => Result,
    ): Callable0<Result>
  }

  interface Signal0 {
    connect(callable: Callable0<void>): void
    disconnect(callable: Callable0<void>): void
    is_connected(callable: Callable0<void>): boolean
  }

  class Timer extends Node {
    one_shot: boolean
    wait_time: number
    readonly timeout: Signal0
    start(timeSeconds?: number): void
  }

  class ClassDB {
    static class_exists(className: string): boolean
    static can_instantiate(className: string): boolean
    static instantiate(className: string): Object
  }

  class Resource extends Object {
    resource_name: string
  }

  class ResourceLoader {
    static load(path: string): Resource
  }

  class OS {
    static has_environment(variable: string): boolean
    static get_environment(variable: string): string
  }

  class Time {
    static get_ticks_msec(): number | bigint
  }

  class HTTPClient extends Object {
    close(): void
    get_status(): number
  }

  class WebSocketPeer extends Object {
    get_ready_state(): number
  }

  class AudioStreamGenerator extends Object {
    mix_rate: number
  }

  class AudioStreamPlayer extends Node {
    stream: AudioStreamGenerator
  }

  class VideoStreamPlayer extends Node {
    is_playing(): boolean
  }
}
