const ffi = require('ffi');

const JSON_TO_GDX_LIB_PATH = '/media/sf_Dropbox/Arbeit/Code/JsonToGdx/cmake-build-debug/libJsonToGdxLib.so';

const lib = ffi.Library(JSON_TO_GDX_LIB_PATH, {
    'setGAMSDirectories': [ 'void', ['string', 'string'] ],
    'writeJsonStrToGdxFile': [ 'void', ['string', 'string'] ],
    'solveModelWithDataJsonStr': [ 'string', ['string', 'string'] ],
    'setGAMSOptions': ['void', ['string']],
    'readJsonStrFromGdxFile': ['string', ['string']]
});

module.exports = {
    'setGAMSDirectories': lib.setGAMSDirectories,
    'writeJsonToGdxFile': function(json, gdxfn) { lib.writeJsonStrToGdxFile(JSON.stringify(json), gdxfn); },
    'solveModelWithDataJson': function(modelCode, json) { return JSON.parse(lib.solveModelWithDataJsonStr(modelCode, JSON.stringify(json))); },
    'setGAMSOptions': function(options) { lib.setGAMSOptions(JSON.stringify(options)); },
    'readJsonFromGdxFile': function(gdxfn) { return JSON.parse(lib.readJsonStrFromGdxFile(gdxfn)); }
};