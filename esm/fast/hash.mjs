import { checkArrayTypes } from '../array.mjs';
import { crypto_hash, crypto_hash_BYTES } from './lowlevel/hash.mjs';

export { crypto_hash_BYTES as hashLength } from './lowlevel/hash.mjs';

/**
 * @param {Uint8Array} msg
 * @returns {Uint8Array}
 */
export function hash(msg) {
    checkArrayTypes(msg);
    var h = new Uint8Array(crypto_hash_BYTES);
    crypto_hash(h, msg, msg.length);
    return h;
}