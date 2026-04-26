import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, Image, Pressable, Animated, Dimensions, Easing,
} from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import GameHeader from '../components/GameHeader';
import { ANIMALS, type Animal } from '../components/animals';
import { ScreenProps } from '../navigation/types';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';

const { width: SW, height: SH } = Dimensions.get('window');
const CARD_W = (SW - 56) / 2;

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

// ─── Sound Hook ────────────────────────────────────────────────────────────

function useAnimalSound() {
  const soundRef = useRef<Audio.Sound | null>(null);

  const play = useCallback(async (animal: Animal) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      if (!animal.sound) {
        Speech.stop();
        Speech.speak(animal.name, { rate: 1.0, pitch: 1.2 });
        return;
      }
      const { sound } = await Audio.Sound.createAsync(animal.sound, { shouldPlay: true });
      soundRef.current = sound;
    } catch (e) {
      console.log('Sound error:', e);
    }
  }, []);

  useEffect(() => {
    return () => { soundRef.current?.unloadAsync(); };
  }, []);

  return { play };
}

// ─── Floating bubble (decoration) ───────────────────────────────────────────

function FloatingBubble({ left, size, delay, emoji }: { left: number; size: number; delay: number; emoji: string }) {
  const y = useRef(new Animated.Value(SH + 50)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(y, { toValue: -80, duration: 9000 + Math.random() * 4000, easing: Easing.linear, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(opacity, { toValue: 0.55, duration: 600, useNativeDriver: true }),
            Animated.delay(7000),
            Animated.timing(opacity, { toValue: 0, duration: 600, useNativeDriver: true }),
          ]),
        ]),
        Animated.timing(y, { toValue: SH + 50, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.Text style={[fb.bubble, { left, fontSize: size, opacity, transform: [{ translateY: y }] }]}>
      {emoji}
    </Animated.Text>
  );
}
const fb = StyleSheet.create({
  bubble: { position: 'absolute', zIndex: 0 },
});

// ─── Confetti particle ──────────────────────────────────────────────────────

