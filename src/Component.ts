import VNode from './VNode';

class Component {
    props: any = null;
    state: any = null;
    node: VNode = null;
    isComponentClass: boolean = true;

    constructor(props) {
        this.props = props; 
    }

    setState(nextState) {
        this.state = nextState;
        this.updateComponent();
    }
    
    mountComponent() : Element {
        let node = this.render();
        this.node = node;

        return node.mount();
    }

    updateComponent() {
        let newNode = this.render();

        if (newNode.type !== this.node.type) {
            console.log('reseting type');
            this.node.dom.replaceWith(newNode.mount())
        } else {
            this.node.update(newNode.props, newNode.children)
        }
        
    }

    render(): VNode {
        throw "Not implemented exception";
    }
}

export { Component }