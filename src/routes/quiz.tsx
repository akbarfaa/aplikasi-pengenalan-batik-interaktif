import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { QUIZZES } from "@/lib/batik-data";
import { PageShell } from "@/components/PageShell";
import { FloatingParticles } from "@/components/FloatingParticles";
import { recordQuiz } from "@/lib/passport";

export const Route = createFileRoute("/quiz")({
  component: Quiz,
  head: () => ({ meta: [{ title: "Quiz · Batikku" }] }),
});

function Quiz() {
  const { t } = useLang();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUIZZES[i];

  function pick(idx: number) {
    if (picked !== null) return;
    setPicked(idx);
    const correct = idx === q.answer;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (i + 1 >= QUIZZES.length) {
        const finalScore = score + (correct ? 1 : 0);
        const pct = Math.round((finalScore / QUIZZES.length) * 100);
        recordQuiz(pct);
        setDone(true);
      } else {
        setI((x) => x + 1);
        setPicked(null);
      }
    }, 1500);
  }

  function reset() {
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  const pct = Math.round((score / QUIZZES.length) * 100);

  return (
    <PageShell className="bg-parang">
      <FloatingParticles count={16} />
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-xs tracking-[0.3em] uppercase text-gold/80">{t("Chapter III", "Bab III")}</div>
        <h1 className="font-display text-5xl sm:text-6xl mt-2 text-gradient-gold">
          {t("Cultural Guardians' Quiz", "Kuis Penjaga Budaya")}
        </h1>

        {!done ? (
          <>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex-1 h-1 bg-foreground/10 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${((i + (picked !== null ? 1 : 0)) / QUIZZES.length) * 100}%` }}
                  className="h-full bg-gold"
                />
              </div>
              <div className="text-xs text-foreground/60 tabular-nums">
                {i + 1} / {QUIZZES.length}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="mt-10 glass-museum rounded-2xl p-8"
              >
                <h2 className="font-display text-2xl sm:text-3xl text-foreground leading-snug">
                  {t(q.q.en, q.q.id)}
                </h2>
                <div className="mt-6 space-y-3">
                  {q.options.map((opt, idx) => {
                    const isCorrect = idx === q.answer;
                    const isPicked = picked === idx;
                    let cls = "border-gold/30 hover:bg-gold/10 text-foreground/85";
                    if (picked !== null && isCorrect) cls = "border-emerald-400/60 bg-emerald-500/15 text-emerald-100";
                    else if (isPicked && !isCorrect) cls = "border-destructive/60 bg-destructive/15 text-destructive-foreground";
                    return (
                      <button
                        key={idx}
                        onClick={() => pick(idx)}
                        disabled={picked !== null}
                        className={`w-full text-left px-5 py-3 rounded-xl border transition-all ${cls}`}
                      >
                        {t(opt.en, opt.id)}
                      </button>
                    );
                  })}
                </div>
                {picked !== null && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-sm text-foreground/70 italic"
                  >
                    {t(q.explain.en, q.explain.id)}
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-12 glass-museum rounded-2xl p-10 text-center">
            <div className="font-display text-7xl text-gradient-gold">{pct}%</div>
            <div className="mt-2 text-foreground/70">
              {score} / {QUIZZES.length} {t("correct", "benar")}
            </div>
            <p className="mt-6 font-display text-2xl text-foreground">
              {pct >= 80
                ? t("You are a Cultural Guardian.", "Engkau adalah Penjaga Budaya.")
                : pct >= 50
                ? t("A promising apprentice.", "Murid yang menjanjikan.")
                : t("The journey has just begun.", "Perjalanan baru dimulai.")}
            </p>
            <button onClick={reset} className="mt-8 px-6 py-3 rounded-full bg-gold text-background font-medium">
              {t("Try again", "Coba lagi")}
            </button>
          </motion.div>
        )}
      </section>
    </PageShell>
  );
}
