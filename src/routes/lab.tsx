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
    const s = stats.current;
    // Heuristic similarity to known motifs
    const scores = {
      parang: s.waves * 2 + (s.colorsUsed.has("#3a2418") ? 8 : 0) + (s.colorsUsed.has("#c9a14a") ? 8 : 0) + (symmetry === 2 ? 10 : 0),
      kawung: s.dots * 3 + (symmetry === 4 ? 15 : symmetry === 8 ? 10 : 0) + (s.colorsUsed.size <= 3 ? 6 : 0),
      megamendung: s.waves * 4 + (s.colorsUsed.has("#1e3a5f") || s.colorsUsed.has("#5a8fc4") ? 20 : 0),
      sekarjagad: s.flowers * 2 + s.colorsUsed.size * 4 + (s.colorsUsed.size >= 4 ? 15 : 0),
      truntum: s.dots * 4 + (symmetry >= 4 ? 8 : 0) + (s.colorsUsed.has("#c9a14a") ? 6 : 0),
      lasem: (s.colorsUsed.has("#b22222") ? 25 : 0) + s.flowers * 2 + s.dots,
    };
    const entries = Object.entries(scores);
    const total = entries.reduce((a, [, v]) => a + v, 0) || 1;
    entries.sort((a, b) => b[1] - a[1]);
    const [winnerId, winnerScore] = entries[0];
    const pct = Math.min(98, Math.round((winnerScore / total) * 100 + 35));
    const b = BATIKS.find((x) => x.id === winnerId)!;

    const reasonsEN: Record<string, string> = {
      parang: "Your flowing diagonal strokes and earthen tones echo the unbroken rivers of royal Parang.",
      kawung: "The quiet geometric repetition and restrained palette mirror Kawung's meditative order.",
      megamendung: "Those rolling waves and indigo skies are the unmistakable breath of Cirebon's clouds.",
      sekarjagad: "A garden of forms in many colors — a true 'map of the world' in cloth.",
      truntum: "Small constellations of dots, gentle and patient — love rekindled, as in Truntum.",
      lasem: "Bold crimson and coastal motifs — your work breathes the blood-red of Lasem.",
    };
    const reasonsID: Record<string, string> = {
      parang: "Sapuan diagonal mengalir dan warna bumimu menggemakan sungai tak putus Parang keraton.",
      kawung: "Pengulangan geometris yang tenang dan palet terkendali mencerminkan keteraturan meditatif Kawung.",
      megamendung: "Ombak-ombak dan langit nila itu adalah napas khas awan Cirebon.",
      sekarjagad: "Taman bentuk warna-warni — 'peta dunia' sejati dalam sehelai kain.",
      truntum: "Bintang-bintang kecil titik, lembut dan sabar — cinta yang bersemi seperti Truntum.",
      lasem: "Merah berani dan motif pesisir — karyamu bernapaskan merah darah Lasem.",
    };

    setMatch({
      id: b.id,
      name: b.name,
      score: pct,
      reason: t(reasonsEN[winnerId], reasonsID[winnerId]),
    });
    markCreated();
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
