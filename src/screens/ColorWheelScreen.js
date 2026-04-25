// src/screens/ColorWheelScreen.js
// N2 — Color Companion (redesigned)
// 6-step wizard: Entry → Color → Palettes → Refine → Preview → Save

import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { loadProjects, savePaletteToProject, updatePaletteInProject } from '../storage/projects';
import COLORS from '../styles/colors';

// ─── Brand tokens ──────────────────────────────────────────────────────────────
const N2 = {
  plum:   '#5B2D8E',
  night:  '#2D1B4E',
  mint:   '#4EC9A0',
  lav:    '#C084FC',
  bg:     '#F5F0FA',
  cream:  '#FFF8EA',
  mu:     '#475569',
  border: '#E2E8F0',
};

// ─── Static data ───────────────────────────────────────────────────────────────
const BASE_COLORS = [
  { name: 'Plum',     hex: '#5B2D8E' },
  { name: 'Berry',    hex: '#8E2D63' },
  { name: 'Teal',     hex: '#2D8E86' },
  { name: 'Sage',     hex: '#8EA36A' },
  { name: 'Gold',     hex: '#C99A3A' },
  { name: 'Coral',    hex: '#D96F5F' },
  { name: 'Navy',     hex: '#2D3A8E' },
  { name: 'Lavender', hex: '#C084FC' },
];

