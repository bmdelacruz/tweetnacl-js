import { A, M, Z } from './25519.js';
import { gf, D2 } from '../../common/lowlevel/gf.js';

export function add(p, q) {
    var a = gf(), b = gf(), c = gf(),
        d = gf(), e = gf(), f = gf(),
        g = gf(), h = gf(), t = gf();

    Z(a, p[1], p[0]);
    Z(t, q[1], q[0]);
    M(a, a, t);
    A(b, p[0], p[1]);
    A(t, q[0], q[1]);
    M(b, b, t);
    M(c, p[3], q[3]);
    M(c, c, D2);
    M(d, p[2], q[2]);
    A(d, d, d);
    Z(e, b, a);
    Z(f, d, c);
    A(g, d, c);
    A(h, b, a);

    M(p[0], e, f);
    M(p[1], h, g);
    M(p[2], g, f);
    M(p[3], e, h);
}