# Nimble Needle (N2) — Master Technical Handoff Document
**Prepared:** April 17, 2026  
**App Version:** 1.1.0 (versionCode 2)  
**Platform:** Android (iOS ready — not yet distributed)  
**Distribution:** EAS Internal / Preview APK  
**EAS Project ID:** `ce179ada-6382-49b3-9018-d21b8151bc8c`  
**EAS Account:** `nimbleneedle`

---

## 1. What Is Nimble Needle?

Nimble Needle (N2) is a mobile app built for quilters and bag makers. It gives makers a dedicated workspace to track in-flight projects from first cut to finished seam, manage their fabric stash and supplies, plan color palettes with color theory intelligence, and capture quick notes — all in one place.

The tagline is: **"From Stash to Stitch."**

The app is built in React Native / Expo and currently targets Android with an APK distributed via EAS Internal Distribution. iOS is architecturally ready but not yet submitted to App Store.

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React Native | 0.81.5 |
| Build tooling | Expo SDK | ~54.0.33 |
| Build service | EAS Build | — |
| Navigation | React Navigation (Native Stack + Bottom Tabs + Drawer) | v7 |
| Storage | AsyncStorage | 2.2.0 |
| SVG rendering | react-native-svg | 15.12.1 |
| Gesture handling | react-native-gesture-handler | ~2.28.0 |
| Animation | react-native-reanimated v4 + react-native-worklets | ~4.1.1 / 0.5.1 |
| Icons | @expo/vector-icons (Ionicons) | ^15.0.3 |
| Firebase | @react-native-firebase/app | ^24.0.0 |
| Safe area | react-native-safe-area-context | ~5.6.0 |
| New Architecture | Enabled (`newArchEnabled: true`) | — |

**Key architectural decisions:**
- `GestureHandlerRootView` wraps the entire app at the root level in `App.js` — required for all gesture/swipe/drawer functionality.
- New React Native Architecture (`newArchEnabled: true`) is enabled — this is why `react-native-worklets` is required alongside Reanimated v4.
- All data persistence uses `@react-native-async-storage/async-storage` — there is no backend/server. All project, note, and stash data lives locally on the device.
- Firebase is initialized but not yet actively used for data (dependency is present for future cloud sync / auth).

---

## 3. Brand & Design System

### Color Palette (`src/styles/colors.js`)

| Token | Hex | Usage |
|---|---|---|
| `COLORS.DEEP_PLUM` | `#5B2D8E` | Primary brand — headers, active tabs, buttons, accents |
| `COLORS.MIDNIGHT` | `#2D1B4E` | Dark backgrounds, navigation bars, tab bar |
| `COLORS.MINT` | `#4EC9A0` | Active tab icons, success states, highlights |
| `COLORS.SOFT_LAVENDER` | `#C084FC` | Secondary accents, inactive icons, form borders |
| `COLORS.LAVENDER_WHITE` | `#F5F0FA` | App background, card backgrounds |

Additional in-component colors used:
- `#7C3ABF` — quilt "done" segments in donut chart, quilt block tags
- `#4aad85` — bag "done" segments in donut chart
- `#60a5fa` — palette section accent dot in workspace

### Typography
- No custom fonts loaded — system fonts throughout
- Headers: `fontWeight: '700'` or `'800'`, Deep Plum color
- Body: standard system font, Midnight color
- Section labels: `textTransform: 'uppercase'`, `letterSpacing: 0.5`

### Card & Shadow Pattern
All cards follow this shadow pattern:
```js
shadowColor: COLORS.MIDNIGHT,
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.07,
shadowRadius: 6,
elevation: 2,
borderRadius: 14,
backgroundColor: '#fff',
```

---

## 4. Navigation Architecture

The navigation tree is:

