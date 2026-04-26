/**
 * N2 — Nimble Needle
 * Small Components for Color Wheel Feature
 *
 * FabricMatchChip    — single fabric color result chip
 * SwatchGrid         — brand color browsing grid (Swatch Stash)
 * ExtractedPalette   — post-photo color picker
 * SavePaletteModal   — save palette to project bottom sheet
 */

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Modal, FlatList, Pressable,
} from 'react-native';
import { FABRIC_BRANDS, getAllColorsForBrand, getBrandById } from '../../data/fabricColors';

const N2 = {
  deepPlum:     '#5B2D8E',
  midnight:     '#2D1B4E',
  mint:         '#4EC9A0',
  softLavender: '#C084FC',
  lavWhite:     '#F5F0FA',
  white:        '#FFFFFF',
  darkText:     '#1A1A2E',
  midGray:      '#6B6B8A',
  lightBorder:  '#DDD6F0',
};

// ─────────────────────────────────────────────────────────────────────────────
// FabricMatchChip
// Shows a single fabric color result: swatch + name + line name
// ─────────────────────────────────────────────────────────────────────────────
export function FabricMatchChip({ color, selected = false, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.chip}>
      <View style={[
        styles.chipSwatch,
        { backgroundColor: color.hex },
        selected && styles.chipSwatchSelected,
      ]}/>
      <Text style={styles.chipName} numberOfLines={2}>{color.name}</Text>
      <Text style={styles.chipLine} numberOfLines={1}>{color.lineName}</Text>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SwatchGrid — the "Swatch Stash" brand color browser
// ─────────────────────────────────────────────────────────────────────────────
export function SwatchGrid({ onColorSelect }) {
  const [activeBrandId, setActiveBrandId]   = useState('kona');
  const [selectedColorId, setSelectedColorId] = useState(null);

  const brand = getBrandById(activeBrandId);

  const handleColorPress = (color) => {
    setSelectedColorId(color.id);
    onColorSelect && onColorSelect(color);
  };

  return (
    <View style={styles.swatchGrid}>

      {/* Brand selector */}
      <Text style={styles.sectionLabel}>FABRIC LINE</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.brandScroll}
        contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
      >
        {FABRIC_BRANDS.map(b => (
          <TouchableOpacity
            key={b.id}
            onPress={() => { setActiveBrandId(b.id); setSelectedColorId(null); }}
            style={[styles.brandChip, activeBrandId === b.id && styles.brandChipActive]}
          >
            <Text style={[styles.brandChipText, activeBrandId === b.id && styles.brandChipTextActive]}>
              {b.line}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Disclaimer */}
      <Text style={styles.disclaimer}>
        Digital colors are approximate. Compare physical swatches before purchasing.
      </Text>

      {/* Color families */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {brand && Object.values(brand.families).map(family => (
          <View key={family.label} style={styles.family}>
            <Text style={styles.familyLabel}>{family.label}</Text>
            <View style={styles.colorGrid}>
              {family.colors.map(color => (
                <TouchableOpacity
                  key={color.id}
                  onPress={() => handleColorPress({ ...color, brandId: brand.id, lineName: brand.line })}
                  style={styles.swatchWrapper}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.gridSwatch,
                    { backgroundColor: color.hex },
                    selectedColorId === color.id && styles.gridSwatchSelected,
                  ]}>
                    {selectedColorId === color.id && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.swatchName} numberOfLines={2}>{color.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <View style={{ height: 40 }}/>
      </ScrollView>

    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ExtractedPalette
// Shows colors found in a fabric photo, asks user to pick one
// ─────────────────────────────────────────────────────────────────────────────
export function ExtractedPalette({ colors = [], onColorSelect }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (color) => {
    setSelected(color.hex);
    onColorSelect && onColorSelect(color);
  };

  return (
    <View style={styles.extractedContainer}>
      <Text style={styles.sectionLabel}>COLORS FOUND IN YOUR FABRIC</Text>
      <Text style={styles.extractedSubtitle}>
        Tap the color you want to build your harmonies around
      </Text>

      <View style={styles.extractedRow}>
        {colors.map((color, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => handleSelect(color)}
            activeOpacity={0.8}
            style={styles.extractedItem}
          >
            <View style={[
              styles.extractedSwatch,
              { backgroundColor: color.hex },
              selected === color.hex && styles.extractedSwatchSelected,
            ]}>
              {selected === color.hex && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </View>
            <Text style={styles.extractedPercent}>{color.percent}%</Text>
            <Text style={styles.extractedHex}>{color.hex.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selected && (
        <View style={styles.selectedHint}>
          <Text style={styles.selectedHintText}>
            Building harmonies around {selected.toUpperCase()} →
          </Text>
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SavePaletteModal
// Bottom sheet to save a palette to an N2 project
// ─────────────────────────────────────────────────────────────────────────────
export function SavePaletteModal({
  visible,
  onClose,
  onSave,
  projects = [],
  harmonies = {},
  sourceColor = {},
}) {
  const [selectedHarmonyIds, setSelectedHarmonyIds] = useState(
    Object.keys(harmonies)
  );
  const [selectedProjectId, setSelectedProjectId]   = useState(
    projects[0]?.id || null
  );
  const [paletteName, setPaletteName] = useState(
    sourceColor.name ? `${sourceColor.name} Palette` : 'My Palette'
  );

  const HARMONY_LABELS = {
    tone_on_tone:   { label: 'Tone on Tone',   icon: '🌊' },
    fabric_sisters: { label: 'Fabric Sisters',  icon: '🌸' },
    bold_contrast:  { label: 'Bold Contrast',   icon: '⚡' },
    lively_trio:    { label: 'Lively Trio',     icon: '✨' },
    split_contrast: { label: 'Split Contrast',  icon: '🎨' },
  };

  const toggleHarmony = (id) => {
    setSelectedHarmonyIds(prev =>
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (!selectedProjectId) return;
    onSave({
      name:         paletteName,
      sourceColor,
      harmonyIds:   selectedHarmonyIds,
      projectId:    selectedProjectId,
      createdAt:    new Date().toISOString(),
    });
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalSheet}>

          {/* Handle bar */}
          <View style={styles.handleBar}/>

          <Text style={styles.modalTitle}>Save Palette to Project</Text>

          {/* Source color summary */}
          <View style={styles.modalSourceRow}>
            <View style={[styles.modalSourceSwatch,
              { backgroundColor: sourceColor.hex || '#808080' }]}/>
            <View>
              <Text style={styles.modalSourceName}>
                {sourceColor.name || 'Selected color'}
              </Text>
              <Text style={styles.modalSourceLine}>
                {sourceColor.lineName || ''}
              </Text>
            </View>
          </View>

          {/* Harmony type selector */}
          <Text style={styles.modalSectionLabel}>HARMONY TYPES TO SAVE</Text>
          {Object.entries(HARMONY_LABELS).map(([id, { label, icon }]) => (
            <TouchableOpacity
              key={id}
              onPress={() => toggleHarmony(id)}
              style={[
                styles.harmonyToggleRow,
                selectedHarmonyIds.includes(id) && styles.harmonyToggleRowActive,
              ]}
            >
              <Text style={styles.harmonyToggleIcon}>{icon}</Text>
              <Text style={styles.harmonyToggleLabel}>{label}</Text>
              <View style={[
                styles.checkbox,
                selectedHarmonyIds.includes(id) && styles.checkboxChecked,
              ]}>
                {selectedHarmonyIds.includes(id) && (
                  <Text style={styles.checkboxCheck}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}

          {/* Project selector */}
          <Text style={[styles.modalSectionLabel, { marginTop: 16 }]}>SAVE TO PROJECT</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
          >
            {projects.map(project => (
              <TouchableOpacity
                key={project.id}
                onPress={() => setSelectedProjectId(project.id)}
                style={[
                  styles.projectChip,
                  selectedProjectId === project.id && styles.projectChipActive,
                ]}
              >
                <Text style={[
                  styles.projectChipText,
                  selectedProjectId === project.id && styles.projectChipTextActive,
                ]}>
                  {project.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Save button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={!selectedProjectId || selectedHarmonyIds.length === 0}
            style={[
              styles.saveButton,
              (!selectedProjectId || selectedHarmonyIds.length === 0) && styles.saveButtonDisabled,
            ]}
          >
            <Text style={styles.saveButtonText}>
              Save Palette{selectedProjectId
                ? ` to ${projects.find(p => p.id === selectedProjectId)?.name || 'Project'}`
                : ''}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 24 }}/>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // FabricMatchChip
  chip: { alignItems: 'center', width: 76 },
  chipSwatch: {
    width: 56, height: 56, borderRadius: 10,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)',
    marginBottom: 5,
  },
  chipSwatchSelected: { borderWidth: 3, borderColor: N2.mint },
  chipName: {
    fontSize: 10, fontWeight: '600', color: N2.darkText,
    textAlign: 'center', lineHeight: 13,
  },
  chipLine: {
    fontSize: 9, color: N2.midGray, textAlign: 'center', marginTop: 2,
  },

  // SwatchGrid
  swatchGrid: { flex: 1 },
  sectionLabel: {
    fontSize: 11, fontWeight: '600', color: N2.midGray,
    letterSpacing: 1.1, marginBottom: 10,
  },
  brandScroll: { marginBottom: 6 },
  brandChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: N2.lightBorder, backgroundColor: N2.white,
  },
  brandChipActive: { backgroundColor: N2.deepPlum, borderColor: N2.deepPlum },
  brandChipText: { fontSize: 13, color: N2.midGray, fontWeight: '500' },
  brandChipTextActive: { color: N2.white, fontWeight: '700' },
  disclaimer: {
    fontSize: 10, color: N2.midGray, fontStyle: 'italic',
    marginBottom: 12, lineHeight: 14,
  },
  family: { marginBottom: 16 },
  familyLabel: {
    fontSize: 12, fontWeight: '600', color: N2.deepPlum,
    marginBottom: 10,
  },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  swatchWrapper: { alignItems: 'center', width: 52 },
  gridSwatch: {
    width: 46, height: 46, borderRadius: 8,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center', alignItems: 'center',
  },
  gridSwatchSelected: { borderWidth: 3, borderColor: N2.mint },
  swatchName: {
    fontSize: 9, color: N2.midGray, textAlign: 'center',
    marginTop: 3, lineHeight: 12,
  },
  checkmark: {
    backgroundColor: N2.mint, borderRadius: 10,
    width: 18, height: 18, justifyContent: 'center', alignItems: 'center',
  },
  checkmarkText: { color: N2.white, fontSize: 11, fontWeight: '900' },

  // ExtractedPalette
  extractedContainer: { padding: 4 },
  extractedSubtitle: {
    fontSize: 12, color: N2.midGray, marginBottom: 16, lineHeight: 17,
  },
  extractedRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12,
  },
  extractedItem: { alignItems: 'center', width: 72 },
  extractedSwatch: {
    width: 64, height: 64, borderRadius: 12,
    borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 6,
  },
  extractedSwatchSelected: { borderColor: N2.mint, borderWidth: 3 },
  extractedPercent: {
    fontSize: 12, fontWeight: '700', color: N2.darkText,
  },
  extractedHex: {
    fontSize: 9, color: N2.midGray, fontFamily: 'monospace', marginTop: 2,
  },
  selectedHint: {
    backgroundColor: N2.lavWhite, borderRadius: 8,
    padding: 10, marginTop: 8,
  },
  selectedHintText: {
    fontSize: 12, color: N2.deepPlum, fontWeight: '500',
  },

  // SavePaletteModal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(45,27,78,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: N2.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingTop: 12,
    maxHeight: '85%',
  },
  handleBar: {
    width: 36, height: 4, borderRadius: 2, backgroundColor: N2.lightBorder,
    alignSelf: 'center', marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18, fontWeight: '700', color: N2.darkText, marginBottom: 16,
  },
  modalSourceRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: N2.lavWhite, borderRadius: 10, padding: 12, marginBottom: 20,
  },
  modalSourceSwatch: {
    width: 44, height: 44, borderRadius: 8,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)',
  },
  modalSourceName: { fontSize: 14, fontWeight: '600', color: N2.darkText },
  modalSourceLine: { fontSize: 12, color: N2.midGray, marginTop: 2 },
  modalSectionLabel: {
    fontSize: 11, fontWeight: '600', color: N2.midGray,
    letterSpacing: 1.1, marginBottom: 10,
  },
  harmonyToggleRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8,
    borderWidth: 0.5, borderColor: N2.lightBorder,
    backgroundColor: N2.white, marginBottom: 6,
  },
  harmonyToggleRowActive: {
    backgroundColor: N2.lavWhite, borderColor: N2.softLavender,
  },
  harmonyToggleIcon: { fontSize: 18 },
  harmonyToggleLabel: { flex: 1, fontSize: 14, color: N2.darkText },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 1.5, borderColor: N2.lightBorder,
    justifyContent: 'center', alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: N2.mint, borderColor: N2.mint },
  checkboxCheck: { color: N2.white, fontSize: 13, fontWeight: '900' },
  projectChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: N2.lightBorder, backgroundColor: N2.white,
  },
  projectChipActive: {
    backgroundColor: N2.deepPlum, borderColor: N2.deepPlum,
  },
  projectChipText: { fontSize: 13, color: N2.midGray, fontWeight: '500' },
  projectChipTextActive: { color: N2.white, fontWeight: '700' },
  saveButton: {
    backgroundColor: N2.deepPlum, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginTop: 20,
  },
  saveButtonDisabled: { opacity: 0.4 },
  saveButtonText: { color: N2.white, fontSize: 15, fontWeight: '700' },
});
