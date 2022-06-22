import { cleanup } from './array.mjs';

/** @type {(x: Uint8Array, n: number) => void} */
let prng = (_x, _n) => { throw new Error('no PRNG! set the PRNG by calling nacl.setGlobalCryptoPRNG, nacl.setNodeCryptoPRNG, or nacl.setPRNG'); };

/**
 * @param {Uint8Array} x 
 * @param {number} n 
 */
export function randombytes(x, n) {
    prng(x, n);
}

export function setGlobalCryptoPRNG() {
    /** @type {Crypto | undefined} */
    // @ts-ignore
    const crypto = globalThis.crypto || self.crypto || self.msCrypto || window.crypto || window.msCrypto;
    if (!crypto) {
        throw new Error('global crypto object is missing');
    } else if (typeof crypto.getRandomValues !== 'function') {
        throw new Error('getRandomValues is missing from global crypto object');
    }
    var QUOTA = 65536;
    prng = (x, n) => {
        var i, v = new Uint8Array(n);
        for (i = 0; i < n; i += QUOTA) {
            crypto.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
        }
        for (i = 0; i < n; i++) x[i] = v[i];
        cleanup(v);
    };
}

export function setNodeCryptoPRNG() {
    var crypto = require('crypto');
    if (typeof crypto.randomBytes !== 'function') {
        throw new Error('randomBytes is missing from node crypto object');
    }
    prng = (x, n) => {
        var i, v = crypto.randomBytes(n);
        for (i = 0; i < n; i++) x[i] = v[i];
        cleanup(v);
    };
}

/**
 * @param {(x: Uint8Array, n: number) => void} customPrng 
 */
export function setPRNG(customPrng) {
    prng = customPrng;
}