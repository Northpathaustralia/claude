// Inlines lib/reconcile.js into app/index.template.html to produce app/index.html —
// a single self-contained file with no ES module imports, so it works when a broker
// just double-clicks it (Chrome blocks cross-file `import` under the file:// protocol;
// classic <script> tags have no such restriction). Mirrors the src/ -> release/*.html
// build in the main NPAOS app.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));
const lib = readFileSync(join(dir, 'lib/reconcile.js'), 'utf8').replace(/^export function/gm, 'function');
const template = readFileSync(join(dir, 'app/index.template.html'), 'utf8');

if (/^export /m.test(lib)) {
  throw new Error('reconcile.js has an export form the inliner does not handle — update build.mjs.');
}

const output = template.replace('<!--RECONCILE_LIB-->', `<script>\n${lib}\n</script>`);
writeFileSync(join(dir, 'app/index.html'), output);
console.log('Built app/index.html');
