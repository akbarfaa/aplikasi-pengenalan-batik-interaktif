import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { PageShell } from "@/components/PageShell";
import { FloatingParticles } from "@/components/FloatingParticles";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({ meta: [{ title: "About · Batikku" }] }),
});

function About() {
  const { t } = useLang();
  return (
    <PageShell className="bg-parang">
      <FloatingParticles count={12} />
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-xs tracking-[0.3em] uppercase text-gold/80">{t("Behind the cloth", "Di balik kain")}</div>
        <h1 className="font-display text-5xl sm:text-6xl mt-2 text-gradient-gold">
          {t("About Batikku", "Tentang Batikku")}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-8 space-y-6 text-foreground/80 leading-relaxed text-lg"
        >
          <p>
            {t(
              "Batikku is an interactive digital museum honoring Indonesia's batik heritage — a craft inscribed by UNESCO as a Masterpiece of the Intangible Heritage of Humanity in 2009.",
              "Batikku adalah museum digital interaktif yang menghormati warisan batik Indonesia — seni yang diakui UNESCO sebagai Mahakarya Warisan Tak Benda Kemanusiaan pada 2009."
            )}
          </p>
          <p>
            {t(
              "The project blends cultural research with cinematic interaction: provinces become a living atlas, motifs unfold their philosophies, and visitors create their own batik in a studio that reads their style and reveals their nearest royal ancestor.",
              "Proyek ini memadukan riset budaya dengan interaksi sinematik: provinsi menjadi atlas yang hidup, motif membuka filosofinya, dan pengunjung menciptakan batik sendiri di sanggar yang membaca gaya mereka dan mengungkap leluhur keraton terdekat."
            )}
          </p>
          <p>
            {t(
              "Made with reverence for the canting, the wax, and the artisans who have kept these stories alive for seven centuries.",
              "Dibuat dengan rasa hormat kepada canting, malam, dan para pengrajin yang menjaga kisah-kisah ini hidup selama tujuh abad."
            )}
          </p>
        </motion.div>

        <div className="mt-12 grid sm:grid-cols-3 gap-4">
          {[
            { t: t("Ministry of Tourism", "Kementerian Pariwisata") },
            { t: t("Ministry of Education", "Kementerian Pendidikan") },
            { t: t("Cultural Preservation", "Pelestarian Budaya") },
          ].map((c, i) => (
            <div key={i} className="glass-museum rounded-xl p-5 text-center text-sm text-foreground/70">
              {c.t}
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
