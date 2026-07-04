import { insertChildBeforeAnchor } from './insertChild.js'

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

type StaticFactories<TNode extends InsertableNode> = {
  createTextNode(text: string): TNode
  createPlaceholderNode(content: string): TNode
}

export function supportsPlainTextStaticContent(content: string): boolean {
  return content.length > 0 && !/[<&]/.test(content)
}

export function insertStaticContentNode<
  TNode extends InsertableNode,
  TParent extends InsertParentNode,
>(
  content: string,
  parent: TParent,
  anchor: TNode | null,
  factories: StaticFactories<TNode>,
): [TNode, TNode] {
  const node = supportsPlainTextStaticContent(content)
    ? factories.createTextNode(content)
    : factories.createPlaceholderNode(content)

  insertChildBeforeAnchor(node, parent, anchor)
  return [node, node]
}
