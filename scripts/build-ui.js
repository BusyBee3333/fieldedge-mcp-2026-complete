#!/usr/bin/env node

import { execSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const uiDir = join(__dirname, '../src/ui');

console.log('Building React apps...\n');

const apps = readdirSync(uiDir).filter((file) => {
  const fullPath = join(uiDir, file);
  return statSync(fullPath).isDirectory();
});

let successCount = 0;
let failCount = 0;

for (const app of apps) {
  const appPath = join(uiDir, app);
  console.log(`Building ${app}...`);

  try {
    execSync('npx vite build', {
      cwd: appPath,
      stdio: 'inherit',
    });
    successCount++;
  } catch (error) {
    console.error(`Failed to build ${app}`);
    failCount++;
  }
}

console.log(`\n✅ Successfully built ${successCount} apps`);
if (failCount > 0) {
  console.log(`❌ Failed to build ${failCount} apps`);
  process.exit(1);
}
