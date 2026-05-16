# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## What This App Is

**Nimble Needle (N2)** — a React Native / Expo app for quilters and bag makers. It lets users track fabric stash, manage projects, calculate quilt measurements, and explore color harmonies.

- Expo SDK ~54 · React Native 0.81 · React 19
- EAS Build for distribution (no local Xcode/Android Studio needed)
- All data stored locally via AsyncStorage — no backend required for core features

---

## Running the App

```bash
npm install
npx expo start          # starts Metro bundler, scan QR with Expo Go
npx expo start --ios    # iOS simulator
npx expo start --android
```

---

## Pushing to GitHub

**This cloud environment cannot push without a token.** Git commit signing also requires `--no-gpg-sign`.

```bash
# Commit
git -c commit.gpgsign=false commit -m "your message"

# Push (replace TOKEN with a GitHub PAT — repo scope)
git push https://TOKEN@github.com/Sabbie702/N2.git master
```

GitHub PAT: github.com → Settings → Developer settings → Personal access tokens → Tokens (classic) → repo scope.

If the remote has diverged (another session pushed):
```bash
git fetch https://TOKEN@github.com/Sabbie702/N2.git master
git -c commit.gpgsign=false merge FETCH_HEAD -X ours --no-edit -m "merge message"
git push https://TOKEN@github.com/Sabbie702/N2.git master
```

---

## Triggering an EAS Build

**EAS cannot be triggered from this cloud environment** — api.expo.dev is blocked by the network policy. The user must run this locally after pulling:

```bash
git pull origin master
npm install
npx eas-cli build --profile preview --platform all   # both iOS + Android
npx eas-cli build --profile preview --platform ios
npx eas-cli build --profile preview --platform android
```

EAS profiles are in `eas.json`:
- `preview` — internal distribution, Android APK (direct install for testing)
- `production` — Android App Bundle for store

EAS project ID: `ce179ada-6382-49b3-9018-d21b8151bc8c` (in `app.json`).

Expo Personal Access Token: expo.dev → avatar → Account Settings → Access Tokens → Create Token.

---

## Navigation Architecture

```
App.js
└── AsyncStorage gate (@onboarding_complete)
    ├── AuthStack          (first launch — src/navigation/AuthStack.js)
    │   Welcome → Login / CreateAccount → Onboarding → Success
    │   SuccessScreen sets @onboarding_complete = 'true' then calls onComplete()
    │
    └── DrawerNavigator    (returning users — src/navigation/DrawerNavigator.js)
        └── TabNavigator   (bottom tabs: Stash · Projects · Colors · Discover)
            ├── HomeStack  (hidden tab — Home, Notes, Profile, Settings, Calculators)
            ├── Stash
            ├── ProjectsStack  (Projects list + New/Edit/Workspace/Scrapbook)
            ├── ColorStack     (Color Corner)
            └── Discover
```

**Key navigation quirk:** Home is a hidden tab (no tab bar entry). The bottom tabs are Stash, Projects, Colors, Discover. The hamburger menu in each header opens the right-side Drawer, which links to Home sub-screens (Profile, Settings, Calculator).

**Duplicate auth files exist** — `src/screens/auth/` contains Firebase-based screens from a prior session; `src/screens/` (root level) contains the current AsyncStorage-based screens. Only the root-level screens are used. `AuthNavigator.js` and `AuthContext.js` are also orphaned Firebase artifacts — do not use them.

---

## Design System

All colors in `src/styles/colors.js`:

```js
DEEP_PLUM:     '#5B2D8E'  // buttons, active states, headers
MIDNIGHT:      '#2D1B4E'  // dark backgrounds, nav bar, drawer
MINT:          '#4EC9A0'  // CTAs, active tab indicator, success
SOFT_LAVENDER: '#C084FC'  // secondary accents, badges
LAVENDER_WHITE:'#F5F0FA'  // page backgrounds
AMBER:         '#F59E0B'  // UFO project state ONLY
```

**Fonts:** Playfair Display (Bold, SemiBold, Regular, Italic, BoldItalic, SemiBoldItalic) loaded from `assets/fonts/` TTF files via `useFonts` in App.js. Reference as `fontFamily: 'PlayfairDisplay-Bold'` etc.

**Auth screens** use a light lavender background (`#F5EFFE`) with dashed SVG thread curves and X-stitch markers as decoration.

**AppLogo** component (SVG-drawn, no image file) lives in `HomeScreen.js` as a named export — import it from there: `import { AppLogo } from '../screens/HomeScreen'`.

---

## Data Storage

All persistence via `@react-native-async-storage/async-storage`.

- Projects/scrapbook CRUD: `src/storage/projects.js`
- Onboarding flag: key `@onboarding_complete` (set to `'true'` in SuccessScreen)
- No backend, no Firebase in the active code path (Firebase packages are installed but the active auth flow bypasses them)

---

## Calculator Math

Pure functions in `src/utils/calculatorMath.js`:
- `calcBlocks` — block count + cut size
- `calcYardage` — fabric yardage with 10% buffer
- `calcBacking` — backing panels and yardage
- `calcBinding` — binding strip count and yardage
- `inchesToYards` — rounds to nearest ⅛ yard

---

## Color Wheel Feature

`src/screens/colorwheel/` + `src/navigation/ColorWheelNavigator.jsx` + `src/components/colorwheel/`.

Color extraction: `src/utils/kMeansExtractor.js` (on-device, no external API).
Harmony engine: `src/utils/colorHarmony.js`.
Brand fabric colors: `src/data/fabricColors.js`.

Navigation into results from anywhere:
```js
navigation.navigate('HarmonyResults', {
  sourceHex: '#5B2D8E',
  sourceName: 'Kona Plum',
  sourceType: 'stash', // 'stash' | 'wheel' | 'brand' | 'photo' | 'project'
});
```
