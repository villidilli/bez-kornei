// Run after installing the optional graphics dependencies from package.json.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const source = path.join(__dirname, 'sketches/bez-k-leaf-favicon.svg');
const out = path.join(__dirname, 'bez-korney-preview');
(async () => {
  fs.copyFileSync(source, path.join(out, 'favicon.svg'));
  for (const [name, size] of [['favicon-512.png', 512], ['apple-touch-icon.png', 180]]) {
    await sharp(source).resize(size, size).png().toFile(path.join(out, name));
  }
  const sizes = [16, 32, 48];
  const images = await Promise.all(sizes.map(size => sharp(source).resize(size, size).png().toBuffer()));
  const header = Buffer.alloc(6 + 16 * sizes.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  images.forEach((data, i) => {
    const pos = 6 + 16 * i;
    header[pos] = header[pos + 1] = sizes[i];
    header.writeUInt16LE(1, pos + 4);
    header.writeUInt16LE(32, pos + 6);
    header.writeUInt32LE(data.length, pos + 8);
    header.writeUInt32LE(offset, pos + 12);
    offset += data.length;
  });
  fs.writeFileSync(path.join(out, 'favicon.ico'), Buffer.concat([header, ...images]));
  console.log('Favicon formats generated');
})().catch(error => { console.error(error); process.exitCode = 1; });
