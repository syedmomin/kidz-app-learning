import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView,
  Animated, Dimensions, Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { C } from '../theme';
import type { ScreenProps } from '../navigation/types';

const { width: SW, height: SH } = Dimensions.get('window');

import { MUSIC_TRACKS, type MusicTrack } from '../data/GameAssets';

type Track = MusicTrack;
const TRACKS = MUSIC_TRACKS;

// ─── Floating Notes & Bubbles ───────────────────────────────────────────────────

function FloatingNote() {
  const y = useRef(new Animated.Value(0)).current;
  const x = useRef(new Animated.Value(Math.random() * (SW - 40))).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const notes = ['🎵', '🎶', '✨', '🎈', '🍭', '🌈'];
  const char = notes[Math.floor(Math.random() * notes.length)];

  useEffect(() => {
    const loop = () => {
      y.setValue(0);
      opacity.setValue(0);
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.parallel([
          Animated.timing(y, { toValue: -300, duration: 4000, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 4000, useNativeDriver: true }),
        ]),
      ]).start(loop);
    };
    const timer = setTimeout(loop, Math.random() * 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.Text style={[s.floatingChar, { left: x, opacity, transform: [{ translateY: y }] }]}>
      {char}
    </Animated.Text>
  );
}

// ─── Waveform ──────────────────────────────────────────────────────────────────

function Waveform({ color, active }: { color: string; active: boolean }) {
  const anims = [useRef(new Animated.Value(0.3)).current, useRef(new Animated.Value(0.3)).current, 
                 useRef(new Animated.Value(0.3)).current, useRef(new Animated.Value(0.3)).current,
                 useRef(new Animated.Value(0.3)).current];

  useEffect(() => {
    if (active) {
      anims.forEach((a, i) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(i * 100),
            Animated.timing(a, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(a, { toValue: 0.3, duration: 400, useNativeDriver: true }),
          ])
        ).start();
      });
    } else {
      anims.forEach(a => a.stopAnimation());
    }
  }, [active]);

  return (
    <View style={s.waveWrap}>
      {anims.map((a, i) => (
        <Animated.View key={i} style={[s.waveBar, { backgroundColor: color, transform: [{ scaleY: a }] }]} />
      ))}
    </View>
  );
}

// ─── Player Component ──────────────────────────────────────────────────────────

