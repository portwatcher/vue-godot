import type { A } from './components/A.js'
import type { ActivityIndicator } from './components/ActivityIndicator.js'
import type { Audio } from './components/Audio.js'
import type { Button } from './components/Button.js'
import type { Canvas } from './components/Canvas.js'
import type { Dialog } from './components/Dialog.js'
import type { Div } from './components/Div.js'
import type { Form } from './components/Form.js'
import type { Img } from './components/Img.js'
import type { Input } from './components/Input.js'
import type { KeyboardAvoidingView } from './components/KeyboardAvoidingView.js'
import type { Label } from './components/Label.js'
import type { Modal } from './components/Modal.js'
import type { Option, Select } from './components/Select.js'
import type { Overlay } from './components/Overlay.js'
import type { Pressable } from './components/Pressable.js'
import type { Progress } from './components/Progress.js'
import type { SafeAreaView } from './components/SafeAreaView.js'
import type { ScrollView } from './components/ScrollView.js'
import type { Span } from './components/Span.js'
import type { Svg } from './components/Svg.js'
import type { Switch } from './components/Switch.js'
import type { Textarea } from './components/Textarea.js'
import type { Video } from './components/Video.js'
import type { VirtualList } from './components/VirtualList.js'

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    A: typeof A
    ActivityIndicator: typeof ActivityIndicator
    Audio: typeof Audio
    Button: typeof Button
    Canvas: typeof Canvas
    Dialog: typeof Dialog
    Div: typeof Div
    Form: typeof Form
    Img: typeof Img
    Input: typeof Input
    KeyboardAvoidingView: typeof KeyboardAvoidingView
    Label: typeof Label
    Modal: typeof Modal
    Option: typeof Option
    Overlay: typeof Overlay
    Pressable: typeof Pressable
    Progress: typeof Progress
    SafeAreaView: typeof SafeAreaView
    ScrollView: typeof ScrollView
    Select: typeof Select
    Span: typeof Span
    Svg: typeof Svg
    Switch: typeof Switch
    Textarea: typeof Textarea
    Video: typeof Video
    VirtualList: typeof VirtualList
    // Lowercase aliases so <div>, <button>, etc. resolve as components.
    a: typeof A
    activityindicator: typeof ActivityIndicator
    audio: typeof Audio
    button: typeof Button
    canvas: typeof Canvas
    dialog: typeof Dialog
    div: typeof Div
    form: typeof Form
    img: typeof Img
    input: typeof Input
    keyboardavoidingview: typeof KeyboardAvoidingView
    label: typeof Label
    modal: typeof Modal
    option: typeof Option
    overlay: typeof Overlay
    pressable: typeof Pressable
    progress: typeof Progress
    safeareaview: typeof SafeAreaView
    scrollview: typeof ScrollView
    select: typeof Select
    span: typeof Span
    svg: typeof Svg
    switch: typeof Switch
    textarea: typeof Textarea
    video: typeof Video
    virtuallist: typeof VirtualList
  }
}
