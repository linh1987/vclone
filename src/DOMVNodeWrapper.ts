import VNode from './VNode'
import { mapEvent } from './Events'
import * as DOM from './DOM'
import { IMountable } from './IMountable';
import initializeNode from './initializeNode'

export class DOMVNodeWrapper implements IMountable {
    dom: Element;
    currentNode: VNode;
    currentChildren: IMountable[];
    
    constructor(node: VNode) {
        this.currentNode = node;
        this.dom = null;
    }

    receive(nextNode) {
        this.update(this.currentNode, nextNode);
    }

    update(prevNode, nextNode) {
        this.currentNode = nextNode;
        this.mountProperties({}, this.currentNode.props);
        DOM.empty(this.dom)
        
        this.mountChildren();
    }

    mount(): Element {
        const type = this.currentNode.type;
        const props = this.currentNode.props;

        this.dom = this.renderAsDOM(type as string, props)

        this.mountProperties({}, props);
        this.mountChildren();

        return this.dom;
    }

    private mountChildren() {
        let children = this.currentNode.children;

        if (!children)
            children = [];

        if (typeof children === 'string' || children instanceof VNode)
            children = [children];

        children.forEach((child) => {
            let el: Element = null;
            if (typeof child === 'string') {
                el = this.renderAsDOM("span", {});
                el.textContent = child;
            }
            else {
                el = initializeNode(child).mount();
            }

            this.dom.appendChild(el);
        })
    }

    private mountProperties(prevProps, currentProps) {
        Object.keys(prevProps).forEach((key) => {
            DOM.removeProperty(this.dom, key);
        })

        Object.keys(currentProps).forEach((key) => {
            let currentKey = key;
            let currentValue = currentProps[key];

            if (currentKey === 'children')
                return;

            if (currentKey === 'className')
                currentKey = 'class';


            if (typeof currentValue === 'function') {
                this.dom.addEventListener(mapEvent(currentKey), currentValue);
            }
            else {
                this.dom.setAttribute(currentKey, currentValue)
            }
        });
    }

    private renderAsDOM(type: string, props: any): Element {
        let renderedDOM: Element = null;

        renderedDOM = document.createElement(type);

        return renderedDOM;
    }
}