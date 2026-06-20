import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useLang } from "@/lib/i18n";
import { PROVINCES, BATIKS } from "@/lib/batik-data";
import { PageShell } from "@/components/PageShell";
import { FloatingParticles } from "@/components/FloatingParticles";
import { BatikMotif } from "@/components/BatikMotif";
import indonesiaMapData from "@svg-country-maps/indonesia";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

const MAP_ID_TO_PROVINCE: Record<string, string> = {
  "id-jt": "jateng",
  "id-jb": "jabar",
  "id-ji": "jatim",
  "id-yo": "yogya",
};

export const Route = createFileRoute("/explore")({
  component: Explore,
  head: () => ({ meta: [{ title: "Explore · Batikku" }] }),
});

function Explore() {
  const { t } = useLang();
  const [hover, setHover] = useState<string | null>(null);
  const hovered = PROVINCES.find((p) => p.id === hover);

  // Zoom & Pan states
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<SVGSVGElement | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const isClickRef = useRef(true);

  // Gallery filtering & scrolling
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const galleryRef = useRef<HTMLDivElement | null>(null);

  // Boundary calculations to keep map visible and not fly away
  const limitPan = (x: number, y: number, currentScale: number) => {
    if (!containerRef.current) return { x, y };
    const rect = containerRef.current.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    // Max pan values are 0 (top-left aligned)
    // Min pan values represent the excess scaled size
    const minX = -w * (currentScale - 1);
    const maxX = 0;
    const minY = -h * (currentScale - 1);
    const maxY = 0;

    if (currentScale <= 1) return { x: 0, y: 0 };

    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y)),
    };
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    dragOffset.current = { x: e.clientX, y: e.clientY };
    isClickRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    const newPanX = e.clientX - dragStart.current.x;
    const newPanY = e.clientY - dragStart.current.y;
    setPan(limitPan(newPanX, newPanY, scale));

    if (Math.abs(e.clientX - dragOffset.current.x) > 5 || Math.abs(e.clientY - dragOffset.current.y) > 5) {
      isClickRef.current = false;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      dragStart.current = { x: touch.clientX - pan.x, y: touch.clientY - pan.y };
      dragOffset.current = { x: touch.clientX, y: touch.clientY };
      isClickRef.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const newPanX = touch.clientX - dragStart.current.x;
    const newPanY = touch.clientY - dragStart.current.y;
    setPan(limitPan(newPanX, newPanY, scale));

    if (Math.abs(touch.clientX - dragOffset.current.x) > 5 || Math.abs(touch.clientY - dragOffset.current.y) > 5) {
      isClickRef.current = false;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = 1.15;
    let newScale = scale;
    if (e.deltaY < 0) {
      newScale = Math.min(scale * zoomFactor, 8);
    } else {
      newScale = Math.max(scale / zoomFactor, 1);
    }

    if (newScale === 1) {
      setPan({ x: 0, y: 0 });
      setScale(1);
    } else {
      const rawPanX = mouseX - (newScale / scale) * (mouseX - pan.x);
      const rawPanY = mouseY - (newScale / scale) * (mouseY - pan.y);
      setPan(limitPan(rawPanX, rawPanY, newScale));
      setScale(newScale);
    }
  };

  const handleZoomIn = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const newScale = Math.min(scale * 1.5, 8);
    const rawPanX = centerX - (newScale / scale) * (centerX - pan.x);
    const rawPanY = centerY - (newScale / scale) * (centerY - pan.y);
    setPan(limitPan(rawPanX, rawPanY, newScale));
    setScale(newScale);
  };

  const handleZoomOut = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const newScale = Math.max(scale / 1.5, 1);
    if (newScale === 1) {
      setPan({ x: 0, y: 0 });
      setScale(1);
    } else {
      const rawPanX = centerX - (newScale / scale) * (centerX - pan.x);
      const rawPanY = centerY - (newScale / scale) * (centerY - pan.y);
      setPan(limitPan(rawPanX, rawPanY, newScale));
      setScale(newScale);
    }
  };

  const handleReset = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  const handleProvinceClick = (provinceId: string) => {
    if (!isClickRef.current) return;
    setHover(provinceId);
    setSelectedFilter(provinceId);
    galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filteredBatik = BATIKS.filter((b) => {
    if (selectedFilter === "all") return true;
    const prov = PROVINCES.find((p) => p.id === selectedFilter);
    return prov ? prov.batikIds.includes(b.id) : true;
  });

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
          <div className="relative aspect-[16/9] glass-museum rounded-2xl p-4 overflow-hidden select-none">
            <div className="absolute inset-0 bg-megamendung opacity-30 pointer-events-none" />
            
            {/* Grid Pattern Background for a premium navigational map feel */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,oklch(0.78_0.13_80)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.78_0.13_80)_1px,transparent_1px)] bg-[size:40px_40px]" />

            <svg
              ref={containerRef}
              viewBox={indonesiaMapData.viewBox}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
              className={`absolute inset-0 w-full h-full select-none ${
                isDragging ? "cursor-grabbing" : scale > 1 ? "cursor-grab" : "cursor-default"
              }`}
            >
              <g
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                  transformOrigin: "0px 0px",
                  transition: isDragging ? "none" : "transform 0.2s ease-out"
                }}
              >
                {/* Provinces paths */}
                {indonesiaMapData.locations.map((loc) => {
                  const provinceId = MAP_ID_TO_PROVINCE[loc.id];
                  const isActive = !!provinceId;
                  const isHovered = hover === provinceId;

                  return (
                    <path
                      key={loc.id}
                      d={loc.path}
                      onMouseEnter={() => isActive && setHover(provinceId)}
                      onMouseLeave={() => isActive && setHover(null)}
                      onClick={() => isActive && handleProvinceClick(provinceId)}
                      className={`transition-all duration-300 ${
                        isActive
                          ? isHovered
                            ? "fill-gold/45 stroke-gold cursor-pointer filter drop-shadow-[0_0_8px_oklch(0.78_0.13_80/0.6)]"
                            : "fill-gold/20 stroke-gold/40 hover:fill-gold/35 hover:stroke-gold cursor-pointer"
                          : "fill-foreground/5 stroke-foreground/10"
                      }`}
                      strokeWidth="0.4"
                    />
                  );
                })}

                {/* Pins inside the SVG */}
                {PROVINCES.map((p) => {
                  const pinX = (p.x / 100) * 793;
                  const pinY = 29 + (p.y / 100) * 288;
                  const isHovered = hover === p.id;

                  return (
                    <g
                      key={p.id}
                      transform={`translate(${pinX}, ${pinY})`}
                      onMouseEnter={() => setHover(p.id)}
                      onMouseLeave={() => setHover(null)}
                      onClick={() => handleProvinceClick(p.id)}
                      className="cursor-pointer group"
                    >
                      {/* Outer pulsing ring */}
                      <motion.circle
                        r="14"
                        fill="oklch(0.78 0.13 80)"
                        opacity="0.4"
                        animate={{
                          scale: isHovered ? [1, 2.2, 1] : [1, 1.6, 1],
                          opacity: isHovered ? [0.6, 0, 0.6] : [0.4, 0, 0.4]
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          ease: "easeInOut"
                        }}
                      />
                      {/* Inner solid circle */}
                      <circle
                        r="4.5"
                        fill="oklch(0.78 0.13 80)"
                        stroke="#1a1a1a"
                        strokeWidth="1.5"
                        className="filter drop-shadow-[0_0_6px_oklch(0.78_0.13_80/0.8)]"
                      />
                      {/* Text label */}
                      <text
                        y="-12"
                        textAnchor="middle"
                        className="text-[9px] font-sans font-semibold fill-gold select-none pointer-events-none drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.95)]"
                      >
                        {p.name}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Floating Zoom Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
              <button
                onClick={handleZoomIn}
                className="w-10 h-10 rounded-lg glass-museum flex items-center justify-center text-foreground hover:text-gold hover:bg-gold/10 transition-all border border-gold/20 shadow-md cursor-pointer"
                title={t("Zoom In", "Perbesar")}
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={handleZoomOut}
                className="w-10 h-10 rounded-lg glass-museum flex items-center justify-center text-foreground hover:text-gold hover:bg-gold/10 transition-all border border-gold/20 shadow-md cursor-pointer"
                title={t("Zoom Out", "Perkecil")}
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={handleReset}
                className="w-10 h-10 rounded-lg glass-museum flex items-center justify-center text-foreground hover:text-gold hover:bg-gold/10 transition-all border border-gold/20 shadow-md cursor-pointer"
                title={t("Reset Zoom", "Atur Ulang")}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
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
        <div ref={galleryRef} className="mt-20 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="font-display text-4xl text-gradient-gold">
                {t("The Royal Collection", "Koleksi Kerajaan")}
              </h2>
              <p className="text-sm text-foreground/60 mt-1">
                {t("Explore the intricate details of each masterpiece.", "Jelajahi detail rumit dari setiap mahakarya.")}
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedFilter("all")}
                className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  selectedFilter === "all"
                    ? "bg-gold text-background font-semibold shadow-md shadow-gold/20"
                    : "glass-museum text-foreground/75 hover:text-gold hover:border-gold/30"
                }`}
              >
                {t("All", "Semua")}
              </button>
              {PROVINCES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedFilter(p.id)}
                  className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    selectedFilter === p.id
                      ? "bg-gold text-background font-semibold shadow-md shadow-gold/20"
                      : "glass-museum text-foreground/75 hover:text-gold hover:border-gold/30"
                  }`}
                >
                  {p.id === "jabar" ? t("West Java", "Jawa Barat") :
                   p.id === "jateng" ? t("Central Java", "Jawa Tengah") :
                   p.id === "jatim" ? t("East Java", "Jawa Timur") :
                   p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBatik.map((b, i) => (
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
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={b.heroImage}
                      alt={b.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                      <span className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
                        {t("View Details →", "Lihat Detail →")}
                      </span>
                    </div>
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

          {filteredBatik.length === 0 && (
            <div className="text-center py-20 glass-museum rounded-2xl">
              <p className="text-foreground/50">
                {t("No motifs found in this region.", "Tidak ada motif ditemukan di wilayah ini.")}
              </p>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
