import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, Pressable,
  ActivityIndicator, Animated, Dimensions, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { ANIMALS, Animal } from '../data/animals';
import { ScreenProps } from '../navigation/types';
import { C } from '../theme';

const { width: SW } = Dimensions.get('window');
const CARD_W = (SW - 48) / 2;

// ─── helpers ────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Keeps a running shuffled queue so every animal appears before repeating
let quizQueue: Animal[] = [];
function nextQuizAnimal(): Animal {
  if (quizQueue.length === 0) quizQueue = shuffle([...ANIMALS]);
  return quizQueue.pop()!;
}

function buildOptions(correct: Animal): Animal[] {
  const pool = ANIMALS.filter((a) => a.id !== correct.id);
  return shuffle([correct, ...shuffle(pool).slice(0, 3)]);
}

// ─── useSound hook ───────────────────────────────────────────────────────────

function useSound() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const play = useCallback(async (source: any, id: string) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setPlayingId(id);
      const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: true });
      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) setPlayingId(null);
      });
    } catch {
      setPlayingId(null);
    }
  }, []);

  const speak = useCallback((animal: Animal) => {
    Speech.stop();
    // Say name first, then fun fact after a short pause
    Speech.speak(animal.name, {
      rate: 0.82,
      pitch: 1.25,
      onDone: () => {
        setTimeout(() => {
          Speech.speak(animal.fact, { rate: 0.8, pitch: 1.1 });
        }, 300);
      },
    });
  }, []);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
      Speech.stop();
    };
  }, []);

  return { play, speak, playingId };
}

// ─── Tab Bar ─────────────────────────────────────────────────────────────────

function TabBar({ active, onChange }: { active: 'quiz' | 'gallery'; onChange: (t: 'quiz' | 'gallery') => void }) {
  const slide = useRef(new Animated.Value(active === 'quiz' ? 0 : 1)).current;
  const handleChange = (tab: 'quiz' | 'gallery') => {
    Animated.spring(slide, { toValue: tab === 'quiz' ? 0 : 1, useNativeDriver: true, speed: 20, bounciness: 6 }).start();
    onChange(tab);
  };
  const translateX = slide.interpolate({ inputRange: [0, 1], outputRange: [0, (SW - 32) / 2] });
  return (
    <View style={tb.outer}>
      <Animated.View style={[tb.pill, { transform: [{ translateX }] }]} />
      <Pressable style={tb.tab} onPress={() => handleChange('quiz')}>
        <Text style={[tb.label, active === 'quiz' && tb.labelActive]}>🎯  Quiz</Text>
      </Pressable>
      <Pressable style={tb.tab} onPress={() => handleChange('gallery')}>
        <Text style={[tb.label, active === 'gallery' && tb.labelActive]}>🖼  Gallery</Text>
      </Pressable>
    </View>
  );
}
const tb = StyleSheet.create({
  outer: {
    flexDirection: 'row', marginHorizontal: 16, marginBottom: 14,
    backgroundColor: '#E8EDF8', borderRadius: 18, padding: 4, position: 'relative',
  },
  pill: {
    position: 'absolute', top: 4, left: 4,
    width: (SW - 40) / 2, height: '100%',
    backgroundColor: '#fff', borderRadius: 15,
    elevation: 4, shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6,
  },
  tab: { flex: 1, paddingVertical: 11, alignItems: 'center' },
  label: { fontSize: 15, fontWeight: '700', color: '#9AA5C4' },
  labelActive: { color: C.ink },
});

// ─── Bouncing Stars (celebration) ────────────────────────────────────────────

function StarBurst() {
  const stars = ['⭐', '🌟', '✨', '💫', '🎉'];
  const anims = useRef(stars.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(80, anims.map((a) =>
      Animated.spring(a, { toValue: 1, useNativeDriver: true, speed: 8, bounciness: 18 })
    )).start();
  }, []);

  return (
    <View style={st.wrap} pointerEvents="none">
      {stars.map((s, i) => {
        const angle = (i / stars.length) * 2 * Math.PI;
        const tx = anims[i].interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(angle) * 70] });
        const ty = anims[i].interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(angle) * 70] });
        const sc = anims[i].interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1.4, 1] });
        return (
          <Animated.Text key={i} style={[st.star, { transform: [{ translateX: tx }, { translateY: ty }, { scale: sc }] }]}>
            {s}
          </Animated.Text>
        );
      })}
    </View>
  );
}
const st = StyleSheet.create({
  wrap: { position: 'absolute', top: '40%', left: '45%', zIndex: 99 },
  star: { position: 'absolute', fontSize: 26 },
});

// ─── Gallery Card ─────────────────────────────────────────────────────────────

