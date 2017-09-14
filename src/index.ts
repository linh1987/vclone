import * as DOM from './DOM'
import VNode from './VNode'
import { Component } from './Component'
import { mount} from './Mount'


var createElement = function (type: string | Function | Component, props: any, children: (VNode | string)[] | string | VNode): VNode {
    props = props || {};
    props.children = children;

    return new VNode(type, props, children);
}

var render = function (vdom: VNode, el: Element) {
    DOM.empty(el);

    console.log(vdom)
    el.appendChild(vdom.mount());
}

export { 
    Component,
    render, 
    createElement
};
