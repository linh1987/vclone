var vclone = (function (exports) {
'use strict';

// Remove all children from this node.
function empty(node) {
    [].slice.call(node.childNodes).forEach(node.removeChild, node);
}
//# sourceMappingURL=DOM.js.map

var VNode = (function () {
    function VNode(type, props, children) {
        this.type = type;
        this.props = props;
        this.children = children;
    }
    VNode.prototype.renderAsDOM = function () {
        var renderedDOM = null;
        renderedDOM = document.createElement(this.type);
        if (!this.children)
            this.children = [];
        if (typeof this.children === 'string' || this.children instanceof VNode)
            this.children = [this.children];
        this.children.forEach(function (child) {
            var el = null;
            if (typeof child === 'string') {
                var spanWrapper = document.createElement('span');
                spanWrapper.textContent = child;
                el = spanWrapper;
            }
            else {
                el = child.renderAsDOM();
            }
            renderedDOM.appendChild(el);
        });
        return renderedDOM;
    };
    return VNode;
}());

var Component = (function () {
    function Component(props) {
        this.props = null;
        this.props = props;
    }
    return Component;
}());

var createElement = function (type, props, children) {
    props = props || {};
    props.children = children;
    if (typeof type === 'string')
        return new VNode(type, props, children);
    else if (typeof type === 'function') {
        var composedNode = new type(props);
        if (composedNode instanceof VNode) {
            return composedNode;
        }
        else if (composedNode instanceof Component) {
            return composedNode.render();
        }
    }
    throw "unknown type supplied: " + type;
};
var render = function (vdom, el) {
    empty(el);
    el.appendChild(vdom.renderAsDOM());
};

exports.Component = Component;
exports.render = render;
exports.createElement = createElement;

return exports;

}({}));
