import { checkArrayTypes } from './array.mjs';
import {
    crypto_secretbox,
    crypto_secretbox_open,
    crypto_secretbox_BOXZEROBYTES,
    crypto_secretbox_KEYBYTES,
    crypto_secretbox_NONCEBYTES,
    crypto_secretbox_ZEROBYTES
} from './lowlevel/secretbox.mjs';

export {
    crypto_secretbox_KEYBYTES as secretboxKeyLength,
    crypto_secretbox_NONCEBYTES as secretboxNonceLength,
    crypto_secretbox_BOXZEROBYTES as secretboxOverheadLength,
} from './lowlevel/secretbox.mjs';

export function secretboxCheckLengths(k, n) {
    if (k.length !== crypto_secretbox_KEYBYTES) throw new Error('bad key size');
    if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error('bad nonce size');
}

export function secretbox(msg, nonce, key) {
    checkArrayTypes(msg, nonce, key);
    secretboxCheckLengths(key, nonce);
    var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
    var c = new Uint8Array(m.length);
    for (var i = 0; i < msg.length; i++) m[i + crypto_secretbox_ZEROBYTES] = msg[i];
    crypto_secretbox(c, m, m.length, nonce, key);
    return c.subarray(crypto_secretbox_BOXZEROBYTES);
}

export function secretboxOpen(box, nonce, key) {
    checkArrayTypes(box, nonce, key);
    secretboxCheckLengths(key, nonce);
    var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
    var m = new Uint8Array(c.length);
    for (var i = 0; i < box.length; i++) c[i + crypto_secretbox_BOXZEROBYTES] = box[i];
    if (c.length < 32) return null;
    if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return null;
    return m.subarray(crypto_secretbox_ZEROBYTES);
}