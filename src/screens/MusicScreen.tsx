import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView,
  Animated, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { C } from '../theme';
import type { ScreenProps } from '../navigation/types';

const { width: SW } = Dimensions.get('window');

// ─── Data ─────────────────────────────────────────────────────────────────────

type Track = {
  id: string;
  title: string;
  type: 'song' | 'poem';
  emoji: string;
  color: string;
  dark: string;
  lyrics: string[];
  file: any;
};

const TRACKS: Track[] = [
  {
    id: '1', title: 'Twinkle Twinkle', type: 'poem', emoji: '⭐',
    color: '#FFF176', dark: '#F9A825',
    lyrics: [
      'Twinkle, twinkle, little star,',
      'How I wonder what you are!',
      'Up above the world so high,',
      'Like a diamond in the sky.',
      'Twinkle, twinkle, little star,',
      'How I wonder what you are!',
    ],
    file: require('../../assets/music/twinkle_tts.mp3'),
  },
  {
    id: '2', title: 'ABC Song', type: 'poem', emoji: '🔤',
    color: '#B3E5FC', dark: '#0288D1',
    lyrics: [
      'A B C D E F G,',
      'H I J K L M N O P,',
      'Q R S T U V,',
      'W X Y and Z!',
      'Now I know my ABCs,',
      'Next time won\'t you sing with me?',
    ],
    file: require('../../assets/music/abc_tts.mp3'),
  },
  {
    id: '3', title: 'Wheels on the Bus', type: 'poem', emoji: '🚌',
    color: '#C8E6C9', dark: '#388E3C',
    lyrics: [
      'The wheels on the bus go round and round,',
      'Round and round, round and round,',
      'The wheels on the bus go round and round,',
      'All through the town!',
    ],
    file: require('../../assets/music/wheels_tts.mp3'),
  },
  {
    id: '4', title: 'Baa Baa Black Sheep', type: 'poem', emoji: '🐑',
    color: '#F3E5F5', dark: '#7B1FA2',
    lyrics: [
      'Baa, baa, black sheep,',
      'Have you any wool?',
      'Yes sir, yes sir,',
      'Three bags full!',
      'One for the master,',
      'One for the dame,',
      'One for the little boy',
      'Who lives down the lane.',
    ],
    file: require('../../assets/music/baa_tts.mp3'),
  },
  {
    id: '5', title: 'Humpty Dumpty', type: 'poem', emoji: '🥚',
    color: '#FFE0B2', dark: '#E65100',
    lyrics: [
      'Humpty Dumpty sat on a wall,',
      'Humpty Dumpty had a great fall.',
      'All the king\'s horses',
      'And all the king\'s men,',
      'Couldn\'t put Humpty',
      'Together again!',
    ],
    file: require('../../assets/music/humpty_tts.mp3'),
  },
  {
    id: '6', title: 'Row Your Boat', type: 'poem', emoji: '🚣',
    color: '#B2EBF2', dark: '#00838F',
    lyrics: [
      'Row, row, row your boat,',
      'Gently down the stream,',
      'Merrily, merrily, merrily, merrily,',
      'Life is but a dream!',
    ],
    file: require('../../assets/music/row_tts.mp3'),
  },
  {
    id: '7', title: 'Old MacDonald', type: 'poem', emoji: '🚜',
    color: '#DCEDC8', dark: '#558B2F',
    lyrics: [
      'Old MacDonald had a farm,',
      'E-I-E-I-O!',
      'And on his farm he had a cow,',
      'E-I-E-I-O!',
      'With a moo moo here,',
      'And a moo moo there,',
      'Here a moo, there a moo,',
      'Everywhere a moo moo!',
    ],
    file: require('../../assets/music/old_mcdonald_tts.mp3'),
  },
  {
    id: '8', title: 'Itsy Bitsy Spider', type: 'poem', emoji: '🕷️',
    color: '#FCE4EC', dark: '#C2185B',
    lyrics: [
      'The itsy bitsy spider',
      'Climbed up the water spout,',
      'Down came the rain',
      'And washed the spider out.',
      'Out came the sun',
      'And dried up all the rain,',
      'And the itsy bitsy spider',
      'Climbed up the spout again!',
    ],
    file: require('../../assets/music/itsy_tts.mp3'),
  },
  {
    id: '9', title: 'Happy Tune', type: 'song', emoji: '😊',
    color: '#FFF9C4', dark: '#F57F17',
    lyrics: ['🎵 A fun happy melody 🎵', 'Perfect for dancing and singing!', '🎶 La la la la la 🎶'],
    file: require('../../assets/music/happy.mp3'),
  },
  {
    id: '10', title: 'Circus Fun', type: 'song', emoji: '🎪',
    color: '#FFCCBC', dark: '#BF360C',
    lyrics: ['🎠 Welcome to the circus! 🎠', 'Clowns, acrobats and fun!', '🎡 Round and round we go 🎡'],
    file: require('../../assets/music/circus.mp3'),
  },
  {
    id: '11', title: 'Silly Monkeys', type: 'song', emoji: '🐒',
    color: '#FFE082', dark: '#FF6F00',
    lyrics: ['🐵 Monkeys jumping around 🐵', 'Swinging from tree to tree!', '🍌 Yummy bananas for all 🍌'],
    file: require('../../assets/music/monkeys.mp3'),
  },
  {
    id: '12', title: 'Adventure Time', type: 'song', emoji: '🗺️',
    color: '#B3E5FC', dark: '#01579B',
    lyrics: ['🌟 Let\'s go on an adventure! 🌟', 'Through jungles and over mountains,', '🦋 What will we discover? 🦋'],
    file: require('../../assets/music/adventure.mp3'),
  },
];

