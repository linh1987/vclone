import * as DOM from './DOM'

class VNode {
    
    renderedDom: Element

    constructor(dom : Element) {
        console.log('creating ' + JSON.stringify(dom));
        this.renderedDom = dom;
    }
}

export const createElement = function (tag: string | Function, props: any, children: (VNode| string)[]): VNode {
    if (typeof tag === 'string') {
        let renderedDOM: Element = null;
        console.log('creating [' + tag + ']');
        renderedDOM = document.createElement(tag);

        if (children && children.forEach) {
            children.forEach((child) => {
                if (typeof child === 'string') {
                    const wrapper = document.createElement('span');
                    wrapper.textContent = child
                    renderedDOM.appendChild(wrapper)
                } else {
                    renderedDOM.appendChild(child.renderedDom);
                }
            })
        }

        return new VNode(renderedDOM);
    }
    else if (typeof tag === 'function') {
        return tag();
    }
}

export const render = function (vdom: VNode, el: Element) {
    DOM.empty(el);
    el.appendChild(vdom.renderedDom);
}