```
GestureHandlerRootView (App.js)
  └── NavigationContainer
        └── DrawerNavigator (right side, 270px wide, MIDNIGHT background)
              └── "MainTabs" → TabNavigator
                    ├── "Home" (HIDDEN — display:none, initial route) → HomeStack
                    │     ├── "HomeMain" → HomeScreen
                    │     ├── "Notes"   → NotesScreen
                    │     ├── "Profile" → ProfileScreen
                    │     └── "Settings" → SettingsScreen
                    ├── "Stash"    → StashScreen
                    ├── "Projects" → ProjectsStack
                    │     ├── "ProjectsList"     → ProjectsScreen
                    │     ├── "NewProject"       → NewProjectScreen
                    │     ├── "ProjectWorkspace" → ProjectWorkspaceScreen
                    │     ├── "EditProject"      → EditProjectScreen
                    │     └── "ColorWheel"       → ColorWheelScreen
                    ├── "Colors"   → ColorStack
                    │     └── "ColorWheel" → ColorWheelScreen
                    └── "Discover" → DiscoverScreen
```

### Key Navigation Rules

**Bottom Tab Bar:** Shows 4 tabs — Stash (🧵), Projects (📋), Colors (🎨), Discover (🔍). The Home tab is present in the navigator but hidden from the bar using `tabBarItemStyle: { display: 'none' }` and `tabBarButton: () => null`. This is critical — Home must remain in TabNavigator so the tab bar renders on the Home screen.

**Initial screen on launch:** Home, because `initialRouteName="Home"` is set on TabNavigator.

**Right-side Drawer:** Opens from the right (hamburger icon top-right on every screen). Contains: Home, Notes, Profile, Settings. Drawer items navigate using:
```js
navigation.navigate('MainTabs', { screen: 'Home', params: { screen: item.screen } });
```

**Hamburger placement:** Every screen's header has the hamburger menu icon on the right side. The Projects list also has a `+` button to the left of the hamburger.

**Back navigation:** All nested screens within stacks get native back arrows automatically from the native stack navigator. Notes uses a custom header with a manual back arrow.

### Navigation Files

| File | Purpose |
|---|---|
| `src/navigation/DrawerNavigator.js` | Root drawer wrapper, custom drawer content with logo + brand header |
| `src/navigation/TabNavigator.js` | Bottom 4-tab navigator, Home hidden as initial route |
| `src/navigation/HomeStack.js` | Home + Notes + Profile + Settings stack |
| `src/navigation/ProjectsStack.js` | Projects list + New/Edit/Workspace/ColorWheel stack |
| `src/navigation/ColorStack.js` | Standalone Color Wheel accessible from Colors tab |

---

## 5. Screens — Detailed Reference

### 5.1 Home Screen (`src/screens/HomeScreen.js`)

The dashboard. Shows:

1. **Welcome header** — "Welcome, Sarah!" (hardcoded for V1)
2. **Donut Chart** — Custom SVG built with `react-native-svg`. Shows project stats broken into 4 segments:
   - Quilts Active (Deep Plum)
   - Quilts Done (`#7C3ABF`)
   - Bags Active (Mint)
   - Bags Done (`#4aad85`)
   - Center label shows UFO count (unfinished objects)
   - **Quilted texture overlay:** Each segment has a diamond stitch `<Pattern>` (`id="quiltStitch"`) overlaid via `fill="url(#quiltStitch)"` — gives the chart a fabric/quilted visual texture
   - The donut uses a custom `sectorPath()` function that builds filled annular arc paths (not stroked arcs)
3. **Recent Projects** — 3 hardcoded dummy cards for V1 (Garden Wedding Quilt, Farmers Market Tote, Patchwork Throw)
4. **Continue Your Project card** — Quick-launch card for the last active project (dummy data V1)

**V1 limitation:** All Home screen data is dummy/static. Real data from AsyncStorage is not yet wired into the Home screen — it uses `STATS`, `RECENT_PROJECTS`, and `CONTINUE_PROJECT` constants. This is the primary V2 upgrade needed on the Home screen.

---

### 5.2 Projects Screen (`src/screens/ProjectsScreen.js`)

Lists all saved projects from AsyncStorage. Each project card shows:
- Name, type badge (Quilt / Bag), stage, progress bar, progress %

Tapping a project navigates to `ProjectWorkspace`.

---

### 5.3 New Project Screen (`src/screens/NewProjectScreen.js`)

Full project creation form. Flow:
1. User picks **Quilt** or **Bag** (toggle buttons)
2. Type-specific fields appear

