// src/storage/projects.js
// CRUD helpers for projects (and their saved palettes) using AsyncStorage.

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'nimble_needle_projects';
const SCRAPBOOK_KEY = 'nimble_needle_scrapbook';

export async function loadProjects() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function loadActiveProjects() {
  const all = await loadProjects();
  return all.filter(p => (p.status || 'active') === 'active');
}

export async function loadUFOProjects() {
  const all = await loadProjects();
  return all.filter(p => p.status === 'ufo');
}

export async function saveProjects(projects) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export async function addProject(project) {
  const existing = await loadProjects();
  await saveProjects([...existing, { ...project, status: 'active', palettes: [] }]);
}

export async function deleteProject(projectId) {
  const projects = await loadProjects();
  await saveProjects(projects.filter(p => p.id !== projectId));
}

export async function duplicateProject(projectId) {
  const projects = await loadProjects();
  const source = projects.find(p => p.id === projectId);
  if (!source) return;
  const copy = {
    ...source,
    id: Date.now().toString(),
    name: `${source.name} (Copy)`,
    status: 'active',
    progress: 0,
    currentStageIndex: 0,
    stage: source.stages?.[0] || 'Started',
    dateCompleted: '',
    completedAt: null,
    createdAt: new Date().toISOString(),
    palettes: [],
    todos: source.todos?.map(t => ({ ...t, done: false })) || [],
  };
  await saveProjects([...projects, copy]);
  return copy;
}

export async function moveToUFO(projectId) {
  return updateProject(projectId, { status: 'ufo' });
}

export async function moveToActive(projectId) {
  return updateProject(projectId, { status: 'active' });
}

// ─── Scrapbook ──────────────────────────────────────────────────────────────

export async function loadScrapbook() {
  const raw = await AsyncStorage.getItem(SCRAPBOOK_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function moveToScrapbook(projectId) {
  const projects = await loadProjects();
  const project = projects.find(p => p.id === projectId);
  if (!project) return;
  const completed = {
    ...project,
    status: 'completed',
    completedAt: project.completedAt || new Date().toISOString(),
  };
  await saveProjects(projects.filter(p => p.id !== projectId));
  const scrapbook = await loadScrapbook();
  await AsyncStorage.setItem(SCRAPBOOK_KEY, JSON.stringify([...scrapbook, completed]));
  return completed;
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

export async function updateProject(projectId, changes) {
  const projects = await loadProjects();
  const updated = projects.map(p =>
    p.id === projectId ? { ...p, ...changes } : p
  );
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
