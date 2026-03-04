import type { Audio } from './components/Audio'
import type { Button } from './components/Button'
import type { Canvas } from './components/Canvas'
import type { Div } from './components/Div'
import type { Img } from './components/Img'
import type { Input } from './components/Input'
import type { Option, Select } from './components/Select'
import type { Span } from './components/Span'
import type { Svg } from './components/Svg'
import type { Textarea } from './components/Textarea'
import type { Video } from './components/Video'

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    Audio: typeof Audio
    Button: typeof Button
    Canvas: typeof Canvas
    Div: typeof Div
    Img: typeof Img
    Input: typeof Input
    Option: typeof Option
    Select: typeof Select
    Span: typeof Span
    Svg: typeof Svg
    Textarea: typeof Textarea
    Video: typeof Video
    // lowercase aliases — so <div>, <button> etc. resolve as components
    audio: typeof Audio
    button: typeof Button
    canvas: typeof Canvas
    div: typeof Div
    img: typeof Img
    input: typeof Input
    option: typeof Option
    select: typeof Select
    span: typeof Span
    svg: typeof Svg
    textarea: typeof Textarea
    video: typeof Video
  }
}
