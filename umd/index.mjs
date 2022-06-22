export * as lowlevel from '../esm/lowlevel/index.mjs';

export {
    randomBytes,
    verify,
    setPRNG,
    setGlobalCryptoPRNG,
    setNodeCryptoPRNG
} from '../esm/index.mjs';

import * as lib from '../esm/index.mjs';

/** @type {any} */
export const secretbox = lib.secretbox;
secretbox.open = lib.secretboxOpen;
secretbox.keyLength = lib.secretboxKeyLength;
secretbox.nonceLength = lib.secretboxNonceLength;
secretbox.overheadLength = lib.secretboxOverheadLength;

/** @type {any} */
export const scalarMult = lib.scalarMult;
scalarMult.base = lib.scalarMultBase;
scalarMult.scalarLength = lib.scalarMultScalarLength;
scalarMult.groupElementLength = lib.scalarMultGroupElementLength;

/** @type {any} */
export const box = lib.box;
box.before = lib.boxBefore;
box.after = lib.boxAfter;
box.open = lib.boxOpen;
box.after = lib.boxOpenAfter;
box.keyPair = lib.boxKeyPair;
box.keyPair.fromSecretKey = lib.boxKeyPairFromSecretKey;
box.publicKeyLength = lib.boxPublicKeyLength;
box.secretKeyLength = lib.boxSecretKeyLength;
box.sharedKeyLength = lib.boxSharedKeyLength;
box.nonceLength = lib.boxNonceLength;
box.overheadLength = lib.boxOverheadLength;

/** @type {any} */
export const sign = lib.sign;
sign.open = lib.signOpen;
sign.detached = lib.signDetached;
sign.detached.verify = lib.signDetachedVerify;
sign.keyPair = lib.signKeyPair;
sign.keyPair.fromSecretKey = lib.signKeyPairFromSecretKey;
sign.keyPair.fromSeed = lib.signKeyPairFromSeed;
sign.publicKeyLength = lib.signPublicKeyLength;
sign.secretKeyLength = lib.signSecretKeyLength;
sign.seedLength = lib.signSeedLength;
sign.signatureLength = lib.signSignatureLength;

/** @type {any} */
export const hash = lib.hash;
hash.hashLength = lib.hashLength;