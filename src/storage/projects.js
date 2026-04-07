// src/storage/projects.js
// CRUD helpers for projects (and their saved palettes) using AsyncStorage.

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
  await saveProjects([...existing, { ...project, palettes: [] }]);
}

// ─── Palette CRUD ────────────────────────────────────────────────────────────

export async function savePaletteToProject(projectId, palette) {
  const projects = await loadProjects();
  const updated = projects.map(p => {
    if (p.id !== projectId) return p;
    return { ...p, palettes: [...(p.palettes || []), palette] };
  });
  await saveProjects(updated);
}

export async function updatePaletteInProject(projectId, paletteId, changes) {
  const projects = await loadProjects();
  const updated = projects.map(p => {
    if (p.id !== projectId) return p;
    const palettes = (p.palettes || []).map(pal =>
      pal.id === paletteId
        ? { ...pal, ...changes, updatedAt: new Date().toISOString() }
        : pal
    );
    return { ...p, palettes };
  });
  await saveProjects(updated);
}

export async function removePaletteFromProject(projectId, paletteId) {
  const projects = await loadProjects();
  const updated = projects.map(p => {
    if (p.id !== projectId) return p;
    return { ...p, palettes: (p.palettes || []).filter(pal => pal.id !== paletteId) };
  });
  await saveProjects(updated);
}
