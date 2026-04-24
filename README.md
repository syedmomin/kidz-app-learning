# Bumbloo — Kids Learning App (Expo + TypeScript)

Fun, colorful learning app for ages 3–8. **All progress saves to device** via AsyncStorage.

## Run

```bash
npm install
npx expo start
```
Open **Expo Go** on your phone → scan QR.

## Screens (13)

1. Splash · 2. Explore Hub · 3. Letters A–Z · 4. **Letter Tracing** (functional finger drawing)
5. Numbers (tap-to-count) · 6. Color Match · 7. Word Match · 8. Story (page flip)
9. Mini-Games Hub · 10. Reward · 11. **Profile** (edit name, pick avatar)
12. **Settings** (sound/music toggles, reset) · 13. **Streak** (daily calendar)

## What's persisted on device (AsyncStorage)
- Kid's name & avatar
- Stars, coins, badges
- Daily streak (auto-tracked on app open)
- Letters completed · Numbers completed · Words completed · Stories read · Games played
- Sound / music preferences

Key: `@bumbloo/progress/v1`. All reads/writes go through `useProgress()` in `src/store/ProgressStore.tsx`.


https://www.pinterest.com/search/pins/?q=KiddiePak%20app%20UI