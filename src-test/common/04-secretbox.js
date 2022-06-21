/**
 * @type {import('../../dist/umd/nacl')}
 */
var nacl;
/**
 * @type {Chai.ExpectStatic}
 */
var expect;
/**
 * @type {(s: string) => Uint8Array}
 */
var decodeBase64;
/**
 * @type {{ m: string, k: string, n: string, b: string }[]}
 */
var secretBoxData;

describe('nacl.secretBox.secretBox', function () {
    it('must produce expected values', function () {
        secretBoxData.forEach(d => {
            const key = decodeBase64(d.k);
            const nonce = decodeBase64(d.n);
            const msg = decodeBase64(d.m);
            const goodBox = decodeBase64(d.b);
            const box = nacl.secretBox.secretBox(msg, nonce, key);
            expect(box.toString()).to.equal(goodBox.toString());
        });
    });
});
describe('nacl.secretBox.secretBoxOpen', function () {
    it('must open box', function () {
        const key = new Uint8Array(nacl.secretBox.keyLength);
        for (let i = 0; i < key.length; i++) key[i] = i & 0xff;
        const nonce = new Uint8Array(nacl.secretBox.nonceLength);
        for (let i = 0; i < nonce.length; i++) nonce[i] = (i + 32) & 0xff;
        const encoder = new TextEncoder();
        const msg = encoder.encode('message to encrypt');
        const box = nacl.secretBox.secretBox(msg, nonce, key);
        expect(nacl.secretBox.secretBoxOpen(box, nonce, key).toString()).to.equal(msg.toString());
    });
    it('must open box with message lengths of 0 to 1024', function () {
        const nonce = new Uint8Array(nacl.secretBox.nonceLength);
        const key = new Uint8Array(nacl.secretBox.keyLength);
        for (let i = 0; i < key.length; i++) key[i] = i & 0xff;
        const fullMsg = new Uint8Array(1024);
        for (let i = 0; i < fullMsg.length; i++) fullMsg[i] = i & 0xff;
        for (let i = 0; i < fullMsg.length; i++) {
            const msg = fullMsg.subarray(0, i);
            const box = nacl.secretBox.secretBox(msg, nonce, key);
            expect(nacl.secretBox.secretBoxOpen(box, nonce, key).toString()).to.equal(msg.toString());
        }
    });
    it('must return null when box is invalid', function () {
        const key = new Uint8Array(nacl.secretBox.keyLength);
        const nonce = new Uint8Array(nacl.secretBox.nonceLength);
        expect(nacl.secretBox.secretBoxOpen(new Uint8Array(0), nonce, key)).to.be.null;
        expect(nacl.secretBox.secretBoxOpen(new Uint8Array(10), nonce, key)).to.be.null;
        expect(nacl.secretBox.secretBoxOpen(new Uint8Array(100), nonce, key)).to.be.null;
    });
    it('must return null when nonce is invalid', function () {
        const key = new Uint8Array(nacl.secretBox.keyLength);
        const nonce = new Uint8Array(nacl.secretBox.nonceLength);
        for (let i = 0; i < nonce.length; i++) nonce[i] = i & 0xff;
        const encoder = new TextEncoder();
        const msg = encoder.encode('message to encrypt');
        const box = nacl.secretBox.secretBox(msg, nonce, key);
        expect(nacl.secretBox.secretBoxOpen(box, nonce, key).toString()).to.equal(msg.toString());
        nonce[0] = 255;
        expect(nacl.secretBox.secretBoxOpen(box, nonce, key)).to.be.null;
    });
    it('must return null when key is invalid', function () {
        const key = new Uint8Array(nacl.secretBox.keyLength);
        for (let i = 0; i < key.length; i++) key[i] = i & 0xff;
        const nonce = new Uint8Array(nacl.secretBox.nonceLength);
        const encoder = new TextEncoder();
        const msg = encoder.encode('message to encrypt');
        const box = nacl.secretBox.secretBox(msg, nonce, key);
        expect(nacl.secretBox.secretBoxOpen(box, nonce, key).toString()).to.equal(msg.toString());
        key[0] = 255;
        expect(nacl.secretBox.secretBoxOpen(box, nonce, key)).to.be.null;
    });
});