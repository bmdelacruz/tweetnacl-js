export class u64 {
    hi: number;
    lo: number;

    constructor(h, l) {
        this.hi = h | 0 >>> 0;
        this.lo = l | 0 >>> 0;
    }
}