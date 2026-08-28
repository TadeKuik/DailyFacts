# Loop — Daily Facts & Challenges (v2.0)

A tiny, installable daily-ritual app. One fact, one quote, seven quick
challenges, a streak, badges — and optional cloud sync via Firebase.

## Files

- `index.html` — markup for all four screens, plus the Account and
  Stats & Badges panels
- `style.css` — design system (light/dark tokens, per-tool colors, streak
  and badge styling)
- `script.js` — content banks, app logic, streak/badge logic, and the
  Firebase auth + sync layer
- `manifest.json` — PWA manifest
- `sw.js` — service worker (offline caching)
- `icons/` — app icons

## What's new in v2.0

- **3 new challenges:** Flags, Math Sprint, Roman Numerals (7 total)
- **Daily streak:** goes up by 1 every day you complete all 7 challenges;
  resets to 0 if you miss a full day
- **Stats & badges:** current/longest streak, total completed, all your
  PRs, and 7 unlockable achievement badges — open it by tapping the
  streak pill on Home or "View" in Settings
- **More color:** each tool now has its own soft accent color, the streak
  uses a warm amber tone, and the "done" state is a livelier green — the
  rest of the app stays quiet on purpose
- **Sign in (Google or email/password) + cloud sync:** your theme,
  streak, badges, and PRs sync to your account via Firebase, so they
  follow you across devices. If you don't sign in, everything still works
  exactly as before, just saved to this device only
- **Fixed:** installing the app used to fail with "site can't be
  reached" — the manifest's `start_url` pointed at `index.html`
  directly, which some hosts redirect. It now points at `./`.

## Firebase — what's already done vs. what you still need to do

Your config is already in `script.js`. Still to do, in the
[Firebase console](https://console.firebase.google.com), project
**loop-38c98**:

1. **Authentication → Sign-in method** — make sure both **Google** and
   **Email/Password** are enabled.
2. **Build → Firestore Database** — create the database if you haven't
   yet (any region is fine; pick one close to you, e.g. `eur3`).
3. **Firestore Database → Rules** — paste this in and publish, so people
   can only ever read/write their own data:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

4. **Authentication → Settings → Authorized domains** — add
   `thedailyloop.pages.dev`.

Until Firestore/Auth are fully set up, the app degrades gracefully: the
sign-in options just stay hidden and a small note says cloud sync isn't
configured yet — nothing breaks.

## Upload checklist (what to replace on GitHub)

Every one of these files replaces the same-named file in your repo —
upload them via **Add file → Upload files** and let GitHub overwrite the
existing ones (see the step-by-step in chat if you need a refresher).

| File | What changed |
|---|---|
| `index.html` | Added streak badge, Account section, Stats & Badges row |
| `style.css` | Streak/badge styling, per-tool colors, `[hidden]` fix |
| `script.js` | 3 new tools, streak logic, badges, Firebase auth + sync |
| `manifest.json` | Fixed `start_url` (the install bug) |
| `sw.js` | Bumped cache version so devices pick up the new files |
| `icons/*.png` | Unchanged — no need to re-upload if already in `icons/` |

## Notes

- Facts, quotes, words, and country/flag/capital pairs are hard-coded
  arrays in `script.js`, picked deterministically by day-of-year — same
  for every visitor on a given day.
- Tool completions, PRs, and streak data live in `localStorage`. When
  signed in, that same data is mirrored to Firestore under
  `users/{your-uid}` and pulled back down on sign-in from any device.
- Reset progress (Settings → Data) clears streak, badges progress, and
  PRs, and pushes the cleared state to the cloud too if you're signed in.
