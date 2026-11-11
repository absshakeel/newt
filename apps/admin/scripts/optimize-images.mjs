import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const DIR = path.resolve('public/images');
const MAX_WIDTH = 1600;
const QUALITY = 78;

const files = (await readdir(DIR)).filter((f) => f.endsWith('.jpg'));

let saved = 0;
for (const file of files) {
  const target = path.join(DIR, file);
  const input = await readFile(target);
  const image = sharp(input, { failOn: 'none' });
  const meta = await image.metadata();

  const output = await image
    .rotate()
    .resize({ width: Math.min(meta.width ?? MAX_WIDTH, MAX_WIDTH), withoutEnlargement: true })
    .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
    .toBuffer();

  if (output.length < input.length) {
    await writeFile(target, output);
    saved += input.length - output.length;
    console.log(`${file.padEnd(26)} ${(input.length / 1024).toFixed(0)}KB -> ${(output.length / 1024).toFixed(0)}KB`);
  } else {
    console.log(`${file.padEnd(26)} ${(input.length / 1024).toFixed(0)}KB (kept)`);
  }
}

console.log(`\nSaved ${(saved / 1024 / 1024).toFixed(1)}MB across ${files.length} images.`);
