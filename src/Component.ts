import VNode from './VNode'

export default class Component {
    prop : any = null;
    
    constructor (prop : any) {
        this.prop = prop;
    }

    render() : VNode { 
        throw "Not implemented";
    }
}