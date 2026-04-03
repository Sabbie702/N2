// ProjectsScreen.js
// Lists active sewing projects loaded from AsyncStorage.
// Reloads each time the screen comes into focus (e.g. after adding a project).

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import COLORS from '../styles/colors';
import { loadProjects } from '../storage/projects';

function ProjectCard({ project }) {
  const progressPercent = Math.round(project.progress * 100);

  return (
    <View style={styles.card}>
      {/* Top row: name + type badge */}
      <View style={styles.cardHeader}>
        <Text style={styles.projectName} numberOfLines={1}>
          {project.name}
        </Text>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{project.type}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>

      {/* Bottom row: stage + percentage */}
      <View style={styles.cardFooter}>
        <Text style={styles.stageLabel}>{project.stage}</Text>
        <Text style={styles.progressText}>{progressPercent}%</Text>
      </View>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🪡</Text>
      <Text style={styles.emptyTitle}>No projects yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the + button above to start your first project.
      </Text>
    </View>
  );
}

export default function ProjectsScreen() {
  const [projects, setProjects] = useState([]);

  // Reload every time this screen is focused (e.g. returning from NewProject)
  useFocusEffect(
    useCallback(() => {
      loadProjects().then(setProjects);
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProjectCard project={item} />}
        contentContainerStyle={[
          styles.list,
          projects.length === 0 && styles.listEmpty,
        ]}
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LAVENDER_WHITE,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  listEmpty: {
    flex: 1,
  },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  projectName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.MIDNIGHT,
    marginRight: 8,
  },
  typeBadge: {
    backgroundColor: COLORS.SOFT_LAVENDER,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.DEEP_PLUM,
  },

  // Progress bar
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.LAVENDER_WHITE,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.MINT,
    borderRadius: 4,
  },

  // Footer
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stageLabel: {
    fontSize: 13,
    color: COLORS.DEEP_PLUM,
    fontWeight: '500',
  },
  progressText: {
    fontSize: 13,
    color: COLORS.MINT,
    fontWeight: '700',
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 52,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.DEEP_PLUM,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: COLORS.MIDNIGHT,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.7,
  },
});
