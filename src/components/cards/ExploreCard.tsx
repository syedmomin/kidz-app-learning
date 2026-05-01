import React from 'react';
import { Pressable, View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { BlurView } from 'expo-blur';
import { C } from '../../theme';

interface ExploreCardProps {
  onPress: () => void;
  image: ImageSourcePropType;
  title: string;
  glassColor: string;
}

export default function ExploreCard({ onPress, image, title, glassColor }: ExploreCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.card,
        { transform: [{ scale: pressed ? 0.96 : 1 }] }
      ]}
    >
      <BlurView intensity={60} tint="light" style={s.blur}>
        <View style={[s.glassBase, { backgroundColor: glassColor + '40' }]}>
          <View style={s.imgWrapper}>
            <Image source={image} style={s.img} />
          </View>
          <View style={s.footer}>
            <Text style={s.title}>{title}</Text>
          </View>
        </View>
      </BlurView>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    height: 160,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  blur: {
    flex: 1,
  },
  glassBase: {
    flex: 1,
    padding: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imgWrapper: {
    width: 150,
    height: 150,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
    borderRadius: 20,
  },
  footer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 4,
    borderRadius: 10,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: '900',
    color: '#333',
    textAlign: 'center',
  },
});




