import { checkArrayTypes } from './array.mjs';
import {
    crypto_scalarmult,
    crypto_scalarmult_base,
    crypto_scalarmult_BYTES,
    crypto_scalarmult_SCALARBYTES,
} from './lowlevel/scalarmult.mjs';

export {
    crypto_scalarmult_SCALARBYTES as scalarMultScalarLength,
    crypto_scalarmult_BYTES as scalarMultGroupElementLength,
} from './lowlevel/scalarmult.mjs';

export function scalarMult(n, p) {
    checkArrayTypes(n, p);
    if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
    if (p.length !== crypto_scalarmult_BYTES) throw new Error('bad p size');
    var q = new Uint8Array(crypto_scalarmult_BYTES);
    crypto_scalarmult(q, n, p);
    return q;
}

export function scalarMultBase(n) {
    checkArrayTypes(n);
    if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
    var q = new Uint8Array(crypto_scalarmult_BYTES);
    crypto_scalarmult_base(q, n);
    return q;
}