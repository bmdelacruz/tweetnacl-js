var nacl = require('../dist/umd/nacl');
var expect = require('chai').expect;
var decodeBase64 = s => new Uint8Array(Buffer.from(s, 'base64'));
nacl.useNodeCryptoPRNG();