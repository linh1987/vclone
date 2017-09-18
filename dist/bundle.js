var vclone = (function (exports) {
'use strict';

// Remove all children from this node.
function empty(node) {
    [].slice.call(node.childNodes).forEach(node.removeChild, node);
}
function removeProperty(node, attr) {
    node.removeAttribute(attr);
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
function injectImplementation(implemetation) {
    hostComponentImplementation = implemetation;
}
//# sourceMappingURL=HostComponent.js.map

function initializeNode(node) {
    try {
        var type = node.type;
        var props = node.props;
        if (typeof type === "string") {
            return construct(node);
        }
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
        this.mountProperties({}, this.currentNode.props);
        empty(this.dom);
        this.mountChildren();
    };
    DOMVNodeWrapper.prototype.mount = function () {
        var type = this.currentNode.type;
        var props = this.currentNode.props;
        this.dom = this.renderAsDOM(type, props);
        this.mountProperties({}, props);
        this.mountChildren();
        return this.dom;
    };
    DOMVNodeWrapper.prototype.mountChildren = function () {
        var _this = this;
        var children = this.currentNode.children;
        if (!children)
            children = [];
        if (typeof children === 'string' || children instanceof VNode)
            children = [children];
        children.forEach(function (child) {
            var el = null;
            if (typeof child === 'string') {
                el = _this.renderAsDOM("span", {});
                el.textContent = child;
            }
            else {
                el = initializeNode(child).mount();
            }
            _this.dom.appendChild(el);
        });
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
