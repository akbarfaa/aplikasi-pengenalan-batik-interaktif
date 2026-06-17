import { motion } from "framer-motion";

type Props = {
  motif: "parang" | "kawung" | "megamendung" | "sekarjagad" | "truntum" | "lasem";
  colors: string[];
  size?: number;
  animated?: boolean;
};

export function BatikMotif({ motif, colors, size = 320, animated = true }: Props) {
  const [c1, c2, c3, c4] = [colors[0] || "#3a2418", colors[1] || "#c9a14a", colors[2] || "#f5e9d0", colors[3] || colors[1] || "#c98a3f"];

  const content = (() => {
    switch (motif) {
      case "parang":
        return (
          <g>
            <rect width="200" height="200" fill={c1} />
            {Array.from({ length: 8 }).map((_, row) =>
              Array.from({ length: 6 }).map((_, col) => {
                const x = col * 40 + (row % 2 ? 20 : 0);
                const y = row * 30;
                return (
                  <g key={`${row}-${col}`} transform={`translate(${x} ${y}) rotate(-45)`}>
                    <path d={`M0 0 Q10 -8 20 0 Q10 8 0 0`} fill={c2} />
                    <circle cx="6" cy="0" r="1.5" fill={c3} />
                  </g>
                );
              })
            )}
          </g>
        );
      case "kawung":
        return (
          <g>
            <rect width="200" height="200" fill={c1} />
            {Array.from({ length: 6 }).map((_, row) =>
              Array.from({ length: 6 }).map((_, col) => {
                const cx = col * 35 + 18;
                const cy = row * 35 + 18;
                return (
                  <g key={`${row}-${col}`}>
                    <ellipse cx={cx - 8} cy={cy} rx="7" ry="12" fill={c2} stroke={c3} strokeWidth="0.8" />
                    <ellipse cx={cx + 8} cy={cy} rx="7" ry="12" fill={c2} stroke={c3} strokeWidth="0.8" />
                    <ellipse cx={cx} cy={cy - 8} rx="12" ry="7" fill={c2} stroke={c3} strokeWidth="0.8" />
                    <ellipse cx={cx} cy={cy + 8} rx="12" ry="7" fill={c2} stroke={c3} strokeWidth="0.8" />
                    <circle cx={cx} cy={cy} r="2.5" fill={c3} />
                  </g>
                );
              })
            )}
          </g>
        );
      case "megamendung":
        return (
          <g>
            <rect width="200" height="200" fill={c3} />
            {[0, 1, 2, 3, 4, 5, 6].map((layer) => {
              const y = 30 + layer * 22;
              const fill = layer % 2 === 0 ? c1 : c2;
              return (
                <path
                  key={layer}
                  d={`M-10 ${y} Q15 ${y - 18} 40 ${y} T90 ${y} T140 ${y} T190 ${y} T240 ${y} L240 ${y + 20} Q215 ${y + 2} 190 ${y + 20} T140 ${y + 20} T90 ${y + 20} T40 ${y + 20} T-10 ${y + 20} Z`}
                  fill={fill}
                  opacity={0.55 + layer * 0.05}
                />
              );
            })}
          </g>
        );
      case "sekarjagad":
        return (
          <g>
            <rect width="200" height="200" fill={c3} />
            {[
              { x: 20, y: 20, w: 70, h: 60, fill: c1 },
              { x: 95, y: 15, w: 90, h: 50, fill: c2 },
              { x: 15, y: 90, w: 60, h: 90, fill: c4 },
              { x: 80, y: 75, w: 110, h: 55, fill: c1 },
              { x: 130, y: 140, w: 60, h: 50, fill: c2 },
            ].map((r, i) => (
              <g key={i}>
                <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="10" fill={r.fill} stroke={c2} strokeWidth="1" />
                <circle cx={r.x + r.w / 2} cy={r.y + r.h / 2} r="6" fill={c3} />
                <circle cx={r.x + r.w / 2} cy={r.y + r.h / 2} r="3" fill={r.fill} />
              </g>
            ))}
          </g>
        );
      case "truntum":
        return (
          <g>
            <rect width="200" height="200" fill={c1} />
            {Array.from({ length: 10 }).map((_, row) =>
              Array.from({ length: 10 }).map((_, col) => {
                const cx = col * 22 + 11 + (row % 2 ? 11 : 0);
                const cy = row * 22 + 11;
                return (
                  <g key={`${row}-${col}`} transform={`translate(${cx} ${cy})`}>
                    {[0, 45, 90, 135].map((a) => (
                      <line key={a} x1="-5" y1="0" x2="5" y2="0" transform={`rotate(${a})`} stroke={c2} strokeWidth="1.2" />
                    ))}
                    <circle r="1.5" fill={c3} />
                  </g>
                );
              })
            )}
          </g>
        );
      case "lasem":
        return (
          <g>
            <rect width="200" height="200" fill={c3} />
            {Array.from({ length: 5 }).map((_, row) =>
              Array.from({ length: 4 }).map((_, col) => {
                const cx = col * 50 + 25;
                const cy = row * 40 + 20;
                return (
                  <g key={`${row}-${col}`} transform={`translate(${cx} ${cy})`}>
                    <path d="M0 -12 C 8 -8 12 0 0 12 C -12 0 -8 -8 0 -12 Z" fill={c1} stroke={c2} strokeWidth="0.8" />
                    <circle r="2.5" fill={c2} />
                  </g>
                );
              })
            )}
          </g>
        );
    }
  })();

  const svg = (
    <svg viewBox="0 0 200 200" width={size} height={size} className="rounded-2xl shadow-2xl">
      <defs>
        <filter id="grain">
          <feTurbulence baseFrequency="0.9" numOctaves="2" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.08 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      {content}
      <rect width="200" height="200" filter="url(#grain)" />
    </svg>
  );

  if (!animated) return svg;
  return (
    <motion.div
      animate={{ rotate: [0, 1.5, 0, -1.5, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      className="inline-block"
    >
      {svg}
    </motion.div>
  );
}
