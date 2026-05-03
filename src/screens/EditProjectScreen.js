// EditProjectScreen.js
// Edit project fields + More Options menu (Duplicate, Move to UFO, Delete).

import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert,
  Modal, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../styles/colors';
import {
  updateProject, deleteProject, duplicateProject,
  moveToUFO, moveToActive,
} from '../storage/projects';

// ─── Spec data ────────────────────────────────────────────────────────────────

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
            keyExtractor={i => i}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.pickerOption}
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

function TodoList({ todos, onToggle, onAdd, onRemoveCustom }) {
  const [newItem, setNewItem] = useState('');
  const handleAdd = () => {
    if (!newItem.trim()) return;
    onAdd(newItem.trim());
    setNewItem('');
  };
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>To Do</Text>
      <View style={styles.todoCard}>
        {todos.map((item, i) => (
          <View key={i} style={styles.todoRow}>
            <TouchableOpacity onPress={() => onToggle(i)} style={styles.todoCheck}>
              <Ionicons
                name={item.done ? 'checkbox' : 'square-outline'}
                size={20}
                color={item.done ? COLORS.MINT : COLORS.SOFT_LAVENDER}
              />
            </TouchableOpacity>
            <Text style={[styles.todoLabel, item.done && styles.todoLabelDone]}>{item.label}</Text>
            {!DEFAULT_TODOS.includes(item.label) && (
              <TouchableOpacity onPress={() => onRemoveCustom(i)} style={{ padding: 4 }}>
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
            placeholder="Add custom item…"
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

// ─── More Options Menu ───────────────────────────────────────────────────────

function MoreOptionsSheet({ visible, onClose, onDuplicate, onMoveUFO, onDelete, isUFO }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.optionsSheet}>
        <View style={styles.sheetHandle} />
        <Text style={styles.optionsTitle}>Project Actions</Text>

        <TouchableOpacity style={styles.optionRow} onPress={onDuplicate}>
          <Ionicons name="copy-outline" size={22} color={COLORS.DEEP_PLUM} />
          <Text style={styles.optionLabel}>Duplicate Project</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} onPress={onMoveUFO}>
          <Ionicons name={isUFO ? 'arrow-undo-outline' : 'archive-outline'} size={22} color={COLORS.AMBER} />
          <Text style={[styles.optionLabel, { color: COLORS.AMBER }]}>
            {isUFO ? 'Move Back to Active' : 'Move to UFO'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} onPress={onDelete}>
          <Ionicons name="trash-outline" size={22} color="#ef4444" />
          <Text style={[styles.optionLabel, { color: '#ef4444' }]}>Delete Project</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCancel} onPress={onClose}>
          <Text style={styles.optionCancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// ─── Stage tracker ───────────────────────────────────────────────────────────

function StageTracker({ stages, currentStageIndex, onStageChange }) {
  return (
    <View style={styles.stagesCard}>
      <Text style={styles.stagesTitle}>Project Stage</Text>
      <Text style={styles.stagesHint}>Tap a stage to mark it as your current stage.</Text>
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

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function EditProjectScreen({ navigation, route }) {
  const { project, showOptions } = route.params;
  const [showOptionsMenu, setShowOptionsMenu] = useState(!!showOptions);

  // Shared
  const [name, setName] = useState(project.name || '');
  const [description, setDescription] = useState(project.description || '');
  const [madeFor, setMadeFor] = useState(project.madeFor || '');
  const [madeBy, setMadeBy] = useState(project.madeBy || '');
  const [dateStarted, setDateStarted] = useState(project.dateStarted || '');
  const [dateCompleted, setDateCompleted] = useState(project.dateCompleted || '');
  const [notes, setNotes] = useState(project.notes || '');
  const [tags, setTags] = useState(project.tags || '');
  const [storageSpot, setStorageSpot] = useState(project.storageSpot || '');

  // Quilt
  const [patternName, setPatternName] = useState(project.patternName || '');
  const [quiltSize, setQuiltSize] = useState(project.size || '');
  const [customSize, setCustomSize] = useState('');
  const [piecingTechnique, setPiecingTechnique] = useState(project.piecingTechnique || '');
  const [quiltingStyle, setQuiltingStyle] = useState(project.quiltingStyle || '');
  const [quiltedBy, setQuiltedBy] = useState(project.quiltedBy || '');
  const [fabricsUsed, setFabricsUsed] = useState(project.fabricsUsed || '');

  // Bag
  const [bagPatternName, setBagPatternName] = useState(project.patternName || '');
  const [bagStyle, setBagStyle] = useState(project.bagStyle || '');
  const [customBagStyle, setCustomBagStyle] = useState('');
  const [dimensions, setDimensions] = useState(project.dimensions || '');
  const [supplyList, setSupplyList] = useState(project.supplyList || '');

  // Stage
  const [currentStageIndex, setCurrentStageIndex] = useState(project.currentStageIndex ?? 0);
  const stages = project.stages || [];

  // Todos
  const [todos, setTodos] = useState(
    project.todos?.length
      ? project.todos
      : DEFAULT_TODOS.map(label => ({ label, done: false }))
  );

  const toggleTodo = (i) => setTodos(prev => prev.map((t, idx) => idx === i ? { ...t, done: !t.done } : t));
  const addTodo = (label) => setTodos(prev => [...prev, { label, done: false }]);
  const removeCustomTodo = (i) => setTodos(prev => prev.filter((_, idx) => idx !== i));

  const isUFO = project.status === 'ufo';

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter a name for your project.');
      return;
    }

    const progress = stages.length > 1
      ? currentStageIndex / (stages.length - 1)
      : currentStageIndex > 0 ? 1 : 0;

    const resolvedSize = quiltSize === 'Custom' ? customSize : quiltSize;
    const resolvedBagStyle = bagStyle === 'Custom' ? customBagStyle : bagStyle;

    const changes = {
      name: name.trim(),
      description: description.trim(),
      madeFor: madeFor.trim(),
      madeBy: madeBy.trim(),
      dateStarted: dateStarted.trim(),
      dateCompleted: dateCompleted.trim(),
      notes: notes.trim(),
      tags: tags.trim(),
      storageSpot: storageSpot.trim(),
      todos,
      stage: stages[currentStageIndex] || project.stage,
      currentStageIndex,
      progress,
      ...(project.type === 'Quilt'
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
          }),
    };

    try {
      await updateProject(project.id, changes);
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Could not save changes. Please try again.');
    }
  };

  const handleDuplicate = async () => {
    setShowOptionsMenu(false);
    const copy = await duplicateProject(project.id);
    if (copy) {
      Alert.alert('Duplicated', `"${copy.name}" has been created.`);
      navigation.goBack();
    }
  };

  const handleMoveUFO = async () => {
    setShowOptionsMenu(false);
    if (isUFO) {
      await moveToActive(project.id);
    } else {
      await moveToUFO(project.id);
    }
    navigation.goBack();
  };

  const handleDelete = () => {
    setShowOptionsMenu(false);
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${project.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
            await deleteProject(project.id);
            navigation.popToTop();
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Type badge + More Options button */}
        <View style={styles.editHeader}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{project.type}</Text>
          </View>
          <TouchableOpacity
            style={styles.moreBtn}
            onPress={() => setShowOptionsMenu(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.DEEP_PLUM} />
          </TouchableOpacity>
        </View>

        {/* Shared */}
        <Field label="Project Name" value={name} onChangeText={setName}
          placeholder={project.type === 'Quilt' ? 'e.g. Garden Wedding Quilt' : 'e.g. Farmers Market Tote'} />

        {/* Quilt fields */}
        {project.type === 'Quilt' && (
          <>
            <Field label="Pattern Name" value={patternName} onChangeText={setPatternName}
              placeholder="e.g. Flying Geese, Log Cabin" />
            <DropdownPicker label="Project Size" value={quiltSize} options={QUILT_SIZES}
              onSelect={setQuiltSize} placeholder="Select size…" />
            {quiltSize === 'Custom' && (
              <Field label="Custom Size (W x H)" value={customSize} onChangeText={setCustomSize}
                placeholder='e.g. 60 × 80"' />
            )}
            <Field label="Fabric Details" value={fabricsUsed} onChangeText={setFabricsUsed}
              placeholder="Fabric descriptions, line names…" multiline />
            <Field label="Date Started" value={dateStarted} onChangeText={setDateStarted}
              placeholder="e.g. May 10, 2024" />
            <DropdownPicker label="Piecing Technique" value={piecingTechnique}
              options={PIECING_TECHNIQUES} onSelect={setPiecingTechnique} placeholder="Select technique…" />
          </>
        )}

        {/* Bag fields */}
        {project.type === 'Bag' && (
          <>
            <Field label="Pattern Name" value={bagPatternName} onChangeText={setBagPatternName}
              placeholder="e.g. Noodlehead Anna Griffin" />
            <DropdownPicker label="Bag Style" value={bagStyle} options={BAG_STYLES}
              onSelect={setBagStyle} placeholder="Select bag style…" />
            {bagStyle === 'Custom' && (
              <Field label="Custom Style" value={customBagStyle} onChangeText={setCustomBagStyle}
                placeholder="Describe the bag style" />
            )}
            <Field label="Dimensions" value={dimensions} onChangeText={setDimensions}
              placeholder='e.g. 14"W x 12"H x 5"D' />
            <Field label="Supply List" value={supplyList} onChangeText={setSupplyList}
              placeholder="List hardware, zippers, interfacing…" multiline />
            <Field label="Made For" value={madeFor} onChangeText={setMadeFor} placeholder="e.g. Myself" />
            <Field label="Made By" value={madeBy} onChangeText={setMadeBy} placeholder="e.g. Sabbie" />
            <Field label="Date Started" value={dateStarted} onChangeText={setDateStarted}
              placeholder="e.g. May 10, 2024" />
          </>
        )}

        <Field label="Notes" value={notes} onChangeText={setNotes}
          placeholder="Inspiration, reminders…" multiline />
        <Field label="Storage Spot" value={storageSpot} onChangeText={setStorageSpot}
          placeholder="e.g. Sewing Room – Shelf 2" />

        <TodoList todos={todos} onToggle={toggleTodo} onAdd={addTodo} onRemoveCustom={removeCustomTodo} />

        {stages.length > 0 && (
          <StageTracker stages={stages} currentStageIndex={currentStageIndex} onStageChange={setCurrentStageIndex} />
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <MoreOptionsSheet
        visible={showOptionsMenu}
        onClose={() => setShowOptionsMenu(false)}
        onDuplicate={handleDuplicate}
        onMoveUFO={handleMoveUFO}
        onDelete={handleDelete}
        isUFO={isUFO}
      />
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.LAVENDER_WHITE },
  content: { padding: 20, paddingBottom: 48 },

  editHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 18,
  },
  typeBadge: {
    backgroundColor: COLORS.SOFT_LAVENDER,
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5,
  },
  typeBadgeText: { fontSize: 13, fontWeight: '600', color: COLORS.DEEP_PLUM },
  moreBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(91,45,142,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },

  fieldWrapper: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.MIDNIGHT, marginBottom: 6 },
  input: {
    backgroundColor: '#fff', borderRadius: 10,
    borderWidth: 1.5, borderColor: COLORS.SOFT_LAVENDER,
    paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 15, color: COLORS.MIDNIGHT,
  },
  inputMultiline: { height: 90, paddingTop: 11 },

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
  todoCheck: { padding: 2 },
  todoLabel: { flex: 1, fontSize: 14, color: COLORS.MIDNIGHT },
  todoLabelDone: { textDecorationLine: 'line-through', color: '#9ca3af' },
  todoAddRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 8,
  },
  todoInput: { flex: 1, fontSize: 14, color: COLORS.MIDNIGHT, paddingVertical: 4 },
  todoAddBtn: { padding: 4, backgroundColor: 'rgba(91,45,142,0.1)', borderRadius: 6 },

  // Stages
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
    paddingVertical: 10, paddingHorizontal: 8, borderRadius: 10, marginBottom: 4,
  },
  stageRowCurrent: { backgroundColor: 'rgba(91,45,142,0.07)' },
  stageRowDone: { opacity: 0.6 },
  stageIcon: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#e8e0f0', alignItems: 'center', justifyContent: 'center',
  },
  stageIconDone: { backgroundColor: COLORS.MINT },
  stageIconCurrent: { backgroundColor: COLORS.DEEP_PLUM },
  stageIconDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  stageNum: { fontSize: 10, fontWeight: '600', color: '#6b6b8a' },
  stageLabel: { flex: 1, fontSize: 14, color: COLORS.MIDNIGHT },
  stageLabelDone: { color: '#6b6b8a', textDecorationLine: 'line-through' },
  stageLabelCurrent: { fontWeight: '700', color: COLORS.DEEP_PLUM },
  currentPill: { backgroundColor: COLORS.DEEP_PLUM, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  currentPillText: { fontSize: 9, color: '#fff', fontWeight: '600' },

  // More Options sheet
  optionsSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40,
  },
  optionsTitle: {
    fontSize: 16, fontWeight: '700', color: COLORS.MIDNIGHT, marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  optionLabel: { fontSize: 16, fontWeight: '600', color: COLORS.MIDNIGHT },
  optionCancel: {
    paddingVertical: 16, alignItems: 'center', marginTop: 8,
  },
  optionCancelText: { fontSize: 16, fontWeight: '600', color: COLORS.DEEP_PLUM },

  // Buttons
  buttonRow: {
    flexDirection: 'row', gap: 12, marginTop: 8,
  },
  cancelBtn: {
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
