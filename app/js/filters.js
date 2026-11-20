// Filter state: read from the toolbar and the URL, then one predicate that decides if a trophy shows.
import { isStoryTrophy } from './data.js';

export const KIND_FILTERS = ['all', 'story', 'side', 'activities', 'crime', 'collectibles', 'unconfirmed', 'missable'];

export function parseUrlParams() {
  const q = new URLSearchParams(location.search);
  const kind = q.get('kind');
  return {
    view: q.get('view') === 'roadmap' ? 'roadmap' : 'checklist',
    openId: Number(q.get('open') ?? '') || null,
    kind: KIND_FILTERS.includes(kind) ? kind : 'all',
    grade: q.get('grade') ?? 'all',
    text: q.get('q') ?? '',
    status: q.get('status') ?? 'all',
    spoilers: q.get('spoilers') === 'on' ? true : q.get('spoilers') === 'off' ? false : null,
    demo: q.has('demo'),
  };
}

export function readToolbarState(doc) {
  return {
    kind: doc.querySelector('#kindChips .chip.active')?.dataset.kind ?? 'all',
    grade: doc.getElementById('gradeSelect').value,
    text: doc.getElementById('search').value.trim().toLowerCase(),
    status: doc.getElementById('statusSelect').value,
    spoilers: doc.getElementById('spoilerToggle').checked,
  };
}

// A story trophy the player has not earned yet stays hidden while spoiler mode is on.
export function isSpoilerHidden(trophy, filters, earned) {
  return filters.spoilers && isStoryTrophy(trophy) && !earned.has(trophy.id);
}

export function trophyMatches(trophy, filters, earned) {
  if (filters.kind === 'missable') {
    if (!trophy.missable) return false;
  } else if (filters.kind !== 'all' && trophy.kind !== filters.kind) {
    return false;
  }
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  if (filters.status === 'earned' && !earned.has(trophy.id)) return false;
  if (filters.status === 'remaining' && earned.has(trophy.id)) return false;
  if (filters.text) {
    const hay = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!hay.includes(filters.text)) return false;
  }
  return true;
}
