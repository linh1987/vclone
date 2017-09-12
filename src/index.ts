import * as DOM from './DOM'
import VNode from './VNode'
import Component from './Component'


var createElement = function (type: string | Function | Component, props: any, children: (VNode | string)[] | string): VNode {
    props = props || {};
    props.children = children;

    if (typeof type === 'string')
        return new VNode(type, props, children);
    else if (typeof type === 'function') { 
        const composedNode = new (type as any)(props);
        if (composedNode instanceof VNode) {
            return composedNode;
        } else if (composedNode instanceof Component) {
            return composedNode.render()
        }
    }

    throw "unknown type supplied: " + type;
}

var render = function (vdom: VNode, el: Element) {
    DOM.empty(el);
    el.appendChild(vdom.renderAsDOM());
}

export { 
    Component,
    render, 
    createElement
};