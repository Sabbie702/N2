// src/screens/ColorWheelScreen.js
// N2 — Color Wheel Intelligence
// Main screen: SVG color wheel + palette type + lock/re-stitch + block previews + save

import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useColorWheel }        from '../hooks/useColorWheel';
import { usePalette }            from '../hooks/usePalette';
import { ColorWheelPicker }      from '../components/ColorWheelPicker';
import { PaletteStrip }          from '../components/PaletteStrip';
import { ReStitchButton, PaletteTypeSelector } from '../components/ReStitchButton';
import { QuiltBlockSVG }         from '../components/QuiltBlockSVG';
import { SavePaletteSheet }      from '../components/SavePaletteSheet';
import { QUILT_BLOCKS }          from '../utils/quiltBlocks';
import { PALETTE_TYPES }         from '../utils/colorHarmony';
import { updatePaletteInProject } from '../storage/projects';

const BRAND = {
  plum: '#5B2D8E', mint: '#4EC9A0', lt: '#1a1a2e',
  mu: '#6b6b8a', di: '#aaaabc', card: '#f7f7f7',
  bo: 'rgba(0,0,0,0.09)', hdr: '#f9f9f9',
};

const WHEEL_SIZE = 248;

/**
 * ColorWheelScreen
 *
 * route.params.resumePalette (optional):
 *   { colors, typeId, paletteId, projectId, projectName, projectType }
 */
