const SEPARATOR = '.';
const SUBSEPARATOR = ':';

//flatten all children 
// {
//      '.': , //parent component
//      '.0': //first child
//      '.0.0': //child of first child
//      '.0.1': //2nd child of first child
//      '.1': //second child    
// }

function traverseChildrenTree(children, currentPrefix, context) {
    if (!children)
        return;
        
    if (!Array.isArray(children)) {
        let childName = currentPrefix + SEPARATOR + "0";
        context[childName] = children;
        return;
    }

    children.forEach((child, index) => {
        let childName = currentPrefix + SEPARATOR + index;
        context[childName] = child;

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