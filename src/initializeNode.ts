import VNode from './VNode';
import { IMountable } from './IMountable'
import { construct } from './HostComponent';

//create an actual node with valid DOM tag as type
export default function initializeNode(node: VNode): IMountable {
    try {

        const type = node.type;
        const props = node.props;
        if (typeof type === "string") {
            return construct(node)
        }

        if (typeof type === 'function') {
            const composedNode = new (type as any)(props);
            if ((composedNode as any).isComponentClass) {
                composedNode.currentNode = node;
                return (composedNode as IMountable); //
            } else
                return construct(composedNode as VNode);
        }

    } catch (error) {
        console.log(node);
    }
}