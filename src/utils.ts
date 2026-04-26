export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function calcStars(score: number, total: number): 1 | 2 | 3 {
  const pct = score / total;
  return pct >= 0.8 ? 3 : pct >= 0.5 ? 2 : 1;
}
