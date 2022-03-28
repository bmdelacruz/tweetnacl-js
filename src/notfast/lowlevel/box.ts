import { randombytes } from '../../prng.js';
import { crypto_core_hsalsa20 } from './core.js';
import { sigma } from '../../common/lowlevel/sigma.js';
import { crypto_secretbox, crypto_secretbox_open } from './secretbox.js';
import { crypto_scalarmult, crypto_scalarmult_base } from './scalarmult.js';

const _0 = new Uint8Array(16);

export function crypto_box_beforenm(k, y, x) {
    var s = new Uint8Array(32);
    crypto_scalarmult(s, x, y);
    return crypto_core_hsalsa20(k, _0, s, sigma);
}

export const crypto_box_afternm = crypto_secretbox;
export const crypto_box_open_afternm = crypto_secretbox_open;

export function crypto_box(c, m, d, n, y, x) {
    var k = new Uint8Array(32);
    crypto_box_beforenm(k, y, x);
    return crypto_box_afternm(c, m, d, n, k);
}

export function crypto_box_open(m, c, d, n, y, x) {
    var k = new Uint8Array(32);
    crypto_box_beforenm(k, y, x);
    return crypto_box_open_afternm(m, c, d, n, k);
}

export function crypto_box_keypair(y, x) {
    randombytes(x, 32);
    return crypto_scalarmult_base(y, x);
}