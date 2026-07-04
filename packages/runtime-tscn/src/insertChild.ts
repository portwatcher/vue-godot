type InsertableNode = {
  get_parent(): InsertParentNode | null
  get_index(): number
}

type InsertParentNode = InsertableNode & {
  add_child(child: InsertableNode): void
  remove_child(child: InsertableNode): void
  move_child(child: InsertableNode, toIndex: number): void
  get_child_count(): number
}

export function insertChildBeforeAnchor(
  child: InsertableNode,
  parent: InsertParentNode,
  anchor: InsertableNode | null,
): void {
  if (!anchor) {
    const currentParent = child.get_parent()
    if (currentParent && currentParent !== parent) {
      currentParent.remove_child(child)
    }
    if (currentParent !== parent) {
      parent.add_child(child)
      return
    }
    const lastIndex = parent.get_child_count() - 1
    if (child.get_index() !== lastIndex) {
      parent.move_child(child, lastIndex)
    }
    return
  }

  const currentParent = child.get_parent()
  if (currentParent && currentParent !== parent) {
    currentParent.remove_child(child)
  }
  if (currentParent !== parent) {
    parent.add_child(child)
  }

  let targetIndex = anchor.get_index()

  if (currentParent === parent && child.get_index() < targetIndex) {
    targetIndex -= 1
  }

  parent.move_child(child, targetIndex)
}