**Quilt fields:**
- Project Name, Description
- Pattern Name
- Project Size (dropdown — 13 options: Accessory, Baby, Crib, Custom, Double, King, Large Throw, Place Mat, Queen, Small Throw, Table Runner, Twin, Wall Hanging; Custom triggers a free-text field)
- Piecing Technique (dropdown — 9 options: Applique, Collage, Curves, EPP, FPP, Hand Embroidery, Hand Pieced, Machine Embroidery, Quilt as You Go)
- Quilting Style (dropdown — 9 options: Domestic, FMQ, Hand Quilted, Longarm, Longarm Custom, Longarm FMQ, Other, Straight Line, Tied)
- Quilted By
- Fabrics Used (multiline)

**Bag fields:**
- Project Name, Description
- Pattern Name
- Bag Style (dropdown — 13 options: Backpack, Catch All Caddy, Cinch Bag, Custom, Ditty Bag, Lunch Box, Pouch, Project Bag, Purse, Tablet Bag, Tote, Travel Bag, Wallet; Custom triggers free-text)
- Dimensions
- Supply List (multiline)

**Shared footer fields (both types):**
- Made For, Made By, Date Started, Date Completed, Tags, Notes

**On save:** Project is created with full stage list pre-populated (11 stages for quilts, 9 for bags), `currentStageIndex: 0`, `progress: 0`, and 3 default to-do items (Label, Photograph, Share). Saved via `addProject()` to AsyncStorage.

**Dropdown component:** `DropdownPicker` — a custom reusable component inline in this file. Opens a slide-up Modal sheet with a FlatList of options. Selected item gets a checkmark and Deep Plum bold text.

---

### 5.4 Project Workspace Screen (`src/screens/ProjectWorkspaceScreen.js`)

The in-flight project management view. Opens by tapping any project in the Projects list.

**Sections:**
1. **Header card** — Project name, current stage, progress bar, type badge, % complete. Edit (pencil) icon in the navigation header opens EditProject.

2. **Stage Tracker** — Scrollable list of all stages for the project type. States:
   - Done (checkmark icon, muted/strikethrough, `#4EC9A0` icon bg)
   - Current (filled dot, purple bg on row, "Current" pill badge, `#5B2D8E` icon bg)
   - Upcoming (number, neutral)
   - Tapping any stage sets it as current, recalculates progress percentage, auto-saves to AsyncStorage.

3. **To-Do Checklist** — 3 default items (Label, Photograph, Share) plus any custom items added by the user. Custom items have an × remove button. Progress counter "X/Y done" shown in section header. Changes auto-save to AsyncStorage.

4. **Saved Palettes** — List of color palettes saved from the Color Wheel. Each palette card shows the color swatches, palette type, and anchor hex. Actions: "Resume Edit" (opens Color Wheel with palette pre-loaded), "Remove" (confirmation alert then deletes).

**Auto-save behavior:** All interactions (stage advance, todo toggle, todo add/remove) immediately call `updateProject()` — no save button.

---

### 5.5 Edit Project Screen (`src/screens/EditProjectScreen.js`)

Edit all fields of an existing project. Same form structure as New Project. Also includes a Stage Tracker component so users can manually reposition their stage during editing. Saves via `updateProject(project.id, changes)`.

---

### 5.6 Stash Screen (`src/screens/StashScreen.js`)

Supply and material inventory tracker.

**Current state (V1 shell):** The screen is fully designed with a category grid and FAB, but item CRUD (adding/editing/deleting individual stash items) is not yet built. The category picker modal opens on FAB tap but tapping a category closes the sheet without creating anything.

**Categories (10):**
| Category | Icon | Color |
|---|---|---|
| Fabric | layers-outline | Deep Plum |
| Thread | ellipse-outline | `#7C3ABF` |
| Zippers | git-commit-outline | Mint |
| Rulers | resize-outline | `#4aad85` |
| Interfacing | duplicate-outline | `#a78bfa` |
| Batting | cloud-outline | `#60a5fa` |
| Notions | construct-outline | `#f59e0b` |
| Hardware | settings-outline | `#f87171` |
| Patterns | document-text-outline | `#34d399` |
| Other | add-circle-outline | `#9ca3af` |

