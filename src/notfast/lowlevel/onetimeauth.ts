import { crypto_verify_16 } from '../../common/lowlevel/verify.js';

function add1305(h, c) {
    var j, u = 0;
    for (j = 0; j < 17; j++) {
        u = (u + ((h[j] + c[j]) | 0)) | 0;
        h[j] = u & 255;
        u >>>= 8;
    }
}

const minusp = new Uint32Array([
    5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 252
]);

export function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
    var s, i, j, u;
    var x = new Uint32Array(17), r = new Uint32Array(17),
        h = new Uint32Array(17), c = new Uint32Array(17),
        g = new Uint32Array(17);
    for (j = 0; j < 17; j++) r[j] = h[j] = 0;
    for (j = 0; j < 16; j++) r[j] = k[j];
    r[3] &= 15;
    r[4] &= 252;
    r[7] &= 15;
    r[8] &= 252;
    r[11] &= 15;
    r[12] &= 252;
    r[15] &= 15;

    while (n > 0) {
        for (j = 0; j < 17; j++) c[j] = 0;
        for (j = 0; (j < 16) && (j < n); ++j) c[j] = m[mpos + j];
        c[j] = 1;
        mpos += j; n -= j;
        add1305(h, c);
        for (i = 0; i < 17; i++) {
            x[i] = 0;
            for (j = 0; j < 17; j++) x[i] = (x[i] + (h[j] * ((j <= i) ? r[i - j] : ((320 * r[i + 17 - j]) | 0))) | 0) | 0;
        }
        for (i = 0; i < 17; i++) h[i] = x[i];
        u = 0;
        for (j = 0; j < 16; j++) {
            u = (u + h[j]) | 0;
            h[j] = u & 255;
            u >>>= 8;
        }
        u = (u + h[16]) | 0; h[16] = u & 3;
        u = (5 * (u >>> 2)) | 0;
        for (j = 0; j < 16; j++) {
            u = (u + h[j]) | 0;
            h[j] = u & 255;
            u >>>= 8;
        }
        u = (u + h[16]) | 0; h[16] = u;
    }

    for (j = 0; j < 17; j++) g[j] = h[j];
    add1305(h, minusp);
    s = (-(h[16] >>> 7) | 0);
    for (j = 0; j < 17; j++) h[j] ^= s & (g[j] ^ h[j]);

    for (j = 0; j < 16; j++) c[j] = k[j + 16];
    c[16] = 0;
    add1305(h, c);
    for (j = 0; j < 16; j++) out[outpos + j] = h[j];
    return 0;
}

export function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
    var x = new Uint8Array(16);
    crypto_onetimeauth(x, 0, m, mpos, n, k);
    return crypto_verify_16(h, hpos, x, 0);
}
