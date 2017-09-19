import initializeNode from './initializeNode'

const SEPARATOR = '.';
const SUBSEPARATOR = ':';

function traverseChildrenTree(children, currentPrefix, context) {
    if (!children)
        return;
        
    if (typeof children === 'string' || !Array.isArray(children)) {
        let childName = currentPrefix + SEPARATOR + "0";
        context[childName] = initializeNode(children);
        return;
    }

    children.forEach((child, index) => {
        let childName = currentPrefix + SEPARATOR + index;

        traverseChildrenTree(child, childName, context)
    })
}

function flattenChildren(children) {   
    let flattenedChildren = {}

    traverseChildrenTree(children, '', flattenedChildren);

    return flattenedChildren;
}

export {
    flattenChildren
}