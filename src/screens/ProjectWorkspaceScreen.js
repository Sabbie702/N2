// src/screens/ProjectWorkspaceScreen.js
// N2 — Project workspace: shows saved palettes for a specific project.
// Each palette can be resumed for editing or removed.

import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { SavedPaletteCard }          from '../components/SavedPaletteCard';
import { loadProjects, removePaletteFromProject } from '../storage/projects';

const BRAND = {
  plum: '#5B2D8E', mint: '#4EC9A0', lt: '#1a1a2e',
  mu: '#6b6b8a', di: '#aaaabc', card: '#f7f7f7', bo: 'rgba(0,0,0,0.09)',
};

export default function ProjectWorkspaceScreen({ navigation, route }) {
  const { projectId, projectName, projectType } = route.params;
  const [palettes, setPalettes] = useState([]);

  // Reload every time the screen comes into focus (e.g. after a save or update)
  useFocusEffect(
    useCallback(() => {
      loadProjects().then((projects) => {
        const project = projects.find(p => p.id === projectId);
        setPalettes(project?.palettes || []);
      });
    }, [projectId])
  );

  const handleResumeEdit = (palette) => {
    navigation.navigate('ColorWheel', {
      resumePalette: {
        colors:      palette.colors,
        typeId:      Object.entries(require('../utils/colorHarmony').PALETTE_TYPES)
                       .find(([, v]) => v.label === palette.type)?.[0] || 'sisters',
        paletteId:   palette.id,
        projectId,
        projectName,
        projectType,
      },
    });
  };

  const handleRemove = (palette) => {
    Alert.alert(
      'Remove palette',
      'Are you sure you want to remove this palette from the project?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removePaletteFromProject(projectId, palette.id);
            setPalettes(prev => prev.filter(p => p.id !== palette.id));
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Project header card */}
      <View style={styles.projectCard}>
        <View style={styles.projectCardLeft}>
          <Text style={styles.projectName}>{projectName}</Text>
          <Text style={styles.projectType}>{projectType}</Text>
        </View>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{projectType}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Section header */}
        <View style={styles.sectionHdr}>
          <View style={styles.mintDot} />
          <Text style={styles.sectionTitle}>Saved palettes</Text>
          <TouchableOpacity
            style={styles.addPaletteBtn}
            onPress={() => navigation.navigate('ColorWheel')}
            activeOpacity={0.8}
          >
            <Ionicons name="color-palette-outline" size={12} color={BRAND.plum} />
            <Text style={styles.addPaletteBtnText}>Add palette</Text>
          </TouchableOpacity>
        </View>

        {palettes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🎨</Text>
            <Text style={styles.emptyTitle}>No palettes yet</Text>
            <Text style={styles.emptySubtitle}>
              Use the Color Wheel to build a palette, then save it here.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => navigation.navigate('ColorWheel')}
              activeOpacity={0.85}
            >
              <Text style={styles.emptyBtnText}>Open Color Wheel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.paletteList}>
            {palettes.map((palette) => (
              <SavedPaletteCard
                key={palette.id}
                palette={palette}
                onResumeEdit={() => handleResumeEdit(palette)}
                onRemove={() => handleRemove(palette)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  // Project header
  projectCard: {
    flexDirection: 'row', alignItems: 'center',
    margin: 14, marginBottom: 6,
    backgroundColor: '#fff',
    borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: BRAND.bo,
    shadowColor: BRAND.lt,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  projectCardLeft: { flex: 1 },
  projectName:     { fontSize: 16, fontWeight: '700', color: BRAND.lt },
  projectType:     { fontSize: 11, color: BRAND.mu, marginTop: 2 },
  typeBadge: {
    backgroundColor: 'rgba(192,132,252,0.18)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  typeBadgeText: { fontSize: 11, fontWeight: '600', color: BRAND.plum },

  // Section header
  sectionHdr: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingTop: 8, paddingBottom: 8,
  },
  mintDot:      { width: 6, height: 6, borderRadius: 3, backgroundColor: BRAND.mint },
  sectionTitle: { flex: 1, fontSize: 11, fontWeight: '600', color: BRAND.mu },
  addPaletteBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(91,45,142,0.07)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  addPaletteBtnText: { fontSize: 10, fontWeight: '500', color: BRAND.plum },

  // Palette list
  paletteList: { paddingBottom: 24 },

  // Empty state
  emptyContainer: {
    alignItems: 'center', padding: 32, paddingTop: 40,
  },
  emptyEmoji:    { fontSize: 44, marginBottom: 14 },
  emptyTitle:    { fontSize: 17, fontWeight: '700', color: BRAND.lt, marginBottom: 8 },
  emptySubtitle: {
    fontSize: 13, color: BRAND.mu, textAlign: 'center',
    lineHeight: 20, marginBottom: 20,
  },
  emptyBtn: {
    backgroundColor: BRAND.plum,
    paddingHorizontal: 20, paddingVertical: 11, borderRadius: 10,
  },
  emptyBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
});
