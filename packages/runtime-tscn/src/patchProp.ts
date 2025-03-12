import { warn } from '@vue/runtime-core'
import { isOn, isString } from '@vue/shared'
import type { TSCNNode } from './nodeOps'

// Map Vue/HTML properties to Godot properties
const propMap: Record<string, string> = {
  // Style properties
  width: 'rect_min_size/x',
  height: 'rect_min_size/y',
  backgroundColor: 'modulate', // This will need color conversion
  color: 'self_modulate',
  fontSize: 'custom_fonts/font_size',
  fontFamily: 'custom_fonts/font',
  textAlign: 'align',
  display: '_display', // Handle special cases like 'none'

  // Common properties
  disabled: 'disabled',
  value: 'text',
  checked: 'pressed',
  placeholder: 'placeholder_text',

  // Events will be handled separately

  // Add more mappings as needed
}

// Special case handlers for certain properties
const specialProps: Record<
  string,
  (el: TSCNNode, key: string, value: any) => void
> = {
  style: (el, key, value) => {
    // Handle style object or string
    if (!el.props) el.props = {}

    if (isString(value)) {
      // Parse style string and apply
      const styles = parseStyleString(value)
      for (const [styleName, styleValue] of Object.entries(styles)) {
        applyStyle(el, styleName, styleValue)
      }
    } else if (value && typeof value === 'object') {
      // Apply style object directly
      for (const [styleName, styleValue] of Object.entries(value)) {
        applyStyle(el, styleName, styleValue)
      }
    }
  },

  class: (el, key, value) => {
    // In Godot, we can potentially use theme classes or groups
    if (!el.props) el.props = {}
    el.props._class = value
  },
}

// Main function to patch a property on a TSCN node
export function patchProp(
  el: TSCNNode,
  key: string,
  prevValue: any,
  nextValue: any,
) {
  if (!el.props) {
    el.props = {}
  }

  // Check for event handlers
  if (isOn(key)) {
    // Convert Vue event handlers to Godot signals
    handleEventBinding(el, key, nextValue)
    return
  }

  // Skip if value is unchanged
  if (nextValue === prevValue) {
    return
  }

  // Special prop handling
  if (key in specialProps) {
    specialProps[key](el, key, nextValue)
    return
  }

  // Handle null/undefined value (property removal)
  if (nextValue == null) {
    delete el.props[key]
    return
  }

  // Map to Godot property if defined in mapping
  const godotProp = propMap[key] || key

  // Set the property
  el.props[godotProp] = convertValueForGodot(nextValue, key)
}

// Helper to parse style string into object
function parseStyleString(styleStr: string): Record<string, string> {
  const result: Record<string, string> = {}

  // Simple parser - split by semicolons and then by colons
  const styles = styleStr.split(';').filter(s => s.trim())

  for (const style of styles) {
    const [name, value] = style.split(':').map(s => s.trim())
    if (name && value) {
      result[name] = value
    }
  }

  return result
}

// Apply a single style property
function applyStyle(el: TSCNNode, name: string, value: any) {
  const godotStyleProp = propMap[name] || `_style_${name}`
  if (!el.props) el.props = {}
  el.props[godotStyleProp] = convertValueForGodot(value, name)
}

// Convert JavaScript values to appropriate Godot format
function convertValueForGodot(value: any, propName: string): any {
  // Handle different value types
  if (isString(value)) {
    return value
  } else if (typeof value === 'number') {
    return value
  } else if (typeof value === 'boolean') {
    return value
  } else if (Array.isArray(value)) {
    // Convert arrays to Godot vector types based on context
    if (['position', 'rect_position'].includes(propName)) {
      return `Vector2(${value[0]}, ${value[1]})`
    } else if (['scale', 'rect_scale'].includes(propName)) {
      return `Vector2(${value[0]}, ${value[1]})`
    } else if (['rotation_degrees'].includes(propName)) {
      return `Vector3(${value[0]}, ${value[1]}, ${value[2]})`
    } else if (['modulate', 'self_modulate'].includes(propName)) {
      // Assuming RGBA format
      return `Color(${value[0]}, ${value[1]}, ${value[2]}, ${value[3] || 1})`
    }
    return `[${value.join(', ')}]`
  } else if (value === null) {
    return null
  } else if (typeof value === 'object') {
    // Handle complex objects like resources
    return JSON.stringify(value)
  }

  // Fallback
  return String(value)
}

// Handle Vue events to Godot signals
function handleEventBinding(el: TSCNNode, key: string, value: any) {
  if (!el.props) el.props = {}

  // Extract event name from Vue event binding (onClick -> click)
  const eventName = key.slice(2).toLowerCase()

  // Map to corresponding Godot signal
  const signalName = mapEventToSignal(eventName, el.type)

  // Store the event handler for later code generation
  // In a real implementation, we would generate GDScript to connect these signals
  if (!el.props._signals) {
    el.props._signals = {}
  }

  el.props._signals[signalName] = {
    handler: value,
    event: eventName,
  }
}

// Map Vue events to Godot signals
function mapEventToSignal(event: string, nodeType: string): string {
  // Common mappings
  const commonMap: Record<string, string> = {
    click: 'pressed',
    change: 'value_changed',
    input: 'text_changed',
    focus: 'focus_entered',
    blur: 'focus_exited',
    keydown: 'gui_input',
    keyup: 'gui_input',
    keypress: 'gui_input',
    mouseenter: 'mouse_entered',
    mouseleave: 'mouse_exited',
    mousemove: 'gui_input',
    mousedown: 'gui_input',
    mouseup: 'gui_input',
  }

  // First check specific mappings for node type
  const nodeSpecificMap: Record<string, Record<string, string>> = {
    Button: {
      click: 'pressed',
    },
    LineEdit: {
      input: 'text_changed',
      change: 'text_entered',
    },
    CheckBox: {
      change: 'toggled',
    },
    // Add more node-specific mappings as needed
  }

  // Try node-specific mapping first
  if (nodeSpecificMap[nodeType] && nodeSpecificMap[nodeType][event]) {
    return nodeSpecificMap[nodeType][event]
  }

  // Fall back to common mapping
  return commonMap[event] || `_on_${event}`
}
