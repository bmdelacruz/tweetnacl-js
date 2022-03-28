import { checkArrayTypes, checkLengths } from '../common/utilities.js';

import {
    crypto_secretbox,
    crypto_secretbox_open,
    crypto_secretbox_ZEROBYTES,
    crypto_secretbox_BOXZEROBYTES,
    crypto_secretbox_KEYBYTES,
    crypto_secretbox_NONCEBYTES,
} from './lowlevel/index.js';

export const keyLength = crypto_secretbox_KEYBYTES;
export const nonceLength = crypto_secretbox_NONCEBYTES;
export const overheadLength = crypto_secretbox_BOXZEROBYTES;

export function secretBox(msg: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array {
    checkArrayTypes(msg, nonce, key);
    checkLengths(key, nonce);
    var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
    var c = new Uint8Array(m.length);
    for (var i = 0; i < msg.length; i++) m[i + crypto_secretbox_ZEROBYTES] = msg[i];
    crypto_secretbox(c, m, m.length, nonce, key);
    return c.subarray(crypto_secretbox_BOXZEROBYTES);
}

export function secretBoxOpen(box: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array | null {
    checkArrayTypes(box, nonce, key);
    checkLengths(key, nonce);
    var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
    var m = new Uint8Array(c.length);
    for (var i = 0; i < box.length; i++) c[i + crypto_secretbox_BOXZEROBYTES] = box[i];
    if (c.length < 32) return null;
    if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return null;
    return m.subarray(crypto_secretbox_ZEROBYTES);
}