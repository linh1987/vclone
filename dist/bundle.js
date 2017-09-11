var vclone = (function (exports) {
'use strict';

var createElement = function(tag, prop, children) {
    console.log('createElement: ' + tag);
}; 

var render = function(vdom, el) {
    console.log('rendering:' + el);
};

exports.createElement = createElement;
exports.render = render;

return exports;

}({}));
