import { crypto_stream, crypto_stream_xor } from './stream.js';
import { crypto_onetimeauth, crypto_onetimeauth_verify } from './onetimeauth.js';

export function crypto_secretbox(c, m, d, n, k) {
    var i;
    if (d < 32) return -1;
    crypto_stream_xor(c, 0, m, 0, d, n, k);
    crypto_onetimeauth(c, 16, c, 32, d - 32, c);
    for (i = 0; i < 16; i++) c[i] = 0;
    return 0;
}

export function crypto_secretbox_open(m, c, d, n, k) {
    var i;
    var x = new Uint8Array(32);
    if (d < 32) return -1;
    crypto_stream(x, 0, 32, n, k);
    if (crypto_onetimeauth_verify(c, 16, c, 32, d - 32, x) !== 0) return -1;
    crypto_stream_xor(m, 0, c, 0, d, n, k);
    for (i = 0; i < 32; i++) m[i] = 0;
    return 0;
}