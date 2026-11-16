/**
 * Site plan redrawn to scale from page 1 of "5 UNITS TERRACES.pdf".
 * 1 SVG unit = 10mm. Plot: 9m setback + 34m building + 3m margin wide;
 * 3m + 8m + 3m deep. Units drawn as equal 6.8m frontages (34m / 5).
 * TODO: confirm per-unit frontage with the architect.
 */
const PRIMARY = "#024d87";
const ACCENT = "#8ebf41";

const W = 4600; // 46m
const H = 1400; // 14m
const BX = 900;
const BY = 300;
const BW = 3400;
const BH = 800;
const unitWidths = [680, 680, 680, 680, 680]; // ~6.8m frontage each

function Car({ x, y, rotate = false }: { x: number; y: number; rotate?: boolean }) {
  const w = rotate ? 450 : 210;
  const h = rotate ? 210 : 450;
  return <rect x={x} y={y} width={w} height={h} rx={50} fill="none" stroke={ACCENT} strokeWidth={14} />;
}

export function SitePlan({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={`-700 -150 ${W + 1000} ${H + 450}`} className={className} role="img" aria-label="Site plan: five terrace units in a row with parking for 14 cars">
      <rect x={0} y={0} width={W} height={H} fill="#f7f9fa" stroke={PRIMARY} strokeWidth={10} />

      {/* access road */}
      <rect x={-650} y={-100} width={420} height={H + 200} fill="#e5e9ec" />
      <text x={-440} y={H / 2} fill={PRIMARY} fontSize={150} fontWeight={700} textAnchor="middle" transform={`rotate(-90 -440 ${H / 2})`} letterSpacing={20}>
        ACCESS ROAD
      </text>

      {/* parking: 14 cars (client figure) — 2×3 in the front setback, 4 along each long side */}
      {[150, 800].flatMap((y) =>
        [0, 1, 2].map((i) => <Car key={`l${y}-${i}`} x={120 + i * 290} y={y} />),
      )}
      {[45, BY + BH + 50].flatMap((y) =>
        [0, 1, 2, 3].map((i) => <Car key={`s${y}-${i}`} x={1300 + i * 750} y={y} rotate />),
      )}

      {/* building, split into units */}
      {unitWidths.map((uw, i) => {
        const x = BX + unitWidths.slice(0, i).reduce((a, b) => a + b, 0);
        return (
          <g key={i}>
            <rect x={x} y={BY} width={uw} height={BH} fill={i % 2 ? "#d6e6f2" : "#e8f1f8"} stroke={PRIMARY} strokeWidth={14} />
            <text x={x + uw / 2} y={BY + BH / 2 + 55} fill={PRIMARY} fontSize={170} fontWeight={800} textAnchor="middle">
              {i + 1}
            </text>
          </g>
        );
      })}

      {/* dimensions */}
      <g fill="#dc2626" fontSize={110} textAnchor="middle">
        <text x={BX / 2} y={H + 180}>9m</text>
        <text x={BX + BW / 2} y={H + 180}>34m building</text>
        <text x={BX + BW + 150} y={H + 180}>3m</text>
        <text x={W + 70} y={BY + BH / 2 + 40} textAnchor="start">8m</text>
      </g>
      <line x1={0} y1={H + 60} x2={W} y2={H + 60} stroke="#dc2626" strokeWidth={6} />
      {[0, BX, BX + BW, W].map((x) => (
        <line key={x} x1={x} y1={H + 20} x2={x} y2={H + 100} stroke="#dc2626" strokeWidth={6} />
      ))}
    </svg>
  );
}
