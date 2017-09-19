import VNode from './VNode'
import { mapEvent } from './Events'
import * as DOM from './DOM'
import { IMountable } from './IMountable';
import initializeNode from './initializeNode'
import { flattenChildren } from './ChildReconciler'

export class DOMVNodeWrapper implements IMountable {
    dom: Element;
    currentNode: VNode;
    renderedChildren: any;

    constructor(node: VNode) {
        this.currentNode = node;
        this.dom = null;
    }

    receive(nextNode) {
        this.update(this.currentNode, nextNode);
    }

    update(prevNode, nextNode) {
        this.currentNode = nextNode;
        //this.mountProperties({}, this.currentNode.props);
        //DOM.empty(this.dom)

        this.updateChildren(nextNode.children);
    }

    mount(): Element {
        const type = this.currentNode.type;
        const props = this.currentNode.props;

        this.dom = this.renderAsDOM(type as string, props)

        this.mountProperties({}, props);
        this.mountInitialChildren();

        return this.dom;
    }

    private updateChildren(nextChildren) {
        let prevRenderedChildren = this.renderedChildren || {};
        let nextRenderedChildren = flattenChildren(nextChildren);
        this.renderedChildren = nextRenderedChildren

        Object.keys(nextRenderedChildren).forEach((childKey) => {
            let prevChild = null;

            if (prevRenderedChildren.hasOwnProperty(childKey))
                prevChild = prevRenderedChildren[childKey] as IMountable;
            let nextChild = nextRenderedChildren[childKey] as IMountable;


            if (prevChild && prevChild.currentNode.type !== nextChild.currentNode.type) {
                prevChild.dom.replaceWith(nextChild.mount());
            } else {
                if (prevChild) {
                    prevChild.receive(nextChild.currentNode)
                    nextRenderedChildren[childKey] = prevChild;
                } else {
                    let renderedNextChild = nextChild.mount();
                    if (!(nextChild as any).renderedChildren) {
                        //text node
                        this.dom.textContent = nextChild.dom.textContent;
                        this.renderedChildren = null; 
                    }
                    else {
                        //new component
                        this.dom.appendChild(nextChild.mount());
                    }
                }
            }
        });

        Object.keys(prevRenderedChildren).forEach((childKey) => {
            if (!nextRenderedChildren.hasOwnProperty(childKey)) {
                DOM.removeChild(this.dom, prevRenderedChildren[childKey].dom)
            }
        })
    }

    private mountInitialChildren() {
        //short circuit here
        if (typeof this.currentNode.children === 'string') {
            this.dom.textContent = this.currentNode.children;
        }
        else {
            let flattenedChildren = flattenChildren(this.currentNode.children)

            Object.keys(flattenedChildren).forEach((childKey, index) => {
                let child = flattenedChildren[childKey];
                child._mountIndex = index;
                this.dom.appendChild(child.mount());
            })

            this.renderedChildren = flattenedChildren;
        }
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