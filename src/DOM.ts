// Remove all children from this node.
export function empty(node: Element) {
    [].slice.call(node.childNodes).forEach(node.removeChild, node);
}

export function removeProperty(node, attr) {
    node.removeAttribute(attr);
}
