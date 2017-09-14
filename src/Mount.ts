import VNode from './VNode'
import { mapEvent } from './Events'

export var mount = function (node: VNode): Element {
    return node.mount();
}