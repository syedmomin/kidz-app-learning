import React from 'react';
import { Pressable, View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { BlurView } from 'expo-blur';
import { C } from '../../theme';

interface ExploreCardProps {
  onPress: () => void;
  image: ImageSourcePropType;
  title: string;
  backgroundColor?: string;
  isNew?: boolean;
}

export default function ExploreCard({ onPress, image, title, backgroundColor = 'rgba(255, 255, 255, 0.4)', isNew }: ExploreCardProps) {
  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        s.card, 
        { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] }
      ]}
    >
      <BlurView intensity={60} tint="light" style={s.blur}>
        {isNew && (
          <View style={s.newBadge}>
            <Text style={s.newT}>NEW</Text>
          </View>
        )}
        <View style={[s.imgBox, { backgroundColor }]}>
          <Image source={image} style={s.img} />
        </View>
        <View style={s.footer}>
          <Text style={s.name}>{title}</Text>
        </View>
      </BlurView>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { 
    borderRadius: 24, 
    overflow: 'hidden', 
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    borderWidth: 1.5, 
    borderColor: 'rgba(255, 255, 255, 0.5)', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 20, 
    elevation: 5 
  },
  blur: {
    flex: 1,
  },
  imgBox: { 
    height: 130, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    margin: 6,
    overflow: 'hidden',
  },
  img: { 
    width: '90%', 
    height: '90%', 
    resizeMode: 'contain' 
  },
  footer: { 
    paddingHorizontal: 12, 
    paddingVertical: 12, 
    alignItems: 'center',
  },
  name: { 
    fontWeight: '900', 
    fontSize: 16, 
    color: C.ink,
    textAlign: 'center'
  },
  newBadge: { 
    position: 'absolute', 
    top: 12, 
    right: 12, 
    zIndex: 10, 
    backgroundColor: C.coral, 
    borderRadius: 999, 
    paddingHorizontal: 10, 
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  newT: { 
    color: '#fff', 
    fontWeight: '900', 
    fontSize: 10 
  },
});

