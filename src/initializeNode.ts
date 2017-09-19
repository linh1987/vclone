import VNode from './VNode';
import { IMountable } from './IMountable'
import { construct, constructTextNode } from './HostComponent';

//create an actual node with valid DOM tag as type
export default function initializeNode(node: VNode | string): IMountable {
    try {
        if (typeof node === 'string') {
            return constructTextNode(node);
        }
        else {
            const type = node.type;
            const props = node.props;

            if (typeof type === 'string')
                return construct(node);

            if (typeof type === 'function') {
                const composedNode = new (type as any)(props);
                if ((composedNode as any).isComponentClass) {
                    composedNode.currentNode = node;
                    return (composedNode as IMountable); //
                } else
                    return construct(composedNode as VNode);
            }
        }
    } catch (error) {
        console.log(node);
    }
}