**Summary row:** Shows "Total Items" and "Categories used" counts — currently both 0 until item storage is wired up.

**V2 priority:** Build out the full stash item form — quantity, color/description, purchase date, supplier, photo. Wire items into AsyncStorage.

---

### 5.7 Color Wheel Screen (`src/screens/ColorWheelScreen.js`)

The Color Wheel Intelligence feature. A full color palette builder with quilt-specific intelligence.

**Modes:**
- **New palette:** Drag the wheel to pick an anchor color → generates a palette → save to a project.
- **Resume editing:** Launched from Project Workspace "Resume Edit" button. Pre-loads existing palette colors. Has "Update palette" and "Discard changes" buttons instead of a single save. Can also "Save as a new palette instead."

**Components:**
1. **Anchor color card** — Shows the currently selected base color (hex swatch, color name, hex value)
2. **ColorWheelPicker SVG** — Interactive 248px circular color wheel. Dragging sets the anchor hue/saturation.
3. **Palette Type Selector** — 4 harmony types (see below)
4. **Palette Strip** — Row of 4–5 color swatches. Tap to lock/unlock a color. Locked colors have a lock icon and are not regenerated on Re-stitch.
5. **Re-stitch Button** — Regenerates all unlocked colors while keeping locked ones. The core "intelligent shuffle" interaction.
6. **Quilt Block Previews** — SVG previews of 3 classic quilt blocks with the current palette applied: Carpenter's Star, Ohio Star, Half-Square Triangles.
7. **Save Palette Sheet** — Slide-up modal to name the palette and choose which project to save it to.

**Palette harmony types (`src/utils/colorHarmony.js`):**

| Type ID | Label | Colors | Description |
|---|---|---|---|
| `tone` | Tone on Tone | 5 | Same hue, lighter to darker — classic quilting |
| `sisters` | Fabric Sisters | 5 | Analogous — neighboring hues on the wheel |
| `contrast` | Bold Contrast | 4 | Complementary — directly opposite on the wheel |
| `trio` | Lively Trio | 5 | Triadic — 3 evenly spaced hues |

**AI Palette Advisor (built, not yet surfaced in UI):** `src/utils/colorHarmony.js` exports `fetchPaletteAdvice()` which calls the Anthropic Claude API (`claude-sonnet-4-6`) to generate 3 warm, plain-language tips for using the palette in a quilt. The API key is expected from `app.json` extra config → `Constants.expoConfig.extra.anthropicApiKey`. This feature is code-complete but the UI entry point has not been added to `ColorWheelScreen.js` yet — this is a V2 UI task.

---

### 5.8 Notes Screen (`src/screens/NotesScreen.js`)

Quick-capture sticky note list. Accessible via the right-side drawer under "Notes."

**Features:**
- Search bar (toggles in the header — replaces title with text input)
- Search filters by note text or associated project name
- Swipe left to delete (uses `react-native-gesture-handler` Swipeable)
- FAB to create new note (opens `NoteCreateSheet`)
- Animated toast notifications ("Note saved ✓", "Note deleted")
- Empty state with contextual copy (different for empty vs. no search results)

**Storage:** `src/storage/notes.js` — `loadNotes()`, `addNote()`, `deleteNote()` using AsyncStorage key `nimble_needle_notes`. Notes are stored most-recent-first.

**Note data shape:**
```js
{
  id: string,        // timestamp-based
  text: string,      // main note content
  projectName?: string,  // optional associated project
  color?: string,    // card accent color
  createdAt: string, // ISO timestamp
}
```

---

### 5.9 Discover Screen (`src/screens/DiscoverScreen.js`)

Placeholder screen for a future content/inspiration feed. Not yet built out.

---

### 5.10 Profile Screen (`src/screens/ProfileScreen.js`)

Basic profile screen. Not yet fully built out — accessible from the drawer.

---

### 5.11 Settings Screen (`src/screens/SettingsScreen.js`)

App settings. Not yet fully built out — accessible from the drawer.

---

## 6. Data Storage

