function L32(x, c) { return (x << c) | (x >>> (32 - c)); }

function ld32(x, i) {
    var u = x[i + 3] & 0xff;
    u = (u << 8) | (x[i + 2] & 0xff);
    u = (u << 8) | (x[i + 1] & 0xff);
    return (u << 8) | (x[i + 0] & 0xff);
}

function st32(x, j, u) {
    var i;
    for (i = 0; i < 4; i++) { x[j + i] = u & 255; u >>>= 8; }
}

function core(out, inp, k, c, h) {
    var w = new Uint32Array(16), x = new Uint32Array(16),
        y = new Uint32Array(16), t = new Uint32Array(4);
    var i, j, m;

    for (i = 0; i < 4; i++) {
        x[5 * i] = ld32(c, 4 * i);
        x[1 + i] = ld32(k, 4 * i);
        x[6 + i] = ld32(inp, 4 * i);
        x[11 + i] = ld32(k, 16 + 4 * i);
    }

    for (i = 0; i < 16; i++) y[i] = x[i];

    for (i = 0; i < 20; i++) {
        for (j = 0; j < 4; j++) {
            for (m = 0; m < 4; m++) t[m] = x[(5 * j + 4 * m) % 16];
            t[1] ^= L32((t[0] + t[3]) | 0, 7);
            t[2] ^= L32((t[1] + t[0]) | 0, 9);
            t[3] ^= L32((t[2] + t[1]) | 0, 13);
            t[0] ^= L32((t[3] + t[2]) | 0, 18);
            for (m = 0; m < 4; m++) w[4 * j + (j + m) % 4] = t[m];
        }
        for (m = 0; m < 16; m++) x[m] = w[m];
    }

    if (h) {
        for (i = 0; i < 16; i++) x[i] = (x[i] + y[i]) | 0;
        for (i = 0; i < 4; i++) {
            x[5 * i] = (x[5 * i] - ld32(c, 4 * i)) | 0;
            x[6 + i] = (x[6 + i] - ld32(inp, 4 * i)) | 0;
        }
        for (i = 0; i < 4; i++) {
            st32(out, 4 * i, x[5 * i]);
            st32(out, 16 + 4 * i, x[6 + i]);
        }
    } else {
        for (i = 0; i < 16; i++) st32(out, 4 * i, (x[i] + y[i]) | 0);
    }
}

export function crypto_core_salsa20(out, inp, k, c) {
    core(out, inp, k, c, false);
    return 0;
}

export function crypto_core_hsalsa20(out, inp, k, c) {
    core(out, inp, k, c, true);
    return 0;
}

// "expand 32-byte k"
export const sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);

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