// src/components/Icons.tsx
import React from 'react';
import { Text, View } from 'react-native';
import { C } from '../theme';

type StarProps = { size?: number; color?: string };
export function Star({ size = 24 }: StarProps) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: size * 0.8 }}>⭐</Text>
    </View>
  );
}

type CoinProps = { size?: number };
export function Coin({ size = 24 }: CoinProps) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: size * 0.8 }}>🪙</Text>
    </View>
  );
}