All persistence is local device storage via `@react-native-async-storage/async-storage`.

### Storage Keys
| Key | Content |
|---|---|
| `nimble_needle_projects` | Array of all project objects |
| `nimble_needle_notes` | Array of all note objects |

### Project Data Shape
```js
{
  id: string,                  // Date.now().toString()
  type: 'Quilt' | 'Bag',
  name: string,
  description: string,
  progress: number,            // 0.0 – 1.0
  stage: string,               // current stage label
  stages: string[],            // full ordered stage list
  currentStageIndex: number,
  createdAt: string,           // ISO timestamp
  madeFor: string,
  madeBy: string,
  dateStarted: string,
  dateCompleted: string,
  notes: string,
  tags: string,
  palettes: Palette[],         // saved color palettes
  todos: Todo[],               // [{ label: string, done: boolean }]

  // Quilt only:
  patternName: string,
  size: string,
  piecingTechnique: string,
  quiltingStyle: string,
  quiltedBy: string,
  fabricsUsed: string,

  // Bag only:
  patternName: string,
  bagStyle: string,
  dimensions: string,
  supplyList: string,
}
```

### Palette Data Shape (nested inside project)
```js
{
  id: string,
  name: string,
  type: string,        // 'Tone on Tone' | 'Fabric Sisters' | 'Bold Contrast' | 'Lively Trio'
  colors: string[],    // array of hex strings
  anchorHex: string,
  savedAt: string,     // ISO timestamp
  updatedAt?: string,
}
```

### Storage Utility Functions (`src/storage/projects.js`)
| Function | Purpose |
|---|---|
| `loadProjects()` | Fetch all projects |
| `saveProjects(projects)` | Overwrite all projects |
| `addProject(project)` | Append a new project |
| `updateProject(projectId, changes)` | Merge changes into one project |
| `savePaletteToProject(projectId, palette)` | Append a palette to a project |
| `updatePaletteInProject(projectId, paletteId, changes)` | Update one palette |
| `removePaletteFromProject(projectId, paletteId)` | Delete one palette |

---

## 7. Build & Distribution

### EAS Configuration (`eas.json`)
```json
"preview": {
  "distribution": "internal",
  "android": { "buildType": "apk" }
}
```

### Build Command
```bash
eas build --platform android --profile preview --non-interactive
```

### Important EAS Lessons Learned
1. **Always commit before building.** EAS uses fingerprinting to detect duplicate builds. If you haven't committed, EAS may cancel the build as a duplicate of a previous one.
2. **`expo-dev-client` was removed from `app.json` plugins.** It caused EAS to serve a stale JS bundle from a previous build, making new code changes invisible. It remains in `package.json` as a dependency but must NOT be in the plugins array.
3. **Version bumping:** When any EAS build behavior seems stale, bump `version` in `app.json` and `versionCode` in `android` section to force a fresh build.
4. **Current version:** `1.1.0`, versionCode `2`.

### Assets
- `assets/logo.png` — The N2 logo (copied from `N2Logo.png`). Used in the drawer header.
- `assets/icon.png` — App icon
- `assets/adaptive-icon.png` — Android adaptive icon
- `assets/splash-icon.png` — Splash screen image

---

## 8. Feature Completion Status

### Fully Built ✅
| Feature | What's done |
|---|---|
| Home dashboard | Donut chart with quilted texture, recent projects (dummy data), UFO count, Continue card |
| Project list | AsyncStorage-backed list, project cards with progress |
| New Project form | Full Quilt + Bag forms per spec, all dropdowns, all fields |
| Edit Project | Same form fields + stage repositioning |
| Project Workspace | Stage tracker (auto-save), To-Do checklist (auto-save), Saved palettes |
| Color Wheel | Interactive SVG wheel, 4 harmony types, lock/Re-stitch, quilt block previews, save to project |
| Nimble Notes | Search, swipe-to-delete, FAB create, animated toasts |
| Stash categories | 10-category grid layout, FAB picker modal |
| Navigation | Home launches on open, bottom tab bar visible everywhere, right-side drawer |
| Drawer | Logo, brand header, Home/Notes/Profile/Settings items |
| Design system | Full color token system, consistent card/shadow/header patterns |
| EAS builds | Preview APK distribution via `nimbleneedle` EAS account |

