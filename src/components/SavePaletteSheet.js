// src/components/SavePaletteSheet.js
// N2 — Color Wheel Intelligence
// Slide-up modal for saving a palette to a project.
// Replaces @gorhom/bottom-sheet with a native Modal + Animated.

import React, { useState, useEffect, useRef } from 'react';
import {
  Modal, View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Animated, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { loadProjects, savePaletteToProject } from '../storage/projects';

const BRAND = {
  plum: '#5B2D8E', mint: '#4EC9A0',
  lt: '#1a1a2e', mu: '#6b6b8a', di: '#aaaabc',
  card: '#f7f7f7', bo: 'rgba(0,0,0,0.09)',
};

/**
 * SavePaletteSheet
 *
 * Props:
 *   visible      {boolean}
 *   onClose      {() => void}
 *   colors       {string[]}
 *   typeLabel    {string}
 *   anchorHex    {string}
 *   navigation   React Navigation navigation prop
 */
export function SavePaletteSheet({ visible, onClose, colors, typeLabel, anchorHex, navigation }) {
  const [projects, setProjects]         = useState([]);
  const [selectedId, setSelectedId]     = useState(null);
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);
  const [savedProject, setSavedProject] = useState(null);
  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (visible) {
      loadProjects().then(setProjects);
      setSelectedId(null);
      setSaved(false);
      setSavedProject(null);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 400,
        duration: 180,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSave = async () => {
    const project = projects.find(p => p.id === selectedId);
    if (!project) return;
    setSaving(true);
    const palette = {
      id: Date.now().toString(),
      colors,
      type: typeLabel,
      anchorHex,
      savedAt: new Date().toISOString(),
      updatedAt: null,
    };
    await savePaletteToProject(selectedId, palette);
    setSavedProject(project);
    setSaving(false);
    setSaved(true);
  };

  const handleOpenProject = () => {
    onClose();
    if (savedProject) {
      navigation.navigate('Projects', {
        screen: 'ProjectWorkspace',
        params: {
          projectId: savedProject.id,
          projectName: savedProject.name,
          projectType: savedProject.type,
        },
      });
    }
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onClose}>
      {/* Backdrop */}
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

      {/* Sheet */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        {/* Handle */}
        <View style={styles.handle} />

        {saved ? (
          // ── Success state ──
          <View style={styles.successBody}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={40} color={BRAND.mint} />
            </View>
            <Text style={styles.successTitle}>Palette saved!</Text>
            <Text style={styles.successSub}>
              Added to <Text style={{ fontWeight: '600', color: BRAND.lt }}>{savedProject?.name}</Text>
            </Text>
            <View style={styles.successActions}>
              <TouchableOpacity style={styles.openBtn} onPress={handleOpenProject} activeOpacity={0.85}>
                <Text style={styles.openBtnText}>Open project</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.8}>
                <Text style={styles.doneBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // ── Project picker ──
          <>
            <View style={styles.sheetHdr}>
              <View style={styles.swatchRow}>
                {colors.map((hex, i) => (
                  <View key={i} style={[styles.previewSwatch, { backgroundColor: hex }]} />
                ))}
              </View>
              <View style={styles.sheetMeta}>
                <Text style={styles.sheetTitle}>Save to a project</Text>
                <Text style={styles.sheetSub}>{typeLabel} palette</Text>
              </View>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={20} color={BRAND.mu} />
              </TouchableOpacity>
            </View>

            {projects.length === 0 ? (
              <View style={styles.emptyPicker}>
                <Text style={styles.emptyText}>No projects yet — create one in the Projects tab first.</Text>
              </View>
            ) : (
              <ScrollView style={styles.projectList} showsVerticalScrollIndicator={false}>
                {projects.map((p) => {
                  const isSelected = p.id === selectedId;
                  return (
                    <TouchableOpacity
                      key={p.id}
                      style={[styles.projectRow, isSelected && styles.projectRowSelected]}
                      onPress={() => setSelectedId(p.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.projectRowLeft}>
                        <Text style={[styles.projectRowName, isSelected && styles.projectRowNameSelected]}>
                          {p.name}
                        </Text>
                        <Text style={styles.projectRowType}>{p.type}</Text>
                      </View>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={18} color={BRAND.plum} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            <TouchableOpacity
              style={[styles.saveBtn, (!selectedId || saving) && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={!selectedId || saving}
              activeOpacity={0.85}
            >
              {saving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={14} color="#fff" />
                  <Text style={styles.saveBtnText}>
                    {selectedId
                      ? `Save to ${projects.find(p => p.id === selectedId)?.name}`
                      : 'Select a project above'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 36,
    maxHeight: '75%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: BRAND.di,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 14,
  },

  // Header
  sheetHdr: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.bo,
  },
  swatchRow: { flexDirection: 'row', gap: 3 },
  previewSwatch: {
    width: 18, height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
  },
  sheetMeta: { flex: 1 },
  sheetTitle: { fontSize: 13, fontWeight: '600', color: BRAND.lt },
  sheetSub:   { fontSize: 10, color: BRAND.mu, marginTop: 1 },

  // Project list
  projectList: { maxHeight: 220, marginTop: 4 },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.bo,
  },
  projectRowSelected: {
    backgroundColor: 'rgba(91,45,142,0.05)',
  },
  projectRowLeft: { flex: 1 },
  projectRowName: { fontSize: 13, color: BRAND.lt },
  projectRowNameSelected: { color: BRAND.plum, fontWeight: '600' },
  projectRowType: { fontSize: 10, color: BRAND.di, marginTop: 2 },

  // Empty state
  emptyPicker: { padding: 24, alignItems: 'center' },
  emptyText:   { fontSize: 12, color: BRAND.mu, textAlign: 'center', lineHeight: 18 },

  // Save button
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: BRAND.plum,
    paddingVertical: 13,
    borderRadius: 11,
  },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },

  // Success state
  successBody: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 8, paddingBottom: 8 },
  successIcon: { marginBottom: 10 },
  successTitle: { fontSize: 17, fontWeight: '700', color: BRAND.lt, marginBottom: 6 },
  successSub:   { fontSize: 13, color: BRAND.mu, marginBottom: 20 },
  successActions: { flexDirection: 'row', gap: 10, width: '100%' },
  openBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 12,
    backgroundColor: BRAND.plum, borderRadius: 10,
  },
  openBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  doneBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 12,
    backgroundColor: BRAND.card, borderRadius: 10,
    borderWidth: 1, borderColor: BRAND.bo,
  },
  doneBtnText: { fontSize: 13, fontWeight: '500', color: BRAND.mu },
});
