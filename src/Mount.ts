import VNode from './VNode'
import { mapEvent } from './Events'
import { renderAsDOM } from './VNodeRenderer'

export var mount = function (node: VNode): Element {
    return node.mount();
}