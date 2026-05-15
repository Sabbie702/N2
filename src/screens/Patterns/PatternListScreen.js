import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  Image, StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { loadPatterns, deletePattern } from '../../storage/patternStorage';
import COLORS from '../../styles/colors';

export default function PatternListScreen({ navigation }) {
  const [patterns, setPatterns] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadPatterns().then(setPatterns);
    }, [])
  );

  function handleDelete(patternId, patternName) {
    Alert.alert(
      'Delete Pattern',
      `Are you sure you want to delete "${patternName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deletePattern(patternId);
            loadPatterns().then(setPatterns);
          },
        },
      ]
    );
  }

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate('PatternDetails', { pattern: item, mode: 'edit' })
        }
      >
        {item.coverPhotoUri ? (
          <Image source={{ uri: item.coverPhotoUri }} style={styles.thumb} />
        ) : (
          <View style={styles.thumbPlaceholder}>
            <Ionicons name="image-outline" size={28} color={COLORS.SOFT_LAVENDER} />
          </View>
        )}

        <View style={styles.cardInfo}>
          <Text style={styles.cardName} numberOfLines={1}>
            {item.patternName || 'Untitled Pattern'}
          </Text>
          {!!item.brand && (
            <Text style={styles.cardBrand} numberOfLines={1}>{item.brand}</Text>
          )}
          {!!item.patternNumber && (
            <Text style={styles.cardNumber}>#{item.patternNumber}</Text>
          )}
          {!!item.patternType && (
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{item.patternType}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.deleteBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => handleDelete(item.id, item.patternName)}
        >
          <Ionicons name="trash-outline" size={18} color="#D63B6E" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {patterns.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="book-outline" size={56} color={COLORS.SOFT_LAVENDER} />
          <Text style={styles.emptyTitle}>No patterns yet</Text>
          <Text style={styles.emptyText}>
            Tap the + button to add your first pattern.
          </Text>
        </View>
      ) : (
        <FlatList
          data={patterns}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
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
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  thumb: {
    width: 80,
    height: 80,
  },
  thumbPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.LAVENDER_WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: COLORS.MIDNIGHT,
  },
  cardBrand: {
    fontSize: 12,
    color: COLORS.SOFT_LAVENDER,
    marginTop: 2,
  },
  cardNumber: {
    fontSize: 12,
    color: COLORS.SOFT_LAVENDER,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.DEEP_PLUM + '1A',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 4,
  },
  typeBadgeText: {
    fontSize: 11,
    color: COLORS.DEEP_PLUM,
    fontFamily: 'Inter_500Medium',
  },
  deleteBtn: {
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay-SemiBold',
    color: COLORS.MIDNIGHT,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.SOFT_LAVENDER,
    textAlign: 'center',
    lineHeight: 22,
  },
});
