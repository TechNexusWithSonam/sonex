// Loads KEY=value pairs from .env in the project root (real environment variables win).
// Use another file with:  node server/index.js --env .env.live
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const argIndex = process.argv.indexOf('--env');
const name = argIndex > -1 && process.argv[argIndex + 1] ? process.argv[argIndex + 1] : '.env';
const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', name);
if (name !== '.env' && !fs.existsSync(file)) {
  console.error(`  Env file not found: ${name}`);
  process.exit(1);
}
console.log(`  Using settings from ${name}`);

if (fs.existsSync(file)) {
  for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}
