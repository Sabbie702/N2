// src/screens/ProjectWorkspaceScreen.js
// In-flight project view: stage tracker, to-do, notes, storage spot,
// saved palettes, Move to UFO / Mark Complete actions.

import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, SafeAreaView, TextInput, Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { SavedPaletteCard } from '../components/SavedPaletteCard';
import {
  loadProjects, removePaletteFromProject, updateProject,
  moveToUFO, moveToActive, moveToScrapbook,
} from '../storage/projects';
import COLORS from '../styles/colors';

const DEFAULT_TODOS = ['Label', 'Photograph', 'Share'];

// ─── Stage Tracker (horizontal dots) ─────────────────────────────────────────
function StageTrackerDots({ stages, currentStageIndex, onStageChange }) {
  return (
    <View style={styles.stageDotsContainer}>
      {stages.map((stage, i) => {
        const isDone = i < currentStageIndex;
        const isCurrent = i === currentStageIndex;
        return (
          <React.Fragment key={stage}>
            {i > 0 && (
              <View style={[styles.stageLine, isDone && styles.stageLineDone]} />
            )}
            <TouchableOpacity
              style={[
                styles.stageDotOuter,
                isDone && styles.stageDotDone,
                isCurrent && styles.stageDotCurrent,
              ]}
              onPress={() => onStageChange(i)}
              activeOpacity={0.75}
            >
              {isDone ? (
                <Ionicons name="checkmark" size={10} color="#fff" />
              ) : isCurrent ? (
                <View style={styles.stageDotInner} />
              ) : (
                <Text style={styles.stageDotNum}>{i + 1}</Text>
              )}
            </TouchableOpacity>
          </React.Fragment>
        );
      })}
    </View>
  );
}

