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
        // this.updateComponent();
    }
    
    mountComponent() : Element {
        let node = this.render();
        this.node = node;

        return node.mount();
    }

    updateComponent() {
        
    }

    render(): VNode {
        throw "Not implemented exception";
    }
}

export { Component }