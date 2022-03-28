import {
    crypto_secretbox_KEYBYTES,
    crypto_secretbox_NONCEBYTES,
    crypto_box_PUBLICKEYBYTES,
    crypto_box_SECRETKEYBYTES,
} from './lowlevel/sizes.js';

export function checkLengths(k: Uint8Array, n: Uint8Array) {
    if (k.length !== crypto_secretbox_KEYBYTES) throw new Error('bad key size');
    if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error('bad nonce size');
}

export function checkBoxLengths(pk: Uint8Array, sk: Uint8Array) {
    if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error('bad public key size');
    if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error('bad secret key size');
}

export function checkArrayTypes(...arrays: any[]): void;
export function checkArrayTypes() {
    for (var i = 0; i < arguments.length; i++) {
        if (!(arguments[i] instanceof Uint8Array))
            throw new TypeError('unexpected type, use Uint8Array');
    }
}

export function cleanup(arr: Uint8Array) {
    for (var i = 0; i < arr.length; i++) arr[i] = 0;
}