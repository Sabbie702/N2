// src/storage/projects.js
// CRUD helpers for projects using AsyncStorage.

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'nimble_needle_projects';

export async function loadProjects() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveProjects(projects) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export async function addProject(project) {
  const existing = await loadProjects();
  await saveProjects([...existing, project]);
}
