import * as DOM from './DOM'
import VNode from './VNode'
import { Component } from './Component'
import { mount} from './Mount'
import { injectImplementation } from './HostComponent'
import {DOMVNodeWrapper} from './DOMVNodeWrapper';
import initializeNode from './initializeNode';

injectImplementation(DOMVNodeWrapper);

var createElement = function (type: string | Function | Component, props: any, children: (VNode | string)[] | string | VNode): VNode {
    props = props || {};
    props.children = children;

    return new VNode(type, props);
}

var render = function (vdom: VNode, el: Element) {
    DOM.empty(el);

    el.appendChild(initializeNode(vdom).mount());
}

export { 
    Component,
    render, 
    createElement
};
