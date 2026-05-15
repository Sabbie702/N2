/**
 * N2 — Nimble Needle
 * ColorWheelScreen
 *
 * Main entry screen for the Color Wheel Intelligence feature.
 * Two tabs: Free Spin (wheel) | Swatch Stash (brand color browser)
 * Camera button in header for photo extraction.
 */

import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar,
} from 'react-native';
import ColorWheelDial from '../../components/colorwheel/ColorWheelDial';
import { SwatchGrid } from '../../components/colorwheel/ColorWheelComponents';
import { hslToHex, hexToHsl } from '../../utils/colorHarmony';

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

const TABS = [
  { id: 'wheel',  label: 'Free Spin',    icon: '🎯' },
  { id: 'stash',  label: 'Swatch Stash', icon: '🎨' },
];

export default function ColorWheelScreen({ navigation }) {
  const [activeTab, setActiveTab]     = useState('wheel');
  const [currentHex, setCurrentHex]   = useState('#5B2D8E');  // Default: N2 Deep Plum
  const [sourceName, setSourceName]   = useState(null);
  const [sourceBrandId, setSourceBrandId] = useState(null);

  const handleWheelColor = useCallback((hex) => {
    setCurrentHex(hex);
    setSourceName(null);
    setSourceBrandId(null);
  }, []);

  const handleSwatchSelect = useCallback((color) => {
    setCurrentHex(color.hex);
    setSourceName(color.name);
    setSourceBrandId(color.brandId);
  }, []);

  const handleFindHarmonies = () => {
    navigation.navigate('HarmonyResults', {
      sourceHex:  currentHex,
      sourceName: sourceName || currentHex.toUpperCase(),
      sourceType: activeTab === 'stash' ? 'brand' : 'wheel',
      brandId:    sourceBrandId,
    });
  };

  const handlePhotoPress = () => {
    navigation.navigate('PhotoExtract');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={N2.midnight}/>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Color Corner</Text>
          <Text style={styles.headerSub}>Find your perfect harmony</Text>
        </View>
        <TouchableOpacity onPress={handlePhotoPress} style={styles.cameraBtn}>
          <Text style={styles.cameraBtnText}>📷</Text>
        </TouchableOpacity>
      </View>

      {/* ── Tab Bar ── */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Tab Content ── */}
      <View style={styles.content}>

        {activeTab === 'wheel' && (
          <View style={styles.wheelTab}>
            <ColorWheelDial
              initialHex={currentHex}
              onColorChange={handleWheelColor}
            />
          </View>
        )}

        {activeTab === 'stash' && (
          <View style={styles.stashTab}>
            <SwatchGrid onColorSelect={handleSwatchSelect}/>
          </View>
        )}

      </View>

      {/* ── Find Harmonies CTA ── */}
      <View style={styles.ctaBar}>
        {/* Selected color preview */}
        <View style={styles.ctaColorPreview}>
          <View style={[styles.ctaColorSwatch, { backgroundColor: currentHex }]}/>
          <View>
            <Text style={styles.ctaColorName} numberOfLines={1}>
              {sourceName || currentHex.toUpperCase()}
            </Text>
            {sourceName && (
              <Text style={styles.ctaColorHex}>{currentHex.toUpperCase()}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity onPress={handleFindHarmonies} style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Find Harmonies →</Text>
        </TouchableOpacity>
      </View>

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
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: N2.white,
  },
  headerSub: {
    fontSize: 12,
    color: N2.mint,
    marginTop: 2,
  },
  cameraBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBtnText: {
    fontSize: 20,
  },

  // Tabs
  tabBar: {
    flexDirection: 'row',
    backgroundColor: N2.white,
    borderBottomWidth: 0.5,
    borderBottomColor: N2.lightBorder,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: N2.deepPlum,
  },
  tabIcon: {
    fontSize: 14,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: N2.midGray,
  },
  tabLabelActive: {
    color: N2.deepPlum,
    fontWeight: '700',
  },

  // Content
  content: {
    flex: 1,
  },
  wheelTab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  stashTab: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // CTA Bar
  ctaBar: {
    backgroundColor: N2.white,
    borderTopWidth: 0.5,
    borderTopColor: N2.lightBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ctaColorPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  ctaColorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  ctaColorName: {
    fontSize: 13,
    fontWeight: '600',
    color: N2.darkText,
    maxWidth: 120,
  },
  ctaColorHex: {
    fontSize: 11,
    color: N2.midGray,
    fontFamily: 'monospace',
    marginTop: 1,
  },
  ctaButton: {
    backgroundColor: N2.deepPlum,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  ctaButtonText: {
    color: N2.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
