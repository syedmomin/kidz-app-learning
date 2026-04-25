// src/screens/MiniGamesScreen.tsx — All Games hub
import React from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';
import type { ScreenProps, RootStackParamList } from '../navigation/types';

const { width: SW } = Dimensions.get('window');
const CARD_W = (SW - 48) / 2;

// ─── Game catalogue ───────────────────────────────────────────────────────────

type GameCard = {
  id: string;
  name: string;
  desc: string;
  emoji: string;
  bg: string;
  dark: string;
  route?: keyof RootStackParamList;
  soon?: boolean;
};

const CATEGORIES: { title: string; emoji: string; games: GameCard[] }[] = [
  {
    title: 'Math & Numbers',
    emoji: '🔢',
    games: [
      {
        id: 'mathquiz', name: 'Math Quiz',    desc: 'Add, subtract\n& multiply!',
        emoji: '➕', bg: '#EBD9FF', dark: C.purple, route: 'NumberQuiz',
      },
      {
        id: 'numbers',  name: 'Count It!',   desc: 'Tap & count\nthe apples',
        emoji: '🍎', bg: '#FFF0C2', dark: C.yellow, route: 'Numbers',
      },
    ],
  },
  {
    title: 'Words & Letters',
    emoji: '📝',
    games: [
      {
        id: 'wordmatch', name: 'Word Match',  desc: 'Match the picture\nto the word',
        emoji: '🔤', bg: '#E8DCFF', dark: C.purple, route: 'WordMatch',
      },
      {
        id: 'alphabets', name: 'Alphabets',   desc: 'Learn A to Z\nwith fun!',
        emoji: '🔡', bg: '#D9F0FF', dark: C.blue, route: 'Category',
      },
    ],
  },
  {
    title: 'Colors & Art',
    emoji: '🎨',
    games: [
      {
        id: 'coloring',  name: 'Color Match', desc: 'Paint & color\namazing art',
        emoji: '🖌️', bg: '#D9FFE8', dark: C.mint, route: 'ColorMatch',
      },
      {
        id: 'paint',     name: 'Free Paint',  desc: 'Draw anything\nyou imagine!',
        emoji: '🎨', bg: '#FFE0E0', dark: C.coral, soon: true,
      },
    ],
  },
  {
    title: 'Fun & Adventure',
    emoji: '🎮',
    games: [
      {
        id: 'memory',  name: 'Memory Flip',  desc: 'Find the matching\npairs of cards',
        emoji: '🃏', bg: '#FFF0C2', dark: C.yellowDeep, soon: true,
      },
      {
        id: 'animals', name: 'Animals',      desc: 'Learn animals\n& their sounds',
        emoji: '🦁', bg: '#E8F5E9', dark: C.mintDeep, route: 'Animals',
      },
      {
        id: 'stories', name: 'Stories',      desc: 'Read fun\nstories!',
        emoji: '📖', bg: '#DDEEFF', dark: C.blueDeep, route: 'Story',
      },
      {
        id: 'music',   name: 'Music',        desc: 'Sing songs &\nlearn poems',
        emoji: '🎵', bg: '#FFF9C4', dark: C.yellowDeep, route: 'Music',
      },
    ],
  },
];

// ─── Card ─────────────────────────────────────────────────────────────────────

function GameTile({ g, onPress }: { g: GameCard; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={g.soon}
      style={({ pressed }) => [
        tile.card,
        { backgroundColor: g.bg, width: CARD_W, opacity: g.soon ? 0.6 : pressed ? 0.82 : 1, transform: [{ scale: pressed && !g.soon ? 0.95 : 1 }] },
      ]}
    >
      {/* top accent bar */}
      <View style={[tile.bar, { backgroundColor: g.dark }]}/>

      <View style={tile.body}>
        <View style={[tile.iconWrap, { borderColor: g.dark }]}>
          <Text style={tile.icon}>{g.emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={tile.name}>{g.name}</Text>
          <Text style={tile.desc}>{g.desc}</Text>
        </View>
      </View>

      {g.soon && (
        <View style={[tile.soonBadge, { backgroundColor: g.dark }]}>
          <Text style={tile.soonT}>Soon</Text>
        </View>
      )}
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function MiniGamesScreen({ navigation }: ScreenProps<'Games'>) {
  const { p } = useProgress();

  const go = (g: GameCard) => {
    if (!g.route || g.soon) return;
    navigation.navigate(g.route as never);
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}>
          <Text style={s.backT}>←</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>All Games 🎮</Text>
          <Text style={s.sub}>Pick a game and start learning!</Text>
        </View>
        <View style={s.starPill}>
          <Text style={s.starT}>⭐ {p.stars}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {CATEGORIES.map(cat => (
          <View key={cat.title} style={s.section}>
            {/* Section title */}
            <View style={s.sectionHeader}>
              <Text style={s.sectionEmoji}>{cat.emoji}</Text>
              <Text style={s.sectionTitle}>{cat.title}</Text>
            </View>

            {/* Game tiles */}
            <View style={s.row}>
              {cat.games.map(g => (
                <GameTile key={g.id} g={g} onPress={() => go(g)}/>
              ))}
            </View>
          </View>
        ))}

        <View style={{ height: 24 }}/>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const tile = StyleSheet.create({
  card: {
    borderRadius: 20, borderWidth: 3.5, borderColor: C.ink, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10, shadowRadius: 6, elevation: 4,
  },
  bar:      { height: 6 },
  body:     { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  iconWrap: { width: 50, height: 50, borderRadius: 14, backgroundColor: '#fff', borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  icon:     { fontSize: 26 },
  name:     { fontWeight: '900', fontSize: 14, color: C.ink },
  desc:     { fontWeight: '600', fontSize: 11, color: C.inkSoft, marginTop: 2 },
  soonBadge:{ position: 'absolute', top: 8, right: 8, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
  soonT:    { fontSize: 10, fontWeight: '900', color: '#fff' },
});

const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: '#F4F0FF' },
  header:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  back:          { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  backT:         { fontSize: 20, fontWeight: '900', color: C.ink },
  title:         { fontWeight: '900', fontSize: 22, color: C.ink },
  sub:           { fontWeight: '600', fontSize: 12, color: C.inkSoft, marginTop: 1 },
  starPill:      { backgroundColor: C.yellow, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 3, borderColor: C.ink },
  starT:         { fontWeight: '900', fontSize: 14, color: C.ink },
  scroll:        { paddingHorizontal: 16, paddingTop: 4 },
  section:       { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionEmoji:  { fontSize: 20 },
  sectionTitle:  { fontWeight: '900', fontSize: 17, color: C.ink },
  row:           { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
});
