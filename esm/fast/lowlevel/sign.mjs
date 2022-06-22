import { crypto_hash } from './hash.mjs';
import { I } from '../../lowlevel/sign.mjs';
import { randombytes } from '../../prng.mjs';
import { crypto_verify_32 } from '../../lowlevel/verify.mjs';
import { A, add, D, gf, gf0, gf1, inv25519, M, modL, pack25519, pow2523, S, scalarbase, scalarmult, set25519, unpack25519, Z } from './primitives.mjs';

export {
    crypto_sign_BYTES,
    crypto_sign_PUBLICKEYBYTES,
    crypto_sign_SECRETKEYBYTES,
    crypto_sign_SEEDBYTES,
} from '../../lowlevel/sign.mjs';

function reduce(r) {
    var x = new Float64Array(64), i;
    for (i = 0; i < 64; i++) x[i] = r[i];
    for (i = 0; i < 64; i++) r[i] = 0;
    modL(r, x);
}

function par25519(a) {
    var d = new Uint8Array(32);
    pack25519(d, a);
    return d[0] & 1;
}

function pack(r, p) {
    var tx = gf(), ty = gf(), zi = gf();
    inv25519(zi, p[2]);
    M(tx, p[0], zi);
    M(ty, p[1], zi);
    pack25519(r, ty);
    r[31] ^= par25519(tx) << 7;
}

// Note: difference from C - smlen returned, not passed as argument.
export function crypto_sign(sm, m, n, sk) {
    var d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
    var i, j, x = new Float64Array(64);
    var p = [gf(), gf(), gf(), gf()];

    crypto_hash(d, sk, 32);
    d[0] &= 248;
    d[31] &= 127;
    d[31] |= 64;

    var smlen = n + 64;
    for (i = 0; i < n; i++) sm[64 + i] = m[i];
    for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i];

    crypto_hash(r, sm.subarray(32), n + 32);
    reduce(r);
    scalarbase(p, r);
    pack(sm, p);

    for (i = 32; i < 64; i++) sm[i] = sk[i];
    crypto_hash(h, sm, n + 64);
    reduce(h);

    for (i = 0; i < 64; i++) x[i] = 0;
    for (i = 0; i < 32; i++) x[i] = r[i];
    for (i = 0; i < 32; i++) {
        for (j = 0; j < 32; j++) {
            x[i + j] += h[i] * d[j];
        }
    }

    modL(sm.subarray(32), x);
    return smlen;
}

export function crypto_sign_keypair(pk, sk, seeded) {
    var d = new Uint8Array(64);
    var p = [gf(), gf(), gf(), gf()];
    var i;

    if (!seeded) randombytes(sk, 32);
    crypto_hash(d, sk, 32);
    d[0] &= 248;
    d[31] &= 127;
    d[31] |= 64;

    scalarbase(p, d);
    pack(pk, p);

    for (i = 0; i < 32; i++) sk[i + 32] = pk[i];
    return 0;
}

function neq25519(a, b) {
    var c = new Uint8Array(32), d = new Uint8Array(32);
    pack25519(c, a);
    pack25519(d, b);
    return crypto_verify_32(c, 0, d, 0);
}

function unpackneg(r, p) {
    var t = gf(), chk = gf(), num = gf(),
        den = gf(), den2 = gf(), den4 = gf(),
        den6 = gf();

    set25519(r[2], gf1);
    unpack25519(r[1], p);
    S(num, r[1]);
    M(den, num, D);
    Z(num, num, r[2]);
    A(den, r[2], den);

    S(den2, den);
    S(den4, den2);
    M(den6, den4, den2);
    M(t, den6, num);
    M(t, t, den);

    pow2523(t, t);
    M(t, t, num);
    M(t, t, den);
    M(t, t, den);
    M(r[0], t, den);

    S(chk, r[0]);
    M(chk, chk, den);
    if (neq25519(chk, num)) M(r[0], r[0], I);

    S(chk, r[0]);
    M(chk, chk, den);
    if (neq25519(chk, num)) return -1;

    if (par25519(r[0]) === (p[31] >> 7)) Z(r[0], gf0, r[0]);

    M(r[3], r[0], r[1]);
    return 0;
}

export function crypto_sign_open(m, sm, n, pk) {
    var i;
    var t = new Uint8Array(32), h = new Uint8Array(64);
    var p = [gf(), gf(), gf(), gf()],
        q = [gf(), gf(), gf(), gf()];

    if (n < 64) return -1;

    if (unpackneg(q, pk)) return -1;

    for (i = 0; i < n; i++) m[i] = sm[i];
    for (i = 0; i < 32; i++) m[i + 32] = pk[i];
    crypto_hash(h, m, n);
    reduce(h);
    scalarmult(p, q, h);

    scalarbase(q, sm.subarray(32));
    add(p, q);
    pack(t, p);

    n -= 64;
    if (crypto_verify_32(sm, 0, t, 0)) {
        for (i = 0; i < n; i++) m[i] = 0;
        return -1;
    }

    for (i = 0; i < n; i++) m[i] = sm[i + 64];
    return n;
}