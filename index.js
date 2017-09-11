export var createElement = function(tag, prop, children) {
    console.log('createElement: ' + tag)
} 

export var render = function(vdom, el) {
    console.log('rendering:' + el)
}