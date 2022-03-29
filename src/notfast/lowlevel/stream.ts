import { sigma } from '../../common/lowlevel/sigma.js';
import { crypto_core_hsalsa20, crypto_core_salsa20 } from './core.js';

export function crypto_stream_xor(c, cpos, m, mpos, d, n, k) {
    var s = new Uint8Array(32);
    crypto_core_hsalsa20(s, n, k, sigma);
    return crypto_stream_salsa20_xor(c, cpos, m, mpos, d, n.subarray(16), s);
}

export function crypto_stream(c, cpos, d, n, k) {
    var s = new Uint8Array(32);
    crypto_core_hsalsa20(s, n, k, sigma);
    return crypto_stream_salsa20(c, cpos, d, n.subarray(16), s);
}

export function crypto_stream_salsa20_xor(c, cpos, m, mpos, b, n, k) {
    var z = new Uint8Array(16), x = new Uint8Array(64);
    var u, i;
    if (!b) return 0;
    for (i = 0; i < 16; i++) z[i] = 0;
    for (i = 0; i < 8; i++) z[i] = n[i];
    while (b >= 64) {
        crypto_core_salsa20(x, z, k, sigma);
        for (i = 0; i < 64; i++) c[cpos + i] = (m ? m[mpos + i] : 0) ^ x[i];
        u = 1;
        for (i = 8; i < 16; i++) {
            u = u + (z[i] & 0xff) | 0;
            z[i] = u & 0xff;
            u >>>= 8;
        }
        b -= 64;
        cpos += 64;
        if (m) mpos += 64;
    }
    if (b > 0) {
        crypto_core_salsa20(x, z, k, sigma);
        for (i = 0; i < b; i++) c[cpos + i] = (m ? m[mpos + i] : 0) ^ x[i];
    }
    return 0;
}

export function crypto_stream_salsa20(c, cpos, d, n, k) {
    return crypto_stream_salsa20_xor(c, cpos, null, 0, d, n, k);
}