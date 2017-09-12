import * as DOM from './DOM'

class VNode {

}

export var createElement = function(tag: string, props: any, children: VNode[]) : VNode {
    console.log('createElement: ' + tag);
    throw "Not implemented";
} 

export var render = function(vdom : VNode, el: Element) {
    DOM.empty(el);
}