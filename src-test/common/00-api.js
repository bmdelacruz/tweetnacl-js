/**
 * @type {import('../../dist/umd/nacl')}
 */
var nacl;
/**
 * @type {Chai.ExpectStatic}
 */
var expect;

describe('input type check', function () {
    const nonce = new Uint8Array(nacl.secretBox.nonceLength);
    const key = new Uint8Array(nacl.secretBox.keyLength);
    const msg = new Uint8Array(10);
    const arr = [1, 2, 3];

    it('secretBox', function () {
        expect(() => nacl.secretBox.secretBox(arr, nonce, key)).to.throw(TypeError);
        expect(() => nacl.secretBox.secretBox(msg, arr, key)).to.throw(TypeError);
        expect(() => nacl.secretBox.secretBox(msg, nonce, arr)).to.throw(TypeError);
    });
    it('secretBoxOpen', function () {
        expect(() => nacl.secretBox.secretBoxOpen(arr, nonce, key)).to.throw(TypeError);
        expect(() => nacl.secretBox.secretBoxOpen(msg, arr, key)).to.throw(TypeError);
        expect(() => nacl.secretBox.secretBoxOpen(msg, nonce, arr)).to.throw(TypeError);
    });
    it('scalarMult', function () {
        expect(() => nacl.scalarMult.scalarMult(arr, key)).to.throw(TypeError);
        expect(() => nacl.scalarMult.scalarMult(key, arr)).to.throw(TypeError);
    });
    it('scalarMultBase', function () {
        expect(() => nacl.scalarMult.scalarMultBase(arr)).to.throw(TypeError);
    });
    it('box', function () {
        expect(() => nacl.box.box(arr, nonce, key, key)).to.throw(TypeError);
        expect(() => nacl.box.box(msg, arr, key, key)).to.throw(TypeError);
        expect(() => nacl.box.box(msg, nonce, arr, key)).to.throw(TypeError);
        expect(() => nacl.box.box(msg, nonce, key, arr)).to.throw(TypeError);
    });
    it('boxOpen', function () {
        expect(() => nacl.box.boxOpen(arr, nonce, key, key)).to.throw(TypeError);
        expect(() => nacl.box.boxOpen(msg, arr, key, key)).to.throw(TypeError);
        expect(() => nacl.box.boxOpen(msg, nonce, arr, key)).to.throw(TypeError);
        expect(() => nacl.box.boxOpen(msg, nonce, key, arr)).to.throw(TypeError);
    });
    it('boxBefore', function () {
        expect(() => nacl.box.boxBefore(arr, key)).to.throw(TypeError);
        expect(() => nacl.box.boxBefore(key, arr)).to.throw(TypeError);
    });
    it('boxAfter', function () {
        expect(() => nacl.box.boxAfter(arr, nonce, key)).to.throw(TypeError);
        expect(() => nacl.box.boxAfter(msg, arr, key)).to.throw(TypeError);
        expect(() => nacl.box.boxAfter(msg, nonce, arr)).to.throw(TypeError);
    });
    it('boxOpenAfter', function () {
        expect(() => nacl.box.boxOpenAfter(arr, nonce, key)).to.throw(TypeError);
        expect(() => nacl.box.boxOpenAfter(msg, arr, key)).to.throw(TypeError);
        expect(() => nacl.box.boxOpenAfter(msg, nonce, arr)).to.throw(TypeError);
    });
    it('boxKeyPairFromSecretKey', function () {
        expect(() => nacl.box.boxKeyPairFromSecretKey(arr)).to.throw(TypeError);
    });
    it('sign', function () {
        expect(() => nacl.sign.sign(arr, key)).to.throw(TypeError);
        expect(() => nacl.sign.sign(msg, arr)).to.throw(TypeError);
    });
    it('signOpen', function () {
        expect(() => nacl.sign.signOpen(arr, key)).to.throw(TypeError);
        expect(() => nacl.sign.signOpen(msg, arr)).to.throw(TypeError);
    });
    it('signDetached', function () {
        expect(() => nacl.sign.signDetached(arr, key)).to.throw(TypeError);
        expect(() => nacl.sign.signDetached(msg, arr)).to.throw(TypeError);
    });
    it('verifySignature', function () {
        expect(() => nacl.sign.verifySignature(arr, key, key)).to.throw(TypeError);
        expect(() => nacl.sign.verifySignature(msg, arr, key)).to.throw(TypeError);
        expect(() => nacl.sign.verifySignature(msg, key, arr)).to.throw(TypeError);
    });
    it('signKeyPairFromSecretKey', function () {
        expect(() => nacl.sign.signKeyPairFromSecretKey(arr)).to.throw(TypeError);
    });
    it('signKeyPairFromSeed', function () {
        expect(() => nacl.sign.signKeyPairFromSeed(arr)).to.throw(TypeError);
    });
    it('hash', function () {
        expect(() => nacl.hash.hash(arr)).to.throw(TypeError);
    });
    it('verify', function () {
        expect(() => nacl.verify(arr, msg)).to.throw(TypeError);
        expect(() => nacl.verify(msg, arr)).to.throw(TypeError);
    });
});