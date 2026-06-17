import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { TIMELINE } from "@/lib/batik-data";
import { PageShell } from "@/components/PageShell";
import { FloatingParticles } from "@/components/FloatingParticles";

export const Route = createFileRoute("/timeline")({
  component: Timeline,
  head: () => ({ meta: [{ title: "Timeline · Batikku" }] }),
});

function Timeline() {
  const { t } = useLang();
  return (
    <PageShell className="bg-parang">
      <FloatingParticles count={14} />
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-xs tracking-[0.3em] uppercase text-gold/80">{t("Chapter II", "Bab II")}</div>
        <h1 className="font-display text-5xl sm:text-6xl mt-2 text-gradient-gold">
          {t("Seven Centuries in Cloth", "Tujuh Abad dalam Sehelai Kain")}
        </h1>
        <p className="mt-4 text-foreground/70 max-w-2xl">
          {t(
            "Scroll through batik's voyage — from temple reliefs to UNESCO halls.",
            "Telusuri perjalanan batik — dari relief candi hingga aula UNESCO."
          )}
        </p>

        <div className="relative mt-16 pl-8 sm:pl-12">
          <div className="absolute left-2 sm:left-4 top-0 bottom-0 w-px bg-gradient-to-b from-gold via-gold/40 to-transparent" />

          {TIMELINE.map((ev, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.05 * i }}
              className="relative mb-14"
            >
              <span className="absolute -left-[26px] sm:-left-[34px] top-2 w-4 h-4 rounded-full bg-gold shadow-[0_0_20px_oklch(0.78_0.13_80/0.7)] border-2 border-background" />
              <div className="font-display text-2xl text-gold tracking-wide">{ev.year}</div>
              <h3 className="font-display text-3xl mt-1 text-foreground">{t(ev.title.en, ev.title.id)}</h3>
              <p className="mt-3 text-foreground/70 leading-relaxed max-w-2xl">{t(ev.description.en, ev.description.id)}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
