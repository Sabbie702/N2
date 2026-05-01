# N2 — Nimble Needle
## Claude Code Session Handoff
**Last updated: May 1, 2026 · App v1.2.0 (versionCode 3)**

---

## How to Start a Session

1. Drop this file into the chat — it has everything Claude Code needs
2. `CLAUDE.md` at the project root has the Color Corner feature brief — read automatically
3. Memory is stored at `~/.claude/projects/-Users-rocki-n2/memory/` — loaded automatically

---

## Project Identifiers

| Item | Value |
|------|-------|
| Domain | nimbleneedle.app |
| Email | nimbleneedlequilts@gmail.com |
| Android package | com.nimbleneedle.app |
| Firebase project | nimble-needle |
| GitHub repo | nimble-needle (private) |
| EAS Project ID | ce179ada-6382-49b3-9018-d21b8151bc8c |
| EAS Account | nimbleneedle |
| Current version | 1.2.0 (versionCode 3) |

---

## Running Locally

```bash
npm install
npx expo start           # Dev server — scan QR with Expo Go on same WiFi
npx expo start --tunnel  # Dev server — public URL for different networks
```

---

## Building & Deploying (EAS)

### Before every build:
1. **Bump the version** in `app.json` — increment `version` (e.g. 1.2.0 → 1.3.0) and `versionCode` (e.g. 3 → 4)
2. **Commit all changes** — EAS uses git fingerprinting; uncommitted files are ignored
3. Build:

```bash
git add .
git commit -m "your message"
eas build --platform android --profile preview --non-interactive
```

### After a feature is complete:
- Bump `version` + `versionCode` in `app.json` before building
- Commit with a clear message describing what changed
- Build and test APK before moving to next feature
- Update this HANDOFF.md with new status

### EAS login (required once per terminal session):
```bash
eas login   # use nimbleneedlequilts@gmail.com
            # MUST be run in an interactive terminal — not via Claude Code prompt
```

### View recent builds:
```bash
eas build:list --platform android --limit 5
```

---

## google-services.json — IMPORTANT

This file is **NOT in git**. It is configured as an EAS file secret.

- **Local dev:** Place `google-services.json` in the project root (download from Firebase Console → project `nimble-needle` → Project Settings → Your apps → Android)
- **EAS builds:** Stored as secret `GOOGLE_SERVICES_JSON` on the `nimbleneedle` account. `app.config.js` reads it via `process.env.GOOGLE_SERVICES_JSON` automatically
- **If secret is ever lost:** Re-upload with:
```bash
eas env:create --name GOOGLE_SERVICES_JSON --type file --value ./google-services.json --environment preview --visibility secret --non-interactive
```

---

## Critical Architecture Rules — DO NOT BREAK

1. **GestureHandlerRootView** wraps the entire app in `App.js` — never remove it
2. **Home tab must stay in TabNavigator** even though it's hidden (`tabBarItemStyle: display:none` + `tabBarButton: () => null`) — moving it to DrawerNavigator breaks the tab bar on Home screens
3. **expo-dev-client** is in `package.json` but NOT in `app.json` plugins — adding it back causes stale JS bundles
4. **SDK must stay at `~54.0.33`** — `npx expo install` on multiple packages at once can silently upgrade expo to SDK 55 and break the build. After any `npm install`, check that `expo` in `package.json` is still `~54.0.33`
5. **app.config.js overrides app.json** for EAS builds (googleServicesFile path) — keep both files in sync for all other settings

---

## File Structure

