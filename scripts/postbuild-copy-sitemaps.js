/* eslint-disable */
import fs from 'fs';
import path from 'path';

const distDir = path.resolve(process.cwd(), 'dist');
const docsDir = path.join(distDir, 'docs');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyIfExists(src, dest) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}

ensureDir(docsDir);

const files = ['sitemap-index.xml', 'sitemap.xml', 'sitemap-0.xml'];

for (const file of files) {
  const src = path.join(distDir, file);
  const dest = path.join(docsDir, file);
  copyIfExists(src, dest);
}

// Also replicate robots.txt at root (already generated) and under /docs if desired
const robotsSrc = path.join(distDir, 'robots.txt');
const robotsDest = path.join(docsDir, 'robots.txt');
copyIfExists(robotsSrc, robotsDest);

console.log('[postbuild] Copied sitemap files into dist/docs/');