function GalleryCard({ item, playing, onPress }: { item: Animal; playing: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (playing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.06, duration: 400, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulse.stopAnimation();
      Animated.spring(pulse, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
    }
  }, [playing]);

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, speed: 60 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }, { scale: pulse }] }}>
      <Pressable onPress={handlePress}>
        <View style={[gc.card, playing && { borderColor: item.color, borderWidth: 3 }]}>
          <View style={[gc.imgWrap, { backgroundColor: item.bgGradient[0] }]}>
            <Image
              source={typeof item.image === 'string' ? { uri: item.image } : item.image}
              style={gc.img}
            />
            {playing && (
              <View style={gc.overlay}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={gc.playTxt}>🎵</Text>
              </View>
            )}
          </View>
          <View style={[gc.footer, { backgroundColor: item.bgGradient[0] + 'AA' }]}>
            <Text style={gc.emoji}>{item.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={gc.name}>{item.name}</Text>
              <Text style={gc.fact} numberOfLines={1}>{item.fact}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
const gc = StyleSheet.create({
  card: {
    width: CARD_W, margin: 8, borderRadius: 22, overflow: 'hidden',
    backgroundColor: '#fff', borderWidth: 2, borderColor: 'transparent',
    elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 6,
  },
  imgWrap: { width: '100%', height: 130 },
  img: { width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center', justifyContent: 'center', gap: 4,
  },
  playTxt: { fontSize: 20 },
  footer: { padding: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
  emoji: { fontSize: 22 },
  name: { fontSize: 13, fontWeight: '900', color: C.ink },
  fact: { fontSize: 10, color: C.inkSoft, marginTop: 1 },
});

// ─── Quiz Mode ────────────────────────────────────────────────────────────────

type AnswerState = 'idle' | 'correct' | 'wrong';

function QuizMode({ play, speak }: {
  play: (source: any, id: string) => Promise<void>;
  speak: (animal: Animal) => void;
}) {
  const [correct, setCorrect] = useState<Animal>(() => nextQuizAnimal());
  const [options, setOptions] = useState<Animal[]>(() => buildOptions(correct));
  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState] = useState<AnswerState>('idle');
  const [round, setRound] = useState(1);
  const [showBurst, setShowBurst] = useState(false);

  const shakeX = useRef(new Animated.Value(0)).current;
  const imgScale = useRef(new Animated.Value(1)).current;
  const imgRotate = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;

  // Animate question card in when round changes
  useEffect(() => {
    cardScale.setValue(0.85);
    overlayOpacity.setValue(0);
    Animated.spring(cardScale, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 10 }).start();
  }, [round]);

  const nextRound = useCallback(() => {
    const next = nextQuizAnimal();
    setCorrect(next);
    setOptions(buildOptions(next));
    setSelected(null);
    setState('idle');
    setShowBurst(false);
    setRound((r) => r + 1);
    imgScale.setValue(1);
    imgRotate.setValue(0);
  }, []);

  const handleSelect = async (animal: Animal) => {
    if (state !== 'idle') return;
    setSelected(animal.id);

    if (animal.id === correct.id) {
      // ✅ Correct
      setState('correct');
      setShowBurst(true);

      // Play local sound asset then speak the animal name + fun fact
      play(correct.sound, correct.id);
      speak(correct);

      // Bounce + wiggle image
      Animated.sequence([
        Animated.spring(imgScale, { toValue: 1.15, useNativeDriver: true, speed: 20 }),
        Animated.spring(imgScale, { toValue: 1, useNativeDriver: true, speed: 10 }),
      ]).start();
      Animated.sequence([
        Animated.timing(imgRotate, { toValue: 1, duration: 100, useNativeDriver: true }),
        Animated.timing(imgRotate, { toValue: -1, duration: 100, useNativeDriver: true }),
        Animated.timing(imgRotate, { toValue: 0.5, duration: 100, useNativeDriver: true }),
        Animated.timing(imgRotate, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();

      // Show green overlay flash
      Animated.sequence([
        Animated.timing(overlayOpacity, { toValue: 0.35, duration: 200, useNativeDriver: true }),
        Animated.timing(overlayOpacity, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]).start();

      // Auto-advance to next animal after celebration
      setTimeout(nextRound, 2000);
    } else {
      // ❌ Wrong — shake, reset, try again (same animal)
      setState('wrong');

      Animated.sequence([
        Animated.timing(shakeX, { toValue: 14, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: -14, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: 10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: -10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start(() => {
        // Reset after shake so kid can try again
        setTimeout(() => {
          setSelected(null);
          setState('idle');
        }, 600);
      });
    }
  };

  const rotate = imgRotate.interpolate({ inputRange: [-1, 1], outputRange: ['-8deg', '8deg'] });

  const optionStyle = (animal: Animal): object => {
    if (state === 'idle' || selected !== animal.id && state !== 'correct') return qz.optBtn;
    if (animal.id === correct.id) return [qz.optBtn, qz.optCorrect];
    if (animal.id === selected) return [qz.optBtn, qz.optWrong];
    return qz.optBtn;
  };

  return (
    <ScrollView contentContainerStyle={qz.container} showsVerticalScrollIndicator={false}>
      {/* Question card */}
      <Animated.View style={[qz.questionCard, { transform: [{ scale: cardScale }] }]}>
        <Text style={qz.questionTitle}>Which animal is this? 🤔</Text>
        <Animated.View style={[qz.imgWrap, { transform: [{ scale: imgScale }, { rotate }] }]}>
          <Image
            source={typeof correct.image === 'string' ? { uri: correct.image } : correct.image}
            style={qz.questionImg}
          />
          {/* Green flash overlay on correct */}
          <Animated.View
            style={[qz.flashOverlay, { backgroundColor: '#00C853', opacity: overlayOpacity }]}
            pointerEvents="none"
          />
          {/* Correct result banner */}
          {state === 'correct' && (
            <View style={qz.correctBanner}>
              <Text style={qz.correctBannerText}>🎉 {correct.name}!</Text>
              <Text style={qz.correctFact}>{correct.fact}</Text>
            </View>
          )}
        </Animated.View>

      </Animated.View>

      {/* Star burst on correct */}
      {showBurst && <StarBurst />}

      {/* Options */}
      <Animated.View style={{ transform: [{ translateX: shakeX }] }}>
        <View style={qz.optGrid}>
          {options.map((animal) => (
            <Pressable key={animal.id} style={optionStyle(animal)} onPress={() => handleSelect(animal)}>
              <Text style={qz.optEmoji}>{animal.emoji}</Text>
              <Text style={qz.optName}>{animal.name}</Text>
              {state === 'correct' && animal.id === correct.id && <Text style={qz.tick}>✅</Text>}
              {state === 'wrong' && animal.id === selected && <Text style={qz.tick}>❌</Text>}
            </Pressable>
          ))}
        </View>
      </Animated.View>

      {state === 'wrong' && (
        <Text style={qz.tryAgainTxt}>Try again! 💪</Text>
      )}
    </ScrollView>
  );
}

const qz = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingBottom: 30 },
  questionCard: {
    backgroundColor: '#fff', borderRadius: 28, overflow: 'hidden', marginBottom: 16,
    elevation: 7, shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10,
  },
  questionTitle: {
    fontSize: 19, fontWeight: '900', color: C.ink, textAlign: 'center',
    paddingTop: 16, paddingBottom: 10,
  },
  imgWrap: { width: '100%', height: 230, position: 'relative' },
  questionImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  flashOverlay: { ...StyleSheet.absoluteFillObject },
  correctBanner: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,200,83,0.88)', paddingVertical: 12, alignItems: 'center',
  },
  correctBannerText: { fontSize: 22, fontWeight: '900', color: '#fff' },
  correctFact: { fontSize: 13, color: '#E8F5E9', marginTop: 2, fontWeight: '600' },
  optGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optBtn: {
    width: (SW - 42) / 2, flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', borderRadius: 20, borderWidth: 2.5, borderColor: '#E8EAF6',
    paddingHorizontal: 14, paddingVertical: 16,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4,
  },
  optCorrect: { backgroundColor: '#E8F5E9', borderColor: '#00C853' },
  optWrong: { backgroundColor: '#FFEBEE', borderColor: '#F44336' },
  optEmoji: { fontSize: 28 },
  optName: { flex: 1, fontSize: 16, fontWeight: '800', color: C.ink },
  tick: { fontSize: 20 },
  tryAgainTxt: {
    textAlign: 'center', fontSize: 18, fontWeight: '800', color: C.coral,
    marginTop: 10, letterSpacing: 0.4,
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function AnimalScreen({ navigation }: ScreenProps<'Animals'>) {
  // Quiz is the default tab
  const [mode, setMode] = useState<'quiz' | 'gallery'>('quiz');
  const { play, speak, playingId } = useSound();
  const headerY = useRef(new Animated.Value(-50)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerY, { toValue: 0, useNativeDriver: true, speed: 10, bounciness: 8 }),
      Animated.timing(headerOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={s.root}>
      {/* Decorative background blobs */}
      <View style={s.blob1} />
      <View style={s.blob2} />

      {/* Header */}
      <Animated.View style={[s.header, { opacity: headerOpacity, transform: [{ translateY: headerY }] }]}>
        <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backIcon}>←</Text>
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={s.title}>🐾 Animals</Text>
          <Text style={s.subtitle}>{ANIMALS.length} amazing animals!</Text>
        </View>
        <View style={{ width: 44 }} />
      </Animated.View>

      {/* Tab bar — Quiz first, Gallery second */}
      <TabBar active={mode} onChange={setMode} />

      {/* Content */}
      {mode === 'quiz' ? (
        <QuizMode play={play} speak={speak} />
      ) : (
        <FlatList
          data={ANIMALS}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <GalleryCard
              item={item}
              playing={playingId === item.id}
              onPress={() => play(item.sound, item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F0F4FF' },
  blob1: {
    position: 'absolute', top: -60, right: -60,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: '#B39DDB22',
  },
  blob2: {
    position: 'absolute', top: 100, left: -80,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: '#80DEEA22',
  },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, marginBottom: 6,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4,
  },
  backIcon: { fontSize: 22, color: C.ink, fontWeight: '700' },
  title: { fontSize: 26, fontWeight: '900', color: C.ink },
  subtitle: { fontSize: 12, color: C.inkSoft, marginTop: 1, fontWeight: '600' },
  list: { paddingHorizontal: 8, paddingBottom: 30 },
});
