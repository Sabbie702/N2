// EditProjectScreen.js
// Edit all project fields + advance stages via a visual stage tracker.
// Pre-filled from the project passed via route.params.project.

import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../styles/colors';
import { updateProject } from '../storage/projects';

// ─── Reusable field ───────────────────────────────────────────────────────────
function Field({ label, value, onChangeText, placeholder, multiline = false }) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.SOFT_LAVENDER}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

// ─── Stage tracker ────────────────────────────────────────────────────────────
function StageTracker({ stages, currentStageIndex, onStageChange }) {
  return (
    <View style={styles.stagesCard}>
      <Text style={styles.stagesTitle}>Stages</Text>
      <Text style={styles.stagesHint}>Tap a stage to mark it as your current stage.</Text>
      {stages.map((stage, i) => {
        const isDone    = i < currentStageIndex;
        const isCurrent = i === currentStageIndex;
        return (
          <TouchableOpacity
            key={stage}
            style={[
              styles.stageRow,
              isCurrent && styles.stageRowCurrent,
              isDone    && styles.stageRowDone,
            ]}
            onPress={() => onStageChange(i)}
            activeOpacity={0.75}
          >
            <View style={[
              styles.stageIcon,
              isDone    && styles.stageIconDone,
              isCurrent && styles.stageIconCurrent,
            ]}>
              {isDone ? (
                <Ionicons name="checkmark" size={12} color="#fff" />
              ) : isCurrent ? (
                <View style={styles.stageIconDot} />
              ) : (
                <Text style={styles.stageNum}>{i + 1}</Text>
              )}
            </View>
            <Text style={[
              styles.stageLabel,
              isDone    && styles.stageLabelDone,
              isCurrent && styles.stageLabelCurrent,
            ]}>
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

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function EditProjectScreen({ navigation, route }) {
  const { project } = route.params;

  // Shared fields
  const [name, setName]         = useState(project.name       || '');
  const [madeFor, setMadeFor]   = useState(project.madeFor    || '');
  const [deadline, setDeadline] = useState(project.deadline   || '');
  const [notes, setNotes]       = useState(project.notes      || '');

  // Quilt-only
  const [quiltStyle, setQuiltStyle]   = useState(project.style       || '');
  const [patternName, setPatternName] = useState(project.patternName  || '');
  const [size, setSize]               = useState(project.size         || '');
  const [technique, setTechnique]     = useState(project.technique    || '');

  // Bag-only
  const [bagStyle, setBagStyle]           = useState(project.bagStyle      || '');
  const [patternNumber, setPatternNumber] = useState(project.patternNumber  || '');
  const [dimensions, setDimensions]       = useState(project.dimensions     || '');

  // Stage tracker
  const [currentStageIndex, setCurrentStageIndex] = useState(
    project.currentStageIndex ?? 0
  );

  const stages = project.stages || [];

  const handleStageChange = (index) => {
    setCurrentStageIndex(index);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter a name for your project.');
      return;
    }

    const progress = stages.length > 1
      ? currentStageIndex / (stages.length - 1)
      : currentStageIndex > 0 ? 1 : 0;

    const changes = {
      name: name.trim(),
      madeFor: madeFor.trim(),
      deadline: deadline.trim(),
      notes: notes.trim(),
      stage: stages[currentStageIndex] || project.stage,
      currentStageIndex,
      progress,
      ...(project.type === 'Quilt'
        ? {
            style:       quiltStyle.trim(),
            patternName: patternName.trim(),
            size:        size.trim(),
            technique:   technique.trim(),
          }
        : {
            bagStyle:      bagStyle.trim(),
            patternNumber: patternNumber.trim(),
            dimensions:    dimensions.trim(),
          }),
    };

    try {
      await updateProject(project.id, changes);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Could not save changes. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Type badge (read-only) */}
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{project.type}</Text>
        </View>

        {/* Project fields */}
        <Field label="Project Name" value={name} onChangeText={setName}
          placeholder={project.type === 'Quilt' ? 'e.g. Garden Wedding Quilt' : 'e.g. Farmers Market Tote'} />

        {project.type === 'Quilt' && <>
          <Field label="Style"        value={quiltStyle}  onChangeText={setQuiltStyle}  placeholder="e.g. Traditional, Modern, Art Quilt" />
          <Field label="Pattern Name" value={patternName} onChangeText={setPatternName} placeholder="e.g. Flying Geese, Log Cabin" />
          <Field label="Size"         value={size}        onChangeText={setSize}        placeholder='e.g. Queen, Baby, 60 × 80"' />
          <Field label="Technique"    value={technique}   onChangeText={setTechnique}   placeholder="e.g. Machine Pieced, Hand Quilted" />
        </>}

        {project.type === 'Bag' && <>
          <Field label="Bag Style"      value={bagStyle}      onChangeText={setBagStyle}      placeholder="e.g. Tote, Crossbody, Backpack" />
          <Field label="Pattern Number" value={patternNumber} onChangeText={setPatternNumber} placeholder="e.g. NN-042" />
          <Field label="Dimensions"     value={dimensions}    onChangeText={setDimensions}    placeholder="e.g. 12 × 14 × 4 in" />
        </>}

        <Field label="Made For" value={madeFor}   onChangeText={setMadeFor}   placeholder="e.g. Self, Gift for Mom" />
        <Field label="Deadline"  value={deadline}  onChangeText={setDeadline}  placeholder="e.g. Dec 25, 2026" />
        <Field label="Notes"     value={notes}     onChangeText={setNotes}     placeholder="Fabric ideas, inspiration, reminders…" multiline />

        {/* Stage tracker */}
        {stages.length > 0 && (
          <StageTracker
            stages={stages}
            currentStageIndex={currentStageIndex}
            onStageChange={handleStageChange}
          />
        )}

        {/* Save */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.LAVENDER_WHITE },
  content:   { padding: 20, paddingBottom: 48 },

  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.SOFT_LAVENDER,
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5,
    marginBottom: 18,
  },
  typeBadgeText: { fontSize: 13, fontWeight: '600', color: COLORS.DEEP_PLUM },

  fieldWrapper: { marginBottom: 16 },
  fieldLabel:   { fontSize: 13, fontWeight: '600', color: COLORS.MIDNIGHT, marginBottom: 6 },
  input: {
    backgroundColor: '#fff', borderRadius: 10,
    borderWidth: 1.5, borderColor: COLORS.SOFT_LAVENDER,
    paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 15, color: COLORS.MIDNIGHT,
  },
  inputMultiline: { height: 100, paddingTop: 11 },

  // Stage tracker
  stagesCard: {
    backgroundColor: '#fff', borderRadius: 14,
    padding: 16, marginTop: 8, marginBottom: 24,
    borderWidth: 1, borderColor: COLORS.SOFT_LAVENDER,
  },
  stagesTitle: {
    fontSize: 13, fontWeight: '700', color: COLORS.DEEP_PLUM,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4,
  },
  stagesHint: { fontSize: 11, color: '#aaaabc', marginBottom: 14 },

  stageRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, paddingHorizontal: 8,
    borderRadius: 10, marginBottom: 4,
  },
  stageRowCurrent: { backgroundColor: 'rgba(91,45,142,0.07)' },
  stageRowDone:    { opacity: 0.6 },

  stageIcon: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#e8e0f0',
    alignItems: 'center', justifyContent: 'center',
  },
  stageIconDone:    { backgroundColor: COLORS.MINT },
  stageIconCurrent: { backgroundColor: COLORS.DEEP_PLUM },
  stageIconDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff',
  },
  stageNum: { fontSize: 10, fontWeight: '600', color: '#6b6b8a' },

  stageLabel: { flex: 1, fontSize: 14, color: COLORS.MIDNIGHT },
  stageLabelDone:    { color: '#6b6b8a', textDecorationLine: 'line-through' },
  stageLabelCurrent: { fontWeight: '700', color: COLORS.DEEP_PLUM },

  currentPill: {
    backgroundColor: COLORS.DEEP_PLUM,
    borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2,
  },
  currentPillText: { fontSize: 9, color: '#fff', fontWeight: '600' },

  // Save button
  saveButton: {
    backgroundColor: COLORS.DEEP_PLUM, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
