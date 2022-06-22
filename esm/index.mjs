import { randombytes } from './prng.mjs';

export function randomBytes(n) {
    var b = new Uint8Array(n);
    randombytes(b, n);
    return b;
}

export {
    secretbox,
    secretboxOpen,
    secretboxKeyLength,
    secretboxNonceLength,
    secretboxOverheadLength,
} from './secretbox.mjs';

export {
    scalarMult,
    scalarMultBase,
    scalarMultScalarLength,
    scalarMultGroupElementLength,
} from './scalarmult.mjs';

export {
    box,
    boxBefore,
    boxAfter,
    boxOpen,
    boxOpenAfter,
    boxKeyPair,
    boxKeyPairFromSecretKey,
    boxPublicKeyLength,
    boxSecretKeyLength,
    boxSharedKeyLength,
    boxNonceLength,
    boxOverheadLength,
} from './box.mjs';

export {
    sign,
    signOpen,
    signDetached,
    signDetachedVerify,
    signKeyPair,
    signKeyPairFromSecretKey,
    signKeyPairFromSeed,
    signPublicKeyLength,
    signSecretKeyLength,
    signSeedLength,
    signSignatureLength,
} from './sign.mjs'

export { hash, hashLength } from './hash.mjs'

export { verify } from './verify.mjs'

export { setPRNG, setGlobalCryptoPRNG, setNodeCryptoPRNG } from './prng.mjs'