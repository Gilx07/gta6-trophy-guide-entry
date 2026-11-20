# Leonida Trophy Guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Gilx07/gta6-trophy-guide-entry/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Gilx07/gta6-trophy-guide-entry/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline web app that tracks and guides all 55 GTA 6 trophies: 1 Platinum, 2 Gold, 6 Silver, 46 Bronze. Every trophy has a guide written in plain words, with a source citation beside it. Your progress lives in the browser only, with export to a file and import back. Filter by kind, grade or status, search by name, and hide story spoilers until you have earned those trophies. A six-stage roadmap lays out the road to the platinum, and the one trophy that can be missed is flagged up front: Positive Mental Attitude, meditate at Jason's house in Chapter 1 before the chapter ends.

## Run it

Serve the app:

```sh
node serve.ts
```

Then open http://localhost:8080.

Build the entry dossier:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Bounty

Built for the make.fun bounty [Build the best GTA 6 trophy guide](https://make.fun/bounty/gta6-trophy-guide-01).
