var fs = require('fs');
var browserify = require('browserify');
var watchify = require('watchify');
var tsify = require('tsify');
const exorcist = require('exorcist');

var b = browserify({
  cache: {},
  packageCache: {},
  plugin: [watchify],
  debug: true
});

// var list = [
//   ["ts/views/index.ts", 'js/dist/index-bundle.js', "js/dist/index-bundle.js.map"],
//   ["ts/views/login.ts", 'js/dist/login-bundle.js', "js/dist/login-bundle.js.map"]
// ]

var list = [
  ["ts/view.ts", "js/dist/bundle.js", "js/dist/bundle.js.map"]
]
b.on('update', bundle);
bundle();

function bundle() {
  for (let i of list) {
    b.add(i[0])
    .transform(
      "babelify", {
        presets: ["@babel/preset-env"]
      }
    )
    .plugin(tsify, { noImplicitAny: true })
    .bundle()
    .on('error', console.error)
    .pipe(exorcist(i[2]))
    .pipe(fs.createWriteStream(i[1]))
  }
}