// ─── Stage Tracker (full list) ───────────────────────────────────────────────
function StageTrackerList({ stages, currentStageIndex, onStageChange }) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHdr}>
        <View style={[styles.sectionDot, { backgroundColor: COLORS.DEEP_PLUM }]} />
        <Text style={styles.sectionTitle}>Project Stage</Text>
        <Text style={styles.sectionHint}>Tap to advance</Text>
      </View>
      {stages.map((stage, i) => {
        const isDone = i < currentStageIndex;
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

// ─── Todo List ───────────────────────────────────────────────────────────────
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
        <View style={[styles.sectionDot, { backgroundColor: COLORS.MINT }]} />
        <Text style={styles.sectionTitle}>Smart To-Do</Text>
        <Text style={styles.sectionHint}>{doneCount}/{todos.length} done</Text>
      </View>
      {todos.map((item, i) => (
        <TouchableOpacity key={i} style={styles.todoRow} onPress={() => onToggle(i)} activeOpacity={0.7}>
          <Ionicons
            name={item.done ? 'checkbox' : 'square-outline'}
            size={22}
            color={item.done ? COLORS.MINT : '#c4b5d4'}
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
          placeholder="Add a to-do item…"
          placeholderTextColor="#bbb"
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <TouchableOpacity onPress={handleAdd} style={styles.todoAddBtn}>
          <Ionicons name="add" size={18} color={COLORS.DEEP_PLUM} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Info Row ────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={COLORS.DEEP_PLUM} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

// ─── Completion Modal ────────────────────────────────────────────────────────
function CompletionModal({ visible, projectName, onScrapbook, onContinue }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.completionOverlay}>
        <View style={styles.completionCard}>
          <View style={styles.completionCheck}>
            <Ionicons name="checkmark-circle" size={64} color={COLORS.MINT} />
          </View>
          <Text style={styles.completionTitle}>
            Great job! '{projectName}' is Complete!
          </Text>
          <Text style={styles.completionSub}>
            This will move it to your Scrapbook.
          </Text>
          <TouchableOpacity style={styles.scrapbookBtn} onPress={onScrapbook} activeOpacity={0.85}>
            <Text style={styles.scrapbookBtnText}>Move to Scrapbook</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.continueBtn} onPress={onContinue} activeOpacity={0.85}>
            <Text style={styles.continueBtnText}>Continue Creating</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function ProjectWorkspaceScreen({ navigation, route }) {
  const { projectId, projectName, projectType } = route.params;
  const [palettes, setPalettes] = useState([]);
  const [project, setProject] = useState(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [todos, setTodos] = useState([]);
  const [showCompletion, setShowCompletion] = useState(false);

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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <TouchableOpacity
            onPress={() => project && navigation.navigate('EditProject', { project })}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="pencil-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => project && navigation.navigate('EditProject', { project, showOptions: true })}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, project]);

  const handleStageChange = async (index) => {
    if (!project) return;
    const stages = project.stages || [];
    const progress = stages.length > 1 ? index / (stages.length - 1) : index > 0 ? 1 : 0;
    setCurrentStageIndex(index);
    setProject(prev => ({ ...prev, currentStageIndex: index, stage: stages[index], progress }));
    await updateProject(projectId, { currentStageIndex: index, stage: stages[index], progress });
  };

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
        colors: palette.colors,
        typeId: Object.entries(require('../utils/colorHarmony').PALETTE_TYPES)
                  .find(([, v]) => v.label === palette.type)?.[0] || 'sisters',
        paletteId: palette.id,
        projectId, projectName, projectType,
      },
    });
  };

  const handleMoveToUFO = () => {
    Alert.alert(
      'Move to UFO',
      'This project will be shelved as an Un-Finished Object. You can move it back to Active anytime.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Move to UFO',
          onPress: async () => {
            await moveToUFO(projectId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleMoveToActive = () => {
    Alert.alert(
      'Move Back to Active',
      'Ready to pick this back up?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Move to Active',
          onPress: async () => {
            await moveToActive(projectId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleMarkComplete = () => {
    setShowCompletion(true);
  };

  const handleMoveToScrapbook = async () => {
    setShowCompletion(false);
    await moveToScrapbook(projectId);
    navigation.goBack();
  };

  const stages = project?.stages || [];
  const pct = project?.progress != null ? Math.round(project.progress * 100) : 0;
  const isUFO = project?.status === 'ufo';
  const currentStageName = project?.stage || '—';

  return (
    <SafeAreaView style={styles.container}>
      {/* Project header card */}
      <View style={styles.projectCard}>
        <View style={styles.projectCardLeft}>
          <Text style={styles.projectName}>{project?.name || projectName}</Text>
          <Text style={styles.projectSubType}>
            {project?.type === 'Quilt' ? 'Quilt' : 'Bag'}
            {project?.patternName ? ` · ${project.patternName}` : ''}
          </Text>
        </View>
        <View>
          <View style={[styles.typeBadge, isUFO && { backgroundColor: COLORS.AMBER }]}>
            <Text style={[styles.typeBadgeText, isUFO && { color: '#fff' }]}>
              {isUFO ? 'UFO' : projectType}
            </Text>
          </View>
        </View>
      </View>

      {/* Stage dots */}
      {stages.length > 0 && (
        <View style={styles.stageDotsCard}>
          <StageTrackerDots
            stages={stages}
            currentStageIndex={currentStageIndex}
            onStageChange={handleStageChange}
          />
          <View style={styles.stageDotsLabels}>
            {stages.filter((_, i) => i === 0 || i === stages.length - 1 || i === currentStageIndex).map((s, i) => (
              <Text key={s} style={styles.stageDotLabel} numberOfLines={1}>{s}</Text>
            ))}
          </View>
          <View style={styles.currentStageRow}>
            <Text style={styles.currentStageLabel}>Current Stage</Text>
            <View style={[styles.currentStageBadge, isUFO && { backgroundColor: COLORS.AMBER }]}>
              <Text style={styles.currentStageBadgeText}>{currentStageName}</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>
          <Text style={styles.pctText}>{pct}% complete</Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Stage Tracker (full list) */}
        {stages.length > 0 && (
          <StageTrackerList
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

        {/* Notes & Storage Spot */}
        {(project?.notes || project?.storageSpot) && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHdr}>
              <View style={[styles.sectionDot, { backgroundColor: COLORS.SOFT_LAVENDER }]} />
              <Text style={styles.sectionTitle}>Details</Text>
            </View>
            <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
              <InfoRow icon="document-text-outline" label="Notes" value={project?.notes} />
              <InfoRow icon="location-outline" label="Storage Spot" value={project?.storageSpot} />
              {project?.type === 'Quilt' && (
                <>
                  <InfoRow icon="resize-outline" label="Size" value={project?.size} />
                  <InfoRow icon="construct-outline" label="Piecing" value={project?.piecingTechnique} />
                  <InfoRow icon="color-wand-outline" label="Quilting Style" value={project?.quiltingStyle} />
                  <InfoRow icon="person-outline" label="Quilted By" value={project?.quiltedBy} />
                  <InfoRow icon="layers-outline" label="Fabrics" value={project?.fabricsUsed} />
                </>
              )}
              {project?.type === 'Bag' && (
                <>
                  <InfoRow icon="bag-outline" label="Bag Style" value={project?.bagStyle} />
                  <InfoRow icon="resize-outline" label="Dimensions" value={project?.dimensions} />
                  <InfoRow icon="gift-outline" label="Made For" value={project?.madeFor} />
                  <InfoRow icon="person-outline" label="Made By" value={project?.madeBy} />
                </>
              )}
            </View>
          </View>
        )}

        {/* Saved palettes */}
        <View style={styles.paletteSection}>
          <View style={styles.sectionHdr}>
            <View style={[styles.sectionDot, { backgroundColor: '#60a5fa' }]} />
            <Text style={styles.sectionTitle}>Saved Palettes</Text>
            <TouchableOpacity style={styles.addPaletteBtn} onPress={() => navigation.navigate('ColorWheel')} activeOpacity={0.8}>
              <Ionicons name="color-palette-outline" size={12} color={COLORS.DEEP_PLUM} />
              <Text style={styles.addPaletteBtnText}>Add palette</Text>
            </TouchableOpacity>
          </View>

          {palettes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No palettes yet</Text>
              <Text style={styles.emptySubtitle}>Use Color Corner to build a palette, then save it here.</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('ColorWheel')} activeOpacity={0.85}>
                <Text style={styles.emptyBtnText}>Open Color Corner</Text>
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

        {/* Quilt Card / Bag Card placeholder */}
        <View style={styles.quiltCardSection}>
          <View style={styles.sectionHdr}>
            <View style={[styles.sectionDot, { backgroundColor: COLORS.DEEP_PLUM }]} />
            <Text style={styles.sectionTitle}>
              {projectType === 'Quilt' ? 'Quilt Card' : 'Bag Card'}
            </Text>
          </View>
          <TouchableOpacity style={styles.quiltCardPlaceholder} activeOpacity={0.8}>
            <Ionicons name="share-outline" size={24} color={COLORS.DEEP_PLUM} />
            <Text style={styles.quiltCardText}>
              Share your project scrapbook{'\n'}Tap to view.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          {isUFO ? (
            <TouchableOpacity style={styles.actionBtnActive} onPress={handleMoveToActive} activeOpacity={0.85}>
              <Text style={styles.actionBtnActiveText}>Move Back to Active</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.actionBtnUFO} onPress={handleMoveToUFO} activeOpacity={0.85}>
                <Text style={styles.actionBtnUFOText}>Move to UFO</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtnComplete} onPress={handleMarkComplete} activeOpacity={0.85}>
                <Text style={styles.actionBtnCompleteText}>Mark Complete</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      {/* Completion modal */}
      <CompletionModal
        visible={showCompletion}
        projectName={project?.name || projectName}
        onScrapbook={handleMoveToScrapbook}
        onContinue={() => setShowCompletion(false)}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.LAVENDER_WHITE },

  // Project card
  projectCard: {
    flexDirection: 'row', alignItems: 'center',
    margin: 14, marginBottom: 6,
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.09)',
    shadowColor: COLORS.MIDNIGHT, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  projectCardLeft: { flex: 1 },
  projectName: { fontSize: 18, fontWeight: '800', color: COLORS.MIDNIGHT },
  projectSubType: { fontSize: 12, color: 'rgba(45,27,78,0.5)', marginTop: 2 },
  typeBadge: {
    backgroundColor: 'rgba(192,132,252,0.18)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
    alignItems: 'center',
  },
  typeBadgeText: { fontSize: 11, fontWeight: '600', color: COLORS.DEEP_PLUM },

  // Stage dots
  stageDotsCard: {
    backgroundColor: '#fff', borderRadius: 14,
    marginHorizontal: 14, marginTop: 6, padding: 14,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.09)',
  },
  stageDotsContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 4,
  },
  stageDotOuter: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#e8e0f0', alignItems: 'center', justifyContent: 'center',
  },
  stageDotDone: { backgroundColor: COLORS.MINT },
  stageDotCurrent: { backgroundColor: COLORS.DEEP_PLUM },
  stageDotInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  stageDotNum: { fontSize: 8, fontWeight: '600', color: '#6b6b8a' },
  stageLine: { flex: 1, height: 2, backgroundColor: '#e8e0f0', maxWidth: 24 },
  stageLineDone: { backgroundColor: COLORS.MINT },
  stageDotsLabels: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginTop: 6, paddingHorizontal: 2,
  },
  stageDotLabel: { fontSize: 9, color: '#999', maxWidth: 70 },
  currentStageRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginTop: 12,
  },
  currentStageLabel: { fontSize: 12, fontWeight: '600', color: COLORS.MIDNIGHT },
  currentStageBadge: {
    backgroundColor: 'rgba(91,45,142,0.12)', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  currentStageBadgeText: { fontSize: 11, fontWeight: '700', color: COLORS.DEEP_PLUM },
  progressTrack: {
    height: 5, backgroundColor: '#e8e0f0',
    borderRadius: 3, overflow: 'hidden', marginTop: 10,
  },
  progressFill: { height: '100%', backgroundColor: COLORS.MINT, borderRadius: 3 },
  pctText: { fontSize: 11, color: '#999', textAlign: 'right', marginTop: 4 },

  // Section card
  sectionCard: {
    backgroundColor: '#fff', borderRadius: 14,
    marginHorizontal: 14, marginTop: 10,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.09)',
    overflow: 'hidden',
  },
  sectionHdr: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingTop: 12, paddingBottom: 8,
  },
  sectionDot: { width: 7, height: 7, borderRadius: 4 },
  sectionTitle: {
    flex: 1, fontSize: 12, fontWeight: '700',
    color: '#6b6b8a', textTransform: 'uppercase', letterSpacing: 0.5,
  },
  sectionHint: { fontSize: 11, color: '#bbb' },

  // Stage tracker rows
  stageRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 9, paddingHorizontal: 14,
    borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.04)',
  },
  stageRowCurrent: { backgroundColor: 'rgba(91,45,142,0.06)' },
  stageRowDone: { opacity: 0.55 },
  stageIcon: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#e8e0f0', alignItems: 'center', justifyContent: 'center',
  },
  stageIconDone: { backgroundColor: COLORS.MINT },
  stageIconCurrent: { backgroundColor: COLORS.DEEP_PLUM },
  stageIconDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#fff' },
  stageNum: { fontSize: 10, fontWeight: '600', color: '#6b6b8a' },
  stageLabel: { flex: 1, fontSize: 13, color: COLORS.MIDNIGHT },
  stageLabelDone: { color: '#9ca3af', textDecorationLine: 'line-through' },
  stageLabelCurrent: { fontWeight: '700', color: COLORS.DEEP_PLUM },
  currentPill: { backgroundColor: COLORS.DEEP_PLUM, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  currentPillText: { fontSize: 9, color: '#fff', fontWeight: '600' },

  // Todo rows
  todoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, paddingHorizontal: 14,
    borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.04)',
  },
  todoLabel: { flex: 1, fontSize: 14, color: COLORS.MIDNIGHT },
  todoLabelDone: { textDecorationLine: 'line-through', color: '#9ca3af' },
  todoAddRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 8,
    borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.04)',
  },
  todoInput: { flex: 1, fontSize: 14, color: COLORS.MIDNIGHT, paddingVertical: 4 },
  todoAddBtn: { padding: 6, backgroundColor: 'rgba(91,45,142,0.08)', borderRadius: 8 },

  // Info rows
  infoRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    paddingVertical: 8, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.04)',
  },
  infoIcon: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: 'rgba(91,45,142,0.07)',
    alignItems: 'center', justifyContent: 'center',
  },
  infoLabel: { fontSize: 11, color: '#999', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3 },
  infoValue: { fontSize: 14, color: COLORS.MIDNIGHT, marginTop: 2 },

  // Palettes
  paletteSection: { marginTop: 10 },
  addPaletteBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(91,45,142,0.07)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  addPaletteBtnText: { fontSize: 10, fontWeight: '500', color: COLORS.DEEP_PLUM },
  emptyContainer: { alignItems: 'center', padding: 32, paddingTop: 24 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.MIDNIGHT, marginBottom: 6 },
  emptySubtitle: { fontSize: 13, color: '#6b6b8a', textAlign: 'center', lineHeight: 20, marginBottom: 18 },
  emptyBtn: { backgroundColor: COLORS.DEEP_PLUM, paddingHorizontal: 20, paddingVertical: 11, borderRadius: 10 },
  emptyBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },

  // Quilt Card
  quiltCardSection: { marginTop: 10, marginBottom: 6 },
  quiltCardPlaceholder: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginHorizontal: 14, padding: 16,
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.09)',
  },
  quiltCardText: { fontSize: 13, color: 'rgba(45,27,78,0.6)', lineHeight: 19 },

  // Action buttons
  actionRow: {
    flexDirection: 'row', gap: 12,
    marginHorizontal: 14, marginTop: 16,
  },
  actionBtnUFO: {
    flex: 1, paddingVertical: 16, alignItems: 'center',
    borderRadius: 14, backgroundColor: COLORS.AMBER,
  },
  actionBtnUFOText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  actionBtnComplete: {
    flex: 1, paddingVertical: 16, alignItems: 'center',
    borderRadius: 14, backgroundColor: COLORS.MINT,
  },
  actionBtnCompleteText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  actionBtnActive: {
    flex: 1, paddingVertical: 16, alignItems: 'center',
    borderRadius: 14, backgroundColor: COLORS.DEEP_PLUM,
  },
  actionBtnActiveText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  // Completion modal
  completionOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center', padding: 30,
  },
  completionCard: {
    backgroundColor: '#fff', borderRadius: 24, padding: 30,
    alignItems: 'center', width: '100%',
  },
  completionCheck: { marginBottom: 16 },
  completionTitle: {
    fontSize: 20, fontWeight: '800', color: COLORS.MIDNIGHT,
    textAlign: 'center', marginBottom: 8,
  },
  completionSub: {
    fontSize: 14, color: 'rgba(45,27,78,0.6)', textAlign: 'center',
    marginBottom: 24,
  },
  scrapbookBtn: {
    width: '100%', paddingVertical: 16, alignItems: 'center',
    borderRadius: 14, backgroundColor: COLORS.DEEP_PLUM,
    marginBottom: 10,
  },
  scrapbookBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  continueBtn: {
    width: '100%', paddingVertical: 14, alignItems: 'center',
  },
  continueBtnText: { fontSize: 15, fontWeight: '600', color: COLORS.DEEP_PLUM },
});
