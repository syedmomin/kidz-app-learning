import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ScreenProps } from '../navigation/types';

// Import all SVGs from Illustrations
import * as Illustrations from '../components/Illustrations';

const { width } = Dimensions.get('window');

const PALETTE = [
  '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', 
  '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', 
  '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', 
  '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40',
];

// Map the Illustration keys we want to use for coloring
const ASSETS = [
  { id: 'Cat',       Comp: Illustrations.SvgCat },
  { id: 'Dog',       Comp: Illustrations.SvgDog },
  { id: 'Bird',      Comp: Illustrations.SvgBird },
  { id: 'Owl',       Comp: Illustrations.SvgOwl },
  { id: 'Pig',       Comp: Illustrations.SvgPig },
  { id: 'Fish',      Comp: Illustrations.SvgFish },
  { id: 'Car',       Comp: Illustrations.SvgCar },
  { id: 'Rocket',    Comp: Illustrations.SvgRocket },
  { id: 'Train',     Comp: Illustrations.SvgTrain },
  { id: 'Apple',     Comp: Illustrations.SvgApple },
  { id: 'Grape',     Comp: Illustrations.SvgGrape },
  { id: 'Sun',       Comp: Illustrations.SvgSun },
  { id: 'Moon',      Comp: Illustrations.SvgMoon },
  { id: 'Star',      Comp: Illustrations.SvgStar },
  { id: 'Tree',      Comp: Illustrations.SvgTree },
  { id: 'Butterfly', Comp: Illustrations.SvgButterfly },
  { id: 'Rainbow',   Comp: Illustrations.SvgRainbow },
  { id: 'Robot',     Comp: Illustrations.SvgRobot },
  { id: 'Pizza',     Comp: Illustrations.SvgPizza },
  { id: 'Cake',      Comp: Illustrations.SvgCake },
  { id: 'Boat',      Comp: Illustrations.SvgBoat },
  { id: 'Plane',     Comp: Illustrations.SvgPlane },
  { id: 'Flower',    Comp: Illustrations.SvgFlower },
  { id: 'Mushroom',  Comp: Illustrations.SvgMushroom },
  { id: 'Crab',      Comp: Illustrations.SvgCrab },
  { id: 'Whale',     Comp: Illustrations.SvgWhale },
  { id: 'Cactus',    Comp: Illustrations.SvgCactus },
  { id: 'Gift',      Comp: Illustrations.SvgGift },
  { id: 'Helicopter',Comp: Illustrations.SvgHelicopter },
  { id: 'Submarine', Comp: Illustrations.SvgSubmarine },
  { id: 'Ball',      Comp: Illustrations.SvgBall },
  { id: 'Egg',       Comp: Illustrations.SvgEgg },
  { id: 'Jar',       Comp: Illustrations.SvgJar },
  { id: 'Kite',      Comp: Illustrations.SvgKite },
  { id: 'Leaf',      Comp: Illustrations.SvgLeaf },
  { id: 'Nest',      Comp: Illustrations.SvgNest },
  { id: 'Quilt',     Comp: Illustrations.SvgQuilt },
  { id: 'Umbrella',  Comp: Illustrations.SvgUmbrella },
  { id: 'Vase',      Comp: Illustrations.SvgVase },
  { id: 'Watch',     Comp: Illustrations.SvgWatch },
  { id: 'Xylophone', Comp: Illustrations.SvgXylophone },
  { id: 'Yak',       Comp: Illustrations.SvgYak },
  { id: 'Zebra',     Comp: Illustrations.SvgZebra },
  { id: 'Mango',     Comp: Illustrations.SvgMango },
  { id: 'Heart',     Comp: Illustrations.SvgHeart },
  { id: 'Cloud',     Comp: Illustrations.SvgCloud },
  { id: 'Cup',       Comp: Illustrations.SvgCup },
  { id: 'Key',       Comp: Illustrations.SvgKey },
  { id: 'Hat',       Comp: Illustrations.SvgHat },
  { id: 'Sock',      Comp: Illustrations.SvgSock },
  { id: 'Bed',       Comp: Illustrations.SvgBed },
  { id: 'Door',      Comp: Illustrations.SvgDoor },
  { id: 'Ring',      Comp: Illustrations.SvgRing },
  { id: 'Book',      Comp: Illustrations.SvgBook },
];

