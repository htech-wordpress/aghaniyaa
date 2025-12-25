const fs = require('fs');
const path = require('path');

const dist = path.resolve(__dirname, '../dist');
const assetsNameOriginal = fs.readdirSync(dist).find((n) => n.toLowerCase() === 'assets');
const assetsPath = assetsNameOriginal ? path.join(dist, assetsNameOriginal) : null;
const desired = path.join(dist, 'assets');

try {
  if (!assetsPath) {
    console.log('No assets directory found — no action taken');
    process.exit(0);
  }

  // If the existing directory name matches desired exact case, nothing to do
  if (path.basename(assetsPath) === 'assets') {
    console.log('assets directory already has correct case — no action needed');
    process.exit(0);
  }

  // To change case on case-insensitive filesystems, do a two-step rename via a temp name
  const tmp = path.join(dist, 'assets_tmp_' + Date.now());
  fs.renameSync(assetsPath, tmp);
  fs.renameSync(tmp, desired);
  console.log(`Renamed ${path.basename(assetsPath)} -> assets`);
} catch (err) {
  console.error('Error while fixing asset case:', err);
  process.exit(1);
}