const PALETTES = {
  Plum: [
    { id: 'comp',  type: 'Complementary',      label: 'Bold Contrast',  note: 'Strong color separation for modern quilt designs.',                      colors: ['#5B2D8E','#8EA36A','#6F7F45','#FFF8EA','#3F4F2E'] },
    { id: 'ana',   type: 'Analogous',           label: 'Soft Blend',     note: 'Smooth color movement with a gentle blended look.',                      colors: ['#5B2D8E','#6F3AA8','#8E2D76','#B77DC7','#E7D2F2'] },
    { id: 'split', type: 'Split Complementary', label: 'Balanced Pop',   note: 'A balanced palette with contrast that still feels quilt-friendly.',      colors: ['#5B2D8E','#C99A3A','#8EA36A','#FFF8EA','#B69B76'] },
    { id: 'tri',   type: 'Triadic',             label: 'Playful Energy', note: 'A lively palette with colorful movement across the quilt.',              colors: ['#5B2D8E','#2D8E86','#D96F5F','#F3B39E','#1F6D69'] },
    { id: 'mono',  type: 'Monochromatic',       label: 'Elegant Depth',  note: 'A refined one-color family with soft value movement.',                   colors: ['#2D1B4E','#5B2D8E','#8E2D63','#C084FC','#F1D9F5'] },
  ],
  Berry: [
    { id: 'comp',  type: 'Complementary',      label: 'Bold Contrast',  note: 'Strong color separation for modern quilt designs.',                      colors: ['#8E2D63','#2D8E5B','#1F6F45','#FFF8EA','#B3D9C4'] },
    { id: 'ana',   type: 'Analogous',           label: 'Soft Blend',     note: 'Smooth color movement with a gentle blended look.',                      colors: ['#8E2D63','#8E2D8E','#6A1F5B','#C07AAA','#EDCFE0'] },
    { id: 'split', type: 'Split Complementary', label: 'Balanced Pop',   note: 'A balanced palette with contrast that still feels quilt-friendly.',      colors: ['#8E2D63','#3A8E2D','#2D8E6A','#FFF8EA','#A8D4A0'] },
    { id: 'tri',   type: 'Triadic',             label: 'Playful Energy', note: 'A lively palette with colorful movement across the quilt.',              colors: ['#8E2D63','#2D638E','#8E8E2D','#F0D05C','#85B8D4'] },
    { id: 'mono',  type: 'Monochromatic',       label: 'Elegant Depth',  note: 'A refined one-color family with soft value movement.',                   colors: ['#4E1737','#8E2D63','#C05090','#E8A0C8','#F9E0EE'] },
  ],
  Teal: [
    { id: 'comp',  type: 'Complementary',      label: 'Bold Contrast',  note: 'Strong color separation for modern quilt designs.',                      colors: ['#2D8E86','#8E352D','#6F221A','#FFF8EA','#D4948F'] },
    { id: 'ana',   type: 'Analogous',           label: 'Soft Blend',     note: 'Smooth color movement with a gentle blended look.',                      colors: ['#2D8E86','#2D8E5A','#2D6A8E','#7DC4BE','#D2EDEB'] },
    { id: 'split', type: 'Split Complementary', label: 'Balanced Pop',   note: 'A balanced palette with contrast that still feels quilt-friendly.',      colors: ['#2D8E86','#8E6A2D','#8E2D55','#FFF8EA','#C49870'] },
    { id: 'tri',   type: 'Triadic',             label: 'Playful Energy', note: 'A lively palette with colorful movement across the quilt.',              colors: ['#2D8E86','#862D8E','#8E862D','#F0D870','#C880E8'] },
    { id: 'mono',  type: 'Monochromatic',       label: 'Elegant Depth',  note: 'A refined one-color family with soft value movement.',                   colors: ['#1A4E4B','#2D8E86','#45C0B8','#90DEDA','#D8F5F3'] },
  ],
  Sage: [
    { id: 'comp',  type: 'Complementary',      label: 'Bold Contrast',  note: 'Strong color separation for modern quilt designs.',                      colors: ['#8EA36A','#7A6AA3','#5B4E8A','#FFF8EA','#BDB5D4'] },
    { id: 'ana',   type: 'Analogous',           label: 'Soft Blend',     note: 'Smooth color movement with a gentle blended look.',                      colors: ['#8EA36A','#A3A36A','#6A8E6A','#B8CCA0','#E4EDD8'] },
    { id: 'split', type: 'Split Complementary', label: 'Balanced Pop',   note: 'A balanced palette with contrast that still feels quilt-friendly.',      colors: ['#8EA36A','#A36A8E','#6A6AA3','#FFF8EA','#D4B8C8'] },
    { id: 'tri',   type: 'Triadic',             label: 'Playful Energy', note: 'A lively palette with colorful movement across the quilt.',              colors: ['#8EA36A','#6A8EA3','#A36A6A','#F0C8C8','#C8E0E8'] },
    { id: 'mono',  type: 'Monochromatic',       label: 'Elegant Depth',  note: 'A refined one-color family with soft value movement.',                   colors: ['#4E5A3A','#8EA36A','#B8C890','#D4DEBC','#EEF3E4'] },
  ],
  Gold: [
    { id: 'comp',  type: 'Complementary',      label: 'Bold Contrast',  note: 'Strong color separation for modern quilt designs.',                      colors: ['#C99A3A','#3A6AC9','#2A50A0','#FFF8EA','#A0B8E8'] },
    { id: 'ana',   type: 'Analogous',           label: 'Soft Blend',     note: 'Smooth color movement with a gentle blended look.',                      colors: ['#C99A3A','#C9703A','#C9C03A','#E8C880','#F5E8C0'] },
    { id: 'split', type: 'Split Complementary', label: 'Balanced Pop',   note: 'A balanced palette with contrast that still feels quilt-friendly.',      colors: ['#C99A3A','#3A8EC9','#3AC99A','#FFF8EA','#90D4C0'] },
    { id: 'tri',   type: 'Triadic',             label: 'Playful Energy', note: 'A lively palette with colorful movement across the quilt.',              colors: ['#C99A3A','#3AC96A','#C93A6A','#F0A0C0','#A0F0B8'] },
    { id: 'mono',  type: 'Monochromatic',       label: 'Elegant Depth',  note: 'A refined one-color family with soft value movement.',                   colors: ['#7A5A1A','#C99A3A','#E8C060','#F5DC98','#FEF5DC'] },
  ],
  Coral: [
    { id: 'comp',  type: 'Complementary',      label: 'Bold Contrast',  note: 'Strong color separation for modern quilt designs.',                      colors: ['#D96F5F','#5F9DD9','#3A7EC0','#FFF8EA','#A8CAF0'] },
    { id: 'ana',   type: 'Analogous',           label: 'Soft Blend',     note: 'Smooth color movement with a gentle blended look.',                      colors: ['#D96F5F','#D9905F','#D95F80','#EEB0A8','#F8E0DC'] },
    { id: 'split', type: 'Split Complementary', label: 'Balanced Pop',   note: 'A balanced palette with contrast that still feels quilt-friendly.',      colors: ['#D96F5F','#5FD9A0','#5F9FD9','#FFF8EA','#A8EED4'] },
    { id: 'tri',   type: 'Triadic',             label: 'Playful Energy', note: 'A lively palette with colorful movement across the quilt.',              colors: ['#D96F5F','#5FD96F','#6F5FD9','#C0B0F8','#B0F0C0'] },
    { id: 'mono',  type: 'Monochromatic',       label: 'Elegant Depth',  note: 'A refined one-color family with soft value movement.',                   colors: ['#8A3028','#D96F5F','#E8A098','#F4C8C0','#FAE8E4'] },
  ],
  Navy: [
    { id: 'comp',  type: 'Complementary',      label: 'Bold Contrast',  note: 'Strong color separation for modern quilt designs.',                      colors: ['#2D3A8E','#8E7B2D','#6F5E1A','#FFF8EA','#D4C480'] },
    { id: 'ana',   type: 'Analogous',           label: 'Soft Blend',     note: 'Smooth color movement with a gentle blended look.',                      colors: ['#2D3A8E','#2D5A8E','#5A2D8E','#7A90C8','#D0D8EE'] },
    { id: 'split', type: 'Split Complementary', label: 'Balanced Pop',   note: 'A balanced palette with contrast that still feels quilt-friendly.',      colors: ['#2D3A8E','#8E5A2D','#8E2D4A','#FFF8EA','#C49880'] },
    { id: 'tri',   type: 'Triadic',             label: 'Playful Energy', note: 'A lively palette with colorful movement across the quilt.',              colors: ['#2D3A8E','#8E2D3A','#3A8E2D','#A0D890','#F09898'] },
    { id: 'mono',  type: 'Monochromatic',       label: 'Elegant Depth',  note: 'A refined one-color family with soft value movement.',                   colors: ['#161D50','#2D3A8E','#4A5EC0','#8A98D8','#D0D6F0'] },
  ],
  Lavender: [
    { id: 'comp',  type: 'Complementary',      label: 'Bold Contrast',  note: 'Strong color separation for modern quilt designs.',                      colors: ['#C084FC','#84C880','#50A850','#FFF8EA','#B8EAB0'] },
    { id: 'ana',   type: 'Analogous',           label: 'Soft Blend',     note: 'Smooth color movement with a gentle blended look.',                      colors: ['#C084FC','#8484FC','#FC84C0','#D8B8FE','#FEEBFC'] },
    { id: 'split', type: 'Split Complementary', label: 'Balanced Pop',   note: 'A balanced palette with contrast that still feels quilt-friendly.',      colors: ['#C084FC','#FCCC84','#84FCB8','#FFF8EA','#D4F8E8'] },
    { id: 'tri',   type: 'Triadic',             label: 'Playful Energy', note: 'A lively palette with colorful movement across the quilt.',              colors: ['#C084FC','#FC8484','#84FCC0','#C0FEDC','#FEC0C0'] },
    { id: 'mono',  type: 'Monochromatic',       label: 'Elegant Depth',  note: 'A refined one-color family with soft value movement.',                   colors: ['#7040A8','#C084FC','#D8A8FE','#EDD4FE','#F8F0FF'] },
  ],
};