function PremiumPlayer({ track, isPlaying, onToggle, onClose, useGirlVoice }: { 
  track: Track; isPlaying: boolean; onToggle: () => void; onClose: () => void; useGirlVoice: boolean;
}) {
  const rotate = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    Animated.spring(slideY, { toValue: 0, damping: 15, stiffness: 60, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.timing(rotate, { toValue: 1, duration: 3000, easing: Easing.linear, useNativeDriver: true })
      ).start();
    } else {
      rotate.stopAnimation();
    }
  }, [isPlaying]);

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={[p.card, { transform: [{ translateY: slideY }] }]}>
      <View style={[p.bg, { backgroundColor: track.color }]} />
      
      <View style={p.header}>
        <View style={[p.badge, { backgroundColor: track.dark }]}>
          <Text style={p.badgeT}>{track.type === 'poem' ? '📖 Rhyme' : '🎵 Song'}</Text>
        </View>
        <Pressable onPress={onClose} style={p.closeBtn}><Text style={p.closeT}>✕</Text></Pressable>
      </View>

      <View style={p.main}>
        <Animated.View style={[p.disk, { borderColor: track.dark, transform: [{ rotate: spin }] }]}>
          <Text style={p.diskEmoji}>{track.emoji}</Text>
          <View style={[p.diskCenter, { backgroundColor: track.dark }]} />
        </Animated.View>
        
        <View style={p.info}>
          <Text style={[p.title, { color: track.dark }]}>{track.title}</Text>
          {useGirlVoice && track.type === 'poem' && (
            <View style={p.girlTag}>
              <Text style={p.girlTagEmoji}>👧</Text>
              <Text style={p.girlTagText}>Girl Voice ON</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={p.lyricsBox} contentContainerStyle={p.lyricsContent}>
        {track.lyrics.map((line, i) => (
          <Text key={i} style={[p.lyricLine, { color: track.dark }]}>{line}</Text>
        ))}
      </ScrollView>

      <View style={p.footer}>
        <Waveform color={track.dark} active={isPlaying} />
        <Pressable onPress={onToggle} style={[p.playBtn, { backgroundColor: track.dark }]}>
          <Text style={p.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
        </Pressable>
        <Waveform color={track.dark} active={isPlaying} />
      </View>
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function MusicScreen({ navigation }: ScreenProps<'Music'>) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filter, setFilter] = useState<'all' | 'poem' | 'song'>('all');
  const [useGirlVoice, setUseGirlVoice] = useState(true);
  
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
      Speech.stop();
    };
  }, []);

  const stopAll = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    Speech.stop();
    setIsPlaying(false);
  };

  const playPoemTTS = (track: Track) => {
    Speech.speak(track.lyrics.join('. '), {
      rate: 0.85,
      pitch: 1.25, // Higher pitch for girl voice
      onDone: () => setIsPlaying(false),
      onStopped: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  const handleTrackPress = async (track: Track) => {
    if (activeId === track.id) {
      if (isPlaying) {
        if (track.type === 'poem' && (!track.file || useGirlVoice)) {
          Speech.stop();
          setIsPlaying(false);
        } else if (soundRef.current) {
          await soundRef.current.pauseAsync();
          setIsPlaying(false);
        }
      } else {
        if (track.type === 'poem' && (!track.file || useGirlVoice)) {
          playPoemTTS(track);
          setIsPlaying(true);
        } else if (soundRef.current) {
          await soundRef.current.playAsync();
          setIsPlaying(true);
        }
      }
      return;
    }

    // New track
    await stopAll();
    setActiveId(track.id);
    setIsPlaying(true);

    if (track.type === 'poem' && (!track.file || useGirlVoice)) {
      playPoemTTS(track);
    } else if (track.file) {
      const { sound } = await Audio.Sound.createAsync(track.file, { shouldPlay: true });
      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((s) => {
        if (s.isLoaded && s.didJustFinish) setIsPlaying(false);
      });
    }
  };

  const activeTrack = TRACKS.find(t => t.id === activeId);
  const filtered = filter === 'all' ? TRACKS : TRACKS.filter(t => t.type === filter);

  return (
    <SafeAreaView style={s.root}>
      {/* Background blobs */}
      <View style={[s.blob, { top: -50, left: -50, backgroundColor: '#FFD1DC' }]} />
      <View style={[s.blob, { bottom: -50, right: -50, backgroundColor: '#B2EBF2' }]} />

      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backIcon}>←</Text>
        </Pressable>
        <View style={s.titleBox}>
          <Text style={s.title}>Music & Poems 🎶</Text>
          <Text style={s.subtitle}>Listen and Sing Along!</Text>
        </View>
        <Pressable onPress={() => setUseGirlVoice(!useGirlVoice)} style={[s.voiceToggle, useGirlVoice && s.voiceToggleActive]}>
          <Text style={s.voiceEmoji}>{useGirlVoice ? '👧' : '👨'}</Text>
        </Pressable>
      </View>

      {/* Filter Tabs */}
      <View style={s.filterBar}>
        {(['all', 'poem', 'song'] as const).map(f => (
          <Pressable key={f} onPress={() => setFilter(f)} style={[s.tab, filter === f && s.tabActive]}>
            <Text style={[s.tabT, filter === f && s.tabTActive]}>
              {f === 'all' ? 'All' : f === 'poem' ? 'Rhymes' : 'Songs'}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {activeTrack && (
          <PremiumPlayer 
            track={activeTrack} 
            isPlaying={isPlaying} 
            onToggle={() => handleTrackPress(activeTrack)} 
            onClose={stopAll}
            useGirlVoice={useGirlVoice}
          />
        )}

        <View style={s.list}>
          {filtered.map(t => (
            <Pressable 
              key={t.id} 
              onPress={() => handleTrackPress(t)} 
              style={[s.item, { backgroundColor: t.color }, activeId === t.id && { borderColor: t.dark, borderWidth: 3 }]}
            >
              <View style={[s.itemEmojiBox, { backgroundColor: t.dark }]}>
                <Text style={s.itemEmoji}>{t.emoji}</Text>
              </View>
              <View style={s.itemInfo}>
                <Text style={s.itemTitle}>{t.title}</Text>
                <Text style={[s.itemSub, { color: t.dark }]}>{t.type === 'poem' ? 'Rhyme 📖' : 'Song 🎵'}</Text>
              </View>
              {activeId === t.id && isPlaying ? <Waveform color={t.dark} active={true} /> : <Text style={s.playHint}>▶</Text>}
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Floating particles */}
      {isPlaying && [1,2,3,4,5].map(i => <FloatingNote key={i} />)}
    </SafeAreaView>
  );
}

const p = StyleSheet.create({
  card: { marginHorizontal: 20, borderRadius: 40, padding: 24, elevation: 12, shadowOpacity: 0.2, overflow: 'hidden', marginBottom: 20 },
  bg: { ...StyleSheet.absoluteFillObject, opacity: 0.9 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeT: { color: '#fff', fontWeight: '900', fontSize: 12 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.1)', alignItems: 'center', justifyContent: 'center' },
  closeT: { color: '#fff', fontWeight: '900' },
  main: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 20 },
  disk: { width: 100, height: 100, borderRadius: 50, borderWidth: 6, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center', elevation: 8 },
  diskEmoji: { fontSize: 40 },
  diskCenter: { position: 'absolute', width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#fff' },
  info: { flex: 1 },
  title: { fontSize: 24, fontWeight: '900' },
  girlTag: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, backgroundColor: 'rgba(255,255,255,0.4)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  girlTagEmoji: { fontSize: 14 },
  girlTagText: { fontSize: 11, fontWeight: '800', color: '#E91E63' },
  lyricsBox: { maxHeight: 120, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 20, padding: 12 },
  lyricsContent: { alignItems: 'center' },
  lyricLine: { fontSize: 15, fontWeight: '800', lineHeight: 24, textAlign: 'center' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 20 },
  playBtn: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', elevation: 6 },
  playIcon: { fontSize: 28, color: '#fff' },
});

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8F9FF' },
  blob: { position: 'absolute', width: 200, height: 200, borderRadius: 100, opacity: 0.3 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 4 },
  backIcon: { fontSize: 22, fontWeight: '900' },
  titleBox: { flex: 1 },
  title: { fontSize: 24, fontWeight: '900', color: C.ink },
  subtitle: { fontSize: 13, color: C.inkSoft, fontWeight: '700' },
  voiceToggle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E0E7FF', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#C7D2FE' },
  voiceToggleActive: { backgroundColor: '#FFD1DC', borderColor: '#F48FB1' },
  voiceEmoji: { fontSize: 24 },
  filterBar: { flexDirection: 'row', marginHorizontal: 20, gap: 10, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 15, backgroundColor: '#ECEEFB', alignItems: 'center' },
  tabActive: { backgroundColor: '#4F46E5' },
  tabT: { fontSize: 14, fontWeight: '800', color: '#8E94B7' },
  tabTActive: { color: '#fff' },
  scroll: { paddingBottom: 40 },
  list: { paddingHorizontal: 20 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 24, marginBottom: 12, elevation: 2 },
  itemEmojiBox: { width: 50, height: 50, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  itemEmoji: { fontSize: 26 },
  itemInfo: { flex: 1, marginLeft: 14 },
  itemTitle: { fontSize: 17, fontWeight: '900', color: C.ink },
  itemSub: { fontSize: 12, fontWeight: '800', marginTop: 2 },
  playHint: { fontSize: 16, color: 'rgba(0,0,0,0.2)', fontWeight: '900' },
  waveWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 20 },
  waveBar: { width: 4, height: 20, borderRadius: 2 },
  floatingChar: { position: 'absolute', bottom: 100, fontSize: 24, zIndex: 10 },
});
