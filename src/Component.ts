import VNode from './VNode';
import { flattenChildren } from './ChildReconciler'
import initializeNode from './initializeNode'
import {IMountable} from './IMountable';

class Component implements IMountable {
    props: any = null;
    state: any = null;
    currentNode: VNode = null;
    renderedNode: VNode = null;
    renderedComponent: IMountable = null;
    isComponentClass: boolean = true;
    dom: Element = null;

    constructor(props) {
        this.props = props;
    }

    setState(nextState) {
        this.state = nextState;
        this.update(this.currentNode, this.currentNode);
    }

    mount(): Element {
        this.renderedNode = this.render();
        this.renderedComponent = initializeNode(this.renderedNode);
        this.dom = this.renderedComponent.mount()
        return this.dom;
    }

    update(prevNode, nextNode) {
        this.props = nextNode.props;
        this.currentNode = nextNode;

        const nextRenderedNode = this.render();
        if (nextRenderedNode.type === this.renderedNode.type) {
            this.renderedComponent.receive(nextRenderedNode);
        }
        else {
            const newRenderedComponent = initializeNode(this.currentNode);

            this.renderedComponent.dom.replaceWith(newRenderedComponent.mount());
            this.renderedComponent = newRenderedComponent;
            this.dom = this.renderedComponent.dom;
        }

        this.renderedNode = nextRenderedNode;
    }

    receive(nextNode) {
        this.update(this.currentNode, nextNode)
    }


    render(): VNode {
        throw "Not implemented exception";
    }
}

export { Component }