export default function ColoringScreen({ navigation }: ScreenProps<'Coloring'>) {
  const [selectedColor, setSelectedColor] = useState(PALETTE[0]);
  const [fills, setFills] = useState<{ [assetId: string]: { [partId: string]: string } }>({});
  const [activeAssetIdx, setActiveAssetIdx] = useState(0);

  const activeAsset = ASSETS[activeAssetIdx];

  const handlePartPress = (partId: string) => {
    setFills(prev => ({
      ...prev,
      [activeAsset.id]: {
        ...(prev[activeAsset.id] || {}),
        [partId]: selectedColor
      }
    }));
  };

  return (
    <View style={s.container}>
      <View style={s.bgBlob1} />
      <View style={s.bgBlob2} />

      <SafeAreaView style={s.safe}>
        {/* Header */}
        <View style={s.header}>
          <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
            <BlurView intensity={30} tint="light" style={s.blurBtn}>
              <Ionicons name="chevron-back" size={28} color="#333" />
            </BlurView>
          </Pressable>
          <Text style={s.title}>Coloring Fun</Text>
          <Pressable onPress={() => setFills({})} style={s.resetBtn}>
            <BlurView intensity={30} tint="light" style={s.blurBtn}>
              <Ionicons name="refresh" size={24} color="#333" />
            </BlurView>
          </Pressable>
        </View>

        {/* Canvas Area */}
        <View style={s.canvasContainer}>
          <BlurView intensity={40} tint="light" style={s.canvasBlur}>
            <View style={s.svgWrapper}>
              <activeAsset.Comp 
                isShadow={false} 
                partColors={fills[activeAsset.id] || {}} 
                onPartPress={handlePartPress}
              />
            </View>
          </BlurView>
        </View>

        {/* Asset Selector */}
        <View style={s.selectorContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.selectorScroll}>
            {ASSETS.map((asset, idx) => (
              <Pressable 
                key={asset.id} 
                onPress={() => { setActiveAssetIdx(idx); }}
                style={[s.assetTab, activeAssetIdx === idx && s.activeTab]}
              >
                <View style={s.tabPreview}>
                   <asset.Comp />
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Palette */}
        <View style={s.paletteContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.paletteScroll}>
            {PALETTE.map(color => (
              <Pressable
                key={color}
                onPress={() => setSelectedColor(color)}
                style={[
                  s.colorCircle, 
                  { backgroundColor: color },
                  selectedColor === color && s.selectedColor
                ]}
              >
                {selectedColor === color && (
                  <Ionicons name="checkmark" size={20} color="#fff" />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  bgBlob1: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: '#FFD1DC', top: -50, right: -50, opacity: 0.6 },
  bgBlob2: { position: 'absolute', width: 250, height: 250, borderRadius: 125, backgroundColor: '#E0BBE4', bottom: -50, left: -50, opacity: 0.6 },
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10 },
  backBtn: { width: 50, height: 50, borderRadius: 25, overflow: 'hidden' },
  resetBtn: { width: 50, height: 50, borderRadius: 25, overflow: 'hidden' },
  blurBtn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '900', color: '#333' },
  canvasContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  canvasBlur: { width: width * 0.85, height: width * 0.95, borderRadius: 30, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  svgWrapper: { transform: [{ scale: 1.8 }] },
  paletteContainer: { height: 100, paddingVertical: 10 },
  paletteScroll: { paddingHorizontal: 20, alignItems: 'center' },
  colorCircle: { width: 50, height: 50, borderRadius: 25, marginHorizontal: 8, alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
  selectedColor: { borderWidth: 3, borderColor: '#fff', transform: [{ scale: 1.1 }] },
  selectorContainer: { height: 80, marginBottom: 10 },
  selectorScroll: { paddingHorizontal: 20 },
  assetTab: { width: 60, height: 60, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 5, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  activeTab: { backgroundColor: '#FF99C8', borderWidth: 2, borderColor: '#fff' },
  tabPreview: { transform: [{ scale: 0.3 }] },
});
