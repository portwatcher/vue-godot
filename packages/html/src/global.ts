import type { A } from './components/A.js'
import type { Audio } from './components/Audio.js'
import type { Button } from './components/Button.js'
import type { Canvas } from './components/Canvas.js'
import type { Div } from './components/Div.js'
import type { Img } from './components/Img.js'
import type { Input } from './components/Input.js'
import type { Option, Select } from './components/Select.js'
import type { ScrollView } from './components/ScrollView.js'
import type { Span } from './components/Span.js'
import type { Svg } from './components/Svg.js'
import type { Textarea } from './components/Textarea.js'
import type { Video } from './components/Video.js'

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    A: typeof A
    Audio: typeof Audio
    Button: typeof Button
    Canvas: typeof Canvas
    Div: typeof Div
    Img: typeof Img
    Input: typeof Input
    Option: typeof Option
    ScrollView: typeof ScrollView
    Select: typeof Select
    Span: typeof Span
    Svg: typeof Svg
    Textarea: typeof Textarea
    Video: typeof Video
    // Lowercase aliases so <div>, <button>, etc. resolve as components.
    a: typeof A
    audio: typeof Audio
    button: typeof Button
    canvas: typeof Canvas
    div: typeof Div
    img: typeof Img
    input: typeof Input
    option: typeof Option
    scrollview: typeof ScrollView
    select: typeof Select
    span: typeof Span
    svg: typeof Svg
    textarea: typeof Textarea
    video: typeof Video
  }
}
