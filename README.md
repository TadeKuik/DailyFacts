# Loop — Daily Facts & Challenges

A tiny, installable daily-ritual app. One fact, one quote, and four quick
challenges — all deterministic per calendar day, so everyone sees the same
thing on the same day, and progress resets automatically at midnight.

No backend, no build step, no dependencies — just static files.

## Files

- `index.html` — markup for all four screens (Home, Facts, Tools, Settings)
- `style.css` — design system (light/dark tokens, glass cards, layout)
- `script.js` — content banks + app logic (dates, storage, tools)
- `manifest.json` — PWA manifest (name, icons, theme colors)
- `sw.js` — service worker (offline caching, required for installability)
- `icons/` — app icons (192, 512, maskable, and the iOS touch icon)

## Put it on GitHub Pages

1. Create a new GitHub repository and push all files in this folder to it
   (keep them at the repository root, or update the paths if you nest them
   in a subfolder).
2. In the repo, go to **Settings → Pages**.
3. Under **Source**, choose the branch (usually `main`) and folder (`/root`),
   then save.
4. GitHub gives you a URL like `https://yourname.github.io/your-repo/`.
   That's it — no build step needed.

PWA installability requires HTTPS, which GitHub Pages provides automatically.

## Installing it as an app

- **Android / desktop Chrome/Edge:** open the site, then use the install
  icon in the address bar, or open Settings inside the app and tap
  **Install**.
- **iPhone/iPad (Safari):** open the site, tap the **Share** icon, then
  **Add to Home Screen**. iOS doesn't support an automatic install prompt,
  so this manual step is required there.

## Notes on the content

- Facts, quotes, English words, and capital-city pairs are hard-coded
  arrays in `script.js`. The day's pick is derived from the day-of-year, so
  it's identical for every visitor on a given day and repeats once the
  arrays cycle through. Add more entries to any array to extend the cycle.
- The Facts tab only reveals the days of the current week up to today —
  future days show a locked placeholder, by design.
- Tool completions and personal records are stored in the browser's
  `localStorage`, per device — nothing is sent anywhere.
