import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useLang } from "@/lib/i18n";
import { BATIKS } from "@/lib/batik-data";
import { PageShell } from "@/components/PageShell";
import { BatikMotif } from "@/components/BatikMotif";
import { FloatingParticles } from "@/components/FloatingParticles";
import { visitBatik } from "@/lib/passport";

export const Route = createFileRoute("/batik/$id")({
  loader: ({ params }) => {
    const b = BATIKS.find((x) => x.id === params.id);
    if (!b) throw notFound();
    return b;
  },
  component: BatikDetail,
  notFoundComponent: () => (
    <PageShell>
      <div className="text-center py-20">
        <h1 className="font-display text-3xl text-gold">Batik not found</h1>
        <Link to="/explore" className="mt-4 inline-block text-foreground/70 underline">Back to explore</Link>
      </div>
    </PageShell>
  ),
});

function BatikDetail() {
  const b = Route.useLoaderData() as (typeof BATIKS)[number];
  const { t } = useLang();

  useEffect(() => {
    visitBatik(b.id);
  }, [b.id]);

  return (
    <PageShell className="bg-parang">
      <FloatingParticles count={18} />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <Link to="/explore" className="text-xs tracking-[0.3em] uppercase text-gold/80 hover:text-gold">
          ← {t("Back to Atlas", "Kembali ke Atlas")}
        </Link>

        <div className="mt-8 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative flex items-center justify-center"
          >
            <div className="absolute w-[420px] h-[420px] rounded-full bg-gradient-radial from-gold/20 to-transparent blur-2xl" />
            <div className="border-gold-glow rounded-3xl overflow-hidden w-[420px] h-[420px]">
              <motion.img
                src={b.heroImage}
                alt={b.name}
                className="w-full h-full object-cover"
                initial={{ filter: "blur(10px)", opacity: 0 }}
                animate={{ filter: "blur(0px)", opacity: 1 }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="text-xs tracking-[0.3em] uppercase text-gold/80">
              {t(b.region.en, b.region.id)} · {b.era}
            </div>
            <h1 className="font-display text-5xl lg:text-6xl mt-2 text-gradient-gold leading-tight">{b.name}</h1>
            <p className="mt-4 font-display italic text-xl text-foreground/80">"{t(b.tagline.en, b.tagline.id)}"</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {b.symbolism.map((s, i) => (
                <span key={i} className="px-3 py-1 rounded-full border border-gold/40 text-xs text-gold tracking-wide">
                  {t(s.en, s.id)}
                </span>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
              {b.colors.map((c, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full border-2 border-gold/30" style={{ background: c }} />
                  <span className="text-[10px] text-foreground/40 font-mono">{c}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 grid md:grid-cols-2 gap-8"
        >
          <div className="glass-museum rounded-2xl p-8">
            <div className="text-xs tracking-[0.3em] uppercase text-gold/80 mb-3">{t("Philosophy", "Filosofi")}</div>
            <h2 className="font-display text-3xl text-foreground mb-4">{t("The meaning woven within", "Makna yang ditenun")}</h2>
            <p className="text-foreground/75 leading-relaxed">{t(b.philosophy.en, b.philosophy.id)}</p>
          </div>
          <div className="glass-museum rounded-2xl p-8">
            <div className="text-xs tracking-[0.3em] uppercase text-gold/80 mb-3">{t("History", "Sejarah")}</div>
            <h2 className="font-display text-3xl text-foreground mb-4">{t("Origins & journey", "Asal-usul & perjalanan")}</h2>
            <p className="text-foreground/75 leading-relaxed">{t(b.history.en, b.history.id)}</p>
          </div>
        </motion.div>

        {/* Documentary */}
        <div className="mt-12 glass-museum rounded-2xl p-6">
          <div className="text-xs tracking-[0.3em] uppercase text-gold/80 mb-3">{t("Documentary", "Dokumenter")}</div>
          <div className="aspect-video rounded-xl overflow-hidden border border-gold/30">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${b.documentaryId}?rel=0`}
              title={b.name}
              allowFullScreen
            />
          </div>
        </div>

        {/* Next */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-gold/20 pt-8">
          <p className="text-foreground/60">{t("Continue your journey", "Lanjutkan perjalananmu")}</p>
          <div className="flex gap-3">
            <Link to="/lab" className="px-5 py-2 rounded-full bg-gold text-background text-sm font-medium">
              {t("Try the Batik Lab", "Coba Lab Batik")}
            </Link>
            <Link to="/timeline" className="px-5 py-2 rounded-full border border-gold/40 text-gold text-sm">
              {t("See the timeline", "Lihat lini masa")}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
