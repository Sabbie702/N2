// src/storage/notes.js
// AsyncStorage CRUD for Nimble Notes.

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'nimble_needle_notes';

export async function loadNotes() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function saveNotes(notes) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export async function addNote(note) {
  const existing = await loadNotes();
  // Most recent first
  await saveNotes([note, ...existing]);
}

export async function deleteNote(id) {
  const existing = await loadNotes();
  await saveNotes(existing.filter(n => n.id !== id));
}
