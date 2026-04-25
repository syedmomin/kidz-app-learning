import { useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';

export function useAudio() {
  const soundRef = useRef<Audio.Sound | null>(null);

  const playSound = useCallback(async (source: any) => {
    try {
      // Stop and unload previous sound if playing
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: true });
      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          soundRef.current = null;
        }
      });
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }, []);

  const stopSound = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  return { playSound, stopSound };
}
