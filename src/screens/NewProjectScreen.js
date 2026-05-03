// NewProjectScreen.js
// Type Select → Quick Create or Detailed Create (Step 1 → Step 2).
// Quilt + Bag flows with spec-matching fields and conditional visibility.

import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert,
  Modal, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../styles/colors';
import { addProject } from '../storage/projects';

// ─── Spec data ────────────────────────────────────────────────────────────────

const QUILT_STAGES = [
  'Started',
  'Fabric chosen & purchased',
  'Pieces cut',
  'Blocks made',
  'Rows assembled',
  'Quilt top done',
  'Backing ready',
  'Binding made',
  'Quilted',
  'Quilt bound',
  'Completed',
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
  'Completed',
];

const QUILT_SIZES = [
  'Accessory', 'Baby', 'Crib', 'Custom', 'Double', 'King',
  'Large Throw', 'Place Mat', 'Queen', 'Small Throw',
  'Table Runner', 'Twin', 'Wall Hanging',
];

const PIECING_TECHNIQUES = [
  'Applique', 'Collage', 'Curves', 'EPP', 'FPP',
  'Hand Embroidery', 'Hand Pieced', 'Machine Embroidery', 'Quilt as You Go',
];

const QUILTING_STYLES = [
  'Domestic', 'FMQ', 'Hand Quilted', 'Longarm', 'Longarm Custom',
  'Longarm FMQ', 'Other', 'Straight Line', 'Tied',
];

const BAG_STYLES = [
  'Backpack', 'Catch All Caddy', 'Cinch Bag', 'Custom', 'Ditty Bag',
  'Lunch Box', 'Pouch', 'Project Bag', 'Purse',
  'Tablet Bag', 'Tote', 'Travel Bag', 'Wallet',
];

const DEFAULT_TODOS = ['Label', 'Photograph', 'Share'];

// ─── Reusable components ─────────────────────────────────────────────────────

function DropdownPicker({ label, value, options, onSelect, placeholder }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity style={styles.dropdown} onPress={() => setOpen(true)} activeOpacity={0.8}>
        <Text style={value ? styles.dropdownValue : styles.dropdownPlaceholder}>
          {value || placeholder || 'Select…'}
        </Text>
        <Ionicons name="chevron-down" size={16} color={COLORS.SOFT_LAVENDER} />
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setOpen(false)} />
        <View style={styles.pickerSheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.pickerTitle}>{label}</Text>
          <FlatList
            data={options}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.pickerOption, item === value && styles.pickerOptionActive]}
                onPress={() => { onSelect(item); setOpen(false); }}
              >
                <Text style={[styles.pickerOptionText, item === value && styles.pickerOptionTextActive]}>
                  {item}
                </Text>
                {item === value && <Ionicons name="checkmark" size={16} color={COLORS.MINT} />}
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </View>
  );
}

function Field({ label, value, onChangeText, placeholder, multiline = false, required = false }) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>
        {label}{required ? <Text style={{ color: COLORS.MINT }}> *</Text> : ''}
      </Text>
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

