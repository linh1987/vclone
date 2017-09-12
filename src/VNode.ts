export default class VNode {
    renderedDOM: Element;
    type: string;
    props: any;
    children: (VNode | string)[] | VNode;

    constructor(type, props, children) {
        this.type = type;
        this.props = props;
        this.children = children;
    }

    renderAsDOM(): Element {
        let renderedDOM: Element = null;

        renderedDOM = document.createElement(this.type);
        if (!this.children)
            this.children = [];
            
        if (typeof this.children === 'string' || this.children instanceof VNode)
            this.children = [this.children];

        this.children.forEach((child) => {
            let el: Element = null;
            if (typeof child === 'string') {
                var spanWrapper = document.createElement('span');
                spanWrapper.textContent = child;
                el = spanWrapper;
            }
            else {
                el = child.renderAsDOM();
            }

            renderedDOM.appendChild(el);
        })

        return renderedDOM;
    }
}