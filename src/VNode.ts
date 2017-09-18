import { mapEvent } from './Events'
import * as DOM from './DOM'
export default class VNode {
    type: string | Function | any;
    props: any;
    children: (VNode | string)[] | VNode;

    constructor(type, props) {
        this.type = type;
        this.props = props;
        this.children = props.children;
    }
}