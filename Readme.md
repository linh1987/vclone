# How to build
npm run build

# How to test
Run index.html. If the implementation is done right, you should see two spans with 
"Test" and "Description" in the DOM. 

By default we're testing using Inferno. Just toggle commenting these 4 lines to switch 
to our vclone implementation:

```
var e = vclone.createElement;
var r = vclone.render;
//var e = Inferno.createElement;
//var r = Inferno.render;
```