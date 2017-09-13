import VNode from './VNode'

export default class Component {
    props : any = null;
    
    constructor (props : any) {
        this.props = props;
    }

    render() : VNode { 
        throw "Not implemented";
    }
}