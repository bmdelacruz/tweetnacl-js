export function vn(x, xi, y, yi, n) {
    var i, d = 0;
    for (i = 0; i < n; i++) d |= x[xi + i] ^ y[yi + i];
    return (1 & ((d - 1) >>> 8)) - 1;
}

export function crypto_verify_16(x, xi, y, yi) {
    return vn(x, xi, y, yi, 16);
}

export function crypto_verify_32(x, xi, y, yi) {
    return vn(x, xi, y, yi, 32);
}