// src/screens/OddOneOutScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import type { ScreenProps } from '../navigation/types';

const TOTAL = 100;

interface Round { items: string[]; odd: string; category: string; oddLabel: string }

const POOL: Round[] = [
  { items: ['🐱','🐶','🦁','🍎'],   odd: '🍎',  category: 'Animals',     oddLabel: 'Fruit'        },
  { items: ['🍎','🍌','🍇','🚗'],   odd: '🚗',  category: 'Fruits',      oddLabel: 'Vehicle'      },
  { items: ['🚗','🚌','✈️','🎸'],   odd: '🎸',  category: 'Vehicles',    oddLabel: 'Instrument'   },
  { items: ['🎵','🎹','🥁','🍕'],   odd: '🍕',  category: 'Music',       oddLabel: 'Food'         },
  { items: ['🌧️','☀️','⛄','🎒'],  odd: '🎒',  category: 'Weather',     oddLabel: 'School item'  },
  { items: ['📚','✏️','📐','🐦'],  odd: '🐦',  category: 'School',      oddLabel: 'Animal'       },
  { items: ['🍕','🍔','🌮','🎈'],   odd: '🎈',  category: 'Foods',       oddLabel: 'Toy'          },
  { items: ['🏀','⚽','🎾','🍓'],   odd: '🍓',  category: 'Sports',      oddLabel: 'Fruit'        },
  { items: ['🌹','🌸','🌻','🐢'],   odd: '🐢',  category: 'Flowers',     oddLabel: 'Animal'       },
  { items: ['🔴','🔵','🟢','🐸'],   odd: '🐸',  category: 'Colors',      oddLabel: 'Animal'       },
  { items: ['1️⃣','2️⃣','3️⃣','🌸'], odd: '🌸', category: 'Numbers',     oddLabel: 'Flower'       },
  { items: ['🍦','🎂','🍩','🔑'],   odd: '🔑',  category: 'Sweets',      oddLabel: 'Object'       },
  { items: ['🐮','🐷','🐔','🚂'],   odd: '🚂',  category: 'Farm Animals', oddLabel: 'Vehicle'     },
  { items: ['🍊','🍋','🍉','🎺'],   odd: '🎺',  category: 'Fruits',      oddLabel: 'Instrument'   },
  { items: ['🚂','🚢','🚁','🐬'],   odd: '🐬',  category: 'Transport',   oddLabel: 'Animal'       },
  { items: ['👒','🧤','🧣','🍄'],   odd: '🍄',  category: 'Clothes',     oddLabel: 'Plant'        },
  { items: ['⚽','🏈','🎱','🍪'],   odd: '🍪',  category: 'Balls',       oddLabel: 'Food'         },
  { items: ['🌍','🌏','🌎','🍦'],   odd: '🍦',  category: 'Planets/Globes', oddLabel: 'Food'      },
  { items: ['🎩','👑','🎓','🥕'],   odd: '🥕',  category: 'Hats',        oddLabel: 'Vegetable'    },
  { items: ['🐠','🐟','🦈','🌵'],   odd: '🌵',  category: 'Fish',        oddLabel: 'Plant'        },
  { items: ['🌴','🌲','🌳','🚀'],   odd: '🚀',  category: 'Trees',       oddLabel: 'Vehicle'      },
  { items: ['🍇','🍒','🍑','🎻'],   odd: '🎻',  category: 'Fruits',      oddLabel: 'Instrument'   },
  { items: ['🐘','🦏','🦛','🌺'],   odd: '🌺',  category: 'Big Animals', oddLabel: 'Flower'       },
  { items: ['🎮','🕹️','👾','🍋'],  odd: '🍋',  category: 'Gaming',      oddLabel: 'Fruit'        },
  { items: ['🥦','🥕','🌽','🎠'],   odd: '🎠',  category: 'Vegetables',  oddLabel: 'Ride'         },
  { items: ['🦜','🦚','🦩','🔭'],   odd: '🔭',  category: 'Birds',       oddLabel: 'Tool'         },
  { items: ['🍰','🧁','🍮','🔒'],   odd: '🔒',  category: 'Desserts',    oddLabel: 'Object'       },
  { items: ['🚒','🚑','🚓','🍩'],   odd: '🍩',  category: 'Emergency Vehicles', oddLabel: 'Food'  },
  { items: ['🎨','✏️','🖌️','🐊'], odd: '🐊',  category: 'Art Tools',   oddLabel: 'Animal'       },
  { items: ['⭐','🌙','☀️','🥾'],   odd: '🥾',  category: 'Sky objects', oddLabel: 'Footwear'     },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function buildRounds(): Round[] {
  const result: Round[] = [];
  while (result.length < TOTAL) result.push(...shuffle(POOL));
  return result.slice(0, TOTAL);
}

const ROUNDS = buildRounds();

// ─── Screen ───────────────────────────────────────────────────────────────────

import { useAudio } from '../hooks/useAudio';

type TileState = 'idle' | 'correct' | 'wrong' | 'hidden';

const BubbleTile = ({ item, state, onPress, disabled }: { item: string, state: TileState, onPress: () => void, disabled: boolean }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = Math.random() * 800;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 12, duration: 1500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: -12, duration: 1500, useNativeDriver: true }),
      ])
    );
    const timer = setTimeout(() => loop.start(), delay);
    return () => { clearTimeout(timer); loop.stop(); };
  }, []);

  useEffect(() => {
    if (state === 'wrong') {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 15, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -15, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
      Animated.spring(scaleAnim, { toValue: 0.85, useNativeDriver: true }).start();
    } else if (state === 'correct') {
      Animated.spring(scaleAnim, { toValue: 1.6, friction: 4, useNativeDriver: true }).start();
    } else if (state === 'hidden') {
      Animated.timing(scaleAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    } else {
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    }
  }, [state]);

  const bg = state === 'wrong' ? '#E0E0E0' : (state === 'correct' ? '#69F0AE' : '#FFF');
  const opacity = state === 'hidden' ? 0 : 1;

  return (
    <Animated.View style={[s.bubbleWrapper, { opacity, transform: [{ translateY: floatAnim }, { translateX: shakeAnim }, { scale: scaleAnim }] }]}>
      <Pressable onPress={onPress} disabled={disabled} style={({pressed}) => [
        s.bubble, 
        { backgroundColor: bg, transform: [{ scale: pressed && !disabled ? 0.9 : 1 }] }
      ]}>
        <Text style={s.bubbleEmoji}>{item}</Text>
      </Pressable>
    </Animated.View>
  );
};

