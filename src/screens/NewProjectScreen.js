// NewProjectScreen.js
// Form for creating a new Quilt or Bag project.
// Step 1: pick type. Step 2: fill in type-specific fields.
// Saves to AsyncStorage via src/storage/projects.js.

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import COLORS from '../styles/colors';
import { addProject } from '../storage/projects';

const QUILT_STAGES = [
  'Select Fabric',
  'Cut',
  'Piece Blocks',
  'Quilt Layers',
  'Bind Edges',
  'Label and Wash',
];

const BAG_STAGES = [
  'Gather Materials',
  'Cut and Interface',
  'Build Interior Pockets',
  'Install Zippers',
  'Attach Hardware',
  'Assemble Shells',
  'Attach Straps',
  'Final Assembly',
];

// Reusable labeled text input
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

export default function NewProjectScreen({ navigation }) {
  const [projectType, setProjectType] = useState(null); // 'Quilt' | 'Bag'

  // Shared fields
  const [name, setName]         = useState('');
  const [madeFor, setMadeFor]   = useState('');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes]       = useState('');

  // Quilt-only
  const [quiltStyle, setQuiltStyle]       = useState('');
  const [patternName, setPatternName]     = useState('');
  const [size, setSize]                   = useState('');
  const [technique, setTechnique]         = useState('');

  // Bag-only
  const [bagStyle, setBagStyle]           = useState('');
  const [patternNumber, setPatternNumber] = useState('');
  const [dimensions, setDimensions]       = useState('');

  const handleTypeSelect = (type) => {
    setProjectType(type);
    // Reset type-specific fields when switching
    setQuiltStyle('');
    setPatternName('');
    setSize('');
    setTechnique('');
    setBagStyle('');
    setPatternNumber('');
    setDimensions('');
  };

  const handleSave = async () => {
    if (!projectType) {
      Alert.alert('Select a type', 'Please choose Quilt or Bag first.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter a name for your project.');
      return;
    }

    const stages = projectType === 'Quilt' ? QUILT_STAGES : BAG_STAGES;

    const project = {
      id: Date.now().toString(),
      type: projectType,
      name: name.trim(),
      progress: 0,
      stage: stages[0],
      stages,
      currentStageIndex: 0,
      createdAt: new Date().toISOString(),
      madeFor: madeFor.trim(),
      deadline: deadline.trim(),
      notes: notes.trim(),
      ...(projectType === 'Quilt'
        ? {
            style: quiltStyle.trim(),
            patternName: patternName.trim(),
            size: size.trim(),
            technique: technique.trim(),
          }
        : {
            bagStyle: bagStyle.trim(),
            patternNumber: patternNumber.trim(),
            dimensions: dimensions.trim(),
          }),
    };

    try {
      await addProject(project);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Could not save the project. Please try again.');
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
        {/* ── Type picker ── */}
        <Text style={styles.sectionLabel}>Project Type</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              projectType === 'Quilt' && styles.typeButtonActive,
            ]}
            onPress={() => handleTypeSelect('Quilt')}
            activeOpacity={0.8}
          >
            <Text style={styles.typeEmoji}>🧩</Text>
            <Text
              style={[
                styles.typeButtonText,
                projectType === 'Quilt' && styles.typeButtonTextActive,
              ]}
            >
              Quilt
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              projectType === 'Bag' && styles.typeButtonActive,
            ]}
            onPress={() => handleTypeSelect('Bag')}
            activeOpacity={0.8}
          >
            <Text style={styles.typeEmoji}>👜</Text>
            <Text
              style={[
                styles.typeButtonText,
                projectType === 'Bag' && styles.typeButtonTextActive,
              ]}
            >
              Bag
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Fields (shown once a type is chosen) ── */}
        {projectType !== null && (
          <>
            <View style={styles.divider} />

            <Field
              label="Project Name"
              value={name}
              onChangeText={setName}
              placeholder={
                projectType === 'Quilt'
                  ? 'e.g. Garden Wedding Quilt'
                  : 'e.g. Farmers Market Tote'
              }
            />

            {projectType === 'Quilt' && (
              <>
                <Field
                  label="Style"
                  value={quiltStyle}
                  onChangeText={setQuiltStyle}
                  placeholder="e.g. Traditional, Modern, Art Quilt"
                />
                <Field
                  label="Pattern Name"
                  value={patternName}
                  onChangeText={setPatternName}
                  placeholder="e.g. Flying Geese, Log Cabin"
                />
                <Field
                  label="Size"
                  value={size}
                  onChangeText={setSize}
                  placeholder='e.g. Queen, Baby, 60 × 80"'
                />
                <Field
                  label="Technique"
                  value={technique}
                  onChangeText={setTechnique}
                  placeholder="e.g. Machine Pieced, Hand Quilted"
                />
              </>
            )}

            {projectType === 'Bag' && (
              <>
                <Field
                  label="Bag Style"
                  value={bagStyle}
                  onChangeText={setBagStyle}
                  placeholder="e.g. Tote, Crossbody, Backpack"
                />
                <Field
                  label="Pattern Number"
                  value={patternNumber}
                  onChangeText={setPatternNumber}
                  placeholder="e.g. NN-042"
                />
                <Field
                  label="Dimensions"
                  value={dimensions}
                  onChangeText={setDimensions}
                  placeholder="e.g. 12 × 14 × 4 in"
                />
              </>
            )}

            <Field
              label="Made For"
              value={madeFor}
              onChangeText={setMadeFor}
              placeholder="e.g. Self, Gift for Mom"
            />
            <Field
              label="Deadline"
              value={deadline}
              onChangeText={setDeadline}
              placeholder="e.g. Dec 25, 2026"
            />
            <Field
              label="Notes"
              value={notes}
              onChangeText={setNotes}
              placeholder="Fabric ideas, inspiration, reminders…"
              multiline
            />

            {/* Stages preview */}
            <View style={styles.stagesCard}>
              <Text style={styles.stagesTitle}>Default Stages</Text>
              {(projectType === 'Quilt' ? QUILT_STAGES : BAG_STAGES).map(
                (stage, i) => (
                  <View key={stage} style={styles.stageRow}>
                    <View style={styles.stageDot} />
                    <Text style={styles.stageText}>
                      {i + 1}. {stage}
                    </Text>
                  </View>
                )
              )}
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Text style={styles.saveButtonText}>Save Project</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LAVENDER_WHITE,
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },

  // Type picker
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.DEEP_PLUM,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.SOFT_LAVENDER,
    backgroundColor: '#FFFFFF',
  },
  typeButtonActive: {
    borderColor: COLORS.DEEP_PLUM,
    backgroundColor: COLORS.DEEP_PLUM,
  },
  typeEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  typeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.DEEP_PLUM,
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.SOFT_LAVENDER,
    opacity: 0.4,
    marginVertical: 24,
  },

  // Form fields
  fieldWrapper: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.MIDNIGHT,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.SOFT_LAVENDER,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: COLORS.MIDNIGHT,
  },
  inputMultiline: {
    height: 100,
    paddingTop: 11,
  },

  // Stages preview card
  stagesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.SOFT_LAVENDER,
  },
  stagesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.DEEP_PLUM,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.MINT,
    marginRight: 10,
  },
  stageText: {
    fontSize: 14,
    color: COLORS.MIDNIGHT,
  },

  // Save button
  saveButton: {
    backgroundColor: COLORS.DEEP_PLUM,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
