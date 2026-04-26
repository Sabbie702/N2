# N2 — Nimble Needle
## Claude Code Implementation Brief: Color Wheel Intelligence (Feature 3)
### Also known as: Swatch Stash

---

## What You Are Building

The Color Wheel Intelligence feature (internally: "Swatch Stash") for N2 — a React Native / Expo app for quilters and bag makers.

This feature lets users:
1. Select a fabric color from 5 different entry points (see below)
2. Extract colors from a fabric photo using on-device k-means (no external API)
3. Receive 5 harmony group suggestions in quilter-native language
4. See matching real fabric colors from brand libraries (Kona Cotton, Bella Solids, etc.)
5. Save a palette to a project

---

## N2 Brand Standards — NEVER DEVIATE FROM THESE

```js
const N2_COLORS = {
  deepPlum:     '#5B2D8E',   // Primary — headers, active states
  midnight:     '#2D1B4E',   // Dark backgrounds, nav bar
  mint:         '#4EC9A0',   // Accent — CTAs, active states, checkmarks
  softLavender: '#C084FC',   // Secondary accent
  lavWhite:     '#F5F0FA',   // Page backgrounds
  white:        '#FFFFFF',   // Card backgrounds
  darkText:     '#1A1A2E',   // Body text
  midGray:      '#6B6B8A',   // Subtitle / hint text
  lightBorder:  '#DDD6F0',   // Dividers, card borders
  amber:        '#F59E0B',   // UFO state (do not use for color wheel)
};
```

- Header bars: `midnight` background, `white` title, `mint` subtitle
- Cards: `white` background, `lightBorder` border (0.5px), `border-radius: 14`
- Active/selected states: `mint` accent
- Page backgrounds: `lavWhite`
- All primary actions: `deepPlum` button with `white` text
- Font sizes: 20px screen title, 16px card title, 13px body, 11px caption
- No gradients. No drop shadows (except very subtle `elevation: 2` on cards).

---

## File Structure to Create

```
src/
├── data/
│   └── fabricColors.js          ← Brand color library (provided — do not modify)
├── utils/
│   ├── colorHarmony.js          ← Harmony engine (provided — do not modify)
│   └── kMeansExtractor.js       ← On-device color extraction (provided — do not modify)
├── components/
│   └── colorwheel/
│       ├── HarmonyTypeCard.jsx  ← Collapsible card for one harmony type
│       ├── FabricMatchChip.jsx  ← Individual fabric color chip + name
│       ├── ColorWheelDial.jsx   ← Interactive HSL color wheel picker
│       ├── SwatchGrid.jsx       ← Grid of brand colors to browse
│       ├── ExtractedPalette.jsx ← Post-photo: "pick your color" UI
│       └── SavePaletteModal.jsx ← Save palette to project sheet
├── screens/
│   └── colorwheel/
│       ├── ColorWheelScreen.jsx      ← Main entry / tab screen
│       ├── HarmonyResultsScreen.jsx  ← Full harmony results
│       └── PhotoExtractScreen.jsx    ← Camera / photo flow
└── navigation/
    └── ColorWheelNavigator.jsx  ← Stack navigator for this feature
```

---

## The 5 Entry Points

Every entry point eventually reaches `HarmonyResultsScreen` with a `sourceHex` param.

### Entry 1 — From My Stash (most common)
- In the existing Fabric Stash screen, add a color wheel icon button to each fabric card
- On tap: navigate to `HarmonyResultsScreen` with `{ sourceHex: fabric.hex, sourceName: fabric.name, sourceType: 'stash' }`
- The hex is already stored on the fabric record — no extraction needed

### Entry 2 — Free Spin the Wheel
- `ColorWheelScreen` default tab: shows `ColorWheelDial` component
- User drags on the wheel to select any color
- Live preview updates harmony groups as they drag
- "Find Harmonies" button navigates to `HarmonyResultsScreen`

### Entry 3 — Browse Swatch Stash (brand color cards)
- Second tab on `ColorWheelScreen`: shows `SwatchGrid` component
- Brand selector at top (Kona Cotton, Bella Solids, Pure Elements, Confetti Cottons)
- Colors organized by family (Whites, Reds, Blues, etc.)
- Tap any named color → navigate to `HarmonyResultsScreen`

### Entry 4 — Photograph Fabric
- Camera icon in header of `ColorWheelScreen`
- Opens `PhotoExtractScreen`
- User takes photo or picks from camera roll
- `kMeansExtractor.js` runs on-device, returns 3–5 hex colors
- `ExtractedPalette` component asks: "Which color do you want to build around?"
- User taps one → navigate to `HarmonyResultsScreen`

### Entry 5 — From a Project
- In existing Project Detail screen, add color wheel icon next to each fabric listed
- Same navigation as Entry 1

---

## Harmony Types (quilter-native naming — DO NOT change these names)

```js
const HARMONY_TYPES = {
  tone_on_tone:   { label: 'Tone on Tone',   icon: '🌊', technical: 'Monochromatic' },
  fabric_sisters: { label: 'Fabric Sisters',  icon: '🌸', technical: 'Analogous'     },
  bold_contrast:  { label: 'Bold Contrast',   icon: '⚡', technical: 'Complementary' },
  lively_trio:    { label: 'Lively Trio',     icon: '✨', technical: 'Triadic'       },
  split_contrast: { label: 'Split Contrast',  icon: '🎨', technical: 'Split Comp.'  },
};
```

