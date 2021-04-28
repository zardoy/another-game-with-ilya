# Minecraft Clone by Ilya

## Why this clone?

- [x] Great mobile support
- [ ] PWA - offline support & more
- [ ] Worlds are stored in folders (Ex. on your desktop) - desktop only. On mobile worlds are persisted in browser storage. (point here problems on IOS)
- [ ] Extremely small world size & Version control for worlds
- [ ] Easily port worlds from Java & Bedrock
- [ ] And the main reason: The most powerful API for mods with blazing test system

## Start Locally

1. After cloning (or downloading ZIP), install dependencies: `npm install`

2. Run `start` script either in VSCode *NPM SCRIPTS* panel or in console: `npm run start`

You don't need to restart the script, just press save file to reload changes.

## Some general notes

- Project has two engines:
  - **ILYA**: Powered by Ilya who's building it from scratch (stale)
  - **THREE**: Powered by Three.js which has amazing performance (ready)

- In each version camera moves forward/right parallel to the xz-plane. y is used to move up/down
