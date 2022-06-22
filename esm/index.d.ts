export interface BoxKeyPair {
    publicKey: Uint8Array;
    secretKey: Uint8Array;
}

export interface SignKeyPair {
    publicKey: Uint8Array;
    secretKey: Uint8Array;
}

export function randomBytes(n: number): Uint8Array;

export function secretbox(msg: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array;
export function secretboxOpen(box: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array | null;
export const secretboxKeyLength: number;
export const secretboxNonceLength: number;
export const secretboxOverheadLength: number;

export function scalarMult(n: Uint8Array, p: Uint8Array): Uint8Array;
export function scalarMultBase(n: Uint8Array): Uint8Array;
export const scalarMultScalarLength: number;
export const scalarMultGroupElementLength: number;

export function box(msg: Uint8Array, nonce: Uint8Array, publicKey: Uint8Array, secretKey: Uint8Array): Uint8Array;
export function boxBefore(publicKey: Uint8Array, secretKey: Uint8Array): Uint8Array;
export function boxAfter(msg: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array;
export function boxOpen(msg: Uint8Array, nonce: Uint8Array, publicKey: Uint8Array, secretKey: Uint8Array): Uint8Array | null;
export function boxOpenAfter(box: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array | null;
export function boxKeyPair(): BoxKeyPair;
export function boxKeyPairFromSecretKey(secretKey: Uint8Array): BoxKeyPair;
export const boxPublicKeyLength: number;
export const boxSecretKeyLength: number;
export const boxSharedKeyLength: number;
export const boxNonceLength: number;
export const boxOverheadLength: number;

export function sign(msg: Uint8Array, secretKey: Uint8Array): Uint8Array;
export function signOpen(signedMsg: Uint8Array, publicKey: Uint8Array): Uint8Array | null;
export function signDetached(msg: Uint8Array, secretKey: Uint8Array): Uint8Array;
export function signDetachedVerify(msg: Uint8Array, sig: Uint8Array, publicKey: Uint8Array): boolean;
export function signKeyPair(): SignKeyPair;
export function signKeyPairFromSecretKey(secretKey: Uint8Array): SignKeyPair;
export function signKeyPairFromSeed(secretKey: Uint8Array): SignKeyPair;
export const signPublicKeyLength: number;
export const signSecretKeyLength: number;
export const signSeedLength: number;
export const signSignatureLength: number;

export function hash (msg: Uint8Array): Uint8Array;
export const hashLength: number;

export function verify(x: Uint8Array, y: Uint8Array): boolean;

export function setPRNG(prng: (target: Uint8Array, length: number) => void): void;
export function setGlobalCryptoPRNG(): void;
export function setNodeCryptoPRNG(): void;