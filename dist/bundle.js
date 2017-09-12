var vclone = (function (exports) {
'use strict';

// Remove all children from this node.
function empty(node) {
    [].slice.call(node.childNodes).forEach(node.removeChild, node);
}

var VNode = (function () {
    function VNode(dom) {
        console.log('creating ' + JSON.stringify(dom));
        this.renderedDom = dom;
    }
    return VNode;
}());
var createElement = function (tag, props, children) {
    if (typeof tag === 'string') {
        var renderedDOM_1 = null;
        console.log('creating [' + tag + ']');
        renderedDOM_1 = document.createElement(tag);
        if (children && children.forEach) {
            children.forEach(function (child) {
                if (typeof child === 'string') {
                    var wrapper = document.createElement('span');
                    wrapper.textContent = child;
                    renderedDOM_1.appendChild(wrapper);
                }
                else {
                    renderedDOM_1.appendChild(child.renderedDom);
                }
            });
        }
        return new VNode(renderedDOM_1);
    }
    else if (typeof tag === 'function') {
        return tag();
    }
};
var render = function (vdom, el) {
    empty(el);
    el.appendChild(vdom.renderedDom);
};

exports.createElement = createElement;
exports.render = render;

return exports;

}({}));