export default function OddOneOutScreen({ navigation }: ScreenProps<'OddOneOut'>) {
  const { playSound } = useAudio();
  const [idx,    setIdx]    = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score,  setScore]  = useState(0);

  const round     = ROUNDS[idx];
  const orderRef  = useRef<string[]>(shuffle(round.items));
  const slideIn   = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    slideIn.setValue(300);
    Animated.spring(slideIn, { toValue: 0, tension: 55, friction: 11, useNativeDriver: true }).start();
    orderRef.current = shuffle(round.items);
    Speech.stop();
    Speech.speak('Someone is hiding! Who does not belong?', { rate: 1.0 });
  }, [idx]);

  const advance = () => {
    if (idx + 1 >= TOTAL) {
      navigation.navigate('Reward', { from: 'OddOneOut', stars: 3 });
      return;
    }
    setIdx(i => i + 1);
    setPicked(null);
  };

  const pick = (item: string) => {
    if (picked !== null) return;
    setPicked(item);
    
    if (item === round.odd) {
      playSound(require('../../assets/sounds/lion.mp3')); // Using lion as success
      setScore(s => s + 1);
      Speech.stop();
      Speech.speak(`Amazing! The ${item} is a ${round.oddLabel}, the others are ${round.category}`, { rate: 1.0 });
      setTimeout(() => advance(), 3500);
    } else {
      playSound(require('../../assets/sounds/monkey.mp3')); // Using monkey as error boing
      Speech.stop();
      Speech.speak(`Oops! Try again.`, { rate: 1.1 });
      setTimeout(() => setPicked(null), 1500);
    }
  };

  const tileState = (item: string): TileState => {
    if (!picked) return 'idle';
    if (picked === round.odd) {
      return item === round.odd ? 'correct' : 'hidden';
    } else {
      return item === picked ? 'wrong' : 'idle';
    }
  };

  const isCorrect = picked === round.odd;

  return (
    <PhoneSafe bg="#E1F5FE">
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}><Text style={s.backT}>←</Text></Pressable>
        <Text style={s.title}>Odd One Out 🕵️</Text>
        <View style={s.scorePill}><Text style={s.scoreT}>⭐ {score}</Text></View>
      </View>

      <Text style={s.prompt}>Who does NOT belong?</Text>

      <Animated.View style={[s.grid, { transform: [{ translateY: slideIn }] }]}>
        {orderRef.current.map(item => (
          <BubbleTile 
            key={item} 
            item={item} 
            state={tileState(item)} 
            onPress={() => pick(item)} 
            disabled={picked !== null} 
          />
        ))}
      </Animated.View>

      {picked && isCorrect && (
        <Animated.View style={s.hintBox}>
          <Text style={s.hintTitle}>🎉 Brilliant!</Text>
          <Text style={s.hintText}>{`${round.odd} is a ${round.oddLabel}.\nThe others are all ${round.category}.`}</Text>
        </Animated.View>
      )}
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  header:       { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  back:         { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', elevation: 4, alignItems: 'center', justifyContent: 'center' },
  backT:        { fontSize: 22, fontWeight: '900', color: C.ink },
  title:        { flex: 1, textAlign: 'center', fontWeight: '900', fontSize: 22, color: C.ink },
  scorePill:    { backgroundColor: '#FFE566', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 6, elevation: 4 },
  scoreT:       { fontWeight: '900', fontSize: 16, color: C.ink },
  prompt:       { textAlign: 'center', fontWeight: '900', fontSize: 24, color: C.ink, marginTop: 10, marginBottom: 20, textShadowColor: 'rgba(0,0,0,0.1)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 3 },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20, paddingHorizontal: 20, marginTop: 20 },
  bubbleWrapper:{ width: 140, height: 140, alignItems: 'center', justifyContent: 'center' },
  bubble:       { width: 140, height: 140, borderRadius: 70, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#03A9F4', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 10, borderWidth: 4, borderColor: 'rgba(255,255,255,0.8)' },
  bubbleEmoji:  { fontSize: 65, textShadowColor: 'rgba(0,0,0,0.1)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 5 },
  hintBox:      { margin: 20, marginTop: 40, backgroundColor: '#fff', borderRadius: 24, padding: 18, alignItems: 'center', gap: 6, elevation: 10, shadowColor: '#00C853', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 8, borderWidth: 2, borderColor: '#69F0AE' },
  hintTitle:    { fontSize: 22, fontWeight: '900', color: '#00C853' },
  hintText:     { fontSize: 16, fontWeight: '700', color: C.inkSoft, textAlign: 'center', lineHeight: 24 },
});
