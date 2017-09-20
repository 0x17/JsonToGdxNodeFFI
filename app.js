const jsontogdx = require('./jsontogdx.js');

jsontogdx.setGAMSDirectories('/home/andre/Downloads/gams24.9_linux_x64_64_sfx/', '/home/andre/Desktop/');
console.log(jsontogdx.readJsonFromGdxFile('example.gdx'));