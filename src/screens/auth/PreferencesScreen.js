import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import COLORS from '../../styles/colors';

const PREF_OPTIONS = [
  {
    key: 'quilt_projects',
    label: 'Track Quilt Projects',
    icon: 'sparkles-outline',
  },
  {
    key: 'bag_projects',
    label: 'Track Bag Projects',
    icon: 'bag-handle-outline',
  },
  {
    key: 'manage_stash',
    label: 'Manage My Stash',
    icon: 'layers-outline',
  },
  {
    key: 'get_inspired',
    label: 'Get Inspired',
    icon: 'bulb-outline',
  },
];

export default function PreferencesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { savePreferences, displayName } = useAuth();
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggle = (key) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleContinue = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    try {
      await savePreferences(selected);
      navigation.replace('Success');
    } catch {
      Alert.alert('Error', 'Could not save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[s.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
      <View style={s.content}>
        <View style={s.header}>
          <Text style={s.title}>What are you most excited{'\n'}to use Nimble Needle for?</Text>
          <Text style={s.subtitle}>
            Select all that apply, {displayName || 'friend'}!
          </Text>
        </View>

        <View style={s.grid}>
          {PREF_OPTIONS.map((opt) => {
            const isSelected = selected.includes(opt.key);
            return (
              <TouchableOpacity
                key={opt.key}
                style={[s.optionCard, isSelected && s.optionCardSelected]}
                onPress={() => toggle(opt.key)}
                activeOpacity={0.85}
              >
                <View style={s.iconBadge}>
                  <Ionicons name={opt.icon} size={34} color={COLORS.DEEP_PLUM} />
                </View>
                <Text style={s.optionLabel}>{opt.label}</Text>
                <View style={[s.checkbox, isSelected && s.checkboxSelected]}>
                  {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity
        style={[s.continueBtn, selected.length === 0 && s.continueBtnDisabled]}
        onPress={handleContinue}
        disabled={loading || selected.length === 0}
        activeOpacity={0.9}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={s.continueBtnText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: COLORS.LAVENDER_WHITE,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  content: { flex: 1 },
  header: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },

  title: {
    fontSize: 25, fontFamily: 'PlayfairDisplay_900Black',
    color: COLORS.MIDNIGHT, letterSpacing: -0.5,
    lineHeight: 33, marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15, fontFamily: 'Inter_400Regular',
    color: 'rgba(45,27,78,0.6)', lineHeight: 22,
    textAlign: 'center',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  optionCard: {
    width: '48%',
    minHeight: 136,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5DCEF',
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
    alignItems: 'center',
  },
  optionCardSelected: {
    borderColor: COLORS.DEEP_PLUM,
    backgroundColor: 'rgba(91,45,142,0.04)',
  },
  iconBadge: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: 'rgba(192,132,252,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  optionLabel: {
    fontSize: 14, fontFamily: 'Inter_700Bold',
    color: COLORS.MIDNIGHT,
    textAlign: 'center',
    lineHeight: 19,
  },
  checkbox: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24, height: 24, borderRadius: 7,
    borderWidth: 1, borderColor: 'rgba(192,132,252,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.DEEP_PLUM,
    borderColor: COLORS.DEEP_PLUM,
  },

  continueBtn: {
    backgroundColor: COLORS.DEEP_PLUM,
    borderRadius: 14, paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#5B2D8E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 4,
  },
  continueBtnDisabled: { opacity: 0.5 },
  continueBtnText: {
    fontSize: 17, fontFamily: 'Inter_700Bold', color: '#fff',
  },
});
