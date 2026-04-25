// src/screens/OddOneOutScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import type { ScreenProps } from '../navigation/types';

const TOTAL = 30;

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

type TileState = 'idle' | 'correct' | 'wrong' | 'reveal';

export default function OddOneOutScreen({ navigation }: ScreenProps<'OddOneOut'>) {
  const [idx,    setIdx]    = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score,  setScore]  = useState(0);

  const round     = ROUNDS[idx];
  const orderRef  = useRef<string[]>(shuffle(round.items));
  const shake     = useRef(new Animated.Value(0)).current;
  const slideIn   = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    slideIn.setValue(300);
    Animated.spring(slideIn, { toValue: 0, tension: 55, friction: 11, useNativeDriver: true }).start();
    orderRef.current = shuffle(round.items);
  }, [idx]);

  const doShake = () => Animated.sequence([
    Animated.timing(shake, { toValue: 14,  duration: 55, useNativeDriver: true }),
    Animated.timing(shake, { toValue: -14, duration: 55, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 8,   duration: 55, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 0,   duration: 55, useNativeDriver: true }),
  ]).start();

  const advance = (sc: number) => {
    if (idx + 1 >= TOTAL) {
      navigation.navigate('Reward', { from: 'OddOneOut', stars: sc >= 25 ? 3 : sc >= 18 ? 2 : 1 });
      return;
    }
    setIdx(i => i + 1);
    setPicked(null);
  };

  const pick = (item: string) => {
    if (picked !== null) return;
    setPicked(item);
    if (item === round.odd) {
      const ns = score + 1;
      setScore(ns);
      setTimeout(() => advance(ns), 1200);
    } else {
      doShake();
      setTimeout(() => advance(score), 1600);
    }
  };

  const tileState = (item: string): TileState => {
    if (!picked) return 'idle';
    if (item === picked && item === round.odd) return 'correct';
    if (item === picked && item !== round.odd) return 'wrong';
    if (item === round.odd) return 'reveal';
    return 'idle';
  };

  const tileBg = (st: TileState) =>
    st === 'correct' || st === 'reveal' ? C.mint : st === 'wrong' ? C.coral : '#fff';

  const isCorrect = picked === round.odd;

  return (
    <PhoneSafe bg="#FFFBE6">
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.back}><Text style={s.backT}>←</Text></Pressable>
        <Text style={s.title}>Odd One Out 🤔</Text>
        <View style={s.scorePill}><Text style={s.scoreT}>⭐ {score}</Text></View>
      </View>

      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${(idx / TOTAL) * 100}%` }]}/>
      </View>

      <Text style={s.prompt}>Which one does NOT belong?</Text>

      <Animated.View style={[s.grid, { transform: [{ translateX: slideIn }, { translateX: shake }] }]}>
        {orderRef.current.map(item => {
          const st = tileState(item);
          return (
            <Pressable key={item} onPress={() => pick(item)} disabled={picked !== null}
              style={({ pressed }) => [s.tile, { backgroundColor: tileBg(st), transform: [{ scale: pressed && !picked ? 0.92 : 1 }] }]}>
              <Text style={s.tileEmoji}>{item}</Text>
              {(st === 'correct' || st === 'reveal') && <Text style={s.mark}>✓</Text>}
              {st === 'wrong' && <Text style={s.mark}>✗</Text>}
            </Pressable>
          );
        })}
      </Animated.View>

      {picked && (
        <View style={[s.hintBox, { borderColor: isCorrect ? C.mintDeep : C.coralDeep }]}>
          <Text style={s.hintTitle}>{isCorrect ? '🎉 Correct!' : '❌ Wrong!'}</Text>
          <Text style={s.hintText}>{`${round.odd} is a ${round.oddLabel}.\nThe others are all ${round.category}.`}</Text>
        </View>
      )}
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  header:       { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  back:         { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', borderWidth: 3, borderColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  backT:        { fontSize: 20, fontWeight: '900', color: C.ink },
  title:        { flex: 1, textAlign: 'center', fontWeight: '900', fontSize: 19, color: C.ink },
  scorePill:    { backgroundColor: C.yellow, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 3, borderColor: C.ink },
  scoreT:       { fontWeight: '900', fontSize: 13, color: C.ink },
  progressBar:  { height: 12, marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 7, borderWidth: 3, borderColor: C.ink, overflow: 'hidden', marginBottom: 4 },
  progressFill: { height: '100%', backgroundColor: C.yellow, borderRadius: 5 },
  prompt:       { textAlign: 'center', fontWeight: '900', fontSize: 20, color: C.ink, marginTop: 14, marginBottom: 14 },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14, paddingHorizontal: 20 },
  tile:         { width: 138, height: 138, borderRadius: 26, borderWidth: 4, borderColor: C.ink, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.10, shadowRadius: 6, elevation: 4 },
  tileEmoji:    { fontSize: 58 },
  mark:         { position: 'absolute', top: 8, right: 10, fontSize: 20, fontWeight: '900' },
  hintBox:      { margin: 16, marginTop: 14, backgroundColor: '#fff', borderRadius: 20, borderWidth: 3.5, padding: 14, alignItems: 'center', gap: 4 },
  hintTitle:    { fontSize: 17, fontWeight: '900', color: C.ink },
  hintText:     { fontSize: 13, fontWeight: '700', color: C.inkSoft, textAlign: 'center', lineHeight: 20 },
});
