import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { FloatingParticles } from "@/components/FloatingParticles";
import { BatikMotif } from "@/components/BatikMotif";
import { BATIKS } from "@/lib/batik-data";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { t } = useLang();

  return (
    <main className="relative min-h-screen overflow-hidden bg-parang">
      <FloatingParticles count={36} />

      {/* spotlight */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-gradient-radial from-gold/15 via-copper/5 to-transparent blur-3xl" />
      </div>

      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 grid lg:grid-cols-2 gap-10 items-center min-h-screen">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-museum text-xs tracking-[0.2em] uppercase text-gold mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            {t("UNESCO Intangible Heritage · 2009", "Warisan Tak Benda UNESCO · 2009")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight"
          >
            <span className="text-foreground">{t("A cloth that holds", "Sehelai kain yang menyimpan")}</span>
            <br />
            <span className="text-gradient-gold italic">{t("a thousand stories.", "seribu kisah.")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-8 text-lg text-foreground/70 max-w-xl leading-relaxed font-light"
          >
            {t(
              "Batikku is an interactive digital museum where Indonesia's batik heritage lives — its motifs, philosophy, regions, and the hands of the artisans who keep it alive.",
              "Batikku adalah museum digital interaktif tempat warisan batik Indonesia hidup — motifnya, filosofinya, daerahnya, dan tangan para pengrajin yang menjaganya."
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              to="/explore"
              className="group relative px-8 py-3.5 rounded-full bg-gold text-background font-medium tracking-wide overflow-hidden border-gold-glow"
            >
              <span className="relative z-10">{t("Start Journey", "Mulai Perjalanan")} →</span>
              <span className="absolute inset-0 shimmer-gold opacity-60" />
            </Link>
            <Link
              to="/lab"
              className="px-8 py-3.5 rounded-full border border-gold/40 text-gold hover:bg-gold/10 font-medium tracking-wide transition-colors"
            >
              {t("Open the Batik Lab", "Buka Lab Batik")}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-14 grid grid-cols-3 gap-6 max-w-md"
          >
            {[
              { n: "34", l: t("Provinces", "Provinsi") },
              { n: "6+", l: t("Royal motifs", "Motif keraton") },
              { n: "700y", l: t("of heritage", "warisan") },
            ].map((s, i) => (
              <div key={i} className="border-l border-gold/30 pl-3">
                <div className="font-display text-3xl text-gradient-gold">{s.n}</div>
                <div className="text-xs uppercase tracking-widest text-foreground/50 mt-1">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Hero motif stack */}
        <div className="relative flex items-center justify-center h-[500px] lg:h-[600px]">
          <motion.div
            className="absolute spin-slow opacity-40"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 2 }}
          >
            <div className="w-[520px] h-[520px] rounded-full border border-gold/30" />
            <div className="absolute inset-8 rounded-full border border-gold/20" />
            <div className="absolute inset-16 rounded-full border border-gold/10" />
          </motion.div>

          {BATIKS.slice(0, 3).map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: (i - 1) * 8 }}
              transition={{ delay: 0.5 + i * 0.2, duration: 1, ease: "easeOut" }}
              style={{
                zIndex: i === 1 ? 3 : 2 - Math.abs(i - 1),
                x: (i - 1) * 70,
                y: i === 1 ? 0 : 40,
              }}
              className="absolute float-slow"
            >
              <div className="border-gold-glow rounded-2xl">
                <BatikMotif motif={b.motif} colors={b.colors} size={i === 1 ? 300 : 220} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-32 text-center">
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="font-display text-2xl sm:text-3xl italic text-foreground/80 leading-relaxed"
        >
          “{t(
            "Batik is not merely fabric, but a story woven through generations.",
            "Batik bukan sekadar kain, melainkan kisah yang ditenun lintas generasi."
          )}”
        </motion.blockquote>
        <div className="mt-4 text-xs tracking-[0.3em] uppercase text-gold/70">— Batikku</div>
      </section>
    </main>
  );
}