```
/
├── app.json                    ← Static config (version, versionCode, Android settings)
├── app.config.js               ← Dynamic config — reads GOOGLE_SERVICES_JSON env var for EAS
├── eas.json                    ← EAS build profiles (preview = internal APK)
├── CLAUDE.md                   ← Color Corner feature brief (auto-read by Claude Code)
├── HANDOFF.md                  ← This file
├── google-services.json        ← NOT in git — local dev only
│
└── src/
    ├── styles/colors.js        ← COLORS.DEEP_PLUM, MIDNIGHT, MINT, etc — single source of truth
    │
    ├── storage/
    │   ├── projects.js         ← loadProjects, saveProjects, addProject, updateProject,
    │   │                          savePaletteToProject, updatePaletteInProject, removePaletteFromProject
    │   └── notes.js            ← Note CRUD helpers
    │
    ├── data/
    │   └── fabricColors.js     ← Kona Cotton, Bella Solids, Pure Elements, Confetti Cottons
    │                              DO NOT MODIFY
    │
    ├── utils/
    │   ├── colorHarmony.js     ← HSL harmony engine: getHarmonies(), hslToHex(), hexToHsl()
    │   │                          DO NOT MODIFY
    │   ├── kMeansExtractor.js  ← On-device k-means photo color extraction
    │   │                          DO NOT MODIFY
    │   ├── colorUtils.js       ← Legacy color math (used by old ColorWheelScreen.js)
    │   └── quiltBlocks.js      ← Quilt block SVG metadata (3 blocks)
    │
    ├── hooks/
    │   ├── useColorWheel.js    ← State for legacy color wheel
    │   └── usePalette.js       ← State for legacy palette (colors, locks, type, re-stitch)
    │
    ├── components/
    │   ├── colorwheel/                  ← NEW Color Corner components
    │   │   ├── ColorWheelDial.jsx       ← Interactive HSL wheel picker (SVG + gesture handler)
    │   │   ├── HarmonyTypeCard.jsx      ← Collapsible harmony result card
    │   │   └── ColorWheelComponents.jsx ← FabricMatchChip, SwatchGrid (Swatch Stash browser),
    │   │                                   ExtractedPalette, SavePaletteModal
    │   ├── ColorWheelPicker.js ← Legacy wheel picker (used by old ColorWheelScreen.js)
    │   ├── PaletteStrip.js     ← Legacy palette strip
    │   ├── ReStitchButton.js   ← Legacy re-stitch button
    │   ├── QuiltBlockSVG.js    ← SVG quilt block previews
    │   ├── SavePaletteSheet.js ← Legacy save palette sheet
    │   └── SavedPaletteCard.js ← Palette card shown in ProjectWorkspace
    │
    ├── screens/
    │   ├── colorwheel/                       ← NEW Color Corner screens
    │   │   ├── ColorWheelScreen.jsx          ← Main: Free Spin tab + Swatch Stash tab + camera button
    │   │   ├── HarmonyResultsScreen.jsx      ← 5 harmony groups, brand filter, save to project
    │   │   └── PhotoExtractScreen.jsx        ← Camera/gallery + on-device k-means extraction
    │   ├── ColorWheelScreen.js ← LEGACY palette builder (still mounted via ColorStack)
    │   ├── HomeScreen.js       ← Dashboard (dummy data — needs wiring to AsyncStorage)
    │   ├── ProjectsScreen.js   ← Project list from AsyncStorage
    │   ├── NewProjectScreen.js ← Quilt + Bag creation forms (full spec)
    │   ├── ProjectWorkspaceScreen.js ← Stage tracker, to-dos, saved palettes
    │   ├── EditProjectScreen.js
    │   ├── StashScreen.js      ← SHELL: grid + FAB designed, item CRUD not wired
    │   ├── NotesScreen.js      ← Fully working
    │   ├── DiscoverScreen.js   ← Placeholder
    │   ├── ProfileScreen.js    ← Basic shell
    │   └── SettingsScreen.js   ← Basic shell
    │
    └── navigation/
        ├── DrawerNavigator.js       ← Right drawer: logo, welcome, Main Menu, Account & Utility
        ├── TabNavigator.js          ← 4 tabs: Home (hidden/initial), Projects, Stash, Discover
        ├── HomeStack.js             ← Home + Notes + Profile + Settings
        ├── ProjectsStack.js         ← Projects list + New/Edit/Workspace + ColorWheelNavigator
        ├── ColorWheelNavigator.jsx  ← NEW: Color Corner sub-navigator (3 screens)
        └── ColorStack.js            ← Legacy Colors tab (routes to old ColorWheelScreen.js)
```

---

## Navigation Tree

```
GestureHandlerRootView (App.js)
  NavigationContainer
    DrawerNavigator (right side, 270px, MIDNIGHT bg)
      MainTabs → TabNavigator
        Home (HIDDEN, initial route) → HomeStack
          HomeMain → HomeScreen
          Notes    → NotesScreen
          Profile  → ProfileScreen
          Settings → SettingsScreen
        Projects → ProjectsStack
          ProjectsList     → ProjectsScreen
          NewProject       → NewProjectScreen
          ProjectWorkspace → ProjectWorkspaceScreen
          EditProject      → EditProjectScreen
          ColorWheel       → ColorWheelNavigator        ← Color Corner entry point
            ColorWheelMain   → ColorWheelScreen.jsx
            HarmonyResults   → HarmonyResultsScreen.jsx
            PhotoExtract     → PhotoExtractScreen.jsx
        Stash    → StashScreen
        Discover → DiscoverScreen
```

### Navigate to Color Corner from any screen:
```js
// From Home Quick Actions or any screen:
navigation.navigate('Projects', { screen: 'ColorWheel' })

// Jump straight to harmony results (from Stash or Project screen):
navigation.navigate('Projects', {
  screen: 'ColorWheel',
  params: {
    screen: 'HarmonyResults',
    params: { sourceHex: '#5B2D8E', sourceName: 'Kona Plum', sourceType: 'stash' }
  }
})
```

---

## Data Storage

All data is **local device only** via AsyncStorage. Firebase SDK installed but idle.

| Key | Content |
|-----|---------|
| `nimble_needle_projects` | Array of all project objects |
| `nimble_needle_notes` | Array of all note objects |

