# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npx expo start          # start dev server (scan QR with Expo Go)
npx expo start --android
npx expo start --ios
npx tsc --noEmit        # type-check (no test suite exists)
```

## Architecture

**Expo + React Native** app (SDK 54, React 19). Entry point is `App.tsx` which mounts a `NativeStackNavigator` wrapping all screens inside `ProgressProvider` + `GestureHandlerRootView` + `SafeAreaProvider`.

### Navigation

All routes live in `src/navigation/types.ts` as `RootStackParamList`. Every new screen requires:
1. Add route to `RootStackParamList`
2. Import screen and add `<Stack.Screen>` in `App.tsx`

Screens use `ScreenProps<'RouteName'>` for typed props.

### Global State — `src/store/ProgressStore.tsx`

Single React Context backed by AsyncStorage (`@bumbloo/progress/v1`). Access via `useProgress()`. The `Progress` type tracks stars, coins, streak, completed letters/numbers/words, games played, badges, and audio settings. Every mutation method (`addStars`, `completeLetter`, `playGame`, etc.) persists immediately. Do not manage game progress locally in screens — always call the store methods.

### Theme — `src/theme.ts`

All colours are in the `C` object. Always use `C.*` tokens — never hardcode hex values for UI colours. Key palette: `C.ink` (text/borders), `C.cream` (backgrounds), `C.coral`/`C.blue`/`C.mint`/`C.yellow`/`C.purple` (accents), each with a `*Deep` shadow variant.

### Component Layers

- **`src/components/PhoneSafe`** — use as the root wrapper for every game/lesson screen. Accepts a `bg` prop for background colour.
- **`src/components/ui/`** — shared primitives: `KButton`, `KCard`, `KProgress`, `KBadge`. Import from `../components/ui`.
- **`src/components/cards/`** — one file per ExploreScreen card. Each card is a self-contained `Pressable` with its own `StyleSheet`. Add a new card file here whenever a new game is added to ExploreScreen.
- **`src/components/Icons.tsx`**, `Backgrounds.tsx`, `CardIllustrations.tsx`, `SvgRenderer.tsx` — SVG/icon helpers.

### Screen Conventions

- Game screens use `PhoneSafe` as root, a back-arrow header row, a progress bar, the game area, then answer options.
- Correct answer → play sound + auto-advance after ~1.3 s via `setTimeout`.
- Wrong answer → `Animated` shake sequence on the question card, manual Next button appears.
- All games end with `navigation.navigate('Reward', { from: 'ScreenName', stars: 1|2|3 })`.
- Star count passed to Reward: `score >= 80% → 3`, `>= 50% → 2`, else `1`.

### Audio

Use `expo-av` `Audio.Sound.createAsync`. For correct-answer sounds, load, play, then `unloadAsync` after ~900 ms. Respect `p.soundOn` from the progress store before playing.

### SVG

`react-native-svg` for all vector graphics. Use `SvgRenderer` component for the ColorMatch coloring-book pages (defined in `cm_pages.txt`-style `PAGES` arrays).

### Assets

- `assets/images/` — PNG card thumbnails (`card_*.png`) used by image-based ExploreScreen cards.
- `assets/sounds/` — animal `.mp3` files used by AnimalScreen.
- `assets/music/` — background music and TTS poem files used by MusicScreen.
