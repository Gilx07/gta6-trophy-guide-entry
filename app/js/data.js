// Loads the trophy list: the one network-free read this app makes, a relative fetch of its own data file.
export const DATA_URL = 'data/trophies.json';

export const KIND_LABELS = {
  story: 'Story',
  side: 'Side missions',
  activities: 'Activities',
  crime: 'Crime',
  collectibles: 'Collectibles',
  unconfirmed: 'Unconfirmed',
};

export const GRADE_LABELS = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
};

export const GRADE_ORDER = ['platinum', 'gold', 'silver', 'bronze'];

export async function loadTrophyList() {
  const response = await fetch(DATA_URL);
  if (!response.ok) throw new Error(`could not load ${DATA_URL}: ${response.status}`);
  const doc = await response.json();
  return doc.trophies;
}

export function isStoryTrophy(trophy) {
  return trophy.kind === 'story';
}

export function trophyById(trophies, id) {
  return trophies.find((t) => t.id === id) ?? null;
}
