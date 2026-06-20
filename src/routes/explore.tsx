import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { PROVINCES, BATIKS } from "@/lib/batik-data";
import { PageShell } from "@/components/PageShell";
import { FloatingParticles } from "@/components/FloatingParticles";
import { BatikMotif } from "@/components/BatikMotif";

export const Route = createFileRoute("/explore")({
  component: Explore,
  head: () => ({ meta: [{ title: "Explore · Batikku" }] }),
});

function Explore() {
  const { t } = useLang();
  const [hover, setHover] = useState<string | null>(null);
  const hovered = PROVINCES.find((p) => p.id === hover);

  return (
    <PageShell className="bg-parang">
      <FloatingParticles count={20} />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-xs tracking-[0.3em] uppercase text-gold/80">{t("Chapter I", "Bab I")}</div>
          <h1 className="font-display text-5xl sm:text-6xl mt-2 text-gradient-gold">
            {t("The Archipelago of Motifs", "Nusantara Para Motif")}
          </h1>
          <p className="mt-4 max-w-2xl text-foreground/70 leading-relaxed">
            {t(
              "From the royal courts of Java to the coastal workshops of Cirebon and Lasem, each island whispers a different motif. Hover and choose your region.",
              "Dari keraton Jawa hingga lokakarya pesisir Cirebon dan Lasem, setiap pulau membisikkan motif yang berbeda. Arahkan kursor dan pilih daerahmu."
            )}
          </p>
        </motion.div>

        <div className="mt-10 grid lg:grid-cols-[1.6fr_1fr] gap-8">
          {/* Stylized map */}
          <div className="relative aspect-[16/9] glass-museum rounded-2xl p-4 overflow-hidden">
            <div className="absolute inset-0 bg-megamendung opacity-30" />
            <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full">
              {/* abstract archipelago shapes */}
              {[
                { d: "M5 38 Q12 30 22 33 Q30 35 28 42 Q22 48 12 46 Q6 44 5 38 Z" }, // sumatra
                { d: "M30 56 Q40 50 55 56 Q62 60 55 64 Q42 66 32 62 Z" }, // java
                { d: "M58 64 Q62 60 68 63 Q70 67 64 68 Q60 67 58 64 Z" }, // bali
                { d: "M62 38 Q72 32 82 40 Q80 50 70 52 Q62 50 62 38 Z" }, // sulawesi
                { d: "M82 50 Q92 46 99 54 Q92 62 84 60 Z" }, // papua
                { d: "M44 30 Q60 20 78 28 Q82 36 64 36 Q50 36 44 30 Z" }, // kalimantan
              ].map((s, i) => (
                <path
                  key={i}
                  d={s.d}
                  fill="oklch(0.22 0.04 50 / 0.6)"
                  stroke="oklch(0.78 0.13 80 / 0.4)"
                  strokeWidth="0.2"
                />
              ))}
            </svg>

            {PROVINCES.map((p) => (
              <button
                key={p.id}
                onMouseEnter={() => setHover(p.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setHover(p.id)}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
              >
                <span className="relative flex h-4 w-4">
                  <span className="absolute inset-0 rounded-full bg-gold/60 animate-ping" />
                  <span className="relative rounded-full h-4 w-4 bg-gold border-2 border-background shadow-[0_0_12px_oklch(0.78_0.13_80/0.8)]" />
                </span>
                <span className="absolute left-1/2 -translate-x-1/2 mt-1 text-[10px] font-medium whitespace-nowrap text-gold opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 px-2 py-0.5 rounded">
                  {p.name}
                </span>
              </button>
            ))}
          </div>

          {/* Side info */}
          <motion.aside
            key={hovered?.id ?? "default"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-museum rounded-2xl p-6"
          >
            {hovered ? (
              <>
                <div className="text-xs uppercase tracking-[0.3em] text-gold/80">{t("Province", "Provinsi")}</div>
                <h2 className="font-display text-3xl mt-1 text-foreground">{hovered.name}</h2>
                <p className="mt-3 text-sm text-foreground/70 leading-relaxed">{t(hovered.blurb.en, hovered.blurb.id)}</p>
                <div className="mt-5 text-xs uppercase tracking-[0.2em] text-foreground/50">
                  {t("Signature batik", "Batik khas")}
                </div>
                <div className="mt-3 space-y-2">
                  {hovered.batikIds.map((id) => {
                    const b = BATIKS.find((x) => x.id === id);
                    if (!b) return null;
                    return (
                      <Link
                        key={id}
                        to="/batik/$id"
                        params={{ id }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gold/10 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-md overflow-hidden border border-gold/30">
                          <img src={b.heroImage} alt={b.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-foreground">{b.name}</div>
                          <div className="text-[11px] text-foreground/50">{t(b.tagline.en, b.tagline.id)}</div>
                        </div>
                        <span className="text-gold opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </Link>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-3 opacity-50">✦</div>
                <p className="text-foreground/60">
                  {t("Hover a glowing point to discover its batik.", "Arahkan ke titik bercahaya untuk menemukan batiknya.")}
                </p>
              </div>
            )}
          </motion.aside>
        </div>

        {/* All batik gallery */}
        <div className="mt-20">
          <h2 className="font-display text-3xl text-gradient-gold mb-6">
            {t("The Royal Collection", "Koleksi Kerajaan")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BATIKS.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
              >
                <Link
                  to="/batik/$id"
                  params={{ id: b.id }}
                  className="group block glass-museum rounded-2xl overflow-hidden border-gold-glow"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={b.heroImage}
                      alt={b.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-[10px] tracking-[0.3em] uppercase text-gold/70">{b.era}</div>
                    <h3 className="font-display text-2xl mt-1 text-foreground group-hover:text-gold transition-colors">
                      {b.name}
                    </h3>
                    <p className="mt-1 text-sm text-foreground/60 italic">{t(b.tagline.en, b.tagline.id)}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
