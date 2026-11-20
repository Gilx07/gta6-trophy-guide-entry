// Wires the guide together: data, saved progress, filters, tabs, the detail panel and export/import.
import { KIND_LABELS, loadTrophyList, trophyById } from './data.js';
import { applyDemoSeed, loadSpoilers, saveEarned, saveSpoilers } from './store.js';
import { KIND_FILTERS, parseUrlParams, readToolbarState, trophyMatches } from './filters.js';
import { renderDetail, renderList, renderProgress, renderRoadmap } from './render.js';
import { downloadProgress, readProgressFile } from './export.js';

const trophies = await loadTrophyList();
const params = parseUrlParams();
let earned = applyDemoSeed();
let spoilers = params.spoilers ?? loadSpoilers();
let selectedId = params.openId;
let view = params.view;

const searchInput = document.getElementById('search');
const gradeSelect = document.getElementById('gradeSelect');
const statusSelect = document.getElementById('statusSelect');
const spoilerToggle = document.getElementById('spoilerToggle');
const kindChips = document.getElementById('kindChips');
const tabChecklist = document.getElementById('tabChecklist');
const tabRoadmap = document.getElementById('tabRoadmap');
const checklistView = document.getElementById('checklistView');
const roadmapView = document.getElementById('roadmapView');

searchInput.value = params.text;
gradeSelect.value = params.grade;
statusSelect.value = params.status;
spoilerToggle.checked = spoilers;

for (const kind of KIND_FILTERS) {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'chip';
  chip.dataset.kind = kind;
  chip.textContent = kind === 'all' ? 'All kinds' : kind === 'missable' ? 'Missable only' : KIND_LABELS[kind];
  if (kind === params.kind) chip.classList.add('active');
  chip.addEventListener('click', () => {
    kindChips.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    refresh();
  });
  kindChips.append(chip);
}

function currentFilters() {
  return readToolbarState(document);
}

function visibleTrophies(filters) {
  return trophies.filter((t) => trophyMatches(t, filters, earned));
}

function refresh() {
  const filters = currentFilters();
  renderProgress(trophies, earned);
  renderList(visibleTrophies(filters), filters, earned, selectedId, selectTrophy, toggleEarned);
  renderDetail(selectedId ? trophyById(trophies, selectedId) : null, earned, filters, toggleEarned);
  renderRoadmap(trophies, earned, openFromRoadmap);
}

function selectTrophy(id) {
  selectedId = id;
  refresh();
}

function openFromRoadmap(id) {
  selectedId = id;
  showView('checklist');
  refresh();
  document.getElementById('detail')?.scrollIntoView({ block: 'nearest' });
}

function toggleEarned(id, on) {
  if (on) earned.add(id);
  else earned.delete(id);
  saveEarned(earned);
  refresh();
}

function showView(next) {
  view = next;
  const roadmap = next === 'roadmap';
  checklistView.hidden = roadmap;
  roadmapView.hidden = !roadmap;
  tabChecklist.classList.toggle('active', !roadmap);
  tabRoadmap.classList.toggle('active', roadmap);
  tabChecklist.setAttribute('aria-pressed', String(!roadmap));
  tabRoadmap.setAttribute('aria-pressed', String(roadmap));
  document.getElementById('showingCount').hidden = roadmap;
  if (roadmap) renderRoadmap(trophies, earned, openFromRoadmap);
}

tabChecklist.addEventListener('click', () => showView('checklist'));
tabRoadmap.addEventListener('click', () => showView('roadmap'));
searchInput.addEventListener('input', refresh);
gradeSelect.addEventListener('change', refresh);
statusSelect.addEventListener('change', refresh);
spoilerToggle.addEventListener('change', () => {
  spoilers = spoilerToggle.checked;
  saveSpoilers(spoilers);
  refresh();
});

document.getElementById('exportBtn').addEventListener('click', () => downloadProgress(earned));
document.getElementById('importInput').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    earned = await readProgressFile(file, trophies);
    saveEarned(earned);
    refresh();
  } catch (err) {
    alert(`Could not import that file: ${err.message}`);
  }
  event.target.value = '';
});
document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Clear all earned ticks?')) return;
  earned = new Set();
  saveEarned(earned);
  refresh();
});

showView(view);
refresh();