const TONE_ADJUSTMENTS = {
  Muted:  ['#4E3370','#A47D3E','#7E8F63','#F5EEDC','#A58B72'],
  Bright: ['#6D35B0','#E6AD2E','#9EBD58','#FFF9DD','#CDA86A'],
  Earthy: ['#58316F','#B9812F','#758247','#F4E6C8','#9A7B5B'],
  Pastel: ['#A784C9','#E8C985','#BFD19A','#FFF7E8','#D8C3AA'],
  Jewel:  ['#4B197D','#C4911F','#4F7D3A','#FFF3CF','#8B5B2B'],
};

const LAYOUTS  = ['9-Patch', 'HST', 'Star', 'Strips'];
const CONTRAST = ['Low', 'Medium', 'High'];
const TONES    = ['Muted', 'Bright', 'Earthy', 'Pastel', 'Jewel'];
const MOODS    = ['Modern', 'Traditional', 'Romantic', 'Bold', 'Fall'];
const ROLE_NAMES = ['Background', 'Main Print', 'Secondary', 'Accent', 'Binding'];

// ─── Shared components ─────────────────────────────────────────────────────────

function WizardHeader({ title, subtitle, step, onBack, closeIcon = false }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.hdr, { paddingTop: insets.top + 12 }]}>
      <View style={s.hdrRow}>
        <TouchableOpacity onPress={onBack} style={s.hdrBtn} activeOpacity={0.75}>
          <Ionicons name={closeIcon ? 'close' : 'arrow-back'} size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={s.stepBadge}>Step {step} of 6</Text>
      </View>
      <Text style={s.hdrTitle}>{title}</Text>
      <Text style={s.hdrSub}>{subtitle}</Text>
    </View>
  );
}

function Card({ children, style }) {
  return <View style={[s.card, style]}>{children}</View>;
}

function PrimaryBtn({ label, onPress, loading, disabled }) {
  return (
    <TouchableOpacity
      style={[s.primaryBtn, (disabled || loading) && { opacity: 0.6 }]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.88}
    >
      {loading
        ? <ActivityIndicator color="#fff" />
        : <Text style={s.primaryBtnText}>{label}</Text>
      }
    </TouchableOpacity>
  );
}

