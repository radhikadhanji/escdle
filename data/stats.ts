export type Stats = {
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;
    winRate: number;
    currentStreak: number;
    maxStreak: number;
}

const STATS_KEY = "escdleStats";

export function getStats(): Stats {
  const saved = localStorage.getItem(STATS_KEY);
  if (saved) return JSON.parse(saved);
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    winRate: 0,
    currentStreak: 0,
    maxStreak: 0,
  };
}

export function saveStats(stats: Stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function recordGame(gameWon: boolean, guesses: number) {
  const stats = getStats();
  stats.gamesPlayed += 1;
  if (gameWon) {
    stats.gamesWon += 1;
    stats.currentStreak += 1;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
  } else {
    stats.currentStreak = 0;
    stats.gamesLost += 1;
  }
  stats.winRate = (stats.gamesWon/stats.gamesPlayed) * 100;
  saveStats(stats);
}