// ─── Floating Notes Animation ─────────────────────────────────────────────────

function FloatingNote({ color }: { color: string }) {
  const y = useRef(new Animated.Value(0)).current;
  const x = useRef(new Animated.Value(Math.random() * SW)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const notes = ['🎵', '🎶', '♪', '♫', '🎼'];
  const note = notes[Math.floor(Math.random() * notes.length)];

  useEffect(() => {
    const loop = () => {
      y.setValue(0);
      opacity.setValue(0);
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.parallel([
          Animated.timing(y, { toValue: -200, duration: 2500, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 2500, useNativeDriver: true }),
        ]),
      ]).start(loop);
    };
    const timer = setTimeout(loop, Math.random() * 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.Text
      style={{
        position: 'absolute',
        bottom: 60,
        left: (Math.random() * (SW - 40)),
        fontSize: 22,
        opacity,
        transform: [{ translateY: y }],
        pointerEvents: 'none',
      } as any}
    >
      {note}
    </Animated.Text>
  );
}

// ─── Mini waveform bars (playing indicator) ───────────────────────────────────

function WaveBars({ color }: { color: string }) {
  const bars = [useRef(new Animated.Value(0.3)).current,
                useRef(new Animated.Value(0.3)).current,
                useRef(new Animated.Value(0.3)).current,
                useRef(new Animated.Value(0.3)).current];

  useEffect(() => {
    bars.forEach((b, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 120),
          Animated.timing(b, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(b, { toValue: 0.2, duration: 300, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 20 }}>
      {bars.map((b, i) => (
        <Animated.View
          key={i}
          style={{
            width: 4, height: 16, borderRadius: 2,
            backgroundColor: color,
            transform: [{ scaleY: b }],
          }}
        />
      ))}
    </View>
  );
}

// ─── Player Modal ─────────────────────────────────────────────────────────────

function PlayerCard({
  track, isPlaying, onPlayPause, onClose,
}: {
  track: Track; isPlaying: boolean; onPlayPause: () => void; onClose: () => void;
}) {
  const slideY = useRef(new Animated.Value(300)).current;
  const emojiSpin = useRef(new Animated.Value(0)).current;
  const spinLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    Animated.spring(slideY, { toValue: 0, useNativeDriver: true, speed: 14, bounciness: 10 }).start();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      spinLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(emojiSpin, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(emojiSpin, { toValue: 0, duration: 800, useNativeDriver: true }),
        ])
      );
      spinLoop.current.start();
    } else {
      spinLoop.current?.stop();
      emojiSpin.setValue(0);
    }
  }, [isPlaying]);

  const emojiScale = emojiSpin.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.2, 1] });

  return (
    <Animated.View style={[pl.card, { backgroundColor: track.color, transform: [{ translateY: slideY }] }]}>
      {/* Header */}
      <View style={pl.header}>
        <View style={[pl.typeBadge, { backgroundColor: track.dark }]}>
          <Text style={pl.typeText}>{track.type === 'poem' ? '📖 Poem' : '🎵 Song'}</Text>
        </View>
        <Pressable onPress={onClose} style={pl.closeBtn}>
          <Text style={pl.closeText}>✕</Text>
        </Pressable>
      </View>

      {/* Big emoji */}
      <Animated.Text style={[pl.bigEmoji, { transform: [{ scale: emojiScale }] }]}>
        {track.emoji}
      </Animated.Text>

      <Text style={[pl.trackTitle, { color: track.dark }]}>{track.title}</Text>

      {/* Lyrics scroll */}
      <ScrollView style={pl.lyricsBox} showsVerticalScrollIndicator={false}>
        {track.lyrics.map((line, i) => (
          <Text key={i} style={pl.lyricLine}>{line}</Text>
        ))}
      </ScrollView>

      {/* Controls */}
      <View style={pl.controls}>
        <Pressable
          onPress={onPlayPause}
          style={[pl.playBtn, { backgroundColor: track.dark }]}
        >
          <Text style={pl.playBtnText}>{isPlaying ? '⏸' : '▶'}</Text>
        </Pressable>
        {isPlaying && <WaveBars color={track.dark} />}
      </View>
    </Animated.View>
  );
}

