const KEY = "batikku-passport";

export type Passport = {
  visitedBatiks: string[];
  achievements: string[];
  quizBest: number;
  createdBatik: boolean;
};

const empty: Passport = { visitedBatiks: [], achievements: [], quizBest: 0, createdBatik: false };

export function getPassport(): Passport {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
}

export function savePassport(p: Passport) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(p));
}

export function visitBatik(id: string) {
  const p = getPassport();
  if (!p.visitedBatiks.includes(id)) {
    p.visitedBatiks.push(id);
    if (p.visitedBatiks.length === 1 && !p.achievements.includes("explorer")) p.achievements.push("explorer");
    if (p.visitedBatiks.length >= 3 && !p.achievements.includes("philosopher")) p.achievements.push("philosopher");
    if (p.visitedBatiks.length >= 6 && !p.achievements.includes("collector")) p.achievements.push("collector");
  }
  savePassport(p);
}

export function recordQuiz(scorePct: number) {
  const p = getPassport();
  p.quizBest = Math.max(p.quizBest, scorePct);
  if (scorePct >= 80 && !p.achievements.includes("guardian")) p.achievements.push("guardian");
  savePassport(p);
}

export function markCreated() {
  const p = getPassport();
  p.createdBatik = true;
  if (!p.achievements.includes("artisan")) p.achievements.push("artisan");
  savePassport(p);
}
