import { Link, useRouterState } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { motion } from "framer-motion";

const NAV = [
  { to: "/", en: "Home", id: "Beranda" },
  { to: "/explore", en: "Explore", id: "Jelajah" },
  { to: "/timeline", en: "Timeline", id: "Lini Masa" },
  { to: "/lab", en: "Batik Lab", id: "Lab Batik" },
  { to: "/quiz", en: "Quiz", id: "Kuis" },
  { to: "/passport", en: "Passport", id: "Paspor" },
  { to: "/about", en: "About", id: "Tentang" },
] as const;

export function Navbar() {
  const { lang, setLang, t } = useLang();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="glass-museum mx-3 mt-3 rounded-full px-4 sm:px-6 py-3 flex items-center gap-2 sm:gap-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold via-copper to-maroon shadow-[0_0_20px_oklch(0.78_0.13_80/0.5)] flex items-center justify-center">
            <span className="text-[10px] font-display font-bold text-background">Bk</span>
          </div>
          <span className="font-display text-lg sm:text-xl tracking-wide text-gradient-gold hidden sm:inline">
            Batikku
          </span>
        </Link>

        <nav className="flex-1 flex items-center justify-center gap-1 overflow-x-auto scrollbar-none">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap rounded-full transition-colors ${
                  active ? "text-gold" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {t(item.en, item.id)}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-gold/10 border border-gold/30"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center rounded-full border border-gold/30 overflow-hidden text-[11px] font-medium">
          <button
            onClick={() => setLang("en")}
            className={`px-2.5 py-1 transition-colors ${lang === "en" ? "bg-gold text-background" : "text-foreground/70"}`}
          >
            EN
          </button>
          <button
            onClick={() => setLang("id")}
            className={`px-2.5 py-1 transition-colors ${lang === "id" ? "bg-gold text-background" : "text-foreground/70"}`}
          >
            ID
          </button>
        </div>
      </div>
    </motion.header>
  );
}
