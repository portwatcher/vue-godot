export async function renderWhenAsyncPropSettles(
  render,
  propName,
  shouldWait,
) {
  let vnode = render()
  if (!shouldWait || vnode.props?.[propName] != null) {
    return vnode
  }

  for (let attempt = 0; attempt < 10; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 0))
    vnode = render()
    if (vnode.props?.[propName] != null) {
      return vnode
    }
  }

  return vnode
}
