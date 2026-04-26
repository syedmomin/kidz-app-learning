import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, Image, Pressable, Animated, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { ANIMALS, Animal } from '../data/animals';
import { ScreenProps } from '../navigation/types';
import { C } from '../theme';
import { useProgress } from '../store/ProgressStore';

const { width: SW } = Dimensions.get('window');
const CARD_W = (SW - 64) / 2;

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

// ─── Sound Hook ────────────────────────────────────────────────────────────

function useAnimalSound() {
  const soundRef = useRef<Audio.Sound | null>(null);

  const play = useCallback(async (source: any) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: true });
      soundRef.current = sound;
    } catch (e) {
      console.log('Sound error:', e);
    }
  }, []);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  return { play };
}

// ─── Main Screen ────────────────────────────────────────────────────────────

export default function SoundMatchScreen({ navigation }: ScreenProps<'SoundMatch'>) {
  const { addStars, playGame } = useProgress();
  const { play } = useAnimalSound();

  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null);
  const [options, setOptions] = useState<Animal[]>([]);
  const [selectedWrong, setSelectedWrong] = useState<string[]>([]);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const correctScale = useRef(new Animated.Value(1)).current;

  const TOTAL_ROUNDS = 50;

  const startRound = useCallback(() => {
    if (round > TOTAL_ROUNDS) {
      setGameOver(true);
      return;
    }
    const animal = nextQuizAnimal();
    setCurrentAnimal(animal);
    setOptions(buildOptions(animal));
    setSelectedWrong([]);
    setIsWon(false);
    
    // Auto-play sound after short delay
    setTimeout(() => {
      play(animal.sound);
    }, 500);
  }, [round, play]);

  useEffect(() => {
    startRound();
  }, []);

  const handleSelect = async (animal: Animal) => {
    if (isWon || selectedWrong.includes(animal.id)) return;
    
    // Play the tapped animal's sound
    play(animal.sound);

    if (animal.id === currentAnimal?.id) {
      // Correct!
      setIsWon(true);
      
      Animated.sequence([
        Animated.timing(correctScale, { toValue: 1.2, duration: 150, useNativeDriver: true }),
        Animated.timing(correctScale, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
      
      setTimeout(() => {
        Speech.speak("Amazing!", { rate: 1.0 });
      }, 1000); // give the animal sound a second to play

      setTimeout(() => {
        setRound((r) => r + 1);
        startRound();
      }, 2500);
    } else {
      // Wrong - shake
      setSelectedWrong(prev => [...prev, animal.id]);
      
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      
      setTimeout(() => {
        Speech.speak("Oops, try again!", { rate: 1.1 });
      }, 1000);
    }
  };

  const handleFinish = () => {
    addStars(3);
    playGame('SoundMatch');
    navigation.replace('Reward', { from: 'SoundMatch', stars: 3 });
  };

  const replaySound = () => {
    if (currentAnimal) play(currentAnimal.sound);
  };

  if (gameOver) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverTitle}>🎉 Great Job!</Text>
          <Text style={styles.scoreText}>You completed all {TOTAL_ROUNDS} sounds!</Text>
          <Pressable style={styles.finishButton} onPress={handleFinish}>
            <Text style={styles.finishButtonText}>Continue</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
      </View>

      {/* Sound Play Button */}
      <View style={styles.soundSection}>
        <Pressable style={styles.soundButton} onPress={replaySound}>
          <Text style={styles.soundEmoji}>🔊</Text>
          <Text style={styles.soundText}>Tap to Hear</Text>
        </Pressable>
      </View>

      {/* Options Grid */}
      <View style={styles.optionsGrid}>
        {options.map((animal) => {
          const isWrong = selectedWrong.includes(animal.id);
          const isCorrect = isWon && animal.id === currentAnimal?.id;
          
          const cardStyle = [
            styles.optionCard,
            isCorrect && styles.optionCardCorrect,
            isWrong && styles.optionCardWrong
          ];

          return (
            <Animated.View
              key={animal.id}
              style={[
                cardStyle,
                isCorrect ? { transform: [{ scale: correctScale }] } : {},
                isWrong ? { transform: [{ translateX: shakeAnim }] } : {},
              ]}
            >
              <Pressable
                style={styles.optionPressable}
                onPress={() => handleSelect(animal)}
                disabled={isWon || isWrong}
              >
                <Image
                  source={animal.image}
                  style={styles.optionImage}
                />
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 8,
  },
  backText: {
    fontSize: 18,
    color: C.ink,
    fontWeight: '600',
  },
  progressContainer: {
    flex: 1,
    marginLeft: 16,
    alignItems: 'center',
  },
  progressBar: {
    width: '80%',
    height: 12,
    backgroundColor: C.yellow,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: C.coral,
    borderRadius: 6,
  },
  progressText: {
    marginTop: 4,
    fontSize: 14,
    color: C.inkSoft,
    fontWeight: '600',
  },
  soundSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  soundButton: {
    backgroundColor: C.blue,
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  soundEmoji: {
    fontSize: 48,
  },
  soundText: {
    marginTop: 8,
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  optionCard: {
    width: CARD_W,
    height: CARD_W + 30,
    backgroundColor: C.paper,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: C.ink,
    overflow: 'hidden',
  },
  optionCardCorrect: {
    width: CARD_W,
    height: CARD_W + 30,
    backgroundColor: C.mint,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: C.mintDeep,
    overflow: 'hidden',
  },
  optionCardWrong: {
    width: CARD_W,
    height: CARD_W + 30,
    backgroundColor: C.coral,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: C.coralDeep,
    overflow: 'hidden',
  },
  optionPressable: {
    flex: 1,
    alignItems: 'center',
  },
  optionImage: {
    width: '100%',
    height: CARD_W - 10,
    resizeMode: 'cover',
  },
  optionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: C.ink,
    marginTop: 8,
    textTransform: 'capitalize',
  },
  nextContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: C.coral,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
  },
  nextText: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameOverTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: C.ink,
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 22,
    color: C.inkSoft,
    marginBottom: 30,
  },
  finishButton: {
    backgroundColor: C.mint,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
  },
  finishButtonText: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
  },
});