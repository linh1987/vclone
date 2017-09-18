import VNode from './VNode';
export interface IMountable {
    currentNode: VNode;
    mount(): Element;
    receive(nextNode);
    update(prevNode, nextNode);
    dom: Element;
}