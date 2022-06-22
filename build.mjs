import { build } from 'vite';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const projectDir = dirname(fileURLToPath(import.meta.url));

/** @type {[entry: string, minify: boolean, fast: boolean][]} */
const entries = [
    [resolve(projectDir, "umd/index.mjs"), false, false],
    [resolve(projectDir, "umd/index.mjs"), true, false],
    [resolve(projectDir, "umd/fast.mjs"), false, true],
    [resolve(projectDir, "umd/fast.mjs"), true, true],
];

for (const [entry, minify, fast] of entries) {
    await build({
        build: {
            lib: {
                entry,
                name: "nacl",
                formats: ["umd"],
                fileName: () => `nacl${fast ? '-fast' : ''}${minify ? '.min' : ''}.js`
            },
            minify: minify && 'esbuild',
            emptyOutDir: false,
            outDir: '.',
        },
        clearScreen: false,
    });
}