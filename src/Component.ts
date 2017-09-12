import VNode from './VNode';

export default abstract class Component {
    props: any = null;

    constructor(props) {
        this.props = props;
    }

    abstract render() : VNode;
}