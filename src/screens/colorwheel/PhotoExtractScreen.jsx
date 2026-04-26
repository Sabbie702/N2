/**
 * N2 — Nimble Needle
 * PhotoExtractScreen
 *
 * Camera / gallery flow for extracting fabric colors.
 * Uses on-device k-means — no external API, works offline.
 *
 * Flow:
 *   1. Camera or gallery picker
 *   2. K-means runs on device → 3-5 colors
 *   3. ExtractedPalette asks user to pick one
 *   4. Navigate to HarmonyResultsScreen
 */

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Image,
  StyleSheet, SafeAreaView, StatusBar,
  Alert, ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { extractColors } from '../../utils/kMeansExtractor';
import { ExtractedPalette } from '../../components/colorwheel/ColorWheelComponents';

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

export default function PhotoExtractScreen({ navigation }) {
  const [photoUri,       setPhotoUri]       = useState(null);
  const [extractedColors, setExtractedColors] = useState([]);
  const [selectedColor,  setSelectedColor]  = useState(null);
  const [loading,        setLoading]        = useState(false);

  const requestPermission = async (type) => {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    }
  };

  const launchCamera = async () => {
    const permitted = await requestPermission('camera');
    if (!permitted) {
      Alert.alert('Permission needed', 'N2 needs camera access to photograph your fabric.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality:    0.6,
      allowsEditing: true,
      aspect:     [1, 1],    // Square crop works best for fabric
    });

    if (!result.canceled && result.assets[0]) {
      await processPhoto(result.assets[0].uri);
    }
  };

  const launchGallery = async () => {
    const permitted = await requestPermission('gallery');
    if (!permitted) {
      Alert.alert('Permission needed', 'N2 needs photo library access to select your fabric photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality:    0.8,
      allowsEditing: true,
      aspect:     [1, 1],
    });

    if (!result.canceled && result.assets[0]) {
      await processPhoto(result.assets[0].uri);
    }
  };

  const processPhoto = async (uri) => {
    setPhotoUri(uri);
    setLoading(true);
    setExtractedColors([]);
    setSelectedColor(null);

    try {
      const colors = await extractColors(uri, 5);
      setExtractedColors(colors);
    } catch (err) {
      Alert.alert(
        'Extraction failed',
        'We couldn\'t extract colors from that photo. Please try again with better lighting.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleFindHarmonies = () => {
    if (!selectedColor) return;
    navigation.navigate('HarmonyResults', {
      sourceHex:  selectedColor.hex,
      sourceName: `Fabric color (${selectedColor.percent}%)`,
      sourceType: 'photo',
    });
  };

  const handleRetake = () => {
    setPhotoUri(null);
    setExtractedColors([]);
    setSelectedColor(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={N2.midnight}/>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Photograph Fabric</Text>
          <Text style={styles.headerSub}>Colors extracted on your device</Text>
        </View>
        <View style={{ width: 36 }}/>
      </View>

      <View style={styles.content}>

        {/* ── No photo yet: picker options ── */}
        {!photoUri && !loading && (
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>📸 Add a fabric photo</Text>
            <Text style={styles.pickerSubtitle}>
              Works with solid fabrics, printed fabrics, florals, batiks and more.
              Colors are extracted right here on your phone — no internet needed.
            </Text>

            <TouchableOpacity onPress={launchCamera} style={styles.pickerBtn}>
              <Text style={styles.pickerBtnIcon}>📷</Text>
              <View>
                <Text style={styles.pickerBtnTitle}>Take a photo</Text>
                <Text style={styles.pickerBtnSub}>Use your camera now</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={launchGallery} style={[styles.pickerBtn, styles.pickerBtnSecondary]}>
              <Text style={styles.pickerBtnIcon}>🖼️</Text>
              <View>
                <Text style={styles.pickerBtnTitle}>Choose from library</Text>
                <Text style={styles.pickerBtnSub}>Pick an existing photo</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.photoTip}>
              💡 Tip: Lay your fabric flat in good natural light for best results.
              Printed fabrics work well — we'll find all the colors in the design.
            </Text>
          </View>
        )}

        {/* ── Loading ── */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={N2.mint} size="large"/>
            <Text style={styles.loadingTitle}>Extracting fabric colors…</Text>
            <Text style={styles.loadingSubtitle}>
              Running color analysis on your device
            </Text>
          </View>
        )}

        {/* ── Photo + extracted colors ── */}
        {photoUri && !loading && extractedColors.length > 0 && (
          <View style={styles.resultsContainer}>

            {/* Photo thumbnail */}
            <View style={styles.photoRow}>
              <Image source={{ uri: photoUri }} style={styles.photoThumb}/>
              <TouchableOpacity onPress={handleRetake} style={styles.retakeBtn}>
                <Text style={styles.retakeBtnText}>Retake</Text>
              </TouchableOpacity>
            </View>

            {/* Color picker */}
            <ExtractedPalette
              colors={extractedColors}
              onColorSelect={handleColorSelect}
            />

          </View>
        )}

      </View>

      {/* ── CTA ── */}
      {selectedColor && (
        <View style={styles.ctaBar}>
          <View style={styles.ctaColorPreview}>
            <View style={[styles.ctaSwatch, { backgroundColor: selectedColor.hex }]}/>
            <Text style={styles.ctaHex}>{selectedColor.hex.toUpperCase()}</Text>
          </View>
          <TouchableOpacity onPress={handleFindHarmonies} style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Find Harmonies →</Text>
          </TouchableOpacity>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: N2.lavWhite },
  header: {
    backgroundColor: N2.midnight,
    paddingHorizontal: 16, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center',
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backBtnText: { color: N2.mint, fontSize: 22, fontWeight: '300' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: N2.white },
  headerSub: { fontSize: 11, color: N2.mint, marginTop: 2 },
  content: { flex: 1, padding: 20 },

  // Picker
  pickerContainer: { flex: 1, paddingTop: 8 },
  pickerTitle: { fontSize: 20, fontWeight: '700', color: N2.darkText, marginBottom: 8 },
  pickerSubtitle: {
    fontSize: 13, color: N2.midGray, lineHeight: 19, marginBottom: 24,
  },
  pickerBtn: {
    backgroundColor: N2.white,
    borderRadius: 14, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderWidth: 0.5, borderColor: N2.lightBorder,
    marginBottom: 10,
  },
  pickerBtnSecondary: { backgroundColor: N2.lavWhite },
  pickerBtnIcon: { fontSize: 28 },
  pickerBtnTitle: { fontSize: 15, fontWeight: '600', color: N2.darkText },
  pickerBtnSub: { fontSize: 12, color: N2.midGray, marginTop: 2 },
  photoTip: {
    fontSize: 12, color: N2.midGray, fontStyle: 'italic',
    marginTop: 20, lineHeight: 18, backgroundColor: N2.white,
    borderRadius: 10, padding: 12,
    borderWidth: 0.5, borderColor: N2.lightBorder,
  },

  // Loading
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingTitle: { fontSize: 16, fontWeight: '600', color: N2.darkText, marginTop: 16 },
  loadingSubtitle: { fontSize: 13, color: N2.midGray, marginTop: 6 },

  // Results
  resultsContainer: { flex: 1 },
  photoRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 20,
  },
  photoThumb: {
    width: 80, height: 80, borderRadius: 12,
    borderWidth: 0.5, borderColor: N2.lightBorder,
  },
  retakeBtn: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5, borderColor: N2.lightBorder,
  },
  retakeBtnText: { fontSize: 13, color: N2.midGray, fontWeight: '500' },

  // CTA
  ctaBar: {
    backgroundColor: N2.white,
    borderTopWidth: 0.5, borderTopColor: N2.lightBorder,
    paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 28,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  ctaColorPreview: {
    flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1,
  },
  ctaSwatch: {
    width: 40, height: 40, borderRadius: 8,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)',
  },
  ctaHex: {
    fontSize: 13, fontWeight: '600', color: N2.darkText, fontFamily: 'monospace',
  },
  ctaButton: {
    backgroundColor: N2.deepPlum, borderRadius: 10,
    paddingHorizontal: 18, paddingVertical: 12,
  },
  ctaButtonText: { color: N2.white, fontSize: 14, fontWeight: '700' },
});
