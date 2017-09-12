var vclone = (function (exports) {
'use strict';

// Remove all children from this node.
function empty(node) {
    [].slice.call(node.childNodes).forEach(node.removeChild, node);
}

var createElement = function (tag, props, children) {
    console.log('createElement: ' + tag);
    throw "Not implemented";
};
var render = function (vdom, el) {
    empty(el);
};

exports.createElement = createElement;
exports.render = render;

return exports;

}({}));
