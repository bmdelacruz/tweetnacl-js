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
 * @type {{ prv1: string, prv2: string, pub1: string, pub2: string, sk: string }[]}
 */
var scalarMultData;

describe('nacl.scalarMult.scalarMultBase', function () {
    it('must recreate golden', function () {
        // This takes takes a bit of time.
        // Similar to https://code.google.com/p/go/source/browse/curve25519/curve25519_test.go?repo=crypto
        const golden = new Uint8Array([0x89, 0x16, 0x1f, 0xde, 0x88, 0x7b, 0x2b, 0x53, 0xde, 0x54,
            0x9a, 0xf4, 0x83, 0x94, 0x01, 0x06, 0xec, 0xc1, 0x14, 0xd6, 0x98, 0x2d,
            0xaa, 0x98, 0x25, 0x6d, 0xe2, 0x3b, 0xdf, 0x77, 0x66, 0x1a]);
        let input = new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        for (var i = 0; i < 200; i++) {
            input = nacl.scalarMult.scalarMultBase(input);
        }
        expect(input.toString()).to.equal(golden.toString());
    });
});
describe('nacl.scalarMult.scalarMult', function () {
    it('must produce expected values', function () {
        scalarMultData.forEach(d => {
            const prv1 = decodeBase64(d.prv1);
            const prv2 = decodeBase64(d.prv2);
            const pub1 = decodeBase64(d.pub1);
            const pub2 = decodeBase64(d.pub2);
            const sk = decodeBase64(d.sk);

            const jprv1 = nacl.scalarMult.scalarMultBase(prv1);
            expect(jprv1.toString()).to.equal(pub1.toString());

            const jprv2 = nacl.scalarMult.scalarMultBase(prv2);
            expect(jprv2.toString()).to.equal(pub2.toString());

            const skStr = sk.toString();

            const jsk1 = nacl.scalarMult.scalarMult(prv1, pub2);
            expect(jsk1.toString()).to.equal(skStr);

            const jsk2 = nacl.scalarMult.scalarMult(prv2, pub1);
            expect(jsk2.toString()).to.equal(skStr);
        });
    });
});