import { useState, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';
import { calcStars } from '../utils';

const { width: SW } = Dimensions.get('window');

interface Options {
  total: number;
  from: string;
  navigation: { navigate: (screen: string, params: object) => void };
}

export function useGameScreen<T = string>({ total, from, navigation }: Options) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<T | null>(null);
  const [score, setScore] = useState(0);

  const shake = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(SW)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const triggerSlideIn = () => {
    slideIn.setValue(SW);
    Animated.spring(slideIn, { toValue: 0, damping: 15, stiffness: 90, useNativeDriver: true }).start();
  };

  const doShake = () => Animated.sequence([
    Animated.timing(shake, { toValue: 15,  duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: -15, duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 10,  duration: 60, useNativeDriver: true }),
    Animated.timing(shake, { toValue: 0,   duration: 60, useNativeDriver: true }),
  ]).start();

  const doBounce = (ref?: Animated.Value) => {
    const target = ref ?? bounceAnim;
    Animated.sequence([
      Animated.spring(target, { toValue: 1.2, tension: 200, friction: 5, useNativeDriver: true }),
      Animated.spring(target, { toValue: 1,   tension: 200, friction: 8, useNativeDriver: true }),
    ]).start();
  };

  const addScore = () => setScore(s => s + 1);

  const advance = () => {
    if (idx + 1 >= total) {
      navigation.navigate('Reward', { from, stars: calcStars(score + 1, total) });
      return;
    }
    setIdx(i => i + 1);
    setPicked(null);
  };

  return { idx, picked, setPicked, score, addScore, shake, slideIn, bounceAnim, triggerSlideIn, doShake, doBounce, advance };
}