const pl = StyleSheet.create({
  card: {
    borderRadius: 32, padding: 20, marginHorizontal: 16, marginBottom: 12,
    elevation: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.18, shadowRadius: 14,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  typeBadge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  typeText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.12)', alignItems: 'center', justifyContent: 'center',
  },
  closeText: { fontSize: 14, fontWeight: '900', color: '#fff' },
  bigEmoji: { fontSize: 70, textAlign: 'center', marginVertical: 8 },
  trackTitle: { fontSize: 22, fontWeight: '900', textAlign: 'center', marginBottom: 14 },
  lyricsBox: { maxHeight: 160, backgroundColor: 'rgba(255,255,255,0.55)', borderRadius: 16, padding: 14, marginBottom: 16 },
  lyricLine: { fontSize: 15, fontWeight: '700', color: C.ink, lineHeight: 26, textAlign: 'center' },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18 },
  playBtn: {
    width: 64, height: 64, borderRadius: 32,
    alignItems: 'center', justifyContent: 'center',
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6,
  },
  playBtnText: { fontSize: 28 },
});

// ─── Track Card (list item) ───────────────────────────────────────────────────

function TrackCard({ track, isPlaying, onPress }: { track: Track; isPlaying: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, speed: 60 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable onPress={handlePress} style={[tc.card, { backgroundColor: track.color }, isPlaying && { borderColor: track.dark, borderWidth: 3 }]}>
        <View style={[tc.emojiBox, { backgroundColor: track.dark }]}>
          <Text style={tc.emoji}>{track.emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={tc.title}>{track.title}</Text>
          <View style={[tc.badge, { backgroundColor: track.dark + '33' }]}>
            <Text style={[tc.badgeText, { color: track.dark }]}>
              {track.type === 'poem' ? '📖 Poem' : '🎵 Song'} • {track.lyrics.length} lines
            </Text>
          </View>
        </View>
        <View style={tc.right}>
          {isPlaying
            ? <WaveBars color={track.dark} />
            : <View style={[tc.playCircle, { backgroundColor: track.dark }]}>
                <Text style={tc.playIcon}>▶</Text>
              </View>
          }
        </View>
      </Pressable>
    </Animated.View>
  );
}

const tc = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginHorizontal: 16, marginBottom: 12,
    borderRadius: 22, padding: 14, borderWidth: 2, borderColor: 'transparent',
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6,
  },
  emojiBox: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 26 },
  title: { fontSize: 16, fontWeight: '900', color: C.ink, marginBottom: 4 },
  badge: { alignSelf: 'flex-start', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  right: { width: 44, alignItems: 'center', justifyContent: 'center' },
  playCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  playIcon: { fontSize: 14, color: '#fff' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function MusicScreen({ navigation }: ScreenProps<'Music'>) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filter, setFilter] = useState<'all' | 'poem' | 'song'>('all');
  const soundRef = useRef<Audio.Sound | null>(null);
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(headerAnim, { toValue: 1, useNativeDriver: true, speed: 8, bounciness: 10 }).start();
    return () => { soundRef.current?.unloadAsync(); };
  }, []);

  const loadAndPlay = async (track: Track) => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setActiveId(track.id);
      setIsPlaying(true);
      const { sound } = await Audio.Sound.createAsync(track.file, { shouldPlay: true });
      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (e) {
      console.log('Audio error', e);
      setIsPlaying(false);
    }
  };

  const togglePlayPause = async () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const handleCardPress = (track: Track) => {
    if (activeId === track.id) {
      togglePlayPause();
    } else {
      loadAndPlay(track);
    }
  };

  const closePlayer = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setActiveId(null);
    setIsPlaying(false);
  };

  const activeTrack = TRACKS.find((t) => t.id === activeId);
  const filtered = filter === 'all' ? TRACKS : TRACKS.filter((t) => t.type === filter);

  const headerTranslate = headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-50, 0] });

  return (
    <SafeAreaView style={s.root}>
      {/* bg blobs */}
      <View style={s.blob1} />
      <View style={s.blob2} />
      <View style={s.blob3} />

      {/* Floating notes when playing */}
      {isPlaying && [1, 2, 3, 4].map((k) => (
        <FloatingNote key={k} color={activeTrack?.dark ?? C.purple} />
      ))}

      {/* Header */}
      <Animated.View style={[s.header, { opacity: headerAnim, transform: [{ translateY: headerTranslate }] }]}>
        <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backIcon}>←</Text>
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={s.title}>🎵 Music & Poems</Text>
          <Text style={s.subtitle}>{TRACKS.length} songs & rhymes!</Text>
        </View>
        <View style={{ width: 44 }} />
      </Animated.View>

      {/* Filter tabs */}
      <View style={s.filterRow}>
        {(['all', 'poem', 'song'] as const).map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={[s.filterBtn, filter === f && s.filterActive]}
          >
            <Text style={[s.filterText, filter === f && s.filterTextActive]}>
              {f === 'all' ? '🎼 All' : f === 'poem' ? '📖 Poems' : '🎵 Songs'}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Active player card */}
        {activeTrack && (
          <PlayerCard
            track={activeTrack}
            isPlaying={isPlaying}
            onPlayPause={togglePlayPause}
            onClose={closePlayer}
          />
        )}

        {/* Track list */}
        <Text style={s.sectionLabel}>
          {filter === 'all' ? 'All Tracks' : filter === 'poem' ? '📖 Nursery Rhymes' : '🎵 Fun Songs'}
        </Text>
        {filtered.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            isPlaying={activeId === track.id && isPlaying}
            onPress={() => handleCardPress(track)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F0FF' },
  blob1: { position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: '#CE93D822' },
  blob2: { position: 'absolute', top: 140, left: -60, width: 180, height: 180, borderRadius: 90, backgroundColor: '#80DEEA22' },
  blob3: { position: 'absolute', bottom: 100, right: -50, width: 150, height: 150, borderRadius: 75, backgroundColor: '#FFCC8022' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, marginBottom: 6,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4,
  },
  backIcon: { fontSize: 22, color: C.ink, fontWeight: '700' },
  title: { fontSize: 24, fontWeight: '900', color: C.ink },
  subtitle: { fontSize: 12, color: C.inkSoft, marginTop: 1, fontWeight: '600' },
  filterRow: {
    flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 14,
  },
  filterBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 16,
    backgroundColor: '#E8E0FF', alignItems: 'center',
  },
  filterActive: {
    backgroundColor: C.purple,
    elevation: 3, shadowColor: C.purple, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4,
  },
  filterText: { fontSize: 13, fontWeight: '700', color: C.inkSoft },
  filterTextActive: { color: '#fff' },
  sectionLabel: {
    fontSize: 16, fontWeight: '900', color: C.ink,
    paddingHorizontal: 20, marginBottom: 10, marginTop: 4,
  },
});
