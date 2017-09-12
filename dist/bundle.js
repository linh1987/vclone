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
        if (children) {
            if (typeof children === 'string') {
                var spanWrapper = document.createElement('span');
                spanWrapper.textContent = children;
                renderedDOM.appendChild(spanWrapper);
            }
            else {
                children.forEach(function (child) {
                    if (typeof child === 'string') {
                        var spanWrapper = document.createElement('span');
                        spanWrapper.textContent = child;
                        renderedDOM.appendChild(spanWrapper);
                    }
                    else {
                        renderedDOM.appendChild(child.renderedDOM);
                    }
                });
            }
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
