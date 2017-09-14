var vclone = (function (exports) {
'use strict';

// Remove all children from this node.
function empty(node) {
    [].slice.call(node.childNodes).forEach(node.removeChild, node);
}
function removeProperty(node, attr) {
    node.removeAttribute(attr);
}

function mapEvent(eventName) {
    switch (eventName.toLowerCase()) {
        case 'onclick':
            return 'click';
        default:
            return 'unknown';
    }
}

var VNode = (function () {
    function VNode(type, props, children) {
        this.type = type;
        this.props = props;
        this.children = children;
    }
    VNode.prototype.unmount = function () {
        this.dom = null; //not working
    };
    VNode.prototype.update = function (nextProps, nextChildren) {
        this.children = nextChildren;
        this.mountProperties(this.props, nextProps);
        empty(this.dom);
        this.mountChildren();
        this.props = nextProps;
    };
    VNode.prototype.mount = function () {
        var type = this.type;
        var props = this.props;
        if (typeof type === "string") {
            this.dom = this.renderAsDOM(type, props);
        }
        if (typeof type === 'function') {
            var composedNode = new type(props);
            if (composedNode.isComponentClass) {
                this.dom = composedNode.render().mount();
            }
            else
                this.dom = composedNode.mount();
        }
        this.mountProperties({}, props);
        this.mountChildren();
        return this.dom;
    };
    VNode.prototype.mountChildren = function () {
        var _this = this;
        var children = this.children;
        if (!children)
            children = [];
        if (typeof children === 'string' || children instanceof VNode)
            children = [children];
        children.forEach(function (child) {
            var el = null;
            if (typeof child === 'string') {
                var spanWrapper = document.createElement('span');
                spanWrapper.textContent = child;
                el = spanWrapper;
            }
            else {
                el = child.mount();
            }
            _this.dom.appendChild(el);
        });
    };
    VNode.prototype.mountProperties = function (prevProps, currentProps) {
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
    VNode.prototype.renderAsDOM = function (type, props) {
        var renderedDOM = null;
        renderedDOM = document.createElement(type);
        return renderedDOM;
    };
    return VNode;
}());

var Component = (function () {
    function Component(props) {
        this.props = null;
        this.state = null;
        this.node = null;
        this.isComponentClass = true;
        this.props = props;
    }
    Component.prototype.setState = function (nextState) {
        this.state = nextState;
        // this.updateComponent();
    };
    Component.prototype.mountComponent = function () {
        var node = this.render();
        this.node = node;
        return node.mount();
    };
    Component.prototype.updateComponent = function () {
        var newNode = this.render();
        console.log(newNode);
        console.log(this.node);
        if (newNode.type !== this.node.type) {
            console.log('reseting type');
            this.node.dom.replaceWith(newNode.mount());
        }
        else {
            console.log('updating dom');
            this.node.update(newNode.props, newNode.children);
        }
    };
    Component.prototype.render = function () {
        throw "Not implemented exception";
    };
    return Component;
}());

var createElement = function (type, props, children) {
    props = props || {};
    props.children = children;
    return new VNode(type, props, children);
};
var render = function (vdom, el) {
    empty(el);
    console.log(vdom);
    el.appendChild(vdom.mount());
};

exports.Component = Component;
exports.render = render;
exports.createElement = createElement;

return exports;

}({}));
