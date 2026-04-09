// src/screens/ProjectWorkspaceScreen.js
// In-flight project view: stage tracker, to-do checklist, saved palettes.
// Stage and todo changes auto-save to AsyncStorage.

import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, SafeAreaView, TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { SavedPaletteCard } from '../components/SavedPaletteCard';
import { loadProjects, removePaletteFromProject, updateProject } from '../storage/projects';

const BRAND = {
  plum: '#5B2D8E', mint: '#4EC9A0', lt: '#1a1a2e',
  mu: '#6b6b8a', bo: 'rgba(0,0,0,0.09)',
};
const DEFAULT_TODOS = ['Label', 'Photograph', 'Share'];

// ─── Stage Tracker ────────────────────────────────────────────────────────────
function StageTracker({ stages, currentStageIndex, onStageChange }) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHdr}>
        <View style={[styles.sectionDot, { backgroundColor: BRAND.plum }]} />
        <Text style={styles.sectionTitle}>Project Stage</Text>
        <Text style={styles.sectionHint}>Tap to advance</Text>
      </View>
      {stages.map((stage, i) => {
        const isDone    = i < currentStageIndex;
        const isCurrent = i === currentStageIndex;
        return (
          <TouchableOpacity
            key={stage}
            style={[styles.stageRow, isCurrent && styles.stageRowCurrent, isDone && styles.stageRowDone]}
            onPress={() => onStageChange(i)}
            activeOpacity={0.75}
          >
            <View style={[styles.stageIcon, isDone && styles.stageIconDone, isCurrent && styles.stageIconCurrent]}>
              {isDone ? (
                <Ionicons name="checkmark" size={12} color="#fff" />
              ) : isCurrent ? (
                <View style={styles.stageIconDot} />
              ) : (
                <Text style={styles.stageNum}>{i + 1}</Text>
              )}
            </View>
            <Text style={[styles.stageLabel, isDone && styles.stageLabelDone, isCurrent && styles.stageLabelCurrent]}>
              {stage}
            </Text>
            {isCurrent && (
              <View style={styles.currentPill}>
                <Text style={styles.currentPillText}>Current</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Todo List ────────────────────────────────────────────────────────────────
function TodoList({ todos, onToggle, onAdd, onRemoveCustom }) {
  const [newItem, setNewItem] = useState('');
  const doneCount = todos.filter(t => t.done).length;

  const handleAdd = () => {
    if (!newItem.trim()) return;
    onAdd(newItem.trim());
    setNewItem('');
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHdr}>
        <View style={[styles.sectionDot, { backgroundColor: BRAND.mint }]} />
        <Text style={styles.sectionTitle}>To Do</Text>
        <Text style={styles.sectionHint}>{doneCount}/{todos.length} done</Text>
      </View>
      {todos.map((item, i) => (
        <TouchableOpacity key={i} style={styles.todoRow} onPress={() => onToggle(i)} activeOpacity={0.7}>
          <Ionicons
            name={item.done ? 'checkbox' : 'square-outline'}
            size={22}
            color={item.done ? BRAND.mint : '#c4b5d4'}
          />
          <Text style={[styles.todoLabel, item.done && styles.todoLabelDone]}>{item.label}</Text>
          {!DEFAULT_TODOS.includes(item.label) && (
            <TouchableOpacity onPress={() => onRemoveCustom(i)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle-outline" size={16} color="#bbb" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      ))}
      <View style={styles.todoAddRow}>
        <TextInput
          style={styles.todoInput}
          value={newItem}
          onChangeText={setNewItem}
          placeholder="Add item…"
          placeholderTextColor="#bbb"
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <TouchableOpacity onPress={handleAdd} style={styles.todoAddBtn}>
          <Ionicons name="add" size={18} color={BRAND.plum} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function ProjectWorkspaceScreen({ navigation, route }) {
  const { projectId, projectName, projectType } = route.params;
  const [palettes, setPalettes]               = useState([]);
  const [project, setProject]                 = useState(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [todos, setTodos]                     = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadProjects().then((projects) => {
        const found = projects.find(p => p.id === projectId);
        setProject(found || null);
        setPalettes(found?.palettes || []);
        setCurrentStageIndex(found?.currentStageIndex ?? 0);
        setTodos(found?.todos?.length
          ? found.todos
          : DEFAULT_TODOS.map(label => ({ label, done: false }))
        );
      });
    }, [projectId])
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => project && navigation.navigate('EditProject', { project })}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="pencil-outline" size={20} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, project]);

  // Auto-save stage change
  const handleStageChange = async (index) => {
    if (!project) return;
    const stages = project.stages || [];
    const progress = stages.length > 1 ? index / (stages.length - 1) : index > 0 ? 1 : 0;
    setCurrentStageIndex(index);
    setProject(prev => ({ ...prev, currentStageIndex: index, stage: stages[index], progress }));
    await updateProject(projectId, { currentStageIndex: index, stage: stages[index], progress });
  };

  // Auto-save todo toggle
  const handleTodoToggle = async (i) => {
    const updated = todos.map((t, idx) => idx === i ? { ...t, done: !t.done } : t);
    setTodos(updated);
    await updateProject(projectId, { todos: updated });
  };

  const handleTodoAdd = async (label) => {
    const updated = [...todos, { label, done: false }];
    setTodos(updated);
    await updateProject(projectId, { todos: updated });
  };

  const handleTodoRemove = async (i) => {
    const updated = todos.filter((_, idx) => idx !== i);
    setTodos(updated);
    await updateProject(projectId, { todos: updated });
  };

  const handleRemovePalette = (palette) => {
    Alert.alert(
      'Remove palette',
      'Are you sure you want to remove this palette?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove', style: 'destructive',
          onPress: async () => {
            await removePaletteFromProject(projectId, palette.id);
            setPalettes(prev => prev.filter(p => p.id !== palette.id));
          },
        },
      ]
    );
  };

  const handleResumeEdit = (palette) => {
    navigation.navigate('ColorWheel', {
      resumePalette: {
        colors:    palette.colors,
        typeId:    Object.entries(require('../utils/colorHarmony').PALETTE_TYPES)
                     .find(([, v]) => v.label === palette.type)?.[0] || 'sisters',
        paletteId: palette.id,
        projectId, projectName, projectType,
      },
    });
  };

  const stages = project?.stages || [];
  const pct    = project?.progress != null ? Math.round(project.progress * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Project header card */}
      <View style={styles.projectCard}>
        <View style={styles.projectCardLeft}>
          <Text style={styles.projectName}>{project?.name || projectName}</Text>
          <Text style={styles.projectStage}>{project?.stage || '—'}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>
        </View>
        <View>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{projectType}</Text>
          </View>
          <Text style={styles.pctText}>{pct}%</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Stage Tracker */}
        {stages.length > 0 && (
          <StageTracker
            stages={stages}
            currentStageIndex={currentStageIndex}
            onStageChange={handleStageChange}
          />
        )}

        {/* To-Do */}
        <TodoList
          todos={todos}
          onToggle={handleTodoToggle}
          onAdd={handleTodoAdd}
          onRemoveCustom={handleTodoRemove}
        />

        {/* Saved palettes */}
        <View style={styles.paletteSection}>
          <View style={styles.sectionHdr}>
            <View style={[styles.sectionDot, { backgroundColor: '#60a5fa' }]} />
            <Text style={styles.sectionTitle}>Saved Palettes</Text>
            <TouchableOpacity style={styles.addPaletteBtn} onPress={() => navigation.navigate('ColorWheel')} activeOpacity={0.8}>
              <Ionicons name="color-palette-outline" size={12} color={BRAND.plum} />
              <Text style={styles.addPaletteBtnText}>Add palette</Text>
            </TouchableOpacity>
          </View>

          {palettes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🎨</Text>
              <Text style={styles.emptyTitle}>No palettes yet</Text>
              <Text style={styles.emptySubtitle}>Use the Color Wheel to build a palette, then save it here.</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('ColorWheel')} activeOpacity={0.85}>
                <Text style={styles.emptyBtnText}>Open Color Wheel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            palettes.map(palette => (
              <SavedPaletteCard
                key={palette.id}
                palette={palette}
                onResumeEdit={() => handleResumeEdit(palette)}
                onRemove={() => handleRemovePalette(palette)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  projectCard: {
    flexDirection: 'row', alignItems: 'center',
    margin: 14, marginBottom: 6,
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: BRAND.bo,
    shadowColor: BRAND.lt, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  projectCardLeft: { flex: 1 },
  projectName:  { fontSize: 16, fontWeight: '700', color: BRAND.lt },
  projectStage: { fontSize: 11, color: BRAND.plum, fontWeight: '600', marginTop: 2 },
  progressTrack: {
    height: 5, backgroundColor: '#e8e0f0',
    borderRadius: 3, overflow: 'hidden', marginTop: 8, marginRight: 12,
  },
  progressFill: { height: '100%', backgroundColor: BRAND.mint, borderRadius: 3 },
  typeBadge: {
    backgroundColor: 'rgba(192,132,252,0.18)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
    alignItems: 'center',
  },
  typeBadgeText: { fontSize: 11, fontWeight: '600', color: BRAND.plum },
  pctText:       { fontSize: 12, fontWeight: '700', color: BRAND.plum, textAlign: 'center', marginTop: 6 },

  // Section card (stage tracker, todo)
  sectionCard: {
    backgroundColor: '#fff', borderRadius: 14,
    marginHorizontal: 14, marginTop: 10,
    borderWidth: 1, borderColor: BRAND.bo,
    overflow: 'hidden',
  },
  sectionHdr: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingTop: 12, paddingBottom: 8,
  },
  sectionDot:   { width: 7, height: 7, borderRadius: 4 },
  sectionTitle: { flex: 1, fontSize: 12, fontWeight: '700', color: BRAND.mu, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionHint:  { fontSize: 11, color: '#bbb' },

  // Stage rows
  stageRow:    { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, paddingHorizontal: 14, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.04)' },
  stageRowCurrent: { backgroundColor: 'rgba(91,45,142,0.06)' },
  stageRowDone:    { opacity: 0.55 },
  stageIcon:       { width: 24, height: 24, borderRadius: 12, backgroundColor: '#e8e0f0', alignItems: 'center', justifyContent: 'center' },
  stageIconDone:    { backgroundColor: BRAND.mint },
  stageIconCurrent: { backgroundColor: BRAND.plum },
  stageIconDot:    { width: 7, height: 7, borderRadius: 4, backgroundColor: '#fff' },
  stageNum:        { fontSize: 10, fontWeight: '600', color: '#6b6b8a' },
  stageLabel:      { flex: 1, fontSize: 13, color: BRAND.lt },
  stageLabelDone:    { color: '#9ca3af', textDecorationLine: 'line-through' },
  stageLabelCurrent: { fontWeight: '700', color: BRAND.plum },
  currentPill:     { backgroundColor: BRAND.plum, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  currentPillText: { fontSize: 9, color: '#fff', fontWeight: '600' },

  // Todo rows
  todoRow:       { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 14, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.04)' },
  todoLabel:     { flex: 1, fontSize: 14, color: BRAND.lt },
  todoLabelDone: { textDecorationLine: 'line-through', color: '#9ca3af' },
  todoAddRow:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.04)' },
  todoInput:     { flex: 1, fontSize: 14, color: BRAND.lt, paddingVertical: 4 },
  todoAddBtn:    { padding: 6, backgroundColor: 'rgba(91,45,142,0.08)', borderRadius: 8 },

  // Palettes
  paletteSection: { marginTop: 10 },
  addPaletteBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(91,45,142,0.07)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  addPaletteBtnText: { fontSize: 10, fontWeight: '500', color: BRAND.plum },
  emptyContainer: { alignItems: 'center', padding: 32, paddingTop: 24 },
  emptyEmoji:    { fontSize: 40, marginBottom: 12 },
  emptyTitle:    { fontSize: 16, fontWeight: '700', color: BRAND.lt, marginBottom: 6 },
  emptySubtitle: { fontSize: 13, color: BRAND.mu, textAlign: 'center', lineHeight: 20, marginBottom: 18 },
  emptyBtn:      { backgroundColor: BRAND.plum, paddingHorizontal: 20, paddingVertical: 11, borderRadius: 10 },
  emptyBtnText:  { fontSize: 13, fontWeight: '600', color: '#fff' },
});
