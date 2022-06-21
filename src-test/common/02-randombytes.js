/**
 * @type {import('../../dist/umd/nacl')}
 */
var nacl;
/**
 * @type {Chai.ExpectStatic}
 */
var expect;

describe('nacl.randomBytes', function () {
    it('must not produce duplicate random sequence', function () {
        const set = new Set();
        var i, s;
        for (i = 0; i < 10000; i++) {
            s = nacl.randomBytes(32).toString();
            if (set.has(s)) {
                expect.fail();
            }
            set.add(s);
        }
    });
});