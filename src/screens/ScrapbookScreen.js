// ScrapbookScreen.js
// Completed projects gallery — Quilts / Bags tabs with sort by date or name.

import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  SafeAreaView, TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../styles/colors';
import { loadScrapbook } from '../storage/projects';

const SORT_OPTIONS = ['Date', 'Name A-Z'];

function ScrapbookCard({ project }) {
  const completedDate = project.completedAt
    ? new Date(project.completedAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    : project.dateCompleted || '—';

  return (
    <View style={styles.card}>
      <View style={styles.cardImagePlaceholder}>
        <Ionicons
          name={project.type === 'Quilt' ? 'grid-outline' : 'bag-outline'}
          size={32}
          color={COLORS.SOFT_LAVENDER}
        />
      </View>
      <Text style={styles.cardName} numberOfLines={1}>{project.name}</Text>
      <Text style={styles.cardDate}>Completed {completedDate}</Text>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="book-outline" size={52} color={COLORS.SOFT_LAVENDER} />
      <Text style={styles.emptyTitle}>Your Scrapbook is empty</Text>
      <Text style={styles.emptySubtitle}>
        Completed projects will appear here. Mark a project as complete to see it in your Scrapbook.
      </Text>
    </View>
  );
}

export default function ScrapbookScreen() {
  const [tab, setTab] = useState('Quilts');
  const [sortBy, setSortBy] = useState('Date');
  const [entries, setEntries] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadScrapbook().then(setEntries);
    }, [])
  );

  const filtered = entries.filter(p =>
    tab === 'Quilts' ? p.type === 'Quilt' : p.type === 'Bag'
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'Date') {
      return new Date(b.completedAt || 0) - new Date(a.completedAt || 0);
    }
    return (a.name || '').localeCompare(b.name || '');
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabRow}>
        {['Quilts', 'Bags'].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
            activeOpacity={0.85}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sort + filter */}
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Filter:</Text>
        <Text style={styles.filterValue}>All Time</Text>
        <View style={{ flex: 1 }} />
        <Text style={styles.filterLabel}>Sort:</Text>
        {SORT_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt}
            style={[styles.sortChip, sortBy === opt && styles.sortChipActive]}
            onPress={() => setSortBy(opt)}
          >
            <Text style={[styles.sortChipText, sortBy === opt && styles.sortChipTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Grid */}
      <FlatList
        data={sorted}
        keyExtractor={item => item.id}
        numColumns={3}
        renderItem={({ item }) => <ScrapbookCard project={item} />}
        contentContainerStyle={[
          styles.grid,
          sorted.length === 0 && styles.gridEmpty,
        ]}
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={sorted.length > 0 ? styles.gridRow : undefined}
      />

      {/* Share CTA */}
      {sorted.length > 0 && (
        <View style={styles.shareBanner}>
          <Text style={styles.shareText}>
            Share your {tab === 'Quilts' ? 'Quilt' : 'Bag'} Cards with friends!{'\n'}
            They can view your projects in the app.
          </Text>
          <TouchableOpacity style={styles.shareBtn} activeOpacity={0.85}>
            <Text style={styles.shareBtnText}>Learn More</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.LAVENDER_WHITE },

  tabRow: {
    flexDirection: 'row', marginHorizontal: 16,
    marginTop: 12, marginBottom: 8,
    backgroundColor: '#fff', borderRadius: 12,
    padding: 4, borderWidth: 1, borderColor: 'rgba(192,132,252,0.2)',
  },
  tab: {
    flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10,
  },
  tabActive: { backgroundColor: COLORS.DEEP_PLUM },
  tabText: { fontSize: 14, fontWeight: '700', color: COLORS.DEEP_PLUM },
  tabTextActive: { color: '#fff' },

  filterRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    marginBottom: 10, gap: 6,
  },
  filterLabel: { fontSize: 12, fontWeight: '600', color: '#999' },
  filterValue: { fontSize: 12, fontWeight: '600', color: COLORS.DEEP_PLUM },
  sortChip: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 14, backgroundColor: '#fff',
    borderWidth: 1, borderColor: 'rgba(192,132,252,0.25)',
  },
  sortChipActive: { backgroundColor: COLORS.DEEP_PLUM, borderColor: COLORS.DEEP_PLUM },
  sortChipText: { fontSize: 11, fontWeight: '600', color: COLORS.DEEP_PLUM },
  sortChipTextActive: { color: '#fff' },

  grid: { paddingHorizontal: 12 },
  gridEmpty: { flex: 1 },
  gridRow: { gap: 10, marginBottom: 10 },

  card: {
    flex: 1, maxWidth: '33%',
    backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden',
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  cardImagePlaceholder: {
    height: 100, backgroundColor: COLORS.LAVENDER_WHITE,
    alignItems: 'center', justifyContent: 'center',
  },
  cardName: {
    fontSize: 12, fontWeight: '700', color: COLORS.MIDNIGHT,
    paddingHorizontal: 8, paddingTop: 8,
  },
  cardDate: {
    fontSize: 10, color: '#999',
    paddingHorizontal: 8, paddingBottom: 8, paddingTop: 2,
  },

  emptyContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20, fontWeight: '700', color: COLORS.DEEP_PLUM,
    marginTop: 16, marginBottom: 8, textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15, color: COLORS.MIDNIGHT, textAlign: 'center',
    lineHeight: 22, opacity: 0.7,
  },

  shareBanner: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 16, padding: 14,
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(192,132,252,0.2)',
  },
  shareText: { flex: 1, fontSize: 12, color: 'rgba(45,27,78,0.6)', lineHeight: 17 },
  shareBtn: {
    backgroundColor: COLORS.DEEP_PLUM, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  shareBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },
});
