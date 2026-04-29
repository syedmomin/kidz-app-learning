import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image, useWindowDimensions, StatusBar } from 'react-native';
import { KButton } from '../components/ui';
import { C } from '../theme';
import type { ScreenProps } from '../navigation/types';

export default function SplashScreen({ navigation }: ScreenProps<'Splash'>) {
  const { width, height } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1.1)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true
      }),
    ]).start();

    // Delay button appearance
    Animated.timing(buttonFadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={s.container}>
      <StatusBar hidden />

      {/* Full-screen Background Image */}
      <Animated.View style={[s.imageContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Image
          source={require('../../assets/images/splash_screen.png')}
          style={[s.image, { width, height }]}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Content Overlay */}
      <View style={s.overlay}>
        <Animated.View style={[s.bottomContent, { opacity: buttonFadeAnim }]}>
          <KButton
            color={C.coral}
            size="md"
            onPress={() => navigation.navigate('Explore')}
            style={s.button}
          >
            🚀  Let's Explore!
          </KButton>
        </Animated.View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 80,
  },
  bottomContent: {
    width: '80%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  }
});

