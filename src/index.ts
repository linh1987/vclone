import * as DOM from './DOM'
import Component from './Component'
import VNode from './VNode'

var createElement = function (type: string | Function | Component, props: any, children: (VNode | string)[] | string | VNode): VNode {
    let renderedDOM: Element = null;

    if (typeof type === 'string') {
        renderedDOM = document.createElement(type);
        if (typeof children === 'string' || children instanceof VNode)
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
    } else if (typeof type === 'function') {
        var tempInstance = new (type as any)(props);

        if (tempInstance instanceof VNode)
            return tempInstance;
        else if (tempInstance instanceof Component)
            return tempInstance.render();
    }
}

var render = function (vdom: VNode, el: Element) {
    DOM.empty(el);
    el.appendChild(vdom.renderedDOM);
}


export {
    render, createElement, Component
}