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
 * @type {{ pub1: string, prv2: string, nonce: string, msg: string, box: string }[]}
 */
var boxData;

describe('nacl.box.box', function () {
    it('must produce expected values', function () {
        boxData.forEach(d => {
            const pub1 = decodeBase64(d.pub1);
            const prv2 = decodeBase64(d.prv2);
            const nonce = decodeBase64(d.nonce);
            const msg = decodeBase64(d.msg);
            const goodBox = decodeBase64(d.box);
            const box = nacl.box.box(msg, nonce, pub1, prv2);
            expect(box.toString()).to.equal(goodBox.toString());
            const openedBox = nacl.box.boxOpen(goodBox, nonce, pub1, prv2);
            expect(openedBox.toString()).to.equal(msg.toString());
        });
    });
});
describe('nacl.box.boxKeyPair', function () {
    it('must produce a valid key pair', function () {
        const keys = nacl.box.boxKeyPair();
        expect(keys.secretKey).to.be.not.null;
        expect(keys.secretKey.length).to.equal(nacl.box.secretKeyLength);
        expect(keys.publicKey).to.be.not.null;
        expect(keys.publicKey.length).to.equal(nacl.box.publicKeyLength);
        expect(keys.secretKey.toString())
            .to.not.equal(keys.publicKey.toString());
    });
});
describe('nacl.box.boxKeyPairFromSecretKey', function () {
    it('must produce a valid key pair', function () {
        const originalKeys = nacl.box.boxKeyPair();
        const keys = nacl.box.boxKeyPairFromSecretKey(originalKeys.secretKey);
        expect(keys.secretKey.toString())
            .to.equal(originalKeys.secretKey.toString());
        expect(keys.publicKey.toString())
            .to.equal(originalKeys.publicKey.toString());
    });
});
describe('nacl.box.boxOpen', function () {
    it('must produce expected values', function () {
        const clientKeys = nacl.box.boxKeyPair();
        const serverKeys = nacl.box.boxKeyPair();

        const nonce = new Uint8Array(nacl.box.nonceLength);
        for (let i = 0; i < nonce.length; i++) nonce[i] = (32 + i) & 0xff;

        const textEncoder = new TextEncoder();
        const message = textEncoder.encode('message to encrypt');

        const clientBox = nacl.box.box(message, nonce, serverKeys.publicKey, clientKeys.secretKey);
        const clientMessage = nacl.box.boxOpen(clientBox, nonce, clientKeys.publicKey, serverKeys.secretKey);
        expect(clientMessage.toString()).to.equal(message.toString());

        const serverBox = nacl.box.box(message, nonce, clientKeys.publicKey, serverKeys.secretKey);
        const serverMessage = nacl.box.boxOpen(serverBox, nonce, serverKeys.publicKey, clientKeys.secretKey);
        expect(serverMessage.toString()).to.equal(message.toString());
    });
    it('must return null if box is invalid', function () {
        const clientKeys = nacl.box.boxKeyPair();
        const serverKeys = nacl.box.boxKeyPair();
        const nonce = new Uint8Array(nacl.box.nonceLength);
        expect(nacl.box.boxOpen(new Uint8Array(0), nonce, serverKeys.publicKey, clientKeys.secretKey)).to.be.null;
        expect(nacl.box.boxOpen(new Uint8Array(10), nonce, serverKeys.publicKey, clientKeys.secretKey)).to.be.null;
        expect(nacl.box.boxOpen(new Uint8Array(100), nonce, serverKeys.publicKey, clientKeys.secretKey)).to.be.null;
    });
    it('must return null if nonce is invalid', function () {
        const clientKeys = nacl.box.boxKeyPair();
        const serverKeys = nacl.box.boxKeyPair();
        const nonce = new Uint8Array(nacl.box.nonceLength);
        for (let i = 0; i < nonce.length; i++) nonce[i] == i & 0xff;

        const textEncoder = new TextEncoder();
        const message = textEncoder.encode('message to encrypt');

        const serverBox = nacl.box.box(message, nonce, clientKeys.publicKey, serverKeys.secretKey);
        const serverMessage = nacl.box.boxOpen(serverBox, nonce, serverKeys.publicKey, clientKeys.secretKey);
        expect(serverMessage.toString()).to.equal(message.toString());

        nonce[0] = 255;
        const invalidServerMessage = nacl.box.boxOpen(serverBox, nonce, serverKeys.publicKey, clientKeys.secretKey);
        expect(invalidServerMessage).to.null;
    });
    it('must return null if keys are invalid', function () {
        const clientKeys = nacl.box.boxKeyPair();
        const serverKeys = nacl.box.boxKeyPair();
        const nonce = new Uint8Array(nacl.box.nonceLength);

        const textEncoder = new TextEncoder();
        const message = textEncoder.encode('message to encrypt');

        const clientBox = nacl.box.box(message, nonce, serverKeys.publicKey, clientKeys.secretKey);
        const clientMessage = nacl.box.boxOpen(clientBox, nonce, clientKeys.publicKey, serverKeys.secretKey);
        expect(clientMessage.toString()).to.equal(message.toString());

        const serverBox = nacl.box.box(message, nonce, clientKeys.publicKey, serverKeys.secretKey);
        const serverMessage = nacl.box.boxOpen(serverBox, nonce, serverKeys.publicKey, clientKeys.secretKey);
        expect(serverMessage.toString()).to.equal(message.toString());

        const badPublicKey = new Uint8Array(nacl.box.publicKeyLength);
        const badClientMessage = nacl.box.boxOpen(clientBox, nonce, badPublicKey, serverKeys.secretKey);
        expect(badClientMessage).to.be.null;

        const badSecretKey = new Uint8Array(nacl.box.secretKeyLength);
        const badServerMessage = nacl.box.boxOpen(serverBox, nonce, serverKeys.publicKey, badSecretKey);
        expect(badServerMessage).to.be.null;
    });
});