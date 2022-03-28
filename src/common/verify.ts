import { vn } from './lowlevel/verify.js';
import { checkArrayTypes } from './utilities.js';

export function verify(x: Uint8Array, y: Uint8Array): boolean {
    checkArrayTypes(x, y);
    // Zero length arguments are considered not equal.
    if (x.length === 0 || y.length === 0) return false;
    if (x.length !== y.length) return false;
    return (vn(x, 0, y, 0, x.length) === 0) ? true : false;
}