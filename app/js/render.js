// Renders the list, the guide panel, the progress header and the roadmap from the trophy data.
import { GRADE_LABELS, GRADE_ORDER, KIND_LABELS, trophyById } from './data.js';
import { isSpoilerHidden } from './filters.js';
import { ROADMAP_STAGES, stageProgress } from './roadmap.js';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function gradeDot(grade) {
  return el('span', `dot ${grade}`);
}

function kindTag(trophy) {
  const tags = [el('span', 'tag', KIND_LABELS[trophy.kind] ?? trophy.kind)];
  if (trophy.missable) tags.push(el('span', 'tag missable', 'Missable'));
  if (!trophy.confirmed) tags.push(el('span', 'tag unconfirmed', 'Unconfirmed'));
  if (trophy.hidden) tags.push(el('span', 'tag hidden-t', 'Hidden trophy'));
  return tags;
}

function spoilerCard() {
  const card = el('article', 'trophy spoilered');
  card.append(el('span', 'dot'));
  const body = el('div');
  body.append(el('div', 'trophy-name', 'Hidden story trophy'));
  body.append(el('div', 'trophy-desc', 'Hidden until earned. Turn “Hide story spoilers” off to reveal it.'));
  body.append(el('span', 'tag spoilered', 'Story — spoiler hidden'));
  card.append(body);
  return card;
}

export function renderProgress(trophies, earned) {
  const total = trophies.length;
  document.getElementById('progressText').textContent = `${earned.size} of ${total} earned`;
  const bar = document.getElementById('progressBar');
  bar.style.width = `${Math.round((earned.size / total) * 100)}%`;
  bar.parentElement.setAttribute('aria-valuenow', String(earned.size));
  document.getElementById('gradeCounts').textContent = GRADE_ORDER.map((g) => {
    const ofGrade = trophies.filter((t) => t.grade === g);
    const got = ofGrade.filter((t) => earned.has(t.id)).length;
    return `${GRADE_LABELS[g]} ${got}/${ofGrade.length}`;
  }).join(' · ');
}

export function renderList(trophies, filters, earned, selectedId, onSelect, onToggle) {
  const list = document.getElementById('list');
  list.replaceChildren();
  let shown = 0;
  for (const t of trophies) {
    if (isSpoilerHidden(t, filters, earned)) {
      shown += 1;
      list.append(spoilerCard());
      continue;
    }
    const card = el('article', 'trophy');
    if (earned.has(t.id)) card.classList.add('earned');
    if (t.id === selectedId) card.classList.add('selected');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', `Mark ${t.name} earned`);
    box.addEventListener('click', (event) => {
      event.stopPropagation();
      onToggle(t.id, box.checked);
    });
    card.append(box, gradeDot(t.grade));
    const body = el('div');
    body.append(el('div', 'trophy-name', t.name));
    body.append(el('div', 'trophy-desc', t.description));
    const tags = el('div', 'tags');
    for (const tag of kindTag(t)) tags.append(tag);
    body.append(tags);
    card.append(body);
    card.addEventListener('click', () => onSelect(t.id));
    list.append(card);
    shown += 1;
  }
  document.getElementById('showingCount').textContent =
    shown === trophies.length
      ? `Showing all ${trophies.length} trophies.`
      : `Showing ${shown} of ${trophies.length} trophies.`;
}

export function renderDetail(trophy, earned, filters, onToggle) {
  const detail = document.getElementById('detail');
  detail.replaceChildren();
  if (!trophy) {
    detail.append(el('p', 'detail-empty', 'Pick a trophy on the left to read its guide.'));
    const banner = el('div', 'banner');
    banner.append(el('strong', null, 'Watch out for one trophy: Positive Mental Attitude'));
    banner.append(document.createTextNode('Meditate at Jason\u2019s house in Chapter 1, early — it is the only possibly missable trophy in the game.'));
    detail.append(banner);
    return;
  }
  if (isSpoilerHidden(trophy, filters, earned)) {
    detail.append(el('h2', null, 'Hidden story trophy'));
    detail.append(el('p', 'official', 'This trophy is hidden until you earn it.'));
    detail.append(el('p', null, 'Turn “Hide story spoilers” off in the toolbar to reveal its name and guide.'));
    return;
  }
  if (trophy.missable) {
    const banner = el('div', 'banner');
    banner.append(el('strong', null, 'Possibly missable — do this early'));
    banner.append(document.createTextNode('One meditation spot is at Jason\u2019s house in Chapter 1. Meditate there before the chapter ends.'));
    detail.append(banner);
  }
  if (!trophy.confirmed) {
    const banner = el('div', 'banner gold');
    banner.append(el('strong', null, 'Unconfirmed'));
    banner.append(document.createTextNode('No guide has verified this trophy yet. The method below is a report, not a fact — do not grind it until the community pins it down.'));
    detail.append(banner);
  }
  detail.append(el('h2', null, trophy.name));
  const meta = el('div', 'meta');
  meta.append(el('span', 'tag', GRADE_LABELS[trophy.grade]));
  for (const tag of kindTag(trophy)) meta.append(tag);
  detail.append(meta);
  detail.append(el('p', 'official', `Official: ${trophy.description}`));
  detail.append(el('h3', null, 'How to get it'));
  detail.append(el('p', null, trophy.guide));
  const source = el('p', 'source', 'Source: ');
  if (trophy.sourceUrl) {
    const a = document.createElement('a');
    a.href = trophy.sourceUrl;
    a.rel = 'noopener';
    a.textContent = trophy.source;
    source.append(a);
  } else {
    source.append(document.createTextNode(trophy.source));
  }
  detail.append(source);
  const row = el('label', 'earn-row');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(trophy.id);
  box.addEventListener('change', () => onToggle(trophy.id, box.checked));
  row.append(box, document.createTextNode(earned.has(trophy.id) ? 'Earned — ticked off' : 'Mark as earned'));
  detail.append(row);
}

export function renderRoadmap(trophies, earned, onOpenTrophy) {
  const host = document.getElementById('roadmap');
  host.replaceChildren();
  const banner = el('div', 'banner');
  banner.append(el('strong', null, 'Before anything else: Positive Mental Attitude'));
  banner.append(document.createTextNode('There are 18 meditation spots and one is at Jason\u2019s house in Chapter 1. Meditate there early — it is the only trophy guides flag as possibly missable.'));
  host.append(banner);
  for (const stage of ROADMAP_STAGES) {
    const card = el('section', 'stage');
    const { done, total } = stageProgress(stage, earned);
    const h = el('h2', null, stage.title);
    h.append(el('span', 'stage-count', `${done}/${total} done`));
    card.append(h);
    card.append(el('p', null, stage.blurb));
    const row = el('div', 'chips-row');
    for (const id of stage.ids) {
      const t = trophyById(trophies, id);
      if (!t) continue;
      const chip = el('button', 'stage-chip', t.name);
      chip.type = 'button';
      if (earned.has(id)) chip.classList.add('done');
      chip.addEventListener('click', () => onOpenTrophy(id));
      row.append(chip);
    }
    card.append(row);
    host.append(card);
  }
  const note = el('p', null, 'Five trophies sit outside this roadmap because no guide has verified them yet: In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There and Ten Pin. They still count toward the platinum once their methods are confirmed.');
  note.style.color = 'var(--muted)';
  host.append(note);
}