function Particle({ color, x, y }: { color: string; x: number; y: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 1100, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, []);
  const tx = anim.interpolate({ inputRange: [0, 1], outputRange: [0, (Math.random() - 0.5) * 280] });
  const ty = anim.interpolate({ inputRange: [0, 1], outputRange: [0, (Math.random() - 0.5) * 320] });
  const rot = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${Math.random() * 540}deg`] });
  const op = anim.interpolate({ inputRange: [0, 0.85, 1], outputRange: [1, 1, 0] });
  const sc = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.3] });
  return (
    <Animated.View style={[pp.dot, {
      backgroundColor: color, left: x, top: y,
      transform: [{ translateX: tx }, { translateY: ty }, { rotate: rot }, { scale: sc }],
      opacity: op,
    }]} />
  );
}
const pp = StyleSheet.create({
  dot: { position: 'absolute', width: 12, height: 12, borderRadius: 3, zIndex: 200 },
});

// ─── Animal Option Card ─────────────────────────────────────────────────────

function OptionCard({ animal, status, onPress }: {
  animal: Animal;
  status: 'idle' | 'wrong' | 'correct' | 'dim';
  onPress: () => void;
}) {
  const shake = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (status === 'wrong') {
      Animated.sequence([
        Animated.timing(shake, { toValue: 12, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -12, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 8, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
    if (status === 'correct') {
      Animated.sequence([
        Animated.spring(scale, { toValue: 1.12, tension: 200, friction: 5, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }),
      ]).start();
    }
  }, [status]);

  const ringColor = status === 'correct' ? '#2E7D32'
                  : status === 'wrong'   ? C.coralDeep
                  : animal.color;
  const cardBg   = status === 'correct' ? '#C8F5C2'
                  : status === 'wrong'   ? '#FFD0D0'
                  : '#fff';
  const dimmed   = status === 'dim';

  return (
    <Animated.View style={{
      transform: [{ translateX: shake }, { scale }],
      opacity: dimmed ? Animated.multiply(opacity, 0.45) : opacity,
    }}>
      <Pressable
        onPress={onPress}
        disabled={status !== 'idle'}
        style={[oc.card, { backgroundColor: cardBg, borderColor: ringColor }]}
      >
        <View style={[oc.imgWrap, { backgroundColor: animal.color + '22' }]}>
          <Image source={animal.image} style={oc.img} />
        </View>
        <Text style={oc.name}>{animal.name}</Text>
        {status === 'correct' && (
          <View style={oc.tickBadge}><Text style={oc.tickT}>✓</Text></View>
        )}
        {status === 'wrong' && (
          <View style={[oc.tickBadge, { backgroundColor: C.coral }]}><Text style={oc.tickT}>✗</Text></View>
        )}
      </Pressable>
    </Animated.View>
  );
}
const oc = StyleSheet.create({
  card: {
    width: CARD_W, height: CARD_W + 36,
    borderRadius: 26, borderWidth: 4,
    alignItems: 'center', justifyContent: 'flex-start',
    paddingTop: 10, paddingBottom: 8,
    elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 6,
  },
  imgWrap: {
    width: CARD_W - 26, height: CARD_W - 26,
    borderRadius: 18, alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  img: { width: '100%', height: '100%', resizeMode: 'cover' },
  name: { fontSize: 18, fontWeight: '900', color: C.ink, marginTop: 6, textTransform: 'capitalize' },
  tickBadge: {
    position: 'absolute', top: -10, right: -10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#2E7D32', alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#fff', elevation: 6,
  },
  tickT: { color: '#fff', fontWeight: '900', fontSize: 18 },
});

// ─── Main Screen ────────────────────────────────────────────────────────────

const TOTAL_ROUNDS = 200;

export default function SoundMatchScreen({ navigation }: ScreenProps<'SoundMatch'>) {
  const { addStars, playGame } = useProgress();
  const { play } = useAnimalSound();

  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null);
  const [options, setOptions]             = useState<Animal[]>([]);
  const [wrongIds, setWrongIds]           = useState<string[]>([]);
  const [round, setRound]                 = useState(1);
  const [score, setScore]                 = useState(0);
  const [isWon, setIsWon]                 = useState(false);
  const [particles, setParticles]         = useState<{ id: number; color: string; x: number; y: number }[]>([]);

  const speakerPulse = useRef(new Animated.Value(1)).current;
  const speakerWaveA = useRef(new Animated.Value(0)).current;
  const speakerWaveB = useRef(new Animated.Value(0)).current;
  const factSlide    = useRef(new Animated.Value(60)).current;
  const factOpacity  = useRef(new Animated.Value(0)).current;

  // Continuous pulse on the speaker
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.spring(speakerPulse, { toValue: 1.08, tension: 140, friction: 5, useNativeDriver: true }),
      Animated.spring(speakerPulse, { toValue: 1,     tension: 140, friction: 6, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);

  const animateWaves = useCallback(() => {
    speakerWaveA.setValue(0);
    speakerWaveB.setValue(0);
    Animated.stagger(220, [
      Animated.timing(speakerWaveA, { toValue: 1, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(speakerWaveB, { toValue: 1, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, []);

  const startRound = useCallback(() => {
    const animal = nextQuizAnimal();
    setCurrentAnimal(animal);
    setOptions(buildOptions(animal));
    setWrongIds([]);
    setIsWon(false);
    setParticles([]);
    factSlide.setValue(60);
    factOpacity.setValue(0);

    setTimeout(() => {
      play(animal);
      animateWaves();
    }, 450);
  }, [play, animateWaves]);

  useEffect(() => { startRound(); }, []);

  const replaySound = () => {
    if (!currentAnimal) return;
    play(currentAnimal);
    animateWaves();
  };

  const handleSelect = (animal: Animal) => {
    if (isWon || !currentAnimal || wrongIds.includes(animal.id)) return;

    if (animal.id === currentAnimal.id) {
      setIsWon(true);
      setScore(s => s + 1);

      // Confetti shower
      const colors = ['#FFD93D', '#FF6B6B', '#4ECDC4', '#A78BFA', '#7BE0AD', '#FFB75E'];
      setParticles(Array.from({ length: 22 }).map((_, i) => ({
        id: Date.now() + i,
        color: colors[i % colors.length],
        x: SW / 2 + (Math.random() - 0.5) * 80,
        y: SH / 2 - 80,
      })));

      // Slide in fact
      Animated.parallel([
        Animated.spring(factSlide, { toValue: 0, tension: 80, friction: 9, useNativeDriver: true }),
        Animated.timing(factOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      ]).start();

      play(animal);
      setTimeout(() => Speech.speak(`Yes! It's a ${animal.name}!`, { rate: 1.0, pitch: 1.15 }), 900);

      setTimeout(() => {
        if (round >= TOTAL_ROUNDS) {
          addStars(3);
          playGame('SoundMatch');
          navigation.replace('Reward', { from: 'SoundMatch', stars: 3 });
        } else {
          setRound(r => r + 1);
          startRound();
        }
      }, 2800);
    } else {
      setWrongIds(prev => [...prev, animal.id]);
      Speech.stop();
      Speech.speak(`Oops! Listen again!`, { rate: 1.05, pitch: 1.1 });
      setTimeout(() => play(currentAnimal), 800);
    }
  };

  if (!currentAnimal) {
    return <PhoneSafe bg="#A0E7FF"><View /></PhoneSafe>;
  }

  const waveScale = (a: Animated.Value) => a.interpolate({ inputRange: [0, 1], outputRange: [0.6, 2.4] });
  const waveOp    = (a: Animated.Value) => a.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0.6, 0.2, 0] });

  return (
    <PhoneSafe bg="#A0E7FF">
      {/* Decorative bubbles in the background */}
      <FloatingBubble left={SW * 0.1}  size={28} delay={0}    emoji="🎵" />
      <FloatingBubble left={SW * 0.85} size={24} delay={2200} emoji="🎶" />
      <FloatingBubble left={SW * 0.45} size={32} delay={4500} emoji="✨" />
      <FloatingBubble left={SW * 0.7}  size={26} delay={6800} emoji="🎵" />
      <FloatingBubble left={SW * 0.2}  size={22} delay={9000} emoji="🎶" />

      <GameHeader
        onBack={() => navigation.goBack()}
        title="Listen & Match! 🔊"
        score={score}
        scoreBg="#FFD93D"
      />

      {/* Speaker stage */}
      <View style={s.stage}>
        <Animated.View style={[s.wave, { transform: [{ scale: waveScale(speakerWaveA) }], opacity: waveOp(speakerWaveA) }]} />
        <Animated.View style={[s.wave, { transform: [{ scale: waveScale(speakerWaveB) }], opacity: waveOp(speakerWaveB) }]} />

        <Animated.View style={{ transform: [{ scale: speakerPulse }] }}>
          <Pressable onPress={replaySound} style={s.speakerBtn}>
            <Text style={s.speakerEmoji}>🔊</Text>
          </Pressable>
        </Animated.View>

        <Text style={s.tapHint}>Tap the speaker to hear again</Text>
      </View>

      {/* Options */}
      <View style={s.optionsGrid}>
        {options.map(animal => {
          const status: 'idle' | 'wrong' | 'correct' | 'dim' =
            isWon
              ? (animal.id === currentAnimal.id ? 'correct' : 'dim')
              : wrongIds.includes(animal.id) ? 'wrong' : 'idle';
          return (
            <OptionCard
              key={animal.id}
              animal={animal}
              status={status}
              onPress={() => handleSelect(animal)}
            />
          );
        })}
      </View>

      {/* Win banner with fun fact */}
      {isWon && (
        <Animated.View
          style={[s.factBanner, { transform: [{ translateY: factSlide }], opacity: factOpacity }]}
          pointerEvents="none"
        >
          <Text style={s.factTitle}>🎉 {currentAnimal.name}!</Text>
          <Text style={s.factText}>{currentAnimal.fact}</Text>
        </Animated.View>
      )}

      {/* Confetti */}
      {particles.map(p => (
        <Particle key={p.id} color={p.color} x={p.x} y={p.y} />
      ))}
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  stage:      { alignItems: 'center', justifyContent: 'center', height: 200, marginTop: 4, marginBottom: 10 },
  wave:       {
    position: 'absolute',
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 4, borderColor: '#fff',
  },
  speakerBtn: {
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: '#FF8DC7',
    alignItems: 'center', justifyContent: 'center',
    elevation: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 10,
    borderWidth: 5, borderColor: '#fff',
  },
  speakerEmoji: { fontSize: 64 },
  tapHint:    { marginTop: 14, fontSize: 14, fontWeight: '700', color: C.ink, opacity: 0.75 },

  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14, paddingHorizontal: 16, marginTop: 6 },

  factBanner: {
    position: 'absolute', left: 24, right: 24, bottom: 32,
    backgroundColor: '#fff', borderRadius: 22,
    paddingVertical: 14, paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10,
    borderWidth: 4, borderColor: '#FFD93D',
  },
  factTitle: { fontSize: 24, fontWeight: '900', color: C.ink },
  factText:  { fontSize: 15, fontWeight: '700', color: C.inkSoft, marginTop: 2, textAlign: 'center' },
});
