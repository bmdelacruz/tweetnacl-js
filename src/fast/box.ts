import { checkArrayTypes, checkBoxLengths } from '../common/utilities';

import {
    secretBox,
    secretBoxOpen,
    overheadLength as secretBoxOverheadLength,
} from './secretbox.js';

import {
    crypto_box_keypair,
    crypto_box_beforenm,
    crypto_scalarmult_base,
    crypto_box_NONCEBYTES,
    crypto_box_BEFORENMBYTES,
    crypto_box_PUBLICKEYBYTES,
    crypto_box_SECRETKEYBYTES,
} from './lowlevel/index.js';

export const publicKeyLength = crypto_box_PUBLICKEYBYTES;
export const secretKeyLength = crypto_box_SECRETKEYBYTES;
export const sharedKeyLength = crypto_box_BEFORENMBYTES;
export const nonceLength = crypto_box_NONCEBYTES;
export const overheadLength = secretBoxOverheadLength;

export function box(msg: Uint8Array, nonce: Uint8Array, publicKey: Uint8Array, secretKey: Uint8Array): Uint8Array {
    var k = boxBefore(publicKey, secretKey);
    return secretBox(msg, nonce, k);
}

export function boxBefore(publicKey: Uint8Array, secretKey: Uint8Array): Uint8Array {
    checkArrayTypes(publicKey, secretKey);
    checkBoxLengths(publicKey, secretKey);
    var k = new Uint8Array(crypto_box_BEFORENMBYTES);
    crypto_box_beforenm(k, publicKey, secretKey);
    return k;
}

export const boxAfter = secretBox;

export interface BoxKeyPair {
    publicKey: Uint8Array;
    secretKey: Uint8Array;
}

export function boxKeyPair(): BoxKeyPair {
    var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
    var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
    crypto_box_keypair(pk, sk);
    return { publicKey: pk, secretKey: sk };
}

export function boxKeyPairFromSecretKey(secretKey: Uint8Array): BoxKeyPair {
    checkArrayTypes(secretKey);
    if (secretKey.length !== crypto_box_SECRETKEYBYTES)
        throw new Error('bad secret key size');
    var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
    crypto_scalarmult_base(pk, secretKey);
    return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
}

export function boxOpen(msg: Uint8Array, nonce: Uint8Array, publicKey: Uint8Array, secretKey: Uint8Array): Uint8Array | null {
    var k = boxBefore(publicKey, secretKey);
    return secretBoxOpen(msg, nonce, k);
}

export const boxOpenAfter = secretBoxOpen;