### Shell / Placeholder 🟡 (built but not fully functional)
| Feature | Status |
|---|---|
| Stash item CRUD | Grid and FAB designed; individual item add/edit/delete not wired |
| Home live data | Uses dummy data; not yet reading from AsyncStorage |
| Discover screen | Empty placeholder |
| Profile screen | Basic screen, not built out |
| Settings screen | Basic screen, not built out |
| AI Palette Advisor | Logic complete in `colorHarmony.js`; no UI entry point yet |

### Not Yet Started 🔴
| Feature | Notes |
|---|---|
| iOS build & App Store submission | Architecture ready, needs Xcode/Apple account setup |
| Cloud sync / Firebase | Firebase SDK added; no read/write implemented |
| Photo uploads | `expo-image-picker` and `expo-camera` installed; not wired to any screen |
| User authentication | Not started |
| Sharing / export | Not started |
| Notifications / reminders | Not started |
| Home screen live data | Wire donut chart and recent projects to real AsyncStorage data |

---

## 9. Quilt Stage Lists (Reference)

### Quilt Stages (11 stages)
1. Started
2. Fabric chosen & purchased
3. Pieces cut
4. Blocks made
5. Rows assembled
6. Quilt top done
7. Backing ready
8. Binding made
9. Quilted
10. Quilt bound
11. Completed

### Bag Stages (9 stages)
1. Gather Materials
2. Cut and Interface
3. Build Interior Pockets
4. Install Zippers
5. Attach Hardware
6. Assemble Shells
7. Attach Straps
8. Final Assembly
9. Completed

---

## 10. Color Wheel Intelligence — Technical Detail

The Color Wheel feature is the most complex part of the app. Here is how the pieces connect:

