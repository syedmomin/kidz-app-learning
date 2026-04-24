// src/components/PhoneSafe.tsx
import React, { ReactNode } from 'react';
import { View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../theme';

type Props = { bg?: string; children: ReactNode };

export default function PhoneSafe({ bg = C.cream, children }: Props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content"/>
      <View style={{ flex: 1 }}>{children}</View>
    </SafeAreaView>
  );
}
