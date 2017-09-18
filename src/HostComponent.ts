import VNode from './VNode'
import {IMountable} from './IMountable';

let hostComponentImplementation = null;

export function construct(node: VNode) {
    return new hostComponentImplementation(node);
}

export function injectImplementation(implemetation: any) {
    hostComponentImplementation = implemetation;
}