---

## HarmonyResultsScreen — Layout Spec

```
┌─────────────────────────────────────────────┐
│  ← Back        Color Wheel Intelligence      │  ← midnight header
├─────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐   │
│  │  [COLOR SWATCH 72×72]  Name          │   │  ← white source card
│  │                        Kona Cotton   │   │
│  │                        #5B2D8E       │   │
│  │                        Desc text     │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  BRAND FILTER                               │  ← 11px label
│  [All Brands] [Kona] [Bella] [AGF] [Riley]  │  ← horizontal scroll chips
│                                             │
│  YOUR HARMONY GROUPS              5 found   │
│  ┌──────────────────────────────────────┐   │
│  │  🌊  Tone on Tone      ●●●●  ▼       │   │  ← HarmonyTypeCard collapsed
│  │  Same color family, different depths │   │
│  └──────────────────────────────────────┘   │
│  ┌──────────────────────────────────────┐   │
│  │  ⚡  Bold Contrast      ●●●●  ▲       │   │  ← expanded
│  │  Opposite on the wheel               │   │
│  │  ┌──────────────────────────────┐    │   │
│  │  │  Source color →              │    │   │
│  │  │  [chip][chip][chip]          │    │   │
│  │  │  Complement →                │    │   │
│  │  │  [chip][chip][chip]          │    │   │
│  │  └──────────────────────────────┘    │   │
│  └──────────────────────────────────────┘   │
│  ... (3 more harmony cards)                 │
│                                             │
│  [  Save Palette to Project  ]              │  ← deepPlum button
└─────────────────────────────────────────────┘
```

---

## ColorWheelDial — Implementation Notes

- Use a circular `PanGestureHandler` (from `react-native-gesture-handler`)
- The wheel is an SVG circle rendered with `react-native-svg`
- Fill the circle with HSL hue segments (360 thin slices)
- Inner ring shows saturation (white center → full saturation at edge)
- A draggable white circle indicator shows current selection
- Current selected color shown as large swatch below the wheel
- Harmony preview strip (5 small chips) updates live as user drags

SVG wheel generation:
```js
// Generate 360 hue slices as SVG path wedges
const slices = Array.from({ length: 360 }, (_, i) => ({
  hue: i,
  startAngle: i,
  endAngle: i + 1,
  color: `hsl(${i}, 80%, 55%)`,
}));
```

---

## PhotoExtractScreen — Implementation Notes

Use `expo-image-picker` for camera/gallery access:
```js
import * as ImagePicker from 'expo-image-picker';

const result = await ImagePicker.launchCameraAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  quality: 0.5,          // Lower res = faster k-means
  allowsEditing: true,
  aspect: [1, 1],        // Square crop — fabric photos work best square
});
```

Use `expo-image-manipulator` to resize before pixel sampling:
```js
import * as ImageManipulator from 'expo-image-manipulator';

const resized = await ImageManipulator.manipulateAsync(
  result.assets[0].uri,
  [{ resize: { width: 100 } }],   // 100×100 = 10,000 pixels = fast k-means
  { format: ImageManipulator.SaveFormat.JPEG }
);
```

Then pass `resized.uri` to `kMeansExtractor.extractColors(uri, 5)`.

---

## SavePaletteModal — Behaviour

- Bottom sheet modal (use `@gorhom/bottom-sheet`)
- Shows the 5 harmony types as a scrollable list
- User selects which harmony types to save (multi-select)
- Project picker (uses existing N2 project list)
- "Save to [Project Name]" button
- Palette stored as: `{ id, name, sourceHex, sourceName, harmonies[], projectId, createdAt }`

---

## Navigation params

```js
// Navigate to harmony results from anywhere:
navigation.navigate('HarmonyResults', {
  sourceHex:    '#5B2D8E',          // required
  sourceName:   'Kona Plum',        // optional — shown in source card
  sourceType:   'stash',            // 'stash' | 'wheel' | 'brand' | 'photo' | 'project'
  brandId:      'kona',             // optional — pre-filters brand chips
});
```

---

## Dependencies Required

Add to `package.json` if not already present:
```json
{
  "expo-image-picker": "~15.0.0",
  "expo-image-manipulator": "~12.0.0",
  "react-native-svg": "15.2.0",
  "react-native-gesture-handler": "~2.16.0",
  "@gorhom/bottom-sheet": "^4.6.0"
}
```

Run: `npx expo install expo-image-picker expo-image-manipulator react-native-svg react-native-gesture-handler @gorhom/bottom-sheet`

---

## Disclaimer Text (must appear on HarmonyResultsScreen)

```
Digital color representations are approximate. 
Always compare physical swatches before purchasing fabric.
```
Show as small italic gray text at bottom of results screen.

---

## What NOT to Do

- ❌ Do NOT use Imagga API or any external color extraction service
- ❌ Do NOT add emotion scoring (patent risk — see project docs)
- ❌ Do NOT use a calibrated reference color chart in the photo flow (patent risk)
- ❌ Do NOT change the harmony type names (Tone on Tone, Fabric Sisters, etc.)
- ❌ Do NOT use N2 amber color for anything in this feature (amber = UFO state only)
- ❌ Do NOT add a "Color Catalog" label anywhere — the feature is called "Swatch Stash"
