/**
 * @type {import('../../dist/umd/nacl')}
 */
var nacl;
/**
 * @type {Chai.ExpectStatic}
 */
var expect;

/**
 * @type {{ m: Uint8Array, k: Uint8Array, out: Uint8Array }[]}
 */
var oneTimeAuthData;

describe('nacl.lowlevel.crypto_onetimeauth', function () {
    it('must produce expected values', function () {
        const out = new Uint8Array(16);
        oneTimeAuthData.forEach(d => {
            nacl.lowLevel.crypto_onetimeauth(
                out, 0, d.m, 0, d.m.length, d.k,
            );
            expect(out.toString()).to.equal(d.out.toString());
        });
    });
});