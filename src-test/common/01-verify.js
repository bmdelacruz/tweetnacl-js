/**
 * @type {import('../../dist/umd/nacl')}
 */
var nacl;
/**
 * @type {Chai.ExpectStatic}
 */
var expect;

describe('nacl.verify', function () {
    it('equal arrays of length 1 should verify', function () {
        expect(nacl.verify(new Uint8Array(1), new Uint8Array(1))).to.true;
    });
    it('equal arrays of length 1000 should verify', function () {
        expect(nacl.verify(new Uint8Array(1000), new Uint8Array(1000))).to.true;
    });
    it('equal arrays should verify', function () {
        const [a, b] = createArrays();
        expect(nacl.verify(a, b)).to.true;
    });
    it('same arrays should verify', function () {
        const [a, _] = createArrays();
        expect(nacl.verify(a, a)).to.true;
    });
    it(`different arrays don't verify`, function () {
        const [a, b] = createArrays();
        b[0] = 255;
        expect(nacl.verify(a, b)).to.false;
    });
    it('arrays of different lengths should not verify', function () {
        expect(nacl.verify(new Uint8Array(1), new Uint8Array(10))).to.false;
    });
    it('zero-length arrays should not verify', function () {
        expect(nacl.verify(new Uint8Array(0), new Uint8Array(0))).to.false;
    });

    function createArrays() {
        const a = new Uint8Array(764), b = new Uint8Array(764);
        for (let i = 0; i < a.length; i++) {
            a[i] = b[i] = i & 0xff;
        }
        return [a, b];
    }
});