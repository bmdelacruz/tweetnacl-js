const fs = require('fs');

const cjsPackageJson = JSON.stringify({ type: 'commonjs' }, null, 2);
fs.writeFileSync('dist/cjs/package.json', cjsPackageJson);

const esmPackageJson = JSON.stringify({ type: 'module' }, null, 2);
fs.writeFileSync('dist/esm/package.json', esmPackageJson);