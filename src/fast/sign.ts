import { checkArrayTypes } from '../common/utilities.js';
import {
    crypto_sign,
    crypto_sign_open,
    crypto_sign_keypair,
    crypto_sign_PUBLICKEYBYTES,
    crypto_sign_SECRETKEYBYTES,
    crypto_sign_SEEDBYTES,
    crypto_sign_BYTES,
} from './lowlevel/index.js';

export const publicKeyLength = crypto_sign_PUBLICKEYBYTES;
export const secretKeyLength = crypto_sign_SECRETKEYBYTES;
export const seedLength = crypto_sign_SEEDBYTES;
export const signatureLength = crypto_sign_BYTES;

export function sign(msg: Uint8Array, secretKey: Uint8Array): Uint8Array {
    checkArrayTypes(msg, secretKey);
    if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
        throw new Error('bad secret key size');
    var signedMsg = new Uint8Array(crypto_sign_BYTES + msg.length);
    crypto_sign(signedMsg, msg, msg.length, secretKey);
    return signedMsg;
}

export function signOpen(signedMsg: Uint8Array, publicKey: Uint8Array): Uint8Array | null {
    checkArrayTypes(signedMsg, publicKey);
    if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
        throw new Error('bad public key size');
    var tmp = new Uint8Array(signedMsg.length);
    var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
    if (mlen < 0) return null;
    var m = new Uint8Array(mlen);
    for (var i = 0; i < m.length; i++) m[i] = tmp[i];
    return m;
}

export function signDetached(msg: Uint8Array, secretKey: Uint8Array): Uint8Array {
    var signedMsg = sign(msg, secretKey);
    var sig = new Uint8Array(crypto_sign_BYTES);
    for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i];
    return sig;
}

export function verifySignature(msg: Uint8Array, sig: Uint8Array, publicKey: Uint8Array): boolean {
    checkArrayTypes(msg, sig, publicKey);
    if (sig.length !== crypto_sign_BYTES)
        throw new Error('bad signature size');
    if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
        throw new Error('bad public key size');
    var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
    var m = new Uint8Array(crypto_sign_BYTES + msg.length);
    var i;
    for (i = 0; i < crypto_sign_BYTES; i++) sm[i] = sig[i];
    for (i = 0; i < msg.length; i++) sm[i + crypto_sign_BYTES] = msg[i];
    return (crypto_sign_open(m, sm, sm.length, publicKey) >= 0);
}

export interface SignKeyPair {
    publicKey: Uint8Array;
    secretKey: Uint8Array;
}

export function signKeyPair(): SignKeyPair {
    var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
    var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
    crypto_sign_keypair(pk, sk);
    return { publicKey: pk, secretKey: sk };
}

export function signKeyPairFromSecretKey(secretKey: Uint8Array): SignKeyPair {
    checkArrayTypes(secretKey);
    if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
        throw new Error('bad secret key size');
    var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
    for (var i = 0; i < pk.length; i++) pk[i] = secretKey[32 + i];
    return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
}

export function signKeyPairFromSeed(seed: Uint8Array): SignKeyPair {
    checkArrayTypes(seed);
    if (seed.length !== crypto_sign_SEEDBYTES)
        throw new Error('bad seed size');
    var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
    var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
    for (var i = 0; i < 32; i++) sk[i] = seed[i];
    crypto_sign_keypair(pk, sk, true);
    return { publicKey: pk, secretKey: sk };
}