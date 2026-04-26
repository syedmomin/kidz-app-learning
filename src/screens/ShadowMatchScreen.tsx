import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';
import * as Speech from 'expo-speech';
import PhoneSafe from '../components/PhoneSafe';
import { C } from '../theme';
import GameHeader from '../components/GameHeader';
import type { ScreenProps } from '../navigation/types';

import { 
  SvgCat, SvgSun, SvgApple, SvgBall, SvgStar, 
  SvgTree, SvgMoon, SvgCar, SvgFish, SvgHouse,
  SvgHeart, SvgCloud, SvgCup, SvgKey, SvgHat,
  SvgSock, SvgLeaf, SvgIce, SvgBed, SvgDoor, SvgRing
} from '../components/Illustrations';

const TOTAL = 100;
const { width } = Dimensions.get('window');

interface ItemDef { id: string; name: string; render: (isShadow?: boolean) => React.ReactNode }

const ITEMS: ItemDef[] = [
  { id: 'cat',   name: 'Cat',   render: (s) => <SvgCat isShadow={s} /> },
  { id: 'sun',   name: 'Sun',   render: (s) => <SvgSun isShadow={s} /> },
  { id: 'apple', name: 'Apple', render: (s) => <SvgApple isShadow={s} /> },
  { id: 'ball',  name: 'Ball',  render: (s) => <SvgBall isShadow={s} /> },
  { id: 'star',  name: 'Star',  render: (s) => <SvgStar isShadow={s} /> },
  { id: 'tree',  name: 'Tree',  render: (s) => <SvgTree isShadow={s} /> },
  { id: 'moon',  name: 'Moon',  render: (s) => <SvgMoon isShadow={s} /> },
  { id: 'car',   name: 'Car',   render: (s) => <SvgCar isShadow={s} /> },
  { id: 'fish',  name: 'Fish',  render: (s) => <SvgFish isShadow={s} /> },
  { id: 'house', name: 'House', render: (s) => <SvgHouse isShadow={s} /> },
  { id: 'heart', name: 'Heart', render: (s) => <SvgHeart isShadow={s} /> },
  { id: 'cloud', name: 'Cloud', render: (s) => <SvgCloud isShadow={s} /> },
  { id: 'cup',   name: 'Cup',   render: (s) => <SvgCup isShadow={s} /> },
  { id: 'key',   name: 'Key',   render: (s) => <SvgKey isShadow={s} /> },
  { id: 'hat',   name: 'Hat',   render: (s) => <SvgHat isShadow={s} /> },
  { id: 'sock',  name: 'Sock',  render: (s) => <SvgSock isShadow={s} /> },
  { id: 'leaf',  name: 'Leaf',  render: (s) => <SvgLeaf isShadow={s} /> },
  { id: 'ice',   name: 'Ice Cream', render: (s) => <SvgIce isShadow={s} /> },
  { id: 'bed',   name: 'Bed',   render: (s) => <SvgBed isShadow={s} /> },
  { id: 'door',  name: 'Door',  render: (s) => <SvgDoor isShadow={s} /> },
  { id: 'ring',  name: 'Ring',  render: (s) => <SvgRing isShadow={s} /> },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function buildRounds() {
  const rounds = [];
  while (rounds.length < TOTAL) {
    const pool = shuffle([...ITEMS]);
    const target = pool[0];
    const options = shuffle([pool[0], pool[1], pool[2]]);
    rounds.push({ target, options });
  }
  return rounds;
}

const ROUNDS = buildRounds();

const OptionCard = ({ item, isWrong, onPress, disabled }: { item: ItemDef, isWrong: boolean, onPress: () => void, disabled: boolean }) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isWrong) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [isWrong]);

  return (
    <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
      <Pressable onPress={onPress} disabled={disabled} style={({pressed}) => [
        s.optionCard, 
        isWrong && { backgroundColor: '#FFCDD2', borderColor: '#E53935' },
        { transform: [{ scale: pressed && !disabled ? 0.95 : 1 }] }
      ]}>
        <View style={{ transform: [{ scale: 0.6 }] }}>
          {item.render(false)}
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default function ShadowMatchScreen({ navigation }: ScreenProps<'ShadowMatch'>) {
  const [idx, setIdx] = useState(0);
  const [pickedWrong, setPickedWrong] = useState<string[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [score, setScore] = useState(0);

  const round = ROUNDS[idx];
  const scaleAnim = useRef(new Animated.Value(0.1)).current;
  const slideIn = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    slideIn.setValue(300);
    scaleAnim.setValue(0.1);
    Animated.parallel([
      Animated.spring(slideIn, { toValue: 0, tension: 60, friction: 12, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 10, useNativeDriver: true })
    ]).start();

    Speech.stop();
    Speech.speak("Who's hiding in the shadow?", { rate: 1.0 });
  }, [idx]);

  const advance = () => {
    if (idx + 1 >= TOTAL) {
      navigation.navigate('Reward', { from: 'ShadowMatch', stars: 3 });
      return;
    }
    setIdx(i => i + 1);
    setPickedWrong([]);
    setIsWon(false);
  };

  const pick = (item: ItemDef) => {
    if (isWon || pickedWrong.includes(item.id)) return;
    
    if (item.id === round.target.id) {
      setScore(s => s + 1);
      setIsWon(true);
      
      scaleAnim.setValue(0.8);
      Animated.spring(scaleAnim, { toValue: 1.3, friction: 3, useNativeDriver: true }).start();

      Speech.stop();
      Speech.speak(`Amazing! It's a ${item.name}!`, { rate: 1.0 });
      setTimeout(() => advance(), 3500);
    } else {
      setPickedWrong([...pickedWrong, item.id]);
      Speech.stop();
      Speech.speak("Oops, try again!", { rate: 1.1 });
    }
  };

  return (
    <PhoneSafe bg="#1A237E">
      <GameHeader onBack={() => navigation.goBack()} title="Shadow Match 🌒" score={score} titleColor="#fff" />

      <Text style={s.prompt}>Who is hiding?</Text>

      <View style={s.stageContainer}>
        <Animated.View style={[s.stage, { transform: [{ scale: scaleAnim }] }]}>
          {/* Render Shadow if playing, render Colored SVG if won! */}
          <View style={{ transform: [{ scale: 1.2 }] }}>
            {round.target.render(!isWon)}
          </View>
        </Animated.View>
      </View>

      <Animated.View style={[s.optionsContainer, { transform: [{ translateY: slideIn }] }]}>
        {round.options.map(item => (
          <OptionCard 
            key={item.id}
            item={item}
            isWrong={pickedWrong.includes(item.id)}
            onPress={() => pick(item)}
            disabled={isWon || pickedWrong.includes(item.id)}
          />
        ))}
      </Animated.View>
      
      {isWon && (
        <View style={s.winOverlay} pointerEvents="none">
          <Text style={s.winText}>🎉 {round.target.name}! 🎉</Text>
        </View>
      )}
    </PhoneSafe>
  );
}

const s = StyleSheet.create({
  prompt:       { textAlign: 'center', fontWeight: '900', fontSize: 26, color: '#FFF', marginTop: 10, marginBottom: 20, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  
  stageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  stage: {
    width: 260, height: 260, borderRadius: 130,
    backgroundColor: '#E8EAF6',
    borderWidth: 8, borderColor: '#5C6BC0',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#FFF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 15
  },

  optionsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 15, paddingBottom: 40, paddingHorizontal: 20 },
  optionCard: {
    width: 100, height: 100, borderRadius: 20,
    backgroundColor: '#FFF', borderWidth: 4, borderColor: '#C5CAE9',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 8
  },

  winOverlay: { position: 'absolute', top: '25%', left: 0, right: 0, alignItems: 'center' },
  winText: { fontSize: 40, fontWeight: '900', color: '#FFF', textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 5 }
});
