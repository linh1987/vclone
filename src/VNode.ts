import { mapEvent } from './Events'
import * as DOM from './DOM'
export default class VNode {
    type: string | Function | any;
    props: any;
    children: (VNode | string)[] | VNode;
    dom: Element;

    constructor(type, props, children) {
        this.type = type;
        this.props = props;
        this.children = children;
    }

    unmount() {
        this.dom = null;
    }

    update(nextProps: any, nextChildren: any) {
        this.children = nextChildren;

        this.mountProperties(this.props, nextProps);
        DOM.empty(this.dom)
        this.mountChildren();

        this.props = nextProps;
    }

    mount(): Element {
        const type = this.type;
        const props = this.props;


        if (typeof type === "string") {
            this.dom = this.renderAsDOM(type as string, props)
        }

        if (typeof type === 'function') {
            const composedNode = new (type as any)(props);
            if ((composedNode as any).isComponentClass) {
                this.dom = (composedNode as any).mountComponent()
            } else
                this.dom = (composedNode as VNode).mount();
        }

        this.mountProperties({}, props);
        this.mountChildren();
        return this.dom;
    }

    private mountChildren() {
        let children = this.children;

        if (!children)
            children = [];

        if (typeof children === 'string' || children instanceof VNode)
            children = [children];
        
        children.forEach((child) => {
            let el: Element = null;
            if (typeof child === 'string') {
                var spanWrapper = document.createElement('span');
                spanWrapper.textContent = child;
                el = spanWrapper;
            }
            else {
                el = child.mount();
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