function SmartTodo({ todos, onToggle, onAdd, onRemove }) {
  const [newItem, setNewItem] = useState('');
  const handleAdd = () => {
    if (!newItem.trim()) return;
    onAdd(newItem.trim());
    setNewItem('');
  };
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>Smart To-Do</Text>
      <View style={styles.todoCard}>
        {todos.map((item, i) => (
          <View key={i} style={styles.todoRow}>
            <TouchableOpacity onPress={() => onToggle(i)} style={{ padding: 2 }}>
              <Ionicons
                name={item.done ? 'checkbox' : 'square-outline'}
                size={20}
                color={item.done ? COLORS.MINT : COLORS.SOFT_LAVENDER}
              />
            </TouchableOpacity>
            <Text style={[styles.todoLabel, item.done && styles.todoLabelDone]}>{item.label}</Text>
            {!DEFAULT_TODOS.includes(item.label) && (
              <TouchableOpacity onPress={() => onRemove(i)} style={{ padding: 4 }}>
                <Ionicons name="close" size={14} color="#aaa" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        <View style={styles.todoAddRow}>
          <TextInput
            style={styles.todoInput}
            value={newItem}
            onChangeText={setNewItem}
            placeholder="Add a to-do item…"
            placeholderTextColor={COLORS.SOFT_LAVENDER}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
          />
          <TouchableOpacity onPress={handleAdd} style={styles.todoAddBtn}>
            <Ionicons name="add" size={18} color={COLORS.DEEP_PLUM} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function NewProjectScreen({ navigation }) {
  // Flow state
  const [projectType, setProjectType] = useState(null);
  const [createMode, setCreateMode] = useState(null); // 'quick' | 'detailed'
  const [detailedStep, setDetailedStep] = useState(1);

  // Shared fields
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [dateStarted, setDateStarted] = useState('');
  const [dateCompleted, setDateCompleted] = useState('');

  // Quilt fields
  const [patternName, setPatternName] = useState('');
  const [quiltSize, setQuiltSize] = useState('');
  const [customSize, setCustomSize] = useState('');
  const [fabricsUsed, setFabricsUsed] = useState('');
  const [piecingTechnique, setPiecingTechnique] = useState('');
  const [quiltingStyle, setQuiltingStyle] = useState('');
  const [quiltedBy, setQuiltedBy] = useState('');
  const [stage, setStage] = useState('');
  const [storageSpot, setStorageSpot] = useState('');

  // Bag fields
  const [bagPatternName, setBagPatternName] = useState('');
  const [bagStyle, setBagStyle] = useState('');
  const [customBagStyle, setCustomBagStyle] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [supplyList, setSupplyList] = useState('');
  const [madeFor, setMadeFor] = useState('');
  const [madeBy, setMadeBy] = useState('');

  // Todos
  const [todos, setTodos] = useState(DEFAULT_TODOS.map(label => ({ label, done: false })));
  const toggleTodo = (i) => setTodos(prev => prev.map((t, idx) => idx === i ? { ...t, done: !t.done } : t));
  const addTodo = (label) => setTodos(prev => [...prev, { label, done: false }]);
  const removeTodo = (i) => setTodos(prev => prev.filter((_, idx) => idx !== i));

  const stages = projectType === 'Quilt' ? QUILT_STAGES : BAG_STAGES;
  const stageIndex = stage ? stages.indexOf(stage) : 0;

  // Binding made = index 7 for quilts → show quilting style fields
  const showQuiltingFields = projectType === 'Quilt' && stageIndex >= 7;
  // Quilt bound = index 9 → show completion fields
  const showCompletionFields = projectType === 'Quilt'
    ? stageIndex >= 9
    : projectType === 'Bag' && stage === 'Completed';

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter a name for your project.');
      return;
    }

    const selectedStage = stage || stages[0];
    const selectedIndex = stages.indexOf(selectedStage);
    const progress = stages.length > 1
      ? (selectedIndex >= 0 ? selectedIndex : 0) / (stages.length - 1)
      : 0;

    const resolvedSize = quiltSize === 'Custom' ? customSize : quiltSize;
    const resolvedBagStyle = bagStyle === 'Custom' ? customBagStyle : bagStyle;

    const project = {
      id: Date.now().toString(),
      type: projectType,
      name: name.trim(),
      progress,
      stage: selectedStage,
      stages,
      currentStageIndex: selectedIndex >= 0 ? selectedIndex : 0,
      createdAt: new Date().toISOString(),
      dateStarted: dateStarted.trim(),
      dateCompleted: dateCompleted.trim(),
      notes: notes.trim(),
      storageSpot: storageSpot.trim(),
      todos,
      photos: [],
      ...(projectType === 'Quilt'
        ? {
            patternName: patternName.trim(),
            size: (resolvedSize || '').trim(),
            piecingTechnique,
            quiltingStyle,
            quiltedBy: quiltedBy.trim(),
            fabricsUsed: fabricsUsed.trim(),
          }
        : {
            patternName: bagPatternName.trim(),
            bagStyle: (resolvedBagStyle || '').trim(),
            dimensions: dimensions.trim(),
            supplyList: supplyList.trim(),
            madeFor: madeFor.trim(),
            madeBy: madeBy.trim(),
          }),
    };

    try {
      await addProject(project);
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Could not save the project. Please try again.');
    }
  };

  // ── Step 0: Type Select ──
  if (!projectType) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.screenTitle}>What are you creating?</Text>
        <Text style={styles.screenSubtitle}>Choose your project type</Text>

        <TouchableOpacity
          style={styles.typeCard}
          onPress={() => setProjectType('Quilt')}
          activeOpacity={0.9}
        >
          <View style={styles.typeCardIcon}>
            <Ionicons name="grid-outline" size={40} color={COLORS.DEEP_PLUM} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.typeCardTitle}>Quilt</Text>
            <Text style={styles.typeCardSub}>Track your quilt projects</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={COLORS.SOFT_LAVENDER} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.typeCard}
          onPress={() => setProjectType('Bag')}
          activeOpacity={0.9}
        >
          <View style={styles.typeCardIcon}>
            <Ionicons name="bag-outline" size={40} color={COLORS.DEEP_PLUM} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.typeCardTitle}>Bag</Text>
            <Text style={styles.typeCardSub}>Track your bag projects</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={COLORS.SOFT_LAVENDER} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ── Step 1: Choose Quick or Detailed ──
  if (!createMode) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.typeBadgeSmall}>
          <Text style={styles.typeBadgeSmallText}>{projectType}</Text>
        </View>

        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => setCreateMode('quick')}
          activeOpacity={0.9}
        >
          <View style={styles.modeCardHeader}>
            <Ionicons name="flash-outline" size={24} color={COLORS.MINT} />
            <Text style={styles.modeCardTitle}>Quick Create</Text>
          </View>
          <Text style={styles.modeCardSub}>
            Minimal fields — get started fast.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => setCreateMode('detailed')}
          activeOpacity={0.9}
        >
          <View style={styles.modeCardHeader}>
            <Ionicons name="list-outline" size={24} color={COLORS.DEEP_PLUM} />
            <Text style={styles.modeCardTitle}>Detailed Create</Text>
          </View>
          <Text style={styles.modeCardSub}>
            Two-step form with all project details.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => setProjectType(null)}
        >
          <Text style={styles.cancelBtnText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ── Quick Create ──
  if (createMode === 'quick') {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.formHeader}>
            <TouchableOpacity onPress={() => setCreateMode(null)} style={styles.backChevron}>
              <Ionicons name="chevron-back" size={20} color={COLORS.DEEP_PLUM} />
            </TouchableOpacity>
            <Text style={styles.formTitle}>Quick Create</Text>
            <Text style={styles.formSubtitle}>{projectType} Project</Text>
          </View>

          <Field label="Project Name" value={name} onChangeText={setName}
            placeholder={projectType === 'Quilt' ? 'e.g. Summer Stars' : 'e.g. Zipper Pouch'}
            required />

          <Field label="Pattern Name"
            value={projectType === 'Quilt' ? patternName : bagPatternName}
            onChangeText={projectType === 'Quilt' ? setPatternName : setBagPatternName}
            placeholder="e.g. Sawtooth Star" />

          {projectType === 'Quilt' && (
            <Field label="Fabric Details" value={fabricsUsed} onChangeText={setFabricsUsed}
              placeholder="e.g. Cotton solids and prints" />
          )}

          {projectType === 'Bag' && (
            <>
              <DropdownPicker label="Bag Style" value={bagStyle} options={BAG_STYLES}
                onSelect={setBagStyle} placeholder="Select bag style…" />
              {bagStyle === 'Custom' && (
                <Field label="Custom Style" value={customBagStyle} onChangeText={setCustomBagStyle}
                  placeholder="Describe the style" />
              )}
            </>
          )}

          <Field label="Date Started" value={dateStarted} onChangeText={setDateStarted}
            placeholder="e.g. May 10, 2024" />

          <DropdownPicker label="Current Stage" value={stage}
            options={stages}
            onSelect={setStage} placeholder="Select stage…" />

          <Field label="Notes" value={notes} onChangeText={setNotes}
            placeholder="Add any notes…" multiline />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtnInline} onPress={() => setCreateMode(null)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
              <Text style={styles.saveButtonText}>Create Project</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // ── Detailed Create — Step 1: Project Details ──
  if (createMode === 'detailed' && detailedStep === 1) {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.formHeader}>
            <TouchableOpacity onPress={() => setCreateMode(null)} style={styles.backChevron}>
              <Ionicons name="chevron-back" size={20} color={COLORS.DEEP_PLUM} />
            </TouchableOpacity>
            <Text style={styles.formTitle}>Detailed Create — Step 1</Text>
            <Text style={styles.formSubtitle}>Project Details</Text>
          </View>

          <View style={styles.stepIndicator}>
            <View style={[styles.stepDot, styles.stepDotActive]} />
            <View style={styles.stepLine} />
            <View style={styles.stepDot} />
          </View>

          <Field label="Project Name" value={name} onChangeText={setName}
            placeholder={projectType === 'Quilt' ? 'e.g. Summer Stars' : 'e.g. Retro Tote'}
            required />

          <Field label="Pattern Name"
            value={projectType === 'Quilt' ? patternName : bagPatternName}
            onChangeText={projectType === 'Quilt' ? setPatternName : setBagPatternName}
            placeholder="e.g. Sawtooth Star" />

          {projectType === 'Quilt' && (
            <>
              <DropdownPicker label="Project Size" value={quiltSize} options={QUILT_SIZES}
                onSelect={setQuiltSize} placeholder="Select size…" />
              {quiltSize === 'Custom' && (
                <Field label="Custom Size (W × H)" value={customSize} onChangeText={setCustomSize}
                  placeholder='e.g. 60 × 80"' />
              )}
              <Field label="Fabric Details" value={fabricsUsed} onChangeText={setFabricsUsed}
                placeholder="e.g. Moda Bella solids and prints" />
              <Field label="Date Started" value={dateStarted} onChangeText={setDateStarted}
                placeholder="e.g. May 10, 2024" />
              <DropdownPicker label="Piecing Technique" value={piecingTechnique}
                options={PIECING_TECHNIQUES} onSelect={setPiecingTechnique} placeholder="Select technique…" />
            </>
          )}

          {projectType === 'Bag' && (
            <>
              <DropdownPicker label="Bag Style" value={bagStyle} options={BAG_STYLES}
                onSelect={setBagStyle} placeholder="Select bag style…" />
              {bagStyle === 'Custom' && (
                <Field label="Custom Style" value={customBagStyle} onChangeText={setCustomBagStyle}
                  placeholder="Describe the style" />
              )}
              <Field label="Dimensions" value={dimensions} onChangeText={setDimensions}
                placeholder='e.g. 14"W x 12"H x 5"D' />
              <Field label="Made For" value={madeFor} onChangeText={setMadeFor}
                placeholder="e.g. Myself" />
              <Field label="Made By" value={madeBy} onChangeText={setMadeBy}
                placeholder="e.g. Sabbie" />
              <Field label="Date Started" value={dateStarted} onChangeText={setDateStarted}
                placeholder="e.g. May 10, 2024" />
            </>
          )}

          <Field label="Notes" value={notes} onChangeText={setNotes}
            placeholder="Planning to gift this to my sister…" multiline />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtnInline} onPress={() => setCreateMode(null)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                if (!name.trim()) {
                  Alert.alert('Name required', 'Please enter a project name first.');
                  return;
                }
                setDetailedStep(2);
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.saveButtonText}>Next: Step 2</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // ── Detailed Create — Step 2: Progress ──
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.formHeader}>
          <TouchableOpacity onPress={() => setDetailedStep(1)} style={styles.backChevron}>
            <Ionicons name="chevron-back" size={20} color={COLORS.DEEP_PLUM} />
          </TouchableOpacity>
          <Text style={styles.formTitle}>Detailed Create — Step 2</Text>
          <Text style={styles.formSubtitle}>Project Progress</Text>
        </View>

        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, styles.stepDotDone]} />
          <View style={[styles.stepLine, styles.stepLineDone]} />
          <View style={[styles.stepDot, styles.stepDotActive]} />
        </View>

        <DropdownPicker label="Project Stage" value={stage}
          options={stages}
          onSelect={setStage} placeholder="Select current stage…" />

        <SmartTodo todos={todos} onToggle={toggleTodo} onAdd={addTodo} onRemove={removeTodo} />

        {/* Conditional: Quilting fields after Binding made */}
        {showQuiltingFields && (
          <>
            <DropdownPicker label="Quilting Style" value={quiltingStyle}
              options={QUILTING_STYLES} onSelect={setQuiltingStyle} placeholder="Select quilting style…" />
            <Field label="Quilted By" value={quiltedBy} onChangeText={setQuiltedBy}
              placeholder="e.g. Self, Longarm studio name" />
          </>
        )}

        {/* Conditional: Completion fields after Quilt bound / Completed */}
        {showCompletionFields && (
          <>
            <Field label="Date Completed" value={dateCompleted} onChangeText={setDateCompleted}
              placeholder="e.g. May 16, 2024" />
            <Field label="Storage Spot" value={storageSpot} onChangeText={setStorageSpot}
              placeholder="e.g. Sewing Room – Shelf 2" />
          </>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelBtnInline} onPress={() => setDetailedStep(1)}>
            <Text style={styles.cancelBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveButtonText}>Create Project</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.LAVENDER_WHITE },
  content: { padding: 20, paddingBottom: 48 },

  // Type select
  screenTitle: {
    fontSize: 26, fontWeight: '900', color: COLORS.MIDNIGHT,
    marginBottom: 6, marginTop: 12,
  },
  screenSubtitle: {
    fontSize: 15, color: 'rgba(45,27,78,0.6)', marginBottom: 28,
  },
  typeCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    marginBottom: 14,
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 3,
  },
  typeCardIcon: {
    width: 64, height: 64, borderRadius: 18,
    backgroundColor: COLORS.LAVENDER_WHITE,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 16,
  },
  typeCardTitle: { fontSize: 20, fontWeight: '800', color: COLORS.MIDNIGHT },
  typeCardSub: { fontSize: 13, color: 'rgba(45,27,78,0.55)', marginTop: 2 },

  // Mode select
  typeBadgeSmall: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(91,45,142,0.12)',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginBottom: 20,
  },
  typeBadgeSmallText: { fontSize: 13, fontWeight: '700', color: COLORS.DEEP_PLUM },
  modeCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    marginBottom: 14,
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 3,
  },
  modeCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  modeCardTitle: { fontSize: 18, fontWeight: '800', color: COLORS.MIDNIGHT },
  modeCardSub: { fontSize: 14, color: 'rgba(45,27,78,0.55)', lineHeight: 20 },

  // Form header
  formHeader: { marginBottom: 20 },
  backChevron: {
    marginBottom: 8, width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(91,45,142,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  formTitle: { fontSize: 20, fontWeight: '800', color: COLORS.MIDNIGHT },
  formSubtitle: { fontSize: 14, color: 'rgba(45,27,78,0.55)', marginTop: 2 },

  // Step indicator
  stepIndicator: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', marginBottom: 24, gap: 0,
  },
  stepDot: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: '#e8e0f0', borderWidth: 2, borderColor: '#e8e0f0',
  },
  stepDotActive: {
    backgroundColor: COLORS.DEEP_PLUM, borderColor: COLORS.DEEP_PLUM,
  },
  stepDotDone: {
    backgroundColor: COLORS.MINT, borderColor: COLORS.MINT,
  },
  stepLine: {
    width: 60, height: 3, backgroundColor: '#e8e0f0',
  },
  stepLineDone: { backgroundColor: COLORS.MINT },

  // Fields
  fieldWrapper: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.MIDNIGHT, marginBottom: 6 },
  input: {
    backgroundColor: '#fff', borderRadius: 10,
    borderWidth: 1.5, borderColor: COLORS.SOFT_LAVENDER,
    paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 15, color: COLORS.MIDNIGHT,
  },
  inputMultiline: { height: 90, paddingTop: 11 },

  // Dropdown
  dropdown: {
    backgroundColor: '#fff', borderRadius: 10,
    borderWidth: 1.5, borderColor: COLORS.SOFT_LAVENDER,
    paddingHorizontal: 14, paddingVertical: 13,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  dropdownValue: { fontSize: 15, color: COLORS.MIDNIGHT },
  dropdownPlaceholder: { fontSize: 15, color: COLORS.SOFT_LAVENDER },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  pickerSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 12, maxHeight: '60%',
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#ddd', alignSelf: 'center', marginBottom: 12,
  },
  pickerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.MIDNIGHT, marginBottom: 12 },
  pickerOption: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  pickerOptionActive: {},
  pickerOptionText: { fontSize: 15, color: COLORS.MIDNIGHT },
  pickerOptionTextActive: { fontWeight: '700', color: COLORS.DEEP_PLUM },

  // Todos
  todoCard: {
    backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 1.5, borderColor: COLORS.SOFT_LAVENDER, overflow: 'hidden',
  },
  todoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, paddingHorizontal: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  todoLabel: { flex: 1, fontSize: 14, color: COLORS.MIDNIGHT },
  todoLabelDone: { textDecorationLine: 'line-through', color: '#9ca3af' },
  todoAddRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 8,
  },
  todoInput: { flex: 1, fontSize: 14, color: COLORS.MIDNIGHT, paddingVertical: 4 },
  todoAddBtn: { padding: 4, backgroundColor: 'rgba(91,45,142,0.1)', borderRadius: 6 },

  // Buttons
  buttonRow: {
    flexDirection: 'row', gap: 12, marginTop: 8,
  },
  cancelBtn: { alignSelf: 'center', paddingVertical: 14, marginTop: 8 },
  cancelBtnInline: {
    flex: 0.4, borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.SOFT_LAVENDER,
  },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: COLORS.DEEP_PLUM },
  saveButton: {
    flex: 0.6, backgroundColor: COLORS.DEEP_PLUM, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
