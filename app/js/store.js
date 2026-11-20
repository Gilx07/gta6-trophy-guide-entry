// Progress and spoiler settings, kept in this browser's localStorage only. Nothing leaves the machine.
const EARNED_KEY = 'gta6-trophy-checklist-v1';
const SPOILER_KEY = 'gta6-trophy-spoilers-v1';

// Demo seed for screenshots and first looks: 13 earned, all outside the story so nothing is spoiled.
export const DEMO_EARNED = [15, 16, 18, 19, 21, 22, 29, 32, 35, 36, 39, 41, 53];

export function loadEarned() {
  try {
    const raw = JSON.parse(localStorage.getItem(EARNED_KEY) ?? '[]');
    return new Set(Array.isArray(raw) ? raw.filter((n) => Number.isInteger(n)) : []);
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(EARNED_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

export function loadSpoilers() {
  return localStorage.getItem(SPOILER_KEY) === '1';
}

export function saveSpoilers(on) {
  localStorage.setItem(SPOILER_KEY, on ? '1' : '0');
}

// Seeds the demo progress once, only when the page carries ?demo=1 and nothing is saved yet.
export function applyDemoSeed() {
  if (!new URLSearchParams(location.search).has('demo')) return loadEarned();
  const earned = loadEarned();
  if (earned.size > 0) return earned;
  const seeded = new Set(DEMO_EARNED);
  saveEarned(seeded);
  return seeded;
}
