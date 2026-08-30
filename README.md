# Loop — Daily Facts & Challenges (v3.0)

A tiny, installable daily-ritual app. One fact, one quote, seven quick
challenges, a streak, badges, a streak calendar — and optional cloud sync
via Firebase.

## Files

- `index.html` — markup for all screens, including the streak badge,
  Account panel, and badge toast / confetti layers
- `style.css` — design system: light/dark tokens, streak & badge colors,
  confetti and toast animations
- `script.js` — content banks, app logic, streak/badge/heatmap logic, and
  the Firebase auth + sync layer
- `manifest.json` — PWA manifest
- `sw.js` — service worker (offline caching, cache bumped to v3)
- `icons/` — app icons (unchanged since v2)

## What's new in v3.0

- **Badge unlock toast**: a small "New badge unlocked" pill appears at
  the bottom of the screen the moment you earn one, and queues nicely if
  you earn several at once
- **Settings icon fixed**: the gear in the bottom nav is now a properly
  symmetric icon
- **Clock refresh**: a softly blinking colon, small hour tick marks
  around the day ring, and a tiny live seconds readout — still simple,
  just a bit more alive
- **Streak calendar**: a 5-week heatmap in Stats & Badges showing which
  days you completed everything
- **Confetti**: a short celebratory burst when your streak hits 7, 30,
  or 100 days
- **5 new badges** (12 total): Wordsmith, Timekeeper, Globetrotter,
  Number Cruncher, Comeback Kid — see the full list in the app
- **Badge progress**: every locked badge now shows its progress right on
  the tile (e.g. "14/20"), no extra tap needed
- **Colors**: the per-tool icon colors from v2 are gone (back to
  neutral); color now shows up in the streak badge, unlocked badges, and
  the "today" highlight in Facts instead
- Push notifications: not built yet, per your call — the local reminder
  banner (Settings → Reminders) still works exactly as before, but only
  while the app itself is open

## Upload checklist

Same procedure as before — **Add file → Upload files**, let GitHub
overwrite the existing files with these:

| File | What changed |
|---|---|
| `index.html` | Clock markup, settings icon, badge toast + confetti layer |
| `style.css` | Clock styling, neutral tool icons, badges/heatmap/toast/confetti CSS |
| `script.js` | Badge system rewrite (progress + persistence), streak calendar, confetti, clock ticking |
| `sw.js` | Cache bumped to v3 so installed copies pick up the update |

`manifest.json` and `icons/` are unchanged since the last update — no
need to re-upload those.

## Notes

- Badge unlocks are now permanent once earned (stored in
  `loop_badges_unlocked`), so an achievement like "Comeback Kid" won't
  disappear again if your streak later resets.
- The streak calendar reads from `loop_completed_dates`, a capped list
  of the last ~120 fully-completed days.
- All of this syncs to Firestore too when signed in, same as before.
