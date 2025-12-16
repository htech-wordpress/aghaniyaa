import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basePath = process.env.VITE_BASE_PATH || '/';
const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

// Read the index.html
let indexContent = fs.readFileSync(indexPath, 'utf-8');

// Create 404.html with proper base path handling
let content404 = indexContent;

// If base path is not root, update paths in the HTML
if (basePath !== '/') {
  // Replace absolute paths with base path
  content404 = content404.replace(/href="\//g, `href="${basePath}`);
  content404 = content404.replace(/src="\//g, `src="${basePath}`);
  
  // Fix double base paths
  const basePathRegex = new RegExp(basePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + basePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content404 = content404.replace(basePathRegex, basePath);
}

// Write 404.html
const file404Path = path.join(distPath, '404.html');
fs.writeFileSync(file404Path, content404, 'utf-8');

console.log('✓ Generated 404.html for SPA routing');
console.log(`  Base path: ${basePath}`);

