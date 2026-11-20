// Export progress to a file, and import it back, with the file checked before anything is applied.
export function downloadProgress(earned) {
  const payload = {
    game: 'Grand Theft Auto VI',
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort((a, b) => a - b),
  };
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

export async function readProgressFile(file, trophies) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const ids = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(ids)) throw new Error('progress file must hold a list of earned trophy ids');
  const known = new Set(trophies.map((t) => t.id));
  const earned = new Set();
  for (const id of ids) {
    if (!Number.isInteger(id) || !known.has(id)) throw new Error(`unknown trophy id in file: ${id}`);
    earned.add(id);
  }
  return earned;
}
