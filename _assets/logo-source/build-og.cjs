// Builds the 1200×630 social share card (src/app/opengraph-image.jpg + twitter-image.jpg).
// Text is drawn as Montserrat outlines so it renders identically everywhere.
// Usage: node build-og.cjs <projectRoot>
const path = require("path");
const fs = require("fs");
const opentype = require("opentype.js");
const root = process.argv[2];
const sharp = require(path.join(root, "node_modules/sharp"));
const fontDir = path.join(__dirname, "node_modules/@fontsource/montserrat/files");
const f900 = opentype.loadSync(path.join(fontDir, "montserrat-latin-900-normal.woff"));
const f700 = opentype.loadSync(path.join(fontDir, "montserrat-latin-700-normal.woff"));
const f600 = opentype.loadSync(path.join(fontDir, "montserrat-latin-600-normal.woff"));
// latin-ext subsets supply characters missing from latin, e.g. the Naira sign ₦.
const ext = new Map([
  [f900, opentype.loadSync(path.join(fontDir, "montserrat-latin-ext-900-normal.woff"))],
  [f700, opentype.loadSync(path.join(fontDir, "montserrat-latin-ext-700-normal.woff"))],
  [f600, opentype.loadSync(path.join(fontDir, "montserrat-latin-ext-600-normal.woff"))],
]);

const W = 1200, H = 630;
const text = (font, str, x, y, size, fill, spacing = 0) => {
  let d = "", cx = x;
  for (const ch of str) {
    let f = font, g = font.charToGlyph(ch);
    if (g.index === 0) { f = ext.get(font); g = f.charToGlyph(ch); }
    d += g.getPath(cx, y, size).toPathData(2);
    cx += (g.advanceWidth * size) / f.unitsPerEm + spacing;
  }
  return { svg: `<path fill="${fill}" d="${d}"/>`, width: cx - x };
};

(async () => {
  const bg = await sharp(path.join(root, "src/assets/renders/corner-view-unit-01.jpg"))
    .resize(W, H, { fit: "cover", position: "right" }).toBuffer();

  const lines = [
    text(f700, "FOR SALE  ·  CHEVY VIEW ESTATE, CHEVRON, LEKKI", 64, 268, 20, "#8DC63F", 2),
    text(f900, "4-Bedroom Terrace", 60, 336, 56, "#FFFFFF"),
    text(f900, "Duplexes with BQ", 60, 400, 56, "#FFFFFF"),
    text(f700, "₦499,000,000 per unit", 64, 462, 32, "#FFFFFF"),
    text(f600, "30% deposit  ·  balance over 5 months & 2 weeks", 64, 506, 22, "#D6E6F2"),
  ];
  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#013a66" stop-opacity="0.96"/>
        <stop offset="0.48" stop-color="#013a66" stop-opacity="0.78"/>
        <stop offset="0.78" stop-color="#013a66" stop-opacity="0.05"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <rect x="56" y="48" width="236" height="140" rx="18" fill="#FFFFFF"/>
    <rect x="0" y="${H - 10}" width="${W}" height="10" fill="#8DC63F"/>
    ${lines.map((l) => l.svg).join("\n    ")}
  </svg>`;

  const logo = await sharp(path.join(root, "public/brand/menandu-logo.svg"), { density: 300 }).resize({ width: 204 }).png().toBuffer();
  const card = await sharp(bg)
    .composite([{ input: Buffer.from(overlay) }, { input: logo, left: 72, top: 62 }])
    .jpeg({ quality: 88, mozjpeg: true }).toBuffer();

  const alt = "4-bedroom terrace duplexes with BQ for sale at Chevy View Estate, Chevron, Lekki, Lagos. ₦499,000,000 per unit by Menandu Homes.";
  for (const name of ["opengraph-image", "twitter-image"]) {
    fs.writeFileSync(path.join(root, `src/app/${name}.jpg`), card);
    fs.writeFileSync(path.join(root, `src/app/${name}.alt.txt`), alt);
  }
  console.log("card kB", (card.length / 1024).toFixed(0));
})().catch((e) => { console.error(e); process.exit(1); });