---

## Feature Status

### ✅ Fully Built
- Home dashboard (dummy data — needs AsyncStorage wiring)
- Projects: list, create (Quilt + Bag), edit, workspace (stage tracker, to-dos, palettes)
- Color Corner: interactive HSL wheel, Swatch Stash brand browser (Kona/Bella/Pure/Confetti), photo extraction (on-device k-means), 5 harmony types (quilter-native names), save palette to project
- Notes: search, swipe-delete, FAB create, animated toasts
- Stash: 10-category grid layout + FAB picker modal (item CRUD not wired)
- Navigation: Home on launch, bottom tabs everywhere, right-side drawer
- Drawer: logo, welcome, Main Menu (Profile/App Settings/Storage Spots/Help), Account & Utility (Subscription/Invite a Friend/Contact Support), Privacy & Terms, Log Out
- EAS builds: Android APK via nimbleneedle account

### 🟡 Shell / Placeholder
- **Stash item CRUD** — grid and FAB designed; add/edit/delete not wired
- **Home live data** — uses hardcoded dummy constants (STATS, RECENT_PROJECTS, CONTINUE_PROJECT)
- **AI Palette Advisor** — logic complete in `colorHarmony.js` (`fetchPaletteAdvice()`); no UI button yet. Needs Anthropic API key in `app.json extra` config
- Discover, Profile, Settings — basic shells

### 🔴 Not Started
- iOS build + App Store
- Firebase cloud sync (AsyncStorage → Firestore; needs auth first)
- Photo uploads for projects
- User authentication
- Sharing / export / Quilt Card
- Notifications / reminders

---

## V2 Priorities (in order)

1. **Wire Home screen to real data** — remove dummy constants, use `useFocusEffect` + AsyncStorage
2. **Stash item CRUD** — fields: category, name, qty, color, supplier, notes, photo
3. **AI Palette Advisor button** — add to `src/screens/colorwheel/ColorWheelScreen.jsx`, calls `fetchPaletteAdvice()` in `colorHarmony.js`
4. **Date pickers** — replace free-text date fields in New/Edit Project
5. **Photo support** — `expo-image-picker` is installed; wire to project workspace cover image
6. **Firebase cloud sync** — migrate AsyncStorage → Firestore; needs auth decision first
7. **iOS build** — submit to App Store via EAS (`eas build --platform ios --profile preview`)
8. **Discover screen** — pattern inspiration, quilt block library, or community content

---

## Known Issues / Watch-outs

| Issue | Location | Notes |
|-------|----------|-------|
| Home uses dummy data | `HomeScreen.js` constants at top of file | V2 priority #1 |
| Stash items don't persist | `StashScreen.js` — `useState([])` never grows | V2 priority #2 |
| Dates are free-text | New/Edit Project forms | No date picker component yet |
| No user auth | Entire app | Fully offline; all data on device |
| Legacy + new Color Corner coexist | `src/screens/ColorWheelScreen.js` (old) + `src/screens/colorwheel/` (new) | Consolidation is future task |
| AI Advisor has no UI | `colorHarmony.js` `fetchPaletteAdvice()` | Code complete, needs button + API key |

---

## Branding — Never Deviate

```js
// src/styles/colors.js
COLORS.DEEP_PLUM      = '#5B2D8E'  // Primary — buttons, headers, active states
COLORS.MIDNIGHT       = '#2D1B4E'  // Dark backgrounds, nav bar, drawer bg
COLORS.MINT           = '#4EC9A0'  // Accent — CTAs, active states, checkmarks
COLORS.SOFT_LAVENDER  = '#C084FC'  // Secondary — tags, badges, inactive icons
COLORS.LAVENDER_WHITE = '#F5F0FA'  // Page/card backgrounds
COLORS.AMBER          = '#F59E0B'  // UFO state ONLY — never use elsewhere
```

- Header bars: `MIDNIGHT` bg, white title, `MINT` subtitle
- Cards: white bg, `lightBorder` border (0.5px), `borderRadius: 14`, `elevation: 2`
- Primary actions: `DEEP_PLUM` button with white text
- No gradients. Minimal shadows.

---

## EAS Troubleshooting

| Problem | Fix |
|---------|-----|
| `eas login` fails in Claude Code | Run in a separate interactive terminal window |
| Build fails: google-services.json missing | Check `eas env:list --environment preview` — re-upload if missing |
| Build fails: SDK version mismatch | Verify `expo` in `package.json` is `~54.0.33` — revert if upgraded |
| Build uses stale code / wrong version | Bump `version` + `versionCode` in `app.json`, commit, rebuild |
| `expo-dev-client` causes stale bundles | Must NOT be in `app.json` plugins array (fine in `package.json`) |
| `npx expo install` upgraded expo | Manually revert `expo` to `~54.0.33` in `package.json`, run `npm install` |
