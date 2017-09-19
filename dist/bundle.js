var vclone = (function (exports) {
'use strict';

// Remove all children from this node.
function empty(node) {
    [].slice.call(node.childNodes).forEach(node.removeChild, node);
}
function removeProperty(node, attr) {
    node.removeAttribute(attr);
}
function removeChild(node, child) {
    node.removeChild(child);
}
//# sourceMappingURL=DOM.js.map

var VNode = (function () {
    function VNode(type, props) {
        this.type = type;
        this.props = props;
        this.children = props.children;
    }
    return VNode;
}());

var hostComponentImplementation = null;
function construct(node) {
    return new hostComponentImplementation(node);
}
function constructTextNode(string) {
    return construct(new VNode('span', { children: string }));
}
function injectImplementation(implemetation) {
    hostComponentImplementation = implemetation;
}
//# sourceMappingURL=HostComponent.js.map

function initializeNode(node) {
    try {
        if (typeof node === 'string') {
            return constructTextNode(node);
        }
        else {
            var type = node.type;
            var props = node.props;
            if (typeof type === 'string')
                return construct(node);
            if (typeof type === 'function') {
                var composedNode = new type(props);
                if (composedNode.isComponentClass) {
                    composedNode.currentNode = node;
                    return composedNode; //
                }
                else
                    return construct(composedNode);
            }
        }
    }
    catch (error) {
        console.log(node);
    }
}
//# sourceMappingURL=initializeNode.js.map

var Component = (function () {
    function Component(props) {
        this.props = null;
        this.state = null;
        this.currentNode = null;
        this.renderedNode = null;
        this.renderedComponent = null;
        this.isComponentClass = true;
        this.dom = null;
        this.props = props;
    }
    Component.prototype.setState = function (nextState) {
        this.state = nextState;
        this.update(this.currentNode, this.currentNode);
    };
    Component.prototype.mount = function () {
        this.renderedNode = this.render();
        this.renderedComponent = initializeNode(this.renderedNode);
        this.dom = this.renderedComponent.mount();
        return this.dom;
    };
    Component.prototype.update = function (prevNode, nextNode) {
        this.props = nextNode.props;
        this.currentNode = nextNode;
        var nextRenderedNode = this.render();
        if (nextRenderedNode.type === this.renderedNode.type) {
            this.renderedComponent.receive(nextRenderedNode);
        }
        else {
            var newRenderedComponent = initializeNode(this.currentNode);
            this.renderedComponent.dom.replaceWith(newRenderedComponent.mount());
            this.renderedComponent = newRenderedComponent;
            this.dom = this.renderedComponent.dom;
        }
        this.renderedNode = nextRenderedNode;
    };
    Component.prototype.receive = function (nextNode) {
        this.update(this.currentNode, nextNode);
    };
    Component.prototype.render = function () {
        throw "Not implemented exception";
    };
    return Component;
}());

function mapEvent(eventName) {
    switch (eventName.toLowerCase()) {
        case 'onclick':
            return 'click';
        default:
            return 'unknown';
    }
}
//# sourceMappingURL=Events.js.map

var SEPARATOR = '.';
function traverseChildrenTree(children, currentPrefix, context) {
    if (!children)
        return;
    if (typeof children === 'string' || !Array.isArray(children)) {
        var childName = currentPrefix + SEPARATOR + "0";
        context[childName] = initializeNode(children);
        return;
    }
    children.forEach(function (child, index) {
        var childName = currentPrefix + SEPARATOR + index;
        traverseChildrenTree(child, childName, context);
    });
}
function flattenChildren(children) {
    var flattenedChildren = {};
    traverseChildrenTree(children, '', flattenedChildren);
    return flattenedChildren;
}

var DOMVNodeWrapper = (function () {
    function DOMVNodeWrapper(node) {
        this.currentNode = node;
        this.dom = null;
    }
    DOMVNodeWrapper.prototype.receive = function (nextNode) {
        this.update(this.currentNode, nextNode);
    };
    DOMVNodeWrapper.prototype.update = function (prevNode, nextNode) {
        this.currentNode = nextNode;
        //this.mountProperties({}, this.currentNode.props);
        //DOM.empty(this.dom)
        this.updateChildren(nextNode.children);
    };
    DOMVNodeWrapper.prototype.mount = function () {
        var type = this.currentNode.type;
        var props = this.currentNode.props;
        this.dom = this.renderAsDOM(type, props);
        this.mountProperties({}, props);
        this.mountInitialChildren();
        return this.dom;
    };
    DOMVNodeWrapper.prototype.updateChildren = function (nextChildren) {
        var _this = this;
        var prevRenderedChildren = this.renderedChildren || {};
        var nextRenderedChildren = flattenChildren(nextChildren);
        this.renderedChildren = nextRenderedChildren;
        Object.keys(nextRenderedChildren).forEach(function (childKey) {
            var prevChild = null;
            if (prevRenderedChildren.hasOwnProperty(childKey))
                prevChild = prevRenderedChildren[childKey];
            var nextChild = nextRenderedChildren[childKey];
            if (prevChild && prevChild.currentNode.type !== nextChild.currentNode.type) {
                prevChild.dom.replaceWith(nextChild.mount());
            }
            else {
                if (prevChild) {
                    prevChild.receive(nextChild.currentNode);
                    nextRenderedChildren[childKey] = prevChild;
                }
                else {
                    var renderedNextChild = nextChild.mount();
                    if (!nextChild.renderedChildren) {
                        //text node
                        _this.dom.textContent = nextChild.dom.textContent;
                        _this.renderedChildren = null;
                    }
                    else {
                        //new component
                        _this.dom.appendChild(nextChild.mount());
                    }
                }
            }
        });
        Object.keys(prevRenderedChildren).forEach(function (childKey) {
            if (!nextRenderedChildren.hasOwnProperty(childKey)) {
                removeChild(_this.dom, prevRenderedChildren[childKey].dom);
            }
        });
    };
    DOMVNodeWrapper.prototype.mountInitialChildren = function () {
        var _this = this;
        //short circuit here
        if (typeof this.currentNode.children === 'string') {
            this.dom.textContent = this.currentNode.children;
        }
        else {
            var flattenedChildren_1 = flattenChildren(this.currentNode.children);
            Object.keys(flattenedChildren_1).forEach(function (childKey, index) {
                var child = flattenedChildren_1[childKey];
                child._mountIndex = index;
                _this.dom.appendChild(child.mount());
            });
            this.renderedChildren = flattenedChildren_1;
        }
    };
    DOMVNodeWrapper.prototype.mountProperties = function (prevProps, currentProps) {
        var _this = this;
        Object.keys(prevProps).forEach(function (key) {
            removeProperty(_this.dom, key);
        });
        Object.keys(currentProps).forEach(function (key) {
            var currentKey = key;
            var currentValue = currentProps[key];
            if (currentKey === 'children')
                return;
            if (currentKey === 'className')
                currentKey = 'class';
            if (typeof currentValue === 'function') {
                _this.dom.addEventListener(mapEvent(currentKey), currentValue);
            }
            else {
                _this.dom.setAttribute(currentKey, currentValue);
            }
        });
    };
    DOMVNodeWrapper.prototype.renderAsDOM = function (type, props) {
        var renderedDOM = null;
        renderedDOM = document.createElement(type);
        return renderedDOM;
    };
    return DOMVNodeWrapper;
}());

injectImplementation(DOMVNodeWrapper);
var createElement = function (type, props, children) {
    props = props || {};
    props.children = children;
    return new VNode(type, props);
};
var render = function (vdom, el) {
    empty(el);
    el.appendChild(initializeNode(vdom).mount());
};

exports.Component = Component;
exports.render = render;
exports.createElement = createElement;

return exports;

}({}));
