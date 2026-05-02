import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, Image, Pressable,
  Animated, Dimensions, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { ANIMALS, Animal } from '../components/animals';
import { ScreenProps } from '../navigation/types';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';

const { width: SW } = Dimensions.get('window');

// ─── helpers ────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

let quizQueue: Animal[] = [];
function nextQuizAnimal(): Animal {
  if (quizQueue.length === 0) quizQueue = shuffle([...ANIMALS]);
  return quizQueue.pop()!;
}

function buildOptions(correct: Animal): Animal[] {
  const pool = ANIMALS.filter((a) => a.id !== correct.id);
  return shuffle([correct, ...shuffle(pool).slice(0, 3)]);
}

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

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function AnimalScreen({ navigation }: ScreenProps<'Animals'>) {
  const { addStars } = useProgress();
  const [correct, setCorrect] = useState<Animal>(() => nextQuizAnimal());
  const [options, setOptions] = useState<Animal[]>(() => buildOptions(correct));
  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [round, setRound] = useState(1);
  const [showBurst, setShowBurst] = useState(false);

  const shakeX = useRef(new Animated.Value(0)).current;
  const imgScale = useRef(new Animated.Value(1)).current;
  const imgRotate = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;

  const headerY = useRef(new Animated.Value(-50)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerY, { toValue: 0, useNativeDriver: true, speed: 10, bounciness: 8 }),
      Animated.timing(headerOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    cardScale.setValue(0.85);
    overlayOpacity.setValue(0);
    Animated.spring(cardScale, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 10 }).start();
    
    // Announce the question
    Speech.stop();
    Speech.speak("Which animal is this?", { rate: 0.9, pitch: 1.1 });
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
      setState('correct');
      setShowBurst(true);
      
      // Speak name on correct
      Speech.stop();
      Speech.speak(`Yes! That is a ${correct.name}!`, { rate: 0.9, pitch: 1.1 });

      Animated.sequence([
        Animated.spring(imgScale, { toValue: 1.15, useNativeDriver: true, speed: 20 }),
        Animated.spring(imgScale, { toValue: 1, useNativeDriver: true, speed: 10 }),
      ]).start();
      
      Animated.sequence([
        Animated.timing(overlayOpacity, { toValue: 0.35, duration: 200, useNativeDriver: true }),
        Animated.timing(overlayOpacity, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]).start();

      if (round % 5 === 0) addStars(1);

      setTimeout(nextRound, 2500);
    } else {
      setState('wrong');
      Speech.stop();
      Speech.speak("Oops! Try again!", { rate: 1.0, pitch: 1.0 });

      Animated.sequence([
        Animated.timing(shakeX, { toValue: 14, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: -14, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start(() => {
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
    <SafeAreaView style={s.root}>
      <View style={s.blob1} />
      <View style={s.blob2} />

      <Animated.View style={[s.header, { opacity: headerOpacity, transform: [{ translateY: headerY }] }]}>
        <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backIcon}>←</Text>
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={s.title}>🐾 Animals</Text>
          <Text style={s.subtitle}>Level {Math.ceil(round/5)} • {round} Animals Learnt</Text>
        </View>
        <View style={{ width: 44 }} />
      </Animated.View>

      <ScrollView contentContainerStyle={qz.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={[qz.questionCard, { transform: [{ scale: cardScale }] }]}>
          <Text style={qz.questionTitle}>Which animal is this? 🤔</Text>
          <Animated.View style={[qz.imgWrap, { transform: [{ scale: imgScale }, { rotate }] }]}>
            <Image
              source={typeof correct.image === 'string' ? { uri: correct.image } : correct.image}
              style={qz.questionImg}
            />
            <Animated.View
              style={[qz.flashOverlay, { backgroundColor: '#00C853', opacity: overlayOpacity }]}
              pointerEvents="none"
            />
            {state === 'correct' && (
              <View style={qz.correctBanner}>
                <Text style={qz.correctBannerText}>🎉 {correct.name}!</Text>
                <Text style={qz.correctFact}>{correct.fact}</Text>
              </View>
            )}
          </Animated.View>
        </Animated.View>

        {showBurst && <StarBurst />}

        <Animated.View style={{ transform: [{ translateX: shakeX }] }}>
          <View style={qz.optGrid}>
            {options.map((animal) => (
              <Pressable key={animal.id} style={optionStyle(animal)} onPress={() => handleSelect(animal)}>
                <Image source={typeof animal.image === 'string' ? { uri: animal.image } : animal.image} style={qz.optImg} />
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
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F0F4FF' },
  blob1: { position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: 90, backgroundColor: '#B39DDB22' },
  blob2: { position: 'absolute', top: 100, left: -80, width: 200, height: 200, borderRadius: 100, backgroundColor: '#80DEEA22' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, marginBottom: 6 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4 },
  backIcon: { fontSize: 22, color: C.ink, fontWeight: '700' },
  title: { fontSize: 26, fontWeight: '900', color: C.ink },
  subtitle: { fontSize: 12, color: C.inkSoft, marginTop: 1, fontWeight: '600' },
});

const qz = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingBottom: 30 },
  questionCard: { backgroundColor: '#fff', borderRadius: 28, overflow: 'hidden', marginBottom: 16, elevation: 7, shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10 },
  questionTitle: { fontSize: 19, fontWeight: '900', color: C.ink, textAlign: 'center', paddingTop: 16, paddingBottom: 10 },
  imgWrap: { width: '100%', height: 230, position: 'relative' },
  questionImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  flashOverlay: { ...StyleSheet.absoluteFillObject },
  correctBanner: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,200,83,0.88)', paddingVertical: 12, alignItems: 'center' },
  correctBannerText: { fontSize: 22, fontWeight: '900', color: '#fff' },
  correctFact: { fontSize: 13, color: '#E8F5E9', marginTop: 2, fontWeight: '600' },
  optGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optBtn: { width: (SW - 42) / 2, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderRadius: 20, borderWidth: 2.5, borderColor: '#E8EAF6', paddingHorizontal: 14, paddingVertical: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 },
  optCorrect: { backgroundColor: '#E8F5E9', borderColor: '#00C853' },
  optWrong: { backgroundColor: '#FFEBEE', borderColor: '#F44336' },
  optImg: { width: 32, height: 32, borderRadius: 8, resizeMode: 'cover' },
  optName: { flex: 1, fontSize: 16, fontWeight: '800', color: C.ink },
  tick: { fontSize: 20 },
  tryAgainTxt: { textAlign: 'center', fontSize: 18, fontWeight: '800', color: C.coral, marginTop: 10, letterSpacing: 0.4 },
});
