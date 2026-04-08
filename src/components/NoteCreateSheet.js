// src/components/NoteCreateSheet.js
// Slide-up bottom sheet for creating a new Nimble Note.
// Contains: colour picker, text area, char counter, project link, Save/Cancel.

import React, { useState, useEffect, useRef } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Animated, KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { loadProjects } from '../storage/projects';
import { NOTE_COLORS } from './NoteCard';

const MAX_CHARS = 280;
const BRAND = {
  plum: '#5B2D8E', mint: '#4EC9A0',
  lt: '#1a1a2e', mu: '#6b6b8a', di: '#aaaabc',
  bo: 'rgba(0,0,0,0.09)',
};

/**
 * NoteCreateSheet
 *
 * Props:
 *   visible    {boolean}
 *   onClose    {() => void}
 *   onSave     {(note) => void}  called with the new note object
 */
export function NoteCreateSheet({ visible, onClose, onSave }) {
  const [text, setText]                   = useState('');
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0].tint);
  const [projects, setProjects]           = useState([]);
  const [projectOpen, setProjectOpen]     = useState(false);
  const [linkedProjectId, setLinkedProjectId] = useState(null);
  const [linkedProjectName, setLinkedProjectName] = useState(null);

  const slideAnim = useRef(new Animated.Value(500)).current;
  const inputRef  = useRef(null);

  useEffect(() => {
    if (visible) {
      loadProjects().then(setProjects);
      Animated.spring(slideAnim, {
        toValue: 0, useNativeDriver: true, bounciness: 3,
      }).start(() => inputRef.current?.focus());
    } else {
      Animated.timing(slideAnim, {
        toValue: 500, duration: 200, useNativeDriver: true,
      }).start();
      // Reset
      setText('');
      setSelectedColor(NOTE_COLORS[0].tint);
      setLinkedProjectId(null);
      setLinkedProjectName(null);
      setProjectOpen(false);
    }
  }, [visible]);

  const handleSave = () => {
    if (!text.trim()) return;
    onSave({
      id: Date.now().toString(),
      text: text.trim(),
      color: selectedColor,
      projectId: linkedProjectId,
      projectName: linkedProjectName,
      createdAt: new Date().toISOString(),
    });
    onClose();
  };

  const handleProjectChip = (project) => {
    if (linkedProjectId === project.id) {
      setLinkedProjectId(null);
      setLinkedProjectName(null);
    } else {
      setLinkedProjectId(project.id);
      setLinkedProjectName(project.name);
    }
    setProjectOpen(false);
  };

  const charsLeft = MAX_CHARS - text.length;
  const canSave   = text.trim().length > 0;

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kvWrapper}
        pointerEvents="box-none"
      >
        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Colour picker */}
          <View style={styles.colorRow}>
            {NOTE_COLORS.map((c) => (
              <TouchableOpacity
                key={c.tint}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: c.tint, borderColor: c.border },
                  selectedColor === c.tint && styles.colorSwatchSelected,
                ]}
                onPress={() => setSelectedColor(c.tint)}
                activeOpacity={0.8}
              >
                {selectedColor === c.tint && (
                  <Ionicons name="checkmark" size={12} color={c.border} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Text area */}
          <TextInput
            ref={inputRef}
            style={[styles.input, { backgroundColor: selectedColor }]}
            value={text}
            onChangeText={(t) => setText(t.slice(0, MAX_CHARS))}
            placeholder="What's on your mind?"
            placeholderTextColor="#aaaabc"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            maxLength={MAX_CHARS}
          />

          {/* Character counter */}
          <Text style={[styles.charCount, charsLeft <= 20 && styles.charCountWarn]}>
            {charsLeft} characters left
          </Text>

          {/* Project link */}
          <TouchableOpacity
            style={styles.projectTrigger}
            onPress={() => setProjectOpen(o => !o)}
            activeOpacity={0.8}
          >
            <Ionicons name="link-outline" size={14} color={BRAND.mu} />
            <Text style={styles.projectTriggerText}>
              {linkedProjectName ? linkedProjectName : 'Link to a project'}
            </Text>
            <Ionicons
              name={projectOpen ? 'chevron-up' : 'chevron-down'}
              size={13} color={BRAND.di}
            />
          </TouchableOpacity>

          {projectOpen && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {projects.length === 0 ? (
                <Text style={styles.noProjectsText}>No projects yet</Text>
              ) : (
                projects.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.chip, linkedProjectId === p.id && styles.chipSelected]}
                    onPress={() => handleProjectChip(p)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.chipText, linkedProjectId === p.id && styles.chipTextSelected]}>
                      {p.name}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={!canSave}
              activeOpacity={0.85}
            >
              <Text style={styles.saveText}>Save note</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  kvWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: '#ddd', alignSelf: 'center', marginBottom: 14,
  },

  // Colour picker
  colorRow: {
    flexDirection: 'row', gap: 10, marginBottom: 12,
  },
  colorSwatch: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  colorSwatchSelected: {
    borderWidth: 2.5,
  },

  // Text input
  input: {
    borderRadius: 10, padding: 12, minHeight: 110,
    fontSize: 15, color: '#2D1B4E',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
    marginBottom: 4,
  },

  // Char counter
  charCount: {
    fontSize: 11, color: '#aaaabc',
    textAlign: 'right', marginBottom: 10,
  },
  charCountWarn: { color: '#F59E0B' },

  // Project link
  projectTrigger: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 10, paddingHorizontal: 12,
    borderRadius: 10, backgroundColor: '#f7f7f7',
    marginBottom: 8, borderWidth: 1, borderColor: 'rgba(0,0,0,0.07)',
  },
  projectTriggerText: { flex: 1, fontSize: 13, color: '#6b6b8a' },

  // Chips
  chipRow: { gap: 7, paddingHorizontal: 2, paddingBottom: 10 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, backgroundColor: '#f0eaf8',
    borderWidth: 1, borderColor: 'rgba(91,45,142,0.15)',
  },
  chipSelected: { backgroundColor: BRAND.plum, borderColor: BRAND.plum },
  chipText: { fontSize: 12, color: BRAND.plum },
  chipTextSelected: { color: '#fff', fontWeight: '600' },
  noProjectsText: { fontSize: 12, color: '#aaaabc', padding: 8 },

  // Actions
  actions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelBtn: {
    flex: 1, paddingVertical: 13, alignItems: 'center',
    borderRadius: 11, backgroundColor: '#f3f3f3',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.07)',
  },
  cancelText: { fontSize: 14, color: '#6b6b8a', fontWeight: '500' },
  saveBtn: {
    flex: 2, paddingVertical: 13, alignItems: 'center',
    borderRadius: 11, backgroundColor: BRAND.plum,
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveText: { fontSize: 14, color: '#fff', fontWeight: '700' },
});
