// StashScreen.js
// Manage fabric stash, notions, and supplies.
// + FAB opens a category picker to add new items.

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  FlatList, SafeAreaView, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../styles/colors';

// ─── Stash categories ────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'fabric',      label: 'Fabric',       icon: 'layers-outline',        color: COLORS.DEEP_PLUM },
  { id: 'thread',      label: 'Thread',       icon: 'ellipse-outline',       color: '#7C3ABF' },
  { id: 'zipper',      label: 'Zippers',      icon: 'git-commit-outline',    color: COLORS.MINT },
  { id: 'ruler',       label: 'Rulers',       icon: 'resize-outline',        color: '#4aad85' },
  { id: 'interfacing', label: 'Interfacing',  icon: 'duplicate-outline',     color: '#a78bfa' },
  { id: 'batting',     label: 'Batting',      icon: 'cloud-outline',         color: '#60a5fa' },
  { id: 'notions',     label: 'Notions',      icon: 'construct-outline',     color: '#f59e0b' },
  { id: 'hardware',    label: 'Hardware',     icon: 'settings-outline',      color: '#f87171' },
  { id: 'pattern',     label: 'Patterns',     icon: 'document-text-outline', color: '#34d399' },
  { id: 'other',       label: 'Other',        icon: 'add-circle-outline',    color: '#9ca3af' },
];

export default function StashScreen() {
  const [items]      = useState([]);
  const [showPicker, setShowPicker] = useState(false);

  const grouped = CATEGORIES.map(cat => ({
    ...cat,
    count: items.filter(i => i.categoryId === cat.id).length,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Summary row */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNum}>{items.length}</Text>
            <Text style={styles.summaryLabel}>Total Items</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNum}>
              {CATEGORIES.filter(c => items.some(i => i.categoryId === c.id)).length}
            </Text>
            <Text style={styles.summaryLabel}>Categories</Text>
          </View>
        </View>

        {/* Category grid */}
        <Text style={styles.sectionTitle}>Browse by Category</Text>
        <View style={styles.grid}>
          {grouped.map(cat => (
            <TouchableOpacity key={cat.id} style={styles.catCard} activeOpacity={0.8}>
              <View style={[styles.catIcon, { backgroundColor: cat.color + '22' }]}>
                <Ionicons name={cat.icon} size={26} color={cat.color} />
              </View>
              <Text style={styles.catLabel}>{cat.label}</Text>
              <Text style={styles.catCount}>{cat.count} items</Text>
            </TouchableOpacity>
          ))}
        </View>

        {items.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🧵</Text>
            <Text style={styles.emptyTitle}>Your stash is empty</Text>
            <Text style={styles.emptySub}>
              Tap + to start logging your fabrics, notions, and supplies.
            </Text>
          </View>
        )}

      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowPicker(true)} activeOpacity={0.85}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Category picker modal */}
      <Modal visible={showPicker} transparent animationType="slide" onRequestClose={() => setShowPicker(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowPicker(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Add to Stash</Text>
          <Text style={styles.sheetSub}>What are you adding?</Text>
          <FlatList
            data={CATEGORIES}
            keyExtractor={i => i.id}
            numColumns={2}
            columnWrapperStyle={styles.sheetRow}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.sheetItem}
                activeOpacity={0.8}
                onPress={() => setShowPicker(false)}
              >
                <View style={[styles.sheetItemIcon, { backgroundColor: item.color + '22' }]}>
                  <Ionicons name={item.icon} size={28} color={item.color} />
                </View>
                <Text style={styles.sheetItemLabel}>{item.label}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.LAVENDER_WHITE },
  scroll:    { padding: 16, paddingBottom: 100 },

  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  summaryCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14,
    padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  summaryNum:   { fontSize: 28, fontWeight: '800', color: COLORS.DEEP_PLUM },
  summaryLabel: { fontSize: 12, color: '#6b6b8a', marginTop: 2 },

  sectionTitle: {
    fontSize: 13, fontWeight: '700', color: COLORS.MIDNIGHT,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  catCard: {
    width: '47%', backgroundColor: '#fff', borderRadius: 14,
    padding: 14, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  catIcon:  { borderRadius: 14, padding: 10, marginBottom: 8 },
  catLabel: { fontSize: 13, fontWeight: '600', color: COLORS.MIDNIGHT, marginBottom: 2 },
  catCount: { fontSize: 11, color: '#6b6b8a' },

  empty:      { alignItems: 'center', paddingVertical: 32 },
  emptyEmoji: { fontSize: 44, marginBottom: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: COLORS.MIDNIGHT, marginBottom: 6 },
  emptySub:   { fontSize: 13, color: '#6b6b8a', textAlign: 'center', lineHeight: 20 },

  fab: {
    position: 'absolute', right: 20, bottom: 20,
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: COLORS.DEEP_PLUM,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.DEEP_PLUM,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 8,
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 12,
    maxHeight: '75%',
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#ddd', alignSelf: 'center', marginBottom: 16,
  },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: COLORS.MIDNIGHT, marginBottom: 4 },
  sheetSub:   { fontSize: 13, color: '#6b6b8a', marginBottom: 16 },
  sheetRow:   { gap: 12, marginBottom: 12 },
  sheetItem: {
    flex: 1, backgroundColor: COLORS.LAVENDER_WHITE,
    borderRadius: 14, padding: 14, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
  },
  sheetItemIcon:  { borderRadius: 12, padding: 10, marginBottom: 8 },
  sheetItemLabel: { fontSize: 13, fontWeight: '600', color: COLORS.MIDNIGHT },
});