function OutlineBtn({ label, onPress }) {
  return (
    <TouchableOpacity style={s.outlineBtn} onPress={onPress} activeOpacity={0.85}>
      <Text style={s.outlineBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

function Swatches({ colors, height = 32 }) {
  return (
    <View style={[s.swatches, { height }]}>
      {colors.map((c, i) => (
        <View key={i} style={[s.swatchCell, { backgroundColor: c }]} />
      ))}
    </View>
  );
}

function PillGroup({ title, options, value, onChange }) {
  return (
    <View>
      <Text style={s.pillTitle}>{title}</Text>
      <View style={s.pillRow}>
        {options.map(opt => {
          const active = opt === value;
          return (
            <TouchableOpacity
              key={opt}
              onPress={() => onChange(opt)}
              activeOpacity={0.8}
              style={[s.pill, active && s.pillActive]}
            >
              <Text style={[s.pillText, active && s.pillTextActive]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Quilt previews ────────────────────────────────────────────────────────────

// 9-Patch: 3×3 solid squares
function NinePatch({ colors }) {
  const order = [0, 3, 2, 1, 0, 4, 2, 3, 0];
  const rows  = [order.slice(0, 3), order.slice(3, 6), order.slice(6, 9)];
  return (
    <View style={s.preview}>
      {rows.map((row, r) => (
        <View key={r} style={s.previewRow}>
          {row.map((idx, c) => (
            <View key={c} style={[s.previewCell, { backgroundColor: colors[idx] }]} />
          ))}
        </View>
      ))}
    </View>
  );
}

// HST: 3×3 diagonal-split squares via SVG
function HSTCell({ color1, color2 }) {
  return (
    <View style={[s.previewCell, { overflow: 'hidden' }]}>
      <Svg style={StyleSheet.absoluteFill} viewBox="0 0 100 100" preserveAspectRatio="none">
        <Path d="M 0 0 L 100 0 L 0 100 Z"   fill={color1} />
        <Path d="M 100 0 L 100 100 L 0 100 Z" fill={color2} />
      </Svg>
    </View>
  );
}

function HSTGrid({ colors }) {
  const order = [0, 1, 2, 3, 4, 0, 2, 3, 1];
  const rows  = [order.slice(0, 3), order.slice(3, 6), order.slice(6, 9)];
  return (
    <View style={s.preview}>
      {rows.map((row, r) => (
        <View key={r} style={s.previewRow}>
          {row.map((idx, c) => (
            <HSTCell
              key={c}
              color1={colors[idx]}
              color2={colors[(idx + 3) % colors.length]}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

// Strips: 10 horizontal bars
function Strips({ colors }) {
  return (
    <View style={[s.preview, { gap: 3 }]}>
      {[...colors, ...colors].map((color, i) => (
        <View key={i} style={{ flex: 1, backgroundColor: color, borderRadius: 3 }} />
      ))}
    </View>
  );
}

function QuiltPreview({ layout, colors }) {
  if (layout === 'HST' || layout === 'Star') return <HSTGrid colors={colors} />;
  if (layout === 'Strips')                   return <Strips  colors={colors} />;
  return <NinePatch colors={colors} />;
}

// ─── Entry Screen ──────────────────────────────────────────────────────────────

function EntryScreen({ go, onClose }) {
  const items = [
    { key: 'wheel', icon: 'color-palette-outline', title: 'Color Wheel',   text: 'Start with a color you love.',                    active: true  },
    { key: 'fabric', icon: 'sparkles-outline',     title: 'Upload Fabric',  text: 'Extract colors from a fabric photo.',             active: false },
    { key: 'project', icon: 'layers-outline',      title: 'From Project',   text: 'Improve colors in an existing project.',          active: false },
  ];

  return (
    <View style={{ flex: 1 }}>
      <WizardHeader
        title="Color Companion"
        subtitle="Build a quilt-ready palette from color theory, value contrast, and fabric roles."
        step={1}
        onBack={onClose}
        closeIcon
      />
      <ScrollView contentContainerStyle={s.scrollPad} showsVerticalScrollIndicator={false}>
        {items.map(item => (
          <Card key={item.key} style={!item.active && { opacity: 0.52 }}>
            <TouchableOpacity
              style={s.entryRow}
              onPress={() => item.active && go('color')}
              disabled={!item.active}
              activeOpacity={0.8}
            >
              <View style={[s.entryIcon, { backgroundColor: item.active ? N2.mint : '#E8DDF2' }]}>
                <Ionicons name={item.icon} size={24} color={item.active ? N2.night : N2.plum} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={s.entryTitleRow}>
                  <Text style={s.entryTitle}>{item.title}</Text>
                  {!item.active && (
                    <View style={s.phase2Badge}>
                      <Text style={s.phase2Text}>Phase 2</Text>
                    </View>
                  )}
                </View>
                <Text style={s.entrySub}>{item.text}</Text>
              </View>
              {item.active && (
                <Ionicons name="chevron-forward" size={20} color={N2.plum} />
              )}
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Color Screen ──────────────────────────────────────────────────────────────

function ColorScreen({ selectedColor, setSelectedColor, go, back }) {
  return (
    <View style={{ flex: 1 }}>
      <WizardHeader
        title="Select Base Color"
        subtitle="Choose the color that should guide your palette."
        step={2}
        onBack={back}
      />
      <ScrollView contentContainerStyle={s.scrollPad} showsVerticalScrollIndicator={false}>
        {/* Color grid */}
        <Card>
          <View style={s.colorGrid}>
            {BASE_COLORS.map(color => {
              const active = selectedColor.name === color.name;
              return (
                <TouchableOpacity
                  key={color.name}
                  style={s.colorCell}
                  onPress={() => setSelectedColor(color)}
                  activeOpacity={0.8}
                >
                  <View style={[
                    s.colorCircle,
                    { backgroundColor: color.hex },
                    active && s.colorCircleActive,
                  ]}>
                    {active && <Ionicons name="checkmark" size={22} color="#fff" />}
                  </View>
                  <Text style={s.colorLabel}>{color.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Selected swatch */}
        <Card>
          <Text style={s.fieldLabel}>Selected color</Text>
          <View style={s.selectedRow}>
            <View style={[s.selectedSwatch, { backgroundColor: selectedColor.hex }]} />
            <View>
              <Text style={s.selectedName}>{selectedColor.name}</Text>
              <Text style={s.selectedHex}>{selectedColor.hex}</Text>
            </View>
          </View>
        </Card>

        <PrimaryBtn label="Continue" onPress={() => go('palettes')} />
      </ScrollView>
    </View>
  );
}

// ─── Palette Screen ────────────────────────────────────────────────────────────

function PaletteScreen({ selectedColor, setSelectedPalette, go, back }) {
  const palettes = PALETTES[selectedColor.name] || PALETTES.Plum;
  return (
    <View style={{ flex: 1 }}>
      <WizardHeader
        title={`Palettes for ${selectedColor.name}`}
        subtitle="Choose one recipe card to refine and preview."
        step={3}
        onBack={back}
      />
      <ScrollView contentContainerStyle={s.scrollPad} showsVerticalScrollIndicator={false}>
        {palettes.map(palette => (
          <Card key={palette.id}>
            <View style={s.palHdrRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.palType}>{palette.type}</Text>
                <Text style={s.palLabel}>{palette.label}</Text>
              </View>
              <View style={s.colorCountBadge}>
                <Text style={s.colorCountText}>5 colors</Text>
              </View>
            </View>
            <Swatches colors={palette.colors} height={36} />
            <Text style={s.palNote}>{palette.note}</Text>
            <View style={s.palBtnRow}>
              <OutlineBtn label="Preview" onPress={() => { setSelectedPalette(palette); go('preview'); }} />
              <TouchableOpacity
                style={[s.primaryBtn, { flex: 1 }]}
                onPress={() => { setSelectedPalette(palette); go('refine'); }}
                activeOpacity={0.88}
              >
                <Text style={s.primaryBtnText}>Select</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Refine Screen ─────────────────────────────────────────────────────────────

function RefineScreen({ selectedPalette, settings, setSettings, activeColors, go, back }) {
  return (
    <View style={{ flex: 1 }}>
      <WizardHeader
        title="Refine Palette"
        subtitle="Adjust the feel before applying it to a quilt layout."
        step={4}
        onBack={back}
      />
      <ScrollView contentContainerStyle={s.scrollPad} showsVerticalScrollIndicator={false}>
        {/* Live palette */}
        <Card>
          <View style={s.refineHdrRow}>
            <View>
              <Text style={s.fieldLabel}>Selected recipe</Text>
              <Text style={s.refineType}>{selectedPalette.type}</Text>
            </View>
            <Ionicons name="shuffle" size={22} color={N2.plum} />
          </View>
          <Swatches colors={activeColors} height={44} />
          <Text style={[s.palNote, { marginTop: 10 }]}>
            Live palette — adjust tone below to preview variations.
          </Text>
        </Card>

        <PillGroup
          title="Contrast / Value"
          options={CONTRAST}
          value={settings.contrast}
          onChange={v => setSettings(p => ({ ...p, contrast: v }))}
        />
        <PillGroup
          title="Tone"
          options={TONES}
          value={settings.tone}
          onChange={v => setSettings(p => ({ ...p, tone: v }))}
        />
        <PillGroup
          title="Mood"
          options={MOODS}
          value={settings.mood}
          onChange={v => setSettings(p => ({ ...p, mood: v }))}
        />

        <PrimaryBtn label="Preview in Quilt" onPress={() => go('preview')} />
      </ScrollView>
    </View>
  );
}

// ─── Preview Screen ────────────────────────────────────────────────────────────

function PreviewScreen({ selectedPalette, activeColors, settings, layout, setLayout, roles, setRoles, go, back }) {
  return (
    <View style={{ flex: 1 }}>
      <WizardHeader
        title="Quilt Preview"
        subtitle="See how the palette behaves inside a quilt-friendly layout."
        step={5}
        onBack={back}
      />
      <ScrollView contentContainerStyle={s.scrollPad} showsVerticalScrollIndicator={false}>

        {/* Layout picker */}
        <View>
          <Text style={s.pillTitle}>Select Layout</Text>
          <View style={s.layoutRow}>
            {LAYOUTS.map(item => (
              <TouchableOpacity
                key={item}
                style={[s.layoutBtn, layout === item && s.layoutBtnActive]}
                onPress={() => setLayout(item)}
                activeOpacity={0.8}
              >
                <Text style={[s.layoutBtnText, layout === item && { color: N2.night }]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quilt preview */}
        <QuiltPreview layout={layout} colors={activeColors} />

        {/* Low contrast warning */}
        {settings.contrast === 'Low' && (
          <View style={s.warnBanner}>
            <Ionicons name="warning-outline" size={16} color="#92400e" />
            <Text style={s.warnText}>Low contrast may reduce pattern visibility.</Text>
          </View>
        )}

        {/* Fabric roles */}
        <Card>
          <View style={s.rolesHdr}>
            <Ionicons name="grid-outline" size={18} color={N2.plum} />
            <Text style={s.rolesTitle}>Fabric Role Suggestions</Text>
          </View>
          {ROLE_NAMES.map((role, index) => {
            const ci = roles[role] !== undefined ? roles[role] : index;
            return (
              <View key={role} style={s.roleRow}>
                <TouchableOpacity
                  style={[s.roleSwatch, { backgroundColor: activeColors[ci] }]}
                  onPress={() => setRoles(r => ({ ...r, [role]: (ci + 1) % activeColors.length }))}
                  activeOpacity={0.8}
                />
                <View style={{ flex: 1 }}>
                  <Text style={s.roleLabel}>{role}</Text>
                  <Text style={s.roleHex}>{activeColors[ci]}</Text>
                </View>
                <Text style={s.roleTap}>tap to change</Text>
              </View>
            );
          })}
        </Card>

        {/* Action buttons */}
        <View style={s.dualBtnRow}>
          <OutlineBtn label="Save Palette"     onPress={() => go('save')} />
          <TouchableOpacity
            style={[s.primaryBtn, { flex: 1 }]}
            onPress={() => go('save')}
            activeOpacity={0.88}
          >
            <Text style={s.primaryBtnText}>Apply to Project</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Save Screen ───────────────────────────────────────────────────────────────

function SaveScreen({ back, navigation, activeColors, selectedColor, selectedPalette, settings, projects, resume }) {
  const defaultName = resume
    ? 'Updated Palette'
    : `${selectedColor.name} ${selectedPalette.label}`;

  const [paletteName, setPaletteName]         = useState(defaultName);
  const [selectedProjectId, setSelectedProject] = useState(
    resume?.projectId || (projects[0]?.id ?? null)
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedProjectId) {
      Alert.alert('Select a project', 'Choose a project to attach this palette to.');
      return;
    }
    setSaving(true);
    try {
      const palette = {
        id:        resume?.paletteId || Date.now().toString(),
        name:      paletteName.trim() || defaultName,
        type:      selectedPalette.type,
        label:     selectedPalette.label,
        colors:    activeColors,
        anchorHex: selectedColor.hex,
        contrast:  settings.contrast,
        tone:      settings.tone,
        mood:      settings.mood,
        savedAt:   new Date().toISOString(),
      };

      if (resume?.paletteId) {
        await updatePaletteInProject(selectedProjectId, resume.paletteId, {
          ...palette,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await savePaletteToProject(selectedProjectId, palette);
      }
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Could not save the palette. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WizardHeader
        title={resume ? 'Update Palette' : 'Save Palette'}
        subtitle="Name your palette and choose a project."
        step={6}
        onBack={back}
      />
      <ScrollView
        contentContainerStyle={s.scrollPad}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Name + colour preview */}
        <Card>
          <Text style={s.fieldLabel}>Palette name</Text>
          <TextInput
            style={s.textInput}
            value={paletteName}
            onChangeText={setPaletteName}
            placeholder="e.g. Fall Plum Palette"
            placeholderTextColor="#94a3b8"
          />
          <Swatches colors={activeColors} height={28} />
        </Card>

        {/* Project picker */}
        <Text style={s.sectionLabel}>Save to project</Text>
        {projects.length === 0 ? (
          <Card>
            <Text style={{ fontSize: 14, color: N2.mu, textAlign: 'center' }}>
              No projects yet — create one in the Projects tab.
            </Text>
          </Card>
        ) : (
          projects.map(project => {
            const active = selectedProjectId === project.id;
            return (
              <TouchableOpacity
                key={project.id}
                style={[s.projectRow, active && s.projectRowActive]}
                onPress={() => setSelectedProject(project.id)}
                activeOpacity={0.8}
              >
                <View style={[s.projectDot, { backgroundColor: active ? N2.mint : N2.border }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[s.projectName, active && s.projectNameActive]}>{project.name}</Text>
                  <Text style={s.projectMeta}>{project.type} · {project.stage}</Text>
                </View>
                {active && <Ionicons name="checkmark-circle" size={22} color={N2.mint} />}
              </TouchableOpacity>
            );
          })
        )}

        <PrimaryBtn
          label={resume ? 'Update Palette' : 'Save Palette'}
          onPress={handleSave}
          loading={saving}
        />
        <OutlineBtn label="Cancel" onPress={back} />
      </ScrollView>
    </View>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────────

export default function ColorWheelScreen({ navigation, route }) {
  const resume = route?.params?.resumePalette || null;

  const [screen, setScreen]               = useState(resume ? 'preview' : 'entry');
  const [history, setHistory]             = useState([]);
  const [selectedColor, setSelectedColor] = useState(BASE_COLORS[0]);
  const [selectedPalette, setSelectedPalette] = useState(
    resume
      ? { id: 'resume', type: 'Existing', label: 'Your Palette', colors: resume.colors, note: '' }
      : PALETTES.Plum[2]
  );
  const [settings, setSettings] = useState({ contrast: 'Medium', tone: 'Earthy', mood: 'Fall' });
  const [layout, setLayout]     = useState('9-Patch');
  const [roles, setRoles]       = useState({});
  const [projects, setProjects] = useState([]);

  useFocusEffect(useCallback(() => {
    loadProjects().then(setProjects);
  }, []));

  const go = (next) => {
    setHistory(h => [...h, screen]);
    setScreen(next);
  };

  const back = () => {
    const copy = [...history];
    const prev = copy.pop();
    if (prev) { setHistory(copy); setScreen(prev); }
    else       { navigation.goBack(); }
  };

  // If tone is selected, use its pre-defined colors; otherwise use the palette's own colors
  const activeColors = (settings.tone && TONE_ADJUSTMENTS[settings.tone])
    ? TONE_ADJUSTMENTS[settings.tone]
    : selectedPalette.colors;

  const shared = { go, back, navigation, resume };

  switch (screen) {
    case 'entry':
      return (
        <View style={s.root}>
          <EntryScreen {...shared} onClose={() => navigation.goBack()} />
        </View>
      );
    case 'color':
      return (
        <View style={s.root}>
          <ColorScreen
            {...shared}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
        </View>
      );
    case 'palettes':
      return (
        <View style={s.root}>
          <PaletteScreen
            {...shared}
            selectedColor={selectedColor}
            setSelectedPalette={setSelectedPalette}
          />
        </View>
      );
    case 'refine':
      return (
        <View style={s.root}>
          <RefineScreen
            {...shared}
            selectedPalette={selectedPalette}
            settings={settings}
            setSettings={setSettings}
            activeColors={activeColors}
          />
        </View>
      );
    case 'preview':
      return (
        <View style={s.root}>
          <PreviewScreen
            {...shared}
            selectedPalette={selectedPalette}
            activeColors={activeColors}
            settings={settings}
            layout={layout}
            setLayout={setLayout}
            roles={roles}
            setRoles={setRoles}
          />
        </View>
      );
    case 'save':
      return (
        <View style={s.root}>
          <SaveScreen
            {...shared}
            activeColors={activeColors}
            selectedColor={selectedColor}
            selectedPalette={selectedPalette}
            settings={settings}
            projects={projects}
          />
        </View>
      );
    default:
      return (
        <View style={s.root}>
          <EntryScreen {...shared} onClose={() => navigation.goBack()} />
        </View>
      );
  }
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: N2.bg },
  scrollPad: { padding: 20, gap: 14, paddingBottom: 48 },

  // Wizard header
  hdr: {
    backgroundColor: N2.plum,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 20,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 6,
  },
  hdrRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  hdrBtn:   { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  stepBadge:{ fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.75)' },
  hdrTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  hdrSub:   { fontSize: 13, color: 'rgba(255,255,255,0.78)', lineHeight: 19 },

  // Card
  card: {
    backgroundColor: '#fff', borderRadius: 24, padding: 16,
    shadowColor: N2.night,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08, shadowRadius: 20, elevation: 3,
    gap: 10,
  },

  // Buttons
  primaryBtn: {
    backgroundColor: N2.plum, borderRadius: 18,
    paddingVertical: 14, alignItems: 'center',
  },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  outlineBtn: {
    flex: 1, borderRadius: 18, paddingVertical: 14, alignItems: 'center',
    borderWidth: 1.5, borderColor: N2.border,
    backgroundColor: '#fff',
  },
  outlineBtnText: { fontSize: 14, fontWeight: '600', color: N2.mu },

  // Swatches
  swatches: {
    flexDirection: 'row', borderRadius: 12,
    overflow: 'hidden', borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.06)',
  },
  swatchCell: { flex: 1 },

  // Pill group
  pillTitle: { fontSize: 14, fontWeight: '700', color: N2.night, marginBottom: 10 },
  pillRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: N2.border,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  pillActive:     { backgroundColor: N2.mint, borderColor: N2.mint },
  pillText:       { fontSize: 13, fontWeight: '500', color: N2.mu },
  pillTextActive: { color: N2.night, fontWeight: '600' },

  // Quilt preview
  preview: {
    backgroundColor: '#fff', borderRadius: 24,
    padding: 12, gap: 4,
    shadowColor: N2.night,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 2,
  },
  previewRow:  { flexDirection: 'row', gap: 4, flex: 1 },
  previewCell: { flex: 1, aspectRatio: 1, borderRadius: 10 },

  // Entry screen
  entryRow:    { flexDirection: 'row', alignItems: 'center', gap: 14 },
  entryIcon:   { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  entryTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  entryTitle:  { fontSize: 15, fontWeight: '700', color: N2.night },
  entrySub:    { fontSize: 13, color: N2.mu },
  phase2Badge: { backgroundColor: '#ede9fe', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  phase2Text:  { fontSize: 11, color: N2.plum, fontWeight: '600' },

  // Color screen
  colorGrid:    { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' },
  colorCell:    { width: '22%', alignItems: 'center', marginBottom: 16 },
  colorCircle:  {
    width: 54, height: 54, borderRadius: 27,
    borderWidth: 4, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  colorCircleActive: { borderColor: N2.mint, transform: [{ scale: 1.1 }] },
  colorLabel:   { fontSize: 11, fontWeight: '600', color: N2.mu, marginTop: 4 },
  selectedRow:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  selectedSwatch: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  selectedName: { fontSize: 15, fontWeight: '700', color: N2.night },
  selectedHex:  { fontSize: 11, color: N2.mu, marginTop: 2 },

  // Palette screen
  palHdrRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  palType:   { fontSize: 15, fontWeight: '800', color: N2.night },
  palLabel:  { fontSize: 13, fontWeight: '600', color: N2.plum, marginTop: 2 },
  palNote:   { fontSize: 13, color: N2.mu, lineHeight: 19 },
  palBtnRow: { flexDirection: 'row', gap: 10 },
  colorCountBadge: { backgroundColor: '#ede9fe', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  colorCountText:  { fontSize: 11, fontWeight: '700', color: N2.plum },

  // Refine screen
  refineHdrRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  refineType:   { fontSize: 16, fontWeight: '800', color: N2.night, marginTop: 2 },

  // Preview screen
  layoutRow: { flexDirection: 'row', gap: 8 },
  layoutBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 16, alignItems: 'center',
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: N2.border,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  layoutBtnActive:  { backgroundColor: N2.mint, borderColor: N2.mint },
  layoutBtnText:    { fontSize: 11, fontWeight: '700', color: N2.mu },
  warnBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fef3c7', borderRadius: 14, padding: 12,
  },
  warnText: { flex: 1, fontSize: 13, color: '#92400e', lineHeight: 18 },
  rolesHdr:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rolesTitle:{ fontSize: 14, fontWeight: '800', color: N2.night },
  roleRow:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
  roleSwatch:{ width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },
  roleLabel: { fontSize: 11, color: '#94a3b8', marginBottom: 1 },
  roleHex:   { fontSize: 13, color: N2.night, fontWeight: '500' },
  roleTap:   { fontSize: 10, color: N2.lav },
  dualBtnRow:{ flexDirection: 'row', gap: 10 },

  // Save screen
  fieldLabel:  { fontSize: 13, fontWeight: '600', color: N2.night },
  textInput: {
    backgroundColor: N2.bg, borderRadius: 12,
    borderWidth: 1.5, borderColor: N2.border,
    paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 15, color: N2.night,
  },
  sectionLabel: {
    fontSize: 12, fontWeight: '700', color: N2.plum,
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  projectRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 18,
    padding: 14, borderWidth: 1.5, borderColor: N2.border,
    shadowColor: N2.night, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
  },
  projectRowActive:  { borderColor: N2.mint },
  projectDot:        { width: 12, height: 12, borderRadius: 6 },
  projectName:       { fontSize: 14, fontWeight: '700', color: N2.night },
  projectNameActive: { color: N2.night },
  projectMeta:       { fontSize: 12, color: N2.mu, marginTop: 2 },
});
