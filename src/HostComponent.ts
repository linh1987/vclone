import VNode from './VNode'
import {IMountable} from './IMountable';

let hostComponentImplementation = null;

export function construct(node: VNode) {
    return new hostComponentImplementation(node);
}

export function constructTextNode(string) {
    return construct(new VNode('span', { children: string}));
}

export function injectImplementation(implemetation: any) {
    hostComponentImplementation = implemetation;
}