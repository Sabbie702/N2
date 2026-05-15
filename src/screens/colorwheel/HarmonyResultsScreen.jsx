/**
 * N2 — Nimble Needle
 * HarmonyResultsScreen
 *
 * The main payoff screen — shows all 5 harmony types for a source color,
 * with real fabric matches from brand libraries.
 *
 * Receives params:
 *   sourceHex   (required) — e.g. '#5B2D8E'
 *   sourceName  (optional) — e.g. 'Kona Plum'
 *   sourceType  (optional) — 'stash' | 'wheel' | 'brand' | 'photo' | 'project'
 *   brandId     (optional) — pre-filter to specific brand
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, ActivityIndicator,
} from 'react-native';
import { getHarmonies, describeColor } from '../../utils/colorHarmony';
import { FABRIC_BRANDS } from '../../data/fabricColors';
import HarmonyTypeCard from '../../components/colorwheel/HarmonyTypeCard';
import { SavePaletteModal } from '../../components/colorwheel/ColorWheelComponents';

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

// Which harmony card starts expanded by default
const DEFAULT_EXPANDED = 'bold_contrast';

export default function HarmonyResultsScreen({ route, navigation }) {
  const {
    sourceHex  = '#5B2D8E',
    sourceName = null,
    sourceType = 'wheel',
    brandId:   initialBrandId = null,
  } = route.params || {};

  const [harmonies,       setHarmonies]       = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [activeBrandId,   setActiveBrandId]   = useState(initialBrandId);
  const [saveModalVisible, setSaveModalVisible] = useState(false);

  // Stub projects — replace with real project data from N2 store
  const projects = [
    { id: '1', name: 'Summer Quilt' },
    { id: '2', name: 'Market Bag' },
  ];

  // Run harmony engine whenever source or brand filter changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const result = getHarmonies(sourceHex, activeBrandId, 3);
      setHarmonies(result);
      setLoading(false);
    }, 60);
    return () => clearTimeout(timer);
  }, [sourceHex, activeBrandId]);

  const displayName = sourceName || sourceHex.toUpperCase();
  const description = describeColor(sourceHex);

  const handleFabricPress = useCallback((fabric) => {
    // Future: navigate to fabric detail or add to stash
    console.log('N2: fabric tapped:', fabric.name);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={N2.midnight}/>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Color Corner</Text>
          <Text style={styles.headerSub}>
            {sourceType === 'stash'   ? 'From your stash'    :
             sourceType === 'brand'   ? 'From Swatch Stash'  :
             sourceType === 'photo'   ? 'From your photo'    :
             sourceType === 'project' ? 'From your project'  :
             'Free spin'}
          </Text>
        </View>
        <View style={{ width: 36 }}/>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Source Color Card ── */}
        <View style={styles.sourceCard}>
          <View style={[styles.sourceColorBlock, { backgroundColor: sourceHex }]}/>
          <View style={styles.sourceInfo}>
            <Text style={styles.sourceName}>{displayName}</Text>
            {sourceName && (
              <Text style={styles.sourceHex}>{sourceHex.toUpperCase()}</Text>
            )}
            {description && (
              <Text style={styles.sourceDescription}>{description}</Text>
            )}
          </View>
        </View>

        {/* ── Brand Filter ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SHOW MATCHES FROM</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
          >
            {/* All brands option */}
            <TouchableOpacity
              onPress={() => setActiveBrandId(null)}
              style={[styles.brandChip, activeBrandId === null && styles.brandChipActive]}
            >
              <Text style={[styles.brandChipText, activeBrandId === null && styles.brandChipTextActive]}>
                All Brands
              </Text>
            </TouchableOpacity>
            {/* Individual brands */}
            {FABRIC_BRANDS.map(brand => (
              <TouchableOpacity
                key={brand.id}
                onPress={() => setActiveBrandId(brand.id)}
                style={[styles.brandChip, activeBrandId === brand.id && styles.brandChipActive]}
              >
                <Text style={[styles.brandChipText, activeBrandId === brand.id && styles.brandChipTextActive]}>
                  {brand.line}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Harmony Cards ── */}
        <View style={styles.section}>
          <View style={styles.harmoniesHeader}>
            <Text style={styles.sectionLabel}>YOUR HARMONY GROUPS</Text>
            {harmonies && (
              <Text style={styles.harmoniesCount}>
                {Object.keys(harmonies.harmonies).length} found
              </Text>
            )}
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={N2.mint} size="large"/>
              <Text style={styles.loadingText}>Finding your fabric harmonies…</Text>
            </View>
          ) : harmonies ? (
            Object.entries(harmonies.harmonies).map(([key, harmonyResult]) => (
              <HarmonyTypeCard
                key={key}
                harmonyResult={harmonyResult}
                defaultExpanded={key === DEFAULT_EXPANDED}
                onFabricPress={handleFabricPress}
              />
            ))
          ) : null}
        </View>

        {/* ── Disclaimer ── */}
        <Text style={styles.disclaimer}>
          ⓘ Digital colors are approximate representations of physical fabric.
          Always compare physical swatches before purchasing.
        </Text>

        <View style={{ height: 100 }}/>
      </ScrollView>

      {/* ── Save Palette CTA ── */}
      {!loading && harmonies && (
        <View style={styles.saveCta}>
          <TouchableOpacity
            onPress={() => setSaveModalVisible(true)}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>Save Palette to Project</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Save Modal ── */}
      <SavePaletteModal
        visible={saveModalVisible}
        onClose={() => setSaveModalVisible(false)}
        onSave={(palette) => {
          // TODO: dispatch to N2 store
          console.log('N2: saving palette:', palette);
        }}
        projects={projects}
        harmonies={harmonies?.harmonies || {}}
        sourceColor={{
          hex:      sourceHex,
          name:     sourceName,
          lineName: FABRIC_BRANDS.find(b => b.id === activeBrandId)?.line,
        }}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: N2.lavWhite,
  },
  header: {
    backgroundColor: N2.midnight,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 36, height: 36,
    justifyContent: 'center',
  },
  backBtnText: {
    color: N2.mint,
    fontSize: 22,
    fontWeight: '300',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: N2.white,
  },
  headerSub: {
    fontSize: 11,
    color: N2.mint,
    marginTop: 2,
  },
  scroll: { flex: 1 },

  // Source color card
  sourceCard: {
    flexDirection: 'row',
    backgroundColor: N2.white,
    margin: 16,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: N2.lightBorder,
  },
  sourceColorBlock: {
    width: 80,
  },
  sourceInfo: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
  },
  sourceName: {
    fontSize: 18,
    fontWeight: '700',
    color: N2.darkText,
  },
  sourceHex: {
    fontSize: 12,
    color: N2.deepPlum,
    fontFamily: 'monospace',
    fontWeight: '600',
    marginTop: 3,
  },
  sourceDescription: {
    fontSize: 12,
    color: N2.midGray,
    fontStyle: 'italic',
    marginTop: 5,
    lineHeight: 16,
  },

  // Sections
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: N2.midGray,
    letterSpacing: 1.1,
    marginBottom: 10,
  },
  harmoniesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  harmoniesCount: {
    fontSize: 12,
    color: N2.midGray,
  },

  // Brand filter
  brandChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: N2.lightBorder,
    backgroundColor: N2.white,
  },
  brandChipActive: {
    backgroundColor: N2.deepPlum,
    borderColor: N2.deepPlum,
  },
  brandChipText: {
    fontSize: 13,
    color: N2.midGray,
    fontWeight: '500',
  },
  brandChipTextActive: {
    color: N2.white,
    fontWeight: '700',
  },

  // Loading
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    color: N2.midGray,
    marginTop: 12,
    fontSize: 13,
  },

  // Disclaimer
  disclaimer: {
    fontSize: 11,
    color: N2.midGray,
    fontStyle: 'italic',
    textAlign: 'center',
    marginHorizontal: 24,
    marginBottom: 16,
    lineHeight: 16,
  },

  // Save CTA
  saveCta: {
    backgroundColor: N2.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 28,
    borderTopWidth: 0.5,
    borderTopColor: N2.lightBorder,
  },
  saveButton: {
    backgroundColor: N2.deepPlum,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: N2.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
