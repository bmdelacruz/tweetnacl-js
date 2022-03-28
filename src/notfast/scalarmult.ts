import { checkArrayTypes } from '../common/utilities.js';

import {
    crypto_scalarmult,
    crypto_scalarmult_base,
    crypto_scalarmult_BYTES,
    crypto_scalarmult_SCALARBYTES,
} from './lowlevel/index.js';

export const scalarLength = crypto_scalarmult_SCALARBYTES;
export const groupElementLength = crypto_scalarmult_BYTES;

export function scalarMult(n: Uint8Array, p: Uint8Array): Uint8Array {
    checkArrayTypes(n, p);
    if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
    if (p.length !== crypto_scalarmult_BYTES) throw new Error('bad p size');
    var q = new Uint8Array(crypto_scalarmult_BYTES);
    crypto_scalarmult(q, n, p);
    return q;
}

export function scalarMultBase(n: Uint8Array): Uint8Array {
    checkArrayTypes(n);
    if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
    var q = new Uint8Array(crypto_scalarmult_BYTES);
    crypto_scalarmult_base(q, n);
    return q;
}