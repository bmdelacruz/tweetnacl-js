interface PRNG {
    (x: Uint8Array, n: number): void;
}

let _prng: PRNG = () => {
    throw new Error('no PRNG');
};

export function setPRNG(prng: PRNG) {
    _prng = prng;
}

export function randombytes(x: Uint8Array, n: number) {
    _prng(x, n);
}

export function randomBytes(n: number): Uint8Array {
    const b = new Uint8Array(n);
    _prng(b, n);
    return b;
}

export function useNodeCryptoPRNG() {
    const { randomBytes } = require('crypto');

    setPRNG((out, length) => {
        const buffer = randomBytes(length);
        buffer.copy(out);
        buffer.fill(0);
    });
}

export function useBrowserCryptoSubtlePRNG() {
    const QUOTA = 65536;

    setPRNG((out, length) => {
        for (let i = 0; i < length; i += QUOTA) {
            const temp = out.subarray(i, i + Math.min(length - i, QUOTA));
            globalThis.crypto.getRandomValues(temp);
        }
    });
}