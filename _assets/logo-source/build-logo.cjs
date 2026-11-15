// Rebuilds the Menandu Homes logo as a crisp SVG:
//  - icon: each colour layer is smoothed (blur + threshold) then traced with potrace
//  - wordmark: real Montserrat outlines (opentype.js), fitted to the original's measured boxes
// Usage: node build-logo.cjs <projectRoot> <outDir>
const path = require("path");
const fs = require("fs");
const potrace = require("potrace");
const opentype = require("opentype.js");
const [root, outDir] = process.argv.slice(2);
const sharp = require(path.join(root, "node_modules/sharp"));

const S = 3; // working scale
const W0 = 829, H0 = 457, W = W0 * S, H = H0 * S;
const C = { navy: "#10578D", roof: "#2580BD", green: "#8DC63F", black: "#1A1A1A" };
// Measured from the original PNG (1x px): [x0, y0, x1, y1]
const BOX = { icon: [196, 11, 620, 227], word: [9, 276, 814, 375], homes: [269, 400, 553, 449] };

const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;

const trace = (png, turd = 40) =>
  new Promise((res, rej) => {
    const t = new potrace.Potrace();
    t.setParameters({ threshold: 128, turdSize: turd, optTolerance: 0.6, alphaMax: 1.1, turnPolicy: potrace.Potrace.TURNPOLICY_MAJORITY });
    t.loadImage(png, (e) => (e ? rej(e) : res((t.getPathTag("#000").match(/ d="([^"]+)"/) || [])[1] || "")));
  });

/** mask (Uint8 0=ink,255=paper) -> smoothed PNG (blur then hard threshold) */
async function smooth(mask, sigma, thresh = 128) {
  // blur the ink (invert so ink = white for a symmetric blur), threshold, invert back
  const inv = Buffer.from(mask.map((v) => 255 - v));
  const buf = await sharp(inv, { raw: { width: W, height: H, channels: 1 } }).blur(sigma).threshold(thresh).negate().png().toBuffer();
  return buf;
}

async function rawMask(png) {
  return (await sharp(png).greyscale().raw().toBuffer());
}

(async () => {
  const { data } = await sharp(path.join(root, "_assets/menandu-homes-logo-transparent.png"))
    .resize(W, H, { kernel: "lanczos3" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  const inIcon = (x, y) => x >= (BOX.icon[0] - 4) * S && x <= (BOX.icon[2] + 4) * S && y >= (BOX.icon[1] - 4) * S && y <= (BOX.icon[3] + 6) * S;
  const roof = Buffer.alloc(W * H, 255), navy = Buffer.alloc(W * H, 255), green = Buffer.alloc(W * H, 255);
  for (let p = 0; p < W * H; p++) {
    const i = p * 4, x = p % W, y = (p / W) | 0;
    if (!inIcon(x, y)) continue;
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a < 120) continue;
    const l = lum(r, g, b);
    if (g > r + 12 && g > b + 20) green[p] = 0;
    else if (b > r + 40 && l >= 88 && l < 200) roof[p] = 0;
    else if (b > r + 25 && l < 88) navy[p] = 0;
  }

  // Roof: close the dark speckles inside it, then smooth.
  const roofSmooth = await smooth(roof, 7, 110);
  // Navy (rafter, windows, ground arc): drop anything that sits inside the roof.
  const roofZone = await rawMask(await smooth(roof, 14, 40));
  for (let p = 0; p < W * H; p++) if (roofZone[p] === 0) navy[p] = 255;
  const navySmooth = await smooth(navy, 3.5, 128);
  const greenSmooth = await smooth(green, 5, 128);

  // Hand-drawn icon (829x457 space) scaled to the 3x working space; auto-traced layers kept only for comparison.
  const iconFrag = fs.readFileSync(path.join(__dirname, "icon.svgfrag"), "utf8").replace(/<!--[\s\S]*?-->/g, "").trim();
  const icon = [`<g transform="scale(${S})">${iconFrag}</g>`];
  void roofSmooth; void navySmooth; void greenSmooth;

  // Wordmark from Montserrat outlines, fitted to the measured boxes.
  const fontDir = path.join(__dirname, "node_modules/@fontsource/montserrat/files");
  const black = opentype.loadSync(path.join(fontDir, "montserrat-latin-900-normal.woff"));
  const bold = opentype.loadSync(path.join(fontDir, "montserrat-latin-800-normal.woff"));

  function fitText(font, text, [x0, y0, x1, y1], fill) {
    const capH = (y1 - y0 + 1) * S, width = (x1 - x0 + 1) * S;
    const capUnits = font.tables.os2.sCapHeight || 700;
    const size = (capH / capUnits) * font.unitsPerEm;
    // natural width at this size, then spread/squeeze tracking to match the original width
    const glyphs = font.stringToGlyphs(text);
    const adv = glyphs.map((g) => (g.advanceWidth * size) / font.unitsPerEm);
    const first = glyphs[0].getBoundingBox(), last = glyphs[glyphs.length - 1].getBoundingBox();
    const lsb = (first.x1 * size) / font.unitsPerEm;
    const rsb = ((glyphs[glyphs.length - 1].advanceWidth - last.x2) * size) / font.unitsPerEm;
    const natural = adv.reduce((a, b) => a + b, 0) - lsb - rsb;
    const track = (width - natural) / (glyphs.length - 1);
    let x = x0 * S - lsb;
    const baseline = (y1 + 1) * S;
    let d = "";
    glyphs.forEach((g, i) => {
      d += g.getPath(x, baseline, size).toPathData(2);
      x += adv[i] + track;
    });
    return { svg: `<path fill="${fill}" d="${d}"/>`, size: size / S, track: track / S, natural: natural / S };
  }
  const word = fitText(black, "MENANDU", BOX.word, C.navy);
  const homes = fitText(bold, "HOMES", BOX.homes, C.black);
  console.log("MENANDU size", word.size.toFixed(1), "track", word.track.toFixed(1), "| HOMES size", homes.size.toFixed(1), "track", homes.track.toFixed(1));

  const body = [...icon, word.svg, homes.svg].join("\n  ");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Menandu Homes">\n  <title>Menandu Homes</title>\n  ${body}\n</svg>\n`;
  fs.writeFileSync(path.join(outDir, "menandu-logo.svg"), svg);
  console.log("svg kB", (svg.length / 1024).toFixed(1));

  // Preview: original (top) vs rebuilt (bottom), same size.
  const orig = await sharp(path.join(root, "_assets/menandu-homes-logo-transparent.png")).resize({ width: 1200 }).flatten({ background: "#fff" }).png().toBuffer();
  const neu = await sharp(Buffer.from(svg)).resize({ width: 1200 }).flatten({ background: "#fff" }).png().toBuffer();
  const h = Math.round((1200 * H0) / W0);
  await sharp({ create: { width: 1200, height: h * 2 + 20, channels: 3, background: "#e5e7eb" } })
    .composite([{ input: orig, top: 0, left: 0 }, { input: neu, top: h + 20, left: 0 }]).png().toFile(path.join(outDir, "logo-compare.png"));
})().catch((e) => { console.error(e); process.exit(1); });
