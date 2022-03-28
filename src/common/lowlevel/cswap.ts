import { sel25519 } from './25519.js';

export function cswap(p, q, b) {
    var i;
    for (i = 0; i < 4; i++) {
        sel25519(p[i], q[i], b);
    }
}