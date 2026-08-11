import { Node } from 'godot'

export default class PlainJavaScript extends Node {
  echo(value) {
    return `plain:${String(value)}`
  }
}
