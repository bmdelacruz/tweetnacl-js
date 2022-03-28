import { crypto_hash } from './lowlevel/index.js';
import { checkArrayTypes } from '../common/utilities.js';
import { crypto_hash_BYTES } from '../common/lowlevel/sizes.js';

export const hashLength = crypto_hash_BYTES;

export function hash(msg: Uint8Array): Uint8Array {
    checkArrayTypes(msg);
    var h = new Uint8Array(crypto_hash_BYTES);
    crypto_hash(h, msg, msg.length);
    return h;
}