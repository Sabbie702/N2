import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import COLORS from '../../styles/colors';

const PREF_OPTIONS = [
  {
    key: 'quilt_projects',
    label: 'Track Quilt Projects',
    subtitle: 'Organize patterns, fabrics & progress',
    icon: require('../../../assets/images/new_project_icon.png'),
  },
  {
    key: 'bag_projects',
    label: 'Track Bag Projects',
    subtitle: 'Plan and manage bag creations',
    icon: require('../../../assets/images/bag_projects_icon.png'),
  },
  {
    key: 'manage_stash',
    label: 'Manage My Stash',
    subtitle: 'Catalog your fabric collection',
    icon: require('../../../assets/images/stash_icon.png'),
  },
  {
    key: 'get_inspired',
    label: 'Get Inspired',
    subtitle: 'Discover patterns & color palettes',
    icon: require('../../../assets/images/discover_icon.png'),
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
        <Text style={s.title}>What are you most excited{'\n'}to use Nimble Needle for?</Text>
        <Text style={s.subtitle}>
          Select all that apply, {displayName || 'friend'}! This helps us personalize your experience.
        </Text>

        <View style={s.optionsWrap}>
          {PREF_OPTIONS.map((opt) => {
            const isSelected = selected.includes(opt.key);
            return (
              <TouchableOpacity
                key={opt.key}
                style={[s.optionCard, isSelected && s.optionCardSelected]}
                onPress={() => toggle(opt.key)}
                activeOpacity={0.85}
              >
                <Image source={opt.icon} style={s.optionIcon} resizeMode="contain" />
                <View style={s.optionText}>
                  <Text style={s.optionLabel}>{opt.label}</Text>
                  <Text style={s.optionSub}>{opt.subtitle}</Text>
                </View>
                <View style={[s.checkbox, isSelected && s.checkboxSelected]}>
                  {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
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

  title: {
    fontSize: 26, fontFamily: 'PlayfairDisplay_900Black',
    color: COLORS.MIDNIGHT, letterSpacing: -0.5,
    lineHeight: 34, marginBottom: 10, marginTop: 20,
  },
  subtitle: {
    fontSize: 15, fontFamily: 'Inter_400Regular',
    color: 'rgba(45,27,78,0.6)', lineHeight: 22, marginBottom: 28,
  },

  optionsWrap: { gap: 12 },
  optionCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20, padding: 16,
    borderWidth: 2, borderColor: 'transparent',
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 12, elevation: 2,
  },
  optionCardSelected: {
    borderColor: COLORS.DEEP_PLUM,
    backgroundColor: 'rgba(91,45,142,0.04)',
  },
  optionIcon: { width: 44, height: 44, marginRight: 14 },
  optionText: { flex: 1 },
  optionLabel: {
    fontSize: 15, fontFamily: 'Inter_700Bold',
    color: COLORS.MIDNIGHT, marginBottom: 2,
  },
  optionSub: {
    fontSize: 12, fontFamily: 'Inter_400Regular',
    color: 'rgba(45,27,78,0.5)', lineHeight: 16,
  },
  checkbox: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 2, borderColor: 'rgba(192,132,252,0.35)',
    alignItems: 'center', justifyContent: 'center', marginLeft: 10,
  },
  checkboxSelected: {
    backgroundColor: COLORS.DEEP_PLUM,
    borderColor: COLORS.DEEP_PLUM,
  },

  continueBtn: {
    backgroundColor: COLORS.DEEP_PLUM,
    borderRadius: 28, paddingVertical: 16,
    alignItems: 'center',
  },
  continueBtnDisabled: { opacity: 0.5 },
  continueBtnText: {
    fontSize: 17, fontFamily: 'Inter_700Bold', color: '#fff',
  },
});
