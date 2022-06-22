import { randombytes } from '../prng.mjs';
import { crypto_core_hsalsa20, sigma } from './stream.mjs';
import { crypto_secretbox, crypto_secretbox_open } from './secretbox.mjs';
import { crypto_scalarmult, crypto_scalarmult_base } from './scalarmult.mjs';

export {
    crypto_secretbox as crypto_box_afternm,
    crypto_secretbox_NONCEBYTES as crypto_box_NONCEBYTES,
    crypto_secretbox_ZEROBYTES as crypto_box_ZEROBYTES,
    crypto_secretbox_BOXZEROBYTES as crypto_box_BOXZEROBYTES,
} from './secretbox.mjs';

export const crypto_box_PUBLICKEYBYTES = 32;
export const crypto_box_SECRETKEYBYTES = 32;
export const crypto_box_BEFORENMBYTES = 32;

export const _0 = new Uint8Array(16);

export function crypto_box_beforenm(k, y, x) {
    var s = new Uint8Array(32);
    crypto_scalarmult(s, x, y);
    return crypto_core_hsalsa20(k, _0, s, sigma);
}

export function crypto_box(c, m, d, n, y, x) {
    var k = new Uint8Array(32);
    crypto_box_beforenm(k, y, x);
    return /* crypto_box_afternm */ crypto_secretbox(c, m, d, n, k);
}

export function crypto_box_open(m, c, d, n, y, x) {
    var k = new Uint8Array(32);
    crypto_box_beforenm(k, y, x);
    return /* crypto_box_open_afternm */ crypto_secretbox_open(m, c, d, n, k);
}

export function crypto_box_keypair(y, x) {
    randombytes(x, 32);
    return crypto_scalarmult_base(y, x);
}