export default function ColorWheelScreen({ navigation, route }) {
  const resumePalette = route?.params?.resumePalette || null;
  const isResuming    = !!resumePalette;

  const wheel   = useColorWheel();
  const palette = usePalette(resumePalette?.typeId || 'sisters');
  const [showSaveSheet, setShowSaveSheet] = useState(false);
  const [updating, setUpdating]           = useState(false);

  // Initialize palette on mount
  useEffect(() => {
    if (isResuming) {
      palette.loadSavedPalette(resumePalette.colors, resumePalette.typeId);
    } else {
      palette.initPalette('sisters', wheel.anchorH, wheel.anchorS, wheel.anchorL);
    }
  }, []);

  const handleColorChange = ({ h, s }) => {
    wheel.handleColorChange({ h, s });
    palette.updateAnchor(h, s, wheel.anchorL, palette.locks, palette.colors);
  };

  const handleTypeChange = (typeId) => {
    palette.changePaletteType(typeId, wheel.anchorH, wheel.anchorS, wheel.anchorL);
  };

  const handleUpdate = async () => {
    if (updating) return;
    setUpdating(true);
    await updatePaletteInProject(
      resumePalette.projectId,
      resumePalette.paletteId,
      {
        colors: palette.colors,
        type: PALETTE_TYPES[palette.paletteTypeId]?.label,
        anchorHex: wheel.anchorHex,
      }
    );
    setUpdating(false);
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Resume editing banner */}
        {isResuming && (
          <View style={styles.resumeBanner}>
            <Ionicons name="information-circle" size={14} color={BRAND.mint} />
            <Text style={styles.resumeText}>
              Your saved palette is pre-loaded. Lock colors you love, then tap Re-stitch for the rest.
            </Text>
          </View>
        )}

        {/* Anchor color card */}
        <View style={styles.anchorCard}>
          <View style={[styles.anchorSwatch, { backgroundColor: wheel.anchorHex }]} />
          <View>
            <Text style={styles.anchorName}>{wheel.anchorName}</Text>
            <Text style={styles.anchorHex}>{wheel.anchorHex}</Text>
            <Text style={styles.anchorHint}>Drag the wheel to change</Text>
          </View>
        </View>

        {/* Color wheel */}
        <View style={styles.wheelWrap}>
          <ColorWheelPicker
            size={WHEEL_SIZE}
            anchorH={wheel.anchorH}
            anchorS={wheel.anchorS}
            onColorChange={handleColorChange}
          />
        </View>

        {/* Palette type selector */}
        <PaletteTypeSelector
          activeTypeId={palette.paletteTypeId}
          onSelect={handleTypeChange}
        />

        {/* Palette card */}
        <View style={styles.paletteCard}>
          <View style={styles.paletteCardHdr}>
            <Text style={styles.paletteCardTitle}>Your palette</Text>
            <Text style={styles.paletteCardHint}>tap any color to lock it</Text>
          </View>

          <PaletteStrip
            colors={palette.colors}
            locks={palette.locks}
            changedFlags={palette.changedFlags}
            onToggleLock={palette.toggleLock}
          />

          {palette.showPill && (
            <Text style={styles.pill}>{palette.pillText}</Text>
          )}

          <ReStitchButton
            lockedCount={palette.lockedCount}
            allLocked={palette.allLocked}
            onPress={() => palette.doReStitch(wheel.anchorH, wheel.anchorS, wheel.anchorL)}
          />
        </View>

        {/* Quilt block previews */}
        {palette.colors.length > 0 && (
          <View style={styles.blockSection}>
            <View style={styles.blockSectionHdr}>
              <View style={styles.mintDot} />
              <Text style={styles.blockSectionTitle}>Suggested quilt blocks</Text>
            </View>
            {QUILT_BLOCKS.map((block) => (
              <View key={block.id} style={blockStyles.row}>
                <QuiltBlockSVG blockId={block.id} colors={palette.colors} size={78} />
                <View style={blockStyles.info}>
                  <Text style={blockStyles.name}>{block.name}</Text>
                  <Text style={blockStyles.sub}>{block.subtitle}</Text>
                  <View style={blockStyles.dots}>
                    {palette.colors.map((hex, i) => (
                      <View key={i} style={[blockStyles.dot, { backgroundColor: hex }]} />
                    ))}
                  </View>
                  <View style={blockStyles.tagWrap}>
                    <Text style={blockStyles.tag}>{block.tag}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Save / Update buttons */}
        {isResuming ? (
          <View>
            <View style={styles.gapRow}>
              <TouchableOpacity
                style={[styles.btn, styles.btnGray]}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.btnGrayText}>Discard changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnMint, updating && styles.btnDisabled]}
                onPress={handleUpdate}
                disabled={updating}
              >
                <Text style={styles.btnMintText}>
                  {updating ? 'Saving…' : 'Update palette'}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => setShowSaveSheet(true)}
              style={styles.saveNewLink}
            >
              <Text style={styles.saveNewText}>or Save as a new palette instead</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => setShowSaveSheet(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="save-outline" size={14} color="#fff" />
            <Text style={styles.saveBtnText}>Save palette to project</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Save palette sheet (slide-up modal) */}
      <SavePaletteSheet
        visible={showSaveSheet}
        onClose={() => setShowSaveSheet(false)}
        colors={palette.colors}
        typeLabel={PALETTE_TYPES[palette.paletteTypeId]?.label || ''}
        anchorHex={wheel.anchorHex}
        navigation={navigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: '#fff' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 9,
    padding: 12, paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: BRAND.bo,
    backgroundColor: BRAND.hdr,
  },
  backBtn:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText:    { fontSize: 10, color: BRAND.plum },
  n2Badge:     { width: 28, height: 28, backgroundColor: BRAND.plum, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  n2Text:      { color: '#fff', fontSize: 10, fontWeight: '700' },
  headerTitle: { flex: 1 },
  title:       { fontSize: 15, fontWeight: '500', color: BRAND.lt },
  subtitle:    { fontSize: 10, color: BRAND.mu, marginTop: 1 },

  // Resume banner
  resumeBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 7,
    margin: 10, marginBottom: 0, padding: 9,
    backgroundColor: 'rgba(78,201,160,0.07)',
    borderRadius: 10, borderWidth: 1, borderColor: 'rgba(78,201,160,0.22)',
  },
  resumeText: { flex: 1, fontSize: 9, color: '#0a6e4a', lineHeight: 14 },

  // Anchor card
  anchorCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    margin: 10, padding: 10,
    backgroundColor: '#efefef', borderRadius: 12,
    borderWidth: 1, borderColor: BRAND.bo,
  },
  anchorSwatch: { width: 46, height: 46, borderRadius: 9, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  anchorName:   { fontSize: 13, fontWeight: '500', color: BRAND.lt },
  anchorHex:    { fontSize: 10, color: BRAND.mu, marginTop: 2 },
  anchorHint:   { fontSize: 9, color: BRAND.plum, marginTop: 2 },

  // Wheel
  wheelWrap: { alignItems: 'center', paddingVertical: 4 },

  // Palette card
  paletteCard: {
    marginHorizontal: 14, backgroundColor: BRAND.card,
    borderRadius: 13, borderWidth: 1, borderColor: BRAND.bo, overflow: 'hidden',
  },
  paletteCardHdr: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 8, paddingHorizontal: 12,
    borderBottomWidth: 1, borderBottomColor: BRAND.bo,
    backgroundColor: BRAND.hdr,
  },
  paletteCardTitle: { fontSize: 11, fontWeight: '500', color: BRAND.lt },
  paletteCardHint:  { fontSize: 9, color: BRAND.plum },

  pill: {
    fontSize: 9, color: '#0a6e4a',
    backgroundColor: 'rgba(78,201,160,0.1)',
    borderWidth: 1, borderColor: 'rgba(78,201,160,0.25)',
    paddingVertical: 3, paddingHorizontal: 10, borderRadius: 20,
    marginHorizontal: 14, marginBottom: 4, textAlign: 'center',
  },

  // Blocks
  blockSection:    { paddingHorizontal: 14, marginTop: 10, gap: 7 },
  blockSectionHdr: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  mintDot:         { width: 6, height: 6, borderRadius: 3, backgroundColor: BRAND.mint },
  blockSectionTitle: { fontSize: 11, fontWeight: '500', color: BRAND.mu },

  // Buttons
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
    marginHorizontal: 14, marginTop: 12,
    backgroundColor: BRAND.plum, padding: 13, borderRadius: 11,
  },
  saveBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  gapRow:      { flexDirection: 'row', gap: 8, marginHorizontal: 14, marginTop: 10 },
  btn:         { flex: 1, padding: 10, borderRadius: 9, alignItems: 'center' },
  btnGray:     { backgroundColor: '#efefef', borderWidth: 1, borderColor: BRAND.bo },
  btnGrayText: { fontSize: 10, fontWeight: '500', color: BRAND.mu },
  btnMint:     { backgroundColor: BRAND.mint },
  btnMintText: { fontSize: 10, fontWeight: '500', color: '#0a3d2b' },
  btnDisabled: { opacity: 0.5 },
  saveNewLink: { alignItems: 'center', paddingVertical: 6 },
  saveNewText: { fontSize: 9, color: BRAND.di },
});

const blockStyles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#efefef', borderRadius: 12,
    padding: 8, borderWidth: 1, borderColor: BRAND.bo,
  },
  info:   { flex: 1 },
  name:   { fontSize: 11, fontWeight: '500', color: BRAND.lt },
  sub:    { fontSize: 9, color: BRAND.mu, marginTop: 2, lineHeight: 13 },
  dots:   { flexDirection: 'row', gap: 3, marginTop: 5, flexWrap: 'wrap' },
  dot:    { width: 9, height: 9, borderRadius: 5, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },
  tagWrap: { marginTop: 4 },
  tag:    {
    fontSize: 8, color: '#7c3abf',
    backgroundColor: 'rgba(91,45,142,0.07)',
    paddingVertical: 2, paddingHorizontal: 7, borderRadius: 10, alignSelf: 'flex-start',
  },
});
