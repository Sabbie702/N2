import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const STORAGE_KEY = 'nimble_needle_patterns';

export async function loadPatterns() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function savePattern(newPattern) {
  try {
    const existing = await loadPatterns();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, newPattern]));
    return true;
  } catch (error) {
    console.error('Error saving pattern:', error);
    return false;
  }
}

export async function updatePattern(updatedPattern) {
  try {
    const existing = await loadPatterns();
    const updated = existing.map(p =>
      p.id === updatedPattern.id ? updatedPattern : p
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error updating pattern:', error);
    return false;
  }
}

export async function deletePattern(patternId) {
  try {
    const existing = await loadPatterns();
    const toDelete = existing.find(p => p.id === patternId);

    if (toDelete?.coverPhotoUri) {
      await FileSystem.deleteAsync(toDelete.coverPhotoUri, { idempotent: true });
    }
    if (toDelete?.suppliesPhotoUri) {
      await FileSystem.deleteAsync(toDelete.suppliesPhotoUri, { idempotent: true });
    }

    const updated = existing.filter(p => p.id !== patternId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error deleting pattern:', error);
    return false;
  }
}

export async function savePhotoToStorage(tempUri, filename) {
  try {
    const folder = FileSystem.documentDirectory + 'patterns/';
    await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
    const dest = folder + filename;
    await FileSystem.copyAsync({ from: tempUri, to: dest });
    return dest;
  } catch (error) {
    console.error('Error saving photo:', error);
    return null;
  }
}
