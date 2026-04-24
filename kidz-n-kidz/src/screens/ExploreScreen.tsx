import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star } from '../components/Icons';
import { C } from '../theme';
import type { ScreenProps, RootStackParamList } from '../navigation/types';
import { useProgress } from '../store/ProgressStore';

// PNG Assets cropped from the provided screenshot
const imgAlphabets = require('../../assets/images/card_alphabets.png');
const imgAnimals   = require('../../assets/images/card_animals.png');
const imgMusic     = require('../../assets/images/card_music.png');
const imgStories   = require('../../assets/images/card_stories.png');
const imgColoring  = require('../../assets/images/card_coloring.png');
const imgNumbers   = require('../../assets/images/card_numbers.png');

type CardSpec = {
  label: string;
  route: keyof RootStackParamList;
  badge?: string;
  accent: string;
  image: any;
};

const CARDS: CardSpec[] = [
  { label: 'Alphabets', route: 'Category',   accent: '#E3F2FD', image: imgAlphabets },
  { label: 'Animals',   route: 'Animals',    accent: '#E8F5E9', image: imgAnimals, badge: 'NEW' },
  { label: 'Music',     route: 'ColorMatch', accent: '#FFF9C4', image: imgMusic    },
  { label: 'Stories',   route: 'Story',      accent: '#DDEEFF', image: imgStories  },
  { label: 'Coloring',  route: 'Games',      accent: '#E0F7FA', image: imgColoring },
  { label: 'Numbers',   route: 'Numbers',    accent: '#FFFDE7', image: imgNumbers  },
];

// ── Card component ────────────────────────────────────────────────────────────

function Card({ spec, onPress }: { spec: CardSpec; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.card, { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }]}
    >
      <View style={s.illusBox}>
        <Image source={spec.image} style={s.illus} />
      </View>
      <View style={[s.cardFooter, { backgroundColor: spec.accent }]}>
        <Text style={s.cardLabel}>{spec.label}</Text>
      </View>
      {spec.badge && (
        <View style={s.badge}>
          <Text style={s.badgeText}>{spec.badge}</Text>
        </View>
      )}
    </Pressable>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function ExploreScreen({ navigation }: ScreenProps<'Explore'>) {
  const { p, touchStreak } = useProgress();
  useEffect(() => { touchStreak(); }, []);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <View>
          <Text style={s.appName}>KidzNKidz ✨</Text>
          <Text style={s.greeting}>What do you want to learn today?</Text>
        </View>
        <View style={s.headerRight}>
          <Pressable style={s.chip} onPress={() => navigation.navigate('Streak')}>
            <Star size={16} /><Text style={s.chipText}>{p.stars}</Text>
          </Pressable>
          <Pressable style={[s.chip, { backgroundColor: '#FFD6F0' }]} onPress={() => navigation.navigate('Settings')}>
            <Text style={{ fontSize: 15 }}>⚙️</Text>
          </Pressable>
        </View>
      </View>



      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.grid}>
          {CARDS.map((c) => (
            <Card key={c.label} spec={c} onPress={() => navigation.navigate(c.route as never)} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F8FF' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingTop: 8, paddingBottom: 10,
  },
  appName: { fontSize: 22, fontWeight: '900', color: C.ink },
  greeting: { fontSize: 12, fontWeight: '600', color: '#888', marginTop: 2 },
  headerRight: { flexDirection: 'row', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FFE566', borderRadius: 999,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 2.5, borderColor: C.ink,
  },
  chipText: { fontWeight: '900', fontSize: 14, color: C.ink },

  scroll: { paddingHorizontal: 12, paddingBottom: 30 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 14 },
  card: {
    width: '47.5%', borderRadius: 22, overflow: 'hidden', backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10, shadowRadius: 12, elevation: 6,
  },
  illusBox: { width: '100%', height: 130, overflow: 'hidden', backgroundColor: '#f0f4ff' },
  illus: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardFooter: { paddingHorizontal: 12, paddingVertical: 12, alignItems: 'center' },
  cardLabel: { fontWeight: '800', fontSize: 15, color: C.ink },
  badge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: '#FF6B6B', borderRadius: 999,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  badgeText: { color: '#fff', fontWeight: '800', fontSize: 10 },
});