### Files
| File | Role |
|---|---|
| `src/screens/ColorWheelScreen.js` | Main screen — orchestrates everything |
| `src/hooks/useColorWheel.js` | State + logic for the wheel position (anchor H/S/L/hex/name) |
| `src/hooks/usePalette.js` | State + logic for palette (colors, locks, type, re-stitch, change flags) |
| `src/components/ColorWheelPicker.js` | SVG interactive wheel component |
| `src/components/PaletteStrip.js` | Row of color swatches with lock toggles |
| `src/components/ReStitchButton.js` | Re-stitch button + PaletteTypeSelector |
| `src/components/QuiltBlockSVG.js` | SVG quilt block previews |
| `src/components/SavePaletteSheet.js` | Slide-up sheet for naming and saving a palette |
| `src/utils/colorHarmony.js` | Palette generation algorithms + Anthropic AI advisor |
| `src/utils/colorUtils.js` | Color math helpers (HSL↔hex conversion, etc.) |
| `src/utils/quiltBlocks.js` | Quilt block metadata (3 blocks: Carpenter's Star, Ohio Star, HST) |

### Re-stitch Logic
`reStitch(typeId, h, s, l, locks, current)` in `colorHarmony.js`:
- Calls `generatePalette()` with locks array
- For each position: if locked AND current color exists, keep it; otherwise generate new
- Returns `{ colors, changedFlags }` — changedFlags is used to animate the new swatches in PaletteStrip

### Palette Generation Algorithm
Each harmony type has a base generator function that takes `(h, s, l)` and returns an array of `[h, s, l]` triplets. Wide randomized ranges are intentional — every Re-stitch produces meaningfully different results. The generators:
- `toneBase` — varies lightness/saturation within same hue
- `sistersBase` — shifts hue ±28–50° with small lightness variation
- `contrastBase` — mixes anchor and complementary (h+180) with light/deep variants
- `trioBase` — three hues spaced ~120° apart, each with a light variant

---

## 11. Known Issues / Watch-outs for Next Developer

1. **Home screen dummy data.** `HomeScreen.js` uses hardcoded `STATS`, `RECENT_PROJECTS`, and `CONTINUE_PROJECT` constants. The V2 priority is wiring these to real AsyncStorage reads with a `useFocusEffect` to refresh on tab focus.

2. **Stash items not persisted.** `StashScreen.js` has `const [items] = useState([])` — items array never grows. The category picker modal closes on selection without creating anything. Full item form + CRUD is the next Stash feature.

3. **Tab bar hidden Home tab — must stay in TabNavigator.** Home must remain as a tab screen (even if hidden) to get the tab bar rendered on the Home stack screens. If Home is moved to the DrawerNavigator instead, it loses the bottom tab bar. The `tabBarItemStyle: { display: 'none' }` + `tabBarButton: () => null` combination is what hides it without removing it from the navigator.

4. **`expo-dev-client` in package.json vs. plugins.** The package is installed but NOT listed in `app.json` plugins. Adding it back to plugins will cause EAS to serve stale JS bundles. Leave it out of plugins.

5. **AI Advisor needs a UI.** `fetchPaletteAdvice()` in `colorHarmony.js` is complete and tested but has no button/entry point in `ColorWheelScreen.js`. Requires an Anthropic API key in `app.json` extra config.

6. **Firebase not reading/writing.** `@react-native-firebase/app` is initialized via the `google-services.json` plugin in `app.json`, but no Firestore/Realtime DB reads or writes exist anywhere in the app yet. Firebase is ready to be used but currently idle.

7. **Dates are free-text strings.** Date Started and Date Completed fields are plain `TextInput` — no date picker. A future improvement would replace these with a native date picker component.

8. **No user authentication.** The app runs fully offline with no login. All data belongs to whoever is using the device. Auth + cloud sync is a future phase.

---

## 12. Repository & Git History

| Commit | Description |
|---|---|
| `ae3ab83` | Fix Home navigation: restore bottom tab bar and launch on Home screen |
| `9367a27` | Fix tab spacing, Notes padding, quilted donut chart, right drawer |
| `eff3185` | Nav polish, right-side drawer, stage+todo in workspace |
| `ded4ee5` | Header fixes, logo, Stash categories, full project forms per spec |
| `3f2d06a` | Fix nav structure, UFO centering, and bottom tab visibility |
| `21495fd` | Bump version to 1.1.0, remove expo-dev-client from build plugins |
| `f7441ff` | Add Edit Project feature |
| `fefd316` | Add Nimble Notes, nav redesign, Color Wheel header, Home screen |
| `d15bd0b` | Fix Android build — add expo-font peer dependency |
| `be7da0a` | Add Color Wheel Intelligence feature |
| `1c26f7f` | Configure EAS internal distribution for preview builds |
| `23d6c57` | Add EAS project config and protect Firebase credentials |
| `659b28f` | Added project list screen and new project form |
| `fb5d51e` | Initial commit |

---

## 13. Running the Project Locally

```bash
# Install dependencies
npm install

# Start Expo dev server
npx expo start

# Build an Android APK for internal testing
eas build --platform android --profile preview --non-interactive
```

**Prerequisites:**
- Node.js 18+
- EAS CLI: `npm install -g eas-cli`
- Logged into EAS: `eas login` (use `nimbleneedle` account)
- `google-services.json` must be present in the project root (not committed — contains Firebase credentials)

---

## 14. Suggested V2 Priorities

Based on what is built and what is missing, the recommended next development priorities are:

1. **Home screen live data** — Wire `HomeScreen.js` to real project counts from AsyncStorage. Remove hardcoded dummy data.
2. **Stash item CRUD** — Build the add/edit/delete flow for individual stash items. Form fields: category, name, quantity, color, supplier, notes, photo.
3. **AI Palette Advisor UI** — Add a "Get advice" button to `ColorWheelScreen.js` that calls `fetchPaletteAdvice()` and shows the 3 tips in a card below the palette.
4. **Date pickers** — Replace free-text date fields with a native date picker.
5. **Photo support** — `expo-image-picker` is already installed. Wire project photos to the workspace (cover image on project card).
6. **Firebase cloud sync** — Once auth is decided, migrate AsyncStorage reads/writes to Firestore so data persists across devices.
7. **iOS build** — Submit to App Store via EAS.
8. **Discover screen** — Pattern inspiration feed, maker community content, or curated quilt block library.
