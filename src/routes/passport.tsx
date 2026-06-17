import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { ACHIEVEMENTS, BATIKS } from "@/lib/batik-data";
import { PageShell } from "@/components/PageShell";
import { FloatingParticles } from "@/components/FloatingParticles";
import { getPassport, type Passport } from "@/lib/passport";
import { BatikMotif } from "@/components/BatikMotif";

export const Route = createFileRoute("/passport")({
  component: PassportPage,
  head: () => ({ meta: [{ title: "Passport · Batikku" }] }),
});

function PassportPage() {
  const { t } = useLang();
  const [p, setP] = useState<Passport | null>(null);

  useEffect(() => {
    setP(getPassport());
  }, []);

  if (!p) return <PageShell><div /></PageShell>;

  const progress = Math.round(((p.visitedBatiks.length / BATIKS.length) * 0.5 + (p.achievements.length / ACHIEVEMENTS.length) * 0.5) * 100);

  return (
    <PageShell className="bg-parang">
      <FloatingParticles count={14} />
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-xs tracking-[0.3em] uppercase text-gold/80">{t("Your Journey", "Perjalananmu")}</div>
        <h1 className="font-display text-5xl sm:text-6xl mt-2 text-gradient-gold">
          {t("Cultural Passport", "Paspor Budaya")}
        </h1>

        <div className="mt-10 glass-museum rounded-2xl p-8 border-gold-glow">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-gold/70">{t("Overall progress", "Total kemajuan")}</div>
              <div className="font-display text-6xl text-gradient-gold mt-2">{progress}%</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-foreground/70">
                {p.visitedBatiks.length} / {BATIKS.length} {t("batiks discovered", "batik ditemukan")}
              </div>
              <div className="text-sm text-foreground/70">
                {t("Best quiz", "Kuis terbaik")}: {p.quizBest}%
              </div>
            </div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-foreground/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-copper via-gold to-amber-glow"
            />
          </div>
        </div>

        {/* Achievements */}
        <h2 className="font-display text-3xl mt-12 mb-6 text-foreground">{t("Achievements", "Pencapaian")}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = p.achievements.includes(a.id);
            return (
              <motion.div
                key={a.id}
                whileHover={{ y: -4 }}
                className={`p-5 rounded-2xl border transition-all ${
                  unlocked ? "glass-museum border-gold/40" : "border-foreground/10 bg-foreground/[0.02]"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  unlocked ? "bg-gold text-background" : "bg-foreground/10 text-foreground/40"
                }`}>
                  {unlocked ? "✦" : "◌"}
                </div>
                <div className={`mt-3 font-display text-lg ${unlocked ? "text-gold" : "text-foreground/40"}`}>
                  {t(a.name.en, a.name.id)}
                </div>
                <div className="text-xs text-foreground/60 mt-1">{t(a.desc.en, a.desc.id)}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Visited */}
        <h2 className="font-display text-3xl mt-12 mb-6 text-foreground">{t("Visited Batik", "Batik Dikunjungi")}</h2>
        {p.visitedBatiks.length === 0 ? (
          <div className="text-foreground/50">
            {t("No batiks visited yet — ", "Belum ada batik dikunjungi — ")}
            <Link to="/explore" className="text-gold underline">{t("start exploring", "mulai jelajah")}</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {p.visitedBatiks.map((id) => {
              const b = BATIKS.find((x) => x.id === id);
              if (!b) return null;
              return (
                <Link key={id} to="/batik/$id" params={{ id }} className="block group">
                  <div className="border-gold-glow rounded-xl overflow-hidden">
                    <BatikMotif motif={b.motif} colors={b.colors} size={160} animated={false} />
                  </div>
                  <div className="mt-2 text-center text-sm text-foreground/80 group-hover:text-gold">{b.name}</div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </PageShell>
  );
}
