// NewProjectScreen.js
// Full project creation form per Feature 1 spec.
// Quilt: pattern, size dropdown, piecing technique, quilting style, stage, fabrics, dates, to-do
// Bag: pattern, bag style dropdown, dimensions, made for/by, dates, to-do

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

// ─── Dropdown picker ──────────────────────────────────────────────────────────

function DropdownPicker({ label, value, options, onSelect, placeholder }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
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

// ─── Text field ───────────────────────────────────────────────────────────────

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

// ─── To-Do checklist ─────────────────────────────────────────────────────────

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
        {/* Add custom item */}
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

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function NewProjectScreen({ navigation }) {
  const [projectType, setProjectType] = useState(null);

  // Shared
  const [name, setName]               = useState('');
  const [description, setDescription] = useState('');
  const [madeFor, setMadeFor]         = useState('');
  const [madeBy, setMadeBy]           = useState('');
  const [dateStarted, setDateStarted] = useState('');
  const [dateCompleted, setDateCompleted] = useState('');
  const [notes, setNotes]             = useState('');
  const [tags, setTags]               = useState('');

  // Quilt-only
  const [patternName, setPatternName]       = useState('');
  const [quiltSize, setQuiltSize]           = useState('');
  const [customSize, setCustomSize]         = useState('');
  const [piecingTechnique, setPiecingTechnique] = useState('');
  const [quiltingStyle, setQuiltingStyle]   = useState('');
  const [quiltedBy, setQuiltedBy]           = useState('');
  const [fabricsUsed, setFabricsUsed]       = useState('');

  // Bag-only
  const [bagPatternName, setBagPatternName] = useState('');
  const [bagStyle, setBagStyle]             = useState('');
  const [customBagStyle, setCustomBagStyle] = useState('');
  const [dimensions, setDimensions]         = useState('');
  const [supplyList, setSupplyList]         = useState('');

  // Todos
  const [todos, setTodos] = useState(
    DEFAULT_TODOS.map(label => ({ label, done: false }))
  );

  const handleTypeSelect = (type) => {
    setProjectType(type);
    setTodos(DEFAULT_TODOS.map(label => ({ label, done: false })));
  };

  const toggleTodo = (i) => {
    setTodos(prev => prev.map((t, idx) => idx === i ? { ...t, done: !t.done } : t));
  };
  const addTodo = (label) => setTodos(prev => [...prev, { label, done: false }]);
  const removeCustomTodo = (i) => setTodos(prev => prev.filter((_, idx) => idx !== i));

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
    const resolvedSize = quiltSize === 'Custom' ? customSize : quiltSize;
    const resolvedBagStyle = bagStyle === 'Custom' ? customBagStyle : bagStyle;

    const project = {
      id: Date.now().toString(),
      type: projectType,
      name: name.trim(),
      description: description.trim(),
      progress: 0,
      stage: stages[0],
      stages,
      currentStageIndex: 0,
      createdAt: new Date().toISOString(),
      madeFor: madeFor.trim(),
      madeBy: madeBy.trim(),
      dateStarted: dateStarted.trim(),
      dateCompleted: dateCompleted.trim(),
      notes: notes.trim(),
      tags: tags.trim(),
      todos,
      ...(projectType === 'Quilt'
        ? {
            patternName:      patternName.trim(),
            size:             resolvedSize.trim(),
            piecingTechnique: piecingTechnique,
            quiltingStyle:    quiltingStyle,
            quiltedBy:        quiltedBy.trim(),
            fabricsUsed:      fabricsUsed.trim(),
          }
        : {
            patternName:  bagPatternName.trim(),
            bagStyle:     resolvedBagStyle.trim(),
            dimensions:   dimensions.trim(),
            supplyList:   supplyList.trim(),
          }),
    };

    try {
      await addProject(project);
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Could not save the project. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Type picker */}
        <Text style={styles.sectionLabel}>Project Type</Text>
        <View style={styles.typeRow}>
          {['Quilt', 'Bag'].map(type => (
            <TouchableOpacity
              key={type}
              style={[styles.typeButton, projectType === type && styles.typeButtonActive]}
              onPress={() => handleTypeSelect(type)}
              activeOpacity={0.8}
            >
              <Text style={styles.typeEmoji}>{type === 'Quilt' ? '🧩' : '👜'}</Text>
              <Text style={[styles.typeButtonText, projectType === type && styles.typeButtonTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {projectType !== null && (
          <>
            <View style={styles.divider} />

            {/* ── Shared fields ── */}
            <Field label="Project Name" value={name} onChangeText={setName}
              placeholder={projectType === 'Quilt' ? 'e.g. Garden Wedding Quilt' : 'e.g. Farmers Market Tote'} />
            <Field label="Description" value={description} onChangeText={setDescription}
              placeholder="Describe this project…" multiline />

            {/* ── Quilt fields ── */}
            {projectType === 'Quilt' && (
              <>
                <Field label="Pattern Name" value={patternName} onChangeText={setPatternName}
                  placeholder="e.g. Flying Geese, Log Cabin" />
                <DropdownPicker label="Project Size" value={quiltSize} options={QUILT_SIZES}
                  onSelect={setQuiltSize} placeholder="Select size…" />
                {quiltSize === 'Custom' && (
                  <Field label="Custom Size (W × H)" value={customSize} onChangeText={setCustomSize}
                    placeholder='e.g. 60 × 80"' />
                )}
                <DropdownPicker label="Piecing Technique" value={piecingTechnique}
                  options={PIECING_TECHNIQUES} onSelect={setPiecingTechnique} placeholder="Select technique…" />
                <DropdownPicker label="Quilting Style" value={quiltingStyle}
                  options={QUILTING_STYLES} onSelect={setQuiltingStyle} placeholder="Select style…" />
                <Field label="Quilted By" value={quiltedBy} onChangeText={setQuiltedBy}
                  placeholder="e.g. Self, Longarm studio name" />
                <Field label="Fabrics Used" value={fabricsUsed} onChangeText={setFabricsUsed}
                  placeholder="Fabric descriptions, line names…" multiline />
              </>
            )}

            {/* ── Bag fields ── */}
            {projectType === 'Bag' && (
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
                  placeholder="e.g. 12 × 14 × 4 in" />
                <Field label="Supply List" value={supplyList} onChangeText={setSupplyList}
                  placeholder="List hardware, zippers, interfacing…" multiline />
              </>
            )}

            {/* ── Shared footer fields ── */}
            <Field label="Made For" value={madeFor} onChangeText={setMadeFor}
              placeholder="e.g. Self, Gift for Mom" />
            <Field label="Made By" value={madeBy} onChangeText={setMadeBy}
              placeholder="Your name or maker's name" />
            <Field label="Date Started" value={dateStarted} onChangeText={setDateStarted}
              placeholder="e.g. Apr 1, 2026" />
            <Field label="Date Completed" value={dateCompleted} onChangeText={setDateCompleted}
              placeholder="Leave blank if in progress" />
            <Field label="Tags" value={tags} onChangeText={setTags}
              placeholder="e.g. gift, modern, scrappy (comma separated)" />
            <Field label="Notes" value={notes} onChangeText={setNotes}
              placeholder="Inspiration, reminders, fabric sources…" multiline />

            {/* ── To-Do ── */}
            <TodoList
              todos={todos}
              onToggle={toggleTodo}
              onAdd={addTodo}
              onRemoveCustom={removeCustomTodo}
            />

            {/* ── Stage preview ── */}
            <View style={styles.stagesCard}>
              <Text style={styles.stagesTitle}>Default Stages</Text>
              {(projectType === 'Quilt' ? QUILT_STAGES : BAG_STAGES).map((stage, i) => (
                <View key={stage} style={styles.stageRow}>
                  <View style={styles.stageDot} />
                  <Text style={styles.stageText}>{i + 1}. {stage}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
              <Text style={styles.saveButtonText}>Save Project</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.LAVENDER_WHITE },
  content:   { padding: 20, paddingBottom: 48 },

  sectionLabel: {
    fontSize: 13, fontWeight: '700', color: COLORS.DEEP_PLUM,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12,
  },
  typeRow: { flexDirection: 'row', gap: 12 },
  typeButton: {
    flex: 1, alignItems: 'center', paddingVertical: 18,
    borderRadius: 14, borderWidth: 2, borderColor: COLORS.SOFT_LAVENDER,
    backgroundColor: '#fff',
  },
  typeButtonActive: { borderColor: COLORS.DEEP_PLUM, backgroundColor: COLORS.DEEP_PLUM },
  typeEmoji:        { fontSize: 28, marginBottom: 6 },
  typeButtonText:   { fontSize: 15, fontWeight: '700', color: COLORS.DEEP_PLUM },
  typeButtonTextActive: { color: '#fff' },

  divider: {
    height: 1, backgroundColor: COLORS.SOFT_LAVENDER,
    opacity: 0.4, marginVertical: 24,
  },

  fieldWrapper: { marginBottom: 16 },
  fieldLabel:   { fontSize: 13, fontWeight: '600', color: COLORS.MIDNIGHT, marginBottom: 6 },
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
  dropdownValue:       { fontSize: 15, color: COLORS.MIDNIGHT },
  dropdownPlaceholder: { fontSize: 15, color: COLORS.SOFT_LAVENDER },

  // Dropdown modal
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
  pickerOptionActive: { },
  pickerOptionText:       { fontSize: 15, color: COLORS.MIDNIGHT },
  pickerOptionTextActive: { fontWeight: '700', color: COLORS.DEEP_PLUM },

  // To-Do
  todoCard: {
    backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 1.5, borderColor: COLORS.SOFT_LAVENDER,
    overflow: 'hidden',
  },
  todoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, paddingHorizontal: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  todoCheck:     { padding: 2 },
  todoLabel:     { flex: 1, fontSize: 14, color: COLORS.MIDNIGHT },
  todoLabelDone: { textDecorationLine: 'line-through', color: '#9ca3af' },
  todoAddRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 8,
  },
  todoInput: {
    flex: 1, fontSize: 14, color: COLORS.MIDNIGHT,
    paddingVertical: 4,
  },
  todoAddBtn: {
    padding: 4, backgroundColor: 'rgba(91,45,142,0.1)',
    borderRadius: 6,
  },

  // Stages
  stagesCard: {
    backgroundColor: '#fff', borderRadius: 14,
    padding: 16, marginTop: 8, marginBottom: 24,
    borderWidth: 1, borderColor: COLORS.SOFT_LAVENDER,
  },
  stagesTitle: {
    fontSize: 13, fontWeight: '700', color: COLORS.DEEP_PLUM,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12,
  },
  stageRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  stageDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: COLORS.MINT, marginRight: 10,
  },
  stageText: { fontSize: 14, color: COLORS.MIDNIGHT },

  // Save
  saveButton: {
    backgroundColor: COLORS.DEEP_PLUM, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
