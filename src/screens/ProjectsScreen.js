// ProjectsScreen.js
// Active / UFO tabs with sort controls (Stage, Type, Name A-Z).

import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  SafeAreaView, TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../styles/colors';
import { loadActiveProjects, loadUFOProjects } from '../storage/projects';

const SORT_OPTIONS = ['Stage', 'Type', 'Name A-Z'];

function ProjectCard({ project, onPress, isUFO }) {
  const progressPercent = Math.round((project.progress || 0) * 100);
  const paletteCount = project.palettes?.length || 0;
  const stageBadgeBg = isUFO ? COLORS.AMBER : 'rgba(91,45,142,0.12)';
  const stageBadgeColor = isUFO ? '#fff' : COLORS.DEEP_PLUM;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.projectName} numberOfLines={1}>
            {project.name}
          </Text>
          <Text style={styles.projectType}>
            {project.type === 'Quilt' ? 'Quilt' : 'Bag'}
            {project.patternName ? ` · ${project.patternName}` : ''}
          </Text>
        </View>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{project.type}</Text>
        </View>
      </View>

      <View style={styles.stageBadgeRow}>
        <View style={[styles.stageBadge, { backgroundColor: stageBadgeBg }]}>
          <Text style={[styles.stageBadgeText, { color: stageBadgeColor }]}>
            {project.stage || 'Started'}
          </Text>
        </View>
        {project.dateStarted ? (
          <Text style={styles.dateText}>Started {project.dateStarted}</Text>
        ) : null}
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.progressText}>{progressPercent}%</Text>
        {paletteCount > 0 && (
          <Text style={styles.paletteCount}>
            {paletteCount} palette{paletteCount !== 1 ? 's' : ''}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

function EmptyState({ isUFO }) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>{isUFO ? '🧶' : '🪡'}</Text>
      <Text style={styles.emptyTitle}>
        {isUFO ? 'No UFOs here' : 'No projects yet'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {isUFO
          ? 'Un-Finished Objects will show up here when you shelve a project.'
          : 'Tap the + button above to start your first project.'}
      </Text>
    </View>
  );
}

function sortProjects(projects, sortBy) {
  const sorted = [...projects];
  switch (sortBy) {
    case 'Stage':
      sorted.sort((a, b) => (a.currentStageIndex || 0) - (b.currentStageIndex || 0));
      break;
    case 'Type':
      sorted.sort((a, b) => (a.type || '').localeCompare(b.type || ''));
      break;
    case 'Name A-Z':
      sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      break;
  }
  return sorted;
}

export default function ProjectsScreen({ navigation }) {
  const [tab, setTab] = useState('Active');
  const [sortBy, setSortBy] = useState('Stage');
  const [activeProjects, setActiveProjects] = useState([]);
  const [ufoProjects, setUfoProjects] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadActiveProjects().then(setActiveProjects);
      loadUFOProjects().then(setUfoProjects);
    }, [])
  );

  const isUFO = tab === 'UFO';
  const projects = sortProjects(isUFO ? ufoProjects : activeProjects, sortBy);

  return (
    <SafeAreaView style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabRow}>
        {['Active', 'UFO'].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
            activeOpacity={0.85}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sort controls */}
      <View style={styles.sortRow}>
        {SORT_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt}
            style={[styles.sortChip, sortBy === opt && styles.sortChipActive]}
            onPress={() => setSortBy(opt)}
            activeOpacity={0.8}
          >
            <Text style={[styles.sortChipText, sortBy === opt && styles.sortChipTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Project list */}
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            isUFO={isUFO}
            onPress={() =>
              navigation.navigate('ProjectWorkspace', {
                projectId: item.id,
                projectName: item.name,
                projectType: item.type,
              })
            }
          />
        )}
        contentContainerStyle={[
          styles.list,
          projects.length === 0 && styles.listEmpty,
        ]}
        ListEmptyComponent={<EmptyState isUFO={isUFO} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.LAVENDER_WHITE },

  // Tabs
  tabRow: {
    flexDirection: 'row', marginHorizontal: 16,
    marginTop: 12, marginBottom: 8,
    backgroundColor: '#fff', borderRadius: 12,
    padding: 4, borderWidth: 1, borderColor: 'rgba(192,132,252,0.2)',
  },
  tab: {
    flex: 1, paddingVertical: 10, alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: { backgroundColor: COLORS.DEEP_PLUM },
  tabText: { fontSize: 14, fontWeight: '700', color: COLORS.DEEP_PLUM },
  tabTextActive: { color: '#fff' },

  // Sort
  sortRow: {
    flexDirection: 'row', paddingHorizontal: 16,
    marginBottom: 8, gap: 8,
  },
  sortChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, backgroundColor: '#fff',
    borderWidth: 1, borderColor: 'rgba(192,132,252,0.25)',
  },
  sortChipActive: {
    backgroundColor: COLORS.DEEP_PLUM, borderColor: COLORS.DEEP_PLUM,
  },
  sortChipText: { fontSize: 12, fontWeight: '600', color: COLORS.DEEP_PLUM },
  sortChipTextActive: { color: '#fff' },

  // List
  list: { padding: 16, gap: 12 },
  listEmpty: { flex: 1 },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14, padding: 16,
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 8,
  },
  projectName: {
    fontSize: 16, fontWeight: '700',
    color: COLORS.MIDNIGHT, marginRight: 8,
  },
  projectType: {
    fontSize: 12, color: 'rgba(45,27,78,0.55)',
    marginTop: 2,
  },
  typeBadge: {
    backgroundColor: COLORS.SOFT_LAVENDER,
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3,
  },
  typeBadgeText: { fontSize: 12, fontWeight: '600', color: COLORS.DEEP_PLUM },

  stageBadgeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginBottom: 10,
  },
  stageBadge: {
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
  },
  stageBadgeText: { fontSize: 11, fontWeight: '700' },
  dateText: { fontSize: 11, color: 'rgba(45,27,78,0.45)' },

  progressTrack: {
    height: 8, backgroundColor: COLORS.LAVENDER_WHITE,
    borderRadius: 4, overflow: 'hidden', marginBottom: 8,
  },
  progressFill: { height: '100%', backgroundColor: COLORS.MINT, borderRadius: 4 },

  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  progressText: { fontSize: 13, color: COLORS.MINT, fontWeight: '700' },
  paletteCount: { fontSize: 11, color: COLORS.MIDNIGHT, opacity: 0.5 },

  // Empty
  emptyContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40,
  },
  emptyEmoji: { fontSize: 52, marginBottom: 16 },
  emptyTitle: {
    fontSize: 20, fontWeight: '700', color: COLORS.DEEP_PLUM,
    marginBottom: 8, textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15, color: COLORS.MIDNIGHT, textAlign: 'center',
    lineHeight: 22, opacity: 0.7,
  },
});
