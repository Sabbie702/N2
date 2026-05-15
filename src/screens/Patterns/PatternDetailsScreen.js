import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Image, StyleSheet, Alert, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {
  savePattern, updatePattern, savePhotoToStorage,
} from '../../storage/patternStorage';
import COLORS from '../../styles/colors';

async function pickImage(type) {
  if (type === 'camera') {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos.');
      return null;
    }
  } else {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Photo library permission is required.');
      return null;
    }
  }

  const result = type === 'camera'
    ? await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      })
    : await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
  return null;
}

export default function PatternDetailsScreen({ route, navigation }) {
  const { mode, pattern } = route.params;
  const isEditing = mode === 'edit';

  const [patternType, setPatternType] = useState(pattern?.patternType || 'Quilt');
  const [patternName, setPatternName] = useState(pattern?.patternName || '');
  const [brand, setBrand] = useState(pattern?.brand || '');
  const [patternNumber, setPatternNumber] = useState(pattern?.patternNumber || '');
  const [notes, setNotes] = useState(pattern?.notes || '');
  const [coverPhotoUri, setCoverPhotoUri] = useState(pattern?.coverPhotoUri || null);
  const [suppliesPhotoUri, setSuppliesPhotoUri] = useState(pattern?.suppliesPhotoUri || null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Pattern' : 'New Pattern',
    });
  }, []);

  async function handlePhoto(slot) {
    Alert.alert('Add Photo', 'Choose a source', [
      {
        text: 'Take Photo',
        onPress: async () => {
          const uri = await pickImage('camera');
          if (uri) {
            if (slot === 'cover') setCoverPhotoUri(uri);
            else setSuppliesPhotoUri(uri);
          }
        },
      },
      {
        text: 'Choose from Library',
        onPress: async () => {
          const uri = await pickImage('library');
          if (uri) {
            if (slot === 'cover') setCoverPhotoUri(uri);
            else setSuppliesPhotoUri(uri);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  async function handleSave() {
    if (!patternName.trim()) {
      Alert.alert('Pattern name required', 'Please enter a name for this pattern.');
      return;
    }

    setSaving(true);

    let finalCoverUri = coverPhotoUri;
    let finalSuppliesUri = suppliesPhotoUri;

    if (coverPhotoUri && !coverPhotoUri.includes('patterns/')) {
      finalCoverUri = await savePhotoToStorage(
        coverPhotoUri,
        `cover_${Date.now()}.jpg`
      );
    }
    if (suppliesPhotoUri && !suppliesPhotoUri.includes('patterns/')) {
      finalSuppliesUri = await savePhotoToStorage(
        suppliesPhotoUri,
        `supplies_${Date.now()}.jpg`
      );
    }

    const patternData = {
      id: isEditing ? pattern.id : Date.now().toString(),
      patternType,
      patternName: patternName.trim(),
      brand: brand.trim(),
      patternNumber: patternNumber.trim(),
      notes: notes.trim(),
      coverPhotoUri: finalCoverUri,
      suppliesPhotoUri: finalSuppliesUri,
      createdAt: isEditing ? pattern.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const success = isEditing
      ? await updatePattern(patternData)
      : await savePattern(patternData);

    setSaving(false);

    if (success) {
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Could not save pattern. Please try again.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Pattern Type Selector */}
        <Text style={styles.label}>Pattern Type</Text>
        <View style={styles.typeRow}>
          {['Quilt', 'Bag'].map(type => (
            <TouchableOpacity
              key={type}
              style={[styles.typeBtn, patternType === type && styles.typeBtnActive]}
              activeOpacity={0.7}
              onPress={() => setPatternType(type)}
            >
              <Ionicons
                name={type === 'Quilt' ? 'grid-outline' : 'bag-outline'}
                size={20}
                color={patternType === type ? '#fff' : COLORS.SOFT_LAVENDER}
                style={{ marginBottom: 4 }}
              />
              <Text style={[styles.typeBtnText, patternType === type && styles.typeBtnTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Text Fields */}
        <Text style={styles.label}>Pattern Name *</Text>
        <TextInput
          style={styles.input}
          value={patternName}
          onChangeText={setPatternName}
          placeholder="e.g. Log Cabin Throw"
          placeholderTextColor={COLORS.SOFT_LAVENDER}
        />

        <Text style={styles.label}>Brand / Designer</Text>
        <TextInput
          style={styles.input}
          value={brand}
          onChangeText={setBrand}
          placeholder="e.g. Missouri Star, Moda, Riley Blake"
          placeholderTextColor={COLORS.SOFT_LAVENDER}
        />

        <Text style={styles.label}>Pattern Number</Text>
        <TextInput
          style={styles.input}
          value={patternNumber}
          onChangeText={setPatternNumber}
          placeholder="e.g. MQC-1042"
          placeholderTextColor={COLORS.SOFT_LAVENDER}
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.inputMulti]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add any notes about this pattern..."
          placeholderTextColor={COLORS.SOFT_LAVENDER}
          multiline
          numberOfLines={4}
        />

        {/* Cover Photo */}
        <Text style={styles.label}>Cover Photo</Text>
        <Text style={styles.sublabel}>
          Take or upload a photo of the front of the pattern envelope or booklet.
        </Text>
        <TouchableOpacity
          style={styles.photoBox}
          activeOpacity={0.7}
          onPress={() => handlePhoto('cover')}
        >
          {coverPhotoUri ? (
            <Image source={{ uri: coverPhotoUri }} style={styles.photoPreview} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera-outline" size={32} color={COLORS.SOFT_LAVENDER} />
              <Text style={styles.photoPlaceholderText}>Tap to add cover photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Supplies Photo */}
        <Text style={styles.label}>Supplies & Materials Photo</Text>
        <Text style={styles.sublabel}>
          Take or upload a photo of the supplies list printed inside the pattern.
        </Text>
        <TouchableOpacity
          style={styles.photoBox}
          activeOpacity={0.7}
          onPress={() => handlePhoto('supplies')}
        >
          {suppliesPhotoUri ? (
            <Image source={{ uri: suppliesPhotoUri }} style={styles.photoPreview} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera-outline" size={32} color={COLORS.SOFT_LAVENDER} />
              <Text style={styles.photoPlaceholderText}>Tap to add supplies photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveBtn}
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>
              {isEditing ? 'Save Changes' : 'Save Pattern'}
            </Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LAVENDER_WHITE,
  },
  scroll: {
    padding: 16,
    paddingBottom: 100,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: COLORS.MIDNIGHT,
    marginTop: 14,
    marginBottom: 4,
  },
  sublabel: {
    fontSize: 11,
    color: COLORS.SOFT_LAVENDER,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.MIDNIGHT,
    fontFamily: 'Inter_500Medium',
  },
  inputMulti: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  typeBtnActive: {
    backgroundColor: COLORS.DEEP_PLUM,
    borderColor: COLORS.DEEP_PLUM,
  },
  typeBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: COLORS.SOFT_LAVENDER,
  },
  typeBtnTextActive: {
    color: '#fff',
  },
  photoBox: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.SOFT_LAVENDER,
    borderStyle: 'dashed',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  photoPlaceholder: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  photoPlaceholderText: {
    fontSize: 13,
    color: COLORS.SOFT_LAVENDER,
    fontFamily: 'Inter_500Medium',
  },
  saveBtn: {
    backgroundColor: COLORS.DEEP_PLUM,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
});
