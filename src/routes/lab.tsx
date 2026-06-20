import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { BATIKS } from "@/lib/batik-data";
import { PageShell } from "@/components/PageShell";
import { FloatingParticles } from "@/components/FloatingParticles";
import { markCreated } from "@/lib/passport";
import { BatikMotif } from "@/components/BatikMotif";

export const Route = createFileRoute("/lab")({
  component: Lab,
  head: () => ({ meta: [{ title: "Batik Lab · Batikku" }] }),
});

type Tool = "brush" | "stamp-dot" | "stamp-wave" | "stamp-flower";
type Match = { id: string; name: string; score: number; reason: string };

const PALETTE = ["#3a2418", "#c9a14a", "#b22222", "#1e3a5f", "#2a8a3a", "#f5e9d0", "#8b3a2e", "#5a8fc4"];

function Lab() {
  const { t } = useLang();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<Tool>("brush");
  const [color, setColor] = useState(PALETTE[1]);
  const [size, setSize] = useState(8);
  const [symmetry, setSymmetry] = useState<2 | 4 | 6 | 8>(4);
  const [match, setMatch] = useState<Match | null>(null);
  const drawing = useRef(false);
  const stats = useRef({ strokes: 0, dots: 0, waves: 0, flowers: 0, colorsUsed: new Set<string>() });

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#f5e9d0";
    ctx.fillRect(0, 0, c.width, c.height);
  }, []);

  function withSymmetry(cb: (ctx: CanvasRenderingContext2D, x: number, y: number) => void, x: number, y: number) {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    const cx = c.width / 2;
    const cy = c.height / 2;
    for (let i = 0; i < symmetry; i++) {
      const angle = (i * 2 * Math.PI) / symmetry;
      const dx = x - cx;
      const dy = y - cy;
      const rx = cx + dx * Math.cos(angle) - dy * Math.sin(angle);
      const ry = cy + dx * Math.sin(angle) + dy * Math.cos(angle);
      cb(ctx, rx, ry);
    }
  }

  function paint(x: number, y: number) {
    stats.current.colorsUsed.add(color);
    if (tool === "brush") {
      withSymmetry((ctx, px, py) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px, py, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }, x, y);
      stats.current.strokes++;
    } else if (tool === "stamp-dot") {
      withSymmetry((ctx, px, py) => {
        ctx.fillStyle = color;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.arc(px + Math.cos((i * Math.PI) / 2) * size, py + Math.sin((i * Math.PI) / 2) * size, size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(px, py, size / 3, 0, Math.PI * 2);
        ctx.fill();
      }, x, y);
      stats.current.dots++;
    } else if (tool === "stamp-wave") {
      withSymmetry((ctx, px, py) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = size / 3;
        ctx.beginPath();
        for (let i = -size * 2; i <= size * 2; i += 2) {
          const yy = py + Math.sin(i / 5) * size * 0.6;
          if (i === -size * 2) ctx.moveTo(px + i, yy);
          else ctx.lineTo(px + i, yy);
        }
        ctx.stroke();
      }, x, y);
      stats.current.waves++;
    } else if (tool === "stamp-flower") {
      withSymmetry((ctx, px, py) => {
        ctx.fillStyle = color;
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          ctx.beginPath();
          ctx.ellipse(px + Math.cos(a) * size * 0.7, py + Math.sin(a) * size * 0.7, size * 0.5, size * 0.3, a, 0, Math.PI * 2);
          ctx.fill();
        }
      }, x, y);
      stats.current.flowers++;
    }
  }

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const e2: any = "touches" in e ? e.touches[0] : e;
    return {
      x: ((e2.clientX - rect.left) / rect.width) * c.width,
      y: ((e2.clientY - rect.top) / rect.height) * c.height,
    };
  }

  function clear() {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#f5e9d0";
    ctx.fillRect(0, 0, c.width, c.height);
    stats.current = { strokes: 0, dots: 0, waves: 0, flowers: 0, colorsUsed: new Set() };
    setMatch(null);
  }

  function analyze() {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    const imageData = ctx.getImageData(0, 0, c.width, c.height);
    const pixels = imageData.data;
    const s = stats.current;
    const totalPixels = c.width * c.height;

    // ── 1. COLOR ANALYSIS ──────────────────────────────────────────────
    // Background color (ivory #f5e9d0 → rgb 245,233,208)
    const BG_R = 245, BG_G = 233, BG_B = 208;
    const BG_THRESHOLD = 30; // distance to consider "background"

    let paintedPixels = 0;
    const colorBuckets: Record<string, number> = {
      brown: 0, gold: 0, red: 0, darkBlue: 0, lightBlue: 0,
      green: 0, cream: 0, darkRed: 0, black: 0, other: 0,
    };
    let totalR = 0, totalG = 0, totalB = 0;

    // Quadrant density (divide canvas into 4x4 grid)
    const GRID = 4;
    const cellW = c.width / GRID;
    const cellH = c.height / GRID;
    const gridDensity: number[][] = Array.from({ length: GRID }, () => Array(GRID).fill(0));

    // Direction analysis — compare neighboring pixels for stroke direction
    let horizontalEdges = 0;
    let verticalEdges = 0;
    let diagonalEdges = 0;

    for (let y = 0; y < c.height; y++) {
      for (let x = 0; x < c.width; x++) {
        const i = (y * c.width + x) * 4;
        const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];

        // Check if painted (not background)
        const distBG = Math.sqrt((r - BG_R) ** 2 + (g - BG_G) ** 2 + (b - BG_B) ** 2);
        if (distBG < BG_THRESHOLD) continue;

        paintedPixels++;
        totalR += r; totalG += g; totalB += b;

        // Grid density
        const gx = Math.min(GRID - 1, Math.floor(x / cellW));
        const gy = Math.min(GRID - 1, Math.floor(y / cellH));
        gridDensity[gy][gx]++;

        // Classify color
        const hsl = rgbToHsl(r, g, b);
        const [h, sat, l] = hsl;

        if (l < 0.15) colorBuckets.black++;
        else if (l > 0.85) colorBuckets.cream++;
        else if (sat < 0.15) colorBuckets.other++;
        else if (h >= 0 && h < 15) colorBuckets.red++;
        else if (h >= 15 && h < 45) colorBuckets[l < 0.45 ? "brown" : "gold"]++;
        else if (h >= 45 && h < 70) colorBuckets.gold++;
        else if (h >= 70 && h < 160) colorBuckets.green++;
        else if (h >= 160 && h < 250) colorBuckets[l < 0.4 ? "darkBlue" : "lightBlue"]++;
        else if (h >= 250 && h < 330) colorBuckets.other++;
        else colorBuckets[l < 0.4 ? "darkRed" : "red"]++;

        // Edge/direction analysis (sample every 3rd pixel for performance)
        if (x % 3 === 0 && y % 3 === 0 && x < c.width - 3 && y < c.height - 3) {
          const right = (y * c.width + (x + 3)) * 4;
          const down = ((y + 3) * c.width + x) * 4;
          const diag = ((y + 3) * c.width + (x + 3)) * 4;

          const diffRight = Math.abs(pixels[right] - r) + Math.abs(pixels[right + 1] - g) + Math.abs(pixels[right + 2] - b);
          const diffDown = Math.abs(pixels[down] - r) + Math.abs(pixels[down + 1] - g) + Math.abs(pixels[down + 2] - b);
          const diffDiag = Math.abs(pixels[diag] - r) + Math.abs(pixels[diag + 1] - g) + Math.abs(pixels[diag + 2] - b);

          if (diffRight > 60) horizontalEdges++;
          if (diffDown > 60) verticalEdges++;
          if (diffDiag > 60) diagonalEdges++;
        }
      }
    }

    // ── 2. DERIVED METRICS ─────────────────────────────────────────────
    const coverage = paintedPixels / totalPixels; // 0-1
    const avgR = paintedPixels ? totalR / paintedPixels : 0;
    const avgG = paintedPixels ? totalG / paintedPixels : 0;
    const avgB = paintedPixels ? totalB / paintedPixels : 0;

    // Color temperature (warm = high, cool = low)
    const warmth = (avgR * 2 + avgG - avgB) / (255 * 3);

    // Color diversity — how many buckets have significant presence
    const significantColors = Object.values(colorBuckets).filter(v => v > paintedPixels * 0.05).length;

    // Pattern regularity — how evenly distributed across grid
    const flatGrid = gridDensity.flat();
    const avgDensity = flatGrid.reduce((a, b) => a + b, 0) / flatGrid.length || 1;
    const densityVariance = flatGrid.reduce((a, v) => a + (v - avgDensity) ** 2, 0) / flatGrid.length;
    const regularity = 1 / (1 + Math.sqrt(densityVariance) / avgDensity); // 0-1, higher = more regular

    // Dominant stroke direction
    const totalEdges = horizontalEdges + verticalEdges + diagonalEdges || 1;
    const diagonalRatio = diagonalEdges / totalEdges;
    const horizontalRatio = horizontalEdges / totalEdges;

    // Blue dominance, red dominance, earth tone dominance
    const blueRatio = (colorBuckets.darkBlue + colorBuckets.lightBlue) / (paintedPixels || 1);
    const redRatio = (colorBuckets.red + colorBuckets.darkRed) / (paintedPixels || 1);
    const earthRatio = (colorBuckets.brown + colorBuckets.gold) / (paintedPixels || 1);
    const darkRatio = colorBuckets.black / (paintedPixels || 1);

    // ── 3. ENHANCED MULTI-FACTOR SCORING ───────────────────────────────
    const scores = {
      parang:
        (diagonalRatio > 0.35 ? 25 : diagonalRatio > 0.25 ? 15 : 5) +
        (earthRatio > 0.3 ? 20 : earthRatio > 0.15 ? 10 : 0) +
        (warmth > 0.4 ? 10 : 0) +
        (symmetry === 2 ? 15 : symmetry === 4 ? 5 : 0) +
        (s.waves * 1.5) +
        (s.strokes > 20 ? 8 : 0) +
        (significantColors <= 3 ? 8 : 0) +
        (coverage > 0.15 ? 5 : 0),

      kawung:
        (s.dots * 2.5) +
        (symmetry === 4 ? 20 : symmetry === 8 ? 15 : symmetry === 6 ? 10 : 0) +
        (regularity > 0.5 ? 18 : regularity > 0.3 ? 10 : 0) +
        (significantColors <= 3 ? 12 : 0) +
        (earthRatio > 0.2 ? 8 : 0) +
        (darkRatio > 0.1 ? 6 : 0) +
        (coverage < 0.4 ? 5 : 0),

      megamendung:
        (blueRatio > 0.4 ? 30 : blueRatio > 0.2 ? 20 : blueRatio > 0.1 ? 10 : 0) +
        (s.waves * 3) +
        (horizontalRatio > 0.35 ? 15 : 5) +
        (significantColors >= 2 && significantColors <= 4 ? 8 : 0) +
        (warmth < 0.35 ? 12 : 0) +
        (coverage > 0.2 ? 5 : 0),

      sekarjagad:
        (significantColors >= 4 ? 25 : significantColors >= 3 ? 15 : 5) +
        (s.flowers * 2) +
        (coverage > 0.3 ? 15 : coverage > 0.15 ? 8 : 0) +
        (regularity < 0.4 ? 12 : 5) + // irregular = diverse patterns
        (s.colorsUsed.size >= 4 ? 15 : s.colorsUsed.size >= 3 ? 8 : 0) +
        (s.dots + s.waves + s.flowers >= 5 ? 10 : 0),

      truntum:
        (s.dots * 3) +
        (symmetry >= 6 ? 18 : symmetry >= 4 ? 12 : 0) +
        (regularity > 0.4 ? 15 : 5) +
        (coverage < 0.35 ? 10 : 0) + // scattered small dots = low coverage
        (earthRatio > 0.15 ? 8 : 0) +
        (darkRatio > 0.15 ? 8 : 0) +
        (significantColors <= 3 ? 8 : 0),

      lasem:
        (redRatio > 0.3 ? 30 : redRatio > 0.15 ? 20 : redRatio > 0.05 ? 10 : 0) +
        (s.flowers * 2) +
        (significantColors >= 3 ? 10 : 0) +
        (blueRatio > 0.1 && redRatio > 0.1 ? 15 : 0) + // red + blue combo
        (coverage > 0.2 ? 8 : 0) +
        (s.dots + s.waves > 0 ? 5 : 0),
    };

    // Normalize & rank
    const entries = Object.entries(scores);
    const maxScore = Math.max(...entries.map(([, v]) => v), 1);
    entries.sort((a, b) => b[1] - a[1]);
    const [winnerId, winnerScore] = entries[0];
    const runnerUp = entries[1];

    // Confidence based on margin between winner and runner-up
    const margin = (winnerScore - runnerUp[1]) / maxScore;
    const basePct = Math.round((winnerScore / maxScore) * 60);
    const confidenceBoost = Math.round(margin * 25);
    const pct = Math.max(35, Math.min(98, basePct + confidenceBoost + 15));

    const b = BATIKS.find((x) => x.id === winnerId)!;

    // ── 4. DYNAMIC REASON GENERATION ───────────────────────────────────
    const traits: { en: string; id: string }[] = [];

    if (diagonalRatio > 0.3) traits.push({ en: "strong diagonal flow", id: "aliran diagonal yang kuat" });
    if (horizontalRatio > 0.35) traits.push({ en: "layered horizontal waves", id: "gelombang horizontal berlapis" });
    if (blueRatio > 0.2) traits.push({ en: "dominant indigo/blue palette", id: "palet biru/nila yang dominan" });
    if (redRatio > 0.15) traits.push({ en: "bold crimson presence", id: "kehadiran merah berani" });
    if (earthRatio > 0.25) traits.push({ en: "warm earth tones", id: "nada warna bumi yang hangat" });
    if (regularity > 0.5) traits.push({ en: "high pattern regularity", id: "keteraturan pola yang tinggi" });
    if (significantColors >= 4) traits.push({ en: "rich color diversity", id: "keragaman warna yang kaya" });
    if (coverage > 0.35) traits.push({ en: "dense coverage", id: "cakupan padat" });
    if (coverage < 0.2 && paintedPixels > 100) traits.push({ en: "scattered, delicate marks", id: "tanda halus yang tersebar" });
    if (symmetry >= 6) traits.push({ en: `${symmetry}-fold radial symmetry`, id: `simetri radial ${symmetry} lipatan` });
    if (s.dots > 5) traits.push({ en: "dot-based patterns", id: "pola berbasis titik" });
    if (s.waves > 3) traits.push({ en: "wave-like strokes", id: "sapuan seperti gelombang" });

    const fallbackReasons: Record<string, { en: string; id: string }> = {
      parang: { en: "Your flowing strokes echo the unbroken rivers of royal Parang.", id: "Sapuan mengalirmu menggemakan sungai tak putus Parang keraton." },
      kawung: { en: "The quiet repetition mirrors Kawung's meditative order.", id: "Pengulangan yang tenang mencerminkan keteraturan meditatif Kawung." },
      megamendung: { en: "Those rolling forms are the breath of Cirebon's clouds.", id: "Bentuk menggulung itu adalah napas awan Cirebon." },
      sekarjagad: { en: "A garden of many forms — a true map of the world.", id: "Taman berbagai bentuk — peta dunia sejati." },
      truntum: { en: "Gentle constellations, patient and soft — love rekindled.", id: "Konstelasi lembut, sabar dan halus — cinta yang bersemi kembali." },
      lasem: { en: "Bold marks with coastal spirit — the blood-red of Lasem.", id: "Tanda berani dengan jiwa pesisir — merah darah Lasem." },
    };

    let reason: string;
    if (traits.length >= 2) {
      const traitStr = traits.slice(0, 3).map(tr => t(tr.en, tr.id)).join(", ");
      reason = t(
        `We detected ${traitStr}. These qualities strongly resemble the spirit of ${b.name}.`,
        `Kami mendeteksi ${traitStr}. Kualitas ini sangat menyerupai semangat ${b.name}.`
      );
    } else if (traits.length === 1) {
      reason = t(
        `Your work shows ${traits[0].en}, a key characteristic of ${b.name}. ${fallbackReasons[winnerId].en}`,
        `Karyamu menunjukkan ${traits[0].id}, karakteristik kunci dari ${b.name}. ${fallbackReasons[winnerId].id}`
      );
    } else {
      reason = t(fallbackReasons[winnerId].en, fallbackReasons[winnerId].id);
    }

    setMatch({ id: b.id, name: b.name, score: pct, reason });
    markCreated();
  }

  // Helper: RGB → HSL
  function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return [0, 0, l];
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h = 0;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
    return [h, s, l];
  }

  function download() {
    const c = canvasRef.current!;
    const link = document.createElement("a");
    link.download = "my-batik.png";
    link.href = c.toDataURL("image/png");
    link.click();
  }

  const tools: { id: Tool; label: { en: string; id: string }; icon: string }[] = [
    { id: "brush", label: { en: "Brush", id: "Kuas" }, icon: "✎" },
    { id: "stamp-dot", label: { en: "Dot stamp", id: "Cap titik" }, icon: "✦" },
    { id: "stamp-wave", label: { en: "Wave", id: "Ombak" }, icon: "~" },
    { id: "stamp-flower", label: { en: "Flower", id: "Bunga" }, icon: "❀" },
  ];

  return (
    <PageShell className="bg-parang">
      <FloatingParticles count={12} />
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-xs tracking-[0.3em] uppercase text-gold/80">{t("The Studio", "Sanggar")}</div>
        <h1 className="font-display text-5xl sm:text-6xl mt-2 text-gradient-gold">
          {t("Create your own Batik", "Ciptakan Batikmu sendiri")}
        </h1>
        <p className="mt-3 text-foreground/70 max-w-2xl">
          {t(
            "Draw with radial symmetry, stamp motifs, and let our pattern intelligence reveal which royal batik your soul resembles.",
            "Lukis dengan simetri radial, cap motifmu, dan biarkan kecerdasan pola mengungkap batik keraton mana yang mirip dengan jiwamu."
          )}
        </p>

        <div className="mt-10 grid lg:grid-cols-[260px_1fr_300px] gap-6">
          {/* Tools */}
          <div className="glass-museum rounded-2xl p-5 space-y-5 h-fit">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-gold/80 mb-2">{t("Tool", "Alat")}</div>
              <div className="grid grid-cols-2 gap-2">
                {tools.map((tl) => (
                  <button
                    key={tl.id}
                    onClick={() => setTool(tl.id)}
                    className={`p-3 rounded-lg text-sm transition-all ${
                      tool === tl.id ? "bg-gold text-background" : "border border-gold/30 text-foreground/80 hover:bg-gold/10"
                    }`}
                  >
                    <div className="text-lg leading-none mb-1">{tl.icon}</div>
                    {t(tl.label.en, tl.label.id)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-gold/80 mb-2">{t("Palette", "Palet")}</div>
              <div className="grid grid-cols-4 gap-2">
                {PALETTE.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    style={{ background: c }}
                    className={`w-10 h-10 rounded-full border-2 transition-transform ${
                      color === c ? "border-gold scale-110" : "border-foreground/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-gold/80 mb-2">
                {t("Brush size", "Ukuran kuas")} · {size}
              </div>
              <input
                type="range"
                min={2}
                max={28}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-gold"
              />
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-gold/80 mb-2">{t("Symmetry", "Simetri")}</div>
              <div className="flex gap-2">
                {([2, 4, 6, 8] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSymmetry(s)}
                    className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                      symmetry === s ? "bg-gold text-background" : "border border-gold/30 text-foreground/70"
                    }`}
                  >
                    ×{s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-gold/20">
              <button onClick={clear} className="py-2 rounded-lg border border-gold/30 text-foreground/70 hover:bg-gold/10 text-sm">
                {t("Clear cloth", "Bersihkan kain")}
              </button>
              <button onClick={download} className="py-2 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 text-sm">
                {t("Save as image", "Simpan gambar")}
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="glass-museum rounded-2xl p-3">
            <canvas
              ref={canvasRef}
              width={720}
              height={720}
              className="w-full aspect-square rounded-xl cursor-crosshair touch-none bg-[#f5e9d0]"
              onMouseDown={(e) => {
                drawing.current = true;
                const { x, y } = getPos(e);
                paint(x, y);
              }}
              onMouseMove={(e) => {
                if (!drawing.current) return;
                const { x, y } = getPos(e);
                paint(x, y);
              }}
              onMouseUp={() => (drawing.current = false)}
              onMouseLeave={() => (drawing.current = false)}
              onTouchStart={(e) => {
                drawing.current = true;
                const { x, y } = getPos(e);
                paint(x, y);
              }}
              onTouchMove={(e) => {
                if (!drawing.current) return;
                const { x, y } = getPos(e);
                paint(x, y);
              }}
              onTouchEnd={() => (drawing.current = false)}
            />
          </div>

          {/* AI Match */}
          <div className="glass-museum rounded-2xl p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-gold/80 mb-2">{t("AI Style Matcher", "Pencocok Gaya AI")}</div>
            <p className="text-xs text-foreground/60 mb-4">
              {t("Draw something, then reveal your batik soul.", "Gambar sesuatu, lalu ungkap jiwa batikmu.")}
            </p>
            <button
              onClick={analyze}
              className="w-full py-3 rounded-lg bg-gold text-background font-medium relative overflow-hidden"
            >
              <span className="relative z-10">{t("Match my Batik", "Cocokkan Batikku")}</span>
              <span className="absolute inset-0 shimmer-gold opacity-50" />
            </button>

            {match && (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5"
              >
                <div className="text-xs text-foreground/50">{t("Your style resembles", "Gayamu menyerupai")}</div>
                <div className="font-display text-2xl text-gold mt-1">{match.name}</div>
                <div className="mt-3 h-2 rounded-full bg-foreground/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${match.score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-copper via-gold to-amber-glow"
                  />
                </div>
                <div className="mt-1 text-right text-xs text-gold">{match.score}% {t("similarity", "kemiripan")}</div>
                <p className="mt-4 text-sm text-foreground/70 leading-relaxed italic">"{match.reason}"</p>
                <div className="mt-4">
                  <BatikMotif
                    motif={BATIKS.find((b) => b.id === match.id)!.motif}
                    colors={BATIKS.find((b) => b.id === match.id)!.colors}
                    size={240}
                    animated={false}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
