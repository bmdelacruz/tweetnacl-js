import { checkArrayTypes } from './array.mjs';
import { secretbox, secretboxOpen } from './secretbox.mjs';
import { crypto_scalarmult_base } from './lowlevel/scalarmult.mjs';
import {
    crypto_box_beforenm,
    crypto_box_keypair,
    crypto_box_BEFORENMBYTES,
    crypto_box_PUBLICKEYBYTES,
    crypto_box_SECRETKEYBYTES
} from './lowlevel/box.mjs';

export {
    crypto_box_PUBLICKEYBYTES as boxPublicKeyLength,
    crypto_box_SECRETKEYBYTES as boxSecretKeyLength,
    crypto_box_BEFORENMBYTES as boxSharedKeyLength,
    crypto_box_NONCEBYTES as boxNonceLength,
} from './lowlevel/box.mjs';

export {
    secretbox as boxAfter,
    secretboxOpen as boxOpenAfter,
    secretboxOverheadLength as boxOverheadLength,
} from './secretbox.mjs';

export function box(msg, nonce, publicKey, secretKey) {
    var k = boxBefore(publicKey, secretKey);
    return secretbox(msg, nonce, k);
}

export function checkBoxLengths(pk, sk) {
    if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error('bad public key size');
    if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error('bad secret key size');
}

export function boxBefore(publicKey, secretKey) {
    checkArrayTypes(publicKey, secretKey);
    checkBoxLengths(publicKey, secretKey);
    var k = new Uint8Array(crypto_box_BEFORENMBYTES);
    crypto_box_beforenm(k, publicKey, secretKey);
    return k;
}

export function boxOpen(msg, nonce, publicKey, secretKey) {
    var k = boxBefore(publicKey, secretKey);
    return secretboxOpen(msg, nonce, k);
}

export function boxKeyPair() {
    var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
    var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
    crypto_box_keypair(pk, sk);
    return { publicKey: pk, secretKey: sk };
}

export function boxKeyPairFromSecretKey(secretKey) {
    checkArrayTypes(secretKey);
    if (secretKey.length !== crypto_box_SECRETKEYBYTES)
        throw new Error('bad secret key size');
    var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
    crypto_scalarmult_base(pk, secretKey);
    return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
}