import { ButtonGroup } from 'godot'

const radioGroups = new Map<string, ButtonGroup>()

export function getRadioButtonGroup(
  name: string | undefined,
): ButtonGroup | null {
  if (!name) {
    return null
  }

  const existing = radioGroups.get(name)
  if (existing) {
    return existing
  }

  const group = new ButtonGroup()
  radioGroups.set(name, group)
  return group
}
