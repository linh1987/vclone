var vclone = (function (exports) {
'use strict';

// Remove all children from this node.
function empty(node) {
    [].slice.call(node.childNodes).forEach(node.removeChild, node);
}
//# sourceMappingURL=DOM.js.map

var createElement = function (tag, props, children) {
    console.log('createElement: ' + tag);
    return null;
};
var render = function (vdom, el) {
    empty(el);
};

exports.createElement = createElement;
exports.render = render;

return exports;

}({}));
