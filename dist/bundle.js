var vclone = (function (exports) {
'use strict';

// Remove all children from this node.
function empty(node) {
    [].slice.call(node.childNodes).forEach(node.removeChild, node);
}

var VNode = (function () {
    function VNode(el) {
        this.renderedDOM = el;
    }
    return VNode;
}());
var createElement = function (tag, props, children) {
    var renderedDOM = null;
    if (typeof tag === 'string') {
        renderedDOM = document.createElement(tag);
        if (typeof children === 'string')
            children = [children];
        if (children) {
            children.forEach(function (child) {
                var el = null;
                if (typeof child === 'string') {
                    var spanWrapper = document.createElement('span');
                    spanWrapper.textContent = child;
                    el = spanWrapper;
                }
                else {
                    el = child.renderedDOM;
                }
                renderedDOM.appendChild(el);
            });
        }
        return new VNode(renderedDOM);
    }
    else if (typeof tag === 'function') {
        return tag();
    }
};
var render = function (vdom, el) {
    empty(el);
    el.appendChild(vdom.renderedDOM);
};

exports.createElement = createElement;
exports.render = render;

return exports;

}({}));
