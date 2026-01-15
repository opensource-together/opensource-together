#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

/**
 * Recursively copies all HTML files from the Next.js build output
 * to the OpenNext assets directory for Cloudflare Workers deployment.
 */
function copyHtmlFiles(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`Source directory does not exist: ${src}`);
    return;
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  entries.forEach((entry) => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyHtmlFiles(srcPath, destPath);
    } else if (entry.name.endsWith(".html")) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${srcPath} -> ${destPath}`);
    }
  });
}

const srcDir = path.join(process.cwd(), ".next/server/app/learn");
const destDir = path.join(process.cwd(), ".open-next/assets/learn");

console.log("Copying HTML files from Next.js build to OpenNext assets...");
copyHtmlFiles(srcDir, destDir);
console.log("Done!");
