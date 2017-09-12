import * as DOM from './DOM'

class VNode {
    renderedDOM: Element;

    constructor(el: Element) {
        this.renderedDOM = el;
    }
}

export var createElement = function (tag: string | Function, props: any, children: (VNode | string)[] | string): VNode {
    let renderedDOM: Element = null;

    if (typeof tag === 'string') {
        renderedDOM = document.createElement(tag);
        if (typeof children === 'string')
            children = [children];
        
        if (children) {
            children.forEach((child) => {
                let el : Element = null;
                if (typeof child === 'string') {
                    var spanWrapper = document.createElement('span');
                    spanWrapper.textContent = child;
                    el = spanWrapper;
                }
                else {
                    el = child.renderedDOM;
                }

                renderedDOM.appendChild(el);
            })
        }
        return new VNode(renderedDOM);
    } else if (typeof tag === 'function') {
        return tag();
    }
}

export var render = function (vdom: VNode, el: Element) {
    DOM.empty(el);
    el.appendChild(vdom.renderedDOM);
}