import { sigma } from '../../common/lowlevel/sigma.js';
import { crypto_core_hsalsa20, crypto_core_salsa20 } from './core.js';

export function crypto_stream_xor(c, cpos, m, mpos, d, n, k) {
    var s = new Uint8Array(32);
    crypto_core_hsalsa20(s, n, k, sigma);
    var sn = new Uint8Array(8);
    for (var i = 0; i < 8; i++) sn[i] = n[i + 16];
    return crypto_stream_salsa20_xor(c, cpos, m, mpos, d, sn, s);
}

export function crypto_stream(c, cpos, d, n, k) {
    var s = new Uint8Array(32);
    crypto_core_hsalsa20(s, n, k, sigma);
    var sn = new Uint8Array(8);
    for (var i = 0; i < 8; i++) sn[i] = n[i + 16];
    return crypto_stream_salsa20(c, cpos, d, sn, s);
}

export function crypto_stream_salsa20_xor(c, cpos, m, mpos, b, n, k) {
    var z = new Uint8Array(16), x = new Uint8Array(64);
    var u, i;
    for (i = 0; i < 16; i++) z[i] = 0;
    for (i = 0; i < 8; i++) z[i] = n[i];
    while (b >= 64) {
        crypto_core_salsa20(x, z, k, sigma);
        for (i = 0; i < 64; i++) c[cpos + i] = m[mpos + i] ^ x[i];
        u = 1;
        for (i = 8; i < 16; i++) {
            u = u + (z[i] & 0xff) | 0;
            z[i] = u & 0xff;
            u >>>= 8;
        }
        b -= 64;
        cpos += 64;
        mpos += 64;
    }
    if (b > 0) {
        crypto_core_salsa20(x, z, k, sigma);
        for (i = 0; i < b; i++) c[cpos + i] = m[mpos + i] ^ x[i];
    }
    return 0;
}

export function crypto_stream_salsa20(c, cpos, b, n, k) {
    var z = new Uint8Array(16), x = new Uint8Array(64);
    var u, i;
    for (i = 0; i < 16; i++) z[i] = 0;
    for (i = 0; i < 8; i++) z[i] = n[i];
    while (b >= 64) {
        crypto_core_salsa20(x, z, k, sigma);
        for (i = 0; i < 64; i++) c[cpos + i] = x[i];
        u = 1;
        for (i = 8; i < 16; i++) {
            u = u + (z[i] & 0xff) | 0;
            z[i] = u & 0xff;
            u >>>= 8;
        }
        b -= 64;
        cpos += 64;
    }
    if (b > 0) {
        crypto_core_salsa20(x, z, k, sigma);
        for (i = 0; i < b; i++) c[cpos + i] = x[i];
    }
    return 0;
}