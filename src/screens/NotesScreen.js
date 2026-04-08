// src/screens/NotesScreen.js
// Nimble Notes — quick-capture sticky note list.
// Features: colour-coded cards, search, swipe-to-delete, FAB to create.

import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  TextInput, Animated, SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NoteCard } from '../components/NoteCard';
import { NoteCreateSheet } from '../components/NoteCreateSheet';
import { loadNotes, addNote, deleteNote } from '../storage/notes';
import COLORS from '../styles/colors';

const BRAND = {
  plum: '#5B2D8E', mint: '#4EC9A0',
  lt: '#1a1a2e', mu: '#6b6b8a',
};

function EmptyNotes({ searching }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyEmoji}>{searching ? '🔍' : '📝'}</Text>
      <Text style={styles.emptyTitle}>
        {searching ? 'No notes match your search' : 'No notes yet'}
      </Text>
      {!searching && (
        <Text style={styles.emptySub}>
          Tap the + button to capture your first thought.
        </Text>
      )}
    </View>
  );
}

export default function NotesScreen({ navigation }) {
  const [notes, setNotes]           = useState([]);
  const [query, setQuery]           = useState('');
  const [searching, setSearching]   = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast]           = useState('');
  const toastAnim   = useRef(new Animated.Value(0)).current;
  const openSwipeRef = useRef(null); // track currently-open swipeable

  useFocusEffect(
    useCallback(() => {
      loadNotes().then(setNotes);
    }, [])
  );

  const filtered = query.trim()
    ? notes.filter(n =>
        n.text.toLowerCase().includes(query.toLowerCase()) ||
        (n.projectName || '').toLowerCase().includes(query.toLowerCase())
      )
    : notes;

  const showToast = (msg) => {
    setToast(msg);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(toastAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setToast(''));
  };

  const handleDelete = async (id) => {
    // Animate card out is handled by Swipeable; just remove from state + storage
    await deleteNote(id);
    setNotes(prev => prev.filter(n => n.id !== id));
    showToast('Note deleted');
  };

  const handleSave = async (note) => {
    await addNote(note);
    setNotes(prev => [note, ...prev]);
    showToast('Note saved ✓');
  };

  const handleSwipeOpen = (ref) => {
    // Close any previously open swipeable
    if (openSwipeRef.current && openSwipeRef.current !== ref) {
      openSwipeRef.current.current?.close();
    }
    openSwipeRef.current = ref;
  };

  const startSearch = () => setSearching(true);
  const endSearch   = () => { setSearching(false); setQuery(''); };

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Custom header ── */}
      <View style={styles.header}>
        {searching ? (
          <>
            <TouchableOpacity onPress={endSearch} style={styles.headerBtn}>
              <Ionicons name="arrow-back" size={20} color={COLORS.LAVENDER_WHITE} />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Search notes…"
              placeholderTextColor="rgba(245,240,250,0.6)"
              autoFocus
            />
          </>
        ) : (
          <>
            <View style={styles.headerLeft}>
              {navigation?.canGoBack() && (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                  <Ionicons name="arrow-back" size={20} color={COLORS.LAVENDER_WHITE} />
                </TouchableOpacity>
              )}
              <Text style={styles.headerTitle}>Notes</Text>
            </View>
            <TouchableOpacity onPress={startSearch} style={styles.headerBtn}>
              <Ionicons name="search" size={20} color={COLORS.LAVENDER_WHITE} />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* ── Note list ── */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onDelete={() => handleDelete(item.id)}
            onSwipeOpen={handleSwipeOpen}
          />
        )}
        contentContainerStyle={[
          styles.list,
          filtered.length === 0 && styles.listEmpty,
        ]}
        ListEmptyComponent={<EmptyNotes searching={!!query.trim()} />}
        showsVerticalScrollIndicator={false}
      />

      {/* ── FAB ── */}
      {!searching && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowCreate(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* ── Toast ── */}
      {toast !== '' && (
        <Animated.View style={[styles.toast, { opacity: toastAnim }]}>
          <Text style={styles.toastText}>{toast}</Text>
        </Animated.View>
      )}

      {/* ── Create sheet ── */}
      <NoteCreateSheet
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.LAVENDER_WHITE },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.DEEP_PLUM,
    paddingHorizontal: 16, paddingVertical: 12,
    gap: 10,
  },
  headerLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: {
    fontSize: 18, fontWeight: 'bold',
    color: COLORS.LAVENDER_WHITE,
  },
  headerBtn: {
    padding: 4,
    hitSlop: { top: 8, bottom: 8, left: 8, right: 8 },
  },
  searchInput: {
    flex: 1, fontSize: 15, color: COLORS.LAVENDER_WHITE,
    paddingVertical: 6,
  },

  // List
  list: { paddingVertical: 10, paddingBottom: 90 },
  listEmpty: { flex: 1 },

  // Empty state
  empty: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 40, paddingTop: 60,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 14 },
  emptyTitle: {
    fontSize: 18, fontWeight: '700', color: COLORS.DEEP_PLUM,
    marginBottom: 8, textAlign: 'center',
  },
  emptySub: {
    fontSize: 14, color: '#6b6b8a',
    textAlign: 'center', lineHeight: 20,
  },

  // FAB
  fab: {
    position: 'absolute', bottom: 24, right: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.DEEP_PLUM,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8,
    elevation: 6,
  },

  // Toast
  toast: {
    position: 'absolute', bottom: 90, alignSelf: 'center',
    backgroundColor: 'rgba(30,20,50,0.88)',
    paddingHorizontal: 18, paddingVertical: 9,
    borderRadius: 20,
  },
  toastText: { color: '#fff', fontSize: 13 },
});
