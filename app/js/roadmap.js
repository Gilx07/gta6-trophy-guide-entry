// The road to the platinum, in the order the game wants it: story first (the one missable lives in
// Chapter 1), then stranger strands, activities, crime, collectibles, and the 100% cleanup last.
export const ROADMAP_STAGES = [
  {
    title: 'Stage 1 — Play the story',
    blurb: 'Main missions only. The chapter and mission trophies land as you go, and the gold for the final mission closes the stage. Do the one missable thing now: meditate at Jason\u2019s house in Chapter 1.',
    ids: [2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 7],
  },
  {
    title: 'Stage 2 — Stranger strands',
    blurb: 'Five contacts have final-mission trophies of their own (Andy, Kenton, Billy, Randy, Tyrone), plus Bret\u2019s hunt and the 50 challenges. Finish any eight strands for the silver.',
    ids: [22, 23, 24, 26, 27, 29, 25, 32],
  },
  {
    title: 'Stage 3 — Activities and races',
    blurb: 'Ranges, drone races, fishing, the arcade, bowling, meditation and the gym. Most of these are grinds you can chip away at between missions — except the meditation spots, which need all 18.',
    ids: [15, 16, 17, 18, 19, 20, 21, 28, 46, 47],
  },
  {
    title: 'Stage 4 — Crime spree',
    blurb: 'Vaults, trucks, shops, jewelry, gangs and wanted levels. Do these after the story, when you have the gear and the map knowledge to escape cleanly.',
    ids: [33, 34, 36, 37, 38, 39, 40, 41, 43, 48, 52],
  },
  {
    title: 'Stage 5 — Collectibles, exploring and money',
    blurb: 'Cards, WAiNK machines, vehicles, garages and the whole map of Leonida. Save the long sweeps for when fast travel and the full map are open to you.',
    ids: [30, 31, 35, 42, 53, 54, 55],
  },
  {
    title: 'Stage 6 — 100% and the platinum',
    blurb: 'The 100% gold is the last big gate: story, strands, activities, races, collectibles and exploration all feed it. When it pops, the platinum follows at once.',
    ids: [14, 1],
  },
];

export function stageProgress(stage, earned) {
  const done = stage.ids.filter((id) => earned.has(id)).length;
  return { done, total: stage.ids.length };
}
