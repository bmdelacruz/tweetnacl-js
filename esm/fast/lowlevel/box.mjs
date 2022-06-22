import { _0 } from '../../lowlevel/box.mjs';
import { randombytes } from '../../prng.mjs';
import { sigma } from '../../lowlevel/stream.mjs';
import { crypto_core_hsalsa20 } from './stream.mjs';
import { crypto_scalarmult, crypto_scalarmult_base } from './scalarmult.mjs';
import { crypto_secretbox, crypto_secretbox_open } from './secretbox.mjs';

export { crypto_secretbox as crypto_box_afternm } from './secretbox.mjs';

export {
    crypto_box_PUBLICKEYBYTES,
    crypto_box_SECRETKEYBYTES,
    crypto_box_BEFORENMBYTES,
    crypto_box_NONCEBYTES,
    crypto_box_ZEROBYTES,
    crypto_box_BOXZEROBYTES,
} from '../../lowlevel/box.mjs';

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